export const EmptyStudent = (isShow = false) => {
  return `
  <div class="hero p-2 ${isShow ? "flex" : "hidden"}" data-component="section-empty">
      <div class="hero-content flex-col lg:flex-row">
        <img src="/static/img/no-results.png" class="max-w-xs rounded-lg" />
        <div>
          <h1 class="text-4xl font-bold">학생이 없습니다!</h1>
          <p class="py-6 text-xl">클래스에 학생이 없습니다. 클래스에 학생을 초대해보세요!</p>
          <button class="btn btn-primary hidden">Get Started</button>
        </div>
      </div>
  </div>
    `;
};
