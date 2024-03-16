def extract_values(obj, *attributes):
    """
    주어진 객체에서 특정 속성들만 추출하여 딕셔너리로 반환합니다.

    :param obj: 속성을 추출할 객체
    :param attributes: 추출할 속성 이름들
    :return: 추출된 속성들을 포함하는 딕셔너리
    """
    return {attr: getattr(obj, attr, None) for attr in attributes}
