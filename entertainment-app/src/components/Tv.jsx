"use client";
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import Badge from "@mui/material/Badge";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import Image from "next/image";

const Tv = ({ tvData, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [open, setOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [tvSearch, setTvSearch] = useState("");
  const [searchData, setSearchData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/searchTv", { tvSearch });
      if (response.data.results.length > 0) {
        setSearchData(response.data.results);
        setCurrentPage(1);
      } else {
        setSearchData([]);
        window.alert(`${tvSearch} not found`);
      }
    } catch (error) {
      console.error("Error occurred while fetching data:", error);
      setSearchData([]);
      window.alert(`No results found for "${tvSearch}"`);
      setTvSearch("");
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleClickOpen = (title) => {
    setSelectedTitle(title);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTitle(null);
  };

  const dataToShow = searchData.length > 0 ? searchData : tvData;
  const totalPages = Math.ceil(dataToShow.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataToShow.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="animate-spin rounded-full h-32 w-32 border-2 border-b-2 border-green-500"></div>
      </div>
    );
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
            value={tvSearch}
            onChange={(e) => setTvSearch(e.target.value)}
          />
          {tvSearch && (
            <button
              type="button"
              className="p-1"
              onClick={() => {
                setTvSearch("");
                setSearchData([]);
                setCurrentPage(1);
              }}
            >
              <AiOutlineClose className="text-lg text-red-500" />
            </button>
          )}

          <button
            type="submit"
            className="flex-shrink-0 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm border-4 text-white py-1 px-2 rounded"
          >
            <AiOutlineSearch className="text-lg" />
          </button>
        </form>
      </div>

      <div className="w-full h-full flex flex-wrap">
        {currentItems.map((show, index) => (
          <div
            key={index}
            className="p-2 md:w-[20%] w-[50%] capitalize overflow-hidden cursor-pointer transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-black"
          >
            <Badge
              badgeContent={`${show.vote_average.toFixed(1)}★`}
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
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleClickOpen(show)}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/original${show.poster_path}`}
                  alt={show.original_title || show.title}
                  width={500}
                  height={500}
                  layout="responsive" // Makes the image responsive
                  priority={true} // High-priority image, preload
                />
                <h1 className="text-center md:font-medium md:text-sm hover:text-red-500 transition duration-300">
                  {show.original_title ||
                    show.title ||
                    show.name ||
                    show.original_name}
                </h1>
                <h2 className="text-center">
                  {show.release_date || show.first_air_date}
                </h2>
                <p className="text-center">{show.media_type}</p>
              </div>
            </Badge>
          </div>
        ))}
      </div>

      <div className="flex justify-center w-full pt-10 p-3">
        {totalPages > 1 && (
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
        )}
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
          {selectedTitle?.original_name || selectedTitle?.name}
        </DialogTitle>
        <DialogContent className="flex flex-col items-center">
          <Image
            src={`https://image.tmdb.org/t/p/original${selectedTitle?.poster_path}`}
            alt={selectedTitle?.original_title || selectedTitle?.title}
            width={500}
            height={500}
            priority={true} // High-priority image, preload
            layout="responsive" // Makes the image responsive
          />

          <p className="mb-4">{selectedTitle?.overview}</p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Tv;
