//用于存放菜品显示，添加等信息
function AddAmount(index) {
    var myShowFrame = document.getElementById("myFrameID" + index);
    var myValue = myShowFrame.getAttribute("value");
    myValue++;
    myShowFrame.setAttribute("value", myValue);
}

function SubAmount(index) {
    var myShowFrame = document.getElementById("myFrameID" + index);
    var myValue = myShowFrame.getAttribute("value");
    if (myValue != '0') {
        myValue--;
    }
    myShowFrame.setAttribute("value", myValue);
}


function ShowResult() {
    //用于显示图片画廊
    if (myRole == "管理员") {
        ShowAdministor();
    }
    else {
        ShowCustomer();
    }
}

function ShowCustomer() {
    var myPDiv = document.getElementById("myPictureID");
    for (var i = 0; i < myLen; i++) {

        var myCDiv = document.createElement("div");
        myCDiv.setAttribute("class", "myGrally");
        if (mySearchResult[i][4] == "不供应") {
            myCDiv.setAttribute("style", "display:none;");
        }

        var myPictureDiv = document.createElement("div");
        myPictureDiv.setAttribute("class", "myGrallyPicture");
        var myImageAddress = mySearchResult[i][3].toString();
        var myStr = '"';
        /*
        由于不知道如何用正则进行\替换成/所以采用如下这个办法
        */
        for (var j = 0; j < myImageAddress.length; j++) {
            if (myImageAddress[j] == "\\") {
                myStr += '/';
            }
            else {
                myStr += myImageAddress[j];
            }
        }
        myStr += '"';
        myPictureDiv.style.backgroundImage = "url(" + myStr + ")";
        //菜品名字显示
        var myDishnameDiv = document.createElement("div");
        myDishnameDiv.setAttribute("class", "myGrallyDishname");
        myDishnameDiv.innerHTML = "<p>" + mySearchResult[i][1] + "</p>";
        //菜品销量显示
        var mySaleDiv = document.createElement("div");
        mySaleDiv.setAttribute("class", "myGrallySale");
        mySaleDiv.innerHTML = "<p>销量 " + mySearchResult[i][6] + "</p>";
        //菜品评分显示
        var myMarkDiv = document.createElement("div");
        myMarkDiv.setAttribute("class", "myGrallyMark");
        var myStr = mySearchResult[i][7].toString();
        if (myStr.length > 3) {
            myStr = myStr.substr(0, 3);
        }
        myMarkDiv.innerHTML = "<p>评分 " + myStr + "</p>";
        //分割线
        var myBrDiv = document.createElement("hr");
        //菜品价格显示
        var myPriceDiv = document.createElement("div");
        myPriceDiv.setAttribute("class", "myGrallyPrice");
        myPriceDiv.innerHTML = "<p><span class='RMB'>￥</span>" + mySearchResult[i][2] + "</p>";
        //数量选择框
        var myAmountDiv = document.createElement("div");
        var mySubButton = document.createElement("button");
        var myAddButton = document.createElement("button");
        var myShowFrame = document.createElement("input");
        if (getCookie(mySearchResult[i][0]) != '' && getCookie("ID") != '') {
            myShowFrame.setAttribute("value", getCookie(mySearchResult[i][0]));
        }
        else {
            myShowFrame.setAttribute("value", "0");
        }
        myShowFrame.setAttribute("id", "myFrameID" + i);
        myShowFrame.setAttribute("disabled", "disabled");
        myAddButton.setAttribute("onclick", "AddAmount(" + i + ")");
        mySubButton.setAttribute("onclick", "SubAmount(" + i + ")");

        myAmountDiv.setAttribute("class", "myGrallyAmount");
        myAmountDiv.appendChild(mySubButton);
        mySubButton.innerHTML = "<span class=\"glyphicon glyphicon-minus\"></span>";
        myAmountDiv.appendChild(myShowFrame);
        myAddButton.innerHTML = "<span class=\"glyphicon glyphicon-plus\"></span>";
        myAmountDiv.appendChild(myAddButton);


        myCDiv.appendChild(myPictureDiv);
        myCDiv.appendChild(myDishnameDiv);
        myCDiv.appendChild(mySaleDiv);
        myCDiv.appendChild(myMarkDiv);
        myCDiv.appendChild(myBrDiv);
        myCDiv.appendChild(myPriceDiv);
        myCDiv.appendChild(myAmountDiv);

        myPDiv.appendChild(myCDiv);
    }
}

