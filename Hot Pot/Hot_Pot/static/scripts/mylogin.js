var myusermessage = {{MYUserMessage|tojson}};
function checkpassword() {
    var name = document.getElementById('usernameID').value;
    var password = document.getElementById('passwordID').value;
    if (name == "" || password == "") {
        window.alert("请输入用户名和密码");
    }
    var myStr=myusermessage.toString();
    myStr=myStr.split(",");
    var myUser="";
    var myPwd="";
    for(var i=0;i<myStr.length;){
        myUser+=myStr[i++];
        myUser+=",";
        myPwd+=myStr[i++];
        myPwd+=",";
    }
    if(myUser.indexOf(name)==-1||myPwd.indexOf(password)==-1){
        window.alert("用户名或密码错误");
    }
    else{
        window.alert("欢迎回来"+name);
    }
}