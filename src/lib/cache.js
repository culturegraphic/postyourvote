import nodeCache from 'node-cache'
import logger from './logger.js'

class Cache {
  constructor(ttlSeconds) {
    this.cache = new nodeCache({stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2});
  }

  async get(key, getFromOriginFn) {
    var value = this.cache.get(key);
    if (value !== undefined) {
      logger.info("Got %s from cache", key);
      return value;
    }

    value = await getFromOriginFn();
    logger.info("Got %s from origin", key);
    this.cache.set(key, value);
    return value;
  }

  set(key, val) {
    this.cache.set(key, val);
  }

  flush() {
    this.cache.flushAll();
  }

  stats() {
    return this.cache.getStats();
  }
}

export default Cache;
