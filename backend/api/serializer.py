from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'name',
            'description',
            'started_at',
            'ended_at',
            'status',
        ]