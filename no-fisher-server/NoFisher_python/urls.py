"""HelloWorld URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from django.contrib import admin

from . import reg,views,testdb,login,user_postdb

urlpatterns = [
    
#     path('test/', views.test),
# path('testdb/', testdb.testdb),
path('admin/', admin.site.urls),
path('register-form/', reg.register_form),
path('register/', reg.register),
path('login-form/', login.login_form),
path('login/', login.Login),
path('userdb/', user_postdb.querylist),
]