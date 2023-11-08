// 뭘 해야될까?
// 1. data 가져오기
// 쓸모 없는 데이터는 이제 없애자
// 2. 데이터 수정하기
// field명이 바뀐 경우, 수정하자
// model의 이름이 바뀐 경우도 수정하자
// 3. 데이터 수정하기(units)
// units를 제거하자.
// lessonunit 삭제
// testumunit 삭제

// lesson/testum 좋은데.. 이게 필요할까
// type을 다르게만 해두면 되지 않나..
// (아니 애초에, mCourse말고 필요할까? 잘 모르겠으니, 일단은 삭제하지 말자)
// mCourse
// lists와 contents를 합침
// lists랑 contents가 있다.
// kl은 지금 필요할까..? -> 추천할일이 있으면 필요하다.
const type2 = {
  contents: [
    { level: 1, type: 0, title: "1.제곱근의 뜻과 성질", id: "35ba6e58-b915-4fdc-ba5e-b851fbb870d5", units: [] },
    {
      level: 2,
      // isDemo: true,
      type: 12,
      title: "제곱근의 뜻과 성질 N1~N4",
      id: "99b17e60-c066-4f1c-9a59-7ad2b363b166", // content id (lesson/testum)
      elements: {
        ids: [
          "4eba284d-a58f-4e1d-aaf7-5ee45ad7dbbd",
          "50072e21-6f85-49a7-b095-141348b02b65",
          "077f3303-d484-4377-99ee-5fe61aa16a20",
          "137c104e-514a-4043-a399-bb7b33422f35",
          "38df59cf-2e85-4f9e-a35b-5b9dcf25dd9f",
          "db294d1d-d6e8-4bc4-82ca-f5e62848297c",
          "4e330222-74b3-4405-b7fd-225712eec49c",
          "32e95b87-c59f-4bea-b77a-5a701ab1de02",
          "3bcbbc25-5172-4431-ac00-7bf144213c30",
        ],
        types: ["v", "q", "q", "v", "q", "q", "v", "q", "q"],
      },
    },
  ],
  kls: [
    {
      // id: "99b17e60-c066-4f1c-9a59-7ad2b363b166", // do we need it?
      elements: {
        kl: [
          [{ root: root_id, leaf: leaf_id }],
          [{ root: root_id, leaf: leaf_id }],
          [{ root: root_id, leaf: leaf_id }],
        ],
        types: ["v", "q", "q"],
      },
    },
  ],
};

