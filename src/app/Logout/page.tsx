'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      document.cookie = 'isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      router.push('/login');
    }, 2000);
  }, [router]);

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500"></div>
        </div>
      )}
      <h2 className="text-xl font-semibold text-orange-500 mt-4">Logging out...</h2>
    </div>
  );
}
