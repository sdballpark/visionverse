import { useEffect, useRef } from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const spinnerRef = useRef(null);

  useEffect(() => {
    const animation = spinnerRef.current.animate(
      [
        { transform: 'rotate(0deg)', opacity: 1 },
        { transform: 'rotate(360deg)', opacity: 0.8 }
      ],
      {
        duration: 1200,
        iterations: Infinity,
        easing: 'linear'
      }
    );

    return () => {
      animation.cancel();
    };
  }, []);

  return (
    <div
      ref={spinnerRef}
      style={{
        width: size === 'small' ? '20px' : size === 'large' ? '60px' : '40px',
        height: size === 'small' ? '20px' : size === 'large' ? '60px' : '40px',
        border: '4px solid rgba(52, 152, 219, 0.3)',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        position: 'relative',
        animation: 'spin 1s linear infinite'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        border: '4px solid rgba(52, 152, 219, 0.1)',
        borderTop: '4px solid rgba(52, 152, 219, 0.3)',
        borderRadius: '50%',
        animation: 'spin 1.5s linear infinite'
      }} />
    </div>
  );
};

export default LoadingSpinner;
