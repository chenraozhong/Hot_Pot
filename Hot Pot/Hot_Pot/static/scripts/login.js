//与登录有关的JS
function checkpassword() {
    var mySelectC = document.getElementById("myselectID");
    var myRole = mySelectC.options[mySelectC.selectedIndex].text;
    var name = document.getElementById('usernameID').value;
    var password = document.getElementById('passwordID').value;
    if (name == "" || password == "") {
        window.alert("请输入用户名和密码");
    }
    else {
        var myStr = myusermessage.toString();
        myStr = myStr.split(",");
        var myID = "";
        var myGrade = "";
        //var myStatus;
        for (var i = 0; i < myStr.length;) {
            if (myStr[i++] == name && myStr[i++] == password && myStr[i++] == myRole) {
                myID = myStr[i++];
                myGrade = myStr[i++];
                //myStatus=myStr[i++];
                break;
            }
        }
        if (myID == "") {
            window.alert(myID);
            window.alert("用户名或密码错误");
        }
        else {
            //登录成功

            setCookie("username", name, 0.1);
            setCookie("ID", myID, 0.1);
            setCookie("role", myRole, 0.1);
            setCookie("grade", myGrade, 0.1);
            setCookie("SubmitFlag", "false", 0.1);
            //以下为生成订单号模块
            var date = new Date();
            var myOrderID = "";
            myOrderID += date.getFullYear();
            myOrderID += (GetNum(date.getMonth()) + 1);
            myOrderID += GetNum(date.getDate());
            myOrderID += GetNum(date.getHours());
            myOrderID += GetNum(date.getMinutes());
            myOrderID += myID;
            setCookie("OrderID", myOrderID, 0.1);
        }
    }
}
function GetNum(myNum) {
    var myStr = '';
    if (myNum <= 9) {
        myStr += '0';
        myStr += myNum;
        return myStr;
    }
    else {
        return myNum;
    }

}