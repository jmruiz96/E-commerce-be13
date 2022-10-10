const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {

    const getTags = await Tag.findAll({

      include: [{ model: Product }]

    });

    res.status(200).json(getTags)

  } catch (err) {

    res.status(400).json(err)
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {

    const { tId } = req.params;

    const getTag = await Tag.findByPk(id, {
      include: [{ model: Product }]
    });

    if (!getTag) {

      res.status(404).json({ message: `Cannot find tag id:${tId}` });

      return;
    }

    res.status(200).json(getTag);

  } catch (err) {

    res.status(400).json(err)
  }
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create(req.body)
    .then((tag) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      //switch tag and product? from product-routes
      if (req.body.productIds.length) {
        const tagProductIdArr = req.body.productIds.map((product_id) => {
          return {
            tag_id: tag.id,
            product_id,
          };
        });
        return ProductTag.bulkCreate(tagProductIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(tag);
    })
    .then((tagProductIds) => res.status(200).json(tagProductIds))

    .catch((err) => {

      console.log(err);
      
      res.status(400).json(err);
    
    });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  //same as previous route^^
  // update product data
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { tag_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ product_id }) => product_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.productIds
        .filter((product_id) => !productTagIds.includes(product_id))
        .map((product_id) => {
          return {
            tag_id: req.params.id,
            product_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ product_id }) => !req.body.productIds.includes(product_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const { dId } = req.params
    const delTag = await Tag.destroy({
      where: {
        id: id
      }
    })

    if (!delTag) {

      res.status(404).json({ message: `Cannot find tag id:${dId}` })
    }
    res.status(200).json({ message: `Deleted tag id:${dId}` })

  } catch (err) {

    res.status(400).json(err)

  }
});

module.exports = router;
