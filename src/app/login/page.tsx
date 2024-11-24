'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (document.cookie.includes('isAuthenticated=true')) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (email === 'admin@gmail.com' && password === 'Jk@123') {
        document.cookie = 'isAuthenticated=true';
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-xs md:text-lg">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-3xl font-semibold text-orange-500 mb-6">Sign In</h2>
        <form onSubmit={handleLogin} className="flex flex-col space-y-6">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-white font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-3 px-4 rounded-md border border-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-white font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-3 px-4 rounded-md border border-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
              placeholder="Enter your password"
            />
          </div>

          {error && <span className="text-red-500 text-sm">{error}</span>}

          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold py-3 px-4 rounded-md border-2 border-transparent flex justify-center items-center hover:scale-105 transition-all duration-300"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
