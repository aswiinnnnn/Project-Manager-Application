from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'projectsmanager', ProjectManagerViewSet, basename='projectmanager')
router.register(r'employees', EmployeesViewSet, basename='employees')

urlpatterns = router.urls

