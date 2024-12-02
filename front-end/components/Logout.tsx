'use client'
// pages/signout.tsx
import { useEffect } from 'react';
import { signOut } from 'next-auth/react'; // Importing the signOut function from NextAuth

const SignOut = () => {
  useEffect(() => {
    const handleSignOut = async () => {
      await signOut({ callbackUrl: '/' }); // Redirect to homepage after sign-out
    };

    handleSignOut();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl text-gray-800">Signing you out...</h1>
      <p className="mt-4 text-gray-800">Please wait a moment.</p>
    </div>
  );
};

export default SignOut;
