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

        $('video')[0].src = "clips/" + clip._id + ".mp4"

        if (clip.action.match(/Insert|Pullout/))
            tRepro = setTimeout(() => { repro(clips) }, clip.duration * 2 * 1000)
        else
            tRepro = setTimeout(() => { repro(clips) }, 3000)//randomInt(10, 20) * 1000)
    }
    var lastClip = -1
    var stageClips = []
    function fucking(stage) {

        if (stage == 1 && !stageClips.length)
            stageClips = clips.filter((c) => { return (!c.hard && !c.prostate && c.deep != "ReallyDeep" && !c.deep != "Deep") })
        index = randomInt(0, stageClips.length - 1)
        while (index == lastClip)
            index = randomInt(0, stageClips.length)
        lastClip = index
        $('video')[0].src = "clips/" + stageClips[index]._id + ".mp4"


        tRepro = setTimeout(function () { execute(stage) }, randomInt(10, 20) * 1000)
    }
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
})