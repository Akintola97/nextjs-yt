import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import YouTube from "react-youtube";
import axios from "axios";
import Badge from "@mui/material/Badge";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";


const Movie = ({ movieData, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [open, setOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [movieSearch, setMovieSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/searchmovies", { movieSearch });
      if (response.data.results.length > 0) {
        setSearchData(response.data.results);
        setCurrentPage(1);
      } else {
        setSearchData([]);
        window.alert(`${movieSearch} not found`);
      }
    } catch (error) {
      console.error(`Error occurred while fetching data:`, error);
      setSearchData([]);
      window.alert(`No result found for ${movieSearch}`);
      setMovieSearch("");
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleClickOpen = (title) => {
    setSelectedTitle(title);
    setOpen(true);
    setShowTrailer(false);
    setTrailerKey(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTitle(null);
    setTrailerKey(null);
    setShowTrailer(false);
  };

  const handlePlayTrailer = async (mediaType, id) => {
    try {
      const response = await axios.post("/api/trailer", {
        media_type: mediaType,
        id,
      });
      setTrailerKey(response.data.trailerKey);
      setShowTrailer(true);
    } catch (error) {
      console.error("Failed to fetch trailer:", error);
    }
  };


  const dataToShow = searchData.length > 0 ? searchData : movieData;
  const totalPages = Math.ceil(dataToShow.length/itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataToShow.slice(indexOfFirstItem, indexOfLastItem);




  if (loading) {
    <div className="flex justify-center items-center h-screen w-full">
      <div className="animate-spin rounded-full h-32 w-32 border-2 border-b-2 border-green-500"></div>
    </div>;
  }

  return (
    <>
      <div className="w-full h-full flex justify-end p-3 pb-10">
      <form
          onSubmit={handleSubmit}
          className="flex w-full md:w-auto items-center gap-2"
        >
        <input
          className="w-full h-full bg-transparent border-b focus:outline-none"
          type="text"
          placeholder="Search..."
          value={movieSearch}
          onChange={(e) => setMovieSearch(e.target.value)}
        />
 
      {movieSearch && (
        <button type="button" className="p-1" onClick={()=>{
          setMovieSearch("")
          setSearchData([]);
          setCurrentPage(1);
        }}>
          <AiOutlineClose className="text-lg text-red-500" />
        </button>
      )}
      <button type="submit" className="flex-shrink-0 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm border-4 text-white py-1 px-2 rounded">
        <AiOutlineSearch className="text-lg" />
      </button>
      </form>
      </div>
      <div className="w-full h-full flex flex-wrap">
        {currentItems.map((movies, index)=>(
           <div
           key={index}
           className="p-2 md:w-[20%] w-[50%] capitalize overflow-hidden cursor-pointer transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-black"
         >
           <Badge
              badgeContent={`${movies.vote_average.toFixed(1)}★`}
              color="primary"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                ".MuiBadge-badge": {
                  top: "-2%",
                  right: "50%",
                  transform: "translateX(50%)",
                  backgroundColor: "#f44336",
                  color: "white",
                },
              }}
            >
              <div className="flex flex-col items-center cursor-pointer">
                <img
                  className="w-full h-auto rounded-md transition duration-300 ease-in-out"
                  src={`https://image.tmdb.org/t/p/original${movies.poster_path}`}
                  alt={movies.original_title || movies.title}
                  onClick={() => handleClickOpen(movies)}
                />
                <h1 className="text-center md:font-medium md:text-sm hover:text-red-500 transition duration-300">
                  {movies.original_title ||
                    movies.title ||
                    movies.name ||
                    movies.original_name}
                </h1>
                <h2 className="text-center">
                  {movies.release_date || movies.first_air_date}
                </h2>
                <p className="text-center">{movies.media_type}</p>
              </div>
            </Badge>
            </div>
        ))}
      </div>
    
      <div className="flex justify-center w-full pt-10 p-3">
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            color="primary"
            className="pagination-custom"
            sx={{
              "& .MuiPaginationItem-page, & .MuiPaginationItem-previous, & .MuiPaginationItem-next":
                {
                  color: "black",
                },
              "& .Mui-selected, & .Mui-selected:hover, & .MuiPaginationItem-previous:hover, & .MuiPaginationItem-next:hover":
                {
                  color: "black",
                },
            }}
          />
        </Stack>
      </div>

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
          {selectedTitle?.original_title || selectedTitle?.title}
        </DialogTitle>
        <DialogContent className="flex flex-col items-center">
          <p>{selectedTitle?.overview}</p>
          {!showTrailer && (
            <IconButton
              color="primary"
              onClick={() =>
                handlePlayTrailer(
                  selectedTitle?.media_type || "movie",
                  selectedTitle?.id
                )
              }
              aria-label="play trailer"
              className="m-4"
            >
              <PlayArrowIcon />
            </IconButton>
          )}
          {showTrailer && trailerKey && (
            <div className="w-full flex justify-center text-center">
              <div className="aspect-w-16 aspect-h-9 w-full">
                <YouTube videoId={trailerKey} className="w-full h-full" />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Movie;
