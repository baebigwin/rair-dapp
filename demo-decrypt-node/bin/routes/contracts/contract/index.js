const express = require('express');

module.exports = context => {
  const router = express.Router()

  // Get specific contract
  router.get('/', async (req, res, next) => {
    try {
      // // const { adminNFT: user } = req.user;
      // const { contractAddress, blockchain } = req;
      //
      // const contract = await context.db.Contract.findOne({ contractAddress, blockchain });

      res.json({ success: true, contract: req.contract });
    } catch (e) {
      next(e);
    }
  });

  // Delete specific contract
  router.delete('/', async (req, res, next) => {
    try {
      // const { adminNFT: user } = req.user;
      const { contract } = req;

      await context.db.Contract.deleteOne({ _id: contract._id });

      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  });

  // Find all products for particular contracts
  router.get('/products', async (req, res, next) => {
    try {
      const { contract } = req;

      const products = await context.db.Product.find({ contract: contract._id });

      res.json({ success: true, products });
    } catch (err) {
      next(err);
    }
  });

  // Find all products with all offers for each of them for particular contract
  router.get('/products/offers', async (req, res, next) => {
    try {
      const { contract } = req;

      const products = await context.db.Product.aggregate([
        { $match: { contract: contract._id } },
        { $sort: { creationDate: -1 } },
        {
          $lookup: {
            from: 'OfferPool',
            let: {
              contr: '$contract',
              prod: '$collectionIndexInContract'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          '$contract',
                          '$$contr'
                        ]
                      },
                      {
                        $eq: [
                          '$product',
                          '$$prod'
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: 'offerPools'
          }
        },
        { $unwind: '$offerPools' },
        {
          $lookup: {
            from: 'Offer',
            localField: 'offerPools.marketplaceCatalogIndex',
            foreignField: 'offerPool',
            as: 'offers'
          }
        },
        { $project: { offerPools: false } }
      ]);

      res.json({ success: true, products });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
