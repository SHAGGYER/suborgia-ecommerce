const AppSettings = require('../models/AppSettings');

exports.SettingsController = class {
  static async getSettings(req, res) {
    const settings = await AppSettings.findOne({});
    res.json(settings);
  }

  static async updateSettings(req, res) {
    let settings = await AppSettings.findOne({});

    if (!settings) {
      settings = new AppSettings(req.body);
      await settings.save();
    } else {
      await AppSettings.updateOne({}, req.body);
    }

    res.json(settings);
  }
}