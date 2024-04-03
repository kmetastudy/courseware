const Lesson = (props) => {
  const { todayScheduler, todayChapter } = props;
  return `
        <div class="font-bold">
            <p class="badge badge-outline">${todayChapter.title}</p>
            <p><span class="px-2 text-xl">${todayScheduler[0].period}차시</span> ${dayjs
              .utc(todayScheduler[0].date)
              .local()
              .format("YYYY-MM-DD")}</p>
        </div>
    `;
};

export default Lesson;
