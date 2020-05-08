const path = require('path');
const express = require('express');
const { PORT } = require('../config.server.json');

const test = require('./cloudfunction/test/').main;
const heWeather = require('./cloudfunction/he-weather').main;
const heAir = require('./cloudfunction/he-air').main;

const app = express();

// 添加云函数mock
app.get('/api/test', (req, res) => {
  // 将 req.query 传入
  test(req.query)
    .then(res.json.bind(res))
    .catch((err) => {
      console.log(err);
    });
});

app.get('/api/he-weather', (req, res, next) => {
  // 将 req.query 传入
  heWeather(req.query)
    .then(res.json.bind(res))
    .catch((err) => {
      console.log(err);
      res.status(err.status).send(err.msg);
    });
});

app.get('/api/he-air', (req, res, next) => {
  heAir(req.query)
    .then(res.json.bind(res))
    .catch((err) => {
      console.log(err);
      res.status(err.status).send(err.msg);
    })
})

// 添加static
app.use(
  './static',
  express.static(path.join(__dirname, 'static'), {
    index: false,
    maxAge: '30d'
  })
);

app.listen(PORT, () => {
  console.log(`开发服务器启动成功：http://127.0.0.1:${PORT}`)
});