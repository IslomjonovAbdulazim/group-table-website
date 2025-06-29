// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_type: 'admin' | 'teacher';
}

export interface User {
  id: number;
  name: string;
  email: string;
}

// Group Types
export interface Group {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
}

export interface GroupInfo {
  id: number;
  name: string;
  code: string;
}

// Student Types
export interface Student {
  id: number;
  full_name: string;
}

export interface StudentResponse {
  id: number;
  full_name: string;
}

// Module Types
export interface Module {
  id: number;
  name: string;
  is_active: boolean;
  is_finished: boolean;
}

export interface ModuleInfo {
  id: number;
  name: string;
}

// Lesson Types
export interface Lesson {
  id: number;
  name: string;
  lesson_number: number;
  is_active: boolean;
}

// Criteria Types
export interface Criteria {
  id: number;
  name: string;
  max_points: number;
  grading_method: 'one_by_one' | 'bulk';
}

export interface CriteriaCreate {
  name: string;
  max_points: number;
  grading_method: string;
}

// Grade Types
export interface Grade {
  id: number;
  points_earned: number;
  student_id: number;
  criteria_id: number;
  lesson_id: number;
}

export interface GradeCreate {
  points_earned: number;
  student_id: number;
  criteria_id: number;
  lesson_id: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
  student_id: number;
  name: string;
  total_points: number;
  position: number;
}

// Chart Types
export interface ChartData {
  student_name: string;
  positions: Array<{
    lesson: string;
    position: number;
    change: number;
  }>;
}

// Teacher Types (for admin)
export interface Teacher {
  id: number;
  name: string;
  email: string;
}

export interface TeacherCreate {
  name: string;
  email: string;
  password: string;
}

export interface TeacherUpdate {
  name: string;
  email: string;
}

export interface TeacherStats {
  groups: number;
  students: number;
  modules: number;
  lessons: number;
  total_grades: number;
}

// Password Change Types
export interface PasswordChange {
  current_password: string;
  new_password: string;
}

export interface TeacherPasswordChange {
  new_password: string;
}

// Local Storage Types
export interface SavedGroup {
  code: string;
  name: string;
  savedAt: string;
}