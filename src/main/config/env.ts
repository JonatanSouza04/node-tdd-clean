export default {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'KeySecreT2022$#*',
  saltCrypt: process.env.SALT_CRYPT || 12,
};
