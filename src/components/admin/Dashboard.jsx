import React from 'react';
import { motion } from 'framer-motion';
import { Grid, Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import { Person, School, Assessment, TrendingUp } from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard({ stats = {} }) {
  const dashboardStats = [
    { title: 'Total Teachers', value: stats.teachers || 0, icon: Person, color: '#1976d2' },
    { title: 'Active Groups', value: stats.groups || 0, icon: School, color: '#66bb6a' },
    { title: 'Total Students', value: stats.students || 0, icon: Assessment, color: '#ff7043' },
    { title: 'Avg Performance', value: '87%', icon: TrendingUp, color: '#ab47bc' },
  ];

  const chartData = [
    { month: 'Jan', students: 120, teachers: 8 },
    { month: 'Feb', students: 135, teachers: 9 },
    { month: 'Mar', students: 148, teachers: 10 },
    { month: 'Apr', students: 162, teachers: 12 },
    { month: 'May', students: 158, teachers: 11 },
    { month: 'Jun', students: 174, teachers: 13 },
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Growth Analytics
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stackId="1"
                    stroke="#1976d2"
                    fill="url(#colorStudents)"
                  />
                  <Area
                    type="monotone"
                    dataKey="teachers"
                    stackId="1"
                    stroke="#66bb6a"
                    fill="url(#colorTeachers)"
                  />
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#66bb6a" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#66bb6a" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}

export default Dashboard;