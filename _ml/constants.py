# (aa)-prefix : Admin of Admin (전체)
# (rm)-prefix : Region Manager (나라/언어)
# (cp)-prefix : Teacher (기관/학교/학원)
# (op)-prefix : Operator (기관/학교/학원)
# (tc)-prefix : Teacher (기관/학교/학원)
# Numeric Digit : Student (기관/학교/학원)
# postfix-(p) : Student Parent (기관/학교/학원)

ACCOUNT_TYPE_NONE = 0
ACCOUNT_TYPE_ADMIN = 1          # aa
ACCOUNT_TYPE_OPERATOR = 2       # op
ACCOUNT_TYPE_PRODUCER = 4       # cp

ACCOUNT_TYPE_TEACHER = 8        # tc
ACCOUNT_TYPE_STUDENT = 16       # NNNNNNNN (8 digit)
ACCOUNT_TYPE_OBSERVER = 32      # NNNNNNNNo (8 digit + o)
ACCOUNT_TYPE_PARENT = 32        # NNNNNNNNp (8 digit + p)

ACCOUNT_TYPE_USER = 64          # ?????

ACCOUNT_TYPE_MANAGER = 128      # rm 

DEFAULT_ACCOUNT_EMAIL_POSTFIX = "@megatest.kr"
# 선생님 id 의 prefix
TEACHER_ID_PREFIX = "mtt"
STUDENT_ACCOUNT_POSTFIX = "megatest.kr"
DEFAULT_GROUP_CODE = "megatest"

# 급조 : 이것은 나중에 사용하지 말자....
STUDENT_DEMO_CODE = '11000000'
