from django.shortcuts import render
from django.db.models import *
from django.db import transaction
from sistema_fcc_api.serializers import *
from sistema_fcc_api.models import *
from rest_framework.authentication import BasicAuthentication, SessionAuthentication, TokenAuthentication
from rest_framework.generics import CreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework import permissions
from rest_framework import generics
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from django.core import serializers
from django.utils.html import strip_tags
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from datetime import datetime
from django.conf import settings
from django.template.loader import render_to_string
import string
import random
import json

class MateriaAll(generics.CreateAPIView):
    #Esta linea se usa para pedir el token de autenticación de inicio de sesión
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        materia = Materia.objects
        lista = MateriaSerializer(materia, many=True).data
        return Response(lista, 200)
    
class MateriaView(generics.CreateAPIView):
    #Obtener usuario por ID
    # permission_classes = (permissions.IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        materia = get_object_or_404(Materia, id = request.GET.get("id"))
        materia = MateriaSerializer(materia, many=False).data
        materia["dias_json"] = json.loads(materia["dias_json"])
        return Response(materia, 200)
    
    #Registrar nuevo usuario
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        request.data["dias_json"] = json.dumps(request.data["dias_json"])
        materia = MateriaSerializer(data=request.data)
        if materia.is_valid():
            #Create a profile for the user
            materia = Materia.objects.create(
                                            nrc= request.data["nrc"],
                                            nombre_de_la_materia = request.data["nombre_de_la_materia"],
                                            seccion= request.data["seccion"],
                                            horario_inicio	= request.data["horario_inicio"],
                                            horario_finalizacion= request.data["horario_finalizacion"],
                                            salon= request.data["salon"],
                                            programa_educativo= request.data["programa_educativo"],
                                            dias_json = request.data["dias_json"])
            materia.save()

            return Response({"Materia_created_id": materia.id }, 201)

        return Response(materia.errors, status=status.HTTP_400_BAD_REQUEST)
    
#Se tiene que modificar la parte de edicion y eliminar
class MateriaViewEdit(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    def put(self, request, *args, **kwargs):
        # iduser=request.data["id"]
        request.data["dias_json"] = json.dumps(request.data["dias_json"])
        materia = get_object_or_404(Materia, id=request.data["id"])
        materia.nrc = request.data["nrc"]
        materia.nombre_de_la_materia = request.data["nombre_de_la_materia"],
        materia.seccion= request.data["seccion"],
        materia.horario_inicio	= request.data["horario_inicio"],
        materia.horario_finalizacion= request.data["horario_finalizacion"],
        materia.salon= request.data["salon"],
        materia.programa_educativo= request.data["programa_educativo"],
        materia.dias_json = request.data["dias_json"]

        materia.save()
        user = MateriaSerializer(materia, many=False).data

        return Response(user,200)
    
    def delete(self, request, *args, **kwargs):
        materia = get_object_or_404(Materia, id=request.GET.get("id"))
        try:
            materia.delete()
            return Response({"details":"Materia eliminado"},200)
        except Exception as e:
            return Response({"details":"Algo pasó al eliminar"},400)