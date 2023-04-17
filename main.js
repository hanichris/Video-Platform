import dbClient from './backend/src/utils/db.js'; //eslint-disable-line

async function listDatabases() {
  const databasesList = await dbClient.client.db().admin().listDatabases();

  console.log('Databases:');
  databasesList.databases.forEach((entry) => {
    console.log(`- ${entry.name}`);
  });
}

// const user1 = {
//   name: 'Chris',
//   email: 'hanichris71@gmail.com',
//   password: 'slkdjkfljsdlkjlsflkj',
// };
// const user2 = {
//   name: 1234,
//   password: 'sdfkljsldjfl',
// };

async function main() {
  try {
    await listDatabases();
    // console.log(await dbClient.createUser(user1));
    console.log(await dbClient.getUser({ name: 'Chris' }));
    console.log(await dbClient.updateUser({ name: 'Chris' }, { name: 'Chris Hani' }));
  } catch (error) {
    console.error(error.errInfo.details);
  } finally {
    await dbClient.client.close();
  }
}

// eslint-disable-next-line
main().catch(console.error);
