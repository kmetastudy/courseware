import { extract } from "../../../../../core/utils/array";
import { utcToLocalString } from "../../../../../core/utils/date/dayjs";
import { isArray } from "../../../../../core/utils/type";

export class CourseStudyModel {
  static TYPE_CONTENT_KOR = {
    0: "챕터",
    11: "테스트",
    12: "레슨",
    13: "시험",
  };

  static TYPE_ELEMENT_STRING = {
    video: "v",
    question: "q",
  };

  #state;

  constructor(state) {
    this.#state = state;
  }

  setState(newState) {
    this.#state = { ...this.#state, ...newState };
  }

  getState = (key) => this.#state[key];

  getProperty() {
    return this.getState("studyResult")?.json_data?.property ?? [];
  }

  composeSchedulers() {
    const studyProperty = structuredClone(this.getProperty());

    const nestedSchedulers = composeNestedSchedulers(studyProperty);

    const formattedScheduler = nestedSchedulers.map((scheduler) => formatScheduler(scheduler));

    return formattedScheduler;
  }

  getTodayProperties() {
    const studyProperty = this.getProperty();

    const todayProperties = studyProperty.filter((item) => item.date && isToday(item.date));

    return todayProperties;
  }

  getTodayPeriod() {
    const todayProperties = this.getTodayProperties();
    const todayPeriod = todayProperties.length > 0 ? todayProperties[0].period : 0;

    return todayPeriod;
  }

  getTodayChapters() {
    let todayChapters = [];

    const propertyList = this.getProperty();

    const { length } = propertyList;

    let chapter = undefined;

    for (let i = 0; i < length; i++) {
      const property = propertyList[i];

      if (property.type === 0) {
        chapter = property;
        continue;
      }

      const { date } = property;

      if (isToday(date)) {
        if (todayChapters.length === 0) {
          todayChapters.push(chapter);
        } else if (todayChapters.at(-1).id !== chapter.id) {
          todayChapters.push(chapter);
        }
      }
    }

    return todayChapters;
  }
}

function composeNestedSchedulers(studyProperty) {
  const nestedSchedulers = [];

  let currentPeriod = 0;

  const { length } = studyProperty;

  for (let i = 0; i < length; i++) {
    const scheduler = studyProperty[i];
    const { type, period, date, units, id } = scheduler;

    // chapter
    if (type === 0) {
      const title = scheduler.title;
      const child = [];
      nestedSchedulers.push({ title, child, id });

      currentPeriod = period;
      continue;
    }

    // 차시
    if (period !== currentPeriod) {
      const title = `${period} 차시`;
      const dateTitle = utcToLocalString(date) ?? date;
      const branchCount = studyProperty.filter((item) => item.date === date).length;

      nestedSchedulers.at(-1)?.child?.push({ title, date, dateTitle, period, branchCount, child: [] });

      currentPeriod = period;
    }

    // branch
    const typeString = formatContentType(type);
    const typeTitle = typeString ? `유형: ${typeString}` : "";
    const completed = isCompleted(scheduler);

    const elementTypes = flattenElementTypes(units);
    const questionNum = countQuestion(elementTypes);
    const videoNum = countVideo(elementTypes);

    nestedSchedulers
      .at(-1)
      ?.child?.at(-1)
      ?.child?.push({ ...scheduler, typeTitle, questionNum, videoNum, completed });
  }

  return nestedSchedulers;
}

function formatScheduler(scheduler) {
  const { child } = scheduler;
  if (child.length === 0) {
    scheduler.disabled = true;
    return scheduler;
  }

  const childResults = extract(scheduler.child, "child").flat();

  const completed = isCompleted(childResults);

  const startDate = child.at(0)?.dateTitle;
  const endDate = child.at(-1)?.dateTitle;
  const period = child.length;

  let date;
  if (startDate && endDate) {
    date = `${startDate} - ${endDate}`;
  } else {
    date = "";
  }

  scheduler.completed = completed;
  scheduler.disabled = false;
  scheduler.date = date;
  scheduler.period = period;

  // 차시
  child.map((period) => {
    const results = period.child;
    const completed = isCompleted(results);
    period.completed = completed;

    return period;
  });

  return scheduler;
}

function formatContentType(type) {
  return CourseStudyModel.TYPE_CONTENT_KOR[type] ?? "콘텐츠";
}

function countVideo(elementTypes) {
  return elementTypes.filter((type) => type === CourseStudyModel.TYPE_ELEMENT_STRING.video).length;
}

function countQuestion(elementTypes) {
  return elementTypes.filter((type) => type === CourseStudyModel.TYPE_ELEMENT_STRING.question).length;
}

function flattenElementTypes(units = []) {
  return extract(units, "types").flat();
}

function isCompleted(results = []) {
  if (isArray(results)) {
    return results.every((result) => result.progress === 100);
  }

  return results.progress ?? 0;
}

function isToday(date) {
  return dayjs(date).isToday();
}

