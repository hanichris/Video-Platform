import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import VideoCard from './VideoCard';
import { IVideo } from '../utils/types';

const Container = styled.div`
  flex: 2;
`;

const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;
function Recommendation({ tags }: { tags: Array<string> }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(
        `${SERVER_ENDPOINT}/videos/tags?tags=${tags}`,
      );
      setVideos(res.data);
    };
    fetchVideos();
  }, []);

  return (
    <Container>
      {videos.map((video: IVideo) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </Container>
  );
}

export default Recommendation;
