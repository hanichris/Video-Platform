import PropTypes from "prop-types"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Comment from './Comment';
import { IChannel, IUser, IVideo, IComment } from "../utils/types";
const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

const Comments = ( {videoId}: {videoId: string} ) => {
  const [comments, setComments] = useState<Array<IComment>>([]);
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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentRes = await axios.get(`${SERVER_ENDPOINT}/comments/${videoId}`);
        setComments(commentRes.data);
        // const userRes = await axios.get(
        //   `${SERVER_ENDPOINT}/users/${commentRes.data.userId}`
        // );
        // setUser(userRes.data)
      } catch (err) {}
    };
    fetchComments();
  }, [videoId]);

  // TODO: ADD NEW COMMENT FUNCTIONALITY

  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser.avatar} />
        <Input placeholder="Add a comment..." />
      </NewComment>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment}/>
      ))}
    </Container>
  );
};

Comments.propTypes = {
  videoId: PropTypes.string
}

export default Comments;
