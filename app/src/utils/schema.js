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

// name of video. description, likes (count), comments,
// Likes: +1, -1
// DB: sum(previous, receivedFlag)
// Associate likes with a userID

// Nature of Comment:
// Id
// User whose commented
// Likes it got
// Replies
