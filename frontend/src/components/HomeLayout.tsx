import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./SideBar";
import styled from "styled-components";

const SideContainer = styled.aside`
  float:left;
  width:25%;
`;

const MainContainer = styled.div`
  float:right;
  width: 75%;
`;

const HomeLayout = () => {
  return (
    <>
      <Header />
      <SideContainer>
        <Sidebar darkMode={"Light"} setDarkMode={(mode) => !mode}/>
      </SideContainer>
      <MainContainer>
        <Outlet/>
      </MainContainer>
    </>
  );
};

export default HomeLayout;
