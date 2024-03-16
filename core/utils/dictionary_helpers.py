def extract(data_dict, *keys):
    """
    주어진 딕셔너리에서 특정 키들에 해당하는 값을 추출하여 새로운 딕셔너리로 반환합니다.

    :param data_dict: 데이터가 담긴 딕셔너리
    :param keys: 추출할 키들
    :return: 추출된 데이터를 포함하는 새로운 딕셔너리
    """
    return {key: data_dict.get(key, None) for key in keys}
