var token = get_token();

if(!token || token == " token="){
    window.location.href = '../index.html';
}
token = token.slice(7);

var user_id = getCookie()[1].slice(11);