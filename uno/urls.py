from django.urls import path
from . import views
urlpatterns = [
    path("", views.index, name="index"),
    path("server", views.server, name="server"),
    path("joinroom", views.joinroom, name="joinroom"),
    path("create/<str:name>", views.create, name="create"),
    path("game", views.game, name="game")
]
