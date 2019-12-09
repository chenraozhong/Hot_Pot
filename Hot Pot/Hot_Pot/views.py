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
    else:
        myDishSet=''

    return row,myDishSet

@app.route('/',methods=['POST','GET'])
@app.route('/home',methods=['POST'])
def home():
    """Renders the home page.""" 
    
    row,myDishSet=common()
    if(myDishSet!=''):
        myRow=()
        for myItem in myDishSet:
            cursor.execute("select * from view_dishes where 菜品ID='"+myItem[0]+"';")
            myRow+=tuple(cursor.fetchall())
        row=myRow
    length=len(row)
    if request.method=="GET":

        myDishID=request.cookies.get("UpdateDishID")
        myIndex=request.cookies.get("UpdateIndex")
        myDishName=request.cookies.get("UpdateDishName")
        myStatus=request.cookies.get("UpdateStatus")
        myPrice=request.cookies.get("UpdatePrice")
        myPicture=request.cookies.get("UpdatePictureAdd"+myIndex)
        
        myStr="update 菜单静态表 set 菜品名='"+myDishName+"',价格='"+myPrice+"',图片地址='"+ myPicture+"',供应状态='"+myStatus+"' where 菜品ID='"+myDishID+"';"
        cursor.execute(myStr)
        db.commit()

    return render_template(
        'index.html',
        title='Home Page',
        year=datetime.now().year,
        row=row,len=length,
        LeadFlag=True
    )

@app.route('/contact')
def contact():
    """Renders the contact page."""
    return render_template(
        'contact.html',
        title='Contact',
        year=datetime.now().year,
        message='Your contact page.'
    )

@app.route('/about')
def about():
    """Renders the about page."""
    return render_template(
        'about.html',
        title='About',
        year=datetime.now().year,
        message='Your application description page.'
    )

@app.route('/login')
def login():
    cursor.execute('select 用户名,密码,身份,用户ID,积分 from 用户')
    row=cursor.fetchall()
    return render_template(
        'login.html',
        MYUserMessage=row)

@app.route('/signin')
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
@app.route('/managementuser', methods=['GET', 'POST'])
def managementuser():
    """获取信息"""
    row,myDishSet=common()
    if(myDishSet!=''):
        myRow=()
        for myItem in myDishSet:
            cursor.execute("select * from view_dishes where 菜品ID='"+myItem[0]+"';")
            myRow+=tuple(cursor.fetchall())
        row=myRow
    length=len(row)
   
    return render_template(
        'index.html',
        title='菜品管理',
        year=datetime.now().year,
        row=row,len=length,
        LeadFlag=True
    )
