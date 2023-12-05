import sqlite3

conn = sqlite3.connect('../db.sqlite3')
# conn = sqlite3.connect('../db_courseware.sqlite3')

# cursor = conn.cursor()

# cursor.execute("SELECT * FROM _cm_coursedetail")

# result = cursor.fetchall()

# print(result)

#---------------------
# db_courseware에서 뽑아오기
# with conn:
#     f= open('../dump.sql', 'w', encoding='UTF-8')
#     for line in conn.iterdump():
#         #print(line)
#         f.write('%s\n' % line)
#     print('Dump Complete')

#---------------------
# db에 넣기
cursor = conn.cursor()
with conn:
    f= open('../dump.sql','r', encoding='UTF-8') 
    lines = f.readlines()
    for line in lines:
        cursor.execute(line)
    f.close()
conn.close()