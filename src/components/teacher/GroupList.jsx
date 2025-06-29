import React from 'react';
import { motion } from 'framer-motion';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Avatar,
  Button,
} from '@mui/material';
import {
  Group,
  ContentCopy,
  Edit,
  Delete,
  Visibility,
  Settings,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

function GroupList({ groups, onEdit, onDelete, onView }) {
  const copyGroupCode = (code) => {
    const url = `${window.location.origin}/public/${code}`;
    navigator.clipboard.writeText(url);
    toast.success('Group link copied to clipboard!');
  };

  return (
    <Grid container spacing={3}>
      {groups.map((group, index) => (
        <Grid item xs={12} sm={6} lg={4} key={group.id}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              sx={{ 
                height: '100%',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <Group />
                  </Avatar>
                  <Box flexGrow={1}>
                    <Typography variant="h6" fontWeight="bold" noWrap>
                      {group.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(group.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                <Box mb={3}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary" mr={1}>
                      Code:
                    </Typography>
                    <Chip
                      label={group.code}
                      size="small"
                      variant="outlined"
                      icon={<ContentCopy />}
                      onClick={() => copyGroupCode(group.code)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Box>
                  <Chip
                    label={group.is_active ? 'Active' : 'Finished'}
                    color={group.is_active ? 'success' : 'default'}
                    size="small"
                    variant="filled"
                  />
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Students: 12 | Modules: 3
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Button
                    startIcon={<Visibility />}
                    size="small"
                    onClick={() => onView(group)}
                  >
                    View
                  </Button>
                  <Box>
                    <IconButton size="small" onClick={() => onEdit(group)}>
                      <Settings />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => onDelete(group.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}

export default GroupList;