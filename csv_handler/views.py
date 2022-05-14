from rest_framework import viewsets, permissions

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
    queryset = CSVRow.objects.all()
    serializer_class = RowModelSerializer
    permission_classes = [permissions.AllowAny]
