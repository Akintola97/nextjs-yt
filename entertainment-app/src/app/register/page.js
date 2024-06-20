"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import wallpaper from "@/assets/images/wallpaper.webp";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();
  const { fetchData } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const registerResponse = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
        body: JSON.stringify({
          email,
          password,
          username,
        }),
      });
      if (registerResponse.status === 200) {
        await registerResponse.json();
        const loginResponse = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        if (loginResponse.status === 200) {
          await fetchData();
          router.push("/hero");
        } else {
          console.error(
            "Login failed after registration:",
            loginResponse.status
          );
        }
      } else {
        console.error("Registration failed:", registerResponse.status);
      }
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(
        "An error occurred during the registration or login process:",
        error
      );
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
            Register
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label
                htmlFor="Username"
                className="block text-white font-bold mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full rounded-lg border py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                placeholder="Username"
                required
              />
            </div>
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
            </div>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
