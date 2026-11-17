import type { Role } from '@/types';

export type Action =
  | 'book:view'
  | 'loan:create'
  | 'loan:view-own'
  | 'loan:view-all'
  | 'loan:review';

const ALLOWED: Record<Action, Array<Role | 'guest'>> = {
  'book:view': ['guest', 'student', 'admin'],
  'loan:create': ['student'],
  'loan:view-own': ['student'],
  'loan:view-all': ['admin'],
  'loan:review': ['admin'],
};

export const can = (role: Role | undefined, action: Action): boolean =>
  ALLOWED[action].includes(role ?? 'guest');
