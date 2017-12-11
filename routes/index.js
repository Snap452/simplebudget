var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {
    user: req.user,
    title: 'SimpBudget | Home',
    menuPath: 'Home'
  });
});

router.get('/register', function(req, res) {
  res.render('register', {
    title: 'SimBudget | Register',
    menuPath: 'Register'
  });
});

router.post('/register', function(req, res, next) {
  Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account) {
    if (err) {
      return res.render('register', {
        error: err.message,
        title: "SimBudget | Error!",
        menuPath: "Register"
      });
    }
    passport.authenticate('local')(req, res, function() {
      req.session.save(function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
});

router.get('/login', function(req, res) {
  res.redirect('/login/transactions');
});

router.get('/login/:redirect', function(req, res) {
  res.render('login', {
    user: req.user,
    title: 'SimBudget | Log In',
    menuPath: 'Register',
    redirectURL: req.params.redirect
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/' + req.body.redirect);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

/* Below here test */
var transactions = require('../models/transaction-m');

/* GET users listing. */
router.get('/', function(req, res, next) {
  transactions.allTransactions().then((transactionArray) => {
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
    }
    else {
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
    }
    else {
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
    }
    else {
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
  }
  else {
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
        req.body.desc);
    }
    else {
      // A create
      save = transactions.create(
        req.body.date,
        req.body.amount,
        req.body.type,
        req.body.desc);
    }
    save.then(() => {
      res.redirect('/transactions');
    }).catch((err) => {
      next(err);
    });
  }
  else {
    next(new Error('Not enough data supplied'));
  }
});

//Homepage

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'SimBudget | Home',
    menuPath: 'Home'
  });
});

/* GET Planner page. */
router.get('/planner', (req, res, next) => {
  res.render('planner', {
    title: 'SimBudget | Planner',
    menuPath: 'Planner'
  });
});


/* Goals functionality. */
var goals = require('../models/goals-m');

router.get('/', function(req, res, next) {
  goals.allGoals().then((goalArray) => {
    res.render('goals', {
      title: 'All Goals',
      goals: goalArray,
      menuPath: 'Goals'
    });
  });
});

router.get('/view/:id', function(req, res, next) {
  goals.getGoalInfo(req.params.id).then((goal) => {
    if (goal === false) {
      next(new Error('Goal Not Found'));
    }
    else {
      res.render('view_goal', {
        title: `Goal ${goal.goal_name} ${goal.goal_target} ${goal.goal_length}`,
        goal: goal,
        menuPath: 'Goals'
      });
    }
  });
});

router.get('/edit/:id', function(req, res, next) {
  goals.getGoalInfo(req.params.id).then((goal) => {
    if (goal === false) {
      next(new Error('Goal Not Found'));
    }
    else {
      res.render('add_edit_goal', {
        title: `Goal ${goal.goal_name} ${goal.goal_target} ${goal.goal_length}`,
        goal: goal,
        menuPath: 'Goals'
      });
    }
  });
});

router.get('/delete/:id', function(req, res, next) {
  goals.getGoalInfo(req.params.id).then((goal) => {
    if (goal === false) {
      next(new Error('Goal Not Found'));
    }
    else {
      res.render('delete', {
        title: `Goal ${goal.goal_name} ${goal.goal_target} ${goal.goal_length}`,
        goal: goal,
        menuPath: 'Goal'
      });
    }
  });
});

router.post('/delete', function(req, res, next) {
  if (req.body._id) {
    goals.destroy(req.body._id).then(() => {
      res.redirect('/goals');
    });
  }
  else {
    next(new Error('Goal Not Found'));
  }
});

router.get('/add', function(req, res, next) {
  res.render('add_edit_goal', {
    title: 'Add a goal',
    goal: false,
    menuPath: 'Goals'
  });
});

router.post('/save', function(req, res, next) {
  // Make sure we have all of the data we want
  if (req.body.goal_name && req.body.goal_target) {
    var save;
    // Was this a create or update?
    if (req.body._id) {
      // An update
      save = goals.update(
        req.body._id,
        req.body.goal_name,
        req.body.goal_target,
        req.body.goal_length);
    }
    else {
      // A create
      save = goals.create(
        req.body.goal_name,
        req.body.goal_target,
        req.body.goal_length);
    }
    save.then(() => {
      res.redirect('/goals');
    }).catch((err) => {
      next(err);
    });
  }
  else {
    next(new Error('Not enough data supplied'));
  }
});

/* GET Settings page. */
router.get('/settings', (req, res, next) => {
  res.render('settings', {
    title: 'SimBudget | Settings',
    menuPath: 'Settings'
  });
});

module.exports = router;
