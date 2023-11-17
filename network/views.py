import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import JsonResponse
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.urls import reverse
from  .form import PostForm

from .models import User, Post, Like


def index(request):
    #form =  PostForm()
    #return render(request, "network/index.html", {
     #           "PostForm": form
      #      })
    if request.method == "POST":
        # create a form instance and populate it with data from the request:
            form = PostForm(request.POST)
        # check whether it's valid:
            if form.is_valid():
                prod = Post(user_post=request.user,post=form.cleaned_data['post'] 
                               )
                prod.save()
            form = PostForm()
            #return render(request, "network/index.html", {
             #   "PostForm": form, "check":"yes"
            #})
            return HttpResponseRedirect("/")
    else:
            form = PostForm()
            return render(request, "network/index.html", {
                "PostForm": form
            })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
    
@login_required
def posts(request):
    #posts = Post.objects.filter(user_post=request.user)
    posts = Post.objects.all()
    posts = posts.order_by("-timestamp").all()
    #return HttpResponse(f"hello {posts}")
    return JsonResponse([post.serialize() for post in posts], safe=False)

@login_required
def likes(request):
    likes = Like.objects.filter(user_like=request.user)
    #posts = Post.objects.all()
    #posts = posts.order_by("-timestamp").all()
    #return HttpResponse(f"hello {posts}")
    return JsonResponse([like.serialize() for like in likes], safe=False)

def add_post(request):
        if request.method == "POST":
        # create a form instance and populate it with data from the request:
            form = PostForm(request.POST)
        # check whether it's valid:
            if form.is_valid():
                prod = Post(user_post=request.user,post=form.cleaned_data['post'] 
                               )
                prod.save()
            form = PostForm()
            return render(request, "network/index.html", {
                "PostForm": form
            })
        
def add_like(request, id):
    if request.method == "PUT":
        post = None 
        try:
            post = Post.objects.filter(id=id).get()
        except Post.DoesNotExist:
            HttpResponse("error")
        
        postU = Post.objects.filter(id=id).update(tot_likes=post.tot_likes+1)
        like = Like(user_like=request.user, post_like=post)
        like.save()
        form = PostForm()
        return render(request, "network/index.html", {
                "PostForm": form
            })    
    
def remove_like(request, id):
    if request.method == "PUT":
        try:
            post = Post.objects.filter(id=id).get()
        except Post.DoesNotExist:
            HttpResponse("error")
        try:
            like = Like.objects.filter(user_like=request.user, post_like=post).delete()
        except Post.DoesNotExist:
            HttpResponse("error")

        post = Post.objects.filter(id=id).update(tot_likes=post.tot_likes-1)
        
        #post.save()
        form = PostForm()
        return render(request, "network/index.html", {
                "PostForm": form
            })    

@login_required
def get_user(request, id):
    userT = None
    try:
        userT = User.objects.filter(id=id)
    except Post.DoesNotExist:
        HttpResponse("error")
    #posts = Post.objects.filter(user_post=request.user)
    #userT = User.objects.all()
     
    return JsonResponse([user.serialize() for user in userT], safe=False)

def update_post(request, id):
    data = json.loads(request.body)
    new_post = data.get("post", "")

    try:
        post = Post.objects.filter(id=id).update(post=new_post)
    except Post.DoesNotExist:
        HttpResponse("error")

    return HttpResponseRedirect("/")
        
            