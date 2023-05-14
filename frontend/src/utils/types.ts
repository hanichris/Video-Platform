export interface IUser {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  subscriptions: Array<string>;
  history: Array<string>;
  channels: Array<string>;
  fromGoogle: boolean;
}

export interface IChannel {
  _id: string;
  userId: string;
  name: string;
  description: string;
  imgUrl: string;
  views: number;
  tags: Array<string>;
  likes: Array<string>;
  dislikes: Array<string>;
  videos: Array<string>;
  subscribers: number;
  isPublic: boolean;
  createdAt: string;
}

export interface IVideo {
  _id: string;
  userId: string;
  channelId: string;
  title: string;
  description: string;
  imgUrl: string;
  videoUrl: string;
  views: number;
  tags: Array<string>;
  likes: Array<string>;
  dislikes: Array<string>;
  isPublic: boolean;
  createdAt: string;
}

export interface IComment {
  _id: string;
  userId: string;
  videoId: string;
  parentCommentId?: string;
  description: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}
