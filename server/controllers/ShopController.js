const Shop = require("../models/Shop");
const shortid = require("shortid");
const { ValidationService } = require("../services/ValidationService");
const validator = require("validator");
const User = require("../models/User");
const Service = require("../models/Service");

exports.ShopController = class {
  static async updateShop(req, res) {
    await Shop.findByIdAndUpdate(req.params.id, { $set: req.body });
    res.status(200).json({ message: "Shop updated successfully" });
  }

  static async deleteShop(req, res) {
    await Shop.findByIdAndRemove(req.params.id);
    res.status(200).json({
      message: "Shop deleted",
    });
  }

  /*
   * This method changes last selected shop Id in the control panel
   *  */
  static async changeLastSelectedShopId(req, res) {
    await User.findOneAndUpdate(
      { _id: res.locals.userId },
      { $set: { controlPanelLastSelectedShopId: req.body.shopId } }
    );
    res.sendStatus(204);
  }

  static async updateOpeningHours(req, res) {
    await Shop.findOneAndUpdate(
      { _id: req.body.shopId },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ message: "Åbningstider opdateret" });
  }

  static async deleteService(req, res) {
    await Service.deleteOne({ _id: req.params.id });
    res.sendStatus(204);
  }

  static async getServices(req, res) {
    const services = await Service.find({ shop: req.params.shopId });
    res.send({ services });
  }

  static async saveServices(req, res) {
    const oldServices = req.body.services.filter((x) => x._id);
    const newServices = req.body.services.filter((x) => !x._id);

    let services = [];

    for (let service of newServices) {
      const newService = new Service({
        ...service,
        shop: req.params.shopId,
      });
      await newService.save();
      services.push(newService);
    }

    for (let service of oldServices) {
      const oldService = await Service.findByIdAndUpdate(
        service._id,
        { $set: service },
        { new: true }
      );
      services.push(oldService);
    }

    res.send({
      services,
    });
  }

  static async createShop(req, res) {
    const errors = await ValidationService.run(
      {
        name: [[(val) => !val, "Shoppens Navn er påkrævet"]],
        slug: [
          [(val) => !val, "Shoppens Slug er påkrævet"],
          [
            async (val) => {
              const shop = await Shop.findOne({ slug: val.toLowerCase() });
              return !!shop;
            },
            "Shoppens slug er allerede i brug",
          ],
        ],
        address: [[(val) => !val, "Adresse er påkrævet"]],
        zip: [
          [(val) => !val, "Postnummer er påkrævet"],

          [
            (val) => {
              const zip = parseInt(val);
              return !Number.isInteger(zip);
            },
            "Postnummer skal være et heltal",
          ],
          [
            (val) => val && val.toString().length !== 4,
            "Postnummer skal være 4 cifre",
          ],
        ],
        city: [[(val) => !val, "By er påkrævet"]],
        phone: [[(val) => !val, "Telefon er påkrævet"]],
      },
      req.body
    );

    if (Object.keys(errors).length) {
      return res.status(403).send({ errors });
    }

    const shop = new Shop({
      ...req.body,
      shortId: shortid.generate(),
      user: res.locals.userId,
    });
    await shop.save();

    return res.status(201).send({ shop });
  }

  static async search(req, res) {
    const results = await Shop.find({
      $or: [
        { name: { $regex: req.body.search, $options: "i" } },
        { address: { $regex: req.body.search, $options: "i" } },
        { zip: { $regex: req.body.search, $options: "i" } },
        { city: { $regex: req.body.search, $options: "i" } },
        { phone: { $regex: req.body.search, $options: "i" } },
      ],
    });

    res.send({ results });
  }

  static async getShop(req, res) {
    const shop = await Shop.findOne({ slug: req.params.slug });
    if (!shop) {
      return res.status(404).send({ error: "Shop not found" });
    }
    return res.status(200).send({ shop });
  }

  static async getShopsByUserId(req, res) {
    const shops = await Shop.find({ user: res.locals.userId });
    if (!shops.length) {
      return res.status(404).send({ error: "No shops not found" });
    }
    return res.status(200).send({ shops });
  }
};
