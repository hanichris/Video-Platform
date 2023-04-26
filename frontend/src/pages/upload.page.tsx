import React, { useEffect, useState } from "react";
import styled from "styled-components";
import VideoCard from "../components/VideoCard";
import axios from "axios";
import SearchBar from "../components/SearchBar"
import Upload from "../components/Upload";
import useStore from "../store";

const Container = styled.div`
  padding: 2em;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const UploadPage = () => {
  return (
    <>
      <Container>
        <Upload/>
      </Container>
    </>
  );
};

export default UploadPage;