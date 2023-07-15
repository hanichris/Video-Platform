import axios from 'axios';
import { useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'timeago.js';
import { IComment } from '../utils/types';
import useStore from '../store';

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
function Comment({
  videoId,
  comment,
}: {
  videoId: string | undefined;
  comment: IComment;
}) {
  const store = useStore();
  const user = store.authUser;

  useEffect(() => {
    const fetchComment = async () => {
      await axios.get(`${SERVER_ENDPOINT}/videos/${videoId}`);
    };
    fetchComment();
  }, [videoId]);

  return (
    <Container>
      <Avatar src={user?.avatar} />
      <Details>
        <Name>
          {user?.username}
          {' '}
          •
          <Date>{format(comment.createdAt)}</Date>
        </Name>
        <Text>{comment.description}</Text>
      </Details>
    </Container>
  );
}

export default Comment;
