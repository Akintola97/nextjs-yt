"use client";

import { useAuth } from "@/context/authContext";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import wallpaper from "@/assets/images/wallpaper.webp";

export default function LoginPage() {
  const { fetchData } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/login", { email, password });
      await fetchData();
      router.push("/hero");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className={`relative w-full h-screen pt-[8vh]`}>
      <Image
        src={wallpaper}
        alt="Login-Background"
        quality={100}
        fill
        style={{
          objectFit: "cover",
        }}
      />
      <div
        className={
          "absolute top-0 left-0 w-full h-full flex items-center justify-center"
        }
      >
        <div className="bg-transparent p-8 rounded-lg shadow-xl backdrop-filter backdrop-blur-lg">
          <h2 className="text-3xl font-semibold mb-6 text-center text-white">
            Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="Email"
                className="block text-white font-bold mb-2"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                className="w-full rounded-lg border py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                required
              />
            </div>
            <div>
              <label
                htmlFor="Password"
                className="block text-white font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full rounded-lg border py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
                required
              />
              {error && <p className="text-white">{error}</p>}
            </div>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
