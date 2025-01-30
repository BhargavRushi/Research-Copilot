import React, { useState } from 'react';
import { CircularProgress, Box } from '@mui/material';

function Loader(props) {
  return (
    <div>
        {
            props.loading === true && 
            <>
                <Box
                    sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(3px)",
                    zIndex: 9999,
                    pointerEvents: 'none',
                    }}
                />

                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100vh"
                    sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10000, // Make sure the loader is on top
                    }}
                >
                    <CircularProgress size="3rem" sx={{color : "#092E5D"}} />
                </Box>
            </>
        }
    </div>
  );
}

export default Loader;
