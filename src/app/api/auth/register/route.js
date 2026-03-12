import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "@/src/lib/dbConnect";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        const userCollection = await connect("users");
        const user = await userCollection.findOne({ email });

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        // ✅ এখান থেকে ডাটা রিটার্ন করলে তা JWT টোকেনে যাবে
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // ১. JWT টোকেনে ডাটা ঢুকানো
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    // ২. সেশনে টোকেন থেকে ডাটা পাস করা (এটিই Navbar এ দেখাবে)
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };