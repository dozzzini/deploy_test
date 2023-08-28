from django.urls import path
from . import views

urlpatterns = [
    path("", views.NewTeam.as_view()),
    path("<int:team_id>/", views.Teams.as_view()),
    path("members/<int:team_id>/", views.AddMembers.as_view()),
]
