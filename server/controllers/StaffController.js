const { ValidationService } = require("../services/ValidationService");
const Staff = require("../models/Staff");

exports.StaffController = class {
  static async create(req, res) {
    const staff = new Staff(req.body);
    await staff.save();

    res.send({ content: staff });
  }

  static async update(req, res) {
    await Staff.findByIdAndUpdate(req.params.id, { $set: req.body });
    res.sendStatus(204);
  }

  static async delete(req, res) {
    await Staff.findByIdAndRemove(req.params.id);

    //
  }

  static async browse(req, res) {
    const staff = await Staff.find({ storeId: req.query.storeId });
    res.send({ content: staff });
  }
};
