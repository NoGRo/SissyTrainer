const fs = require("fs")
const path = require("path")
const hash = require("./hash.js")
const ffmpeg = require('fluent-ffmpeg')
const positions = require('./positions')
const Datastore = require('nedb')
    , db = new Datastore({ filename: 'database/clips.db', autoload: true });
module.exports = {
    checkAll(cb) {
        db.update({ state: "ready" }, { $set: { state: "check" } }, { multi: true }, cbª)
    },
    parseAll(filter, cb) {
        db.find(filter, (err, docs) => {
            docs.forEach((clip) => {
                clip.save = () => { db.update({ _id: clip._id }, clip, {}, null) }
                cb(clip)
            })
        })
    },
    getByPositionBase(posBase, cb) {
        db.find({ state: "ready", position: { $in: positions.related[posBase] } }, (err, docs) => { cb(docs) })
    },
    getByPosition(pos, cb) {
        db.find({ state: "ready", position: { $in: pos } }, (err, docs) => { cb(docs) })
    },
    getSkip(cb) {
        db.findOne({ state: { $in: ['mp4', 'check'] } }, (err, doc) => {
            if (!doc) {
                cb()
                return
            }
            doc.state = "skip"
            db.update({ _id: doc._id }, doc, {}, cb)
        })
    },
    getPendingOne(cb) {
        db.findOne({ state: { $in: ['mp4', 'check'] } }, (err, doc) => {
            cb(doc)
        })
    },
    parseFolder(folder, cb) {
        fs.readdir(folder, function (err, files) {
            if (err) {
                throw err;
            }
            files.map((file) => {
                return path.join(folder, file);
            }).filter((file) => {
                return fs.statSync(file).isFile()
                    && path.extname(file) == '.gif';
            }).forEach((file) => {

                hash.computeHash(file).then((h) => {
                    db.findOne({ originalHash: h }, (err, doc) => {
                        if (!doc) { //filtra repetidos por hash
                            db.insert({
                                originalPath: file,
                                originalHash: h,
                                state: 'gif'
                            }, (err, doc) => {
                                console.log(err, doc)
                            });
                        }
                    })
                })
            })
        });
    },
    convertPending() {
        db.find({ state: 'gif' }, (err, clips) => {
            clips.forEach((clip) => {

                clip.videoPath = path.join(process.cwd(), 'database', 'clips', clip._id + ".mp4")

                new ffmpeg({ source: clip.originalPath })
                    .inputFormat('gif')
                    .outputOptions([
                        '-movflags faststart',
                        '-pix_fmt yuv420p',
                        '-vf scale=trunc(iw/2)*2:trunc(ih/2)*2'
                    ])
                    .toFormat('mp4')
                    .on('end', function () {
                        clip.state = "mp4"
                        db.update({ _id: clip._id }, clip, {}, (err, doc) => {
                            if (err) console.log(err)
                        });
                    })
                    .saveToFile(clip.videoPath)
            })

        })
    },
    addMetadata(data, cb) {
        if (!data._id) {
            cb()
            return
        }
        if (data.strokes) {
           
            var speed = data.duration / data.strokes
            data.bpm = parseInt(60 / speed)
            if (speed > 0.7)
                data.speed = 'Slow'
            else if (speed > 0.4)
                data.speed = 'Lassy'
            else
                data.speed = 'Fast'
        }
        else
            data.speed = 'Fast'


        db.update({ _id: data._id }, { $set: data }, {}, cb)
    }
}

