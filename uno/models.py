from django.db import models

# Create your models here.
class Room(models.Model):
    name = models.CharField(max_length=12)
    interval = models.CharField(max_length=2, default=1)
    status = models.CharField(max_length=32, default="waiting")

    def __str__(self):
        return f"{self.name}"

class Player(models.Model):
    name = models.CharField(max_length=12)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="room")

    def __str__(self):
        return f"{self.name} ({self.room})"

