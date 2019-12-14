function ShowOrder() {
    var myOrderDiv = document.getElementById("OrderID");
    for (var i = 0; i < mySearchResult.length; i++) {
        var mySubDiv = document.createElement("div");
        mySubDiv.setAttribute("class", "SuborderDiv");

        var myPictureDiv = document.createElement("div");
        myPictureDiv.setAttribute("class", "myOrderPicture");
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
        myDishnameDiv.setAttribute("class", "myOrderDishname");
        myDishnameDiv.innerHTML = "<p>" + mySearchResult[i][1] + "</p>";
        //菜品价格和数量框
        var myPandADiv = document.createElement("div");
        myPandADiv.setAttribute("class", "myOrderPandADiv");

        //菜品价格显示
        var myPriceDiv = document.createElement("div");
        myPriceDiv.setAttribute("class", "myOrderPrice");
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

        myAmountDiv.setAttribute("class", "myOrderAmount");
        myAmountDiv.appendChild(mySubButton);
        mySubButton.innerHTML = "<span class=\"glyphicon glyphicon-minus\"></span>";
        myAmountDiv.appendChild(myShowFrame);
        myAddButton.innerHTML = "<span class=\"glyphicon glyphicon-plus\"></span>";
        myAmountDiv.appendChild(myAddButton);

        myPandADiv.appendChild(myPriceDiv);
        myPandADiv.appendChild(myAmountDiv);
        mySubDiv.appendChild(myPictureDiv);
        mySubDiv.appendChild(myDishnameDiv);
        mySubDiv.appendChild(myPandADiv);

        myOrderDiv.appendChild(mySubDiv);
    }
}

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

function ShowFrame() {
    StoreDish();
    document.getElementById("myShadeID").setAttribute("style", "display:block");

    var myDetailDiv = document.getElementById("myDishDetailID");
    myDetailDiv.setAttribute("style", "display:block");

    var myDetailUL = document.getElementById("myDishInfoID");
    myDetailUL.innerHTML = "";
    var myAttri = new Array("DetailName", "DetailAmount", "DetailPrice");
    
    var myCost = 0;//原价

    for (var i = 0; i < mySearchResult.length; i++) {
        var myLi = document.createElement("li");
        var myDiv;
        for (var j = 0; j < 3; j++) {
            myDiv = document.createElement("div");
            myDiv.setAttribute("class", myAttri[j]);
            switch (j) {
                case 0: myDiv.innerHTML = mySearchResult[i][1]; break;
                case 1: myDiv.innerHTML = getCookie(mySearchResult[i][0]); break;
                case 2: {
                    var myTem = parseInt(getCookie(mySearchResult[i][0])) * parseInt(mySearchResult[i][2]);
                    myCost += myTem;
                    myDiv.innerHTML = "￥" +myTem;
                }break;
            }
            myLi.appendChild(myDiv);
        }
        myDetailUL.appendChild(myLi);
    }
    setCookie("OriPrice", myCost, 0.1);
    //以下用于填充地址选择信息
    var mySelect = document.getElementById("AddressID");
    mySelect.innerHTML = "";
    var myOption = document.createElement("option");
    for (var i = 0; i < myAddress.length; i++) {
        myOption = document.createElement("option");    
        myOption.setAttribute("value", myAddress[i][1]);
        myOption.innerHTML = myAddress[i][1];
        mySelect.appendChild(myOption);
    }
    //以下用于填充积分抵用选择信息
    var myGrade = getCookie("grade");
    var myOption;
    var myTem = 0;
    mySelect = document.getElementById("GradeID");
    mySelect.innerHTML = "";
    while (true) {
        myOption = document.createElement("option");
        myOption.setAttribute("value", myTem);
        myOption.setAttribute("onclick", "ChangeCost(" + myTem + ")");
        myOption.innerHTML = myTem;
        mySelect.appendChild(myOption);
        myTem += 100;
        if (myTem > (myCost / 2)*100 || myTem > myGrade) {
            break;
        }
    }
    //以下用于填充原价信息和实付信息
    var myUL = document.getElementById("myCostulID");
    myUL.innerHTML = "";
    var myLi = document.createElement("li");
    myLi.setAttribute("id","OriCostID");
    myLi.innerHTML = "原价:" + myCost;
    myUL.appendChild(myLi);
    myLi = document.createElement("li");
    myLi.setAttribute("id", "RealCostID");
    setCookie("RealPrice",myCost,0.1)
    myLi.innerHTML = "实付:<span style=\"font-size:150%\">" + myCost + "</span>";
    myUL.appendChild(myLi);

}

function ChangeCost(myValue) {
    //选择不同积分抵用的时候计算不同的价格
    var myli=document.getElementById("RealCostID");
    var myCost = getCookie("OriPrice");
    var myReal = (parseInt(myCost) - parseInt((myValue)) / 100);
    setCookie("RealPrice", myReal, 0.1);
    myli.innerHTML = "实付:<span style=\"font-size:150%\">" + myReal+ "</span>";
    //myli.innerHTML = "asdfads";
}

function CloseFrame() {
    document.getElementById("myDishDetailID").setAttribute("style", "display:none");
    document.getElementById("myShadeID").setAttribute("style", "display:none");
}

function UploadOrder() {
    //将订单信息上传至后台

    //菜品ID和单个菜品总价格、还要加上菜品名
    var myDishesID = "";
    var myDishesPrice = "";
    var myDishesName = "";
    for (var i = 0; i < mySearchResult.length; i++) {
        myDishesName += mySearchResult[i][1];
        myDishesName += '_';
        myDishesID += mySearchResult[i][0];
        myDishesID += '_';
        myDishesPrice += (parseInt(mySearchResult[i][2]) * parseInt(getCookie(mySearchResult[i][0])));
        myDishesPrice += '_';
    }
    setCookie("orderdishesid", myDishesID, 0.1);
    setCookie("orderprice", myDishesPrice, 0.1);
    setCookie("orderdishesname", myDishesName, 0.1);
    //配送方式、地址、积分抵用情况
    var myDic = new Array("DistributionID", "AddressID", "GradeID");
    var myCookieName = new Array("orderdelieve", "orderaddress", "ordergrade");
    var mySelect;
    var myIndex;
    for (var i = 0; i < 3; i++) {
        mySelect = document.getElementById(myDic[i]);
        //alert("ceshi");
        myIndex = mySelect.selectedIndex;
        //alert(mySelect.options[myIndex].value);
        setCookie(myCookieName[i], mySelect.options[myIndex].value, 0.1);
    }
    //附加信息
    var myText = document.getElementById("OverheadID");
    alert(myText.value);
    setCookie("orderoverhead", myText.value, 0.1);
    //原价、实付(在前面的函数已经存入cookie中)
    //设置flag，使用户在提交完订单之后不能再进入已选菜单，除非重新登录
    setCookie("SubmitFlag", "true", 0.1);
    window.open("/order_hand", "_parent");
}