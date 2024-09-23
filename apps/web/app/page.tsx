"use client"
import { signIn, signOut } from "next-auth/react";

export default function Home() {
  

  return (
    <>
    
        <button onClick={() => signOut()}>
          Sign in with Google
        </button>
      
    </>
  );
}

