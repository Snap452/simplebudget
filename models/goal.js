'use strict';
module.exports = class Goal {
  constructor(goal_name, goal_target, goal_length, user, id) {
    // The Goal ID is the _id
    this.goal_name = goal_name;
    if (goal_target) {
      this.goal_target = goal_target;
    } else {
      this.goal_target = null;
    }
    this.goal_length = goal_length;
    if (id) {
      this._id = id;
    }
    this.user = user;
  }
};
