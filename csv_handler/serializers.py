import random

from django.core.validators import MinValueValidator
from django.db import transaction
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from csv_handler.models import CSVFile, CSVRow


def fetch_field_or_none(d, field):
    if field in d:
        return d[field]
    return None


def perform_bulk_updates(updates):
    field_updates = {
        "name": [],
        "age": [],
        "sex": []
    }

    update_results = {
        "name": [],
        "age": [],
        "sex": []
    }

    for update in updates:
        if update.name:
            field_updates['name'].append(update)
        if update.age:
            field_updates['age'].append(update)
        if update.sex:
            field_updates['sex'].append(update)

    for key in update_results.keys():
        update_results[key] = CSVRow.objects.bulk_update(
            field_updates[key], [key])
    return update_results


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


class RowInputSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(required=False, min_length=1, max_length=155)
    age = serializers.IntegerField(required=False, validators=[MinValueValidator(18)])
    sex = serializers.CharField(required=False, min_length=1, max_length=1)
    file = PrimaryKeyRelatedField(queryset=CSVFile.objects.all())

    def create(self, validated_data):
        if 'id' in validated_data:
            validated_data['pk'] = validated_data['id']
        return CSVRow(**validated_data)


class BulkRowSerializer(serializers.Serializer):
    updates = RowInputSerializer(many=True)
    deletes = RowInputSerializer(many=True)

    def create(self, validated_data):
        return validated_data

    def save(self, **kwargs):
        updates = self.validated_data['updates']
        deletes = self.validated_data['deletes']

        rs = RowInputSerializer(None, None)
        db_updates = []
        db_creates = []
        create_indices = []
        for index, update in enumerate(updates):
            if 'id' in update:
                db_updates.append(rs.create(update))
            else:
                db_creates.append(rs.create(update))
                create_indices.append(index)

        db_deletes = []
        delete_id = random.getrandbits(60)
        for deleteItem in deletes:
            db_object = rs.create(deleteItem)
            db_object.deletion_id = delete_id
            db_deletes.append(db_object)

        with transaction.atomic():
            db_created = CSVRow.objects.bulk_create(db_creates)
            perform_bulk_updates(db_updates)

            if len(db_deletes):
                CSVRow.objects.bulk_update(db_deletes, ['deletion_id'])
                CSVRow.objects.filter(deletion_id=delete_id).delete()

        for index, db_object in zip(create_indices, db_created):
            updates[index]['id'] = db_object.id
        return self.validated_data
