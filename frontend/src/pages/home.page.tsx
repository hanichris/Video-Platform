import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import { IVideo } from '../utils/types';
import SearchBar from '../components/SearchBar';

const Container = styled.div`
  padding: 0.5em;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

function HomePage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;
    const fetchVideos = async () => {
      const res = await axios.get(`${SERVER_ENDPOINT}/videos`);
      setVideos(res.data);
    };
    fetchVideos();
  }, []);

  return (
    <>
      <SearchBar />
      <Container>
        {videos.map((video: IVideo) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </Container>
    </>
  );
}

export default HomePage;
