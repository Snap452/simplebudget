var MongoClient = require('mongodb').MongoClient;

var un = 'wd2';
var pw = 'WD2EXAMPLES';
var database = 'wd2_examples';
var url = `mongodb://${un}:${pw}@ds062448.mlab.com:62448/${database}`;

// Connect
MongoClient.connect(url, (err, db) => {
    if (err) {
        console.log(err.message);
    } else {
        // We're Connected, Woohoo!
        console.log('Connected Successfully');
        
        var collection = db.collection('Employees');
        
        // Create an object to add

        collection.deleteOne({EmployeeFName: 'Luke'}, (err, r) => {
            console.log(r.deletedCount);
            
        });
        
        collection.find().toArray((err, documents) => {
            console.log(documents); 
            db.close();
        });
        
    }
});