from django.db import models

# Create your models here.
class Project(models.Model):
    NOT_STARTED = 0
    STARTED = 1
    COMPLETED = 2
    OPTED_OUT = 3
    STATUS_CHOICES = (
        (NOT_STARTED, 'NOT_STARTED'),
        (STARTED, 'STARTED'),
        (COMPLETED,'COMPLETED'),
        (OPTED_OUT,'OPTED_OUT')
    )


    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    started_at = models.DateField()
    ended_at = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=NOT_STARTED)

    def __str__(self):
        return self.name