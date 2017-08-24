const fs = require("fs")
const path = require("path")
const hash = require("hash")
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ clips: {} })

module.exports = {
    parseFolder(folder) {
        fs.readdir(folder, function (err, files) {
            if (err) {
                throw err;
            }
            files.map((file) => {
                return path.join(p, file);
            }).filter((file) => {
                return fs.statSync(file).isFile()
                       && path.extname(file) == '.gif' ;
            }).forEach((file) => {
                db.get('clips')
                    .push({ 
                        Id: Date.now(),
                        originalPath: file,
                        state: 'gif'
                    })
            });
        });
    }

}