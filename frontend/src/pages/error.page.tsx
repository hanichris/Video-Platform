import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ErrorPage() {
  return (
    <Container>
      <div className="rounded-md bg-red-50 max-w-lg p-10">
        <div className="flex">
          <div className="flex-shrink-0" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error 404</h3>
            <p className="text-sm text-red-700 mt-2">Page not found</p>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ErrorPage;
