'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { existsSync } from 'fs';
import Link from 'next/link';

const RegisterForm: React.FC = () => {
    const router = useRouter();
    const [exists,setExists] = useState<boolean>(false)

    // State for form inputs
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    });

    // State for error messages
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    });

    // State for successful registration
    const [register, setRegister] = useState(false);
    const [userData, setUserData] = useState({ username: '', email: '' });

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error on change
    };

    // Validate input fields
    const validateInputs = () => {
        const newErrors = { ...errors };
        let isValid = true;

        // Check if any field is empty
        Object.entries(formData).forEach(([key, value]) => {
            if (!value) {
                newErrors[key as keyof typeof newErrors] = `${key} is required.`;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    // Handle sign-up
    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateInputs()) {
            return; // Exit if validation fails
        }

        const res = await fetch('http://localhost:8000/auth/local/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (res.ok) {
            // Successful registration
            if(data.userExists){
               setExists(true)
            }
            setRegister(true);
            setUserData({ username: data.username, email: data.email });

            // Redirect to home page after 5 seconds
            setTimeout(() => router.push('/'), 5000);
        } else {
            // Set error messages based on backend response
            setErrors((prevErrors) => ({
                firstName: data.message.includes('first name') ? data.message : prevErrors.firstName,
                lastName: data.message.includes('last name') ? data.message : prevErrors.lastName,
                username: data.message.includes('username') ? data.message : prevErrors.username,
                email: data.message.includes('email') ? data.message : prevErrors.email,
                password: data.message.includes('password') ? data.message : prevErrors.password,
            }));

            // Handle specific error messages for password strength and email validation
            if (data.message.includes('Missing')) {
                const passwordErrors = data.message.split(': ')[1];
                if (passwordErrors) {
                    const conditions = passwordErrors.split(', ');
                    conditions.forEach((condition: any) => {
                        if (condition.includes('Missing')) {
                            setErrors((prevErrors) => ({
                                ...prevErrors,
                                password: condition,
                            }));
                        }
                    });
                }
            }

            console.error('Error signing up:', data.message);
        }
    };

    return (
        <div className="flex text-gray-800 items-center justify-center min-h-screen bg-gray-100">
          {exists?(<><p className='text-gray-800'>username / email is already linked to a hollow account try to <Link className='text-custom1' href={'/auth/login'}></Link></p></>):<></>}
            <form
                className="bg-white p-6 rounded shadow-md w-80"
                onSubmit={handleSignUp}
            >
                <h2 className="text-lg font-bold mb-4">Register</h2>

                {register && !exists && (
                    <div className="mb-4 text-green-500">
                        Registration successful! Redirecting...
                    </div>
                )}

               {!register && (<>
                    <div className="mb-4">
                    <label htmlFor="firstName" className="block mb-1">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`border p-2 w-full ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="lastName" className="block mb-1">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`border p-2 w-full ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="username" className="block mb-1">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`border p-2 w-full ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`border p-2 w-full ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`border p-2 w-full ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">
                    Register
                </button></>)}
            </form>
        </div>
    );
};

export default RegisterForm;
