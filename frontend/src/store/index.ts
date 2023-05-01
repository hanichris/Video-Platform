import { create } from 'zustand';
import { IUser, IVideo, IChannel } from '../utils/types';

type Store = {
  authUser: IUser | null;
  currentVideo: IVideo | null;
  currentChannel: IChannel | null;
  requestLoading: boolean;
  setAuthUser: (user: IUser | null) => void;
  setCurrentVideo: (video: IVideo | null) => void;
  setCurrentChannel: (channel: IChannel | null) => void;
  setRequestLoading: (isLoading: boolean) => void;
};

const useStore = create<Store>((set) => ({
  authUser: null,
  currentVideo: null,
  currentChannel: null,
  requestLoading: false,
  setAuthUser: (user) => set((state) => ({ ...state, authUser: user })),
  setCurrentVideo: (video) => set((state) => ({ ...state, currentVideo: video })),
  setCurrentChannel: (channel) => set((state) => ({ ...state, currentChannel: channel })),
  setRequestLoading: (isLoading) => set((state) => ({ ...state, requestLoading: isLoading })),
}));

export default useStore;
