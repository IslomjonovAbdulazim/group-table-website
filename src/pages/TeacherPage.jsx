import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add,
  Group,
  Person,
  Book,
  Assessment,
  ContentCopy,
  Edit,
  Delete,
  Leaderboard,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApi } from '../hooks/useApi';
import { teacherAPI } from '../services/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const groupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
});

function TeacherPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { createQuery, createMutation } = useApi();

  const { data: groups = [] } = createQuery(
    ['groups'],
    () => teacherAPI.getGroups().then(res => res.data)
  );

  const createGroupMutation = createMutation(
    (data) => teacherAPI.createGroup(data),
    {
      successMessage: 'Group created successfully',
      invalidateQueries: ['groups'],
      onSuccess: () => {
        setOpenDialog(false);
        reset();
      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(groupSchema),
  });

  const onSubmit = (data) => {
    createGroupMutation.mutate(data);
  };

  const copyGroupCode = (code) => {
    navigator.clipboard.writeText(`${window.location.origin}/public/${code}`);
    toast.success('Group link copied to clipboard!');
  };

  const stats = [
    { title: 'Active Groups', value: groups.filter(g => g.is_active).length, icon: Group, color: '#1976d2' },
    { title: 'Total Students', value: 45, icon: Person, color: '#66bb6a' },
    { title: 'Modules', value: 8, icon: Book, color: '#ff7043' },
    { title: 'Avg. Score', value: '87%', icon: Assessment, color: '#ab47bc' },
  ];

  const chartData = [
    { name: 'Week 1', score: 75 },
    { name: 'Week 2', score: 82 },
    { name: 'Week 3', score: 78 },
    { name: 'Week 4', score: 85 },
    { name: 'Week 5', score: 90 },
    { name: 'Week 6', score: 87 },
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
            Teacher Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            Create Group
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

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Your Groups
                  </Typography>
                  
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Group Name</TableCell>
                          <TableCell>Code</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Students</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {groups.map((group, index) => (
                          <motion.tr
                            key={group.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            component={TableRow}
                          >
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                  <Group />
                                </Avatar>
                                <Typography fontWeight="medium">
                                  {group.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={group.code}
                                variant="outlined"
                                size="small"
                                onClick={() => copyGroupCode(group.code)}
                                icon={<ContentCopy />}
                                sx={{ cursor: 'pointer' }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={group.is_active ? 'Active' : 'Finished'}
                                color={group.is_active ? 'success' : 'default'}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>12</TableCell>
                            <TableCell align="right">
                              <IconButton size="small">
                                <Leaderboard />
                              </IconButton>
                              <IconButton size="small">
                                <Edit />
                              </IconButton>
                              <IconButton size="small" color="error">
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Performance Trend
                  </Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#1976d2" 
                          strokeWidth={3}
                          dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* Create Group Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Group</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              {...register('name')}
              label="Group Name"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
              placeholder="e.g. Math Grade 10A"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              Create Group
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default TeacherPage;