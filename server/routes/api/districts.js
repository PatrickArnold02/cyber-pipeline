/**
 * @swagger
 * tags:
 *   name: Districts
 *   description: Districts API
 */

// Load Libraries
const express = require('express')
const router = express.Router()

// Load Middleware
const adminOnly = require('../../middlewares/admin-only')

// Load Models
const District = require('../../models/district')

/**
 * @swagger
 * /api/v1/districts:
 *   get:
 *     summary: <admin> list all the districts
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of districts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/District'
 */
router.get('/', adminOnly, async function (req, res, next) {
  let districts = await District.query()
    .select(
      'districts.id',
      'districts.name',
      'districts.usd',
      'districts.url',
      'districts.rural',
      'districts.urban',
      'districts.suburban',
      'districts.town',
      'districts.notes'
    )
    .withGraphJoined('teachers')
    .modifyGraph('teachers', (builder) => {
      builder.select('teachers.id', 'teachers.name')
    })
  res.json(districts)
})

/**
 * @swagger
 * /api/v1/districts:
 *   put:
 *     summary: <admin> create district
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: district
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *           example:
 *             name: School District
 *             usd: 123
 *             url: https://www.usd123.local/
 *             rural: 0
 *             urban: 1
 *             suburban: 0
 *             town: 0
 *             notes: This is a test district
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.put('/', adminOnly, async function (req, res, next) {
  try {
    // // strip out other data from teachers
    // const teachers = req.body.district.teachers.map(({ id, ...next }) => {
    //   return {
    //     id: id,
    //   }
    // })
    await District.query().upsertGraph(
      {
        name: req.body.district.name,
        url: req.body.district.url,
        usd: req.body.district.usd,
        rural: req.body.district.rural,
        urban: req.body.district.urban,
        suburban: req.body.district.suburban,
        town: req.body.district.town,
        notes: req.body.district.notes,
        // teachers: teachers,
      },
      {
        relate: true,
        unrelate: true,
      }
    )
    res.status(200)
    res.json({ message: 'District Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/**
 * @swagger
 * /api/v1/districts/{id}:
 *   post:
 *     summary: <admin> update district
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: district ID
 *     requestBody:
 *       description: district
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *           example:
 *             id: 1
 *             name: School District
 *             usd: 123
 *             url: https://www.usd123.local/
 *             rural: 0
 *             urban: 1
 *             suburban: 0
 *             town: 0
 *             notes: This is a test district
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.post('/:id', adminOnly, async function (req, res, next) {
  try {
    // strip out other data from teachers
    // const teachers = req.body.district.teachers.map(({ id, ...next }) => {
    //   return {
    //     id: id,
    //   }
    // })
    await District.query().upsertGraph(
      {
        id: req.params.id,
        name: req.body.district.name,
        url: req.body.district.url,
        usd: req.body.district.usd,
        rural: req.body.district.rural,
        urban: req.body.district.urban,
        suburban: req.body.district.suburban,
        town: req.body.district.town,
        notes: req.body.district.notes,
        // teachers: teachers,
      },
      {
        relate: true,
        unrelate: true,
      }
    )
    res.status(200)
    res.json({ message: 'District Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/**
 * @swagger
 * /api/v1/districts/{id}:
 *   delete:
 *     summary: <admin> delete district
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: district ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.delete('/:id', adminOnly, async function (req, res, next) {
  try {
    var deleted = await District.query().deleteById(req.params.id)
    if (deleted === 1) {
      res.status(200)
      res.json({ message: 'District Deleted' })
    } else {
      res.status(422)
      res.json({ error: 'District Not Found' })
    }
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

module.exports = router
