import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Avatar,
  Alert,
} from '@mui/material';
import {
  Add,
  Person,
  School,
  Edit,
  Delete,
  BarChart,
  PeopleAlt,
} from '@mui/icons-material';
import { useApi } from '../hooks/useApi';
import { adminAPI } from '../services/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const teacherSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

function AdminPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const { createQuery, createMutation } = useApi();

  const { data: teachers = [], isLoading } = createQuery(
    ['teachers'],
    () => adminAPI.getTeachers().then(res => res.data)
  );

  const createTeacherMutation = createMutation(
    (data) => adminAPI.createTeacher(data),
    {
      successMessage: 'Teacher created successfully',
      invalidateQueries: ['teachers'],
      onSuccess: () => {
        setOpenDialog(false);
        reset();
      }
    }
  );

  const deleteTeacherMutation = createMutation(
    (id) => adminAPI.deleteTeacher(id),
    {
      successMessage: 'Teacher deleted successfully',
      invalidateQueries: ['teachers'],
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(teacherSchema),
  });

  const onSubmit = (data) => {
    createTeacherMutation.mutate(data);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      deleteTeacherMutation.mutate(id);
    }
  };

  const stats = [
    { title: 'Total Teachers', value: teachers.length, icon: Person, color: '#1976d2' },
    { title: 'Active Groups', value: 24, icon: PeopleAlt, color: '#66bb6a' },
    { title: 'Total Students', value: 156, icon: School, color: '#ff7043' },
    { title: 'Avg. Performance', value: '85%', icon: BarChart, color: '#ab47bc' },
  ];

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Admin Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            Add Teacher
          </Button>
        </Box>

        <Grid container spacing={3} mb={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                    border: `1px solid ${stat.color}20`
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="h4" fontWeight="bold" color={stat.color}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.title}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                        <stat.icon sx={{ fontSize: 28 }} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Teachers Management
              </Typography>
              
              {isLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <Typography>Loading teachers...</Typography>
                </Box>
              ) : teachers.length === 0 ? (
                <Alert severity="info">No teachers found. Add your first teacher!</Alert>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Teacher</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teachers.map((teacher, index) => (
                        <motion.tr
                          key={teacher.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          component={TableRow}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                {teacher.name.charAt(0)}
                              </Avatar>
                              <Typography fontWeight="medium">
                                {teacher.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{teacher.email}</TableCell>
                          <TableCell>
                            <Chip
                              label="Active"
                              color="success"
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton 
                              size="small"
                              onClick={() => setEditingTeacher(teacher)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton 
                              size="small"
                              color="error"
                              onClick={() => handleDelete(teacher.id)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Add Teacher Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Teacher</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              {...register('name')}
              label="Full Name"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              {...register('email')}
              label="Email Address"
              type="email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              {...register('password')}
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              Create Teacher
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default AdminPage;