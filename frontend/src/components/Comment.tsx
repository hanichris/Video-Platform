import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text};
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;
const Comment = ({ comment }) => {
  const [channel, setChannel] = useState({});

  useEffect(() => {
    if (comment.userId) {
      const fetchComment = async () => {
        const videoRes = await axios.get(`${SERVER_ENDPOINT}/videos/${comment.videoId}`);
        // const channelRes = await axios.get(`${SERVER_ENDPOINT}/channels/${videoRes.data.channelId}`);
        // setChannel(channelRes.data)
      };
      fetchComment();
    }
  }, [comment.userId]);

  return (
    <Container>
      <Avatar src={channel.imgUrl} />
      <Details>
        <Name>
          {channel.name} <Date>1 day ago</Date>
        </Name>
        <Text>{comment.description}</Text>
      </Details>
    </Container>
  );
};

export default Comment;
