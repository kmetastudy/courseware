import json
import os
import pandas as pd


# print(os.getcwd())
# with open('data.json', 'r', encoding='utf-8') as file:
#     data = json.load(file)


# 1. remove _st data
#

# 2. field명/model명 수정


# 3. mCourse 수정
# 기존 mCourse의 json_data에서, lists와 contents를 합쳐서, 새로운 contents라는 값으로 변경.
# 또한, unit개념이 없기에, element 값들을 flatten한다.
def compose_new_contents(prev_json_data):
    new_contents = []
    try:

        for content in prev_json_data["contents"]:
            # units 키가 있는지 확인하고, 그 안의 데이터를 합칩니다.
            if "units" in content and content["units"]:
                combined_ids = []
                combined_types = []
                for unit in content["units"]:
                    combined_ids.extend(unit["ids"])
                    combined_types.extend(unit["types"])

                new_contents.append(
                    {"elements": {"ids": combined_ids, "types": combined_types}})
            else:
                # 'units' 키가 없거나 비어있는 경우, 빈 'elements'를 추가합니다.
                new_contents.append({"elements": {}})

        return new_contents
    except:
        # print(prev_json_data)
        return []


def transform_json_data(fields):
    new_json_data = {}
    data = json.loads(fields['json_data'])
    new_json_data['kls'] = data['kls']
    new_json_data['contents'] = compose_new_contents(data)
    print(new_json_data['contents'])
    # print("done")
    fields['json_data'] = json.dumps(new_json_data)
    return fields

# print(df[df['model'] == '_cp.mcourse'].iloc[0]['fields']['type'])
# print(df[df['model']])


df = pd.read_json('data.json')
course_df = df[df['model'] == '_cp.mcourse']

# type = 2
courses = course_df[course_df['fields'].apply(lambda x: x['type'] == 2)]
# print((t['fields']['json_data']))

# for course in courses:
#     prev_json_data = course['fields']['json_data']
#     print(type(course['fields']))
#     json_data = {
#         'contents': compose_new_contents(prev_json_data),
#         'kl': None,
#     }
# print(courses['fields']['json_data'])
df_copy = courses.copy()
df_copy['fields'] = df_copy['fields'].apply(transform_json_data)

# print(df_copy.iloc[0]['fields']['json_data'])
