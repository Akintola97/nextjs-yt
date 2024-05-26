"use client";

import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import axios from "axios";
import Movie from "./Movie";
import Tv from "./Tv";
import Trending from "./Trending";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const HeadlineNav = () => {
  const [value, setValue] = React.useState(0);
  const [trendingData, setTrendingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trending = await axios.get("/api/trending");
        setTrendingData(trending.data.results);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [movieData, setMovieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieData = await axios.get("/api/movies");
        setMovieData(movieData.data.results);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [tvData, setTvData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tvData = await axios.get("/api/tv");
        setTvData(tvData.data.results);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "Background.paper", p:5 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        centered
      >
        <Tab label="TRENDING" />
        <Tab label="MOVIES" />
        <Tab label="TV" />
      </Tabs>

      <CustomTabPanel value={value} index={0}>
        <Trending loading = {loading} trendingData = {trendingData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Movie loading = {loading} movieData = {movieData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Tv loading = {loading} tvData = {tvData} />
      </CustomTabPanel>
    </Box>
  );
};

export default HeadlineNav;
