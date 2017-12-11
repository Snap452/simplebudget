'use strict';
module.exports = class Transaction {
  constructor(date, amount, type, desc, user, id) {
    // The Transaction ID is the _id
    this.date = date;
    this.amount = amount;
    this.type = type;
    if (id) {
      this._id = id;
    }
    this.user = user;
    if (desc) {
      this.desc = desc;
    } else {
      this.desc = null;
    }
  }
};
