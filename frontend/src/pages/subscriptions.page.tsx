import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ChannelCard from '../components/ChannelCard';
import { IChannel } from '../utils/types';
import SearchBar from '../components/SearchBar';
import useStore from '../store';

const Container = styled.div`
  padding: 2em;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

function SubscriptionsPage() {
  const user = useStore((state) => state.authUser);
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;
    const fetchVideos = async () => {
      await axios
        .get(`${SERVER_ENDPOINT}/users/${user?._id}/subscriptions`, {
          withCredentials: true,
        })
        .then((data) => {
          setChannels(data.data);
        });
    };
    fetchVideos();
  }, []);

  return (
    <>
      <SearchBar />
      <Container>
        {channels.map((channel: IChannel) => (
          <ChannelCard key={channel._id} channel={channel} />
        ))}
      </Container>
    </>
  );
}

export default SubscriptionsPage;
