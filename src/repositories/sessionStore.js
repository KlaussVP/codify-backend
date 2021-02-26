const redis = require('promise-redis')();
const url = require('url');

class SessionStore {
  constructor() {
    const redisUri = url.parse(process.env.REDIS_URL);

    this.client = redis.createClient({
      port: Number(redisUri.port),
      host: redisUri.hostname,
      password: redisUri.auth.split(':')[1],
      db: 0,
      tls: {
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
      }
    });
    this.client.on('error', (error) => {
      /* eslint-disable-next-line no-console */
      console.error(error);
    });
  }

  async setSession(key, value) {
    await this.client.set(key, JSON.stringify(value), 'EX', process.env.SESSION_EXPIRATION);
    return key;
  }

  async getSession(key) {
    const result = await this.client.get(key);
    if (result) {
      return JSON.parse(result);
    }
    return false;
  }

  async deleteSession(key) {
    await this.client.del(key);
  }
}

module.exports = new SessionStore();

