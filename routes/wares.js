var express = require('express');
var router = express.Router();
var db = require('./../database/db');
var multer = require('multer');
var auth = require('./../middleware/auth');

var getWares = new Promise((resolve, reject) => {
    db.query("select * from wares", (error, result) => {
        if(!!error) reject(error);
        resolve(result);
    });
});

var getWaresById = (id) => {
        return new Promise((resolve, reject) => {
        db.query('select * from wares where id = ?', [id], (error, result) => {
            if(!!error) reject(error);
            resolve(result);
        });
    });
}

var createWares = (name, rarity, category, type, image, detail, price, quantity, date) => {
    return new Promise((resolve, reject) => {
    db.query('insert into wares (name, rarity, category, type, image, detail, price, quantity, date) values(?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, rarity, category, type, image, detail, price, quantity, date], (error, result) => {
        if(!!error) reject(error);
        resolve(result);
    });
});
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`);
    },
});

var upload = multer({
    storage: storage,
});

router.get('/', (req, res, next) => {
    getWares.then(
        (result) => {
            res.status(200).json(result);
        },
        (error) => {
            res.status(500).send(error);
        }
    );
});

router.get('/get/:id', function(req, res, next) {
    console.log(req.params.id);
    getWaresById(req.params.id).then(
        (result) => {
            res.status(200).json(result);
        },
        (error) => {
            res.status(500).send(error);
        }
    );
});

router.post('/create', upload.single('image'), (req, res, next) => {
    const body = req.body;
    createWares(body.name, body.rarity, body.category, body.type, req.file.path.replace('public\\', ''), body.detail, body.price, body.quantity, body.date).then(
        (result) => {
            res.status(200).json(result);
        },
        (error) => {
            res.status(500).send(error);
        }
    );
});

module.exports = router;