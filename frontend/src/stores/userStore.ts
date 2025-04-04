import { UserType } from '@/consts';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type UserInfo = {
  phone?: string;
  email?: string;
  name?: string;
  enterprise?: string;
  userType?: UserType;
  unread?: number;
  money: number;
};

type State = {
  isLogin: boolean;
  userInfo: UserInfo;
};

type Action = {
  login: () => void;
  setInfo: (info: UserInfo) => void;
};

export const useUserStore = create<State & Action>()(
  immer((set) => ({
    userInfo: {
      name: '',
      email: '',
      phone: '',
      enterprise: '',
      userType: UserType.Normal,
      money: 0,
      unread: 0,
    },
    isLogin: true,
    login: () => {
      set((state) => {
        state.isLogin = true;
      });
    },
    setInfo: (info: UserInfo) => {
      set((state) => {
        state.userInfo = info;
      });
    },
  }))
);
