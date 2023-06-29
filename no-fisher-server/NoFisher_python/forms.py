from django import forms
from django.core.exceptions import ValidationError
from TestModel import *

class userdata(forms.Form):
    post_id = forms.CharField(min_length=4, label="id", error_messages={"min_length": "你太短了", "required": "该字段不能为空!"})
    post_title = forms.CharField(label="title")
    post_entity = forms.CharField(label="entity")
    user_id = forms.CharField(label="userid")
    user_value = forms.IntegerField(label = "uservalue")