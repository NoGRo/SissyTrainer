$(document).ready(function () {
    var clips=[]
    $.ajax({
        url: "player/getClips",
        data:{position: 'onFour'},
        success: function (cls) {
            clips = cls;
            insert(1);
        }
    });


   
    function insert(stage) 
    {

        var insertClips =[]
        if(stage == 1)
            insertClips = clips.filter((c)=>{ return (c.action == "Insert" && c.deep =="Tip" && c.deep =="Medium" ) })
        index = randomInt(0, insertClips.length -1)
        $('video')[0].src = "clips/" + insertClips[index]._id + ".mp4"
        setTimeout(function () {fucking(stage)}, randomInt(10, 15)*1000)
    }
    var lastClip =-1
    var stageClips = []
    function fucking(stage)
    {
    
        if(stage == 1 && !stageClips.length)
            stageClips = clips.filter((c)=>{ return (!c.hard && !c.prostate && c.deep !="Really Deep" && !c.deep !="Deep" ) })

        index = randomInt(0, stageClips.length -1)
        while(index == lastClip)
            index = randomInt(0, stageClips.length)
        lastClip =index
        $('video')[0].src = "clips/" + stageClips[index]._id + ".mp4"


        setTimeout(function () {execute(stage)}, randomInt(10, 25)*1000)
    }
    function randomInt(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
})