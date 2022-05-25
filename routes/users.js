let express = require('express');
const bcrypt = require('bcryptjs');
let {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()
var router = express.Router();
/* GET users listing. */
router.get('/', async function (req, res, next) {
    let users = await prisma.users.findMany({
        include: {
            posts: true,
        },
    });
    res.send({
        data: users,
        message: 'Records retrieved successfully!'
    });
});
router.post('/', async function (req, res) {
    let user = await prisma.users.create({
        data: {
            name: req.query.name,
            email: req.query.email,
            phone: req.query.phone,
            password: bcrypt.hashSync(req.query.password, 8)
        },
    }).catch((e) => {
        res.send({
            error: 'Error creating user',
        })
    })
    res.send({
        data: user,
        message: 'Records retrieved successfully!'
    });
})
router.get('/:id', async function (req, res) {
    let user = await prisma.users.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    res.send({
        data: user,
        message: 'Records retrieved successfully!'
    });
})
router.put('/:id', async function (req, res) {
    let user = await prisma.users.update({
        where: {
            id: parseInt(req.params.id)
        },
        data: {
            ...(req.query.phone ? {  phone: req.query.phone} : {}),
            ...(req.query.password ? {  password: bcrypt.hashSync(req.query.password, 8)} : {}),
            name: req.query.name,
        }
    }).catch((e) => {
        res.send({
            error: e,
            message: 'Error retrieving successfully!'
        });
    })
    res.send({
        data: user,
        message: 'Records retrieved successfully!'
    });
})
module.exports = router;
