const Lesson = (props) => {
  const { todayScheduler, todayChapter } = props;
  return `
        <div>
            <p class="pb-2 font-bold"><span class="text-xl">${todayChapter.title ?? ""}</span>
            <p><span class="text-lg">${todayScheduler[0].period}차시</span> ${dayjs
              .utc(todayScheduler[0].date)
              .local()
              .format("YYYY-MM-DD")}</p>
        </div>
    `;
};

export default Lesson;
