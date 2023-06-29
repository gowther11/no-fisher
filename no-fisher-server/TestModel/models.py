from django.db import models
from django.db.models.fields.related import ForeignKey


 
class user(models.Model):
    id = models.CharField(max_length=16, primary_key=True)
    password = models.CharField(max_length=16)

class post(models.Model):
    post_id = models.CharField(max_length=100,primary_key=True)
    post_title = models.CharField(max_length=100)
    post_entity = models.CharField(max_length=100)
    user_id = models.ForeignKey(user, to_field="id", on_delete=models.CASCADE)
    user_value = models.IntegerField()
