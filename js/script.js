/* ------------------------------------------------------

  定義

-------------------------------------------------------- */
// -----------基本リスト雛形------------
const li =
'<li class="list__item ui-sortable-handle">' +
  '<input class="checkbox" type="checkbox">' +
  '<textarea class="textarea"></textarea>' +
'</li>';

// -----------textareaの自動高さ調整------------
function auto_resize_textarea() {
  $(".textarea").each(function(){
    if ($(this).outerHeight() > this.scrollHeight){
      $(this).height(1)
    }
    while ($(this).outerHeight() < this.scrollHeight){
      $(this).height($(this).height() + 1)
    }
  })
}

// -----------localstorageへの登録-----------
function save() {
  // セーブする3項目を取得して配列に格納
  let data_array = [];
  $(".list__item").each(function(){
    let data = {
      text: $(this).find(".textarea").val(),
      check: $(this).find(".checkbox").prop("checked"),
      order: $(".list__item").index(this)
    }
    data_array.push(data);
  });
  // 並び替え
  data_array.sort(function(a, b) {
    if (a.order > b.order) {
      return 1;
    } else {
      return -1;
    }
  });
  // jsonへ変換
  let json = JSON.stringify(data_array);
  // 保存
  localStorage.setItem("SimpleToDoListLocalstorageID", json);
}

// -----------（確認用）localstorageの取得-----------
function load() {
  if (localStorage.getItem("SimpleToDoListLocalstorageID")) {
    let json = localStorage.getItem("SimpleToDoListLocalstorageID");
    let data_array = JSON.parse(json);
    console.log(data_array);
  }
}

//-----------（確認用）localStorageの削除-----------
function remove_ls() {
  localStorage.removeItem("SimpleToDoListLocalstorageID");
}


/* ------------------------------------------------------

  ページ読み込み時、localstorageの内容を復元

-------------------------------------------------------- */
$(function(){
  if (localStorage.getItem("SimpleToDoListLocalstorageID")) {
    //----------localStorageが存在する場合----------

    // リストのリセット
    $("#js-list").empty();

    // localstorageの取得
    let json = localStorage.getItem("SimpleToDoListLocalstorageID");
    // 配列へ変換
    let data_array = JSON.parse(json);
    console.log(data_array);

    //----------リストに変換----------
    for (let i = 0; i < data_array.length; i++) {
      // テキスト
      let text = data_array[i].text;
      // チェック
      let check = "";
      if( data_array[i].check ) {
        check = " checked";
      }
      // listを出力
      let list =
      '<li class="list__item ui-sortable-handle" id="list_' + i + '">' +
        '<input class="checkbox" type="checkbox"' + check + '>' +
        '<textarea class="textarea"></textarea>' +
      '</li>';
      $("#js-list").append(list);
      // テキストエリアにvalueを付与
      let list_id = '#list_' + i;
      $(list_id).find(".textarea").val(text);
    }

    //----------1つもリストがなかったら1個生成----------
    if( !$("#js-list").find("li").length ) {
      $("#js-list").prepend(li);
    }

  } else {
    //----------localStorageが存在しない場合----------
    $("#js-list").prepend(li);
  }

  //----------textarea高さの自動調整----------
  auto_resize_textarea();
});


/* ---------------------------

  内容の変更後に保存

----------------------------- */
// テキスト入力後
$("body").on("change paste cut",".textarea",function(){
  save();
  load();
})
// テキスト入力後にテキストエリアの高さ調整
$("body").on("change keyup keydown paste cut", ".textarea", function(){
  auto_resize_textarea();
});
// チェック後
$("body").on("change",".checkbox",function(){
  save();
  load();
})
// ソート後 / ゴミ箱処理後
$("body").on("sortstop", "#js-list", function(){
  save();
  load();
});


/* ------------------------------------------------------

  plusボタン

-------------------------------------------------------- */
$("#js-plus").on("click", function(){
  $("#js-list").append(li);
  save();
  load();
})


/* ------------------------------------------------------

  focus時のスタイル変更

-------------------------------------------------------- */
$("body").on("focus",".textarea",function() {
  $(this).parent(".list__item").addClass("is_focus");
});
$("body").on("blur",".textarea",function() {
  $(this).parent(".list__item").removeClass("is_focus");
});


/* ------------------------------------------------------

  jQuery UI ソート機能実行

-------------------------------------------------------- */
$(function() {
  $("#js-list").sortable();
});


/* ------------------------------------------------------

  ゴミ箱機能

-------------------------------------------------------- */
$(function() {
  $("#js-garbage").droppable({
    accept: "li",
    drop: function( event, ui ) {
      let delete_item = ui.draggable[0];
      delete_item.remove();
    },
    tolerance: "touch"
  });
});
