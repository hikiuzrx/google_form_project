'use client'
import React from "react"
import Navbar from "./NavBar"
import { SessionProvider } from "next-auth/react"
export default function LayoutHeading(){
     return(
          <SessionProvider>
          <Navbar/>
          </SessionProvider>
     )
}