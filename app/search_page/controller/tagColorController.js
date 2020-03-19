// Load Tag List Data After render
fn_draw_active_tag_list();
function fn_draw_active_tag_list(){
    $.ajax({
        type: "GET",
        url: WEB_BASE_URL + "auth/tags?access_token=" + token,
        success: function (response) {
            if(response.data.length > 0){
                var html = '';
                $.each (response.data, function (key, row){
                    if(row["activated"] == 1 && row["deleted"] == 0){
                        html += '<div style="padding-bottom: 1px; cursor: pointer;"><div class="tag_id_' + row["id"] + '" style="float: left; background-color: ' + row["color"] + ';  width: 17px; height: 17px; border-radius: 25px; margin-right: 10px; margin-top: 2px; margin-left: 20px;"></div><span>' + row["title"] + '</span>';
                        html += '</div>';
                    }
                });
                $('div.tag_list').html(html);

                var html_change_tag_color = '';
                $.each (response.data, function (key, row){
                    if(row["activated"] == 1 && row["deleted"] == 0){
                        html_change_tag_color += '<div onclick="fn_add_tag_asset(' + row["id"] + ');" style="padding-bottom: 1px; cursor: pointer;"><div class="tag_id_' + row["id"] + '" style="float: left; background-color: ' + row["color"] + ';  width: 15px; height: 15px; border-radius: 25px; margin-right: 10px; margin-top: 2px; margin-left: 6px;"></div><span>' + row["title"] + '</span>';
                        html_change_tag_color += '</div>';
                    }
                });
                $('div.cls_change_tag_color').html(html_change_tag_color);

                // Start JS add Active for tag color
                $(".tag_list div").click(function() {
                    if($(this).hasClass("active_tag")){
                        $(this).removeClass('active_tag');

                        var image_search_name = ($("#search_text").val()).trim();
                        var category_id = $("#folder_category ul li div.cls_active_item span").attr('id');
                        
                        var page = 1;
                        fn_draw_image_content_list(image_search_name,category_id,null, page);
                    }else{
                        $('.tag_list div').removeClass('active_tag');
                        $(this).addClass('active_tag');

                        var image_search_name = ($("#search_text").val()).trim();
                        var category_id = $("#folder_category ul li div.cls_active_item span").attr('id');

                        var tag_active = $("#search_left_tag_color_content div.active_tag div").attr('class');
                        var tag_id = tag_active.replace("tag_id_", '');

                        var page = 1;
                        fn_draw_image_content_list(image_search_name,category_id,tag_id, page);
                    }
                });
                // End JS add Active for tag color

            }else{
                console.log("No data for tag list");
            }
        }
    });
}

