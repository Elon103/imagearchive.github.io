// Load Category Data After render
fn_draw_folder_category();
function fn_draw_folder_category(){
	$.ajax({
        type: "GET",
        url: WEB_BASE_URL + "auth/categories?access_token=" + token,
        success: function (response) {

        	if(response.data.length > 0){
                var html = '';
                html += build_menu(response.data, parent = '0');
                $('ul.tree_node').html(html);

                $('ul.tree_node>li:first-child div').addClass('cls_active_item');

                var category_id = $("#folder_category ul li div.cls_active_item span").attr('id');

                fn_get_all_parent_category_by_id(category_id);

                $('ul.tree_node li a').click(function() {
                    var item_id = this.id;
                    if($(this).hasClass("item_open")){
                        $(this).removeClass('item_open');
                        $(this).addClass('item_close');

                        $(this).parent().find('span').removeClass('item_open');
                        $(this).parent().find('span').addClass('item_close');

                        $(this).parent().removeClass('item_open');
                        $(this).parent().addClass('item_close');
                    }
                    else{
                        $(this).removeClass('item_close');
                        $(this).addClass('item_open');

                         $(this).parent().find('span').removeClass('item_close');
                        $(this).parent().find('span').addClass('item_open');

                        $(this).parent().removeClass('item_close');
                        $(this).parent().addClass('item_open');
                    }
                    $('ul.tree_node div.cls_active_item').removeClass('cls_active_item');
                    $(this).parent().addClass('cls_active_item');
                });
		
				$('div.cls_child_node').click(function() {
                    $('div.cls_child_node').removeClass('cls_active_item');
                    $(this).addClass('cls_active_item');
                });

            }else{
                console.log("No data for Folder Category");
            }
	    }
    });
}
function build_menu(result, parent){
    var html = '';
    $.each (result, function (key, row){
        if (row['parent'] == parent && row['deleted'] == 0){
            html += '<li>';
                html += '<div class="item_close cls_child_node" style="cursor: pointer;" onclick="fn_get_all_parent_category_by_id(' + row["id"] + ')">';
                    if (!has_children(result,row['id'])){
                        html += '<a class="cls_noChild" style=""></a>';
                    }else{
                        html += '<a class="item_close"></a>';
                    }
                    html += '<span class="item_close" id='+row["id"]+'>'+row["title"]+'</span>';
                html += '</div>';
                html += '<ul style="margin-left: -19px;">';
                if (has_children(result,row['id'])){
                    html += build_menu(result,row['id']);
                }
                html += "</ul>";
            html += '</li>';
        }
    });
    return html;
}

