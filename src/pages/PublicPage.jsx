import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
} from '@mui/material';
import {
  EmojiEvents,
  TrendingUp,
  School,
  Stars,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApi } from '../hooks/useApi';
import { publicAPI } from '../services/api';

function PublicPage() {
  const { code } = useParams();
  const [selectedModule, setSelectedModule] = useState('');
  const { createQuery } = useApi();

  const { data: group, isLoading: groupLoading } = createQuery(
    ['public-group', code],
    () => publicAPI.getGroupByCode(code).then(res => res.data),
    { enabled: !!code }
  );

  const { data: modules = [] } = createQuery(
    ['public-modules', code],
    () => publicAPI.getGroupModules(code).then(res => res.data),
    { enabled: !!code }
  );

  const { data: leaderboard = [] } = createQuery(
    ['public-leaderboard', code, selectedModule],
    () => publicAPI.getModuleLeaderboard(code, selectedModule).then(res => res.data),
    { enabled: !!code && !!selectedModule }
  );

  // Mock chart data
  const chartData = leaderboard.slice(0, 5).map(student => ({
    name: student.name?.split(' ')[0] || 'Student',
    points: student.total_points || 0
  }));

  const getRankColor = (position) => {
    switch (position) {
      case 1: return '#ffd700';
      case 2: return '#c0c0c0';
      case 3: return '#cd7f32';
      default: return '#1976d2';
    }
  };

  const getRankIcon = (position) => {
    if (position <= 3) return <EmojiEvents />;
    return <Stars />;
  };

  if (groupLoading) {
    return (
      <Container maxWidth="lg">
        <Box py={8} textAlign="center">
          <Typography variant="h6">Loading group...</Typography>
        </Box>
      </Container>
    );
  }

  if (!group) {
    return (
      <Container maxWidth="lg">
        <Box py={8}>
          <Alert severity="error">Group not found</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={12}
            sx={{
              p: 4,
              mb: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
            }}
          >
            <Box textAlign="center" mb={4}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  margin: '0 auto',
                  mb: 2,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                }}
              >
                <School sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" fontWeight="bold" color="primary" mb={1}>
                {group.name}
              </Typography>
              <Chip
                label={`Group Code: ${group.code}`}
                variant="outlined"
                size="large"
                sx={{ fontSize: '1rem', px: 2 }}
              />
            </Box>

            {modules.length > 0 && (
              <Box mb={4}>
                <FormControl fullWidth sx={{ maxWidth: 300, margin: '0 auto' }}>
                  <InputLabel>Select Module</InputLabel>
                  <Select
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    label="Select Module"
                  >
                    {modules.map((module) => (
                      <MenuItem key={module.id} value={module.id}>
                        {module.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Paper>

          {selectedModule && leaderboard.length > 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <Card elevation={8} sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
                        🏆 Leaderboard
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Rank</TableCell>
                              <TableCell>Student</TableCell>
                              <TableCell align="right">Points</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {leaderboard.map((student, index) => (
                              <motion.tr
                                key={student.student_id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                component={TableRow}
                                sx={{
                                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04)' },
                                  ...(student.position <= 3 && {
                                    bgcolor: `${getRankColor(student.position)}10`,
                                  }),
                                }}
                              >
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <Avatar
                                      sx={{
                                        bgcolor: getRankColor(student.position),
                                        width: 40,
                                        height: 40,
                                        mr: 2,
                                      }}
                                    >
                                      {student.position <= 3 ? (
                                        getRankIcon(student.position)
                                      ) : (
                                        student.position
                                      )}
                                    </Avatar>
                                    <Typography fontWeight="bold">
                                      #{student.position}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="h6" fontWeight="medium">
                                    {student.name}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Chip
                                    label={`${student.total_points} pts`}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 'bold' }}
                                  />
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
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <Card elevation={8} sx={{ borderRadius: 3, mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" mb={3} textAlign="center">
                        📊 Top 5 Performance
                      </Typography>
                      <Box height={300}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                              dataKey="points"
                              fill="url(#colorGradient)"
                              radius={[4, 4, 0, 0]}
                            />
                            <defs>
                              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#42a5f5" stopOpacity={0.6} />
                              </linearGradient>
                            </defs>
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card elevation={8} sx={{ borderRadius: 3 }}>
                    <CardContent textAlign="center">
                      <TrendingUp sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" fontWeight="bold" mb={1}>
                        Keep Learning!
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Every point counts towards your success
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          )}

          {modules.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card elevation={8}>
                <CardContent textAlign="center" py={8}>
                  <School sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h5" fontWeight="bold" mb={2}>
                    No modules available yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Your teacher will add modules and lessons soon!
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  );
}

export default PublicPage;