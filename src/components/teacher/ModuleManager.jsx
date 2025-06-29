import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Add,
  Book,
  Assignment,
  CheckCircle,
  PlayArrow,
  Stop,
  School,
  Grade,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const moduleSchema = z.object({
  name: z.string().min(1, 'Module name is required'),
});

const lessonSchema = z.object({
  name: z.string().min(1, 'Lesson name is required'),
});

const criteriaSchema = z.object({
  name: z.string().min(1, 'Criteria name is required'),
  max_points: z.number().min(1, 'Max points must be at least 1'),
  grading_method: z.enum(['one_by_one', 'bulk']),
});

function ModuleManager({ 
  groupId, 
  modules = [], 
  selectedModule,
  onCreateModule,
  onSelectModule,
  onFinishModule 
}) {
  const [openDialog, setOpenDialog] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const {
    register: registerModule,
    handleSubmit: handleModuleSubmit,
    reset: resetModule,
    formState: { errors: moduleErrors, isSubmitting: moduleSubmitting },
  } = useForm({ resolver: zodResolver(moduleSchema) });

  const {
    register: registerLesson,
    handleSubmit: handleLessonSubmit,
    reset: resetLesson,
    formState: { errors: lessonErrors, isSubmitting: lessonSubmitting },
  } = useForm({ resolver: zodResolver(lessonSchema) });

  const {
    register: registerCriteria,
    handleSubmit: handleCriteriaSubmit,
    reset: resetCriteria,
    formState: { errors: criteriaErrors, isSubmitting: criteriaSubmitting },
  } = useForm({ resolver: zodResolver(criteriaSchema) });

  const onModuleSubmit = async (data) => {
    await onCreateModule(groupId, data);
    setOpenDialog(null);
    resetModule();
  };

  const activeModule = modules.find(m => m.is_active);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">
          Modules & Content
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog('module')}
          disabled={!!activeModule}
        >
          Create Module
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Modules
              </Typography>
              {modules.length === 0 ? (
                <Box textAlign="center" py={3}>
                  <Book sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No modules created yet
                  </Typography>
                </Box>
              ) : (
                <List>
                  {modules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ListItem
                        button
                        selected={selectedModule?.id === module.id}
                        onClick={() => onSelectModule(module)}
                        sx={{ borderRadius: 1, mb: 1 }}
                      >
                        <ListItemIcon>
                          <Book color={module.is_active ? 'primary' : 'disabled'} />
                        </ListItemIcon>
                        <ListItemText
                          primary={module.name}
                          secondary={
                            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                              <Chip
                                label={module.is_active ? 'Active' : module.is_finished ? 'Finished' : 'Draft'}
                                size="small"
                                color={module.is_active ? 'success' : module.is_finished ? 'default' : 'warning'}
                                variant="outlined"
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedModule ? (
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedModule.name}
                  </Typography>
                  {selectedModule.is_active && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Stop />}
                      onClick={() => onFinishModule(selectedModule.id)}
                    >
                      Finish Module
                    </Button>
                  )}
                </Box>

                <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)} sx={{ mb: 3 }}>
                  <Tab label="Lessons" icon={<School />} />
                  <Tab label="Criteria" icon={<Assignment />} />
                  <Tab label="Grading" icon={<Grade />} />
                </Tabs>

                {selectedTab === 0 && (
                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Lessons (5/15)
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<Add />}
                        onClick={() => setOpenDialog('lesson')}
                        disabled={!selectedModule.is_active}
                      >
                        Add Lesson
                      </Button>
                    </Box>
                    <List>
                      {[1, 2, 3, 4, 5].map((lesson) => (
                        <ListItem key={lesson} divider>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`Lesson ${lesson}: Introduction to Topic ${lesson}`}
                            secondary={`Created: ${new Date().toLocaleDateString()}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {selectedTab === 1 && (
                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Grading Criteria (3/6)
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<Add />}
                        onClick={() => setOpenDialog('criteria')}
                        disabled={!selectedModule.is_active}
                      >
                        Add Criteria
                      </Button>
                    </Box>
                    <List>
                      {[
                        { name: 'Participation', points: 10, method: 'one_by_one' },
                        { name: 'Homework', points: 20, method: 'bulk' },
                        { name: 'Quiz Performance', points: 15, method: 'one_by_one' },
                      ].map((criteria, index) => (
                        <ListItem key={index} divider>
                          <ListItemText
                            primary={criteria.name}
                            secondary={
                              <Box display="flex" gap={1} mt={0.5}>
                                <Chip label={`${criteria.points} pts`} size="small" />
                                <Chip 
                                  label={criteria.method === 'one_by_one' ? 'Individual' : 'Bulk'} 
                                  size="small" 
                                  variant="outlined" 
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {selectedTab === 2 && (
                  <Box textAlign="center" py={4}>
                    <Grade sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" mb={1}>
                      Grading Interface
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add lessons and criteria first, then start grading students
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Box textAlign="center" py={8}>
                  <Book sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" mb={1}>
                    Select a Module
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose a module from the left to view its content
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Dialogs */}
      <Dialog open={openDialog === 'module'} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Module</DialogTitle>
        <form onSubmit={handleModuleSubmit(onModuleSubmit)}>
          <DialogContent>
            <TextField
              {...registerModule('name')}
              label="Module Name"
              fullWidth
              margin="normal"
              error={!!moduleErrors.name}
              helperText={moduleErrors.name?.message}
              placeholder="e.g. Mathematics Basics"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={moduleSubmitting}>
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openDialog === 'lesson'} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Lesson</DialogTitle>
        <form onSubmit={handleLessonSubmit(() => setOpenDialog(null))}>
          <DialogContent>
            <TextField
              {...registerLesson('name')}
              label="Lesson Name"
              fullWidth
              margin="normal"
              error={!!lessonErrors.name}
              helperText={lessonErrors.name?.message}
              placeholder="e.g. Introduction to Algebra"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={lessonSubmitting}>
              Add Lesson
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default ModuleManager;