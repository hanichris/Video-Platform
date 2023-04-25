export interface IUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  // Array of string elements
  subscriptions: string[];
  history: string[];
  // Array of objects with known properties (but could have more at runtime)
  channels: {
    userId: string,
  }[];
  fromGoogle: boolean;
}

export interface IChannel {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  views: number;
  tags: string[];
  likes: number;
  dislikes: number;
  videos: {
    id: string
  }[];
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
  tags: string[];
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
