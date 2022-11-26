const Product = require("../models/Product");
const User = require("../models/User");
const Shop = require("../models/Shop");
const { ValidationService } = require("../services/ValidationService");

function getRandomArbitrary(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

exports.ProductController = class {
  static async getRandomSku(req, res) {
    const randomSku = getRandomArbitrary(parseInt(1000), 999999);
    res.send({ content: randomSku });
  }

  static async update(req, res) {
    const user = await User.findById(res.locals.userId);
    const errors = await ValidationService.run(
      {
        shopId: [[(val) => !val, "Shop er påkrævet."]],
        title: [[(val) => !val, "Title is required"]],
        buyPrice: [[(val) => !val && isNaN(val), "Buy Price is required"]],
        sellPrice: [[(val) => !val && isNaN(val), "Sell Price is required"]],
        sku: [
          [(val) => !val, "SKU is required"],
          [
            async (val) => {
              const productExists = await Product.findOne({
                sku: val,
              });

              console.log(productExists._id, req.params.id);

              if (productExists && productExists._id == req.params.id) {
                return false;
              }

              return !!productExists;
            },
            "SKU is taken",
          ],
        ],
      },
      req.body
    );

    if (Object.keys(errors).length) {
      return res.status(403).send({ errors });
    }

    await Product.findByIdAndUpdate(req.params.id, { $set: req.body });
    res.sendStatus(204);
  }

  static async deleteProducts(req, res) {
    for (let id of req.body.ids) {
      await Product.findByIdAndUpdate(id, { $set: { deletedAt: new Date() } });
    }

    return res.sendStatus(204);
  }

  static async search(req, res) {
    const user = await User.findById(res.locals.userId);
    const shops = await Shop.find({ user: user._id });

    const regexString = new RegExp(req.query.search, "i");

    const query = [
      {
        $lookup: {
          from: "shops",
          localField: "shopId",
          foreignField: "_id",
          as: "shop",
        },
      },
      {
        $unwind: {
          path: "$shop",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $and: [
            {
              deletedAt: {
                $eq: undefined,
              },
            },
            {
              shopId: {
                $in: shops.map((shop) => shop._id),
              },
            },
            {
              $or: [
                {
                  "shop.name": regexString,
                },
                { title: regexString },
                { sku: regexString },
              ],
            },
          ],
        },
      },
    ];

    const products = await Product.aggregate([
      ...query,
      {
        $skip: parseInt(req.query.page - 1) * 10,
      },
      {
        $limit: 10,
      },
    ]);

    const totalRows = await Product.aggregate(query);

    res.send({
      content: products,
      totalRows: totalRows.length,
      page: parseInt(req.query.page),
      search: req.query.search,
    });
  }

  static async create(req, res) {
    const user = await User.findById(res.locals.userId);

    const errors = await ValidationService.run(
      {
        shopId: [[(val) => !val, "Shop er påkrævet."]],
        title: [[(val) => !val, "Title is required"]],
        buyPrice: [[(val) => !val && isNaN(val), "Buy Price is required"]],
        sellPrice: [[(val) => !val && isNaN(val), "Sell Price is required"]],
        sku: [
          [(val) => !val, "SKU is required"],
          [
            async (val) => {
              const productExists = await Product.findOne({
                shopId: user.shop,
                sku: val,
              });
              return !!productExists;
            },
            "SKU is taken",
          ],
        ],
      },
      req.body
    );

    if (Object.keys(errors).length) {
      return res.status(403).send({ errors });
    }

    const product = new Product({ ...req.body });
    await product.save();
    res.send({ content: product });
  }
};
