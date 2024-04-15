export const EmptyCard = ({
  title = "컨텐츠가 없습니다.",
  content = "",
  src = "/static/img/no-results.png",
  isShow = false,
  dataComponent = "empty-card",
} = {}) => {
  return `
  <div class="hero p-2 ${isShow ? "flex" : "hidden"}" data-component=${dataComponent}>
      <div class="hero-content flex-col lg:flex-row">
        <img src=${src} class="max-w-xs rounded-lg" />
        <div>
          <h1 class="text-4xl font-bold">${title}</h1>
          <p class="py-6 text-xl">${content}</p>
          <button class="btn btn-primary hidden">Get Started</button>
        </div>
      </div>
  </div>
    `;
};