function has_children(result,id) {
    var flag = false;
    for(var i = 0; i < result.length; i ++){ 
        if(result[i]["parent"] == id && result[i]["deleted"] == 0){
            flag = true;
        }
    }
    return flag;
}
function fn_get_all_parent_category_by_id(category_id){

    $('.tree_node div.cls_child_node').removeClass('cls_active_item');
    $("#"+category_id).parent().addClass("cls_active_item");

    $.ajax({
        type: "GET",
        url: WEB_BASE_URL + "auth/categories/"+category_id+"/parents?access_token=" + token,
        success: function (response) {
            var category_title = $("#folder_category ul li div.cls_active_item span").html();

            if(response.result == "ok"){
                if(response.data.length > 0){
                    var html = '';
                    html += '<div style="float: left; padding-left: 10px;" onclick="fn_get_all_parent_category_by_id('+response.data[0].id+')">';
                    html += '<a class="item_open"></a>'+response.data[0].title+'</div>';  

                    for(var i = 1; i < response.data.length; i ++ ){
                        html += '<div style="float: left; padding-left: 10px;" onclick="fn_get_all_parent_category_by_id('+response.data[i].id+')">';
                        html += '<i class="fa fa-caret-right" aria-hidden="true" style="float: left;margin-top: 4px;margin-right: 3px; padding-right: 6px;"></i> '+response.data[i].title+' </div>';
                    }
                    
                    html += '<div style="float: left; padding-left: 10px;" onclick="fn_get_all_parent_category_by_id('+category_id+')">';
                    html += '<i class="fa fa-caret-right" aria-hidden="true" style="float: left;margin-top: 4px;margin-right: 3px; padding-right: 6px;"></i> ' + category_title + ' </div>';
                    
                    $('#category_link').html(html);

                }else{
                    var html = '';

                    html += '<div style="float: left; padding-left: 10px;" onclick="fn_get_all_parent_category_by_id('+category_id+')">';
                    html += '<a class="item_open"></a>' + category_title + '</div>';

                    $('#category_link').html(html);
                }
            }else{
                console.log("Can Not Get List Parent");
            }
        }
    });

    var image_search_name = ($("#search_text").val()).trim();
    var tag_active = $("#search_left_tag_color_content div.active_tag div").attr('class');
    var tag_id = null;
    if(tag_active){
        tag_id = tag_active.replace("tag_id_", '');
    }
    var page = 1;
    fn_draw_image_content_list(image_search_name,category_id,tag_id, page);
}
// Funtion Make Root Node
function fn_setRoot(){
    var checked = $("#root_category_checkbox").prop("checked");
    if(checked == false){
        var category_id = $("#folder_category ul li div.cls_active_item span").attr('id');
        $("#create_category_model input.category_folder_id").val(category_id);
    }else{
        $("#create_category_model input.category_folder_id").val(0);
    }
}
// Open Modal Create category
function fn_open_create_model(){
    $("#create_category_model").modal("show");

    document.getElementById("root_category_checkbox").checked = false;
    $("#create_category_model input#new_category_name").val("");

    var category_id = $("#folder_category ul li div.cls_active_item span").attr('id');
    if(!category_id){
        category_id = 0;
    }
    $("#create_category_model input.category_folder_id").val(category_id);
}
// Function Create new Category
function fn_create_new_category_folder(){
    var parrent_category_id = $("#create_category_model input.category_folder_id").val();

    if(parrent_category_id != 0){
        var have_child = $("#folder_category ul li div.cls_active_item").siblings().children().children().attr('style');
        if(!have_child){
            var active = $("#folder_category ul li div.cls_active_item");
            active.removeClass('item_close').addClass('item_open');
            active.children().first().removeClass('cls_noChild').addClass('item_open');
            active.children().last().removeClass('item_close').addClass('item_open');
        }
    }

    var category_title = ($("#create_category_model input#new_category_name").val()).trim();
    var timeline = 0;
    var root = 0;

    if(parrent_category_id == 0){
        root = 1;
    }

    if(category_title.length < 1){
        alert("Category Name must at least 1 characters");
        return;
    }

    $.ajax({
        type: "POST",
        url: WEB_BASE_URL + "auth/categories?access_token=" + token,
        data : {
            title : category_title,
            parent : parrent_category_id,
            timeline : timeline,
            root : root
        },
        dataType : 'json',
        success: function (response) {
            if(response.result == "ok"){
                $("#create_category_model").modal("hide");

                var id = response.data.id;
                var parent;

                if(parrent_category_id == 0){
                    parent = $("#folder_category ul.tree_node");
                } if(parrent_category_id != 0){
                    parent = $("#folder_category ul li div.cls_active_item").siblings();
                }

                var html = '';
                html += '<li>';
                    html += '<div class="item_close cls_child_node" style="cursor: pointer;" onclick="fn_get_all_parent_category_by_id(' + id + ')">';
                        html += '<a class="cls_noChild" style=""></a>';
                        html += '<span class="item_close" id='+id+'>'+category_title+'</span>';
                    html += '</div>';
                    html += '<ul style="margin-left: -19px;"></ul>';
                html += '</li>';

                parent.prepend(html);

                $('div.cls_child_node').click(function() {
                    $('div.cls_child_node').removeClass('cls_active_item');
                    $(this).addClass('cls_active_item');
                });

                $('ul.tree_node li a').click(function() {
                    if($(this).hasClass("item_open")){
                        $(this).removeClass('item_open');
                        $(this).addClass('item_close');

                        $(this).parent().find('span').removeClass('item_open');
                        $(this).parent().find('span').addClass('item_close');

                        $(this).parent().removeClass('item_open');
                        $(this).parent().addClass('item_close');
                    }else{
                        $(this).removeClass('item_close');
                        $(this).addClass('item_open');

                        $(this).parent().find('span').removeClass('item_close');
                        $(this).parent().find('span').addClass('item_open');

                        $(this).parent().removeClass('item_close');
                        $(this).parent().addClass('item_open');
                    }
                });

            }else{
                console.log('Create New Tag Color Fail');
            }
        }
    });

    $('ul.tree_node li a').click(function() {
        if($(this).hasClass("item_open")){
            $(this).removeClass('item_open');
            $(this).addClass('item_close');

            $(this).parent().find('span').removeClass('item_open');
            $(this).parent().find('span').addClass('item_close');

            $(this).parent().removeClass('item_open');
            $(this).parent().addClass('item_close');
        }else{
            $(this).removeClass('item_close');
            $(this).addClass('item_open');

            $(this).parent().find('span').removeClass('item_close');
            $(this).parent().find('span').addClass('item_open');

            $(this).parent().removeClass('item_close');
            $(this).parent().addClass('item_open');
        }
    });
}
// Open Modal Edit category
function fn_open_rename_model(){
	$("#rename_category_model").modal("show");

    var category_id = $("#folder_category ul li div.cls_active_item span").attr('id');
    var category_title = $("#folder_category ul li div.cls_active_item span").html();

    $("#rename_category_model input#new_category_folder_name").val(category_title);
    $("#rename_category_model input.category_folder_id").val(category_id);
}
// Function Rename Category
function fn_rename_category_folder(){
    var category_id = $("#rename_category_model input.category_folder_id").val();
    var category_title_new = ($("#rename_category_model input#new_category_folder_name").val()).trim();
    
    if(category_title_new.length < 1){
        alert("Category Name must at least 1 characters");
        return;
    }

    $.ajax({
        type: "PUT",
        url: WEB_BASE_URL + "auth/categories/"+category_id+"?access_token=" + token,
        data : {
            title : category_title_new
        },
        dataType : 'json',
        success: function (response) {
            if(response.result == "ok"){
                document.getElementById(category_id).innerHTML = category_title_new;
                $("#rename_category_model").modal("hide");
            }else{
                console.log('Update Category Name fail');
            }
        }
    });
}
// Function Delete category
function fn_delete_category(){
    var category_title = $("#folder_category ul li div.cls_active_item span").html();
    var r = confirm("Are you sure to delete category: " + category_title);

    if (r == true) {
        var have_child = $("#folder_category ul li div.cls_active_item").siblings().children().children().attr('style');
        if(have_child){
            alert("Can Not Delete This Category");
            return;
        }

        var category_id = $("#folder_category ul li div.cls_active_item span").attr('id');
        
        $.ajax({
            type: "DELETE",
            url: WEB_BASE_URL + "auth/categories/"+category_id+"?access_token=" + token,
            dataType : 'json',
            success: function (response) {
                if(response.result == "ok"){
                    var siblings = $("#folder_category ul li div.cls_active_item").parent().siblings();
                    var number_of_siblings = siblings.length;

                    if(number_of_siblings == 0){
                        var parent = $("#folder_category ul li div.cls_active_item").parent().parent().siblings();
                        parent.removeClass('item_open').addClass('item_close');
                        parent.children().first().removeClass('item_open').addClass('cls_noChild');
                        parent.children().last().removeClass('item_open').addClass('item_close');
                    }

                    $("#"+category_id).parent().parent().remove();
                }else{
                    console.log('Update Category Name fail');
                }
            }
        });
    }
}