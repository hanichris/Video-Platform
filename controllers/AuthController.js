const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const base64Regex = /^(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}(?:==)?|[A-Za-z0-9+/]{3}=?)$/;

function isValidBase64(str) {
  return base64Regex.test(str);
}

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const authString = authHeader.substring('Basic '.length);
    const isValid = isValidBase64(authString);
    if (!authString || isValid === false) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const buff = Buffer.from(authString, 'base64');
    const credentials = buff.toString('ascii');
    const [email, password] = credentials.split(':');
    const user = await dbClient.getUserByEmailAndPassword(email, password);
    if (user) {
      const { _id: id } = user;
      const token = uuidv4();
      const key = `auth_${token}`;
      await redisClient.set(key, id.toString(), 86400);
      return res.status(200).json({ token });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await redisClient.del(key);
    return res.status(204).send();
  }
}

module.exports = AuthController;
