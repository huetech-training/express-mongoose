module.exports = {
  port: process.env.PORT || '3000',
  mongodb: {
    connectString: 'mongodb+srv://mongouser:$MongoUser$@cluster0.fgite.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
  }
}