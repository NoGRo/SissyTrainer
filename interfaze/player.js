$(document).ready(function () {

    $.ajax({
        url: "player/getClips",
        data: { position: 'onFour' },
        success: function (clips) {
            repro(clips);
        }
    });

    var tRepro = 0;
    index = 0;
    function repro(clips) {
        if (!clips.length) {
            stop();
            return
        }
        clip = clips[0];
        clips.shift();
        var nextClip = clips[0]

        $('video')[0].src = "clips/" + clip._id + ".mp4"
        var duration = 3000 //randomInt(10, 20) * 1000
        if (clip.action.match(/Insert|Pullout/))
            tRepro = setTimeout(() => { repro(clips) }, clip.duration * 2 * 1000)
        else
            tRepro = setTimeout(() => { repro(clips) }, duration)//randomInt(10, 20) * 1000)
        if (clip.message)
            showText(clip.message)

        if (!nextClip)
            return

        var message = ''
        if (nextClip.prepare)
            message += nextClip.prepare
        if (nextClip.position != clip.position)
            message += positions[nextClip.position].prepare
        if (nextClip.prostate && !clip.prostate)
            message += "Prepare to hit your prostate"
        if (nextClip.hard && !clip.hard)
            message += (["let's ready for go crazy", "go hard soon"])[randomInt(0, 1)]
    }

    var lastClip = -1
    var stageClips = []
    function showText(message, inTime) {
        inTime = inTime || 0;
        setTimeout(function () {
            //show
        }, inTime)
        setTimeout(function () {
            //hide
        }, inTime + (8 * 1000))
    }
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
})