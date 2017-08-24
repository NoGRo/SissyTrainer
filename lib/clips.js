const fs = require("fs")
const path = require("path")
const hash = require("./hash.js")
const ffmpeg = require('fluent-ffmpeg')
const Datastore = require('nedb')
    , db = new Datastore({ filename: 'clips.db', autoload: true });
module.exports = {
    parseFolder(folder) {
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
            });
        });
    },
    convertPending() {
        db.find({ state: 'gif' }, (err, clips) => {
            clips.forEach((clip) => {

                clip.videoPath = clip.originalPath.replace(/\.[^/.]+$/, ".mp4")

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
    addMetadata(data) {
        data.state = "ready"
        db.findOne({ _id: data._id }, {$set_: data})
    }
}

