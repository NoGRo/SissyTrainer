
const positions = require('./positions')
const clips = require('./clips')

const lodash = require('lodash')


var sClips = [];
function loadClips(position, cb) {
    clips.getByPosition(position,
        (clips) => {
            sClips = clips.map((c) => {
                c.hard = c.hard == "true"
                c.prostate = c.prostate == "true"
                return c;
            })

            cb(sClips)
        })
}

function randomBool() {
    return randomInt(0, 1) == 1;
}
function filter(items, action, deep, hard, prostate) {

    var deeps = {}
    for (var key in deep) {
        deeps[deep[key]] = true;
    }


    resul = sClips.filter((c) => {
        return (c.action == action
            && (c.hard == hard || hard == undefined)
            && (c.prostate == prostate || prostate == undefined)
            && (!deep || deeps.hasOwnProperty(c.deep)))
    })
    if (resul.length == 0) {
        resul = sClips.filter((c) => {
            return (c.action == action
                && (!deep || deeps.hasOwnProperty(c.deep)))
        })
    }
    if (resul.length == 0)
        resul = sClips.filter((c) => { return (c.action == action) })
    if (resul.length == 0)
        return undefined

    resul = randomArray(resul, items);
    
    return resul

}
function randomArray(array, items, repeat) {

    if (!items)
        return array[randomInt(0, array.length - 1)];

    var final = [];
    var lastI = -1
    for (var i = 0; i < items; i++) {
        var index = randomInt(0, array.length - 1)

        if (array.length > 1)
            while (lastI == index)
                index = randomInt(0, array.length - 1)

        lastI = index;

        final.push(array[index]);

    }
    return final;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
    getSeason(cb) {
        var season = []
        this.getFirstStage((stage) => {
            season = season.concat(stage)
            this.getSecondStage((stage) => {
                season = season.concat(stage)
                season = season.filter((i) => { return !!i })
                console.log(season)
                cb(season)
            })
        })


    },
    getFirstStage(cb) {

        var position = randomArray(positions.bases)

        loadClips(position, () => {
            var stage = [];
            stage = stage.concat(filter(1, 'Insert', ['Tip', 'Medium'], false, false))
            stage = stage.concat(filter(2, 'Fucking', ['Tip', 'Medium'], false, false))
            stage = stage.concat(filter(3, 'Fucking', ['Medium', 'Deep'], false, randomBool()))
            stage = stage.concat(filter(2, 'Fucking', ['Medium', 'Deep', 'ReallyDeep'], undefined, randomBool()))
            stage = stage.concat(filter(1, 'Fucking', ['Deep', 'ReallyDeep'], true, randomBool()))
            stage = stage.concat(filter(1, 'Pullout'))
            cb(stage);
        })
    },
    getSecondStage(cb) {

        var position = randomArray(['onBack','onFour'])
        loadClips(position, () => {
            var stage = [];
            stage = stage.concat(filter(1, 'Insert', ['Medium', 'Deep', 'ReallyDeep'], false, false))
            stage = stage.concat(filter(2, 'Fucking', ['Medium', 'Deep'], false, false))
            stage = stage.concat(filter(4, 'Fucking', ['Medium', 'Deep', 'ReallyDeep'], false, randomBool()))

            stage = stage.concat(filter(1, 'Pullout'))
            stage = stage.concat(filter(1, 'Insert', ['Medium','Deep', 'ReallyDeep'], undefined, undefined))

            stage = stage.concat(filter(2, 'Fucking', ['Deep', 'ReallyDeep'], true, false))
            stage = stage.concat(filter(2, 'Fucking', ['Medium', 'Deep', 'ReallyDeep'], false, false))
            stage = stage.concat(filter(3, 'Fucking', ['Deep', 'ReallyDeep'], true, randomBool()))
            stage = stage.concat(filter(1, 'Pullout'))
            cb(stage);
        })
    }


}

