import sqlite3

# conn = sqlite3.connect('../db.sqlite3')
# conn = sqlite3.connect('../db_courseware.sqlite3')
conn = sqlite3.connect('../db_old.sqlite3')

#---------
#테스트
cursor = conn.cursor()

cursor.execute("SELECT * FROM __cp_mCourseN")

result = cursor.fetchall()

print(result)

#---------------------
# db_courseware에서 뽑아오기
# with conn:
#     f= open('../dump_old.sql', 'w', encoding='UTF-8')
#     for line in conn.iterdump():
#         #print(line)
#         f.write('%s\n' % line)
#     print('Dump Complete')

#---------------------
# db에 넣기
# cursor = conn.cursor()
# with conn:
#     f= open('../dump_old.sql','r', encoding='UTF-8') 
#     lines = f.readlines()
#     for line in lines:
#         cursor.execute(line)
#     f.close()
# conn.close()