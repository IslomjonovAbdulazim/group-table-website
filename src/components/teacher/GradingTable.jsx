import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import { Save, Leaderboard, Assessment, TrendingUp } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function GradingTable({ 
  students = [], 
  criteria = [], 
  lessons = [], 
  grades = {},
  onGradeChange,
  onSaveGrades 
}) {
  const [selectedLesson, setSelectedLesson] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [gradeInputs, setGradeInputs] = useState({});

  const handleGradeInput = (studentId, criteriaId, value) => {
    const key = `${studentId}-${criteriaId}-${selectedLesson}`;
    setGradeInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveGrades = () => {
    const gradesToSave = Object.entries(gradeInputs).map(([key, points]) => {
      const [studentId, criteriaId, lessonId] = key.split('-');
      return {
        student_id: parseInt(studentId),
        criteria_id: parseInt(criteriaId),
        lesson_id: parseInt(lessonId),
        points_earned: parseInt(points) || 0
      };
    });
    onSaveGrades(gradesToSave);
    setGradeInputs({});
  };

  // Mock leaderboard data
  const leaderboardData = students.map((student, index) => ({
    name: student.full_name,
    points: Math.floor(Math.random() * 100) + 50,
    position: index + 1
  })).sort((a, b) => b.points - a.points);

  const chartData = leaderboardData.slice(0, 5).map(student => ({
    name: student.name.split(' ')[0],
    points: student.points
  }));

  return (
    <Box>
      <Card>
        <CardContent>
          <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)} sx={{ mb: 3 }}>
            <Tab label="Grading" icon={<Assessment />} />
            <Tab label="Leaderboard" icon={<Leaderboard />} />
            <Tab label="Analytics" icon={<TrendingUp />} />
          </Tabs>

          {selectedTab === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Grade Students
                </Typography>
                <Box display="flex" gap={2} alignItems="center">
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Select Lesson</InputLabel>
                    <Select
                      value={selectedLesson}
                      onChange={(e) => setSelectedLesson(e.target.value)}
                      label="Select Lesson"
                    >
                      {lessons.map((lesson) => (
                        <MenuItem key={lesson.id} value={lesson.id}>
                          {lesson.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={saveGrades}
                    disabled={!selectedLesson || Object.keys(gradeInputs).length === 0}
                  >
                    Save Grades
                  </Button>
                </Box>
              </Box>

              {selectedLesson ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Student</TableCell>
                        {criteria.map((criterion) => (
                          <TableCell key={criterion.id} align="center">
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {criterion.name}
                              </Typography>
                              <Chip
                                label={`${criterion.max_points} pts`}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </TableCell>
                        ))}
                        <TableCell align="center">Total</TableCell>
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
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar sx={{ mr: 2, bgcolor: 'secondary.main', width: 32, height: 32 }}>
                                {student.full_name.charAt(0)}
                              </Avatar>
                              <Typography variant="body2" fontWeight="medium">
                                {student.full_name}
                              </Typography>
                            </Box>
                          </TableCell>
                          {criteria.map((criterion) => {
                            const key = `${student.id}-${criterion.id}-${selectedLesson}`;
                            const currentGrade = gradeInputs[key] || 
                              grades[`${student.id}-${criterion.id}-${selectedLesson}`] || '';
                            
                            return (
                              <TableCell key={criterion.id} align="center">
                                <TextField
                                  size="small"
                                  type="number"
                                  value={currentGrade}
                                  onChange={(e) => handleGradeInput(student.id, criterion.id, e.target.value)}
                                  inputProps={{ 
                                    min: 0, 
                                    max: criterion.max_points,
                                    style: { textAlign: 'center' }
                                  }}
                                  sx={{ width: 80 }}
                                />
                              </TableCell>
                            );
                          })}
                          <TableCell align="center">
                            <Chip
                              label={`${Math.floor(Math.random() * 50) + 20}`}
                              color="primary"
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box textAlign="center" py={6}>
                  <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" mb={1}>
                    Select a Lesson to Start Grading
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose a lesson from the dropdown above
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {selectedTab === 1 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Current Leaderboard
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell>Student</TableCell>
                      <TableCell align="right">Points</TableCell>
                      <TableCell align="right">Progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaderboardData.map((student, index) => (
                      <motion.tr
                        key={student.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        component={TableRow}
                      >
                        <TableCell>
                          <Avatar
                            sx={{
                              bgcolor: index < 3 ? '#ffd700' : 'primary.main',
                              width: 32,
                              height: 32
                            }}
                          >
                            {index + 1}
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="medium">{student.name}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${student.points} pts`}
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${Math.floor((student.points / 150) * 100)}%`}
                            color="success"
                            size="small"
                          />
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {selectedTab === 2 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Performance Analytics
              </Typography>
              <Box height={400}>
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
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default GradingTable;