import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Comments from "../components/Comments";
import Card from "../components/VideoCard";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { format } from "timeago.js";
import Recommendation from "../components/Recommendation";
import { IChannel, IUser, IVideo } from "../utils/types";
import useStore from "../store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
  autoplay: true;
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

const VideoPage = () => {
  const store = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentChannel, setChannel] = useState<IChannel>({
    _id: "",
    name: "",
    description: "",
    imgUrl: "",
    views: 0,
    tags: [],
    likes: [],
    dislikes: [],
    videos: [],
    subscribers: 0,
    isPublic: false,
  });
  const [currentUser, setUser] = useState<IUser>({
    _id: "",
  username: "",
  email: "",
  avatar: "",
  subscriptions: [],
  history: [],
  channels: [],
  fromGoogle: false,
  });
  const [currentVideo, setVideo] = useState<IVideo>({
    _id: "",
  userId: "",
  channelId: "",
  title: "",
  description: "",
  imgUrl: "",
  videoUrl: "",
  views: 0,
  tags: [],
  likes: [],
  dislikes: [],
  isPublic: false,
  createdAt: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`${SERVER_ENDPOINT}/videos/${id}/view`);
        const channelRes = await axios.get(
          `${SERVER_ENDPOINT}/channels/${videoRes.data.channelId}/view`
        );
        const userRes = await axios.get(
          `${SERVER_ENDPOINT}/users/${channelRes.data.userId}`
        );
        setUser(userRes.data)
        setChannel(channelRes.data);
        setVideo(videoRes.data)
        store.setAuthUser(userRes.data);
        store.setCurrentVideo(videoRes.data);
        store.setCurrentChannel(channelRes.data);
      } catch (err) {}
    };
    fetchData();
  }, []);

  const handleLike = async () => {
    try {
      await axios.put(`${SERVER_ENDPOINT}/users/like/${currentVideo?._id}`);
    } catch (error: any) {
      console.log(error?.message)
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      if (error?.message === "You are not logged in") {
        navigate("/login");
      }

      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };
  const handleDislike = async () => {
    try {
      await axios.put(`${SERVER_ENDPOINT}/users/dislike/${currentVideo?._id}`);
    } catch (error: any) {
      console.log(error?.message)
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      if (error?.message === "You are not logged in") {
        navigate("/login");
      }

      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  const handleSub = async () => {
    try {
      currentUser.subscriptions.includes(currentChannel?._id)
      ? await axios.put(`${SERVER_ENDPOINT}/users/unsubscribe/${currentChannel?._id}`)
      : await axios.put(`${SERVER_ENDPOINT}/users/subscribe/${currentChannel?._id}`);
    } catch (error: any) {
      console.log(error?.message)
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      if (error?.message === "You are not logged in") {
        navigate("/login");
      }

      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  const handleDownload = async () => {
    try {
      await axios.get(`${SERVER_ENDPOINT}/videos/${currentVideo?._id}/download`);
    } catch (error: any) {
      console.log(error?.message)
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  const handleShare = async () => {}

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={currentVideo.videoUrl} controls autoplay/>
        </VideoWrapper>
        <Title>{currentVideo.title}</Title>
        <Details>
          <Info>
            {currentVideo.views} views • {format(currentVideo.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo.likes?.includes(currentUser?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}{" "}
              {currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo.dislikes?.includes(currentUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}{" "}
              Dislike
            </Button>
            <Button onClick={handleShare}>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button onClick={handleDownload}>
              <AddTaskOutlinedIcon /> Download
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={currentChannel.imgUrl} />
            <ChannelDetail>
              <ChannelName>{currentChannel.name}</ChannelName>
              <ChannelCounter>{currentChannel.subscribers} subscribers</ChannelCounter>
              <Description>{currentVideo.description}</Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSub}>
            {currentUser.subscriptions?.includes(currentChannel._id)
              ? "UNSUBSCRIBE"
              : "SUBSCRIBE"}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo._id} />
      </Content>
      <Recommendation tags={currentVideo.tags} />
    </Container>
  );
};

export default VideoPage;
