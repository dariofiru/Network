
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("posts", views.posts, name="posts"),
    path("likes", views.likes, name="likes"),
    path("get_user/<str:id>", views.get_user, name="get_user"),
    path("add_like/<str:id>", views.add_like, name="add_like"),
    path("remove_like/<str:id>", views.remove_like, name="remove_like"),
    path("add_post", views.add_post, name="add_post"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
