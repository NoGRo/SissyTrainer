var express = require('express');
var path = require('path');
//var clips = require('../lib/clips.js');
var sg = require('../lib/seasonGenerator.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.sendfile(path.join(__dirname, 'player.html'))

})
router.get('/getClips', function (req, res, next) {
    sg.getSeason((clips) => {
        res.json(clips)
    })
})
module.exports = router;