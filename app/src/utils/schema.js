export default {
  bsonType: 'object',
  title: 'User Object Validation',
  required: ['name', 'email', 'password'],
  properties: {
    name: {
      bsonType: 'string',
      description: "'name' must be a string and is required.",
    },
    email: {
      bsonType: 'string',
      description: "'email' must be a string and is required",
    },
    password: {
      bsonType: 'string',
      description: "'password' must be a string and is required",
    },
  },
};

export const filesSchema = {
  bsonType: 'object',
  title: 'Files Object Validation',
  required: ['filepath', 'video_description', 'title', 'userId'],
  properties: {
    userId: {
      bsonType: 'objectId',
      description: "Must provide the 'userId' associated with the file",
    },
    title: {
      bsonType: 'string',
      description: "'title' must be a string and is required",
    },
    video_description: {
      bsonType: 'string',
      description: 'The video description is a required string',
    },
    filepath: {
      bsonType: 'string',
      description: 'The path to the video file is required',
    },
  },
};
// name of video. description, likes (count), comments,
// Likes: +1, -1
// DB: sum(previous, receivedFlag)
// Associate likes with a userID

// Nature of Comment:
// Id
// User whose commented
// Likes it got
// Replies
