from django.urls import path
from . import views

urlpatterns = [
    path("newcomment/", views.NewComment.as_view()),
    path("<int:comment_id>/", views.Comments.as_view()),
    path("all/<int:schedule_id>/", views.GetComments.as_view()),
]
