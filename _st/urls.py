from django.urls import path
from . import views

app_name = '_st'

urlpatterns = [
    path('', views.study_view, name='study'),
    # path('',views.StudyView.as_view(),name='study'),
    path('getstudentinfo/', views.getstudentinfo, name='getstudentinfo'),

    # student_code -> assigned_course
    path('getassignedcourse/', views.getassignedcourse, name='getassignedcourse'),
    # Demo Ready (위의 API 는 안씀)
    path('getassignedcourseinfo/', views.getassignedcourseinfo,
         name='getassignedcourseinfo'),

    # assigned_course & period(fromdate ~ todate) -> content_list
    path('getassignedcontent/', views.getassignedcontent,
         name='getassignedcontent'),
    path('getassignedcontentnew/', views.getassignedcontentnew,
         name='getassignedcontentnew'),

    # Demo Ready
    path('getcoursecontent/', views.getcoursecontent,
         name='getcoursecontent'),  # Demo
    # Demo Ready
    path('getcoursecontentinfo/', views.getcoursecontentinfo,
         name='getcoursecontentinfo'),  # Demo

    # path('getassignedcontentwithreassign/',views.getassignedcontentwithreassign,name='getassignedcontentwithreassign'),

    path('getassignedcontentdetail/', views.getassignedcontentdetail,
         name='getassignedcontentdetail'),
    path('getassignedcliniccontentdetail/', views.getassignedcliniccontentdetail,
         name='getassignedcliniccontentdetail'),
    path('getassignedexamcontentdetail/', views.getassignedexamcontentdetail,
         name='getassignedexamcontentdetail'),

    # result
    # Demo Ready
    path('updatestudyresultinfo/', views.updatestudyresultinfo,
         name='updatestudyresultinfo'),

    # testum result
    path('updatetestumresult/', views.updatetestumresult,
         name='updatetestumresult'),
    # Demo Ready
    path('updatetestumresultinfo/', views.updatetestumresultinfo,
         name='updatetestumresultinfo'),
    # lesson result
    path('updatelessonresult/', views.updatelessonresult,
         name='updatelessonresult'),
    # Demo Ready
    path('updatelessonresultinfo/', views.updatelessonresultinfo,
         name='updatelessonresultinfo'),
    # exam result
    path('updateexamresult/', views.updateexamresult, name='updateexamresult'),

    # stat
    path('getcoursestat/', views.getcoursestat, name='getcoursestat'),

    # New
    # Demo Ready
    path('getvideoinfo/', views.getvideoinfo, name='getvideoinfo'),
    # Demo Ready
    path('getquestioninfo/', views.getquestioninfo, name='getquestioninfo'),
    # Demo Ready
    path('getlessoninfo/', views.getlessoninfo, name='getlessoninfo'),
    # Demo Ready
    path('gettestuminfo/', views.gettestuminfo, name='gettestuminfo'),
    # Demo Ready
    path('getcontentinfo/', views.getcontentinfo, name='getcontentinfo'),

]
