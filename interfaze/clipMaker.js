var Beep = new Audio('playerBeep.mp3'),
    video,
    customStrokes = []
$(document).ready(function () {
    video = $('video')[0]
    initForm()
    resetForm()
});



function resetForm() {
    showAll()
    $('input[name=action]').prop('checked', false)


    $("option:selected").prop("selected", false)

    $('#hard').prop('checked', false)
    $('#prostate').prop('checked', false)

    $('#prepare').val('')
    $('#description').val('')
    customStrokes = [];
}


function showAll() {
    $('#panelStrokes').show()
    $('#panelFucking').show()
}


function loadForm(clip) {
    $('#_id').val(clip._id)
    video.src = "clips/" + clip._id + '.mp4';

    if (!clip.action && !clip.position && !clip.deep && !clip.strokes) //defaults
    {
        $('input[name=action][value=Fucking]').prop('checked', true)
        $('#deep option[value=Medium]').prop("selected", true)
        $('#strokes option[value=1]').prop("selected", true)
        return
    }

    $('input[type=radio][name=action][value=' + clip.action + ']').prop("checked", true)
    $('#position option[value=' + clip.position + ']').prop("selected", true)
    $('#deep option[value=' + clip.deep + ']').prop("selected", true)
    $('#strokes option[value=' + clip.strokes + ']').prop("selected", true)
    $('#hard').prop('checked', clip.hard == "true")
    $('#prostate').prop('checked', clip.prostate == "true")
    customStrokes = clip.customStrokes || [];
    $('#description').val(clip.description)
    $('#prepare').val(clip.prepare)
    

} 
function serializeForm() {
    var clip = {
        _id: $('#_id').val(),
        state: "ready",

        action: $('input[type=radio][name=action]:checked').val(),
        position: $('#position').val()[0],
        deep: $('#deep').val()[0],
        strokes: customStrokes.length || $('#strokes').val()[0],
        customStrokes: customStrokes,
        hard: $('#hard').prop('checked'),
        prostate: $('#prostate').prop('checked'),

        prepare: $('#prepare').val(),
        description: $('#description').val(),
        duration: video.duration
    }
    return clip
}



function initForm() {
    $('[name=action]').click(function () {
        var optType = $('[name=action]:checked').val();
        var sw = {
            Fucking: function () {
                showAll()
                $('input[name=action][value=Fucking]').prop('checked', true)
            },
            Insert: function () {
                showAll()
                $('input[name=action][value=Insert]').prop('checked', true)
                $('#panelStrokes').hide()
            },
            Pullout: function () {
                showAll()
                $('input[name=action][value=Pullout]').prop('checked', true)
                $('#panelStrokes').hide()
                //$('#panelFucking').hide()
            },
            Cum: function () {
                showAll()
                $('#panelFucking').hide()
            }
        };
        sw[optType]();


    })
    $('#folder').on('change', function () {
        console.log(this.value)
    })
    var tRepclip = 0,
        tBeep = 0,
        tBeep2 = 0,
        lowRatio = 1,
        flashDuration = 50,
        videoDurartion = 0;
    function lowdownVideo() {
        lowRatio = 0.3;
        videoDurartion = (video.duration * (1 / lowRatio) * 1000 + flashDuration)
        if (!tRepclip) {
            video.currentTime = 0;
            video.playbackRate = lowRatio;
            tRepclip = setInterval(function () {
                $('video').hide()
                video.pause()
                setTimeout(function () {
                    $('video').show()
                    video.play()
                }, flashDuration);
            }, (video.duration * (1 / lowRatio) * 1000) + flashDuration);
        }
    }
    function resetVideo(params) {
        clearInterval(tRepclip);
        clearInterval(tBeep);
        clearInterval(tBeep2);
        tRepclip = 0;
        videoDurartion = video.duration * 1000;
        lowRatio = 1;
        video.currentTime = 0;
        video.playbackRate = 1;
        video.play();
    }
    $('#strokes').hover(
        function () {

            if (!tRepclip) {
                lowdownVideo();
                playBeeps();
            }


        },
        function () { //leave
            resetVideo();

        })



    $('#StrokesCustomCancel').click(function () {
        customStrokes = [];
        $(this).hide();
    });
    $('#StrokesCustomCancel').hover(
        function () {
            resetVideo();
            playBeeps();
        },
        function () {
            resetVideo();
        }
    );


    $(video).click(function (e) {
        e.preventDefault();
        if (!customStrokes.length) {
            $('#StrokesCustomCancel').show();
        }


        customStrokes.push(video.currentTime * 1000)
    })

    function playBeeps(params) {
        clearInterval(tBeep)
        tBeep = setInterval(reproBeeps, videoDurartion)
        reproBeeps()
        function reproBeeps() {
            if (!customStrokes.length) {
                let strokeTime = (videoDurartion / $('#strokes').val()[0]);
                clearInterval(tBeep)
                clearInterval(tBeep2)
                tBeep2 = setTimeout(() => {
                    Beep.play()
                    tBeep = setInterval(() => { Beep.play() }, strokeTime)
                }, strokeTime / 2)
            }
            else {
                var index = 0;
                customStrokes.sort(function (a, b) {
                    return a - b;
                });

                reproBeep();
                function reproBeep() {
                    if (index > customStrokes.length) return;
                    clearInterval(tBeep2);
                    tBeep2 = setTimeout(function () {
                        reproBeep();
                        Beep.play();
                    }, (customStrokes[index] * (1 / lowRatio)) - (index >= 1 ? customStrokes[index - 1] * (1 / lowRatio) : 0));
                    index++
                }
            }

        }
    }

    $(video).hover(
        function () {
            lowdownVideo();
            playBeeps();
        },
        function (params) {
            resetVideo();

        }
    );

    $('#next').click(function () {
        save();
        resetForm();
    });
    $('#skip').click(function () {
        resetForm();
        skip();
    });
}
function save() {
    $.ajax({
        url: 'clipMaker/Save',
        type: 'post',
        data: serializeForm(),
        success: function (clip) {
            loadForm(clip)
        }
    })

}
function skip() {
    $.ajax({
        url: 'clipMaker/skip',
        success: function (clip) {
            loadForm(clip)
        }
    })

}
