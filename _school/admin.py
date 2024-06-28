from django.contrib import admin

from _school.models import (
    SectionCategory,
    mSchool,
    mSchoolCourse,
    mSchoolSection,
    mSchoolNotice,
)

# Register your models here.


class mSchoolCourseInline(admin.StackedInline):
    model = mSchoolCourse
    extra = 1


class mSchoolSectionAdmin(admin.ModelAdmin):
    search_fields = ["id_school__title"]
    inlines = [mSchoolCourseInline]


class mSchoolNoticeInline(admin.StackedInline):
    model = mSchoolNotice
    extra = 1


class mSchoolAdmin(admin.ModelAdmin):
    inlines = [mSchoolNoticeInline]


admin.site.register(mSchool, mSchoolAdmin)
admin.site.register(mSchoolSection, mSchoolSectionAdmin)
admin.site.register(mSchoolCourse)
admin.site.register(SectionCategory)
