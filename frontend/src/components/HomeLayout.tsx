import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import SideBar from './Sidebar';

const SideContainer = styled.aside`
  float: left;
  width: 15%;
`;

const MainContainer = styled.div`
  float: right;
  width: 85%;
`;

function HomeLayout() {
  return (
    <>
      <Header />
      <SideContainer>
        <SideBar />
      </SideContainer>
      <MainContainer>
        <Outlet />
      </MainContainer>
    </>
  );
}

export default HomeLayout;
