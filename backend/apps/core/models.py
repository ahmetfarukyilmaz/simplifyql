from django.db import models

# Create your models here.


class CoreModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    data = models.JSONField(default=dict, blank=True, null=True)

    class Meta:
        abstract = True
