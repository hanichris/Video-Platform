const { MongoClient, ObjectId } = require('mongodb');
const sha1 = require('sha1');

class DBClient {
  constructor() {
    const DB_HOST = process.env.DB_HOST || 'localhost';
    const DB_PORT = process.env.DB_PORT || 27017;
    const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
    const URL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

    this.client = new MongoClient(URL, { useUnifiedTopology: true });
    this.isConnected = false;
    (async () => {
      await this.client.connect((err) => {
        if (err) {
          throw err;
        } else {
          this.isConnected = true;
        }
      });
    })();
  }

  isAlive() {
    return this.isConnected;
  }

  async nbFiles() {
    try {
      const res = await this.client.db().collection('files').countDocuments();
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getFiles() {
    try {
      const res = await this.client.db().collection('files').find().toArray();
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getFileById(id) {
    try {
      const objId = new ObjectId(id);
      const res = await this.client
        .db()
        .collection('files')
        .findOne({ _id: objId });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getUserFile(fileId, userId) {
    try {
      const objId = new ObjectId(fileId);
      const res = await this.client
        .db()
        .collection('files')
        .findOne({ _id: objId, userId });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getAndModifyFileTrue(id) {
    try {
      const objId = new ObjectId(id);
      const res = await this.client
        .db()
        .collection('files')
        .updateOne({ _id: objId },
          { $set: { isPublic: 'true' } });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getAndModifyFileFalse(id) {
    try {
      const objId = new ObjectId(id);
      const res = await this.client
        .db()
        .collection('files')
        .updateOne({ _id: objId },
          { $set: { isPublic: 'false' } });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getPaginatedFiles(parentId = 0, userId, page, limit) {
    try {
      const files = await this.client.db()
        .collection('files')
        .find({ parentId, userId })
        .skip(page)
        .limit(limit)
        .toArray();
      return Promise.resolve(files);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async insertOneFile(file) {
    try {
      const res = await this.client.db().collection('files').insertOne(file);
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async nbUsers() {
    try {
      const res = await this.client.db().collection('users').countDocuments();
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getUser(email) {
    try {
      const res = await this.client.db().collection('users').findOne({ email });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getUserById(id) {
    try {
      const userId = new ObjectId(id);
      const res = await this.client
        .db()
        .collection('users')
        .findOne({ _id: userId });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getUserByEmailAndPassword(email, password) {
    try {
      const res = await this.client
        .db()
        .collection('users')
        .findOne({ email, password: sha1(password) });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async insertOneUser(user) {
    try {
      const res = await this.client.db().collection('users').insertOne(user);
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
