//
export class SvStudyResults {
  constructor() {}
  //

  sumCompletedNum(results) {
    // Sum number of completed lectures(branch(testum/lesson/...))
    return results.filter((data) => data?.progress === 100).length ?? 0;
  }

  sumCompletedTime(results, lists) {
    // Sum time of completed lectures
    // need full data of both results, and lists
    return results.reduce((accum, current, index) => {
      if (current.value === 100) {
        return accum + lists[index].time;
      }
      return accum;
    });
  }

  calculateTotalTime(lists) {
    // total time of course
    const totalTime = 0;
    lists.forEach((data) => {
      data.time ? (totalTime += data.time) : null;
    });
    return totalTime;
  }
}
