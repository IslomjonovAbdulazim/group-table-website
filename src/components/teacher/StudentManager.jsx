import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { Add, Delete, Person, Edit } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const studentSchema = z.object({
  full_name: z.string().min(1, 'Student name is required'),
});

function StudentManager({ groupId, students = [], onAddStudent, onDeleteStudent }) {
  const [openDialog, setOpenDialog] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(studentSchema),
  });

  const onSubmit = async (data) => {
    await onAddStudent(groupId, data);
    setOpenDialog(false);
    reset();
  };

  const handleDelete = (studentId) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      onDeleteStudent(studentId);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">
          Students ({students.length}/30)
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          disabled={students.length >= 30}
        >
          Add Student
        </Button>
      </Box>

      <Card>
        <CardContent>
          {students.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" mb={1}>
                No students yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add your first student to get started
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Added</TableCell>
                    <TableCell>Performance</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      component={TableRow}
                      hover
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                            {student.full_name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography fontWeight="medium">
                              {student.full_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {student.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(student.added_at).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="85%"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(student.id)}
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Student</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              {...register('full_name')}
              label="Student Full Name"
              fullWidth
              margin="normal"
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
              autoFocus
              placeholder="e.g. John Smith"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Student'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default StudentManager;