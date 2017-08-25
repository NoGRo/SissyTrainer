var express = require('express');
var path = require('path');
var clips = require('../lib/clips.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.sendfile(path.join(__dirname, 'player.html'))

})
router.get('/getClips', function (req, res, next) {
    clips.getByPosition(req.query.position, (docs) => {
        res.send(docs)
    })
})
router.post('/Save', function (req, res, next) {
    clips.addMetadata(req.body,()=>{
        clips.getPendingOne((doc) => {
            res.send(doc)
        })

    })
})
module.exports = router;