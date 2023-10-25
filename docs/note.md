과목(전체보기/수학/영어/정보)를 골라야되지 않나?

필터기능도 필요할거같다.
근데 검색을 제목으로 하는게 좋을까?
내 생각에는 특정 항목이 있으면 될거같기도 하다(학년, 과목, 등)
excel로 export하는게 의미가 있을까?
비슷한 코스 다운받고, url을 수정한다 정도..?
아니면 복사하기 정도..
이 때, unit의 id는 다 달라야될거같다..?

디자인
전반적인 layout 다시 잡아보자.
디자인도 다시 바꾸자. 특히, theme을 바꿀 수 있게 CSS 변수를 처리하자.

UI반응형으로 만들기.

deploy도 슬슬 해야됨..

중요도
excel export
비디오 time 저거 제대로 안되는거


1. excel기능 구현은 7/18까지 끝내자.


해당 영역을 클릭 or 이전 영역이 완료됨 -> 활성화(index 설정(0 || 1), 이름 변경(hour||minute||second))
keydown -> input event

1. 첫 번째? -> 조건 검색
만약 범위를 벗어나면 -> 09 식으로 value 변경 -> 다음 영역 활성화
범위를 안벗어나면 -> 09 변경 ->index만 1로 수정

2. 두번째 -> 조건 검색
벗어남 -> 0+value -> 다음 영역 활성화
안벗어남 -> 그대로 변경 -> 다음 영역 활성화

```js
const timeRule = {
    hour: {
        value: '00',
        rule: {
            0: function(el) {
                return (0<=el<=2)
            },
            1: function(el) {
                return parseInt(this.value[0])===2 ? (0<=el<=4) : (0<=el<=9)
            }
        }
    },
    minute: {
        value: '00',
        rule: {
            0: function(el) {
                return (0<=el<6)
            },
            1: function(el) {
                return (0<=el<=9)
            }
        },
    },
    second: {
        value: '00',
        rule: {
            0: function(el) {
                return (0<=el<6)
            },
            1: function(el) {
                return (0<=el<=9)
            }
        },
    },
}

```