
var ffmpeg = require('fluent-ffmpeg')
var clips = require("./lib/clips")
/*
clips.parseAll({ state: "ready", action: 'Fucking' }, (clip) => {
  if (+clip.strokes) {
    var speed = clip.duration / clip.strokes
    clip.bpm = parseInt(60 / speed)
    if (speed > 0.7)
      clip.speed = 'Slow'
    else if (speed > 0.4)
      clip.speed = 'Lassy'
    else
      clip.speed = 'Fast'
  }
  else
    clip.speed = 'Fast'

  clip.save()
})
*/
clips.parseFolder("e:/porno/clips")
clips.convertPending()


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