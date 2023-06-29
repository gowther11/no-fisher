from django.http import HttpResponse
from django.shortcuts import render
from NoFisher_python.reg import register_form
from TestModel.models import user
from django.views.decorators import csrf
# 表单
def login_form(request):
    ctx = {}
    if request.session['login']:
        ctx['session'] =  request.session['login']
        return render(request, 'userpage.html', ctx)
    else:
        return render(request, 'login.html')

def login(request, user):
    request.session['login'] = user.id

def logout(request):
    request.session['login'] = ""
# 接收请求数据
def Login(request):  
    request.encoding='utf-8'
    ctx = {}
    if 'LOGIN' in request.POST:                                                      #验证为登录按键
        if 'ID' in request.POST and request.POST['ID'] :
            usert = user.objects.filter(id=request.POST['ID'])
            if  usert :
                temp_user = user.objects.get(id=request.POST['ID'])
                if 'Password' in request.POST and request.POST['Password']:
                    if temp_user.password == request.POST['Password']:
                        login(request, temp_user) 
                        session_content = request.session['login'] 
                        ctx['session'] = session_content                                  #session保持登录
                        return render(request, 'userpage.html', ctx)
                        
                    else :
                        ctx['rlt_pass'] = "密码错误"
                        return render(request, 'login.html', ctx)
                else:
                    ctx['rlt_pass'] = "未输入密码"
                    return render(request, 'login.html', ctx)
            else:
                ctx['rlt_id'] = "用户名不存在"
                return render(request, 'login.html', ctx)
        else:
            ctx['rlt_id'] = "未输入用户名"
            return render(request, 'login.html', ctx)
    else: 
        return render(request, 'register_form.html')