var express = require('express');
var router = express.Router();
var db = require('./../database/db');
var bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).send('respond with a resource');
});

var doRegister = (username, password) => {
  return new Promise((resolve, reject) => {
    var hashPassword = bcrypt.hashSync(password, 10);
    db.query('insert into users (username, password) value (?, ?)', [username, hashPassword], (error, result) => {
        if(!!error) reject(error);
        resolve(result);
     }
    );
  });
};

var doLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    db.query('select username, password from users where username = ?', [username], (error, result) => {
      if(!!error) reject(error);
      if(result.length == 0) reject(error);
      
      const isUserExists = bcrypt.compareSync(password, result[0].password);

      if(isUserExists){
        const token = jwt.sign(
          {
            username: result[0].username,
          }, 
          process.env.API_SECRET,
          {
            expiresIn: '1d',
          }
        );
        resolve({
          username: result[0].username,
          token: token,
        });
      }
    });
  });
};

router.post('/register', (req, res, next) => {
  const body = req.body;
  doRegister(body.username, body.password).then(
    (result) => {
    res.status(200).send("Register Success");
    },
    (error) => {
      res.status(500).send(error);
    }
  );
});

router.post('/login', (req, res, next) => {
  const body = req.body;
  doLogin(body.username, body.password).then(
    (result) => {
    res.status(200).json(result);
    },
    (error) => {
      res.status(500).send(error);
    }
  );
});

module.exports = router;
