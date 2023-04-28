const sha1 = require('sha1');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const existingUser = await dbClient.getUser(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }
    const hashedPass = sha1(password);
    const newUser = {
      email,
      password: hashedPass,
    };
    await dbClient.insertOneUser(newUser);
    return res.status(201).json({ id: newUser._id, email: newUser.email });
  }
}

class UserController {
  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await dbClient.getUserById(userId);
    return res.status(200).json({ id: user._id, email: user.email });
  }
}

module.exports = { UsersController, UserController };
