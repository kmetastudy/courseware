import django_filters
from .models import mClassContentAssign


class ClassContentAssignFilter(django_filters.FilterSet):

    class Meta:
        model = mClassContentAssign
