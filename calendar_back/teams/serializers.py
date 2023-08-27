from rest_framework.serializers import ModelSerializer
from .models import Team
from users.serializers import UserInfoSerializer


class TeamSerializer(ModelSerializer):
    team_leader = UserInfoSerializer(read_only=True)
    members = UserInfoSerializer(read_only=True, many=True)

    class Meta:
        model = Team
        fields = "__all__"
