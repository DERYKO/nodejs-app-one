var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.mkdir('./uploads/', (err) => {
            cb(null, './public/images/');
        });
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage})
let {PrismaClient} = require('@prisma/client');
const {body, validationResult, check} = require('express-validator');
const prisma = new PrismaClient()
/* GET home page. */
router.get('/', async function (req, res, next) {
    let posts = await prisma.posts.findMany({
        include: {
            author: {
                select: {
                    id: true,
                    name: true
                }
            },
            post_attachments: {
                select: {
                    id: true,
                    path: true
                }
            }
        }
    })
    res.send({
        data: posts,
        message: 'All posts'
    })
});
router.post('/', upload.single('images'), async function (req, res, next) {
    let post = await prisma.posts.create({
        data: {
            title: req.body.title,
            description: req.body.description,
            author_id: parseInt(req.body.author_id),
            published: req.body.published == 1 ? true : false,
            post_attachments: {
                create: {
                    path: 'images/'+req.file.originalname
                }
            }
        }
    }).catch((e) => {
        res.send({
            error: e.message,
            message: 'All posts'
        })
    });
    res.send({
        data: post,
        message: 'All posts'
    })
});

module.exports = router;
