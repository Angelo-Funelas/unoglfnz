from django.urls import path
from . import views
urlpatterns = [
    path("", views.game, name="game"),
    path("dev", views.dev, name="development"),
    path("<str:roomcode>", views.invite, name="invite")
]
