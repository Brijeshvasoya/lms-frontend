import React from 'react';
import { ClipLoader } from 'react-spinners';

const Spinner = ({
  size = 50,
  color = '#4169E1',
  loading = true,
  className = '',
  zIndex = 9999,
  ...props
}) => {
  const spinnerContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: zIndex,
    // backgroundColor: 'rgba(255, 255, 255, 0.5)', // Optional: semi-transparent background
  };

  return (
    <div className={`spinner-container ${className}`} style={spinnerContainerStyle}>
      {loading ? (
        <ClipLoader
          color={color}
          size={size}
          aria-label="Loading Spinner"
          data-testid="loader"
          {...props}
        />
      ) : null}
    </div>
  );
};

export default Spinner;