$(function() {

  var buildMessageHTML = function(message) {
    message.content ? tempContent = message.content : tempContent = ""
    message.image.url ? tempImage = message.image.url : tempImage = ""     
      var html = `
      <div class="content" data-message-id= ${message.id} >
        <div class="up-content">
          <div class="up-content__user-name">
            ${ message.user_name }
          </div>
          <div class="up-content__date">
            ${ message.created_at }
          </div>
        </div>
        <div class="low-content">
          <p class="low-content__message">
            ${ tempContent }
          </p>
          <img src="${ tempImage }" class="low-content__image" >
        </div>
      </div>`
    return html;
  };


  var reloadMessages = function() {
    var last_message_id = $('.content:last').data('messageId');
    var urlStr = location.pathname;
    newUrlStr = urlStr.replace(/messages/, 'api/messages');

    $.ajax({
      url:  newUrlStr ,
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })

    .done(function(messages){
      if (messages.length != 0){
        var insertHTML = '';
        messages.forEach(function(message){
          insertHTML +=  buildMessageHTML(message);
          $('.contents').append(insertHTML);

          $('.contents').animate({
          scrollTop: $('.contents').prop('scrollHeight')
          }, 500);
        });

      };
    })
    .fail(function() {
      alert('自動更新に失敗しました');
    });

  };

  $('#new_message').on('submit', function(e) {
    e.preventDefault();
    var form = $('#new_message');
    var $this = $(this)
    var fd = new FormData($this.get(0));

    $.ajax({
      url: form.attr('action'),
      type: form.attr('method'),
      data: fd,
      dataType: 'json',
      contentType : false,
      processData : false
    })

    .done(function(data) {
      var messageHTML = buildMessageHTML(data);
      $('.contents').append(messageHTML);
      $this.get(0).reset();

      $('.contents').animate({
          scrollTop: $('.contents').prop('scrollHeight')
      }, 500);
    })

    .fail(function() {
      alert('非同期通信に失敗しました');
    })

    .always(function() {
    $(".footer__submit").prop("disabled", false);
    });

  })
  setInterval(reloadMessages, 5000);

});
