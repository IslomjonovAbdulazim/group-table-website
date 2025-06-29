import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Avatar,
  Container
} from '@mui/material';
import { Logout, AdminPanelSettings, School } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

function Layout() {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
          >
            <Avatar 
              sx={{ 
                mr: 2, 
                bgcolor: 'rgba(255,255,255,0.2)',
                width: 40,
                height: 40
              }}
            >
              {user?.user_type === 'admin' ? <AdminPanelSettings /> : <School />}
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" fontWeight="bold">
                GroupTable
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {user?.user_type === 'admin' ? 'Admin Panel' : 'Teacher Dashboard'}
              </Typography>
            </Box>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              color="inherit" 
              onClick={logout}
              startIcon={<Logout />}
              sx={{ 
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Logout
            </Button>
          </motion.div>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </Container>
    </Box>
  );
}

export default Layout;