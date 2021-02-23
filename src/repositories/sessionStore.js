const redis = require('promise-redis')();

let client;

function createInstance() {
  client = redis.createClient({
    url: process.env.REDISCLOUD_URL,
  });

  client.on('error', (error) => {
    /* eslint-disable-next-line no-console */
    console.error(error);
  });
  return client;
}

function getInstance() {
  if (!client) client = createInstance();
  return client;
}

async function setSession(key, value) {
  client = getInstance();
  await client.set(key, JSON.stringify(value), 'EX', process.env.SESSION_EXPIRATION);
  return key;
}

async function getSession(key) {
  client = getInstance();
  const result = await client.get(key);
  if (result) {
    return JSON.parse(result);
  }
  return false;
}

async function deleteSession(key) {
  client = getInstance();
  const result = await client.del(key);
  console.log(result);
}

module.exports = { setSession, getSession, deleteSession };
