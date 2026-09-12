import { UserProfile, UserRole } from '../types';

const STORAGE_KEY = 'f2m_auth_user';

export const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  visitor: {
    id: 'user-visitor',
    name: 'Guest Visitor',
    role: 'visitor',
    emailOrPhone: '',
    entityName: 'General Public',
    location: 'India',
  },
  farmer: {
    id: 'farmer-101',
    name: 'Dnyaneshwar Shinde',
    role: 'farmer',
    emailOrPhone: '+91 98220 18492',
    entityName: 'Sahyadri Organic Farm',
    location: 'Nashik Valley, Maharashtra',
    avatar: '👨‍🌾',
  },
  buyer: {
    id: 'buyer-202',
    name: 'Priya Sharma',
    role: 'buyer',
    emailOrPhone: '+91 98201 94821',
    entityName: 'Bandra Fresh Food Club',
    location: 'Bandra West, Mumbai',
    avatar: '🛒',
  },
  logistics: {
    id: 'driver-303',
    name: 'Gurdeep Singh',
    role: 'logistics',
    emailOrPhone: '+91 98450 12399',
    entityName: 'Cool Delivery Fleet MH-15',
    location: 'Dindori Corridor',
    avatar: '🚚',
  },
};

export const authService = {
  getCurrentUser(): UserProfile | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to read auth user from localStorage', e);
    }
    return null;
  },

  setCurrentUser(user: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save auth user to localStorage', e);
    }
  },

  clearCurrentUser(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear auth user from localStorage', e);
    }
  },

  getDemoUser(role: UserRole): UserProfile {
    return DEMO_PROFILES[role] || DEMO_PROFILES.visitor;
  },
};
