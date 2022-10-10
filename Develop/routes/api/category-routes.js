const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const getCats = await Category.findAll({
      include: [{ model: Product }]
    }
    );
    res.status(200).json(getCats)
  } catch (err) {
    res.status(400).json(err)

  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const { id } = req.params;
    const getCat = await Category.findByPk(id, {

      include: [{ model: Product }]

    });

    if (!getCat) {
      res.status(404).json({ message: `Cannot find category id:${id} :( ` });

      return; }
    res.status(200).json(getCat);
  } catch (err) {
    res.status(400).json(err)
  }

});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCat = await Category.create({
      category_name: req.body.category_name
    }
    )
    res.status(200).json(newCat)
  } catch (err) {
    res.status(400).json(err)
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const { uId } = req.params;
    const updCat = await Category.update(
      {
        category_name: req.body.category_name,
      },
      {
        where: {
          id: id
        }}
    );

    if (!updCat) {
      res.status(404).json({ message: `Cannot find category id:${uId} :(` });
      return;
    };
    res.status(200).json({ message: `Updated category id:${uId}` })
  } catch (err) {
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  //
  try {
    const { dId } = req.params
    const delCat = await Category.destroy({
      where: {
        id: id
      }
    }
  )
    if (!delCat) {
      res.status(404).json({ message: `Cannot find category id:${dId} :(` })
    }
    res.status(200).json({ message: `Deleted category id:${dId}` })
  } catch (err) {

    res.status(400).json(err)
  }
});

module.exports = router;
