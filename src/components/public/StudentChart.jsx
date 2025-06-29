import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
} from '@mui/material';
import { TrendingUp, TrendingDown, Remove, Person } from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';

function StudentChart({ studentData, chartData = [] }) {
  // Mock data if not provided
  const defaultData = [
    { lesson: 'Start', position: 5, points: 0, change: 0 },
    { lesson: 'Lesson 1', position: 4, points: 15, change: 1 },
    { lesson: 'Lesson 2', position: 3, points: 28, change: 1 },
    { lesson: 'Lesson 3', position: 2, points: 42, change: 1 },
    { lesson: 'Lesson 4', position: 1, points: 58, change: 1 },
    { lesson: 'Lesson 5', position: 1, points: 75, change: 0 },
  ];

  const data = chartData.length > 0 ? chartData : defaultData;
  const student = studentData || { name: 'Student Progress', avatar: 'S' };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp color="success" />;
    if (change < 0) return <TrendingDown color="error" />;
    return <Remove color="disabled" />;
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'success';
    if (change < 0) return 'error';
    return 'default';
  };

  const currentPosition = data[data.length - 1]?.position || 1;
  const currentPoints = data[data.length - 1]?.points || 0;
  const totalChange = data.length > 1 ? data[0].position - currentPosition : 0;

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card elevation={8} sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar 
                sx={{ 
                  width: 64, 
                  height: 64, 
                  bgcolor: 'primary.main', 
                  mr: 3,
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}
              >
                {student.avatar || <Person />}
              </Avatar>
              <Box flexGrow={1}>
                <Typography variant="h5" fontWeight="bold">
                  {student.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Performance Dashboard
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={2} mb={3}>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    #{currentPosition}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Current Rank
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight="bold" color="secondary.main">
                    {currentPoints}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Points
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center" display="flex" flexDirection="column" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <Typography variant="h4" fontWeight="bold" color={getChangeColor(totalChange)}>
                      {totalChange > 0 ? '+' : ''}{totalChange}
                    </Typography>
                    {getChangeIcon(totalChange)}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Overall Change
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card elevation={8} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  📈 Ranking Progress
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="lesson" />
                      <YAxis 
                        domain={['dataMin - 1', 'dataMax + 1']} 
                        reversed={true}
                        label={{ value: 'Position', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'position' ? `#${value}` : value,
                          name === 'position' ? 'Rank' : 'Points'
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="position"
                        stroke="#1976d2"
                        strokeWidth={4}
                        dot={{ fill: '#1976d2', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: '#1976d2', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={8} sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  💰 Points Earned
                </Typography>
                <Box height={200}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="lesson" tick={false} />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="points"
                        stroke="#66bb6a"
                        fill="url(#colorGradient)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#66bb6a" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#66bb6a" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>

            <Card elevation={8} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  🎯 Recent Performance
                </Typography>
                {data.slice(-3).reverse().map((lesson, index) => (
                  <Box key={lesson.lesson} display="flex" alignItems="center" mb={2}>
                    <Box
                      width={8}
                      height={8}
                      borderRadius="50%"
                      bgcolor="primary.main"
                      mr={2}
                      sx={{ opacity: 1 - (index * 0.3) }}
                    />
                    <Box flexGrow={1}>
                      <Typography variant="body2" fontWeight="medium">
                        {lesson.lesson}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Rank #{lesson.position}
                      </Typography>
                    </Box>
                    <Chip
                      icon={getChangeIcon(lesson.change)}
                      label={lesson.change === 0 ? '0' : `${lesson.change > 0 ? '+' : ''}${lesson.change}`}
                      size="small"
                      color={getChangeColor(lesson.change)}
                      variant="outlined"
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}

export default StudentChart;