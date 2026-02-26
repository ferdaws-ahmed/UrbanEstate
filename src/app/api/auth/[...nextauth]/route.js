import { adminAuth } from "@/src/lib/firebase-admin-config";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const { idToken, role } = credentials;

        // Safety Check: বিল্ড টাইমে adminAuth না থাকলে এরর আটকাবে
        if (!adminAuth) {
          console.error("Firebase Admin SDK is not initialized. Check your Environment Variables.");
          return null;
        }

        try {
          // Verify the Firebase ID Token using Admin SDK
          const decodedToken = await adminAuth.verifyIdToken(idToken);

          if (decodedToken) {
            return {
              id: decodedToken.uid,
              email: decodedToken.email,
              name: decodedToken.name || "",
              image: decodedToken.picture || "",
              role: role, // 'user' or 'seller'
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
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };