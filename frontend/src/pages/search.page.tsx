import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import VideoCard from "../components/VideoCard";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;
const SearchPage = () => {
  const [videos, setVideos] = useState([]);
  const query = useLocation().search;

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`${SERVER_ENDPOINT}/videos/search${query}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [query]);

  return <Container>
    {videos.map(video=>(
      <VideoCard key={video._id} video={video}/>
    ))}
  </Container>;
};

export default SearchPage;
