function signin(){
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    var obj = {
        email: email.value,
        password: password.value
    }

    //ajax syntax
    var xhr = new XMLHttpRequest();
    xhr.open('POST','/login');
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.onload = function(){
        var res = JSON.parse(xhr.responseText);
        if(res == 1){
            window.location = "./ProjectPage.html"
        }
        else{
            alert("Username or Password Incorrect");
        }
    };
    xhr.send(JSON.stringify(obj));
}
function signup(){
    window.location = "./SignUp.html"
}