function ShowAdministor() {
    var myPDiv = document.getElementById("myPictureID");
    for (var i = 0; i < myLen; i++) {
        var myCDiv = document.createElement("div");
        myCDiv.setAttribute("class", "myGrally");

        var myPictureDiv = document.createElement("img");
        myPictureDiv.setAttribute("class", "myGrallyPicture");
        var myImageAddress = mySearchResult[i][3].toString();
        var myStr = '';
        /*
        由于不知道如何用正则进行\替换成/所以采用如下这个办法
        */
        for (var j = 0; j < myImageAddress.length; j++) {
            if (myImageAddress[j] == "\\") {
                myStr += '/';
            }
            else {
                myStr += myImageAddress[j];
            }
        }
        myPictureDiv.src = myStr;
        setCookie("UpdatePictureAdd" + i, myStr, 0.1);
        myPictureDiv.setAttribute("onclick", "ChangePicture(" + i + ")");
        myPictureDiv.id = "pictureID" + i;
        myPictureDiv.name = "picturename" + i;
        //以下换成表单的形式进行显示
        var myForm = document.createElement("form");
        myForm.method = "POST";
        //菜品名字显示
        var myDishnameDiv = document.createElement("div");
        myDishnameDiv.setAttribute("class", "myGrallyDishname");
        myDishnameDiv.innerHTML = "<input id=\"dishnameID" + i + "\" name=\"dishname" + i + "\" value=\"" + mySearchResult[i][1] + "\"></input>";
        //分割线
        var myBrDiv = document.createElement("hr");
        //菜品价格显示
        var myPriceDiv = document.createElement("div");
        myPriceDiv.setAttribute("class", "myGrallyPrice");
        myPriceDiv.innerHTML = "<p>价格 <input id=\"priceID" + i + "\" name=\"price" + i + "\" value=\"" + mySearchResult[i][2] + "\"></input></p>";
        //供应状态
        var myStatusDiv = document.createElement("div");
        myStatusDiv.setAttribute("class", "myGrallyStatus");
        myStatusDiv.innerHTML = "<p>供应状态:</p><select id=\"selectID" + i + "\"><option id=\"supplyID" + i + "\" value=\"供应\" name=\"supply" + i + "\">供应</option><option id=\"unsupplyID" + i + "\"  value=\"不供应\" name=\"unsupply" + i + "\">不供应</option></select>";
        var mySupply = mySearchResult[i][4];
        //图片修改（在网页中不进行显示）
        var myPictureChange = document.createElement("input");
        myPictureChange.type = "file";
        myPictureChange.name = "pictadd" + i;
        myPictureChange.id = "pictaddID" + i;

        myPictureChange.style.display = "none";
        //提交修改
        var mySubmitDiv = document.createElement("input");
        mySubmitDiv.setAttribute("type", "submit");
        mySubmitDiv.setAttribute("value", "确定修改");
        mySubmitDiv.setAttribute("class", "myGrallySubmit");
        mySubmitDiv.setAttribute("onclick", "SetStatus(" + i + ")");

        myForm.appendChild(myPictureDiv);
        myForm.appendChild(myDishnameDiv);
        myForm.appendChild(myBrDiv);
        myForm.appendChild(myPriceDiv);
        myForm.appendChild(myStatusDiv);
        myForm.appendChild(myPictureChange);
        myForm.appendChild(mySubmitDiv);

        myCDiv.appendChild(myForm);

        myPDiv.appendChild(myCDiv);
        if (mySupply == "供应") {
            document.getElementById("supplyID" + i).setAttribute("selected", "selected");
        }
        else {
            document.getElementById("unsupplyID" + i).setAttribute("selected", "selected");
        }
    }

    var myCDiv = document.createElement("div");
    myCDiv.setAttribute("class", "myGrally");
    myCDiv.setAttribute("style", "background-color:RGB(245,245,245);");
    var myAddDiv = document.createElement("div");
    myAddDiv.setAttribute("class", "myAddGrally");
    myAddDiv.innerHTML = "<button  id=\"addbuttonID\" class=\"glyphicon glyphicon-plus\"></button>"

    myCDiv.appendChild(myAddDiv);
    myPDiv.appendChild(myCDiv);
    document.getElementById("addbuttonID").setAttribute("onclick", "ShowTemFrame()");
}

function SetStatus(i) {
    var mySelect = document.getElementById("selectID" + i);
    var myIndex = mySelect.selectedIndex;
    var myDishName = document.getElementById("dishnameID" + i);
    var myPrice = document.getElementById("priceID" + i);

    setCookie("UpdatePrice", myPrice.value, 0.1);
    setCookie("UpdateDishName", myDishName.value, 0.1);
    setCookie("UpdateStatus", mySelect.options[myIndex].value, 0.1);
    setCookie("UpdateDishID", mySearchResult[i][0], 0.1);
    setCookie("UpdateIndex", i, 0.1);
}

function ShowTemFrame() {
    //点击加号后的临时添加框
    document.getElementById("myShadeID").setAttribute("style", "display:block;");
    $('.myInputDishInfo').fadeIn();
}

function CloseFrame(i) {
    document.getElementById("myShadeID").setAttribute("style", "display:none;");
    if (i == 1) {
        $('.myInputDishInfo').fadeOut();
    }
    else {
        $('#loginID').fadeOut();
    }
}

function ChangePicture(i) {
    //更改index=i的图片地址
    $("#pictaddID" + i).click();
    document.getElementById("pictaddID" + i).addEventListener("change", function () {
        var myAdd = $("#pictaddID" + i).val();
        myAdd = myAdd.split("\\");
        var myPic = "../static/菜品照片/";
        myPic += myAdd[2];
        document.getElementById("pictureID" + i).src = myPic;
        setCookie("UpdatePictureAdd" + i, myPic, 0.1);
    })
}

function UpType(myValue) {
    setCookie("mySort", myValue, 0.5);
    if (myRole != "管理员") {
        StoreDish();
    }
    window.open("/", "_parent");
}

function setCookiesArray(myName, myValue) {
    //将myValue添加到数组myName中（因为无法向cookies中添加array，只能先将array转成str,再存入cookies中）
    var cookie = getCookie(myName);
    var myArray = cookie.split("_");
    myArray.push(myValue);
    cookie = myArray.join("_");
    
    if (cookie.endsWith("_")) {
        cookie = cookie.substring(0, cookie.length - 1);
    }
    setCookie(myName, cookie, 0.1);
}
