import PropTypes from "prop-types"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Comment from './Comment';
import { IChannel, IUser, IVideo, IComment } from "../utils/types";
import { useNavigate } from "react-router-dom";
import useStore from "../store";
import { toast } from "react-toastify";

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
const Button = styled.button`
  border-radius: 3px;
  border: 1px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: #cc1a00;
  color: white;
`;

const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

const Comments = ( {videoId}: {videoId: string} ) => {
  const navigate = useNavigate();
  const store = useStore();
  const [newcomment, setNewComment] = useState<string>();
  const [comments, setComments] = useState<Array<IComment>>([]);
  // const [currentUser, setUser] = useState<IUser>({
  //   _id: "",
  // username: "",
  // email: "",
  // avatar: "",
  // subscriptions: [],
  // history: [],
  // channels: [],
  // fromGoogle: false,
  // });
  const currentUser = store.authUser;

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

  const handleAddComment = async () => {
    try {
      await axios.post(`${SERVER_ENDPOINT}/comments/${videoId}`, 
      {description: newcomment},
      {
        withCredentials: true,
      });
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

  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser?.avatar} />
        <Input 
          placeholder="Add a comment..."
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleAddComment}>
          Add
        </Button>
      </NewComment>
      {comments.map((comment) => (
        <Comment key={comment._id} videoId={videoId} comment={comment}/>
      ))}
    </Container>
  );
};

Comments.propTypes = {
  videoId: PropTypes.string
}

export default Comments;
