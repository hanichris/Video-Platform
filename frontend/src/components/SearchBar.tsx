import { useState } from 'react';
import styled from 'styled-components';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
`;

const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
`;

function SearchBar() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  return (
    <Container>
      <Search>
        <Input placeholder="Search" onChange={(e) => setQ(e.target.value)} />
        <SearchOutlinedIcon onClick={() => navigate(`/videos/search?q=${q}`)} />
      </Search>
    </Container>
  );
}

export default SearchBar;
