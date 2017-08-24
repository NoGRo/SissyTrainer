function resetForm() {
    $('#panelStrokes').show()
    $('#panelFucking').show()
    $('input[name=action]').prop('checked', false)
    $('input[name=action][value=Fucking]').prop('checked', true)

    $("option:selected").prop("selected", false)

    $('#hard').prop('checked', false)
    $('#prostate').prop('checked', false)
    $('#deep option[value=Medium]').prop("selected", true)
    $('#strokes option[value=1]').prop("selected", true)
    $('#prepare').val('')
    $('#description').val('')

    panelStrokes

}
function initForm() {
    $('[name=action]').click(function () {
        var optType = $('[name=action]:checked').val();
        var sw = {
            Fucking: function () {
                resetForm();
                $('input[name=action][value=Fucking]').prop('checked', true)
            },
            Insert: function () {
                resetForm();
                $('input[name=action][value=Insert]').prop('checked', true)
                $('#panelStrokes').hide()
            },
            Pullout: function () {
                resetForm();
                $('input[name=action][value=Pullout]').prop('checked', true)
                $('#panelStrokes').hide()
                //$('#panelFucking').hide()
            },
            Cum: function () {
                $('#panelFucking').hide()
            }
        };
        sw[optType]();


    })
    $('#folder').on('change', function () {
        console.log(this.value)
    })

    var video = $('video')[0];
    $('#strokes').hover(
        function () {
            video.playbackRate = 0.5;
            video.currentTime = 0;

        },
        function () {
            video.playbackRate = 1;

        })
    $('#next').click(function () {
        save();
        next();
    });
}
function save() {
    var formData = $('form').serialize()
}
function next() {
    var video = $('video')[0];
    resetForm();
    var nxt = { _id: 135135, videoPath: 'C:/Temp/ParseGif/gif-gatos-15.mp4' }
    $('#_id').val(nxt._id)
    video.src = nxt.videoPath;
}
$(document).ready(function () {
    initForm();
    resetForm();
});