from django.urls import path
from . import views

urlpatterns = [
    path('', views.amc, name='home'),                  # root -> amc.html
    path('amc/', views.amc, name='amc'),               # /amc/ also works
    path('api/chat/', views.chatbot_api, name='chat_api'),  # POST API
    
]
