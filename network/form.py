from django import forms
from django.core.validators import MaxValueValidator 

class PostForm(forms.Form):
    post= forms.CharField(widget=forms.Textarea(attrs={"rows":4,  "null":True, "blank": True, 'class': 'textarea-class'}))
    #commentform_flag = forms.BooleanField(widget=forms.HiddenInput, initial=True)