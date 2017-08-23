function resetForm() {
    $('#panelStrokes').show()
    $('#panelFucking').show()
    $('input[name=action]').prop('checked', false)
    $('input[name=action][value=Fucking]').prop('checked', true)

    $("option:selected").prop("selected", false)

    $('#hard').prop('checked', false)
    $('#prostate').prop('checked', false)
    $('#deep option[value=2]').prop("selected", true)
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


    $('#next').click(function () {
        save();
        next();
    });
}
function save() {
    var formData = $('form').serialize()
}
function next() {
    resetForm();
}
$(document).ready(function () {
    initForm();
    resetForm();


});