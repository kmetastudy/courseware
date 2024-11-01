## 검색 알고리즘

### 1. TRIE

### 2. KMP

이 알고리즘은 문자열에서 특정 패턴을 효율적으로 찾는 데 사용됩니다.

KMP 알고리즘은 실패 함수(failure function)를 사용하여 불일치가 발생했을 때 얼마나 멀리 건너뛸 수 있는지 계산합니다.

이를 통해 검색 시간을 단축시키며, 반복적인 정보를 재검색하지 않습니다.

### 3. Boyer-Moore

이 알고리즘은 KMP보다 더 빠른 문자열 검색을 제공합니다.

패턴의 끝에서 시작하여 문자열을 역순으로 검색합니다.

불일치가 발생하면, 패턴 내에서 불일치한 문자가 나타난 마지막 위치에 따라 이동합니다.

### 4. Rabin-Karp

이 알고리즘은 문자열의 해시값을 이용하여 패턴을 검색합니다.

문자열의 각 부분에 대한 해시값을 계산하고, 이를 패턴의 해시값과 비교합니다.

해시 충돌의 가능성이 있기 때문에, 해시값이 일치할 경우 문자열을 직접 비교하여 확인합니다.

### 5. Suffix Array

접미사 배열은 문자열의 모든 접미사를 사전 순으로 정렬한 배열입니다.

이 배열을 사용하면 주어진 문자열 내에서 어떤 부분 문자열을 빠르게 찾을 수 있습니다.

접미사 배열은 메모리를 많이 사용하지만, 검색 속도가 매우 빠릅니다.

### 6. Suffix Tree

접미사 트리는 접미사 배열보다 메모리 효율적인 방법으로 문자열의 모든 접미사를 저장합니다.

각 접미사는 트리의 노드를 따라 문자열의 끝까지 이어집니다.

접미사 트리는 문자열 검색, 최장 공통 부분 문자열 찾기 등 다양한 문자열 관련 문제에 효과적입니다.
