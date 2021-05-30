from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from .models import *
from django.urls import reverse

# Create your views here.

def game(request):
    return render(request, "uno/game.html")
def invite(request, roomcode):
    return render(request, "uno/game.html", {
        "roomcode": roomcode
    })
def index(request):
    return HttpResponseRedirect(reverse('joinroom'))

def dev(request):
    return render(request, "uno/dev.html")