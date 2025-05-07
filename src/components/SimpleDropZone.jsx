import { useState } from 'react';
import styled from 'styled-components';

const StyledDropZone = styled.div`
  border: 2px dashed ${props => props.theme === 'dark' ? '#4f46e5' : '#6366f1'};
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a1a'};
  padding: 3rem 2rem;
  border-radius: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 2rem auto;
  max-width: 600px;

  &:hover {
    border-color: ${props => props.theme === 'dark' ? '#6366f1' : '#4f46e5'};
    transform: translateY(-2px);
  }

  ${props => props.$dragActive && `
    border-color: ${props => props.theme === 'dark' ? '#6366f1' : '#4f46e5'};
    background: ${props => props.theme === 'dark' ? '#242424' : '#f8fafc'};
  `}

  .icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1rem;
    color: ${props => props.theme === 'dark' ? '#6366f1' : '#4f46e5'};
  }

  .text {
    margin-bottom: 1.5rem;

    .title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: ${props => props.theme === 'dark' ? '#818cf8' : '#6366f1'};
      font-size: 0.9rem;
    }
  }

  .upload-button {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    background: ${props => props.theme === 'dark' ? '#6366f1' : '#4f46e5'};
    color: white;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background: ${props => props.theme === 'dark' ? '#4f46e5' : '#6366f1'};
      transform: translateY(-1px);
    }
  }
`;

export function SimpleDropZone({ onImageUpload, theme }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setDragActive(false);
  };

  return (
    <StyledDropZone
      theme={theme}
      $dragActive={dragActive}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleReset}
    >
      <div className="text">
        <div className="title">Upload an image</div>
        <div className="subtitle">Drag & drop or click to select an image</div>
      </div>
      <div className="flex justify-center">
        <label htmlFor="file-upload" className="upload-button">
          Browse files
        </label>
      </div>
      <input
        id="file-upload"
        name="file-upload"
        type="file"
        className="sr-only"
        onChange={handleChange}
        accept="image/*"
      />
    </StyledDropZone>
  );
}
