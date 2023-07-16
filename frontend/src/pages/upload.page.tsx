import styled from 'styled-components';
import Upload from '../components/Upload';
import useStore from '../store';

const Container = styled.div`
  padding: 2em;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

function UploadPage() {
  const store = useStore();
  const channelId = store.currentChannel?._id || '';
  return (
    <Container>
      <Upload channelId={channelId} />
    </Container>
  );
}

export default UploadPage;
