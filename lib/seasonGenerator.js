
const positions = require('./positions')
const clips = require('./clips')

const lodash = require('lodash')


var seasonIds = {};

var sClips = [];
function loadClips(position) {
   return new Promise( (resolve ,reject) => {

        if (Array.isArray(position)) {
            clips.getByPosition(position,
                (clips) => {
                    sClips = clips.map((c) => {
                        c.hard = c.hard == "true"
                        c.prostate = c.prostate == "true"
                        return c;
                    })
    
                    resolve(sClips)
                })
        } else {
            clips.getByPositionBase(position,
                (clips) => {
                    sClips = clips.map((c) => {
                        c.hard = c.hard == "true"
                        c.prostate = c.prostate == "true"
                        return c;
                    })
    
                    resolve(sClips)
                })
        }
    })
    
}

function randomBool() {
    return randomInt(0, 1) == 1;
}
function filterF(items, speed, deep, hard, prostate) {
    return filter(items, 'Fucking', deep, hard, prostate, speed)
}
function filter(items, action, deep, hard, prostate, speed) {

    var deeps = {}
    for (var key in deep) {
        deeps[deep[key]] = true;
    }


    resul = sClips.filter((c) => {
        return (c.action == action
            && (c.hard == hard || hard == undefined)
            && (c.prostate == prostate || prostate == undefined)
            && (c.speed == speed || speed == undefined)
            && (!deep || deeps.hasOwnProperty(c.deep)))
    })
    if (resul.length == 0) {
        resul = sClips.filter((c) => {
            return (c.action == action
                && (c.speed == speed || speed == undefined)
                && (!deep || deeps.hasOwnProperty(c.deep)))
        })
    }
    if (resul.length == 0)
        resul = sClips.filter((c) => { return (c.action == action) })
    if (resul.length == 0)
        return undefined

    var resulRandom = randomArray(resul, items);
    var final = [];
    resulRandom.forEach(function (element, i) {
        let retry = 1
        let other = element
        while (seasonIds.hasOwnProperty(other._id) && retry <= 6) {
            other = randomArray(resul)
            retry++
        }
        seasonIds[other._id] = true;
        final.push(other)
    }, this);


    return final

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
        this.getCaindSeason((stage) => {
            season = season.concat(stage)
            season = season.filter((i) => { return !!i })
            console.log(season.map((item) => {
                return item.action + '  ' + item.position + ' ' + item.speed+ ' ' + item.deep + ' ' + item.hard + ' ' + item.prostate
            }
            ))

            cb(season)
        })
        return;
        
        
                this.getFirstStage((stage) => {
            season = season.concat(stage)
            this.getSecondStage((stage) => {
                season = season.concat(stage)
                this.getTreeStage((stage) => {
                    season = season.concat(stage)
                    this.getRandomStage((stage) => {
                        season = season.concat(stage)
                        season = season.filter((i) => { return !!i })
                        console.log(season.map((item) => {
                            return item.action + '  ' + item.position + '   ' + item.deep + ' ' + item.hard + ' ' + item.prostate
                        }
                        ))

                        cb(season)
                    })
                })
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
            stage = stage.concat(filter(2, 'Fucking', ['Medium', 'Deep'], undefined, randomBool()))
            stage = stage.concat(filter(1, 'Fucking', ['Deep', 'ReallyDeep'], true, randomBool()))
            stage = stage.concat(filter(1, 'Pullout'))
            cb(stage);
        })
    },
    getSecondStage(cb) {

        var position = randomArray(['onFour'])
        loadClips(position, () => {
            var stage = [];
            stage = stage.concat(filter(1, 'Insert', ['Medium', 'Deep', 'ReallyDeep'], false, false))
            stage = stage.concat(filter(2, 'Fucking', ['Medium'], false, false))
            stage = stage.concat(filter(2, 'Fucking', ['Deep'], false, false))
            stage = stage.concat(filter(1, 'Fucking', ['Deep'], false, true))
            stage = stage.concat(filter(2, 'Fucking', ['Deep'], randomBool(), randomBool()))
            stage = stage.concat(filter(randomInt(1, 2), 'Fucking', ['ReallyDeep'], false, randomBool()))
            stage = stage.concat(filter(1, 'Pullout'))
            stage = stage.concat(filter(1, 'Insert', ['Medium', 'Deep', 'ReallyDeep'], undefined, undefined))
            stage = stage.concat(filter(2, 'Fucking', ['Deep', 'ReallyDeep'], true, false))
            stage = stage.concat(filter(2, 'Fucking', ['Medium', 'Deep', 'ReallyDeep'], false, false))
            stage = stage.concat(filter(3, 'Fucking', ['Deep', 'ReallyDeep'], true, randomBool()))
            stage = stage.concat(filter(1, 'Pullout'))
            cb(stage);
        })
    },
    getTreeStage(cb) {

        var position = randomArray(['onBack'])
        loadClips(position, () => {
            var stage = [];
            stage = stage.concat(filter(1, 'Insert', ['Tip'], true, false))
            stage = stage.concat(filter(1, 'Fucking', ['Deep', 'ReallyDeep'], true, false))
            stage = stage.concat(filter(2, 'Fucking', ['Medium', 'Deep', 'ReallyDeep'], false, true))
            stage = stage.concat(filter(3, 'Fucking', ['Deep', 'ReallyDeep'], randomBool(), randomBool()))
            stage = stage.concat(filter(2, 'Fucking', ['ReallyDeep'], undefined, undefined))
            stage = stage.concat(filter(2, 'Fucking', ['Deep',], true, false))
            stage = stage.concat(filter(3, 'Fucking', ['Medium', 'Deep',], false, true))
            stage = stage.concat(filter(2, 'Fucking', ['ReallyDeep'], randomBool(), false))
            stage = stage.concat(filter(2, 'Fucking', ['Medium', 'Deep', 'ReallyDeep'], true, false))
            stage = stage.concat(filter(1, 'Pullout'))
            cb(stage);
        })
    },
    getCaindSeason(cb) {
        var stage = [];
        loadClips(['onSide', 'onSideLiftLeg']).then(() => {
            stage = stage.concat(filter(1, 'Insert'))
            stage = stage.concat(filterF(1, 'Slow', ['Tip', 'Medium']))
            stage = stage.concat(filterF(1, 'Slow', ['Medium']))
            stage = stage.concat(filterF(1, 'Lassy', ['Tip']))
            stage = stage.concat(filterF(1, 'Lassy', ['Medium']))
            stage = stage.concat(filterF(1, 'Slow', ['Deep']))
            stage = stage.concat(filterF(1, 'Lassy', ['Medium']))
            stage = stage.concat(filterF(1, 'Fast', ['Medium']))
            stage = stage.concat(filterF(1, 'Lassy', ['Medium']))
            stage = stage.concat(filterF(1, 'Lassy', ['Deep']))
            stage = stage.concat(filterF(1, 'Slow', ['ReallyDeep']))
            stage = stage.concat(filter(1, 'Pullout'))
           
        }).then(()=>{return loadClips(['onFour', 'onFourLiftLeg'])})
        .then(() => {           
            stage = stage.concat(filter(1, 'Insert'))
            stage = stage.concat(filterF(1, 'Slow', [ 'Medium']))
            stage = stage.concat(filterF(1, 'Slow', ['Medium','Deep']))
            stage = stage.concat(filterF(1, 'Lassy',  ['Medium','Deep']))
            stage = stage.concat(filterF(1, 'Lassy', ['Medium']))
            stage = stage.concat(filterF(1, 'Lassy', ['Deep']))
            stage = stage.concat(filterF(1, 'Slow', ['Deep']))
            stage = stage.concat(filterF(1, 'Fast', ['Medium']))
            stage = stage.concat(filterF(1, 'Fast', ['Deep']))
            stage = stage.concat(filterF(1, 'Lassy', ['Deep']))
            stage = stage.concat(filterF(1, 'Lassy', ['ReallyDeep']))
            stage = stage.concat(filterF(1, 'Fast', ['Medium']))
            stage = stage.concat(filterF(1, 'Fast', ['Deep']))
            stage = stage.concat(filterF(1, 'Lassy', ['ReallyDeep']))
            stage = stage.concat(filter(1, 'Pullout'))
            cb(stage)
    })

},
    getRandomStage(cb) {

        var position = randomArray(positions.bases)
        loadClips(position, () => {
            var stage = [];
            stage = stage.concat(filter(1, 'Insert', ['Medium', 'Deep', 'ReallyDeep'], undefined, undefined))
            for (var i = 0; i < 6; i++) {
                let clipsCount = randomInt(1, 3)
                stage = stage.concat(filter(clipsCount, 'Fucking', ['Medium', 'Deep', 'ReallyDeep'], randomBool(), randomBool()))
            }
            stage = stage.concat(filter(1, 'Pullout'))
            cb(stage);
        })
    },
    getFullyRandomStage(type) {
        var position = randomArray(['onBack', 'onFour'])
        loadClips(position, () => {
            var deeps = []
            switch (type) {
                case 'soft':
                    deeps = ['Tip', 'Medium', 'Deep',]
                    speed = ["slow", "lassy"]
                    break;
                case 'increase':
                    break;
                case 'hard':
                    break;
                default:
                    break;
            }


            var stage = [];
            stage = stage.concat(filter(1, 'Insert', ['Medium', 'Deep', 'ReallyDeep'], undefined, undefined))
            for (var i = 0; i < 6; i++) {
                let clipsCount = randomInt(1, 3)
                stage = stage.concat(filter(clipsCount, 'Fucking', ['Medium', 'Deep', 'ReallyDeep'], randomBool(), randomBool()))
            }
            stage = stage.concat(filter(1, 'Pullout'))
            cb(stage);
        })
    },

}

