import React, { useEffect, useState } from "react";
import styled from "styled-components";
import VideoCard from "../components/VideoCard";
import axios from "axios";
import IVideo from "../utils/types"
import SearchBar from "../components/SearchBar"
import Upload from "../components/Upload";

const Container = styled.div`
  padding: 2em;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const UploadPage = () => {
  try {
    store.setRequestLoading(true);
    const SERVER_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;
    const response = await fetch(
      `${SERVER_ENDPOINT}/auth/register`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw await response.json();
    }

    toast.success("Account created successfully", {
      position: "top-right",
    });
    store.setRequestLoading(false);
    navigate("/profile");
  } catch (error: any) {
    store.setRequestLoading(false);
    if (error.error) {
      error.error.forEach((err: any) => {
        toast.error(err.message, {
          position: "top-right",
        });
      });
      return;
    }
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

  return (
    <>
      <Upload />
    </>
  );
};

export default UploadPage;