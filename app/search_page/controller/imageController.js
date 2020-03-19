// Function Draw Image
function fn_draw_image_content_list(image_name,category_id,tag_id,page){

    var url = WEB_BASE_URL + "auth/assets?";

    url += "perPage=1&";
    url += "page="+page+"&";

    if(image_name != null){
        url += "q="+image_name+"&";
    }

    if(category_id){
        url += 'filter=[{"key": "categoryId", "operator": "=","value": "'+category_id+'"}';
    }

    if(tag_id != null){
        url += ',{"key": "tagId", "operator": "=","value": "'+tag_id+'"}';
    }

    url += "]&";

    url += "access_token=" + token;

    $.ajax({
        type: "GET",
        url: url,
        success: function (response) {
          fn_make_paging(response.pages);

          var active_view = $("#content_by_thumb_view").hasClass( "active" );
          var html = '';

          $.each (response.data, function (key, row){
              if($("#content_by_thumb_view").hasClass( "active" )){
                  html +=  '<div class="image_thumb" style="float:left; padding-right: 5px; padding-left: 5px; padding-top: 5px;">';
                      html += '<div class="thumbnail" style="margin-bottom: 5px ;background-color: #161616; border: 1px solid black;">';
                          html += fn_draw_tag_color(row["tags"]);
                          html += '<img class='+ row["id"] +' src="'+WEB_BASE_URL+'auth/assets/'+row["id"]+'/thumb?access_token='+token+'" style="height: 150px;width: 170px; margin-top: 3px">';
                          html += '<p style="margin: 2px 0 3px; text-align: center; color: white;">' + row["title"] + '</p>';
                      html += '</div>';
                  html +=  '</div>';
              }else{
                  var date = new Date(row["createdAt"]);
                  var new_date = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
                  
                  html +=  '<div class="image_list_view" class="" style="background-color: #1f1f23;height: 50px; min-width: 700px;">';
                      html +=  '<div id="" class="" style="height: 100%; width: 28px; float: left; padding: 5px">';
                          html += '<p class="image_tag_color" style="margin: 0px 0px 4px; background-color: ' + row["color"] + '; width: 15px; height: 15px; border: 1px solid white; border-radius: 25px;"></p>';
                      html +=  '</div>';
                      html +=  '<div id="" class="" style="height: 100%; width: 47px; float: left; padding: 4px;">';
                          html += '<img class='+ row["id"] +' src="'+WEB_BASE_URL+'auth/assets/'+row["id"]+'/thumb?access_token='+token+'" style="height: 40px;width: 40px;">';
                      html +=  '</div>';
                      html +=  '<div id="" class="" style="height: 100%; width: 200px; float: left;">';
                          html += '<p style="padding: 14px; text-align: left; color: #b0b0b0;">' + row["title"] + '</p>';
                      html +=  '</div>';
                      html +=  '<div id="" class="" style="height: 100%; width: 200px; float: right; padding-left: 10px;">';
                          html += '<p style="padding: 14px; text-align: left; color: #b0b0b0;">' + new_date + '</p>';
                      html +=  '</div>';
                  html += '</div>';
              }
          });

          $('div#tab_image_content div.row').html(html);

          $('.image_list_view:even').css('background-color','rgb(31,31,35)');
          $('.image_list_view:odd').css('background-color','rgb(22,22,22)');


          // add class active content
          $( ".image_thumb div.thumbnail" ).click(function() {
              $(".image_thumb div.thumbnail").removeClass('active');
              $(this).addClass('active');
          });

          $( ".image_list_view" ).click(function() {
              $(".image_list_view").removeClass('active');
              $(this).addClass('active');
          });

          // Start Js check open and close Change Tag Menu
          var $win = $(window);
          var $inside = $(".image_tag_color");
          $win.on("click.Bst", function(e){   
            if ($inside.has(e.target).length == 0 && !$inside.is(e.target)){
                $('#menu_tag_change_tag_color').hide();
                $("#tab_image_content .image_thumb div.thumbnail div p").removeClass('cls_del_tag');
            }else {
                $margin_top = (e.pageY).toString()+'px';
                $("div#menu_tag_change_tag_color").css("top",$margin_top);
                $margin_left = (e.pageX).toString()+'px';
                $("div#menu_tag_change_tag_color").css("left",$margin_left);
                $('#menu_tag_change_tag_color').show();

                $("#tab_image_content .image_thumb div.thumbnail div p").removeClass('cls_del_tag');
                
                if(e.target.tagName == "P"){
                    var className = (e.target.className).replace(" ", '.');
                    $("#tab_image_content .image_thumb div.thumbnail.active div p."+className).addClass('cls_del_tag');
                }
            }
          });
          // End Js check open and close Change Tag Menu

          // Start Js open popup when right Click on image Thumb View
          $('div#search_right_menu div.image_thumb div.thumbnail').on('contextmenu', function (e) {
              $(".image_thumb div.thumbnail").removeClass('active');
              $(this).addClass('active');
              document.getElementById("contextMenu").style.left = e.pageX+"px";
              document.getElementById("contextMenu").style.top = e.pageY+"px";
              $('#menu_tag_change_tag_color').hide();
              $('#contextMenu').show();
          });
          // Start Js open popup when right Click on image List View
          $('.image_list_view').on('contextmenu', function (e) {
              $(".image_list_view").removeClass('active');
              $(this).addClass('active');
              document.getElementById("contextMenu").style.left = e.pageX+"px";
              document.getElementById("contextMenu").style.top = e.pageY+"px";
              $('#menu_tag_change_tag_color').hide();
              $('#contextMenu').show();
          });

          $(document).click(function() {
              $('#contextMenu').hide();
          });

          window.addEventListener('resize', function(event){
              $('#contextMenu').hide();
              $('#menu_tag_change_tag_color').hide();
          });
          // End Js open popup when right Click on image
        }
    });
}

