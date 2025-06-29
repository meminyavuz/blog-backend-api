const redis = require('../config/redis');

/**
 * Cache Middleware
 * @param {number} ttl - Cache'in geçerlilik süresi (saniye cinsinden)
 */

const cacheMiddleware = (ttl = 3600) => {
  return async (req, res, next) => {
    const key = req.originalUrl; // Cache anahtarı olarak URL'yi kullanıyoruz
    console.log('Cache key:', key); // Cache anahtarını logla

    try {
      // Redis'ten cache kontrolü
      const cachedData = await redis.get(key);
      if (cachedData) {
        console.log('Cache hit:', key); // Cache'den veri bulundu
        return res.status(200).json(JSON.parse(cachedData)); // Cache'deki veriyi döndür
      }

      console.log('Cache miss:', key); // Cache'de veri yok

      // Yanıtı cache'e yazmak için `res.json` metodunu override ediyoruz
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        console.log('Caching response for key:', key); // Cache'e veri yazılıyor
        redis.set(key, JSON.stringify(body), 'EX', ttl, (err) => {
          if (err) {
            console.error('Redis set error:', err); // Redis'e yazma hatası
          } else {
            console.log('Response cached successfully for key:', key);
          }
        });
        originalJson(body); // Orijinal `res.json` metodunu çağır
      };

      next();
    } catch (err) {
      console.error('Redis error:', err); // Redis bağlantı hatası
      next();
    }
  };
};

module.exports = cacheMiddleware;