export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  youtube_url: string;
  enrolled?: number;
  progress?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}