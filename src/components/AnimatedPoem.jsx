import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const PoemContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: ${props => props.theme === 'light' ? '#fff' : '#333'};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const PoemTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const PoemLine = styled.span`
  display: block;
  font-size: 1.1rem;
  line-height: 1.6;
  animation: ${fadeIn} 0.8s ease-out;
  animation-delay: ${props => props.delay}s;
`;

const AnimatedPoem = ({ poem, theme }) => {
  if (!poem) return null;

  return (
    <PoemContainer theme={theme}>
      <PoemTitle>Generated Poem:</PoemTitle>
      <div>
        {poem.split('\n').map((line, index) => (
          <PoemLine key={index} delay={index * 0.2}>
            {line}
          </PoemLine>
        ))}
      </div>
    </PoemContainer>
  );
};

export default AnimatedPoem;
