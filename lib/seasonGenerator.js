const Datastore = require('nedb')
    , db = new Datastore({ filename: 'database/clips.db', autoload: true });
const positions = require('positions')

const loadash = require('loadash')


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomBool() {
    return randomInt(0, 1) == 1;
}
function filterRandom(clips, deep, hard, prostate, items) {
    deeps = {}
    clips.forEach((item) => { deeps[item] = true; })

    resul = clips.filter((c) => { return (c.hard == hard && c.prostate == prostate && deeps.hasOwnProperty(c.deep)) })
    return randomArray(resul, items);
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

module.exports = {
    getFirstStage() {

        var position = positions.bases[randomInt(0, positions.bases.length)]
        var stage = [];

        stage.concat(getFirstInsert(position))

    },

    getFirstInsert(position) {

        db.find({
            action: 'Insert',
            position: { $in: positions.related[position] },
            deep: { $in: ['Tip', 'Medium'] },
            hard: false
        }, (err, clips) => {
            return filterRandom(clps, ['Tip', 'Medium'], false, false, 2);
        })
    },
    getFirstFucking() {

        db.find({
            action: 'Fucking',
            position: { $in: positions.related[position] },
        }, (err, clips) => {
            if (clips.length == 0) return

            fuckingClips = filterRandom(clps, ['Tip', 'Medium'], false, false, 2);
            fuckingClips.concat(filterRandom(clps, ['Medium', 'Deep'], false, randomBool(), 3))
            fuckingClips.concat(filterRandom(clps, ['Medium', 'Deep', 'Really Deep'], randomBool(), randomBool(), 2))
            fuckingClips.concat(filterRandom(clps, ['Deep', 'Really Deep'], true, randomBool(), 1))
            return fuckingClips
        })


    }

}
    
