import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Comment from './Comment';
import { IComment } from '../utils/types';
import useStore from '../store';

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

function Comments({ videoId }: { videoId: string | undefined }) {
  const store = useStore();
  const [newcomment, setNewComment] = useState<string>();
  const [comments, setComments] = useState<Array<IComment>>([]);
  const currentUser = store.authUser;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentRes = await axios.get(
          `${SERVER_ENDPOINT}/comments/${videoId}`,
        );
        setComments(commentRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [videoId]);

  const handleAddComment = async () => {
    try {
      await axios.post(
        `${SERVER_ENDPOINT}/comments/${videoId}`,
        { description: newcomment },
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

      toast.error(resMessage, {
        position: 'top-right',
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
        <Button onClick={handleAddComment}>Add</Button>
      </NewComment>
      {comments.map((comment) => (
        <Comment key={comment._id} videoId={videoId} comment={comment} />
      ))}
    </Container>
  );
}

export default Comments;
