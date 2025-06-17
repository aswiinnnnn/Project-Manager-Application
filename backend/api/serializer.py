from rest_framework import serializers
from .models import Project, ProjectManager, Employees

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id',
            'name',
            'employees',
            'projectManager',
            'description',
            'started_at',
            'ended_at',
            'status',
        ]


class ProjectManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectManager
        fields = [
            'id',
            'name'
            
            ]
        
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employees
        fields = [
            'id',
            'name'
            
            ]