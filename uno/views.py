from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from .models import *
from django.urls import reverse

# Create your views here.

def game(request):
    return render(request, "uno/game.html")

def index(request):
    return HttpResponseRedirect(reverse('joinroom'))

def server(request, code):
    return JsonResponse({
        "error": "POST request required."
    })
    

def joinroom(request):
    if request.method != 'POST':
        return render(request, "uno/join.html")
    else:
        try:
            roomtojoin = Room.objects.get(name=request.POST["roomname"])
            Player.objects.create(name=request.POST["name"], room=roomtojoin)
            return render(request, "uno/index.html", {
                "name": request.POST["name"],
                "roomname": request.POST["roomname"]
            })
        except:
            return JsonResponse({
                "status": "RoomError"
            })

def create(request, name):
    if Room.objects.filter(name=name).count() < 1:
        Room.objects.create(name=name)
        return JsonResponse({
            "RESPONSE": "Success"
        })
    else:
        return JsonResponse({
            "RESPONSE": "Room Already Exists."
        })