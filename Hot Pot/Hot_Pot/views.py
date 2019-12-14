"""
Routes and views for the flask application.
"""
from datetime import datetime
from flask import render_template
from flask import request,flash
from Hot_Pot import app
import time
import pymssql, json

#################################################################################
##连接数据库，可在此修改
#################################################################################
try:
    db = pymssql.connect(server='127.0.0.1:1433', user='barry',
        password='252300chen',database='takeout_management',charset="utf8")
except:
    print("连接不成功")

cursor=db.cursor()

'''
以下函数未home()和lend()公共相同部分
'''

def common():
    myInput = request.cookies.get("myInput")
    mySort=request.cookies.get("mySort")
    if(myInput != None):
        mySearchFront = "select * from view_dishes where "
        cursor.execute(mySearchFront+"菜品名 like'%"+myInput+"%';")
        row = cursor.fetchall()
    else:
        row=''

    if(mySort !=None):
        cursor.execute("select 菜品ID from 菜类 where 类名='"+mySort+"';")
        myDishSet=cursor.fetchall()
        #print(myDishSet)
    else:
        myDishSet=''

    return row,myDishSet

def login():
    cursor.execute('select 用户名,密码,身份,用户ID,积分 from 用户')
    row=cursor.fetchall()
    return row

@app.route('/',methods=['POST','GET'])
@app.route('/home/<form>',methods=['POST','GET'])
def home(form='dish'):
    """Renders the home page.""" 
    
    row,myDishSet=common()
    MYUserMessage=login()

    if(myDishSet!=''):
        myRow=()
        for myItem in myDishSet:
            cursor.execute("select * from view_dishes where 菜品ID='"+myItem[0]+"';")
            myRow+=tuple(cursor.fetchall())
        row=myRow
    length=len(row)

    if request.method=="POST":
        myDishID=request.cookies.get("UpdateDishID")
        myIndex=request.cookies.get("UpdateIndex")
        myDishName=request.cookies.get("UpdateDishName")
        myStatus=request.cookies.get("UpdateStatus")
        myPrice=request.cookies.get("UpdatePrice")
        myPicture=request.cookies.get("UpdatePictureAdd"+myIndex)
        
        myStr="update 菜单静态表 set 菜品名='"+myDishName+"',价格='"+myPrice+"',图片地址='"+ myPicture+"',供应状态='"+myStatus+"' where 菜品ID='"+myDishID+"';"
        cursor.execute(myStr)
        db.commit()
    if request.method=="GET":
        if(request.cookies.get("InsertFlag")=="true"):
            inDishName=request.cookies.get("InsertDishName")
            inDishPrice=request.cookies.get("InsertDishPrice")
            inDishStatus=request.cookies.get("InsertStatus")
            inDishType=request.cookies.get("InsertType")
            inDishID=request.cookies.get("InsertDishID")
            inPict=request.cookies.get("InsertPictAdd")
            myStr="insert into 菜单静态表 values('"+inDishID+"','"+inDishName+"',"+inDishPrice+",'"+inPict+"','"+inDishStatus+"','');"
            cursor.execute(myStr)
            cursor.execute("insert into 菜单动态表 values('"+inDishID+"',0,0,0);")
            myStr="insert into 菜类 values ('"+inDishID+"','"+inDishType+"');"
            cursor.execute("insert into 菜类 values ('"+inDishID+"','"+inDishType+"');")
            db.commit()
    if(form=='login'):
        myType='login'
    else:
        myType='else'

    return render_template(
        'index.html',
        title='Home Page',
        year=datetime.now().year,
        row=row,len=length,
        MYUserMessage=MYUserMessage,
        type=myType
    )

@app.route('/signin',methods=['POST','GET'])
def signin():
    cursor.execute("select * from 用户")
    row=cursor.fetchall()
    usernum=len(row)
    return render_template('signin.html',usersearch=row,usernum=usernum,myflag=False)

