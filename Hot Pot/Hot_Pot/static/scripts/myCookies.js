//用于cookies的设置与读取

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));//ms:生存周期
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}


function StoreDish() {
    //将用户已选的菜品存入cookies中，以保证页面刷新之后，用户的选择还在
    //在跳入到已选菜单之后，开发人员也能从cookies中读取相关数据，而无需再从数据库中读取
    for (var i = 0; i < myLen; i++) {
        var myDishes = getCookie("Dishes");
        var myDishID = mySearchResult[i][0];
        var myAmount = document.getElementById("myFrameID" + i).getAttribute("value");
        if (myAmount != '0') {
            //判断myDishID是否加入已选菜单中
            if (myDishes.includes(myDishID) == false) {
                setCookiesArray("Dishes", myDishID);
            }
        }
        else {
            //数量为0，将其从Dishes中删除
            var reg = new RegExp(myDishID + "_", "g");
            var reg2 = new RegExp("_" + myDishID, "g");
            var myDishes = getCookie("Dishes");
            myDishes = myDishes.replace(reg, '');
            myDishes = myDishes.replace(reg2, '');
            setCookie("Dishes", myDishes, 0.1);
        }
        setCookie(myDishID, myAmount, 0.1);
    }
}
function CheckoutLogin() {
    var user = getCookie("username");
    if (user == "") {
        alert("请先登录");
        window.open("/", "_parent");
    }
}