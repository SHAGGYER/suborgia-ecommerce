const Plan = require("../models/Plan");

exports.PlanController = class {
  static async create(req, res) {
    const plan = new Plan(req.body);
    await plan.save();
    res.send({plan})
  }

  static async find(req, res) {
    const plans = await Plan.find({});
    res.send({plans})
  }

  static async update(req, res) {
    const plan = await Plan.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
    res.send({plan})
  }
};
