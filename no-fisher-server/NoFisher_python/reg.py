from django.http import HttpResponse
from django.shortcuts import render
from TestModel.models import user
from django.views.decorators import csrf
# 表单
def register_form(request):
    return render(request, 'register_form.html')
 
# 接收请求数据
def register(request):  
    request.encoding='utf-8'
    ctx = {}
    if 'ID' in request.POST and request.POST['ID'] :
        usert = user.objects.filter(id=request.POST['ID'])
        if  usert :
            ctx['rlt_id'] = "用户名已存在"
            return render(request, 'register_form.html', ctx)
        else :
            if 'Password' in request.POST and request.POST['Password']:
                user1 = user(id = request.POST['ID'], password = request.POST['Password'])
                user1.save()
                
                ctx['rlt_id'] = "注册成功,请登录"
                
                return render(request, 'login.html', ctx)
            else :
                ctx['rlt_pass'] = "密码为空"
                return render(request, 'register_form.html', ctx)
    else : 
        ctx['rlt_id'] = "用户名为空"
        return render(request, 'register_form.html', ctx)
    