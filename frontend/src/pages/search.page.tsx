import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import VideoCard from '../components/VideoCard';
import { IVideo } from '../utils/types';
import SearchBar from '../components/SearchBar';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;
function SearchPage() {
  const [videos, setVideos] = useState<Array<IVideo>>([]);
  const query = useLocation().search;
  const searchQuery = query.toString().includes('q')
    ? `search${query}`
    : `tags${query}`;

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`${SERVER_ENDPOINT}/videos/${searchQuery}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [searchQuery]);

  return (
    <>
      <SearchBar />
      <Container>
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </Container>
    </>
  );
}

export default SearchPage;
