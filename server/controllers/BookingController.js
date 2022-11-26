const Booking = require("../models/Booking");
const User = require("../models/User");
const shortId = require("shortid");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const MailService = require("../services/MailService");
const Shop = require("../models/Shop");

class BookingController {
  static async sendBookingEmail(bookingId, title, subject, body) {
    const booking = await Booking.findById(bookingId);

    const file = fs.readFileSync(
      path.join(__dirname, "..", "email/Template.html")
    );

    let html = file
      .toString()
      .replace("{{URL}}", "https://daysure.mikolaj.dk")
      .replace("{{BODY}}", body)
      .replace("{{TITLE}}", title)
      .replace("{{NAME}}", booking.name);

    await MailService.sendMail({
      to: booking.email,
      subject,
      html,
    });
  }

  static async confirmBooking(req, res) {
    await Booking.findByIdAndUpdate(req.params.id, {
      $set: { confirmed: true },
    });

    const booking = await Booking.findById(req.params.id);
    const start = moment(new Date(booking.start)).format("HH:mm");
    const end = moment(new Date(booking.end)).format("HH:mm");
    const shop = await Shop.findOne({ shop: booking.shop });

    await BookingController.sendBookingEmail(
      req.params.id,
      "Booking Bekræftet",
      `Din booking er bekræftet!`,
      `Din booking er bekræftet hos ${shop.name} (${start} - ${end})`
    );

    res.sendStatus(200);
  }

  static async deleteBooking(req, res) {
    const booking = await Booking.findById(req.params.id);

    const start = moment(new Date(booking.start)).format("YYYY-MM-DD HH:mm");
    const end = moment(new Date(booking.end)).format("HH:mm");

    const shop = await Shop.findOne({ shop: booking.shop });

    const getShopPhone = (shop) => {
      var str = shop.phone;
      var parts = str.match(/.{1,2}/g);
      return parts.join(" "); //returns 123-456-789
    };

    await BookingController.sendBookingEmail(
      req.params.id,
      "Booking Afvist",
      `Din booking er afvist`,
      `Din booking er afvist hos ${
        shop.name
      } (${start} - ${end}). Kontakt venligst ${
        shop.name
      } (tlf. +45 ${getShopPhone(shop)}) for at høre nærmere.`
    );

    await Booking.deleteOne({ _id: req.params.id });
    res.send({
      message: "Booking deleted successfully",
    });
  }

  static async updateBooking(req, res) {
    const booking = await Booking.findById(req.params.id);

    booking.start = req.body.start;
    booking.end = req.body.end;
    await booking.save();

    res.sendStatus(204);
  }

  static async getBookingsBarber(req, res) {
    const bookings = await Booking.find({
      shop: req.params.shopId,
      start: {
        $gte: moment(req.query.start).toDate(),
      },
      end: {
        $lte: moment(req.query.end).toDate(),
      },
    })
      .sort({ updatedAt: -1 })
      .populate("services");

    const shop = await Shop.findOne({ _id: req.params.shopId });

    return res.status(200).json(
      bookings.map((booking) => {
        return {
          start: booking.start,
          end: booking.end,
          title: booking.name,
          id: booking._id,
          phone: booking.phone,
          services: booking.services,
          email: booking.email,
          shop,
          confirmed: booking.confirmed,
        };
      })
    );
  }

  static async createBooking(req, res) {
    const bookingExists = await Booking.findOne({
      $and: [
        {
          shop: req.body.shopId,
        },
        {
          $or: [
            {
              start: {
                $gte: moment(req.body.start).toDate(),
                $lte: moment(req.body.start).toDate(),
              },
            },
            {
              end: {
                $gt: moment(req.body.start).toDate(),
                $lt: moment(req.body.end).toDate(),
              },
            },
          ],
        },
      ],
    });

    if (bookingExists) {
      return res.status(400).send({
        error:
          "Der er en anden der har nået at oprette en booking i denne periode",
      });
    }

    const shop = await Shop.findById(req.body.shopId);
    const shopsOwner = await User.findById(shop.user);

    let booking = new Booking({
      ...req.body,
      services: req.body.services.map((service) => service._id),
      start: req.body.start,
      end: req.body.end,
      bookingId: shortId.generate(),
      shop: req.body.shopId,
    });
    await booking.save();
    booking = await Booking.findById(booking._id).populate("services");

    const url = process.env.SERVER_URL + "/" + shop.slug;

    const file = fs.readFileSync(
      path.join(__dirname, "..", "email/Template.html")
    );

    let html = file
      .toString()
      .replace("{{URL}}", url)
      .replace(
        "{{BODY}}",
        `Du har booket tid hos ${shop.name} 
mellem ${moment(booking.start).format("HH:mm")} og ${moment(booking.end).format(
          "HH:mm"
        )}
den ${moment(booking.start).format(
          "DD/MM/YYYY"
        )}. Vent venligst på at din booking bliver bekræftet.`
      )
      .replace("{{TITLE}}", "Din Booking")
      .replace("{{NAME}}", booking.name);

    const response = await MailService.sendMail({
      to: req.body.email,
      subject: "Din booking - afventer bekræftelse fra shoppen",
      html,
    });

    html = file
      .toString()
      .replace("{{URL}}", url)
      .replace(
        "{{BODY}}",
        `${booking.name} har booket tid i din shop ${shop.name}
mellem ${moment(booking.start).format("HH:mm")} og ${moment(booking.end).format(
          "HH:mm"
        )}
den ${moment(booking.start).format("DD/MM/YYYY")}.`
      )
      .replace("{{TITLE}}", "Ny booking")
      .replace("{{NAME}}", shopsOwner.name);

    await MailService.sendMail({
      to: shopsOwner.email,
      subject: "Ny booking",
      html,
    });

    res.status(201).send({ content: booking });
  }

  static async getBookings(req, res) {
    const bookings = await Booking.find({
      shop: req.params.shopId,
      start: {
        $gte: moment(req.query.date).startOf("day").toDate(),
      },
      end: {
        $lte: moment(req.query.date).endOf("day").toDate(),
      },
    });
    res.send({ bookings });
  }
}
exports.BookingController = BookingController;
