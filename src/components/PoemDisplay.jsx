import { useState, useEffect } from 'react';
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10a3 3 0 003-3V9.75a3 3 0 00-3-3V6.75A5.25 5.25 0 0012 1.5zm-3 10.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clipRule="evenodd" />
  </svg>
);

export function PoemDisplay({ imageFile, poem, theme, onReset, onDownload, metadata, loading }) {
  console.log('PoemDisplay render:', { imageFile: !!imageFile, poem: !!poem });
  const [isDownloading, setIsDownloading] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [error, setError] = useState(null);

  const downloadPoem = () => {
    if (!poem) return;

    setIsDownloading(true);
    try {
      // Create a blob from the poem text
      const blob = new Blob([poem], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link
      const a = document.createElement('a');
      a.href = url;
      a.download = `poem_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading poem:', error);
      setError('Failed to download poem');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Generated Poem</h2>
        <div className="flex space-x-2">
          {/* Download Poem */}
          <button
            onClick={downloadPoem}
            disabled={isDownloading || loading}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            title="Download poem as text file"
          >
            <DownloadIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Download Image */}
          <button
            onClick={() => {
              if (!imageFile) return;
              const url = URL.createObjectURL(imageFile);
              const a = document.createElement('a');
              a.href = url;
              a.download = imageFile.name;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Download original image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 9 15.5 9 14 9.67 14 10.5 14.67 12 15.5 12zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 9 8.5 9 7 9.67 7 10.5 7.67 12 8.5 12zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </button>

          {/* Reset */}
          <button
            onClick={() => {
              console.log('Reset button clicked');
              onReset();
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Clear current image and poem"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Show/hide metadata"
          >
            <InformationCircleIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative w-full h-auto max-h-[400px] rounded-lg overflow-hidden">
          {imageFile && (
            <div className="relative w-full h-auto">
              <img
                src={imageFile}
                alt="Poem inspiration image"
                className="w-full h-auto max-h-[400px] object-contain"
                onError={(e) => {
                  console.error('Failed to load image:', e);
                  setError('Failed to load image. Please try another image.');
                  // Try to reload the image after a short delay
                  setTimeout(() => {
                    const img = e.target;
                    img.src = imageFile;
                  }, 1000);
                }}
              />
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center h-12">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center mt-4">
              {error}
            </div>
          )}
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-800 dark:text-white whitespace-pre-line">
            {loading ? 'Generating poem...' : poem}
          </p>
        </div>

        {showMetadata && metadata && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">Metadata</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>Model: {metadata.model}</p>
              <p>Generated: {new Date(metadata.timestamp).toLocaleString()}</p>
              <p>Image Type: {metadata.imageType}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
