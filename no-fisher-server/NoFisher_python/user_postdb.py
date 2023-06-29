from django.http import HttpResponse
from django.shortcuts import render 
from NoFisher_python.reg import register_form
from TestModel.models import user,post
from django.views.decorators import csrf
from NoFisher_python.login import Login,logout
# from NoFisher_python.load_and_use import judge
from django.template import loader, Context
from NoFisher_python.forms import userdata
# 表单

# 接收请求数据
def querylist(request):
    request.encoding='utf-8'
    if 'LOGOUT' in request.POST:
        logout(request)

        return render(request,'login.html')
    else:
        if 'JUDGE' in request.POST:
            request.JUDGEMENT+=judge(request.JUDGEMENT)
            return render(request,'background.html')
