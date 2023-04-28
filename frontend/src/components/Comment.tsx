import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IChannel, IComment } from "../utils/types";
import {format} from "timeago.js";
import useStore from "../store";

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
const Comment = ({ videoId, comment }: {videoId: string, comment: IComment}) => {
  const store = useStore();
  const user = store.authUser;
  // const [channel, setChannel] = useState<IChannel>({
  //   _id: "",
  //   name: "",
  //   description: "",
  //   imgUrl: "",
  //   views: 0,
  //   tags: [],
  //   likes: [],
  //   dislikes: [],
  //   videos: [],
  //   subscribers: 0,
  //   isPublic: false,
  //   createdAt: ""
  // });

  useEffect(() => {
      const fetchComment = async () => {
        const videoRes = await axios.get(`${SERVER_ENDPOINT}/videos/${videoId}`);
        // const userRes = await axios.get(`${SERVER_ENDPOINT}/users/${videoRes.data.userId}`);
        // setChannel(userRes.data)
      };
      fetchComment();
  }, [videoId]);

  return (
    <Container>
      <Avatar src={user?.avatar} />
      <Details>
        <Name>
          {user?.username} • {format(comment.createdAt)}
        </Name>
        <Text>{comment.description}</Text>
      </Details>
    </Container>
  );
};

export default Comment;
