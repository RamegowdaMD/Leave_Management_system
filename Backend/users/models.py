from django.db import models
from django.contrib.auth.hashers import make_password


class User(models.Model):
    username = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    role = models.CharField(max_length=20, choices=[('employee', 'Employee'), ('admin', 'Admin')], default='employee')
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.email

