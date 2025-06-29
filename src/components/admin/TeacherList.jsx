import React from 'react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  IconButton,
  Chip,
  Box,
} from '@mui/material';
import { Edit, Delete, BarChart } from '@mui/icons-material';

function TeacherList({ teachers, onEdit, onDelete, onViewStats }) {
  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Teacher</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Groups</TableCell>
            <TableCell>Students</TableCell>
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
              hover
            >
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {teacher.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography fontWeight="medium">{teacher.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {teacher.id}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>
                <Chip
                  label={teacher.groupsCount || 0}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={teacher.studentsCount || 0}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              </TableCell>
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
                  onClick={() => onViewStats(teacher)}
                  color="info"
                >
                  <BarChart />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => onEdit(teacher)}
                  color="primary"
                >
                  <Edit />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => onDelete(teacher.id)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TeacherList;