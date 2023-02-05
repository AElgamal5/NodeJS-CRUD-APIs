const { MongoClient } = require("mongodb");

let DBConnection;
const uri = "mongodb://localhost:27017/bookStore";

module.exports = {
  connectToDb: (CB) => {
    MongoClient.connect(uri)
      .then((client) => {
        DBConnection = client.db();
        return CB();
      })
      .catch((err) => {
        console.log(err);
        return CB(err);
      });
  },
  getDb: () => DBConnection,
};
