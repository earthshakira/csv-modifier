from django.core.validators import MinValueValidator
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from csv_handler.models import CSVFile, CSVRow


def fetch_field_or_none(d, field):
    if field in d:
        return d[field]
    return None


class FileModelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CSVFile
        fields = ['id', 'name', 'created_at', 'updated_at']
        read_only_fields = ('created_at', 'updated_at')


class RowModelSerializer(serializers.HyperlinkedModelSerializer):
    file = PrimaryKeyRelatedField(queryset=CSVFile.objects.all())

    class Meta:
        model = CSVRow
        fields = ['id', 'name', 'age', 'sex', 'file', 'created_at', 'updated_at']
        read_only_fields = ('created_at', 'updated_at')


#
class RowInputSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(required=False, min_length=1, max_length=155)
    age = serializers.IntegerField(required=False, validators=[MinValueValidator(18)])
    sex = serializers.CharField(required=False, min_length=1, max_length=1)
    file = PrimaryKeyRelatedField(queryset=CSVFile.objects.all())

    def update(self, instance, validated_data):
        print(instance, validated_data)

    def create(self, validated_data):
        db_id = fetch_field_or_none(validated_data, 'dbId')
        file_ref = fetch_field_or_none(validated_data, 'fileRef')
        if db_id:
            validated_data['id'] = db_id
            del validated_data['dbId']
        if file_ref:
            validated_data['file'] = file_ref
            del validated_data['fileRef']
        return CSVRow(**validated_data)

    def save(self, **kwargs):
        raise NotImplementedError('Not Allowed')


class BulkRowSerializer(serializers.Serializer):
    updates = RowInputSerializer(many=True)
    deletes = RowInputSerializer(many=True)

    def save(self, **kwargs):
        updates = self.validated_data['updates']
        deletes = self.validated_data['deletes']
        rs = RowInputSerializer(None, None)
        writes = []
        for update in updates:
            writes.append(rs.create(update))
        db_objects = CSVRow.objects.bulk_create(writes)
        for update, db_object in zip(updates, db_objects):
            update['id'] = db_object.id
        return self.validated_data