@app.route('/SigninSuccess')
def SigninSuccess():
    #因为这一次页面调用没有用到row和usernum，但还是需要传入参数，所以为空即可，避免不必要的查询操作
    row=""
    usernum=0
    personmess=request.cookies.get('personmess')
    print(personmess)
    myInsert="insert into 用户 values("+personmess+");"
    cursor.execute(myInsert)
    db.commit()
    return render_template('signin.html',usersearch=row,usernum=usernum,myflag=True)#myflag=True表示跳转之后直接显示成功


#########################################################
##以下为菜品管理部分
#########################################################
@app.route('/order_hand', methods=['GET', 'POST'])
def order_hand():
    #以下为判断是否有订单提交
    mySubmit=request.cookies.get("SubmitFlag")
    if(mySubmit=='false'):
        myDishID=request.cookies.get("orderdishesid")
        myDishName=request.cookies.get("orderdishesname")
        myPrice=request.cookies.get("orderprice");
        myDelieve=request.cookies.get("orderdelieve")
        myAddress=request.cookies.get("orderaddress")
        myGrade=request.cookies.get("ordergrade")
        myOverhead=request.cookies.get("orderoverhead")
        myOriPrice=request.cookies.get("OriPrice")
        myRealPrice=request.cookies.get("RealPrice")
        myUserID=request.cookies.get("ID")
        myOrderID=request.cookies.get("OrderID")
        #将订单信息插入到订单总表(正确)
        myStr="insert into 订单总表 values('"+myUserID+"','"+myOrderID+"','"+myAddress+"','"+myOriPrice+"','"+myRealPrice+"','"+myDelieve+"','待处理','"+myOverhead+"','"+myGrade+"')"
        cursor.execute(myStr)
        myDishID=myDishID.split('_')
        myPrice=myPrice.split('_')
        myDishName=myDishName.split('_')
        for i in range(len(myDishID)):
            if(myDishID[i]!=''):
                myStr="insert into 订单子表 values('"+myOrderID+"','"+myUserID+"','"+myDishID[i]+"','"+myDishName[i]+"',"+request.cookies.get(myDishID[i])+","+myPrice[i]+",'')"
                cursor.execute(myStr)
        myValue=int(myOriPrice)-int(myGrade)
        myStr="update 用户 set 积分+="+str(myValue)+" where 用户ID='"+myUserID+"'"
        cursor.execute(myStr)
        db.commit()

    myDish=request.cookies.get("Dishes")
    row=()
    if(myDish!=None):
        myDish=myDish.split('_')
        for myItem in myDish:
            if(myItem!=''):
                cursor.execute("select * from 菜单静态表 where 菜品ID='"+myItem+"'")
                row+=tuple(cursor.fetchall())
    user=request.cookies.get("ID")
    address=""
    if(user!=None):
        cursor.execute("select * from 地址 where 用户ID='"+user+"'")
        address=cursor.fetchall()
    length=len(row)
    return render_template(
        'order_handing.html',
        title='已选订单',
        mySearchResult=row,
        len=length,
        myAddress=address,
        year=datetime.now().year,
    )



@app.route('/order_confirm/', methods=['GET', 'POST'])
@app.route('/order_confirm/<dishid>', methods=['GET', 'POST'])
def order_confirm(dishid=''):
    cursor.execute("select * from view_orderform where 状态='待处理'")
    row=cursor.fetchall()
    length=len(row)
    mySuborder=""
    #用于判断是否要显示订单的详细信息
    myShow="false"
    myTest=request.args['dishid']
    if(myTest!='0'):
        cursor.execute("select * from 订单子表 where 订单号='"+myTest+"'")
        mySuborder=cursor.fetchall()
        myShow="true"
    return render_template(
        'order_confirm.html',
        title='订单处理',
        mySearchResult=row,
        myLen=length,
        mySuborder=mySuborder,
        myShow=myShow,
        year=datetime.now().year,
    )

