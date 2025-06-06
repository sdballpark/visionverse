import { useState, useEffect } from 'react';
import { SimpleDropZone } from './components/SimpleDropZone';
import { PoemDisplay } from './components/PoemDisplay';
import { Header } from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import styled from 'styled-components';
import geminiService from './services/geminiService';

const Container = styled.div`
  min-height: 100vh;
  padding: 20px;
  background-color: ${props => props.theme === 'light' ? '#f5f5f5' : '#1a1a1a'};
  color: ${props => props.theme === 'light' ? '#333' : '#fff'};
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme === 'light' ? '#333' : '#fff'};
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  background-color: ${props => props.theme === 'light' ? '#e0e0e0' : '#333'};
`;

const ErrorDisplay = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  border: 1px solid #ffcdd2;
`;

const PoemContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: ${props => props.theme === 'light' ? '#fff' : '#333'};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

function App() {
  const [theme, setTheme] = useState('light');
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [poem, setPoem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function declarations
  const handleImageUpload = async (file) => {
    if (!file || !file.name) {
      setError('Invalid image file');
      return;
    }

    try {
      console.log('Setting image file:', file.name);
      setImageFile(file);
      setImageURL(URL.createObjectURL(file));
      setPoem(null);
      setError(null);
      setLoading(true);

      // Generate the poem using Gemini API
      const fileBuffer = await file.arrayBuffer();
      const base64Image = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
      
      // Log image data details
      console.log('Image data details:', {
        size: file.size,
        type: file.type,
        base64Length: base64Image.length
      });
      
      try {
        const result = await geminiService.generateContent(base64Image);
        setPoem(result);
      } catch (err) {
        console.error('Gemini API Error:', err);
        
        let errorMessage = 'Failed to generate poem using Gemini API.';
        if (err.message) {
          errorMessage = `Gemini API Error: ${err.message}`;
          if (err.message.includes('AIza')) {
            errorMessage += '\nPlease verify your Gemini API key in Vercel settings.';
          } else if (err.message.includes('invalid_api_key')) {
            errorMessage = 'Invalid Gemini API key format. Please verify your key starts with "AIza" in Vercel settings.';
          } else if (err.message.includes('rate_limit')) {
            errorMessage = 'Gemini API rate limit exceeded. Please wait a moment and try again.';
          } else if (err.message.includes('401')) {
            errorMessage = 'Unauthorized access. Please check your Gemini API key in Vercel settings.';
          } else if (err.message.includes('403')) {
            errorMessage = 'Forbidden access. Please check your Gemini API key permissions.';
          }
        }
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }
    }
  };

  const reset = () => {
    console.log('Resetting state');
    setImageFile(null);
    setPoem(null);
    setError(null);
    setLoading(false);
  };

  // Effect hooks
  useEffect(() => {
    if (imageFile) {
      console.log('Image file changed:', imageFile.name);
    }
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }
    };
  }, [imageFile]);

  // Render helper
  const renderPoemDisplay = (imageFile, poem) => {
    console.log('Rendering PoemDisplay with props:', {
      hasImage: !!imageFile,
      hasPoem: !!poem,
      poemLength: poem?.length
    });
    return (
      <PoemContainer theme={theme}>
        <PoemDisplay 
          imageFile={imageFile} 
          poem={poem} 
          theme={theme} 
          onReset={reset}
        />
      </PoemContainer>
    );
  };

  // Clean up image URL when component unmounts
  useEffect(() => {
    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }
    };
  }, [imageFile]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Container theme={theme}>
      <Content>
        <ThemeToggle onClick={toggleTheme}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </ThemeToggle>
        <Header theme={theme} />
        <SimpleDropZone 
          onImageUpload={handleImageUpload} 
          theme={theme}
        />
        {loading && (
          <div style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <LoadingSpinner />
            <p>Generating poem...</p>
          </div>
        )}
        {error && (
          <ErrorDisplay>
            {error}
          </ErrorDisplay>
        )}

        {imageFile && poem && (
          <PoemContainer theme={theme}>
            <PoemDisplay 
              imageFile={imageFile} 
              poem={poem} 
              theme={theme} 
              onReset={reset}
              loading={loading}
            />
          </PoemContainer>
        )}
      </Content>
    </Container>
  );
}

export default App;
