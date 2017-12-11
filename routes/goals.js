'use strict';
var express = require('express');
var router = express.Router();
var goals = require('../models/goals-m');

/* GET users listing. */
router.get('/', redirectIfLoggedIn, function(req, res, next) {
  goals.allGoals(req.user._id).then((goalArray) => {
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
    } else {
      res.render('view_goal', {
        title: `View Goal: ${goal.goal_name}`,
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
    } else {
      res.render('add_edit_goal', {
        title: `Edit Goal: ${goal.goal_name}`,
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
    } else {
      res.render('delete', {
        title: `Delete Goal ${goal.goal_name}`,
        goal: goal,
        menuPath: 'Goals'
      });
    }
  });
});

router.post('/delete', function(req, res, next) {
  if (req.body._id) {
    goals.destroy(req.body._id).then(() => {
      res.redirect('/goals');
    });
  } else {
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
    } else {
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
  } else {
    next(new Error('Not enough data supplied'));
  }
});

function redirectIfLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login' + req.originalUrl);
}

module.exports = router;
