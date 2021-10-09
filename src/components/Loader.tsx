import ClipLoader from 'react-spinners/ClipLoader';
import styled from 'styled-components';

export function Loader() {
  return (
    <StyledLoader>
      <ClipLoader color="#b179d4" size={80} />
    </StyledLoader>
  );
}

const StyledLoader = styled.div`
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
