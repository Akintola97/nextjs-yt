import axios from "axios";
import React from "react";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Badge from "@mui/material/Badge";
import YouTube from "react-youtube";

const Trending = ({ trendingData, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [open, setOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

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
      console.error("Failed to fetch Trailer:", error);
    }
  };
 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = trendingData.slice(indexOfFirstItem, indexOfLastItem);


  const totalPages = Math.ceil(trendingData.length/itemsPerPage)


  if (loading) {
    <div className="flex justify-center items-center h-screen w-full">
      <div className="animate-spin rounded-full h-32 w-32 border-2 border-b-2 border-green-500"></div>
    </div>;
  }

  return (
    <>
      <div className="w-full h-full flex flex-wrap">
        {currentItems.map((trending, index) => (
          <div
            key={index}
            className="p-2 md:w-[20%] w-[50%] capitalize overflow-hidden cursor-pointer transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-black"
          >
            <Badge
              badgeContent={`${trending.vote_average.toFixed(1)}★`}
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
              <div className="flex flex-col items-center">
                <img
                  className="w-full h-auto rounded-md transition duration-300 ease-in-out"
                  src={`https://image.tmdb.org/t/p/original${trending.poster_path}`}
                  alt={trending.original_title || trending.title}
                  onClick={() => handleClickOpen(trending)}
                />
                <h1 className="text-center md:font-medium md:text-sm hover:text-md-500 transition duration-500">
                  {trending.original_title ||
                    trending.title ||
                    trending.name ||
                    trending.original_name}
                </h1>
                <h2 className="text-center">
                  {trending.release_date || trending.first_air_date}
                </h2>
                <p className="text-center">{trending.media_type}</p>
              </div>
            </Badge>
          </div>
        ))}
      </div>
      <div className="flex justify-center w-full pt-10 p-3">
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            onChange={handlePageChange}
            page={currentPage}
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
        <DialogTitle
          className={
            selectedTitle?.media_type === "tv"
              ? "text-[3.5vmin] font-semibold text-left"
              : "text-[3.5vmin] font-semibold text-center"
          }
        >
          {selectedTitle?.original_title ||
            selectedTitle?.title ||
            selectedTitle?.original_name ||
            selectedTitle?.name}
        </DialogTitle>
        <DialogContent className="flex flex-col items-center">
          {selectedTitle?.media_type === "tv" && selectedTitle?.poster_path && (
            <img
              className="w-full max-w-35 h-auto mb-4"
              src={`https://image.tmdb.org/t/p/original${selectedTitle?.poster_path}`}
              alt={selectedTitle?.original_title || selectedTitle?.title}
            />
          )}
          <p className="mb-4">{selectedTitle?.overview}</p>
          {selectedTitle?.media_type === "movie" && (
            <>
              {!showTrailer && (
                <IconButton
                  color="primary"
                  onClick={() =>
                    handlePlayTrailer(
                      selectedTitle?.media_type,
                      selectedTitle?.id
                    )
                  }
                  aria-label="play trailer"
                  className="mb-4"
                >
                  <PlayArrowIcon />
                </IconButton>
              )}
              {showTrailer && trailerKey && (
                <div className="w-full flex justify-center text-center">
                  <div className="aspect-w-16 aspect-h-9 w-full">
                    <YouTube videoId = {trailerKey}className="w-full h-full" />
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Trending;
