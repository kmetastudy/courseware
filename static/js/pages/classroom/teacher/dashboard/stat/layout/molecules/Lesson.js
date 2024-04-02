const Lesson = (props) => {
  return `
        <div class="font-bold">
            <p><span class="px-2 text-xl">${props[0].period}차시</span> ${dayjs
              .utc(props[0].date)
              .local()
              .format("YYYY-MM-DD")}</p>
        </div>
    `;
};

export default Lesson;
