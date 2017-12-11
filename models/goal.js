'use strict';
module.exports = class Goal {
  constructor(goal_name, goal_target, goal_length, user, id) {
    // The Goal ID is the _id
    this.goal_name = goal_name;
    this.goal_target = goal_target;
    this.goal_length = goal_length;
    this.user = user;
    if (id) {
      this._id = id;
    }
  }
};
