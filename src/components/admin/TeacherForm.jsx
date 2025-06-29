import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const teacherSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

function TeacherForm({ open, onClose, onSubmit, teacher = null, isSubmitting = false }) {
  const isEditing = !!teacher;
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teacherSchema),
    defaultValues: teacher || { name: '', email: '', password: '' },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data) => {
    onSubmit(data);
    if (!isEditing) {
      reset();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        {isEditing ? 'Edit Teacher' : 'Add New Teacher'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              {...register('name')}
              label="Full Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              autoFocus
            />
            
            <TextField
              {...register('email')}
              label="Email Address"
              type="email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            
            <TextField
              {...register('password')}
              label={isEditing ? 'New Password (optional)' : 'Password'}
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ minWidth: 120 }}
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TeacherForm;