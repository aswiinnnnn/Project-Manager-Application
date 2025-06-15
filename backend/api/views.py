from django.shortcuts import render
from django.http import HttpResponse
from .models import Project
from rest_framework import viewsets, permissions
from .serializer import ProjectSerializer
from rest_framework.response import Response


# Create your views here.
def index(request):
    
    return HttpResponse('Hello')


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ProjectSerializer
    

    def list(self, request):
        queryset = self.queryset
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    


    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    


    def retrieve(self, request, pk=None):
        try:
            project = self.queryset.get(pk=pk)
            serializer = self.serializer_class(project)
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=404)
        


    def update(self, request, pk=None):
        try:
            project = self.queryset.get(pk=pk)
            
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=404)
        
        serializer = self.serializer_class(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    


    def destroy(self, request, pk=None):
        try:
            project = self.queryset.get(pk=pk)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=404)
        project.delete()
        return Response({'message': 'Project deleted successfully'}, status=204)
        


