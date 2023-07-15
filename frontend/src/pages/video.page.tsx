import { useEffect } from 'react';
import styled from 'styled-components';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'timeago.js';
import { toast } from 'react-toastify';
import Recommendation from '../components/Recommendation';
import useStore from '../store';
import Comments from '../components/Comments';

const Container = styled.div`
  padding: 2em;
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 10px;
  text-transform: capitalize;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 420px;
  width: 100%;
  object-fit: cover;
`;

const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

function VideoPage() {
  const store = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const currentChannel = useStore((state) => state.currentChannel);
  const currentVideo = useStore((state) => state.currentVideo);
  const authUser = useStore((state) => state.authUser);
  useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch video data
      const videoResponse = await axios.get(`${SERVER_ENDPOINT}/videos/${id}/view`);
      const videoData = videoResponse.data;
      store.setCurrentVideo(videoData);
      
      // Fetch channel data
      const channelResponse = await axios.get(`${SERVER_ENDPOINT}/channels/${videoData.channelId}/view`);
      const channelData = channelResponse.data;
      store.setCurrentChannel(channelData);

    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
}, [id]);


  const handleLike = async () => {
    try {
      await axios.put(
        `${SERVER_ENDPOINT}/users/like/${id}`,
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error: any) {
      console.log(error?.message);
      const resMessage = (error.response
          && error.response.data
          && error.response.data.message)
        || error.message
        || error.toString();

      if (error?.message === 'You are not logged in') {
        navigate('/login');
      }

      toast.error(resMessage, {
        position: 'top-right',
      });
    }
  };
  const handleDislike = async () => {
    try {
      await axios.put(
        `${SERVER_ENDPOINT}/users/dislike/${id}`,
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error: any) {
      console.log(error?.message);
      const resMessage = (error.response
          && error.response.data
          && error.response.data.message)
        || error.message
        || error.toString();

      if (error?.message === 'You are not logged in') {
        navigate('/login');
      }

      toast.error(resMessage, {
        position: 'top-right',
      });
    }
  };

  const handleSub = async () => {
    try {
      if (!currentChannel || !currentChannel._id) {
        throw new Error('Channel not found!');
      }
      if (authUser?.subscriptions.includes(currentChannel._id)) {
        await axios.put(
          `${SERVER_ENDPOINT}/users/unsubscribe/${currentChannel._id}`,
          {},
          {
            withCredentials: true,
          },
        );
      } else {
        await axios.put(
          `${SERVER_ENDPOINT}/users/subscribe/${currentChannel._id}`,
          {},
          {
            withCredentials: true,
          },
        );
      }
    } catch (error: any) {
      console.log(error?.message);
      const resMessage = (error.response
          && error.response.data
          && error.response.data.message)
        || error.message
        || error.toString();

      if (error?.message === 'You are not logged in') {
        navigate('/login');
      }

      toast.error(resMessage, {
        position: 'top-right',
      });
    }
  };

  const handlePlay = async () => {
    try {
      await axios.put(`${SERVER_ENDPOINT}/videos/${id}/view`);
      if (authUser) {
        await axios.put(
          `${SERVER_ENDPOINT}/users/history/${id}`,
          {},
          {
            withCredentials: true,
          },
        );
      }
    } catch (error: any) {
      console.log(error?.message);
      const resMessage = (error.response
          && error.response.data
          && error.response.data.message)
        || error.message
        || error.toString();

      toast.error(resMessage, {
        position: 'top-right',
      });
    }
  };

  const handleDownload = async () => {
    try {
      axios({
        url: `${SERVER_ENDPOINT}/videos/${id}/download`,
        method: 'GET',
        responseType: 'blob',
      }).then((response) => {
        const urlObject = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = urlObject;
        link.setAttribute('download', 'video.mp4');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } catch (error: any) {
      console.log(error?.message);
      const resMessage = (error.response
          && error.response.data
          && error.response.data.message)
        || error.message
        || error.toString();

      toast.error(resMessage, {
        position: 'top-right',
      });
    }
  };

  // TODO share functionality
  const handleShare = async () => {};
  // console.log(store.authUser);
  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame
            onPlay={handlePlay}
            src={`${SERVER_ENDPOINT}/videos/${id}/stream`}
            controls
          />
        </VideoWrapper>
        <Title>{currentVideo?.title}</Title>
        <Details>
          <Info>
            {currentVideo?.views}
            {' '}
            views •
            {format(String(currentVideo?.createdAt))}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo?.likes?.includes(String(authUser?._id)) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}
              {' '}
              {currentVideo?.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo?.dislikes?.includes(String(authUser?._id)) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}
              {' '}
              Dislike
            </Button>
            <Button onClick={handleShare}>
              <ReplyOutlinedIcon />
              {' '}
              Share
            </Button>
            <Button onClick={handleDownload}>
              <DownloadForOfflineOutlinedIcon />
              {' '}
              Download
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={currentChannel?.imgUrl} />
            <ChannelDetail>
              <ChannelName>{currentChannel?.name}</ChannelName>
              <ChannelCounter>
                {currentChannel?.subscribers && currentChannel?.subscribers > 0
                  ? currentChannel?.subscribers
                  : 0}
                {' '}
                subscribers
              </ChannelCounter>
              <Description>{currentVideo?.description}</Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSub}>
            {authUser?.subscriptions?.includes(String(currentChannel?._id))
              ? 'UNSUBSCRIBE'
              : 'SUBSCRIBE'}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={id} />
      </Content>
      {currentVideo?.tags ? (
        <Recommendation tags={Array.from(currentVideo?.tags)} />
      ) : null}
    </Container>
  );
}

export default VideoPage;
