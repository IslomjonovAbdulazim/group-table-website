import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import { EmojiEvents, TrendingUp, Stars } from '@mui/icons-material';

function Leaderboard({ students = [], maxPoints = 100 }) {
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
    return position;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  return (
    <Card elevation={8} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" fontWeight="bold" color="primary" mb={1}>
            🏆 Leaderboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Top performers in this module
          </Typography>
        </Box>

        <List sx={{ p: 0 }}>
          {students.map((student, index) => {
            const percentage = Math.round((student.total_points / maxPoints) * 100);
            
            return (
              <motion.div
                key={student.student_id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <ListItem
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: student.position <= 3 ? `${getRankColor(student.position)}10` : 'transparent',
                    border: student.position <= 3 ? `2px solid ${getRankColor(student.position)}30` : '1px solid #e0e0e0',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: getRankColor(student.position),
                        width: 56,
                        height: 56,
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: student.position === 3 ? 'white' : '#333',
                        border: '3px solid white',
                        boxShadow: 2
                      }}
                    >
                      {getRankIcon(student.position)}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="h6" fontWeight="bold" mr={2}>
                          {student.name}
                        </Typography>
                        {student.position <= 3 && (
                          <Chip
                            icon={<Stars />}
                            label={`#${student.position}`}
                            size="small"
                            sx={{
                              bgcolor: getRankColor(student.position),
                              color: student.position === 3 ? 'white' : '#333',
                              fontWeight: 'bold'
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body2" color="text.secondary">
                            Progress: {percentage}%
                          </Typography>
                          <Chip
                            label={`${student.total_points} points`}
                            color="primary"
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          color={getProgressColor(percentage)}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(0,0,0,0.1)'
                          }}
                        />
                      </Box>
                    }
                  />
                  
                  {student.position <= 3 && (
                    <Box ml={2}>
                      <TrendingUp 
                        sx={{ 
                          color: 'success.main',
                          fontSize: 24,
                          animation: 'pulse 2s infinite'
                        }} 
                      />
                    </Box>
                  )}
                </ListItem>
              </motion.div>
            );
          })}
        </List>

        {students.length === 0 && (
          <Box textAlign="center" py={6}>
            <EmojiEvents sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" mb={1}>
              No rankings yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Students will appear here once grading begins
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default Leaderboard;