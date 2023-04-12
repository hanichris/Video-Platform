/* eslint-disable no-bitwise */
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const fileTypes = require('../utils/constants');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

const relPath = process.env.FOLDER_PATH || '/tmp/files_manager';

class FilesController {
  static async postUpload(req, res) {
    const {
      name, type, parentId, isPublic, data,
    } = req.body;
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !fileTypes.includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }
    const dataTypes = ['image', 'file'];
    if (dataTypes.includes(type) && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }
    const parentFile = await dbClient.getFileById(parentId);
    if (parentId) {
      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }
    const id = uuidv4();
    const localPath = path.join(relPath, id);
    const newFile = {
      userId,
      name,
      type,
      isPublic: Boolean(isPublic),
      parentId: parentId || 0,
      localPath,
    };
    const newFolder = {
      userId,
      name,
      type,
      isPublic: Boolean(isPublic),
      parentId: parentId || 0,
    };
    if (dataTypes.includes(type)) {
      fs.mkdirSync(relPath, { recursive: true });
      const decodedData = Buffer.from(data, 'base64');
      fs.writeFileSync(localPath, decodedData);
    }
    if (type === 'folder') {
      const { insertedId } = await dbClient.insertOneFile(newFolder);
      return res.status(201).json({
        id: insertedId,
        userId: newFolder.userId,
        name: newFolder.name,
        type: newFolder.type,
        isPublic: newFolder.isPublic,
        parentId: newFolder.parentId,
      });
    }
    const { insertedId } = await dbClient.insertOneFile(newFile);
    return res.status(201).json({
      id: insertedId,
      userId: newFile.userId,
      name: newFile.name,
      type: newFile.type,
      isPublic: newFile.isPublic,
      parentId: newFile.parentId,
    });
  }

  static async getShow(req, res) {
    const { id } = req.params;
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userFile = await dbClient.getUserFile(id, userId);
    if (!userFile) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(200).json(userFile);
  }

  static async getIndex(req, res) {
    const parentId = req.query.parentId || 0;
    const page = parseInt(req.query.page, 10) || 0;
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const skip = page * 20;
    const limit = 20;
    const userFiles = await dbClient.getPaginatedFiles(parentId, userId, skip, limit);
    return res.status(200).json(userFiles);
  }

  static async putPublish(req, res) {
    const { id } = req.params;
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userFile = await dbClient.getAndModifyFileTrue(id);
    if (!userFile) {
      return res.status(404).json({ error: 'Not found' });
    }
    const fileById = await dbClient.getFileById(id);
    return res.status(200).json(fileById);
  }

  static async putUnPublish(req, res) {
    const { id } = req.params;
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userFile = await dbClient.getAndModifyFileFalse(id);
    if (!userFile) {
      return res.status(404).json({ error: 'Not found' });
    }
    const fileById = await dbClient.getFileById(id);
    return res.status(200).json(fileById);
  }

  // eslint-disable-next-line consistent-return
  static async getFile(req, res) {
    const { id } = req.params;
    const { size } = req.params;
    const token = req.headers['x-token'];
    const userAuth = `auth_${token}`;
    try {
      const fileUserId = await redisClient.get(userAuth);
      const file = await dbClient.getFileById(id);
      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      if (!file.isPublic && (!token || file.userId !== fileUserId)) {
        return res.status(404).json({ error: 'Not found' });
      }
      if (file.type === 'folder') {
        return res.status(400).json({ error: 'A folder doesn\'t have content' });
      }
      const fPath = file.localPath;
      let fileStoragePath;
      if (size) {
        fileStoragePath = path.replace(fPath, `${fPath}_${size}`);
      } else {
        fileStoragePath = fPath;
      }
      if (!fs.existsSync(fileStoragePath)) {
        return res.status(404).json({ error: 'Not found' });
      }
      const mimeType = mime.lookup(file.name);
      res.setHeader('Content-Type', mimeType);
      fs.createReadStream(fileStoragePath).pipe(res);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = FilesController;
