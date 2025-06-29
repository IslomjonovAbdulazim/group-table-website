import React from 'react';
import { motion } from 'framer-motion';
import { Grid, Card, CardContent, Typography, Avatar, Box, LinearProgress } from '@mui/material';
import { Group, Person, Book, Assessment, TrendingUp, EmojiEvents } from '@mui/icons-material';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard({ stats = {} }) {
  const dashboardStats = [
    { title: 'Active Groups', value: stats.groups || 3, icon: Group, color: '#1976d2' },
    { title: 'Total Students', value: stats.students || 45, icon: Person, color: '#66bb6a' },
    { title: 'Modules', value: stats.modules || 8, icon: Book, color: '#ff7043' },
    { title: 'Avg Score', value: '87%', icon: Assessment, color: '#ab47bc' },
  ];

  const performanceData = [
    { name: 'Week 1', score: 75, engagement: 80 },
    { name: 'Week 2', score: 82, engagement: 85 },
    { name: 'Week 3', score: 78, engagement: 75 },
    { name: 'Week 4', score: 85, engagement: 90 },
    { name: 'Week 5', score: 90, engagement: 88 },
    { name: 'Week 6', score: 87, engagement: 92 },
  ];

  const groupData = [
    { name: 'Math 10A', value: 30, color: '#1976d2' },
    { name: 'Math 10B', value: 25, color: '#66bb6a' },
    { name: 'Math 11A', value: 35, color: '#ff7043' },
    { name: 'Physics 12', value: 20, color: '#ab47bc' },
  ];

  const topStudents = [
    { name: 'Alice Johnson', points: 95, trend: '+5' },
    { name: 'Bob Smith', points: 92, trend: '+3' },
    { name: 'Carol Davis', points: 89, trend: '+2' },
    { name: 'David Wilson', points: 87, trend: '+1' },
  ];

  return (
    <Box>
      <Grid container spacing={3} mb={4}>
        {dashboardStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                sx={{ 
                  background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                  border: `1px solid ${stat.color}20`,
                  height: '100%'
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
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Performance Trends
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#1976d2" 
                        strokeWidth={3}
                        name="Average Score"
                        dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="engagement" 
                        stroke="#66bb6a" 
                        strokeWidth={3}
                        name="Engagement"
                        dot={{ fill: '#66bb6a', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Class Distribution
                </Typography>
                <Box height={200}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={groupData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {groupData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box mt={2}>
                  {groupData.map((group) => (
                    <Box key={group.name} display="flex" alignItems="center" mb={1}>
                      <Box
                        width={12}
                        height={12}
                        bgcolor={group.color}
                        borderRadius="50%"
                        mr={1}
                      />
                      <Typography variant="body2" flexGrow={1}>
                        {group.name}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {group.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Top Performers
                </Typography>
                {topStudents.map((student, index) => (
                  <Box key={student.name} display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2, bgcolor: index === 0 ? '#ffd700' : 'primary.main' }}>
                      {index === 0 ? <EmojiEvents /> : index + 1}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="body2" fontWeight="medium">
                        {student.name}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={student.points}
                        sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                      />
                    </Box>
                    <Box ml={2} textAlign="right">
                      <Typography variant="body2" fontWeight="bold">
                        {student.points}%
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="success.main"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <TrendingUp sx={{ fontSize: 12, mr: 0.5 }} />
                        {student.trend}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;