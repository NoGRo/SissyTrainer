var express = require('express')
var path = require('path')
var clips = require('../lib/clips.js')
var router = express.Router()

/* GET users listing. */

router.get('/', function (req, res, next) {
    res.sendfile(path.join(__dirname, 'clipMaker.html'))

})
router.get('/skip', function (req, res, next) {

    clips.getSkip((err) => {
        clips.getPendingOne((doc) => {
            res.send(doc)
        })
    })
})
router.get('/parse', function (req, res, next) {
    clips.parseFolder("e:/porno/clips")
    res.send('Ok!')
})
router.get('/convert', function (req, res, next) {
    clips.convertPending()
    res.send('Ok!')
})
router.get('/checkAll', function (req, res, next) {

    clips.checkAll((err) => {
        clips.getPendingOne((doc) => {
            res.send(doc)
        })
    })
})
router.post('/save', function (req, res, next) {
    clips.addMetadata(req.body, () => {
        clips.getPendingOne((doc) => {
            res.send(doc)
        })
    })
})

module.exports = router;
