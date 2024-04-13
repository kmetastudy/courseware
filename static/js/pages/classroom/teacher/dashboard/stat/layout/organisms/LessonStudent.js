const LessonStudent = ({ name, progress, correct }) => {
  // TODO
  // flex -> grid로 변경
  // 학생의 이름, progress의 길이에 따라 layout이 변경된다.
  return `
        <li class="flex justify-between items-center p-2 gap-4">
            <div class="flex items-center flex-1">
                <svg data-src="https://unpkg.com/heroicons/20/solid/user.svg" class="h-5 w-5"></svg>
                <p class="m-0 overflow-hidden text-ellipsis whitespace-nowrap">${name}</p>
            </div>
            <div class="">
                <div class="flex justify-between items-center shrink-0">
                    <p class="text-sm text-[#005140] m-0">학습률</p>
                    <p class="text-sm m-0">${progress}%</p>
                </div>
                <progress class="progress progress-success w-30" value="${progress}" min="0" max="100"></progress>
            </div>
            <div class="text-center">
                <p class="text-sm m-0">맞춘 문제 수</p>
                <p class="text-sm m-0">${correct}/20</p>
            </div>
            <button class="btn btn-sm">확인하기</button>
        </li>
    `;
};

export default LessonStudent;
