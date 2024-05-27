import Image from "next/image";
import React from "react";

const getData = async () => {
  const key = process.env.API_KEY;
  const truncate = (str, num) => {
    if (str.length < num) {
      return str;
    }
    return str.slice(0, num) + "...";
  };

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&page=1`, {
        cache: 'no-cache'
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const results = data.results;
    const randomIndex = Math.floor(Math.random() * results.length);
    const movie = results[randomIndex];
    return { movie, truncate };
  } catch (error) {
    console.error("Failed to fetch upcoming movies:", error);
    return { movie: null, truncate: null, results: null };
  }
};

const Banner = async () => {
  const { movie, truncate } = await getData();

  return (
    <div className="w-full h-full pt-[8vh]">
      {movie && (
        <div className="relative w-full h-full">
            <Image 
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
                  width={500}
                  height={500}
                  layout="responsive" // Makes the image responsive
                  priority={true} // High-priority image, preload
                  />
          <div className="absolute md:bottom-[16%] bottom-[1%] left-0 bg-gradient-to-t from-black to-transparent p-4 w-full sm:w-[50%]">
            <h1 className="text-white text-2xl sm:text-4xl font-bold">
              {movie.title}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base mt-2">
              Release Date: {movie.release_date}
            </p>
            <p className="text-gray-300 text-sm sm:text-base mt-2">
              {truncate(movie.overview, 100)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;