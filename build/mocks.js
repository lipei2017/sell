const express = require('express')
const router = express.Router()
let mockData = require('../data')

router.get('/seller',(req, res) => {
  res.json({
    errno: 0,
    data: mockData.seller
  })
})

router.get('/goods',(req, res) => {
  res.json({
    errno: 0,
    data: mockData.goods
  })
})

router.get('/ratings',(req, res) => {
  res.json({
    errno: 0,
    data: mockData.ratings
  })
})

module.exports = router
