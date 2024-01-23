from django.db.models import Q

from rest_framework.filters import BaseFilterBackend

from django_filters import CharFilter, FilterSet

from .models import Project


class ProjectFilter(FilterSet):
    title = CharFilter(field_name='title', lookup_expr='icontains')

    class Meta:
        model = Project
        fields = ('title', 'catalog')


class ProjectSearchFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

        search = request.GET.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | (
                    Q(memberships__role='owner') & (
                        Q(memberships__user__username__icontains=search) |
                        Q(memberships__user__first_name__icontains=search) |
                        Q(memberships__user__last_name__icontains=search) |
                        Q(memberships__user__email__icontains=search)
                    )
                )
            )

        return queryset


class SnapshotFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

        snapshot = request.GET.get('snapshot')
        if snapshot:
            try:
                snapshot_pk = int(snapshot)
            except (ValueError, TypeError):
                snapshot_pk = None

            queryset = queryset.filter(snapshot__pk=snapshot_pk)
        else:
            queryset = queryset.filter(snapshot=None)

        return queryset


class ValueFilterBackend(BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if view.detail:
            return queryset

        attributes = [int(attribute) for attribute in request.GET.getlist('attribute') if attribute.isdigit()]
        if attributes:
            queryset = queryset.filter(attribute__in=attributes)

        return queryset
