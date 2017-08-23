function resetForm() {
    $('input[name=action]').prop('checked', false)
    $('input[name=action][value=Fucking]').prop('checked', true)

    $("option:selected").prop("selected", false)

    $('#hard').prop('checked', false)
    $('#prostate').prop('checked', false)
    $('#deep option[value=2]').prop("selected", true)
    $('#strokes option[value=1]').prop("selected", true)
    $('#prepare').val('')
    $('#description').val('')
}
function save() {
    
}
function next() {
    resetForm();
}
$(document).ready(function () {
    resetForm();
    $('#next').click(function () {
        save();
        next();
    });

});