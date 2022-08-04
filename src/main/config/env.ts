export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://root:123456@localhost:27017',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'uc91=%2D'
}
