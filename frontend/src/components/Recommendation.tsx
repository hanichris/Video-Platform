import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import VideoCard from "./VideoCard";

const Container = styled.div`
  flex: 2;
`;

const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;
const Recommendation = ({ tags }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`${SERVER_ENDPOINT}/videos/tags?tags=${tags}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [tags]);

  return (
    <Container>
      {videos.map((video) => (
        <VideoCard type="sm" key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Recommendation;