// 17307f64980344b9a52171217c07fb4a
// 23_초6-2_체험판
const changedType2 = {
  contents: [
    {
      level: 1,
      type: 0,
      title: "1. 분수의 나눗셈",
      id: "e25a9efd-c41a-4250-851b-c7cbeac24f46",
      elements: { ids: [], types: [] },
    },
    {
      level: 2,
      type: 12,
      title: "1-1 분모가 같은 (분수) \\(\\div\\) (단위분수)  ",
      id: "fd6dfe2a-7b03-469f-9d07-f15c67377961",
      elements: {
        ids: [
          "18d4bce9-da94-45c6-b781-4c2ec2d0209c",
          "767b5151-9e61-4b93-a6af-1106432c063e",
          "40162efe-e397-41ac-9f1d-9b5ed6e539fd",
        ],
        types: ["v", "q", "q"],
      },
    },
    {
      level: 2,
      type: 12,
      title: "1-2 분자끼리 나누어떨어지는 분모가 같은 (분수) \\(\\div\\) (분수) ",
      id: "0ade6bd8-decf-4ebc-bc85-f83f6f923ad8",
      elements: {
        ids: [
          "a19fe67e-a9cb-4a0c-8e7a-23d246aa9138",
          "eeb519e8-8993-45c0-9c61-1faf889578ed",
          "d283ae24-a835-43cc-b08e-8e41a3f6147d",
        ],
        types: ["v", "q", "q"],
      },
    },
    {
      level: 2,
      type: 12,
      title: "1-3 분자끼리 나누어떨어지지 않는 분모가 같은 (분수) \\(\\div\\) (분수) ",
      id: "3f5e5851-edfc-4bc0-b8d5-17ee1d4e2bea",
      elements: {
        ids: [
          "d7aac2aa-ff6b-42ca-a4ef-1f4035eb5746",
          "6c641b05-d12e-422b-8cdb-e68db8e0e8e3",
          "4cd12212-9457-4c50-9f88-daa1c5d2f7d8",
        ],
        types: ["v", "q", "q"],
      },
    },
    {
      level: 2,
      type: 12,
      title: "1-4 분모가 같은 (분수) \\(\\div\\) (분수) 계산 방법 ",
      id: "9bcdf27a-ee78-458f-b84d-3439bf7c9ae0",
      elements: {
        ids: [
          "7260de2a-2bea-4c9c-89ae-b8bbdef08362",
          "72a1f9ea-af8f-420d-a531-48b43d867205",
          "0cfaac58-9e30-4486-8b2d-559f25878b29",
        ],
        types: ["v", "q", "q"],
      },
    },
    {
      level: 2,
      type: 11,
      title: "1-1~4 (분수) \\(\\div\\) (분수)를 알아볼까요 (1) 쪽지 시험",
      id: "63051802-13d5-4c84-9082-3a023afd004d",
      elements: {
        ids: [
          "f972142e-a0dc-4f66-8bde-0596f171cbc5",
          "633aee22-8b8a-418c-a509-9d0a6bd9a43c",
          "4a5e699e-2ceb-42c8-9dba-d88c0d612fdd",
          "517aa48e-c3f7-48df-8396-f944757d00c4",
          "ea1bc441-c873-4f9a-a5e2-780ebe12774f",
          "5c731648-180b-4eac-b82e-2c29159a36d4",
          "6bb58cef-af79-4a63-bafa-63fb58197ada",
          "471b4662-fb40-487e-b25c-4f81a2153474",
          "2ba8b1e1-554d-41a5-a457-131f3c11d1df",
          "e87db7da-5555-49d3-8120-722f0fc359a1",
        ],
        types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"],
      },
    },
    {
      level: 2,
      type: 12,
      title: "1-5 분자끼리 나누어떨어지는 분모가 다른 (분수) \\(\\div\\) (분수)",
      id: "edaac8bc-b3c2-4f15-bbec-7d2a9618ecea",
      elements: {
        ids: [
          "6c1da06c-0966-4711-bb92-37b63f0373b4",
          "87d7d4cb-bfc7-47f1-a08e-b9529d5cc9c6",
          "be9b6645-d514-4b0d-b0b3-384ce48733e5",
        ],
        types: ["v", "q", "q"],
      },
    },
    {
      level: 2,
      type: 12,
      title: "1-6 분자끼리 나누어떨어지지 않는 분모가 다른 (분수) \\(\\div\\) (분수)",
      id: "e63e030a-bc2c-43a9-a49e-13602481582f",
      elements: {
        ids: [
          "5e48bc09-d836-4663-aa7d-faf657d034b4",
          "a5c66cf0-4402-4bb0-bd1c-cb737359c40f",
          "d119db7c-d4cc-44ed-9262-ccff35618a08",
        ],
        types: ["v", "q", "q"],
      },
    },
    {
      level: 2,
      type: 12,
      title: "1-7 (자연수) \\(\\div\\) (분수)",
      id: "0a8356db-e8c3-4043-825f-b75d02f6d8b5",
      elements: {
        ids: [
          "7efac6fe-207d-49f9-b1be-d53c9118a3ba",
          "5d63407b-f974-4557-b307-4b20a1d981b1",
          "f1b17431-c110-4413-865d-71b33489cdcb",
        ],
        types: ["v", "q", "q"],
      },
    },
    {
      level: 2,
      type: 11,
      title: "1-5~7 (분수) \\(\\div\\) (분수)를 알아볼까요 (2) 쪽지 시험",
      id: "8171808d-a660-4a25-a79a-b024b13f9d5b",
      elements: {
        ids: [
          "cffd8cf4-6985-412a-90e3-fc02bb076186",
          "76e51f31-281f-44bf-94db-45fe03d8922e",
          "63b0deca-3921-43a5-9925-02bca2a5f9b2",
          "b653c882-4ea5-42d3-b632-b76bcba05855",
          "79203336-0a1c-42b2-b4d1-090641374a37",
          "1ef64c10-f023-4640-ab10-33559d3ae8a0",
          "b4e3d5cb-8938-47ae-bed7-9a2f574fa8fb",
          "fad1fb82-58a6-4192-b19f-4703453198e3",
          "5af0c17f-3432-4d52-bc2d-7c8e4777b3d5",
        ],
        types: ["q", "q", "q", "q", "q", "q", "q", "q", "q"],
      },
    },
    {
      level: 2,
      type: 12,
      title: "1-8 (분수) \\(\\div\\) (분수)를 (분수) \\( \\times\\) (분수)로 나타내기",
      id: "379aadf6-a66e-4ce3-b3e9-742c545ed8e3",
      elements: {
        ids: [
          "1d34097c-7c26-4868-a7eb-da64de47c77a",
          "96b7f5ce-b89b-4591-b4fd-1c9761cb24c6",
          "5c833535-7786-416b-b04d-8340351675ac",
        ],
        types: ["v", "q", "q"],
      },
    },
    {
      level: 2,
      type: 12,
      title: "1-9 (가분수) \\(\\div\\) (분수)의 계산 방법 알아보기",
      id: "73c80856-8abc-4b7c-9dba-cd51470a3b81",
      elements: {
        ids: [
          "9e793857-51db-4269-ba3c-8b4e4156adc5",
          "1309d419-71a1-4cf7-a1ea-3818248d1671",
          "bb6ff38f-8d32-41ba-8518-1dccd5759504",
        ],
        types: ["v", "q", "q"],
      },
    },
    {
      level: 2,
      type: 12,
      title: "1-10 (대분수) \\(\\div\\) (분수)의 계산 방법 알아보기",
      id: "ace975f3-23d4-4103-ae5c-23839dfdaa18",
      elements: {
        ids: [
          "e363747c-bfed-4d2e-a74c-c614a2b3eab2",
          "cbac7bbf-b152-443a-9743-2ec967b9132e",
          "a5e04e7a-f45d-4f59-b17a-9c6c3b5546d5",
        ],
        types: ["v", "q", "q"],
      },
    },
    {
      level: 2,
      type: 11,
      title: "1-8~10 (분수) \\(\\div\\) (분수)를 (분수) \\( \\times\\) (분수)로 나타내어 볼까요 쪽지 시험",
      id: "46a7a68f-659b-4750-9862-ac9c9e2597e6",
      elements: {
        ids: [
          "94c2db68-48f2-4eaf-aa15-de24867e6e98",
          "146b7030-706e-4f96-8789-0e93383e4701",
          "605f03b6-84f3-4e65-862a-bfeaa0b0607d",
          "4387f4ab-a0a5-4090-ac9d-19354c1323c4",
          "dd64ee66-e647-4488-87cc-4039fa360f07",
          "5193d623-0c72-4555-8794-f60a9e5a146e",
          "31d90932-0ae6-440c-b2e2-10cad6e6a5a7",
          "e32c11fa-a574-4a60-89eb-9e6b71f82ae3",
          "5a0b67ed-8bc6-4bf8-b254-f27881130eb9",
          "a4939141-d29d-4785-8ddc-c1b01d74f8bf",
        ],
        types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"],
      },
    },
    {
      level: 1,
      type: 0,
      title: "2. 소수의 나눗셈",
      id: "28106cbe-7e03-48d0-b0dc-43cd421887d7",
      elements: { ids: [], types: [] },
    },
    {
      level: 1,
      type: 0,
      title: "3. 공간과 입체",
      id: "dcac2c7b-bc0f-421f-b1d7-8d69d05a635f",
      elements: { ids: [], types: [] },
    },
    {
      level: 1,
      type: 0,
      title: "4. 비례식과 비례배분",
      id: "4ecd0fe8-3081-4dfb-ac1e-07733ae5a961",
      elements: { ids: [], types: [] },
    },
    {
      level: 1,
      type: 0,
      title: "5. 원의 넓이",
      id: "663b6775-8cfe-456e-b22d-45c7946e6b0a",
      elements: { ids: [], types: [] },
    },
    {
      level: 1,
      type: 0,
      title: "6. 원기둥, 원뿔, 구",
      id: "870b61bc-a7e9-4665-aebf-2e6b45a197fa",
      elements: { ids: [], types: [] },
    },
  ],
  kls: [
    { elements: {} },
    { elements: { kl: [[], [], []], types: ["v", "q", "q"] } },
    { elements: { kl: [[], [], []], types: ["v", "q", "q"] } },
    { elements: { kl: [[], [], []], types: ["v", "q", "q"] } },
    { elements: { kl: [[], [], []], types: ["v", "q", "q"] } },
    {
      elements: {
        kl: [[], [], [], [], [], [], [], [], [], []],
        types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"],
      },
    },
    { elements: { kl: [[], [], []], types: ["v", "q", "q"] } },
    { elements: { kl: [[], [], []], types: ["v", "q", "q"] } },
    { elements: { kl: [[], [], []], types: ["v", "q", "q"] } },
    { elements: { kl: [[], [], [], [], [], [], [], [], []], types: ["q", "q", "q", "q", "q", "q", "q", "q", "q"] } },
    { elements: { kl: [[], [], []], types: ["v", "q", "q"] } },
    { elements: { kl: [[], [], []], types: ["v", "q", "q"] } },
    { elements: { kl: [[], [], []], types: ["v", "q", "q"] } },
    {
      elements: {
        kl: [[], [], [], [], [], [], [], [], [], []],
        types: ["q", "q", "q", "q", "q", "q", "q", "q", "q", "q"],
      },
    },
    { elements: {} },
    { elements: {} },
    { elements: {} },
    { elements: {} },
    { elements: {} },
  ],
};

