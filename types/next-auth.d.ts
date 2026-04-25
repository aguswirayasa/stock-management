import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      username: string;
      role: "ADMIN" | "PEGAWAI";
      isActive: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    name: string;
    username: string;
    role: "ADMIN" | "PEGAWAI";
    isActive: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    username: string;
    role: "ADMIN" | "PEGAWAI";
    isActive: boolean;
  }
}
