
var ffmpeg = require('fluent-ffmpeg')
var clips = require("./lib/clips")

clips.parseFolder("C:/Temp/ParseGif")
//clips.convertPending();

/*
var proc = new ffmpeg({ source: 'c:/temp/perrito.gif' })
  .inputFormat('gif')
  .outputOptions([
          '-movflags faststart',
          '-pix_fmt yuv420p',
          '-vf scale=trunc(iw/2)*2:trunc(ih/2)*2'
  ])  
  .toFormat('mp4')    
  .saveToFile('c:/temp/perrito.mp4');*/