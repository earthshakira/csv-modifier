from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from csv_handler.models import CSVFile, CSVRow


class FileModelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CSVFile
        fields = ['name', 'created_at', 'updated_at']
        read_only_fields = ('created_at', 'updated_at')


class RowModelSerializer(serializers.HyperlinkedModelSerializer):
    file = PrimaryKeyRelatedField(queryset=CSVFile.objects.all())

    class Meta:
        model = CSVRow
        fields = ['id', 'name', 'age', 'sex', 'file', 'created_at', 'updated_at']
        read_only_fields = ('created_at', 'updated_at')
