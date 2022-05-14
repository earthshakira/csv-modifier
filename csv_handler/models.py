from django.core.validators import MinValueValidator
from django.db import models

SEX_CHOICES = (
    ("m", "m"),
    ("f", "f"),
)


class Base(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class CSVFile(Base):
    name = models.CharField(max_length=155, unique=True)

    def __str__(self):
        return f'{self.name}'


class CSVRow(Base):
    name = models.CharField(max_length=155)
    age = models.IntegerField(validators=[MinValueValidator(18)])
    sex = models.CharField(choices=SEX_CHOICES, max_length=1)
    file = models.ForeignKey(to=CSVFile, on_delete=models.CASCADE)

    def __str__(self):
        return f'[{self.id}] {self.name} ({self.age}) ({self.sex})'
