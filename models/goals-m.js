'use strict';
const MongoClient = require('mongodb').MongoClient;
const Goal = require('./goal');
const ObjectId = require('mongodb').ObjectID;

// Setup our db variable
var db;

exports.connectDB = () => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    var un = 'tanis';
    var pw = 'wd2goals';
    var url = `mongodb://${un}:${pw}@ds131826.mlab.com:31826/goals`;
    // Connect to the DB
    MongoClient.connect(url, (err, _db) => {
      if (err) return reject(err);
      db = _db;
      resolve(_db);
    });
  });  
};

exports.allGoals = (user_id) => {
  return exports.connectDB()
  .then((db) => {
    var collection = db.collection('goals');
    return collection.find({user: new ObjectId(user_id)}).toArray()
    .then((documents) => {
      return documents;
    });
  });
};

exports.getGoalInfo = (id) => {
  return exports.connectDB()
  .then((db) => {
    var collection = db.collection('goals');
    if (!ObjectId.isValid(id)) {
      return false;
    }
    return collection.findOne({_id: new ObjectId(id)})
    .then((doc) => {
      if (doc == null) {
        return false;
      }
      return new Goal(doc.goal_name, doc.goal_target, doc.goal_length, doc._id);
    });
  });
};

// CREATE goal
exports.create = (goal_name, goal_target, goal_length) => {
  return exports.connectDB()
  .then((db) => {
    var goal = new Goal(goal_name, goal_target, goal_length);
    var collection = db.collection('goals');
    return collection.insertOne(goal)
      .then((result) => {return result;});
  });
};

// UPDATE Goal
exports.update = (_id, goal_name, goal_target, goal_length) => {
  return exports.connectDB()
  .then((db) => {
    var goal = new Goal(goal_name, goal_target, goal_length);
    var collection = db.collection('goals');
    return collection.updateOne({_id: new ObjectId(_id)}, goal)
      .then((result) => {return result;});
  });
};

// DELETE Goal
exports.destroy = function(_id) {
  return exports.connectDB()
  .then((db) => {
    var collection = db.collection('goals');
    return collection.deleteOne({_id: new ObjectId(_id)})
      .then((result) => {return result;});
  });
};
