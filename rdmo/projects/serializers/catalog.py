from rest_framework import serializers

from rdmo.questions.models import Catalog, Section, Subsection, QuestionSet, Question


class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        fields = (
            'id',
            'text'
        )


class QuestionSetSerializer(serializers.ModelSerializer):

    questions = QuestionSerializer(many=True, read_only=True)
    text = serializers.CharField(source='question.text', default=None)

    class Meta:
        model = QuestionSet
        fields = (
            'id',
            'text',
            'questions'
        )


class SubsectionSerializer(serializers.ModelSerializer):

    entities = serializers.SerializerMethodField()

    class Meta:
        model = Subsection
        fields = (
            'id',
            'title',
            'entities'
        )

    def get_entities(self, obj):
        questionsets = QuestionSet.objects.filter(subsection=obj).order_by('order')
        return QuestionSetSerializer(instance=questionsets, many=True).data


class SectionSerializer(serializers.ModelSerializer):

    subsections = SubsectionSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = (
            'id',
            'title',
            'subsections'
        )


class CatalogSerializer(serializers.ModelSerializer):

    sections = SectionSerializer(many=True, read_only=True)

    class Meta:
        model = Catalog
        fields = (
            'id',
            'title',
            'sections'
        )
