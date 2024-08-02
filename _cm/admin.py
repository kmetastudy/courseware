from django.contrib import admin
from .models import courseDetail, courseLanding, Notice, FAQCategory, FAQ, Post, Banner

# Register your models here.
admin.site.register(courseDetail)
admin.site.register(courseLanding)
admin.site.register(Notice)
admin.site.register(FAQCategory)
admin.site.register(FAQ)
admin.site.register(Post)
admin.site.register(Banner)
