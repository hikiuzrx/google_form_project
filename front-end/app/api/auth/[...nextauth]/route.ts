import NextAuth, { Account, Awaitable, JWT, NextAuthOptions, Profile, Session, User } from "next-auth";
import Google from "next-auth/providers/google";
import  CredentialsProvider  from "next-auth/providers/credentials";
import { configDotenv } from "dotenv";
import isTokenExpired, { getTokenExpiration } from "@/actions/refreshToken";
configDotenv()

interface CustomSession extends Session {
  accessToken?: string;
  refreshToken?: string;
}



console.log(process.env.NEXT_PUBLIC_CLIENT_ID)
console.log(process.env.NEXT_PUBLIC_CLIENT_SECRET)


// Helper function to add a timeout to fetch
const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const fetchOptions = { ...options, signal: controller.signal };
  
  try {
    const response = await fetch(url, fetchOptions);
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const authOptions: NextAuthOptions = {
  jwt: {
    maxAge: 60 * 60 * 24, // 24h
  },
  session :{
    strategy:'jwt'
  },
  providers: [
    Google({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
        },
      },
    }),
    CredentialsProvider({
      name: 'Hollow Account',
      credentials: {
       
        identifier: { label: 'identifier', type: 'text', placeholder: 'username / email' },
        password: { label: 'Password', type: 'password', placeholder: '********' },
        
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }
      
        try {
          console.log('here');
          console.log(credentials);
      
          const response = await fetchWithTimeout('http://localhost:8000/auth/local/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              identifier: credentials.identifier!,
              password: credentials.password
            })
          }, 15000);
      
          if (!response.ok) {
            throw new Error("request failed " + response.status);
          }
      
          // Assuming backend returns user with refreshToken and accessToken
          const user = await response.json();
      
          // Check if login was successful
          if (user.accesstoken && user.refreshToken) {
            // Return the user object containing tokens and user data
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              accessToken: user.accesstoken,
              refreshToken: user.refreshToken
            };
          }
      
          return null;
      
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXT_PUBLIC_SECRET as string,
  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider === 'google') {
        try {
          const response = await fetchWithTimeout('http://localhost:8000/auth/google/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: user.name,
              email: user.email,
              method: 'google',
            }),
          }, 15000); // Timeout of 15 seconds
    
          if (!response.ok) {
            const errorMessage = await response.json();
            console.error('Google login request failed:', errorMessage);
            return false;
          }
    
          const result = await response.json();
    
          // Ensure the backend response has the required tokens
          if (result?.success === true && result.accesstoken && result.refreshToken) {
            // Store the tokens in the session for later use in the `jwt` callback
            user.accessToken = result.accesstoken;
            user.refreshToken = result.refreshToken;
            return true;
          }
    
          console.error('Unexpected login response:', result);
          return false;
    
        } catch (error) {
          console.error('Error during Google login:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({token,user,account}){
      if(user){
        console.log(user)
        token.email = user.email
        token.name = user.name
        token.expires = getTokenExpiration(user.accessToken as string)
       
        let expired: boolean = isTokenExpired(user.accessToken as string)
        if(expired){
         try {
          let response = await fetchWithTimeout('http://localhost:8000/auth/get-refresh',{
            method :'GET',
            body:JSON.stringify(token.refreshToken)
          },15000)
          if(response.ok){
            const data  = await response.json()
            token.accessToken = data.accessToken
            token.refreshToken = data.refreshToken
          }else{
            throw new Error("couldn't refresh token")
          }
         } catch (error:any) {
          console.error(error.message)
         }
        }
        
      }
      console.log(token)
      return token
    },
    async session({ session, user, token }) {
      console.log(session)
      session.user.email = token.email?token.email :" "
      session.user.name = token.name?token.name : " "
      session.accessToken  =  token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.accessTokenExpires = token.expires as number
      return session
    },
    }
 
};

const handler = NextAuth(authOptions)

export {handler as GET , handler as POST}


