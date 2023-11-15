from django import forms
from django.core.validators import MaxValueValidator 

class PostForm(forms.Form):
    post= forms.CharField(widget=forms.Textarea(attrs={"rows":4, "cols":40, "null":True, "blank": True}))
    #commentform_flag = forms.BooleanField(widget=forms.HiddenInput, initial=True)