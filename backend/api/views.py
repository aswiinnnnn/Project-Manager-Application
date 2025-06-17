from django.shortcuts import render
from .models import Project, ProjectManager, Employees
from rest_framework import viewsets, permissions
from .serializer import ProjectSerializer, ProjectManagerSerializer, EmployeeSerializer
from rest_framework.response import Response


# Create your views here.


#Views for project manager model CRUD operations
class ProjectManagerViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = ProjectManagerSerializer

    def get_queryset(self):
        return ProjectManager.objects.all()






#Views for project manager model CRUD operations
class EmployeesViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        return Employees.objects.all()





#Views for project model CRUD operations
class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.all()

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            project = self.get_queryset().get(pk=pk)
            serializer = self.serializer_class(project)
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=404)

    def update(self, request, pk=None):
        try:
            project = self.get_queryset().get(pk=pk)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=404)

        print("PUT data from frontend:", request.data)
        serializer = self.serializer_class(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        try:
            project = self.get_queryset().get(pk=pk)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=404)
        project.delete()
        return Response({'message': 'Project deleted successfully'}, status=204)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

        

    


