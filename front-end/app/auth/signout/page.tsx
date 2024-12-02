import React from "react";
import SignOut from "@/components/Logout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function logout(){
     const session =await getServerSession(authOptions)
     if(!session){
          redirect('/auth/login')
     }
     return(
          <>
               <SignOut/>
          </>
     )
}
