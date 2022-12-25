from core.models import CoreModel
from django.db import IntegrityError, models
from ninja.errors import HttpError

# Create your models here.


class ErDiagram(CoreModel):
    name = models.CharField(max_length=255)
    user = models.ForeignKey("users.CustomUser", on_delete=models.CASCADE, related_name="er_diagrams")

    class Meta:
        verbose_name = "ER Diagram"
        verbose_name_plural = "ER Diagrams"
        unique_together = ("name", "user")

    def __str__(self):
        return f"{self.name} - {self.user}"

    @classmethod
    def save_er_diagram(cls, raw_data, name, user):
        try:
            er_diagram = cls.objects.create(name=name, user=user, data=raw_data)
        except IntegrityError:
            raise HttpError(400, "ER Diagram with this name already exists")
        return er_diagram
