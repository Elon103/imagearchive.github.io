// Change size Page 
setTimeout(function () {
  	document.getElementById('search_left_menu').style.height = ($(window).height() - (94)).toString()+'px';
  	var search_left_menu_height = $(window).height() - (94);
    //Category height 70%
  	var search_left_menu_top_height = search_left_menu_height * 7/10;
  	document.getElementById('folder_category').style.height= (search_left_menu_top_height - 66).toString()+'px';
  	//Tag height 30%
    var search_left_menu_bottom_height = search_left_menu_height * 3/10;
	  document.getElementById('search_left_tag_color_content').style.height= (search_left_menu_bottom_height - 34).toString()+'px';

	  document.getElementById('search_right_menu').style.height = ($(window).height() - (158)).toString()+'px';

    // document.getElementById('detail_content_window').style.height = ($(window).height() - (188)).toString()+'px';

    document.getElementById('main_content').style.height = ($(window).height() - (160)).toString()+'px';
}, 1);
window.addEventListener('resize', function(event){
	document.getElementById('search_left_menu').style.height = ($(window).height() - (94)).toString()+'px';
  	var search_left_menu_height = $(window).height() - (94);
    //Category height 70%
  	var search_left_menu_top_height = search_left_menu_height * 7/10;
  	document.getElementById('folder_category').style.height= (search_left_menu_top_height - 66).toString()+'px';
  	//Tag height 30%
    var search_left_menu_bottom_height = search_left_menu_height * 3/10;
	  document.getElementById('search_left_tag_color_content').style.height= (search_left_menu_bottom_height - 34).toString()+'px';

    document.getElementById('search_right_menu').style.height = ($(window).height() - (158)).toString()+'px';

 //    document.getElementById('detail_content_window').style.height = ($(window).height() - (188)).toString()+'px';

    document.getElementById('main_content').style.height = ($(window).height() - (160)).toString()+'px';
})

// Function Drag Drop Image
function upload_file(e) {
    e.preventDefault();

    var category_id = $("#folder_category ul li div.cls_active_item span").attr('id');

    var data = new FormData();

    var arr_img = e.dataTransfer.files;
    var newFileList = Array.from(arr_img);

    var ins = newFileList.length;
    for (var x = 0; x < ins; x++) {
        data.append("file", newFileList[0]);
    }

    $.ajax({
        type: 'POST',
        url: WEB_BASE_URL + "auth/assets?categoryId="+category_id+"&access_token=" + token,
        cache: false,
        contentType: false,
        processData: false,
        data : data,
        success: function(result, response){
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
    });
}