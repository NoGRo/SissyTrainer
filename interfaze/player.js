$(document).ready(function () {
    var clips;
    $.ajax({
        url: "player/getClips",
        data: { position: 'onFour' },
        success: function (rclips) {
            clips = rclips;
            repro();
        }
    });

    index = 0;
    var preparePosition = {
        onBack: ["acostate de espalda, abri las piernas", "acostado de espalda"],
        onSide: ["acostate de costado", "ponete de costado en la cama"],
        onSideLiftLeg: ["ponete de costa, pierna arriba", "ponete de costa, levanta la pierna"],
        onFour: ["ponete en cuatro", "ponete en cuatro sobre la cama, levanta el culo"],
        onFourLiftLeg: ["ponete en cuatro y levanta una pierna", "en cuatro con una pierna arriba"],
        onFourStand: ["en cuatro de parado!!", "ponete en 4 con los pies el piso"],
        onFourDown: ["acostate boca abajo", "boca abajo"],
        onFourSpread: ["en cuatro, abri las piernas lo mas que puedas", "en cuatro abri y baja el culo"],
        backStanding: ["pega el dildo al piso, manos hacia atrás, y sentate arriba"],
        sittingOnTop: ["pega el dildo al piso, de rodillas y sentate arriba", "pega el dildo al piso, y sentate arriba"]
    }

    var tRepro = 0
    var tBeep = 0
    var Beep = new Audio('playerBeep.mp3')

    function pause() {
        clearInterval(tBeep)
        clearInterval(tRepro)
        $('video')[0].pause()
        //$('#message').hide();
    }
    function play() {
        repro()
    }
    function playNext() {
        pause()
        clips.shift()
        repro()
    }
    var statepause = false;
    $('video').on('click', function () {
        if (statepause)
            play()
        else
            pause()

        statepause = !statepause

    }).on('contextmenu', function (e) {
        e.preventDefault()
        clips[0].state = "check"
        $.ajax({
            url: 'clipMaker/Save',
            type: 'post',
            data: clips[0],
        });
    }).on('mousewheel', function (e) {
        if (e.originalEvent.wheelDelta / 120 > 0) {
            //upp
        }
        else {
            playNext()
        }
    })
    function repro() {
        if (!clips.length) {
            stop();
            $('video')[0].pause()   
            return
        }
        clip = clips[0];

        var nextClip = clips[1]

        $('video')[0].src = "clips/" + clip._id + ".mp4"
        var duration = randomInt(12, 25) * 1000
        if (clip.action.match(/Insert|Pullout/))
            duration = clip.duration > 10 ? clip.duration * 1000 : 10000

        clearInterval(tBeep)
        if (clip.action == "Fucking") {
            let strokeTime = (clip.duration / clip.strokes) * 1000
            setTimeout(() => {
                Beep.play()
                tBeep = setInterval(() => { Beep.play() }, strokeTime)
            }, strokeTime / 2)
        }

        tRepro = setTimeout(() => {
            playNext()
        }, duration)//randomInt(10, 20) * 1000)


        if (clip.description)
            message(clip.description)
        if (clip.action.match(/Insert|Pullout/)) {
            message(clip.action)
            if (clip.action == 'Insert') {
                var msjs = preparePosition[nextClip.position]
                message(msjs[randomInt(0, msjs.length)])
            }
        }
        else
            message((clip.speed ? clip.speed + ' - ' : "")
                + clip.deep
                + (clip.prostate ? " - Prostate" : ""))

        showMessage();

        if (!nextClip)
            return

        if (nextClip.prepare)
            message(nextClip.prepare)
        else if (nextClip.position != clip.position) {
            var msjs = preparePosition[nextClip.position]
            message(msjs[randomInt(0, msjs.length)])
        }

        if (nextClip.prostate && !clip.prostate)
            message("Prepare to hit your prostate")
        if (nextClip.hard && !clip.hard)
            message((["let's ready for go crazy", "go hard soon"])[randomInt(0, 1)])
        if (nextClip.deep == "Deep" && clip.deep != "Deep" && clip.deep != "ReallyDeep")
            message((["next Deep", "Deep soon"])[randomInt(0, 1)])
        if (nextClip.deep == "ReallyDeep" && clip.deep == "Deep")
            message((["Even MORE Deep", "Deeper Soon"])[randomInt(0, 1)])
        if (nextClip.deep == "ReallyDeep" && clip.deep != "Deep")
            message((["prepare to go Relly Deep", "Relly Deep soon"])[randomInt(0, 1)])

        showMessage(messageText, duration - messageDuration);
    }




    var messageText = ''
    function message(text) {
        if (!text)
            return messageText

        messageText = messageText
            ? messageText += ", " + text
            : messageText += text;
        return messageText;
    }
    var messageDuration = 8000
    function showMessage(text, inTime) {
        if (!text)
            text = messageText
        if (!text) return;

        messageText = ""
        inTime = inTime || 0;
        setTimeout(function () {
            $('#message').show();
            $('#message').text(text)
        }, inTime)
        setTimeout(function () {
            $('#message').hide();
        }, inTime + messageDuration)
    }
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
})