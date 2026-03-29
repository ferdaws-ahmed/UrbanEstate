import { adminAuth } from "@/src/lib/firebase-admin-config";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "@/src/lib/dbConnect";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const { idToken, role } = credentials;

        if (!adminAuth) {
          console.error("Firebase Admin SDK is not initialized.");
          return null;
        }

        try {
          const decodedToken = await adminAuth.verifyIdToken(idToken);

          if (decodedToken) {
            // Fetch additional user info from MongoDB
            let mongoUser = null;
            try {
              const userCollection = await connect("users");
              mongoUser = await userCollection.findOne({ uid: decodedToken.uid });
              
              // If user doesn't exist in MongoDB but has a valid Firebase token, create them
              if (!mongoUser) {
                const newUser = {
                  uid: decodedToken.uid,
                  email: decodedToken.email,
                  name: decodedToken.name || "",
                  image: decodedToken.picture || "",
                  role: role || "user",
                  createdAt: new Date(),
                  updatedAt: new Date()
                };
                await userCollection.insertOne(newUser);
                mongoUser = newUser;
              }
            } catch (dbError) {
              console.error("MongoDB Fetch Error in Authorize:", dbError);
            }

            return {
              id: mongoUser?.uid || mongoUser?._id?.toString() || decodedToken.uid,
              email: decodedToken.email,
              name: mongoUser?.name || decodedToken.name || "",
              image: mongoUser?.image || decodedToken.picture || "",
              role: mongoUser?.role || role || "user",
            };
          }
          return null;
        } catch (error) {
          console.error("NextAuth Authorize Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
        token.image = user.image;
      }
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.image = session.user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };