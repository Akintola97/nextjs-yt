"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import movieTheaterPlaceholder from "@/assets/images/movieTheatrePlaceholder.webp";

const Location = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showZipCodeInput, setShowZipCodeInput] = useState("");
  const [zipCode, setZipCode] = useState("");

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`/api/location`, { zipCode });
      setFacilities(response.data);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching facilities based on Zip-Code provided",
        error
      );
      alert(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const { latitude, longitude } = await getUserLocation();
        const response = await axios.post("/api/location", {
          longitude,
          latitude,
        });
        setFacilities(response.data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error getting user location or fetching facilities:",
          error
        );
        setShowZipCodeInput(true);
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  if (loading) {
    <div className="flex justify-center items-center h-screen w-full">
      <div className="animate-spin rounded-full h-32 w-32 border-2 border-b-2 border-green-500"></div>
    </div>;
  }

  return (
    <div className="w-full min-h-screen bg-white pt-[12vh]">
      {showZipCodeInput || facilities.length === 0 ? (
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <label htmlFor="zipCode" className="mb-2 text-lg">
            <h1>Enter Your Zip Code:</h1>
          </label>
          <div className="flex">
            <input
              type="text"
              id="zipCode"
              className="bg-transparent focus:outline-none border-black border-b text-black mr-2"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded"
            >
              <AiOutlineSearch className="text-lg" />
            </button>
            {zipCode && (
              <button
                type="button"
                onClick={() => setZipCode("")}
                className="ml-2 text-black"
              >
                <AiOutlineClose className="text-lg" />
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilities.map((facility, index) => (
            <div key={index} className="text-black">
              <Image
                src={movieTheaterPlaceholder}
                alt={facility.name}
                width={500}
                height={500}
                layout="responsive" // Makes the image responsive
                priority = {true}
                className="w-full h-[50vh] object-cover rounded-lg"
              />
              <h1 className="text-center">{facility.name}</h1>
              <p className="text-center">
                {facility.rating === 0 ? null : `${facility.rating} Stars`}
              </p>
              <p className="text-center">
                Availability : {""}
                {facility.available?.open_now ? "open" : "closed"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Location;