// Function make paging for Search Page
function fn_make_paging(pages){
  console.log(pages);
    var current_page = pages.current;
    var total_page = pages.total;
    var has_prev = pages.hasPrev;
    var has_next = pages.hasNext;

    var next_page = pages.next;
    var prev_page = pages.prev;

    $("#next_image_page").val(next_page);
    $("#prev_image_page").val(prev_page);

    $("#current_image_page").val(current_page);
    $("#total_image_page").val(total_page);

    if(has_prev == false){
        $("#image_paing button.fas.fa-angle-double-left").addClass('cls_disable');
        $("#image_paing button.fas.fa-angle-left").addClass('cls_disable');
    }
    if(has_next == false){
        $("#image_paing button.fas.fa-angle-double-right").addClass('cls_disable');
        $("#image_paing button.fas.fa-angle-right").addClass('cls_disable');
    }
    if(has_prev == true){
        $("#image_paing button.fas.fa-angle-double-left").removeClass('cls_disable');
        $("#image_paing button.fas.fa-angle-left").removeClass('cls_disable');
    }
    if(has_next == true){
        $("#image_paing button.fas.fa-angle-double-right").removeClass('cls_disable');
        $("#image_paing button.fas.fa-angle-right").removeClass('cls_disable');
    }
}

function fn_draw_tag_color(tag_list){
    var width = ((18 + (18 * tag_list.length)).toString())+'px';

    var html = '';
    html += '<div style="height: 18px; background-color: #7c7d7f; border-radius: 25px; margin-top: -2px; width:'+ width + ' ">';
        html += '<span class="image_tag_color" style="float: left; margin: 0px 0px 0px; width: 15px; height: 15px; border: 1px solid white; border-radius: 25px; margin-top: 1px; margin-left: 2px;"><i class="fa fa-plus" style="font-size: 10px; margin-left: 2px; vertical-align: super; padding-top: 1px;"></i></span>';
        if(tag_list.length > 0){
          $.each (tag_list, function (key, row){
              // html += '<p class="image_tag_color del_tag_id'+row["id"]+'" onclick="fn_del_tag('+row["id"]+')" style="float: left; margin: 0px 0px 0px; background-color: ' + row["color"] + '; width: 15px; height: 15px; border: 1px solid white; border-radius: 25px; margin-top: 1px; margin-left: 2px;"></p>';
              html += '<p class="image_tag_color del_tag_id'+row["id"]+'" style="float: left; margin: 0px 0px 0px; background-color: ' + row["color"] + '; width: 15px; height: 15px; border: 1px solid white; border-radius: 25px; margin-top: 1px; margin-left: 2px;"></p>';
          });
        }
    html += '</div>';

    return html;
}

// Start JS Cancle selected Image
function fn_cancel_selected_image(){
    $(".image_thumb div.thumbnail").removeClass('active');
    $(".image_list_view").removeClass('active');
}
// End JS Cancle selected Image

