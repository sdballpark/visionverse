import styled from 'styled-components';

const StyledHeader = styled.header`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#ffffff'};
  padding: 1.5rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h1 {
    font-size: 2.5rem;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a1a'};
    margin: 0;
    font-weight: 700;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    color: ${props => props.theme === 'dark' ? '#818cf8' : '#6366f1'};
    font-size: 1.1rem;
    margin-top: 0.5rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
`;

export function Header({ theme }) {
  return (
    <StyledHeader theme={theme}>
      <h1>VisionVerse</h1>
      <p>Transform your images into beautiful, AI-generated poetry</p>
    </StyledHeader>
  );
}
