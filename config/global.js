// var WEB_BASE_URL = 'http://10.0.0.208:3000/v1/';
var WEB_BASE_URL = 'http://s3lab.zapto.org:80/v1/';

// Funtion set Cookie
function setCookie(id,loginName,displayName,email,type,token) {
    var date = new Date();
    date.setTime(date.getTime() + (1 * 3600 * 1000));
    var expires = "; expires=" + date.toGMTString();

	document.cookie = "id =" + id + expires + "; path=/";
    document.cookie = "loginName =" + loginName + expires + "; path=/";
    document.cookie = "displayName =" + displayName + expires + "; path=/";
    document.cookie = "email =" + email + expires + "; path=/";
    document.cookie = "type =" + type + expires + "; path=/";
    document.cookie = "token =" + token + expires + "; path=/";
    return true;
}

// Funtion Get Cookie
function getCookie() {
    var decodedCookie = decodeURIComponent(document.cookie);
    var value = "";
    if(decodedCookie){
        value = decodedCookie.split(';');
    }
    return value;
}

// Function Get Token
function get_token() {
    var cookie = getCookie();
    var token = cookie[5];
    return token;
}

// Function Logout
function fn_logout(){
    var cookie = setCookie('','','','','','');

    if(cookie == true){
        window.location.href = '../index.html';
    }
}