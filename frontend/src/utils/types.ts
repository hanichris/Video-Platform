export interface IUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  subscriptions: Array;
  history: Array;
  channels: Array;
  fromGoogle: boolean;
}

export interface IChannel {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  views: number;
  tags: Array;
  likes: number;
  dislikes: number;
  videos: Array;
  subscribers: number;
  isPublic: boolean;
}

export interface IVideo {
  id: string;
  userId: string;
  channelId: string;
  title: string;
  description: string;
  imgUrl: string;
  videoUrl: string;
  views: number;
  tags: Array;
  likes: number;
  dislikes: number;
  isPublic: boolean;
}

export interface IComment {
  id: string;
  userId: string;
  videoId: string;
  parentCommentId?: string;
  description: string;
  upvotes: number;
  downvotes: number;
}
