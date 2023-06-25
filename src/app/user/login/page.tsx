'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleLoginButtonJs from '@/common/component/googlebuttonjs';
import GoogleLoginButtonHtml from '@/common/component/googlebuttonhtml';

const LoginPage: React.FC = () => {

  const router = useRouter();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };


  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleGotoRegister = () => {
    router.push('/user/register');
  }

  const handleLogin = () => {

    const url = "/api/user/login";
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        password: password,
      }),
    };

    console.log(`login POST name: ${name}, password: ${password}`);

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.code === 0) {
          // router.refresh();
          // redirect to todolist page
          router.push(`/biz/todolist?${Math.random().toString()}`);
        } else {
          setSuggestion(data.message);
          console.log(`Login failed: ${data.message}`);
        }
      });


    // Perform registration logic here
    // You can send the data to an API or handle it as per your requirement
    console.log('Login submitted');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="flex justify-between">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
            onClick={handleLogin}
          >
            Login
          </button>
          <button
            className="text-blue-500 underline focus:outline-none focus:ring focus:border-blue-300"
            onClick={handleGotoRegister}
          >
            Go to Register
          </button>
        </div>
      </div>
      <div>
        <GoogleLoginButtonJs />
      </div>
      <div>
        <GoogleLoginButtonHtml />
      </div>
    </div>
  );
};

export default LoginPage;

