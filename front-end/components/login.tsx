'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import google from '../public/google-logo.png';
import { register } from 'module';

export default function LoginForm() {
  const [userData, setUserData] = useState({ username: '', email: '' });
  const [identifier, setIdentifier] = useState(''); // Can be username or email
  const [password, setPassword] = useState('');
  const [loggedIn,setLoggedIn] = useState<boolean>(false)
  let router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const credentials = {
       identifier, // Accepts either username or email
      password,
    };
    console.log(credentials)

    const result = await signIn('credentials', {
      redirect: false, // Prevent redirect for debugging purposes
      ...credentials,
    })
    ;

    if (result?.error) {
      console.error('Login failed:', result.error);
    } else {
      localStorage.setItem('refreshToken','')
      setLoggedIn(true)
      setTimeout(()=>{
        router.push('/')
      },5000)
      console.log('Success:', result);
      // Handle successful login (e.g., redirect)
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {loggedIn && (<>
      <p>welcome back ${userData.username}</p>
      </>)}
    {!loggedIn && (<>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg shadow-gray-500 backdrop-blur-xl px-12 pt-8 pb-10 mb-6 max-w-lg w-full"
      >
        <h2 className="text-5xl font-bold mb-8 text-gray-800 text-center">Login</h2>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-lg font-bold mb-3"
            htmlFor="identifier"
          >
            Username or Email
          </label>
          <input
            type="text"
            id="identifier"
            name='identifer'
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter username or email"
            required
          />
        </div>

        <div className="mb-8">
          <label
            className="block text-gray-700 text-lg font-bold mb-3"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="flex items-center justify-center mb-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 w-1/2 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline text-lg"
          >
            Login
          </button>
        </div>

        <div className="flex items-center my-2 justify-center">
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 flex gap-x-2 rounded focus:outline-none focus:shadow-outline text-lg"
          >
            <p className="text-nowrap">Login with Google</p>
            <Image
              src={google}
              alt="Google logo"
              className="inline rounded-full"
              width={25}
            />
          </button>
        </div>
      </form>
      </>)}
    </div>
  );
}
