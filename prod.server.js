var express = require('express');
var config = require('./config/index');
var mockData = require('./data');
var path = require('path');
var history = require('connect-history-api-fallback');

var port = process.env.PORT || config.build.port;

history({
  index: '/index.html',
  rewrites: [
    {from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html')},
  ],
});

var app = express();
app.use(history());
var router = express.Router();

router.get('/',function (req,res,next) {
  req.url = '/index.html';
  next();
});

app.use(router);

var apiRouters = express.Router();

apiRouters.get('/seller',(req, res) => {
  res.json({
    errno: 0,
    data: mockData.seller
  })
});

apiRouters.get('/goods',(req, res) => {
  res.json({
    errno: 0,
    data: mockData.goods
  })
});

apiRouters.get('/ratings',(req, res) => {
  res.json({
    errno: 0,
    data: mockData.ratings
  })
});
app.use('/api', apiRouters);

app.use(express.static('./dist'));

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('listening at...')
});
