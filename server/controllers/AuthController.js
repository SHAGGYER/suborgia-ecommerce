const { ValidationService } = require("../services/ValidationService");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Plan = require("../models/Plan");
const AppSettings = require("../models/AppSettings");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const getIP = require("ipware")().get_ip;
const geoip = require("geoip-country");
const lookup = require("country-code-lookup");
const randomWords = require("random-words");
const moment = require("moment");
const Shop = require("../models/Shop");

exports.AuthController = class {
  static async loginAdminAsUser(req, res) {
    const user = await User.findById(req.body.userId);

    const jwtUserData = {
      userId: user._id,
      isAdmin: true,
    };

    const token = jwt.sign(jwtUserData, process.env.JWT_SECRET);
    res.send({ token });
  }

  static async log(req, res) {
    console.log(req.body.log);
    res.sendStatus(200);
  }

  static init = async (req, res) => {
    const userId = res.locals.userId;
    let user = null;
    let isDenmark = false;
    let plans = [];
    let shops = [];

    const ip = getIP(req).clientIp;
    const geo = geoip.lookup(ip);

    let country = "N/A";
    if (geo && geo.country) {
      country = lookup.byIso(geo.country).country || "N/A";
    }

    if (country === "Denmark") {
      isDenmark = true;
    }

    if (process.env.APP_ENV === "dev") {
      isDenmark = true;
    }

    const admin = await Admin.find().countDocuments();
    const appSettings = await AppSettings.findOne();
    plans = await Plan.find().select("-stripeId");

    if (userId) {
      user = await User.findById(res.locals.userId);
      shops = await Shop.find({ user: res.locals.userId });

      if (user) {
        if (
          moment().isAfter(moment(user.stripeSubscriptionCurrentPeriodEnd)) &&
          user.isTrialing
        ) {
          user.isTrialing = false;
          user.stripeSubscriptionStatus = "canceled";
          await user.save();
        }
      }
    }

    res.send({
      user,
      shops,
      installed: !!admin,
      appSettings,
      isDenmark,
      plans,
      isAdmin: res.locals.isAdmin,
    });
  };

  static initAdmin = async (req, res) => {
    const adminId = res.locals.adminId;
    let admin = null;
    let isDenmark = false;
    let hasAdmin = undefined;

    const ip = getIP(req).clientIp;
    const geo = geoip.lookup(ip);

    let country = "N/A";
    if (geo && geo.country) {
      country = lookup.byIso(geo.country).country || "N/A";
    }

    if (country === "Denmark") {
      isDenmark = true;
    }

    if (process.env.APP_ENV === "dev") {
      isDenmark = true;
    }

    if (adminId) {
      admin = await Admin.findById(res.locals.adminId);
    }

    hasAdmin = await Admin.find().countDocuments();

    const appSettings = await AppSettings.findOne();

    console.log(hasAdmin);

    res.send({
      admin,
      installed: !!hasAdmin,
      appSettings,
      isDenmark,
    });
  };

  static loginAdmin = async (req, res) => {
    const admin = await Admin.findOne({
      email: req.body.email.toLowerCase(),
    });

    if (!admin) {
      return res.status(403).send({
        error: "Kunne ikke logge dig ind",
      });
    }

    const passwordEquals = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!passwordEquals) {
      return res.status(403).send({
        error: "Kunne ikke logge dig ind",
      });
    }

    const jwtData = {
      adminId: admin._id,
    };

    const token = jwt.sign(jwtData, process.env.JWT_SECRET);

    res.send({ token, admin });
  };

  static login = async (req, res) => {
    const user = await User.findOne({
      email: req.body.email.toLowerCase(),
    });

    if (!user) {
      return res.status(403).send({
        error: "Kunne ikke logge dig ind",
      });
    }

    const passwordEquals = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordEquals) {
      return res.status(403).send({
        error: "Kunne ikke logge dig ind",
      });
    }

    const jwtUserData = {
      userId: user._id,
    };

    const token = jwt.sign(jwtUserData, process.env.JWT_SECRET);
    res.send({ token, user });
  };

  static register = async (req, res) => {
    const errors = await ValidationService.run(
      {
        email: [
          [(val) => !val, "Email er påkrævet"],
          [
            (val) => val && !validator.isEmail(val),
            "Email skal være i korrekt format",
          ],
          [
            async (val) => {
              if (!val) return true;

              const exists = await User.findOne({
                email: val.trim().toLowerCase(),
              });
              return !!exists;
            },
            "Denne Email er optaget",
          ],
        ],
        password: [
          [(val) => !val, "Kodeord er påkrævet"],
          [(val) => val.length < 6, "Kodeord skal være mindst 6 tegn langt"],
        ],
        passwordAgain: [
          [(val) => !val, "Kodeord bekræftelse er påkrævet"],
          [(val) => val !== req.body.password, "Kodeord skal være ens"],
        ],
      },
      req.body
    );

    if (Object.keys(errors).length) {
      return res.status(403).send({ errors });
    }

    const user = new User({
      ...req.body,
      stripeSubscriptionCurrentPeriodEnd: moment()
        .add(14, "days")
        .format("YYYY-MM-DD"),
      isTrialing: true,
      role: "User",
    });
    await user.save();

    const jwtUserData = {
      userId: user._id,
      userRole: user.role,
    };

    const token = jwt.sign(jwtUserData, process.env.JWT_SECRET);
    res.send({ token, user });
  };
};
