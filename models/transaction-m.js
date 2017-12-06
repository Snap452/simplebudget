'use strict';
const MongoClient = require('mongodb').MongoClient;
const Transaction = require('./transaction');
const ObjectId = require('mongodb').ObjectID;

// Setup our db variable
var db;

exports.connectDB = () => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    var un = 'tempuser';
    var pw = 'tempuser1';
    var url = `mongodb://${un}:${pw}@ds115396.mlab.com:15396/budget`;
    // Connect to the DB
    MongoClient.connect(url, (err, _db) => {
      if (err) return reject(err);
      db = _db;
      resolve(_db);
    });
  });
};

exports.allTransactions = (user_id) => {
  return exports.connectDB()
  .then((db) => {
    var collection = db.collection('transactions');
    return collection.find({user: new ObjectId(user_id)}).toArray()
    .then((documents) => {
      return documents;
    });
  });
};

exports.getTransactionInfo = (id) => {
  return exports.connectDB()
  .then((db) => {
    var collection = db.collection('transactions');
    if (!ObjectId.isValid(id)) {
      return false;
    }
    return collection.findOne({_id: new ObjectId(id)})
    .then((doc) => {
      if (doc == null) {
        return false;
      }
      return new Transaction(doc.date, doc.amount, doc.type, doc.desc, doc._id);
    });
  });
};

// CREATE transaction
exports.create = (date, amount, type, desc, user) => {
  return exports.connectDB()
  .then((db) => {
    var transaction = new Transaction(date, amount, type, desc, user);
    var collection = db.collection('transactions');
    return collection.insertOne(transaction)
    .then((result) => {return result;});
  });
};

// UPDATE transaction
exports.update = (_id, date, amount, type, desc, user) => {
  return exports.connectDB()
  .then((db) => {
    var transaction = new Transaction(date, amount, type, desc, user);
    var collection = db.collection('transactions');
    return collection.updateOne({_id: new ObjectId(_id)}, transaction)
    .then((result) => {return result;});
  });
};

// DELETE transaction
exports.destroy = function(_id) {
  return exports.connectionDB()
  .then((db) => {
    var transaction = db.collection('transactions');
    return transaction.deleteOne({_id: new ObjectId(_id)})
    .then((result) => {return result;});
  });
};