let data = {
  property: [
    {
      level: 1,
      type: 0,
      title: "1.유리수와 소수",
      id: "6dc09fc1-455f-4282-a0f8-f90a848d75cc",
      units: [],
      date: "",
      period: 0,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "1. 유리수와 소수 (N1 ~ N4)",
      id: "eb880f5b-9153-4ee9-a7b6-ebfff4c24a0a",
      units: [
        { id: "39d0cebb-3ff6-47a5-b2fb-9cd0bed18695", types: ["v", "q", "q"] },
        { id: "2c713281-e44d-4f77-b0e4-a879774bbec8", types: ["v", "q", "q"] },
        { id: "c111d512-ae4b-4735-8c82-b8bf336c7495", types: ["v", "q", "q"] },
        { id: "0bda3478-6383-4b1b-8b27-fbc5036ff34f", types: ["v", "q", "q"] },
      ],
      date: "2024-03-30T00:00:00Z",
      period: 1,
      show: true,
      progress: 8,
      point: 0,
      results: [
        { result: ["O"], repeat: [1] },
        { result: [], repeat: [] },
        { result: [], repeat: [] },
        { result: [], repeat: [] },
      ],
      updated_date: "2024-04-13T07:20:58.907958+00:00",
    },
    {
      level: 2,
      type: 11,
      title: "1. 유리수와 소수 TEST 01 (N1 ~ N4)",
      id: "0a926b9e-b2a0-47d7-b978-02bc68e50cfc",
      units: [
        { id: "46c93ebf-7b19-4a8a-87cd-8913b01a6015", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-03-30T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "1. 유리수와 소수 (N5 ~ N8)",
      id: "c6d15e6f-7f8f-4add-a233-b5cfb8e009ae",
      units: [
        { id: "fced0063-3e17-48b5-bf3f-29f189e8df39", types: ["v", "q", "q"] },
        { id: "8ac985e5-e914-4341-961e-87da5b64db45", types: ["v", "q", "q"] },
        { id: "458fd36b-17d5-4bec-8c83-aa5b7f23aed3", types: ["v", "q", "q"] },
        { id: "43e398e0-c3a7-41b2-b3d2-e6ae56c8ce00", types: ["v", "q", "q"] },
      ],
      date: "2024-03-31T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "1. 유리수와 소수 TEST 02 (N5 ~ N8)",
      id: "39ab59bb-6144-4030-8e27-5cffce852b28",
      units: [
        { id: "4e67f340-14d6-4ff6-96dd-a1d208be9fa0", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-03-31T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [
        {
          repeat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          result: ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
          first: ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
          second: ["", "", "", "", "", "", "", "", "", ""],
        },
      ],
      updated_date: "2024-04-12T03:37:25.348090+00:00",
    },
    {
      level: 2,
      type: 12,
      title: "1. 유리수와 소수 (N9 ~ N12)",
      id: "bbd8dc60-c5ac-46d2-a1e1-35592dccc61e",
      units: [
        { id: "033875d1-4c96-4131-9869-ba00b6a037be", types: ["v", "q", "q"] },
        { id: "988ef232-a36f-4998-a424-a173247ea7bb", types: ["v", "q", "q"] },
        { id: "342320ed-018a-43a5-a2d5-fec7de6ba0f2", types: ["v", "q", "q"] },
        { id: "0c206711-2a84-43dc-b64b-d6259139ee2e", types: ["v", "q", "q"] },
      ],
      date: "2024-04-01T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "1. 유리수와 소수 TEST 03 (N9 ~ N12)",
      id: "43213a45-4b9e-4135-9022-f348f17c3f5f",
      units: [
        { id: "ed05a344-6e29-4932-9370-e3455a9c2e06", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-01T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "1. 유리수와 소수 (N13 ~ N17)",
      id: "5c238be3-a74e-4fc4-8ffd-bbc5abc0d059",
      units: [
        { id: "7eab24ba-5947-4a3a-a478-78fdc64bc8f5", types: ["v", "q", "q"] },
        { id: "db47a241-c938-4e12-bb83-c55c1f48cbcc", types: ["v", "q", "q"] },
        { id: "1e0f32b8-e6dc-4132-ae64-0bcf017fd6ce", types: ["v", "q", "q"] },
        { id: "395ac98d-f24b-429e-bc11-bf1561b6849d", types: ["v", "q", "q"] },
        { id: "8f0d270a-8b7c-43f5-8c77-9c5567adc15e", types: ["v", "q", "q"] },
      ],
      date: "2024-04-02T00:00:00Z",
      period: 4,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "1. 유리수와 소수 TEST 04 (N13 ~ N17)",
      id: "e4819bd2-67e4-4ad4-ad3f-75fe7d60d588",
      units: [
        { id: "f677dd4f-e255-465d-9f2b-7f4a90aa5373", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-02T00:00:00Z",
      period: 4,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 1,
      type: 0,
      title: "2.단항식의 계산",
      id: "1dc1f0f9-bb04-4311-9ecc-72a6cbf14771",
      units: [],
      date: "",
      period: 0,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "2. 단항식의 계산 (N1 ~ N5)",
      id: "5da8041e-42c6-42f6-9592-01110ecc93e3",
      units: [
        { id: "047a3a0e-bdcd-4e2b-8041-0133ebffb449", types: ["v", "q", "q"] },
        { id: "5b7c8780-e7b7-4da4-9935-88fcfb72f1ab", types: ["v", "q", "q"] },
        { id: "d9ceaa43-4f2f-4c23-915f-ddb008b1ef28", types: ["v", "q", "q"] },
        { id: "679eb50e-38ae-47f4-9352-831bdc64e2ee", types: ["v", "q", "q"] },
        { id: "3511c741-445b-45ac-8339-6ca470bad57b", types: ["v", "q", "q"] },
      ],
      date: "2024-04-03T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "2. 단항식의 계산 TEST 01 (N1 ~ N5)",
      id: "6ff1a41c-f975-4d84-bd20-2187b936b153",
      units: [
        { id: "0cf07c9e-7420-41ff-afc4-a306c171682e", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-03T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "2. 단항식의 계산 (N6 ~ N9)",
      id: "3290ca9d-69bc-45e8-8f15-867dd3d0fb9a",
      units: [
        { id: "a06f5536-5eb4-425d-b065-f8d9a557fd87", types: ["v", "q", "q"] },
        { id: "cd015cdd-0e02-4614-a897-54e8f18bdb48", types: ["v", "q", "q"] },
        { id: "5124f6d8-c359-4d43-8179-b4ebda209c54", types: ["v", "q", "q"] },
        { id: "20de4f0c-b5dd-4b0b-b5ae-209ca8ff2ecb", types: ["v", "q", "q"] },
      ],
      date: "2024-04-04T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "2. 단항식의 계산 TEST 02 (N6 ~ N9)",
      id: "d026b7c6-ca72-479e-847b-5e98f67fc08d",
      units: [
        { id: "07b91b85-975f-4682-bec5-e2e781cf930c", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-05T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "2. 단항식의 계산 (N10 ~ N14)",
      id: "8df2b219-1606-4d3a-acbf-d44f58976310",
      units: [
        { id: "d4df6745-012c-4632-b68f-3a9486d5d56f", types: ["v", "q", "q"] },
        { id: "28cebe34-6b5a-48da-9d98-f98efa785998", types: ["v", "q", "q"] },
        { id: "1fe1e207-704c-492f-95cb-afd018fc8a70", types: ["v", "q", "q"] },
        { id: "007f0613-b964-4dd8-a97c-92d59404a612", types: ["v", "q", "q"] },
        { id: "654a3c0d-6660-4895-9db0-cd5c9a038e07", types: ["v", "q", "q"] },
      ],
      date: "2024-04-05T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "2. 단항식의 계산 TEST 03 (N10 ~ N14)",
      id: "f904ac85-65bd-4cff-ade8-039f5ddb5bf3",
      units: [
        { id: "3d2743a8-bc7c-4828-a92d-a5e53e774f63", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-06T00:00:00Z",
      period: 4,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "2. 단항식의 계산 (N15 ~ N18)",
      id: "b6e3df53-1bd0-4aa6-bbb3-da89062d3070",
      units: [
        { id: "33e07749-3f78-4dee-9585-a2eed3d43c14", types: ["v", "q", "q"] },
        { id: "94caeb7a-1bc9-491c-838f-c2d1a90743d0", types: ["v", "q", "q"] },
        { id: "8c7572fe-4e8a-4027-9caa-310574dc651f", types: ["v", "q", "q"] },
        { id: "c710fa22-9bd3-47d3-aba1-9e4e28cc3c31", types: ["v", "q", "q"] },
      ],
      date: "2024-04-06T00:00:00Z",
      period: 4,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "2. 단항식의 계산 TEST 04 (N15 ~ N18)",
      id: "320d33f7-7a46-4ec2-9900-e351f6b888d5",
      units: [
        { id: "fdfd0c88-d7ba-4ea4-9d77-8808599003aa", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-07T00:00:00Z",
      period: 5,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 1,
      type: 0,
      title: "3.다항식의 계산",
      id: "4312501f-976f-43f7-85c4-caf8a83ba10a",
      units: [],
      date: "",
      period: 0,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "3. 다항식의 계산 (N1 ~ N4)",
      id: "6fe4bc35-fe68-4dbb-8a8d-781a68e680fa",
      units: [
        { id: "8a104625-4335-47d4-b7c9-17d8be8a73b5", types: ["v", "q", "q"] },
        { id: "bc99cbb6-eacd-4770-b70a-46c16b390dcf", types: ["v", "q", "q"] },
        { id: "0a6d58d6-4216-490b-ad49-3b1202ff74a1", types: ["v", "q", "q"] },
        { id: "cbcbf84b-608b-431c-a813-3577aa7902f6", types: ["v", "q", "q"] },
      ],
      date: "2024-04-08T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "3. 다항식의 계산 TEST 01 (N1 ~ N4)",
      id: "c0408337-9d2f-46a3-92d4-ce40c90dee60",
      units: [
        { id: "5dd64e16-42cd-4f8f-ace2-5e9d3c294e84", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-08T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "3. 다항식의 계산 (N5 ~ N8)",
      id: "29ec965c-847a-400c-a84f-c37553948fa1",
      units: [
        { id: "c654619f-2f4c-4a6c-ad2c-f36d208bff33", types: ["v", "q", "q"] },
        { id: "a495dcc2-0774-4845-8f2c-e0391d3a4486", types: ["v", "q", "q"] },
        { id: "3f473d2c-3aea-44d9-b8d5-70d09cdb3243", types: ["v", "q", "q"] },
        { id: "5656d35c-6d94-425a-a441-3b8f243d0a5a", types: ["v", "q", "q"] },
      ],
      date: "2024-04-09T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "3. 다항식의 계산 TEST 02 (N5 ~ N8)",
      id: "53e30419-107c-42e0-ae02-88093fec7b1b",
      units: [
        { id: "4f5e6d10-51a9-4c3a-ad7b-84a1701a0d7a", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-09T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "3. 다항식의 계산 (N9 ~ N11)",
      id: "a7c07d30-dd1a-4eee-b794-3f1d4e94324c",
      units: [
        { id: "bfffef22-2f0c-47e8-a747-779eeae393ee", types: ["v", "q", "q"] },
        { id: "caeba528-eab2-449e-a967-dac5d3437d6d", types: ["v", "q", "q"] },
        { id: "e9c05941-fd92-424b-be01-5c54a9e425fe", types: ["v", "q", "q"] },
      ],
      date: "2024-04-10T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "3. 다항식의 계산 TEST 03 (N9 ~ N11)",
      id: "6a4bab35-868a-4e44-8cbe-64d6a91dd3c9",
      units: [
        { id: "ccc79f13-86ea-4e18-8904-f6f2b2477bfa", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-10T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "3. 다항식의 계산 (N12 ~ N15)",
      id: "0764954b-c941-4c6b-961c-b2f1f7747691",
      units: [
        { id: "e3d66cc1-5ea5-49c2-97ba-66928262e5a5", types: ["v", "q", "q"] },
        { id: "2fdba587-32d5-4208-b96d-50ce54cd6507", types: ["v", "q", "q"] },
        { id: "b48129bc-6659-4688-bc5b-53474a94083d", types: ["v", "q", "q"] },
        { id: "5a1fde7a-1391-4e33-9bf2-6b6f276c26d2", types: ["v", "q", "q"] },
      ],
      date: "2024-04-11T00:00:00Z",
      period: 4,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "3. 다항식의 계산 TEST 04 (N12 ~ N15)",
      id: "7433a643-7341-431c-bb7a-6d78eeeaead8",
      units: [
        { id: "f549c1e9-7ae7-4cce-9c64-2e4cb4f91b23", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-11T00:00:00Z",
      period: 4,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 1,
      type: 0,
      title: "4.일차부등식",
      id: "d0ac2330-021e-4400-a7ab-e278fd663f29",
      units: [],
      date: "",
      period: 0,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "4. 일차부등식 (N1 ~ N4)",
      id: "6d551fe4-6145-4210-b24b-74f548ea6f8a",
      units: [
        { id: "4489e3c0-1836-4024-ae52-3f6ccfa3cb9e", types: ["v", "q", "q"] },
        { id: "d0ee3340-4dc7-41e8-b76a-0c66962f7d81", types: ["v", "q", "q"] },
        { id: "cf02ce8a-cef7-44a5-8c8b-46df36e2439c", types: ["v", "q", "q"] },
        { id: "413f74c6-c701-4f51-9b41-0101892dc474", types: ["v", "q", "q"] },
      ],
      date: "2024-04-12T00:00:00Z",
      period: 1,
      show: true,
      progress: 66,
      point: 62,
      results: [
        { result: ["O", "O", "O"], repeat: [1, 1, 2] },
        { result: ["O", "O", "O"], repeat: [1, 1, 1] },
        { result: ["O", "O"], repeat: [1, 1] },
        { result: [], repeat: [] },
      ],
      updated_date: "2024-04-12T07:27:46.620248+00:00",
    },
    {
      level: 2,
      type: 11,
      title: "4. 일차부등식 TEST 01 (N1 ~ N4)",
      id: "50b59326-0931-409c-8dff-8f3e05b28260",
      units: [
        { id: "433413ac-d5f8-4a72-992d-4a7d7dbe6c9a", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-12T00:00:00Z",
      period: 1,
      show: true,
      progress: 90,
      point: 80,
      results: [
        {
          repeat: [1, 2, 2, 2, 2, 9, 2, 2, 0, 2],
          result: ["O", "O", "O", "O", "O", "X", "O", "O", "?", "O"],
          first: ["O", "O", "O", "O", "O", "X", "O", "O", "?", "O"],
          second: ["", "", "", "", "", "X", "", "", "", ""],
        },
      ],
      updated_date: "2024-04-12T07:21:14.301847+00:00",
    },
    {
      level: 2,
      type: 12,
      title: "4. 일차부등식 (N5 ~ N8)",
      id: "d611935c-0da3-492e-8ab0-a2d9ba2d0311",
      units: [
        { id: "94fb8b9e-2d58-4d07-bf69-50ec15ed6260", types: ["v", "q", "q"] },
        { id: "08f44b40-94c2-4201-a504-c79016daa2aa", types: ["v", "q", "q"] },
        { id: "3e62797c-5b9d-4fce-89a8-d98471f46f94", types: ["v", "q", "q"] },
        { id: "8bfe9660-8b73-41dd-a0c4-8e75fe8bb4ab", types: ["v", "q", "q"] },
      ],
      date: "2024-04-13T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "4. 일차부등식 TEST 02 (N5 ~ N8)",
      id: "6dad7f49-30fc-4c1a-ad44-d5a704463707",
      units: [
        { id: "3147e231-37a4-4b8a-a137-ef0dae8e57a3", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-13T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "4. 일차부등식 (N9 ~ N12)",
      id: "054a99f9-5e0f-4d48-8ff8-482bab69dc20",
      units: [
        { id: "e9ced3f1-e267-44fd-b3d8-db8ac7e268d4", types: ["v", "q", "q"] },
        { id: "2816080a-8174-4023-9735-0dcb0d94debd", types: ["v", "q", "q"] },
        { id: "b9e46f55-68da-416c-a65e-8359990f507a", types: ["v", "q", "q"] },
        { id: "1e1ebf11-181b-4bbf-9881-345ac803fb68", types: ["v", "q", "q"] },
      ],
      date: "2024-04-14T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "4. 일차부등식 TEST 03 (N9 ~ N12)",
      id: "4e79ba76-ca37-4f36-8273-f15a3439471d",
      units: [
        { id: "daa2ac45-cdef-4668-be4a-4d8d9f5de29b", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-14T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "4. 일차부등식 (N13 ~ N15)",
      id: "823c9c60-f72c-4dde-b539-dbceeb7f421f",
      units: [
        { id: "388aa0e8-677e-4ea4-9680-e1c819d30a5a", types: ["v", "q", "q"] },
        { id: "34a29388-6d2e-4212-aefb-c699f69ccd7a", types: ["v", "q", "q"] },
        { id: "347f5169-f19b-4d5f-b07a-505e58aa6cc7", types: ["v", "q", "q"] },
      ],
      date: "2024-04-15T00:00:00Z",
      period: 4,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "4. 일차부등식 TEST 04 (N13 ~ N15)",
      id: "a756ecda-d681-4ac1-a098-dd7645719a92",
      units: [
        { id: "c8d7c0d4-7f36-4885-abca-873259f00272", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-16T00:00:00Z",
      period: 5,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 1,
      type: 0,
      title: "5.일차부등식의 활용",
      id: "9f13ccfe-241e-483a-947d-49ff08757605",
      units: [],
      date: "",
      period: 0,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "5. 일차부등식의 활용 (N16~N20)",
      id: "d6fbcf82-ddd8-4e55-9428-778ae5948446",
      units: [
        { id: "e3b73ca8-2a95-4459-a2bf-cd06d76cf7c3", types: ["v", "q", "q"] },
        { id: "412bf86a-2662-486b-944e-80b9f44391c8", types: ["v", "q", "q"] },
        { id: "5638d0f5-7a60-4832-a14d-af6eaaadf350", types: ["v", "q", "q"] },
        { id: "f3cb01cf-f2b8-420d-a992-0a66f622ea3e", types: ["v", "q", "q"] },
        { id: "1495c1bb-bba3-4bd0-9ee4-0b2d01ee81da", types: ["v", "q", "q"] },
      ],
      date: "2024-04-17T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "5. 일차부등식의 활용  TEST 01 (N16~N20)",
      id: "8778a0f2-d895-412e-8283-bc9acbdfd0e1",
      units: [
        { id: "2b5dc1e2-c925-4624-986a-19aad1701eff", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-17T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "5. 일차부등식의 활용 (N21~N24)",
      id: "8e6d818f-ca12-4f74-b986-df901b1e9143",
      units: [
        { id: "f375ac4d-e58c-4b06-b950-01ebfa37254c", types: ["v", "q", "q"] },
        { id: "acec84dd-10e1-4c58-95d6-f1c79da740f1", types: ["v", "q", "q"] },
        { id: "b6c95a75-03d3-4ced-867f-d94efd785ad4", types: ["v", "q", "q"] },
        { id: "9d7b18c6-50a1-49e0-9866-c755f9f9e062", types: ["v", "q", "q"] },
      ],
      date: "2024-04-18T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "5. 일차부등식의 활용 TEST 02 (N21~N24)",
      id: "6a14dc8d-3780-45b1-8294-74c6cae2c9db",
      units: [
        { id: "47aed120-5474-43a3-b002-db4f0f654812", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-18T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "5. 일차부등식의 활용 (N25~N28)",
      id: "f205d47c-7d80-4dd6-8b3c-00dc196f3631",
      units: [
        { id: "cbbb298e-bff6-450e-bf27-6d4369aea0ee", types: ["v", "q", "q"] },
        { id: "69232684-8017-4119-9f43-aea67faa7052", types: ["v", "q", "q"] },
        { id: "22a091c4-e81d-4eae-aec4-0e7c17a191f3", types: ["v", "q", "q"] },
        { id: "d224be0d-95df-40aa-96be-1dc6b206fe6b", types: ["v", "q", "q"] },
      ],
      date: "2024-04-19T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "5. 일차부등식의 활용 TEST 03 (N25~N28)",
      id: "5c4685da-09ef-454d-b993-c08d2dbad2b8",
      units: [
        { id: "3e775786-d40c-4abd-82d6-e66aa8cdad44", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-19T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "5. 일차부등식의 활용 (N29~N32)",
      id: "cbaeb65a-4987-4ed9-a70d-b9f721a2ad4c",
      units: [
        { id: "f070bdf1-80d7-4988-8636-b0f8f69dfd4c", types: ["v", "q", "q"] },
        { id: "d876f4ea-8e77-4f50-8b63-878a9740712b", types: ["v", "q", "q"] },
        { id: "b3bf604b-d7c2-4372-b4e0-d152fd469bc9", types: ["v", "q", "q"] },
        { id: "72015d77-0dda-474b-abcf-03ecf296975b", types: ["v", "q", "q"] },
      ],
      date: "2024-04-20T00:00:00Z",
      period: 4,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "5. 일차부등식의 활용 TEST 04 (N29~N32)",
      id: "87a58528-6bc6-4123-8181-42a3627e0556",
      units: [
        { id: "051b7c17-2930-45f8-a9b9-c199d8840142", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-20T00:00:00Z",
      period: 4,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 1,
      type: 0,
      title: "6.연립일차방정식",
      id: "256b21e9-a6cf-4d2c-8f51-06193b27ea6e",
      units: [],
      date: "",
      period: 0,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "6. 연립일차방정식 (N1 ~ N4)",
      id: "b3bb0b38-4c9c-4922-82c4-8b700b1ddffa",
      units: [
        { id: "b21880d0-c10b-4d2d-94cc-44740c6b8431", types: ["v", "q", "q"] },
        { id: "bc24991f-1e4d-4fe6-8688-3c5d00d5a038", types: ["v", "q", "q"] },
        { id: "c7e6f41b-4ffa-4d71-aaef-8183b4d28255", types: ["v", "q", "q"] },
        { id: "9b88fcf5-051d-4643-90c3-d2d9ba946950", types: ["v", "q", "q"] },
      ],
      date: "2024-04-21T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "6. 연립일차방정식 TEST 01 (N1 ~ N4)",
      id: "1b4bf78a-d92d-46ba-a884-830b871eac64",
      units: [
        { id: "6206e645-f453-478c-ba66-df1dbbf85f42", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-21T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "6. 연립일차방정식 (N5 ~ N8)",
      id: "097d4016-c9e1-4725-997f-0623dfda712c",
      units: [
        { id: "0244764d-f9d2-475e-9175-cd6e2c126e40", types: ["v", "q", "q"] },
        { id: "671361ee-b5c8-4b3c-8e5e-eac9cbdbc24f", types: ["v", "q", "q"] },
        { id: "271eb26b-c892-4d07-b96f-7902c89e0e02", types: ["v", "q", "q"] },
        { id: "1482c7bd-b451-4142-afe7-0c6d2d005974", types: ["v", "q", "q"] },
      ],
      date: "2024-04-22T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "6. 연립일차방정식 TEST 02 (N5 ~ N8)",
      id: "068448ed-de0c-4218-a147-d31d0fc26807",
      units: [
        { id: "bcb5f95e-a560-4b3e-a7a8-94fe4d895f83", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-22T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 1,
      type: 0,
      title: "7.연립일차방정식의 풀이",
      id: "77c3f2a8-4887-4fbf-aaba-63368caa4b74",
      units: [],
      date: "",
      period: 0,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "7. 연립일차방정식의 풀이 (N1 ~ N5)",
      id: "2bfa0a27-8228-4b90-9ab7-facc8b953447",
      units: [
        { id: "8ac90829-4432-4a3b-813d-b74f18552786", types: ["v", "q", "q"] },
        { id: "ec9d3dea-6776-4338-8b0e-39113d1598c0", types: ["v", "q", "q"] },
        { id: "bcc5cecb-151b-43b0-9a05-fcbfe96879a9", types: ["v", "q", "q"] },
        { id: "b56820d5-7191-455b-a6a4-c1014528cdf1", types: ["v", "q", "q"] },
        { id: "0e71d8c7-c954-4a66-aa52-e20dc3b3f9f5", types: ["v", "q", "q"] },
      ],
      date: "2024-04-23T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "7. 연립일차방정식의 풀이 TEST 01 (N1 ~ N5)",
      id: "14175712-db03-40c2-a40b-54c3470922f5",
      units: [
        { id: "1377ccee-ac35-4a79-922c-9b4475a53712", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-23T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "7. 연립일차방정식의 풀이 (N6 ~ N10)",
      id: "01a35d8a-3881-464b-9d5f-c949ff691f49",
      units: [
        { id: "2796bdea-31cd-4492-b73b-b12fdcf52eba", types: ["v", "q", "q"] },
        { id: "8042b27c-42d1-4a4d-a868-4e4c2ca374dc", types: ["v", "q", "q"] },
        { id: "5f674791-5cbd-4f22-b1f3-f1edcc6e7e4c", types: ["v", "q", "q"] },
        { id: "da42af12-73f1-4d00-8808-c7cd4fd12b2c", types: ["v", "q", "q"] },
        { id: "88c75fd2-2455-42d5-968a-01d22d340cad", types: ["v", "q", "q"] },
      ],
      date: "2024-04-24T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "7. 연립일차방정식의 풀이 TEST 02 (N6 ~ N10)",
      id: "535b2699-b094-47bf-a315-40ae9b161657",
      units: [
        { id: "1377771a-7c89-4655-abc2-993ab2f3a139", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-24T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "7. 연립일차방정식의 풀이 (N11 ~ N14)",
      id: "18a4afb1-3aac-4857-a3b8-7db32911ac42",
      units: [
        { id: "be4fc255-e8da-4a93-8684-09a452969385", types: ["v", "q", "q"] },
        { id: "f6d785d7-75ae-4b9c-a857-ffcebb769949", types: ["v", "q", "q"] },
        { id: "cf77e008-efda-4c0f-a5ef-718968785559", types: ["v", "q", "q"] },
        { id: "66ed86dc-fa0b-4158-adab-f8ad3d68cfe3", types: ["v", "q", "q"] },
      ],
      date: "2024-04-25T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "7. 연립일차방정식의 풀이 TEST 03 (N11 ~ N14)",
      id: "4a445717-5918-4215-90f8-e625d47b1edc",
      units: [
        { id: "5b3ed23e-4a84-44ab-b706-27e3850f8d5e", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-26T00:00:00Z",
      period: 4,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 1,
      type: 0,
      title: "8. 연립일차방정식의 활용",
      id: "2ac80037-7da3-428c-b135-aa2f22f4388a",
      units: [],
      date: "",
      period: 0,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "8. 연립일차방정식의 활용 (N1 ~ N4)",
      id: "a5a77977-179d-4197-94ba-20d8adfe62bb",
      units: [
        { id: "a8dec0ed-3649-4058-971a-3dac165a8e74", types: ["v", "q", "q"] },
        { id: "c0849273-ba4e-4d75-86e6-a714fb10daec", types: ["v", "q", "q"] },
        { id: "6314814b-03db-40e5-9a87-c4b3d67000eb", types: ["v", "q", "q"] },
        { id: "fe17a8a8-107b-46e8-9094-a5aa67852b7f", types: ["v", "q", "q"] },
      ],
      date: "2024-04-27T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "8. 연립일차방정식의 활용 TEST 01 (N1 ~ N4)",
      id: "c5438457-7e7e-4bdb-a61c-c914c19d4f34",
      units: [
        { id: "59495995-a671-4039-a5b7-ad3df1a49b6c", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-27T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "8. 연립일차방정식의 활용 (N5 ~ N8)",
      id: "56a8a9b5-9eff-4520-96cc-feac6cdbd469",
      units: [
        { id: "a2cfd8cd-ba8e-4378-8df1-485d5f5700b9", types: ["v", "q", "q"] },
        { id: "6d779a36-97ed-4b4a-9f58-be7ac4fd5dad", types: ["v", "q", "q"] },
        { id: "6f71905c-d465-4029-b50b-8ff6f4adb8b6", types: ["v", "q", "q"] },
        { id: "b9756556-c08a-4c2a-9279-d186aadbcfc8", types: ["v", "q", "q"] },
      ],
      date: "2024-04-28T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "8. 연립일차방정식의 활용 TEST 02 (N5 ~ N8)",
      id: "a631428d-ebcf-4c0f-81cb-570067078f0b",
      units: [
        { id: "b8281670-9649-47fc-ab3f-e9d81df90a0d", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-28T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "8. 연립일차방정식의 활용 (N9 ~ N12)",
      id: "89618f1a-9bd7-4ee7-b88d-b268c4be2724",
      units: [
        { id: "7e1cbdc0-1622-4c93-8190-6a8af5235d57", types: ["v", "q", "q"] },
        { id: "608ec69a-eec4-4801-8c32-4ad7fea2cc48", types: ["v", "q", "q"] },
        { id: "2ddacaca-2f3a-4888-9413-49d7aaad041b", types: ["v", "q", "q"] },
        { id: "13df3d58-5226-455c-98bd-3b3d0962ced7", types: ["v", "q", "q"] },
      ],
      date: "2024-04-29T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "8. 연립일차방정식의 활용 TEST 03 (N9 ~ N12)",
      id: "79f38e1b-4e0e-43fb-91c9-668cd8f9b1b9",
      units: [
        { id: "3a011ea3-996f-487c-a0c4-bb966793dca3", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-29T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "8. 연립일차방정식의 활용 (N13 ~ N16)",
      id: "faaa386e-1c90-4ffa-b6bd-df10b48c4b33",
      units: [
        { id: "e1c9ed75-a8d4-47f0-b2ec-9bae9d2df546", types: ["v", "q", "q"] },
        { id: "dd1b7e83-d905-4a69-84b5-6ba7ff056113", types: ["v", "q", "q"] },
        { id: "5a6aa49c-da4d-4f4d-9b47-5eedf80cb421", types: ["v", "q", "q"] },
        { id: "9e413f0c-f3d4-40e4-beb6-c98e36616f82", types: ["v", "q", "q"] },
      ],
      date: "2024-04-30T00:00:00Z",
      period: 4,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "8. 연립일차방정식의 활용 TEST 04 (N13 ~ N16)",
      id: "52fc5d33-7bc7-4a57-80b0-03e5e7cb5158",
      units: [
        { id: "3eb7aabc-d6ed-41ea-a825-a2cf169ba250", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-04-30T00:00:00Z",
      period: 4,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "8. 연립일차방정식의 활용 (N17 ~ N20)",
      id: "ac5fb4d0-32c5-4caa-8bd5-8c1caf57d8d2",
      units: [
        { id: "94b54380-c595-47c4-9e25-7d3361e85313", types: ["v", "q", "q"] },
        { id: "66718f1d-570c-40db-8181-be2064239f17", types: ["v", "q", "q"] },
        { id: "7c17a98e-c550-445d-855d-46947f61b12a", types: ["v", "q", "q"] },
        { id: "42bfe611-68d7-4dfa-bd4d-b35129ac2fdf", types: ["v", "q", "q"] },
      ],
      date: "2024-05-01T00:00:00Z",
      period: 5,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "8. 연립일차방정식의 활용 TEST 05 (N17 ~ N20)",
      id: "cb0d89ba-b529-4061-9c54-7c20acd4e2eb",
      units: [
        { id: "50f65200-ffe2-4ed7-9d1e-f927fbb3ea3c", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-05-01T00:00:00Z",
      period: 5,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "8. 연립일차방정식의 활용 (N21 ~ N24)",
      id: "262f4cc9-9266-4eb6-a77b-efd397ea33ce",
      units: [
        { id: "d28576de-d230-4fae-9471-a5f8448fa45a", types: ["v", "q", "q"] },
        { id: "91ea0877-e482-4183-804c-ea6f68768685", types: ["v", "q", "q"] },
        { id: "c92c8bba-8588-4859-a0dc-40ed53a59cb6", types: ["v", "q", "q"] },
        { id: "f9e19edc-00d5-4fc6-bb43-af0a2d5317ac", types: ["v", "q", "q"] },
      ],
      date: "2024-05-02T00:00:00Z",
      period: 6,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "8. 연립일차방정식의 활용 TEST 06 (N21 ~ N24)",
      id: "988ec437-e0a7-4239-a97a-fbed56405aec",
      units: [
        { id: "b60d8c22-2c29-4309-bc14-a2a199a1dbd1", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-05-02T00:00:00Z",
      period: 6,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 1,
      type: 0,
      title: "9.일차함수와 그래프(1)",
      id: "0e246109-e78b-4575-a3e0-6a85cc045d72",
      units: [],
      date: "",
      period: 0,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "9. 일차함수와 그래프(1) (N1 ~ N6)",
      id: "780f5a7e-88b4-41cd-b8ca-1b8092384692",
      units: [
        { id: "6320de36-729f-4c50-8201-a712d6f698da", types: ["v", "q", "q"] },
        { id: "8bac22e1-5949-4c35-a2bb-4fd3032cb669", types: ["v", "q", "q"] },
        { id: "e9383aa8-2b28-4d89-8511-752db5f138e1", types: ["v", "q", "q"] },
        { id: "d8c18d3f-42af-462f-a577-f75d1a380cef", types: ["v", "q", "q"] },
        { id: "f522cb1a-73e2-4cd9-b5b4-c9d661bde776", types: ["v", "q", "q"] },
        { id: "2f2c7541-0943-432c-ad38-8a6d7c775c6b", types: ["v", "q", "q"] },
      ],
      date: "2024-05-03T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "9. 일차함수와 그래프(1) TEST 01 (N1 ~ N6)",
      id: "696b9d14-ed4f-43f7-ac4c-a108262b83ed",
      units: [
        { id: "1ed1d222-8ecd-49fd-be2f-5401f7d5430c", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-05-03T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "9. 일차함수와 그래프(1) (N7 ~ N10)",
      id: "b6f351c6-8cfc-4122-b6d6-c9b020d4a48f",
      units: [
        { id: "bd22f376-4494-499c-a925-58918c12034a", types: ["v", "q", "q"] },
        { id: "1eb1e132-932f-424f-a68d-6c5558bec4f8", types: ["v", "q", "q"] },
        { id: "867cdfd9-664f-4d60-bf68-d3a0c0803ed0", types: ["v", "q", "q"] },
        { id: "d28d58d3-02e6-4f18-ac1a-627074d8247d", types: ["v", "q", "q"] },
      ],
      date: "2024-05-04T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "9. 일차함수와 그래프(1) TEST 02 (N7 ~ N10)",
      id: "642a74f5-325b-4afc-adb1-022ba32b4cb0",
      units: [
        { id: "538310a5-c278-425e-9341-2e74ed3ffc04", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-05-04T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "9. 일차함수와 그래프(1) (N11 ~ N15)",
      id: "2f2a341a-6b27-40e7-aaec-704b904e150b",
      units: [
        { id: "ce7ff7c0-e3ce-479d-8452-b4a84026ec2a", types: ["v", "q", "q"] },
        { id: "879b5111-0142-47cd-9786-be64b794dca7", types: ["v", "q", "q"] },
        { id: "4cb7b55f-7051-4283-8dbe-5e0139e12b1f", types: ["v", "q", "q"] },
        { id: "45786f11-2988-4b0e-81ab-c41cc42f6782", types: ["v", "q", "q"] },
        { id: "b8037b26-7d75-4c1b-bcd3-60e2fd8c5179", types: ["v", "q", "q"] },
      ],
      date: "2024-05-05T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "9. 일차함수와 그래프(1) TEST 03 (N11 ~ N15)",
      id: "2726ac97-eefa-4de3-9705-ae71f22c74f6",
      units: [
        { id: "4ed4fa2b-c493-4ce3-967b-c4a253eaba24", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-05-05T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "9. 일차함수와 그래프(1) (N16 ~ N18)",
      id: "7737b6e0-8a07-4b0d-bd7a-9591d60711c8",
      units: [
        { id: "ebb2b3e4-3fd8-43c3-99b8-d727871ef7f8", types: ["v", "q", "q"] },
        { id: "0f88dd55-45ca-435f-8e42-770ef62f715e", types: ["v", "q", "q"] },
        { id: "3207598e-4692-4351-8147-9500ec92f76e", types: ["v", "q", "q"] },
      ],
      date: "2024-05-06T00:00:00Z",
      period: 4,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "9. 일차함수와 그래프(1) TEST 04 (N16 ~ N18)",
      id: "be764a97-933a-4a4e-a3ca-5732fb2610b2",
      units: [
        { id: "85563aed-4d25-4457-a010-aa7003edfe43", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-05-07T00:00:00Z",
      period: 5,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 1,
      type: 0,
      title: "10.일차함수와 그래프(2)",
      id: "6091804a-8297-45b2-9d2d-5d77188b739d",
      units: [],
      date: "",
      period: 0,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "10. 일차함수와 그래프(2) (N1 ~ N4)",
      id: "28ea8ff3-5d2c-4375-b806-389ac56818d9",
      units: [
        { id: "701cdc44-a2b5-4ca5-868f-e12db02b8a90", types: ["v", "q", "q"] },
        { id: "8d691575-417d-437c-b07b-e834fe02da46", types: ["v", "q", "q"] },
        { id: "beeb2423-0f84-4d9b-8a3c-4afa468dfb96", types: ["v", "q", "q"] },
        { id: "51c35576-18f4-41d7-b46a-40449d9d2468", types: ["v", "q", "q"] },
      ],
      date: "2024-05-08T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "10. 일차함수와 그래프(2) TEST 01 (N1 ~ N4)",
      id: "efa2aa48-d865-43d0-b6c0-913ee174bca8",
      units: [
        { id: "a6c1e74d-8ed0-41f2-8d8d-92a6396fed54", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-05-08T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "10. 일차함수와 그래프(2) (N5 ~ N8)",
      id: "363a9d6d-37b1-4ff5-b177-c524179de4b4",
      units: [
        { id: "0fe8257e-bc6d-4690-ac8b-672f27388c90", types: ["v", "q", "q"] },
        { id: "bdc183da-f8e3-42c3-8c59-553f8173c8b5", types: ["v", "q", "q"] },
        { id: "61fd9871-562b-404c-ad2c-d29511fbbca7", types: ["v", "q", "q"] },
        { id: "584ee15e-ff19-4c54-8f3a-7a0ee684f8d4", types: ["v", "q", "q"] },
      ],
      date: "2024-05-09T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "10. 일차함수와 그래프(2) TEST 02 (N5 ~ N8)",
      id: "433ab3c8-ead1-4a6d-b907-998f7b09aef2",
      units: [
        { id: "f550f00d-58b7-44c1-ae7c-0a91a5155e10", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-05-09T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "10. 일차함수와 그래프(2) (N9 ~ N12)",
      id: "f1bcd972-08e7-49ba-82b1-1108664a65af",
      units: [
        { id: "8a79db2d-8e3f-4add-a1f0-d6a6c735d4bc", types: ["v", "q", "q"] },
        { id: "0d3a3821-98ca-46dc-9573-e39a02c7ba82", types: ["v", "q", "q"] },
        { id: "110bd3dc-8c3b-478b-9cb4-e8e59f9d5aa2", types: ["v", "q", "q"] },
        { id: "ef5f88c5-c43e-414d-a442-e70d25bc548c", types: ["v", "q", "q"] },
      ],
      date: "2024-05-10T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "10, 일차함수와 그래프(2) TEST 03 (N9 ~ N12)",
      id: "df8266fe-b349-4f5e-9d2e-2010e2d8ff88",
      units: [
        { id: "80592212-520e-4782-8c81-7017de0ca9d2", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-05-10T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "10. 일차함수와 그래프(2) (N13 ~ N16)",
      id: "e124c061-6a4c-4c38-adf4-6d25ee5bbc9f",
      units: [
        { id: "0532557e-8b51-4881-85ca-2c536bb59a5a", types: ["v", "q", "q"] },
        { id: "6966b901-68ba-428d-b5f2-44772e6a9f75", types: ["v", "q", "q"] },
        { id: "396c1718-fb07-42d7-832a-e925b6883adc", types: ["v", "q", "q"] },
        { id: "a3c9e29d-fec2-49e6-a419-5f0dc11ab6ba", types: ["v", "q", "q"] },
      ],
      date: "2024-05-11T00:00:00Z",
      period: 4,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "10. 일차함수와 그래프(2) TEST 04 (N13 ~ N16)",
      id: "dd13b576-bbd6-4263-8aa1-100ccb7dada5",
      units: [
        { id: "9c57216e-2f40-4a56-9433-a5fa1155270c", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-05-11T00:00:00Z",
      period: 4,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "10. 일차함수와 그래프(2) (N17 ~ N20)",
      id: "c24c57c6-d4ce-4248-9cad-f34c331e2461",
      units: [
        { id: "4010a263-d57f-4d4c-8936-64967d7be892", types: ["v", "q", "q"] },
        { id: "955b4d97-2635-4196-991e-7d41c7f1e481", types: ["v", "q", "q"] },
        { id: "121801fc-e863-49fe-b84e-991464cc1693", types: ["v", "q", "q"] },
        { id: "d08203a6-84d8-4d8d-a2fe-25279b91212c", types: ["v", "q", "q"] },
      ],
      date: "2024-05-12T00:00:00Z",
      period: 5,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "10. 일차함수와 그래프(2) TEST 05 (N17 ~ N20)",
      id: "8164b716-5b36-491c-8594-8e7d4c03d5c8",
      units: [
        { id: "03e1f799-fda8-45e8-b7c9-1c00360307f2", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-05-12T00:00:00Z",
      period: 5,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 1,
      type: 0,
      title: "11.일차함수와 일차방정식의 관계",
      id: "278de15b-d803-43d9-bda6-9476be14a53e",
      units: [],
      date: "",
      period: 0,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "11. 일차함수와 일차방정식의 관계 (N1 ~ N4)",
      id: "5d854548-9190-43bb-ac9d-892598b2109b",
      units: [
        { id: "511b1bca-3a39-4dd6-8d32-891bee75d596", types: ["v", "q", "q"] },
        { id: "c052df5f-27a5-498b-bccd-2c7da229cd53", types: ["v", "q", "q"] },
        { id: "950e659b-5ca9-4d68-b229-5c6d05cfec94", types: ["v", "q", "q"] },
        { id: "99046bd0-6ea3-440d-9778-5709d350ab8d", types: ["v", "q", "q"] },
      ],
      date: "2024-05-13T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "11. 일차함수와 일차방정식의 관계 TEST 01 (N1 ~ N4)",
      id: "2a034988-d484-44cc-a4ad-077623b57d77",
      units: [
        { id: "c34ceccb-74fc-48fa-9770-09728de94ab6", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-05-13T00:00:00Z",
      period: 1,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "11. 일차함수와 일차방정식의 관계 (N5 ~ N8)",
      id: "fcf3c299-ed80-405e-9caf-37edc54fb4c5",
      units: [
        { id: "f8c99fe6-96f7-434f-ac68-f0e4f4604a22", types: ["v", "q", "q"] },
        { id: "a8051781-5b73-4ff6-9760-cf1c6245412a", types: ["v", "q", "q"] },
        { id: "628fd230-63c2-4c9b-a970-62fa65900410", types: ["v", "q", "q"] },
        { id: "a08258f9-63a9-4b1f-98fc-707df87bc9f0", types: ["v", "q", "q"] },
      ],
      date: "2024-05-14T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "11. 일차함수와 일차방정식의 관계 TEST 02 (N5 ~ N8)",
      id: "dfa25141-9df4-4fb3-a784-328bd6d40407",
      units: [
        { id: "a3a9dd5a-40db-4582-9835-ecf479f3d404", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-05-14T00:00:00Z",
      period: 2,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "11. 일차함수와 일차방정식의 관계 (N9 ~ N12)",
      id: "d77ed689-f665-4052-befe-2bc7bb0e931f",
      units: [
        { id: "26673ea7-1a66-4ddf-bc00-0c4d5a6f2c3f", types: ["v", "q", "q"] },
        { id: "5f913bd7-586f-4230-ae9b-6ef8c804e4ff", types: ["v", "q", "q"] },
        { id: "1155c9f8-b59f-4952-aeca-629caf783537", types: ["v", "q", "q"] },
        { id: "1d5e675a-a96f-4b45-b34e-28da8e5f9b67", types: ["v", "q", "q"] },
      ],
      date: "2024-05-15T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "11. 일차함수와 일차방정식의 관계 TEST 03 (N9 ~ N12)",
      id: "fd195984-63bc-4c63-b02f-80cdedd0fd87",
      units: [
        { id: "bdc4a28c-42ee-4ee1-8fea-5a6017329518", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-05-15T00:00:00Z",
      period: 3,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 12,
      title: "11. 일차함수와 일차방정식의 관계 (N13 ~ N17)",
      id: "8b17cb51-fa6f-40b8-8c13-45b6838fcd42",
      units: [
        { id: "baf5ecd7-1d43-40fd-88c6-7ff450753a62", types: ["v", "q", "q"] },
        { id: "c9b219e2-bb74-4706-bb1a-7e25aa13ca5f", types: ["v", "q", "q"] },
        { id: "f0b40ead-c6a5-422d-9456-7facc8e5d9f4", types: ["v", "q", "q"] },
        { id: "aaf8f085-66c0-4a47-876d-db4a4191b7ce", types: ["v", "q", "q"] },
        { id: "e582fe04-86a3-47db-a59d-7472a6a5c838", types: ["v", "q", "q"] },
      ],
      date: "2024-05-16T00:00:00Z",
      period: 4,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
    {
      level: 2,
      type: 11,
      title: "11. 일차함수와 일차방정식의 관계 TEST 04 (N13 ~ N17)",
      id: "280cbdda-d69b-4a93-85ec-d3802b261451",
      units: [
        { id: "fedd84b8-9f23-423b-95cb-c786e5bf5be5", types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"] },
      ],
      date: "2024-05-17T00:00:00Z",
      period: 5,
      show: true,
      progress: 0,
      point: 0,
      results: [],
    },
  ],
};
