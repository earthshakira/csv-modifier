from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, generics

from csv_handler.models import CSVFile, CSVRow
from csv_handler.serializers import FileModelSerializer, RowModelSerializer


class FileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Files to be viewed or edited.
    """
    queryset = CSVFile.objects.all().order_by('updated_at')
    serializer_class = FileModelSerializer
    permission_classes = [permissions.AllowAny]


class RowViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Rows to be viewed or edited.
    """
    queryset = CSVRow.objects.all().order_by('id')
    serializer_class = RowModelSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['file', 'name', 'age', 'sex']
