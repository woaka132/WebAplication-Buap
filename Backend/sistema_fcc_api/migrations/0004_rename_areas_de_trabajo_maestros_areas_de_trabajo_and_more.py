# Generated by Django 5.0.2 on 2024-03-05 00:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sistema_fcc_api', '0003_alumnos_fecha_nacimineto_maestros'),
    ]

    operations = [
        migrations.RenameField(
            model_name='maestros',
            old_name='Areas_de_Trabajo',
            new_name='areas_de_trabajo',
        ),
        migrations.RenameField(
            model_name='maestros',
            old_name='Materias',
            new_name='materias',
        ),
    ]
