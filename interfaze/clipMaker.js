var Beep = new Audio('playerBeep.mp3'),
video




function resetForm() {
    showAll()
    $('input[name=action]').prop('checked', false)


    $("option:selected").prop("selected", false)

    $('#hard').prop('checked', false)
    $('#prostate').prop('checked', false)

    $('#prepare').val('')
    $('#description').val('')
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
    $('#hard').prop('checked', !!clip.hard)
    $('#prostate').prop('checked', !!clip.prostate)

    $('#prepare').val(clip.prepare)
    $('#description').val(clip.description)

}
function serializeForm() {
    var clip = {
        _id: $('#_id').val(),
        state: "ready",

        action: $('input[type=radio][name=action]:checked').val(),
        position: $('#position').val()[0],
        deep: $('#deep').val()[0],
        strokes: $('#strokes').val()[0],

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
        tBeep2 = 0
    $('#strokes').hover(
        function () {
            video.playbackRate = 0.3;
            video.currentTime = 0;
            
            if (!tRepclip) {
                let strokeTime = ((video.duration * (1/0.3) * 1000 + 50 ) / $('#strokes').val()[0]) 
                
                clearInterval(tBeep)
                clearInterval(tBeep2)
                tBeep2 = setTimeout(() => {
                    Beep.play()
                    tBeep = setInterval(() => { Beep.play() }, strokeTime)
                }, strokeTime / 2)

                tRepclip = setInterval(function () {
                    $('video').hide()
                    video.pause()
                    setTimeout(function () {
                        $('video').show()
                        video.play()
                    }, 50);



                }, (video.duration * (1/0.3) * 1000) + 50);
            }
            
            


        },
        function () {
            clearInterval(tRepclip)
            clearInterval(tBeep)
            clearInterval(tBeep2)
            tRepclip = 0
            video.play()
            video.playbackRate = 1

        })
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
$(document).ready(function () {
    video = $('video')[0]
    initForm()
    resetForm()
    save()
});