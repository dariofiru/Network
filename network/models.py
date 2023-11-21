from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

    def serialize(self):
        return {
            "username": self.username 
        }

class Post(models.Model):
    user_post = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")
    timestamp = models.DateTimeField(auto_now_add=True)
    post = models.TextField(blank=False)
    tot_likes = models.PositiveIntegerField(default=0)
    #User.get_full_name()
    def __str__(self) -> str:
        return f"{self.user_post} => {self.post}"
    
    def serialize(self):
        return {
            "id": self.id,
            "user_post": self.user_post.id,
            "userN": self.user_post.username,
            "tot_likes": self.tot_likes,
            "post": self.post,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p") 
        }
    
    
class Like(models.Model):
    user_like = models.ForeignKey("User", on_delete=models.CASCADE, related_name="likes")
    post_like = models.ForeignKey("Post", on_delete=models.CASCADE, related_name="posts")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.user_like} Likes: {self.post_like}"
    
    def serialize(self):
        return {
            "id": self.id,
            "user_like": self.user_like.id,
            "post_like": self.post_like.id,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p") 
        }

class Follower(models.Model):
    user_followed = models.ForeignKey("User", on_delete=models.CASCADE, related_name="followed")
    user_follower = models.ForeignKey("User", on_delete=models.CASCADE, related_name="follower")
   # timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.user_follower} Follows: {self.user_followed} "
    
    def serialize(self):
        return {
            "id": self.id,
            "user_followed": self.user_followed.id,
            "user_follower": self.user_follower.id
           # "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p") 
        }   

class Profile(models.Model):
    user_profile = models.ForeignKey("User", on_delete=models.CASCADE, related_name="profile")
    timestamp = models.DateTimeField(auto_now_add=True)
    picture = models.TextField(blank=True, max_length=800, default="https://th.bing.com/th/id/OIP.U6GEahoDCyMwPQIHCGiSlAHaHa?rs=1&pid=ImgDetMain")
    followers = models.PositiveIntegerField(default=0)
    followed = models.PositiveIntegerField(default=0)

    def serialize(self):
        return {
            "id": self.id,
            "user_profile": self.user_profile.id,
            "profile_name": self.user_profile.username,
            "picture" : self.picture,
            "followers": self.followers,
            "followed": self.followed,
            "creation_date": self.timestamp.strftime("%b %d %Y, %I:%M %p") 
        }   
    def __str__(self) -> str:
        return f"{self.user_profile}"
    
