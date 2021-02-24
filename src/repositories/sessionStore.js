const redis = require('promise-redis')();

class SessionStore {
  constructor() {
    this.client = redis.createClient({
      url: process.env.REDISCLOUD_URL,
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

