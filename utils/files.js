/* eslint-disable no-bitwise */
const fs = require('fs');
const path = require('path');
const { fork, execFile } = require('child_process');

const child = fork(__filename, ['child']);
const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';

const getFilePath = async (filename) => {
  await fs.mkdir(folderPath, { recursive: true }, (err) => {
    if (err) return Promise.reject(err);
    return Promise.resolve('Success');
  });
  return Promise.resolve(path.join(folderPath, filename));
};

const str2int = (theStr) => {
  let ret = 0;
  const len = theStr.length;
  if (len >= 1) ret += (theStr.charCodeAt(0) & 0xff) << 0;
  if (len >= 2) ret += (theStr.charCodeAt(1) & 0xff) << 8;
  if (len >= 3) ret += (theStr.charCodeAt(2) & 0xff) << 16;
  if (len >= 4) ret += (theStr.charCodeAt(3) & 0xff) << 24;
  return ret;
};

const createSystemGroup = async (groupName, groupId) => {
  try {
    let res;
    console.log(`Creating a new group ${groupName}`);
    await execFile(
      '/usr/bin/id',
      ['--group', groupName],
      async (error, stdout) => {
        if (error) {
          await execFile(
            '/usr/bin/sudo',
            ['/usr/sbin/groupadd', groupName, '--gid', groupId],
            (error, stdout) => {
              if (!error) {
                console.log(
                  `Successfully created a new group ${groupName} ${stdout}`,
                );
                res = stdout;
              }
            },
          );
        } else {
          res = stdout;
          console.log(`Group ${groupName} already exists with id ${res}`);
        }
      },
    );
    // child.kill();
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  } finally {
    child.kill();
  }
};

const createSystemUser = async (userName, userId, groupId, password) => {
  try {
    let res;
    console.log(`Creating a new user ${userName}`);
    await execFile(
      '/usr/bin/id',
      ['--user', userName],
      async (error, stdout) => {
        if (error) {
          await execFile(
            '/usr/bin/sudo',
            [
              '/usr/sbin/useradd',
              userName,
              '--uid',
              userId,
              '--gid',
              groupId,
              '--password',
              password,
            ],
            (error, stdout) => {
              if (error) throw error;
              console.log(
                `Successfully created a new user ${userName} ${stdout}`,
              );
              res = stdout;
            },
          );
        } else {
          res = stdout;
          console.log(`User ${userName} already exists with id ${res}`);
        }
      },
    );
    child.kill();
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
  getFilePath,
  str2int,
  createSystemGroup,
  createSystemUser,
};
