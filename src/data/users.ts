import type { Role } from '../types';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // chỉ dùng cho bài thực hành, thực tế phải băm
  role: Role;
}

export const USERS: User[] = [
  {
    id: 'u1', name: 'Nguyễn Văn An', email: 'sv01@ptit.edu.vn',
    password: 'sv123456', role: 'student',
  },
  {
    id: 'u2', name: 'Trần Thị Bình', email: 'sv02@ptit.edu.vn',
    password: 'sv123456', role: 'student',
  },
  {
    id: 'u3', name: 'Quản trị Lab', email: 'admin@ptit.edu.vn',
    password: 'admin123', role: 'admin',
  },
];
