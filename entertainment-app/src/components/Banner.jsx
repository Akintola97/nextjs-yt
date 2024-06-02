"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import YouTube from "react-youtube";
import axios from "axios";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const Banner = () => {
  const [movie, setMovie] = useState(null);
  const [open, setOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  // Fetch the upcoming movie and its details on component mount
  const getData = async () => {
    try {
      const response = await fetch("/api/movies", {
        cache: "no-cache",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const randomIndex = Math.floor(Math.random() * data.results.length);
      setMovie(data.results[randomIndex]);
    } catch (error) {
      console.error("Failed to fetch upcoming movies:", error);
    }
  };

  // Fetch the trailer key for a given movie
  const fetchTrailer = async (id) => {
    try {
      const response = await axios.post("/api/trailer", {
        media_type: "movie",
        id,
      });
      setTrailerKey(response.data.trailerKey);
    } catch (error) {
      console.error("Failed to fetch trailer:", error);
    }
  };

  // Handlers for opening and closing the dialog
  const handleOpen = () => {
    setOpen(true);
    if (movie) {
      fetchTrailer(movie.id);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const truncate = (str, num) => {
    if (str.length <= num) return str;
    return str.slice(0, num) + "...";
  };

  return (
    <div className="w-full h-full pt-[8vh]">
      {movie && (
        <div className="relative w-full h-full">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            width={500}
            height={500}
            layout="responsive"
            priority={true}
          />
          <div className="absolute md:bottom-[12%] bottom-[1%] left-0 bg-gradient-to-t from-black to-transparent p-4 w-full sm:w-[50%]">
            <h1 className="text-white text-2xl sm:text-3xl font-bold">
              {movie.title}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base mt-2">
              Release Date: {movie.release_date}
            </p>
              <p className="hidden sm:block text-gray-300 text-sm sm:text-base mt-2">
              {truncate(movie.overview, 100)}
            </p>
            <div className="p-5">
              <button
                onClick={handleOpen}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center justify-center space-x-2"
                aria-label="play trailer"
              >
                <PlayCircleOutlineIcon />
                <span>Play Trailer</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth={true}
        className="rounded-lg p-4"
        PaperProps={{
          className: "bg-white dark:bg-gray-800 text-black dark:text-white",
        }}
      >
        <DialogTitle className="text-[3.5vmin] font-semibold text-left">
          {movie?.title}
        </DialogTitle>
        <DialogContent>
          {trailerKey ? (
            <YouTube
              videoId={trailerKey}
              className="w-full h-full flex justify-center text-center"
            />
          ) : (
            <p>Loading trailer...</p>
          )}
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <p className="p-4">{movie?.overview}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Banner;
