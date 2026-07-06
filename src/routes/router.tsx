import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import Landing from '@/pages/public/Landing';
import Login from '@/pages/auth/Login';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import FirstLoginPasswordChange from '@/pages/auth/FirstLoginPasswordChange';
import InactiveAccount from '@/pages/auth/InactiveAccount';

import StudentDashboard from '@/pages/student/Dashboard';
import LiveClasses from '@/pages/student/LiveClasses';
import LearningHub from '@/pages/student/LearningHub';
import LearningHubDetail from '@/pages/student/LearningHubDetail';
import PuzzlePractice from '@/pages/student/PuzzlePractice';
import PuzzleDetail from '@/pages/student/PuzzleDetail';
import WeeklyUpdates from '@/pages/student/WeeklyUpdates';
import MyProgress from '@/pages/student/MyProgress';
import Profile from '@/pages/student/Profile';

import AdminDashboard from '@/pages/admin/Dashboard';
import StudentManagement from '@/pages/admin/StudentManagement';
import StudentDetail from '@/pages/admin/StudentDetail';
import Payments from '@/pages/admin/Payments';
import PrivateNotes from '@/pages/admin/PrivateNotes';
import WeeklyUpdatesManager from '@/pages/admin/WeeklyUpdatesManager';
import LiveClassesManager from '@/pages/admin/LiveClassesManager';
import LearningContentManager from '@/pages/admin/LearningContentManager';
import PuzzleManager from '@/pages/admin/PuzzleManager';
import Announcements from '@/pages/admin/Announcements';
import AdminSettings from '@/pages/admin/Settings';

const student = (el: React.ReactNode) => <ProtectedRoute role="student">{el}</ProtectedRoute>;
const admin = (el: React.ReactNode) => <ProtectedRoute role="admin">{el}</ProtectedRoute>;

export const router = createBrowserRouter([
  { path: '/', element: <Landing /> },

  { path: '/login', element: <Login /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/first-login', element: <FirstLoginPasswordChange /> },
  { path: '/inactive-account', element: <InactiveAccount /> },

  { path: '/student/dashboard', element: student(<StudentDashboard />) },
  { path: '/student/live-classes', element: student(<LiveClasses />) },
  { path: '/student/learning-hub', element: student(<LearningHub />) },
  { path: '/student/learning-hub/:id', element: student(<LearningHubDetail />) },
  { path: '/student/puzzles', element: student(<PuzzlePractice />) },
  { path: '/student/puzzles/:id', element: student(<PuzzleDetail />) },
  { path: '/student/weekly-updates', element: student(<WeeklyUpdates />) },
  { path: '/student/progress', element: student(<MyProgress />) },
  { path: '/student/profile', element: student(<Profile />) },

  { path: '/admin/dashboard', element: admin(<AdminDashboard />) },
  { path: '/admin/students', element: admin(<StudentManagement />) },
  { path: '/admin/students/:id', element: admin(<StudentDetail />) },
  { path: '/admin/payments', element: admin(<Payments />) },
  { path: '/admin/private-notes', element: admin(<PrivateNotes />) },
  { path: '/admin/weekly-updates', element: admin(<WeeklyUpdatesManager />) },
  { path: '/admin/live-classes', element: admin(<LiveClassesManager />) },
  { path: '/admin/learning-content', element: admin(<LearningContentManager />) },
  { path: '/admin/puzzles', element: admin(<PuzzleManager />) },
  { path: '/admin/announcements', element: admin(<Announcements />) },
  { path: '/admin/settings', element: admin(<AdminSettings />) },
]);
