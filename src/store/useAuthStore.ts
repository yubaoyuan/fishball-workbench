import { create } from 'zustand';
import { User, UserRole, ROLE_LABELS, ROLE_DEFAULT_MODULES } from '../types';

// Mock用户数据
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: 'boss',
    displayName: '张老板',
    role: 'owner',
    roleLabel: '老板/管理员',
    avatar: '👨‍💼',
    phone: '13800001111',
    permissions: { modules: ROLE_DEFAULT_MODULES.owner, canEdit: true, canDelete: true, canExport: true },
    active: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'u2',
    username: 'laowang',
    displayName: '老王',
    role: 'production_manager',
    roleLabel: '生产主管',
    avatar: '👨‍🔧',
    phone: '13800002222',
    permissions: { modules: ROLE_DEFAULT_MODULES.production_manager, canEdit: true, canDelete: false, canExport: true },
    active: true,
    createdAt: '2024-03-15',
  },
  {
    id: 'u3',
    username: 'xiaoLi',
    displayName: '小李',
    role: 'sales',
    roleLabel: '销售员',
    avatar: '👩‍💼',
    phone: '13800003333',
    permissions: { modules: ROLE_DEFAULT_MODULES.sales, canEdit: true, canDelete: false, canExport: false },
    active: true,
    createdAt: '2024-06-01',
  },
  {
    id: 'u4',
    username: 'laozhou',
    displayName: '老周',
    role: 'delivery',
    roleLabel: '配送员',
    avatar: '🚚',
    phone: '13800004444',
    permissions: { modules: ROLE_DEFAULT_MODULES.delivery, canEdit: false, canDelete: false, canExport: false },
    active: true,
    createdAt: '2024-08-10',
  },
  {
    id: 'u5',
    username: 'xiaomei',
    displayName: '小美',
    role: 'finance',
    roleLabel: '财务',
    avatar: '👩‍💻',
    phone: '13800005555',
    permissions: { modules: ROLE_DEFAULT_MODULES.finance, canEdit: true, canDelete: false, canExport: true },
    active: true,
    createdAt: '2024-05-20',
  },
  {
    id: 'u6',
    username: 'xiaowu',
    displayName: '小吴',
    role: 'content_creator',
    roleLabel: '内容运营',
    avatar: '🎬',
    phone: '13800006666',
    permissions: { modules: ROLE_DEFAULT_MODULES.content_creator, canEdit: true, canDelete: false, canExport: false },
    active: true,
    createdAt: '2024-09-01',
  },
];

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  login: (userId: string) => void;
  loginByPhone: (phone: string, displayName: string) => { success: boolean; isNew: boolean; message: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  removeUser: (userId: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  users: MOCK_USERS,
  login: (userId: string) => {
    const user = get().users.find(u => u.id === userId);
    if (user) {
      set({ currentUser: user, isAuthenticated: true });
    }
  },
  loginByPhone: (phone: string, displayName: string) => {
    // 查找是否已有该手机号的用户
    const existingUser = get().users.find(u => u.phone === phone);
    if (existingUser) {
      // 已有用户，直接登录
      set({ currentUser: existingUser, isAuthenticated: true });
      return { success: true, isNew: false, message: `欢迎回来，${existingUser.displayName}！` };
    } else {
      // 新用户，自动注册
      const newUser: User = {
        id: `u${Date.now()}`,
        username: `user_${phone.slice(-4)}`,
        displayName: displayName || `用户${phone.slice(-4)}`,
        role: 'sales',
        roleLabel: '销售员',
        avatar: '👤',
        phone: phone,
        permissions: {
          modules: ROLE_DEFAULT_MODULES.sales,
          canEdit: true,
          canDelete: false,
          canExport: false,
        },
        active: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      set(state => ({
        users: [...state.users, newUser],
        currentUser: newUser,
        isAuthenticated: true,
      }));
      return { success: true, isNew: true, message: `注册成功！欢迎加入，${newUser.displayName}！` };
    }
  },
  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
  },
  switchUser: (userId: string) => {
    const user = get().users.find(u => u.id === userId);
    if (user) {
      set({ currentUser: user });
    }
  },
  addUser: (user: User) => {
    set(state => ({ users: [...state.users, user] }));
  },
  updateUser: (userId: string, updates: Partial<User>) => {
    set(state => ({
      users: state.users.map(u => u.id === userId ? { ...u, ...updates } : u),
      currentUser: state.currentUser?.id === userId ? { ...state.currentUser, ...updates } : state.currentUser,
    }));
  },
  removeUser: (userId: string) => {
    set(state => ({
      users: state.users.filter(u => u.id !== userId),
    }));
  },
}));