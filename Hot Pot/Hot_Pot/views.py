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

@app.route('/')
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

#########################################################
##以下为个人主页部分
#########################################################
def my_homepage_common(type):
    username=request.cookies.get("username")
    ID=request.cookies.get("ID")
    row=""
    print(username)
    print(ID)
    if(username!=None and ID!=None):
        if type=='borrow':
            cursor.execute("select 期刊名称,年,卷,期,借阅时间,归还时间 from 借阅 where 姓名='"+username+"'and 编号='"+ID+"';")
            row=cursor.fetchall()
        else:
            cursor.execute("select 姓名,编号,密码,角色,手机号,邮箱 from 用户 where 姓名='"+username+"'and 编号='"+ID+"';")
            row=cursor.fetchall()
    return row

@app.route('/my_homepage/person')
def my_homepage_person():
    change=request.cookies.get('change')
    if(change!=None):
        myStr=change.split(',')
        cursor.execute("update 用户 set 手机号='"+myStr[0]+"',邮箱='"+myStr[1]+"',密码='"+myStr[2]+"' where 编号='"+myStr[3]+"';")
        db.commit()
    row=my_homepage_common('personinfo')
    lenth=len(row)
    return render_template(
        'myhomepage.html',my_homepage_row=row,lenth=lenth,myflag='person')

@app.route('/my_homepage/borrow')
def my_homepage_borrow():
    row=my_homepage_common('borrow')
    lenth=len(row)
    print(row)
    return render_template(
        'myhomepage.html',my_homepage_row=row,lenth=lenth,myflag='borrow')

@app.route('/my_homepage/change')
def my_homepage_change():
    row=my_homepage_common('person')
    lenth=len(row)
    print(row)
    return render_template(
        'myhomepage.html',my_homepage_row=row,lenth=lenth,myflag='change')

@app.route('/restore')
def restore():
    myrestore=request.cookies.get("restore");
    myrestore=myrestore.split(',')
    ID=request.cookies.get("ID")
    mytime=time.strftime('%Y.%m.%d',time.localtime(time.time()))
    cursor.execute("update 借阅 set 归还时间='"+mytime+"'where 编号='"+ID+"' and 期刊名称='"+myrestore[0]+"' and 年='"+myrestore[1]+"' and 卷='"+myrestore[2]+"' and 期='"+myrestore[3]+"'and 借阅时间='"+myrestore[4]+"';")      
    cursor.execute("update 期刊 set 数量='1'where 期刊名称='"+myrestore[0]+"' and 年='"+myrestore[1]+"' and 卷='"+myrestore[2]+"' and 期='"+myrestore[3]+"';")
    db.commit()
    row=my_homepage_common('borrow')
    lenth=len(row)
    return render_template(
        'myhomepage.html',my_homepage_row=row,lenth=lenth,myflag='borrow')

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
        'into_sys.html',
        title='菜品管理',
        year=datetime.now().year,
        row=row,len=length,
        LeadFlag=True
    )
