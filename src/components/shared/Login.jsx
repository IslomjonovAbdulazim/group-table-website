import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Avatar,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

function Login() {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      await login(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ width: '100%' }}
        >
          <Paper 
            elevation={12} 
            sx={{ 
              p: 5, 
              backdropFilter: 'blur(10px)', 
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 3
            }}
          >
            <Box textAlign="center" mb={4}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    margin: '0 auto', 
                    mb: 2,
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)'
                  }}
                >
                  <LoginIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </motion.div>
              
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                GroupTable
              </Typography>
              <Typography variant="body1" color="text.secondary" mt={1}>
                Modern Classroom Management System
              </Typography>
            </Box>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <TextField
                  {...register('email')}
                  label="Email Address"
                  type="email"
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mb: 2 }}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <TextField
                  {...register('password')}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  sx={{ 
                    py: 1.5,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                    }
                  }}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </motion.div>
            </form>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
}

export default Login;