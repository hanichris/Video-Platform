import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import SportsBasketballOutlinedIcon from '@mui/icons-material/SportsBasketballOutlined';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Link } from 'react-router-dom';
import useStore from '../store';

const Container = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 100vh;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  position: sticky;
  top: 0;
  left: 0;
`;
const Wrapper = styled.div`
  padding: 18px 26px;
`;
// const Logo = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 5px;
//   font-weight: bold;
//   margin-bottom: 25px;
// `;

// const Img = styled.img`
//   height: 25px;
// `;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 0px;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

// const Login = styled.div``;
// const Button = styled.button`
//   padding: 5px 15px;
//   background-color: transparent;
//   border: 1px solid #3ea6ff;
//   color: #3ea6ff;
//   border-radius: 3px;
//   font-weight: 500;
//   margin-top: 10px;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   gap: 5px;
// `;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 500;
  color: #aaaaaa;
  margin-bottom: 20px;
`;

function SideBar() {
  const store = useStore();
  const currentUser = store.authUser;

  return (
    <Container>
      <Wrapper>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Item>
            <HomeIcon />
            Home
          </Item>
        </Link>
        <Hr />
        {currentUser && (
          <>
            <Link
              to="upload"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Item>
                <FileUploadOutlinedIcon />
                Upload
              </Item>
            </Link>
            <Link
              to="subscriptions"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Item>
                <SubscriptionsOutlinedIcon />
                Subscriptions
              </Item>
            </Link>
            <Link
              to="history"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Item>
                <HistoryOutlinedIcon />
                History
              </Item>
            </Link>
            <Hr />
          </>
        )}
        <Title>BEST OF VideoTube</Title>
        <Link
          to="/videos/search?tags=music"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Item>
            <LibraryMusicOutlinedIcon />
            Music
          </Item>
        </Link>
        <Link
          to="/videos/search?tags=sports"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Item>
            <SportsBasketballOutlinedIcon />
            Sports
          </Item>
        </Link>
        <Link
          to="/videos/search?tags=gaming"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Item>
            <SportsEsportsOutlinedIcon />
            Gaming
          </Item>
        </Link>
        <Link
          to="/videos/search?tags=movies"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Item>
            <MovieOutlinedIcon />
            Movies
          </Item>
        </Link>
        <Link
          to="/videos/search?tags=news"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Item>
            <ArticleOutlinedIcon />
            News
          </Item>
        </Link>
        <Link
          to="/videos/search?tags=tutorials"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Item>
            <VideoLibraryOutlinedIcon />
            Tutorials
          </Item>
        </Link>

        <Hr />
        <Link
          to="settings"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Item>
            <SettingsOutlinedIcon />
            Settings
          </Item>
        </Link>
        <Link to="report" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Item>
            <FlagOutlinedIcon />
            Report
          </Item>
        </Link>
        <Link to="help" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Item>
            <HelpOutlineOutlinedIcon />
            Help
          </Item>
        </Link>
      </Wrapper>
    </Container>
  );
}

export default SideBar;
