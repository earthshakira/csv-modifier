from django.core.validators import MinValueValidator
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


class RowInputSerializer(serializers.Serializer):
    dbId = serializers.IntegerField(required=False)
    name = serializers.CharField(required=False)
    age = serializers.IntegerField(required=False, validators=[MinValueValidator(18)])
    sex = serializers.CharField(required=False)
    file = PrimaryKeyRelatedField(queryset=CSVFile.objects.all())

    def update(self, instance, validated_data):
        print(instance, validated_data)

    def create(self, validated_data):
        return validated_data


class BulkRowSerializer(serializers.Serializer):
    updates = RowInputSerializer(many=True)
    deletes = RowInputSerializer(many=True)

    def create(self, validated_data):
        updates = []
        creates = []
        for update in validated_data['updates']:
            if 'dbId' in update:
                updates.append(update)
            else:
                creates.append(update)
        return validated_data

    def update(self, instance, validated_data):
        print(instance, validated_data)
