// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
    };
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires :number
    error?: string;
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    email?: string;
    name?: string;
  }

  interface JWT {
    
    username: string | undefined;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    name?: string;
    email?: string;
    error?: string;
  }
  interface formCardProps {
    title :string 
    date : Date 
  }
  interface forms{
    formId: number;
    title: string;
    dateCreation: Date;
    ownerId: number;
    typRId?: number;
  }
}
