from rest_framework import serializers

from csv_handler.models import CSVFile, CSVRow


class FileModelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CSVFile
        fields = ['name']
        read_only_fields = ('created_at', 'updated_at')


class RowModelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CSVRow
        fields = ['name', 'age', 'sex']
        read_only_fields = ('created_at', 'updated_at')
