import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  padding-left: 3em;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
`;
const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;
const Button = styled.button`
  border-radius: 3px;
  border: 1px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: aqua;
  color: ${({ theme }) => theme.textSoft};
`;
const Label = styled.label`
  font-size: 14px;
`;

const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

function Upload({ channelId }: { channelId: string }) {
  // const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTags = (e: any) => {
    setTags(e.target.value.split(','));
  };

  const uploadFile = (file: File, urlType: string) => {
    setInputs((prev) => ({ ...prev, [urlType]: file }));
  };

  useEffect(() => {
    if (video) {
      uploadFile(video, 'video');
    }
  }, [video]);

  // useEffect(() => {
  //   img && uploadFile(img, "imgUrl");
  // }, [img]);

  const handleUpload = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${SERVER_ENDPOINT}/channels/${channelId}/upload`,
        { ...inputs, tags },
        {
          withCredentials: true,
          headers: {
            // 'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/multipart/form-data',
          },
        },
      );
      if (res.status === 200) {
        navigate(`/videos/${res.data._id}`);
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

  return (
    <Container>
      <Wrapper>
        <Title>Upload a New Video</Title>
        <Label>Video:</Label>
        <Input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo((e.target as any).files[0])}
        />
        <Input
          type="text"
          placeholder="Title"
          name="title"
          onChange={handleChange}
        />
        <Desc
          placeholder="Description"
          name="description"
          rows={8}
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Separate the tags with commas."
          onChange={handleTags}
        />
        {/* <Label>Image:</Label>
        {imgPerc > 0 ? (
          "Uploading:" + imgPerc + "%"
        ) : (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImg((e.target as any).files[0])}
          />
        )} */}
        <Button onClick={handleUpload}>Upload</Button>
      </Wrapper>
    </Container>
  );
}

export default Upload;
