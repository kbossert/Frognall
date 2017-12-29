
function ShowModal(title, message) {

    var modal = $('#modal_error');
    modal.find('.modal-title').text(title);
    modal.find('.modal-body').html(message);

    $('#modal_error').modal();

}
