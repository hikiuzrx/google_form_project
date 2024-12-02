import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";

import InfiniteScrollForms from "@/components/RecentForms";
import { authOptions } from "../api/auth/[...nextauth]/route";
async function FormPage() {
     const session = await getServerSession(authOptions)
     return ( <>
          {session &&  ( <>
           <div className="text-2xl text-custom1">Recent Forms
          <InfiniteScrollForms session={session} />
     </div>
     <div className="text-2xl text-amber-600">Create new Form</div></>)}
     {!session && (<>
     
     <div>
          <h2 className="text-3xl text-gray-800 text-center">YOU DON'T HAVE ACCESS TO THIS PAGE</h2>
     </div>
          </>)}
     </> );
}

 
export default FormPage;