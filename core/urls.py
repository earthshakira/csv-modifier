"""core URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.shortcuts import render
from django.urls import path, include, re_path
from rest_framework import routers

import csv_handler.views

router = routers.DefaultRouter()
router.register(r'rows', csv_handler.views.RowViewSet)
router.register(r'files', csv_handler.views.FileViewSet)


def render_react(request):
    return render(request, "index.html")


def add_extrafiles():
    files = ['asset-manifest.json', 'favicon.ico', 'manifest.json', 'robots.txt']
    routes = []
    for file in files:
        def fn(request, filename=file):
            return render(request, filename)

        routes.append(path(file, fn))
    return routes


urlpatterns = [
                  path('api/bulk', csv_handler.views.RowsListUpdate.as_view()),
                  path('api/', include(router.urls)),
                  path('admin/', admin.site.urls),
              ] + add_extrafiles() + [
                  re_path(r"^$", render_react),
                  re_path(r"^(?:.*)/?$", render_react),
              ]
