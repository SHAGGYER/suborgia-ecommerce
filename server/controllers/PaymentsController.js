const Product = require("../models/Product");

class PaymentsController {
  static getAbsoluteTotal(total) {
    return Math.round(total / 0.5) * 0.5;
  }

  static async create(req, res) {
    const total = PaymentsController.getAbsoluteTotal(req.body.total);
    const change = PaymentsController.getAbsoluteTotal(
      req.body.amountPaid - total
    );

    console.log(req.body.lines);

    for (let line of req.body.lines) {
      if (line.product) {
        const product = await Product.findById(line._id);
        product.quantity -= line.quantity;
        await product.save();
      }
    }

    return res.send({
      total: total.toFixed(2),
      amountPaid:
        req.body.amountPaid > 0
          ? parseFloat(req.body.amountPaid).toFixed(2)
          : 0,
      change: change >= 0.5 ? change.toFixed(2) : 0,
    });
  }
}

module.exports = PaymentsController;
