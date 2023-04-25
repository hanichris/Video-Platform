import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./SideBar";
import styled from "styled-components";

const SideContainer = styled.aside`
  float:left;
  width:250px;
`;

const MainContainer = styled.div`
  float:right;
  width:750px;
  margin: 0 auto;
`;

const HomeLayout = () => {
  return (
    <>
      <Header />
      <SideContainer>
        <Sidebar darkMode={null} setDarkMode={null}/>
      </SideContainer>
      <MainContainer>
        <Outlet/>
      </MainContainer>
    </>
  );
};

export default HomeLayout;
