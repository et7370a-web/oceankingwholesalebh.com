import { create } from 'zustand';
import { fetchMemberInfo } from '@/lib/customerAuth';

type Status = 'loading' | 'signedOut' | 'signedIn' | 'error';

interface MemberStore {
  status: Status;
  email: string | null;
  isMember: boolean;
  refresh: () => Promise<void>;
}

export const useMemberStore = create<MemberStore>((set) => ({
  status: 'loading',
  email: null,
  isMember: false,
  refresh: async () => {
    try {
      const info = await fetchMemberInfo();
      if (!info) set({ status: 'signedOut', email: null, isMember: false });
      else set({ status: 'signedIn', email: info.email, isMember: info.isMember });
    } catch (error) {
      console.error('Failed to check membership:', error);
      set({ status: 'error', isMember: false });
    }
  },
}));
