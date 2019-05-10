$(document).on('turbolinks:load', function() {

  var search_list = $("#user-search-result");

  function buildUserHTML(user){
  	var html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name"> ${user.name} </p>
                  <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id = ${user.id} data-user-name =${user.name} >追加</div>
                </div>`
    search_list.append(html);
  }

  var member_list = $("#chat-group-users");

  function buildGroupUserHTML(userId,userName){
    var html = `<div id='chat-group-users'>
                  <div class='chat-group-user clearfix js-chat-member' id='${userId}'>
                    <input name='group[user_ids][]' type='hidden' value='${userId}'>
                      <p class='chat-group-user__name'>${userName}</p>
                      <a class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</a>
                  </div>
                </div>`
    member_list.append(html);
  }

  function toErrMsgHTML(msg) {
    var html = `
            <div class="chat-group-user clearfix">
              <p class="chat-group-user__name"> ${ msg } </p>
            </div>`
    saveearch_list.append(html);
  }

  $("#user-search-field").on("keyup", function() {
    var input = $("#user-search-field").val();
      if (input.length != 0) {
        $.ajax({
          type: 'GET',
          url: '/users',
          data: { keyword: input },
          dataType: 'json'
        })

        .done(function(users){        
          $("#user-search-result").empty();
          if (users.length !== 0) {
            users.forEach(function(user){
            buildUserHTML(user);
            });
          }
          else {
            toErrMsgHTML("一致するユーザーが見つかりません");
          }
        })

        .fail(function() {
          alert('ユーザー検索に失敗しました');
        })
        }
      else{
        $('.chat-group-user__btn').parent().remove();
      }
  });

  $(document).on("click",".user-search-add", function(){
    var userId = $(this).data('user-id');
    var userName = $(this).data('user-name');
    buildGroupUserHTML(userId,userName);
    $(this).parent().remove();
    $('#user-search-field').val('');
  });

  $(document).on("click",".user-search-remove", function(){
    $(this).parent().remove();
  });

});