// Function Add tag color for Image
function fn_add_tag_asset(tag_id){
    var active_image_id = $("#tab_image_content .image_thumb div.thumbnail.active img").attr('class');
    $.ajax({
        type: "PUT",
        url: WEB_BASE_URL + "auth/assets/"+active_image_id+"/tag?access_token=" + token,
        data : {
            tagId : tag_id
        },
        dataType : 'json',
        success: function (response) {
            if(response.result == "ok"){
                var image_search_name = ($("#search_text").val()).trim();
                var category_id = $("#folder_category ul li div.cls_active_item span").attr('id');

                var tag_active = $("#search_left_tag_color_content div.active_tag div").attr('class');
                var tag_id = null;
                if(tag_active){
                    tag_id = tag_active.replace("tag_id_", '');
                }
                var page = $("#current_image_page").val();
                fn_draw_image_content_list(image_search_name,category_id,tag_id, page);
            }else{
                console.log('Add Tag Color for Image fail');
            }
        }
    });
}

// Function clear tag color for Image
function fn_clear_tag_color_for_image(){
    var remove_tag_id = $("#tab_image_content .image_thumb div.thumbnail.active div p.cls_del_tag").attr('class');
    var active_image_id = $("#tab_image_content .image_thumb div.thumbnail.active img").attr('class');

    if(remove_tag_id == null){
        return;
    }

    var tag_remove_id = (remove_tag_id.split(/\s/).join('')).replace("image_tag_colordel_tag_id", '').replace("cls_del_tag", '');

    $.ajax({
        type: "DELETE",
        url: WEB_BASE_URL + "auth/assets/"+active_image_id+"/tag?access_token=" + token,
        data : {
            tagId : tag_remove_id
        },
        dataType : 'json',
        success: function (response) {
            if(response.result == "ok"){
                var image_search_name = ($("#search_text").val()).trim();
                var category_id = $("#folder_category ul li div.cls_active_item span").attr('id');
                
                var tag_active = $("#search_left_tag_color_content div.active_tag div").attr('class');
                var tag_id = null;
                if(tag_active){
                    tag_id = tag_active.replace("tag_id_", '');
                }
                var page = $("#current_image_page").val();
                fn_draw_image_content_list(image_search_name,category_id,tag_id, page);
            }else{
                console.log('DELETE Tag Color for Image fail');
            }
        }
    });
}

function fn_search_image_by_text(){
    var image_search_name = ($("#search_text").val()).trim();
    var category_id = $("#folder_category ul li div.cls_active_item span").attr('id');
    
    var tag_active = $("#search_left_tag_color_content div.active_tag div").attr('class');
    var tag_id = null;
    if(tag_active){
        tag_id = tag_active.replace("tag_id_", '');
    }
    var page = 1;
    fn_draw_image_content_list(image_search_name,category_id,tag_id, page);
}


$(".image_paging button.fas.fa-angle-left" ).click(function() {
    var image_search_name = ($("#search_text").val()).trim();
    var category_id = $("#folder_category ul li div.cls_active_item span").attr('id');
    var tag_active = $("#search_left_tag_color_content div.active_tag div").attr('class');
    var tag_id = null;
    if(tag_active){
        tag_id = tag_active.replace("tag_id_", '');
    }
    var page = $("#prev_image_page").val();

    fn_draw_image_content_list(image_search_name,category_id,tag_id, page);
})

$( ".image_paging button.fas.fa-angle-double-left" ).click(function() {
    var image_search_name = ($("#search_text").val()).trim();
    var category_id = $("#folder_category ul li div.cls_active_item span").attr('id');
    var tag_active = $("#search_left_tag_color_content div.active_tag div").attr('class');
    var tag_id = null;
    if(tag_active){
        tag_id = tag_active.replace("tag_id_", '');
    }
    var page = "1";

    fn_draw_image_content_list(image_search_name,category_id,tag_id, page);
})

$(".image_paging button.fas.fa-angle-right" ).click(function() {
    
    var image_search_name = ($("#search_text").val()).trim();
    var category_id = $("#folder_category ul li div.cls_active_item span").attr('id');
    var tag_active = $("#search_left_tag_color_content div.active_tag div").attr('class');
    var tag_id = null;
    if(tag_active){
        tag_id = tag_active.replace("tag_id_", '');
    }
    var page = $("#next_image_page").val();

    fn_draw_image_content_list(image_search_name,category_id,tag_id, page);
})

$( ".image_paging button.fas.fa-angle-double-right" ).click(function() {

    var image_search_name = ($("#search_text").val()).trim();
    var category_id = $("#folder_category ul li div.cls_active_item span").attr('id');
    var tag_active = $("#search_left_tag_color_content div.active_tag div").attr('class');
    var tag_id = null;
    if(tag_active){
        tag_id = tag_active.replace("tag_id_", '');
    }
    var page = $("#total_image_page").val();

    fn_draw_image_content_list(image_search_name,category_id,tag_id, page);
})