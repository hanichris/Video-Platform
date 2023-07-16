import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import { IVideo } from '../utils/types';
import SearchBar from '../components/SearchBar';
import useStore from '../store';

const Container = styled.div`
  padding: 2em;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

function HistoryPage() {
  const user = useStore((state) => state.authUser);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;
    const fetchVideos = async () => {
      await axios
        .get(`${SERVER_ENDPOINT}/users/${user?._id}/history`, {
          withCredentials: true,
        })
        .then((data) => {
          setVideos(data.data);
        });
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

export default HistoryPage;
