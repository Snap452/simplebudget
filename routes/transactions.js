'use strict';
var express = require('express');
var router = express.Router();
var transactions = require('../models/transaction-m');

/* GET users listing. */
router.get('/', redirectIfLoggedIn, function(req, res, next) {
  transactions.allTransactions(req.user._id).then((transactionArray) => {
    res.render('transactions', {
      title: 'All Transactions',
      transactions: transactionArray,
      menuPath: 'Transactions'
    });
  });
});

router.get('/view/:id', function(req, res, next) {
  transactions.getTransactionInfo(req.params.id).then((transaction) => {
    if (transaction === false) {
      next(new Error('Transaction Not Found'));
    } else {
      res.render('view_transaction', {
        title: `Transaction ${transaction.date} ${transaction.amount} ${transaction.type}`,
        transaction: transaction,
        menuPath: 'Transactions'
      });
    }
  });
});

router.get('/edit/:id', function(req, res, next) {
  transactions.getTransactionInfo(req.params.id).then((transaction) => {
    if (transaction === false) {
      next(new Error('Transaction Not Found'));
    } else {
      res.render('add_edit_transaction', {
        title: `Transaction ${transaction.date} ${transaction.amount} ${transaction.type}`,
        transaction: transaction,
        menuPath: 'Transactions'
      });
    }
  });
});

router.get('/delete/:id', function(req, res, next) {
  transactions.getTransactionInfo(req.params.id).then((transaction) => {
    if (transaction === false) {
      next(new Error('Transaction Not Found'));
    } else {
      res.render('delete', {
        title: `Transaction ${transaction.date} ${transaction.amount} ${transaction.type}`,
        transaction: transaction,
        menuPath: 'Transactions'
      });
    }
  });
});

router.post('/delete', function(req, res, next) {
  if (req.body._id) {
    transactions.destroy(req.body._id).then(() => {
      res.redirect('/transactions');
    });
  } else {
    next(new Error('Transaction Not Found'));
  }
});

router.get('/add', function(req, res, next) {
  res.render('add_edit_transaction', {
    title: 'Add a transaction',
    transaction: false,
    menuPath: 'Transactions'
    });
});

router.post('/save', function(req, res, next) {
  // Make sure we have all of the data we want
  if (req.body.date && req.body.amount) {
    var save;
    // Was this a create or update?
    if (req.body._id) {
      // An update
      save = transactions.update(
        req.body._id,
        req.body.date,
        req.body.amount,
        req.body.type,
        req.body.desc,
        req.user._id);
    } else {
      // A create
      save = transactions.create(
        req.body.date,
        req.body.amount,
        req.body.type,
        req.body.desc,
        req.user._id
        );
    }
    save.then(() => {
      res.redirect('/transactions');
    }).catch((err) => {
      next(err);
    });
  } else {
    next(new Error('Not enough data supplied'));
  }
});


function redirectIfLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;