// mStudyResult
const studyResult = {
  property: [
    { id: "48de5eb3-2024-4b5f-88a1-a241bb38ecd7", title: "1. Welcome to My World", type: 0, level: 1 },
    { id: "a62f5c8a-30f8-4cbc-bc65-2b07c66635f5", title: "2. Discover Your Culture", type: 0, level: 1 },
    { id: "808cc5e4-4ccf-4267-90ae-948589381a53", title: "3. Spend Smart, Save Smart", type: 0, level: 1 },
    { id: "172ef3fa-5918-4fad-87f7-55fc0c58d8c8", title: "4. The Power of Ideas", type: 0, level: 1 },
    { id: "23682bb2-3a4f-46bf-93d4-fcfb76e2f5e8", title: "5. Follow Your Dream", type: 0, level: 1 },
    { id: "a2aa79cd-c919-412d-9138-94502bbc7ab0", title: "6. The Joy of Art", type: 0, level: 1 },
    { id: "8fc9b495-8e2e-4d9f-a80a-a7e152d7fce3", title: "7. Time for Storie", type: 0, level: 1 },
    {
      id: "0c9aabde-d743-4cc7-9238-8d623f165f49",
      title: "7. Topic1 : Voca",
      type: 11,
      level: 2,
      show: true,
      date: "2023-09-18",
      elements: { ids: ["el_id", "el_id", "el_id", "el_id", "el_id"], types: ["q", "q", "q", "q", "q"] },
      results: {
        repeat: [1, 1, 1, 1, 1],
        result: ["O", "O", "O", "O", "O"],
        first: ["O", "O", "O", "O", "O"],
        second: ["", "", "", "", ""],
      },

      progress: 100,
      point: 100,
    },
  ],
};
