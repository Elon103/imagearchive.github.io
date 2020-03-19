// Show Create User Model
function create_user_model(){
	$("#create_user_model").load("user_management/model/create_user.html");
	$("#create_user_model").modal("show");
}
// Function Get All User
function get_allUser(){
	$.ajax({
        type: "GET",
        url: WEB_BASE_URL + "auth/users?access_token=" + token,
        success: function (response) {
        	if(response.result == "ok"){
        		var data = response.data;
        		console.log("data");
        		console.log(data);

        		var html = "";
				for (var i = 0; i < data.length; i++){
				    html +="<tr>"+
				    	"<td>"+ (i+1) + "</td>"+
				        "<td>"+ data[i].loginName + "</td>"+
				        "<td>"+ data[i].firstName + "</td>"+
				        "<td>"+ data[i].lastName + "</td>"+
				        "<td>"+ data[i].email + "</td>"+
				        "<td>"+ fn_check_user_level(data[i].type) + "</td>"+
				        "<td>"+ "<a class='btn btn-success' onclick='fn_openUpdateUserModel("+ data[i].id +");'>Update</a>" + 
				        		"<a class='btn btn-success' onclick='read_user("+ data[i].id +");'>Read</a>" +
				        		fn_check_delete(data[i].id ,data[i].deleted, data[i].type) +
				        		fn_check_change_pass(data[i].id, data[i].deleted, data[i].type) + 
				        		fn_check_is_admin(data[i].id, data[i].deleted, data[i].type) +
				        "</td>"+
				    "</tr>";
				}
				$("#user_management_table>tbody").html(html);

        	}else{
        		console.log('Get List User Fail');
        	}
	    }
    });
}
// Function Check Level of User
function fn_check_user_level(type){
	if(type == 1){
		return "<a class='btn btn-info'>Anonymous</a>";
	}else if(type == 2){
		return "<a class='btn btn-info'>User</a>";
	}else if(type == 3){
		return "<a class='btn btn-info'>Moderator</a>";
	}else if(type == 4){
		return "<a class='btn btn-info'>Admin</a>";
	}else if(type == 5){
		return "<a class='btn btn-info'>Super Admin</a>";
	}
}
// Function Check User deleted or not
function fn_check_delete(user_id ,del_yn, super_admin){
	if(del_yn == 0 && super_admin != 5){
		// return "<a class='btn btn-success confirmation' onclick='fn_delUserById("+user_id+")'>Delete</a>";
		return "<a class='btn btn-success confirmation' onclick='fn_updateDelStatus("+user_id+",1)'>Delete</a>";
	}else if(del_yn == 1){
		// return "<a class='btn btn-info confirmation' onclick='fn_unDelUserById("+user_id+")'>Undelete</a>";
		return "<a class='btn btn-info confirmation' onclick='fn_updateDelStatus("+user_id+",0)'>Undelete</a>";
	}else{
		return "";
	}
}
// Function Show Change Pass Buttom
function fn_check_change_pass(user_id, del_yn, super_admin){
	if(del_yn == 0 && super_admin != 5){
		return "<a class='btn btn-success confirmation' onclick='fn_openChangePassModel("+user_id+")'>Change Password</a>";
	}else{
		return "";
	}
}
// Function check is admin or not
function fn_check_is_admin(user_id, del_yn, is_admin){
	if(is_admin == 4 && del_yn != 1 ){
		return "<a class='btn btn-info confirmation' onclick='fn_updateIsAdmin("+user_id+",2)'>Unset Admin</a>";
	}else if(is_admin == 5 || del_yn == 1){
		return "";
	}else{
		return "<a class='btn btn-success confirmation' onclick='fn_updateIsAdmin("+user_id+",4)'>Set Admin</a>";
	}
}
// Function Set, UnSet Admin
function fn_updateIsAdmin(user_id, type){
	$.ajax({
        type: "PUT",
        url: WEB_BASE_URL + "auth/users/"+user_id+"?access_token=" + token,
        data : {
		    type : type
		},
        dataType : 'json',
        success: function (response) {
        	if(response.result == "ok"){
        		get_allUser();
        	}else{
        		console.log('Set, Unset Admin Fail');
        	}
	    }
    });
}
// Function Delete, Undelete
function fn_updateDelStatus(user_id, type){
	$.ajax({
        type: "PUT",
        url: WEB_BASE_URL + "auth/users/"+user_id+"?access_token=" + token,
        data : {
		    deleted : type
		},
        dataType : 'json',
        success: function (response) {
        	if(response.result == "ok"){
        		get_allUser();
        	}else{
        		console.log('Delete Fail');
        	}
	    }
    });
}
// Function Read User Detail Infor
function read_user(user_id){
	$("#read_user_model").load("user_management/model/read_user.html"); 
	$("#read_user_model").modal("show");

	// Ajax Get User by ID
	$.ajax({
        type: "GET",
        dataType :'json',
        url: WEB_BASE_URL + "auth/users/"+user_id+"?access_token=" + token,
        success: function (response) {
        	if(response.result == "ok"){
        		var data = response.data;

        		console.log(data);
        		
        		var user_level = "User";

        		if(data.type == 1){
        			user_level = "Anonymous";
        		}else if(data.type == 3){
        			user_level = "Moderator";
        		}else if(data.type == 4){
        			user_level = "Admin";
        		}else if(data.type == 5){
        			user_level = "Super Admin";
        		}

        		var user_active = "Actived";

        		if(data.deleted == 1){
        			user_active = "Non-Actived";
        		}

        		$('#read_user_model input.email').val(data.email);
        		$('#read_user_model input.login_id').val(data.loginName);
        		$('#read_user_model input.first_name').val(data.firstName);
        		$('#read_user_model input.last_name').val(data.lastName);
        		$('#read_user_model input.user_level').val(user_level);
        		$('#read_user_model input.status').val(user_active);
        	}else{
        		console.log('Get User By ID Fail');
        	}
	    }
    });
}
// Show Change Pass Model
function fn_openChangePassModel(user_id){
	$("#change_pass_model").load("user_management/model/change_pass_user.html"); 
	$("#change_pass_model").modal("show");
	setTimeout(function(){ $("#change_pass_model input.user_id").val(user_id); }, 100);
}
// Function Change Password
function fn_changePassWord(){
	var user_id = $("#change_pass_model input.user_id").val();
	var new_password = $("#change_pass_model input.password").val();

	$.ajax({
        type: "PUT",
        url: WEB_BASE_URL + "auth/users/"+user_id+"?access_token=" + token,
        data : {
		    password : new_password
		},
        dataType : 'json',
        success: function (response) {
        	if(response.result == "ok"){
        		get_allUser();
        		$("#change_pass_model").modal("hide");
        	}else{
        		console.log('Change Password Fail');
        	}
	    }
    });
}
// Function Create New User
function fn_createUser(){
	var email = $("#create_user_model input.email").val();
	var loginName = $("#create_user_model input.login_id").val();
	var firstName = $("#create_user_model input.firstname").val();
	var lastName = $("#create_user_model input.lastName").val();
	var password = $("#create_user_model input.password").val();
	var type = $("#create_user_model input[name='data[admin_yn]']:checked").val();
	$.ajax({
        type: "POST",
        url: WEB_BASE_URL + "auth/users?access_token=" + token,
        data : {
		    email : email,
		    loginName : loginName,
		    password : password,
		    type : type,
		    firstName : firstName,
		    lastName : lastName
		},
	    dataType : 'json',
        success: function (response) {
        	if(response.result == "ok"){
        		get_allUser();
        		$("#create_user_model").modal("hide");
        	}else{
        		console.log('Create User Fail');
        	}
	    }
    });
}
// Function Open Update User Model
function fn_openUpdateUserModel(user_id){
	$("#update_user_model").load("user_management/model/update_user.html"); 
	$("#update_user_model").modal("show");
	// Ajax Get User by ID
	$.ajax({
        type: "GET",
        dataType :'json',
        url: WEB_BASE_URL + "auth/users/"+user_id+"?access_token=" + token,
        success: function (response) {
        	if(response.result == "ok"){
        		var data = response.data;
        		$("#update_user_model input.user_id").val(data.id);
        		$('#update_user_model input.email').val(data.email);
        		$('#update_user_model input.first_name').val(data.firstName);
        		$('#update_user_model input.last_name').val(data.lastName);
        	}else{
        		console.log('Get One User Fail');
        	}
	    }
    });
}
// Function Update User
function fn_updateUser(){
	var user_id = $("#update_user_model input.user_id").val();
	var email = $("#update_user_model input.email").val();
	var firstName = $("#update_user_model input.first_name").val();
	var lastName = $("#update_user_model input.last_name").val();

	$.ajax({
        type: "PUT",
        url: WEB_BASE_URL + "auth/users/"+user_id+"?access_token=" + token,
        data : {
		    email : email,
		    firstName : firstName,
		    lastName : lastName
		},
        dataType : 'json',
        success: function (response) {
        	if(response.result == "ok"){
        		get_allUser();
        		$("#update_user_model").modal("hide");
        	}else{
        		console.log('Update Fail');
        	}
	    }
    });
}