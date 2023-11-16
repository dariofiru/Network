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
    
    
