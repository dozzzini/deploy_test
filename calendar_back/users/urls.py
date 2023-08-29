from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from . import views

urlpatterns = [
    path("signup/", views.Signup.as_view()),
    path("login/", TokenObtainPairView.as_view()),
    path("logout/", views.Logout.as_view()),
    path("idcheck/", views.CheckUsername.as_view()),
    # path("myinfo/<str:username>/", views.UserInfo.as_view()),
    path("myinfo/", views.UserInfo.as_view()),
]
