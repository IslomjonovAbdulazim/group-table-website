import React from 'react';
import { motion } from 'framer-motion';
import { Box, CircularProgress, Typography } from '@mui/material';

function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ 
          duration: 0.8, 
          ease: 'easeOut',
          rotate: { duration: 2, repeat: Infinity, ease: 'linear' }
        }}
      >
        <CircularProgress 
          size={80} 
          thickness={4}
          sx={{ 
            color: 'white',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
          }} 
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mt: 3, 
            color: 'white',
            fontWeight: 500,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          Loading GroupTable...
        </Typography>
      </motion.div>
    </Box>
  );
}

export default Loading;