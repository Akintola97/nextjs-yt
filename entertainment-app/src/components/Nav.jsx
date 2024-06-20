"use client";

import { useAuth } from "@/context/authContext";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Nav = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/logout");
      if (response.status === 200) {
        router.push("/");
        setUser(null);
      } else {
        console.error("Logout Failed");
      }
    } catch (error) {
      console.error("Logout Failed:", error);
    }
  };

  return (
    <nav className="w-full h-[8vh] fixed top-0 left-0 right-0 bg-black flex items-center justify-between text-white px-4 z-50">
      <div className="flex items-center">
        {user ? (
          <Link href="/hero">
            <h1 className="cursor-pointer text-[2.5vmin]">Entertainment</h1>
          </Link>
        ) : (
          <Link href="/">
            <h1 className="cursor-pointer text-[2.5vmin]">Entertainment</h1>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <h2 className="text-[1.95vmin] sm:text-[1.75vmin]">Hi, {user}</h2>
            <Link href='/location'>
              <h2 className="text-[1.95vmin] sm:text-[1.75vmin]">Theatres</h2>
            </Link>
          </>
        ) : null}
        {user ? (<button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded transition duration-300 ease-in-out">
          <h2 className="text-[1.95vmin] sm:text-[1.75vmin]">Logout</h2>
        </button>):(<Link href ="/register">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded transition">
            <h2 className="text-[1.95vmin] sm:text-[1.75vmin]">Register</h2>
          </button>
        </Link>)}
      </div>
    </nav>
  );
};

export default Nav;