// Open Modal Tag Management
function fn_mng_tag_color(){
	$("#tag_mng_model").modal("show");
    fn_draw_tag_list();
}
// Close Modal Tag Management
function close_tag_mng(){
   $("#tag_mng_model").modal("hide");
}
// Function Draw tag list in Model Tag Management
function fn_draw_tag_list(){
	$.ajax({
        type: "GET",
        url: WEB_BASE_URL + "auth/tags?access_token=" + token,
        success: function (response) {
        	if(response.data.length > 0){
                var html = '';
                var no = 0;
                $.each (response.data, function (key, row){
                	if(row["deleted"] == 0){
	                 	html += '<div ondblclick="editTagColorModel()" style=" border: 1px solid #1F1F23; padding-top: 2px; padding-bottom: 2px; cursor: pointer; color: white;">'
    	                 	html += '<span style="float: left; width: 35px; text-align: right;">' +  ( no + 1) + '</span>';
    	                 	html += '<span class="title" value="' + row["title"] + '" style="float: left; padding-left: 30px; width: 313px;">' + row["title"] + '</span>';
    	                 	html += '<div class="tag_id_' + row["id"] + '" value="' + row["color"] + '" style="float: left; background-color: ' + row["color"] + ';  width: 12px; height: 12px; border-radius: 25px; margin-right: 10px; margin-top: 5px; margin-left: 20px;"></div>'
    	                 	html += '<input style="margin-left: 45px;" onclick="fn_change_active_tag('+ row["id"] +');" type="checkbox" id="tag_checkbox_' + row["id"] + '" class="tag_id_' + row["id"] + '" '+ fn_check_actived(row["activated"]) +'>';
	                    html += '</div>';
                        no ++;
	                }
                });
                $('div.tag_color_mng').html(html);

               	// Start JS add Active for tag color
				$(".tag_color_mng div").click(function() {
			        $('.tag_color_mng div').removeClass('active_tag');
			        $(this).addClass('active_tag');
				});
				// End JS add Active for tag color

            }else{
                console.log("No data for tag list");
            }
	    }
    });
}
// Function update Active Tag Color
function fn_change_active_tag(id){
	var remember = document.getElementById("tag_checkbox_"+id);
	var type = 0;
	if (remember.checked) {
		type = 1;
	}
	$.ajax({
        type: "PUT",
        url: WEB_BASE_URL + "auth/tags/"+id+"?access_token=" + token,
        data : {
		    activated : type
		},
        dataType : 'json',
        success: function (response) {
        	if(response.result == "ok"){
        		fn_draw_active_tag_list();
        		fn_draw_tag_list();
        	}else{
        		console.log('Update activated fail');
        	}
	    }
    });
}
// Function Check Actived Tag Color
function fn_check_actived(activated){
	if(activated == 1){
		return "checked";
	}else{
		return "";
	}
}
// Function Open Add Tag Model
function openAddTagModel(){
	$("#addEditTagColorModel").modal("show");

	$("#tag_title_input").val("");
	$("#tag_color_input").val("#FFFFFF");
	$("#tag_color_input").css( "background-color", "#FFFFFF" );

	$("#addNewTagColor").css( "display", "block" );
	$("#editTagColor").css( "display", "none" );

	$("h5.tag_title_model").html('Add tags');
}
// Function Add new tag color
function fn_addNewTagColor(){
    var title = ($("#tag_title_input").val()).trim();
    var color = $("#tag_color_input").val();

    if(title.length < 6){
        alert("Tag Name need at least 6 characters");
        return;
        // $("#errTagNameCharacters").modal("show");
        // return;
    }
    
   	$.ajax({
        type: "POST",
        url: WEB_BASE_URL + "auth/tags?access_token=" + token,
        data : {
		    title : title,
		    color : color
		},
        dataType : 'json',
        success: function (response) {
        	if(response.result == "ok"){
        		fn_draw_active_tag_list();
        		fn_draw_tag_list();
        		$("#addEditTagColorModel").modal("hide");
        	}else{
        		console.log('Create New Tag Color Fail');
        	}
	    }
    });
}
// Function Change Color for Add, edit Model
function change_color(color){
	$("#tag_color_input").val(color);
	$("#tag_color_input").css( "background-color", color );
}
// Function Open Edit Tag Model
function editTagColorModel(){
	var active_tag = $("#tag_mng_model div.active_tag div").attr('class');
    if(active_tag == null){
    	$("#errSelectTagColorModel").modal("show");
        $("#errSelectTagColorModel p.content").html('Please select a tag for Edit');
        return;
    }
    var title = $("#tag_mng_model div.active_tag span.title").attr('value');
    var color = $("#tag_mng_model div.active_tag div").attr('value');
    var tag_id = active_tag.substring(7);

    $("#addEditTagColorModel").modal("show");

    $("h5.tag_title_model").html('Edit tags');

   	$("#tag_title_input").val(title);

   	$("#tag_color_input").val(color );
   	$("#tag_color_input").css( "background-color", color );

   	$("#addNewTagColor").css( "display", "none" );
   	$("#editTagColor").css( "display", "block" );
}
// Function Edit Tag Color
function fn_editTagColor(){
	var active_tag = $("#tag_mng_model div.active_tag div").attr('class');

    var tag_id = active_tag.substring(7);
	var title = ($("#tag_title_input").val()).trim();
   	var color = $("#tag_color_input").val();

    if(title.length < 6){
        alert("Tag Name need at least 6 characters");
        return;
        // $("#errTagNameCharacters").modal("show");
        // return;
    }

   	$.ajax({
        type: "PUT",
        url: WEB_BASE_URL + "auth/tags/"+tag_id+"?access_token=" + token,
        data : {
		    title : title,
		    color : color
		},
        dataType : 'json',
        success: function (response) {
        	if(response.result == "ok"){
        		fn_draw_active_tag_list();
        		fn_draw_tag_list();
        		$("#addEditTagColorModel").modal("hide");
        	}else{
        		console.log('Create New Tag Color Fail');
        	}
	    }
    });
}
// Function ReLoad Tag List
function refreshTag(){
	fn_draw_tag_list();
	fn_draw_active_tag_list();
}
// Function Open Delete Tag Color Model
function openDelTagColorModel(){
    var active_tag = $("#tag_mng_model div.active_tag div").attr('class');
    if(active_tag == null){
        $("#errSelectTagColorModel").modal("show");
        $("#errSelectTagColorModel p.content").html('Please select a tag for Delete');
        return;
    }
    $("#delTagColorModel").modal("show");
}
// Function Delete Tag Color
function fn_delTagColor(){
    var active_tag = $("#tag_mng_model div.active_tag div").attr('class');
    var tag_id = active_tag.substring(7);
    
    $.ajax({
        type: "DELETE",
        url: WEB_BASE_URL + "auth/tags/"+tag_id+"?access_token=" + token,
        dataType : 'json',
        success: function (response) {
            if(response.result == "ok"){
                $("#delTagColorModel").modal("hide");
                fn_draw_active_tag_list();
                fn_draw_tag_list();
            }else{
                console.log('DELETE tag fail');
            }
        }
    });
}