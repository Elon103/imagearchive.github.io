// Function Load View for login page
$(function(){
  	$("#login_view").load("app/login/view/loginViewport.html"); 
  	$("#forgot_password_view").load("app/login/view/forgotPasswordViewport.html"); 
});

// Function Change View login , forgot pass
function forgot_password_view(){
	$("#login_view").addClass('cls_hidden');
	$("#forgot_password_view").removeClass('cls_hidden');
}

function login_view(){
	$("#forgot_password_view").addClass('cls_hidden');
	$("#login_view").removeClass('cls_hidden');
}

// Function login
function fn_login(){
	var user_name = ($("#formLogin #username_login").val()).trim();
	var password = ($("#formLogin #password_login").val()).trim();

	$.ajax({
        type: "POST",
        url: WEB_BASE_URL + "login",
	    data : {
		    loginName : user_name,
		    password : password
		},
	    dataType : 'json',
        success: function (response) {
        	if(response.result == "ok"){
        		var data = response.data;
        		
        		var cookie = setCookie(data.id,data.loginName,data.displayName,data.email,data.type,data.token);
        		if(cookie == true){
        			window.location.href = 'app/main.html';
        		}
        	}else{
        		console.log('Login Fail');
        	}
	    }
    });
}

