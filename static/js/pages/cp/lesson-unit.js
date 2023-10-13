// import * as apiLessonUnit from "../../core/api/api-lesson-unit";
// import * as apiQuestion from "../../core/api/api-question-atom";
// import * as apiVideo from "../../core/api/api-video-atom";
import { ApiCp } from "../../core/api/api-cp";
import { mtmBox } from "./mtm-box";
export const lessonUnit = function (options = {}) {
  this.options = options;

  this.data = null;
  this.id = null;

  this.index = null;

  this._init();
};

lessonUnit.prototype._init = function () {
  const boxOption = {
    onBoxClick: this.handleClick.bind(this),
    onCardClick: this.handleCardClick.bind(this),
    onCardCreateBtnClick: this.handleCardCreateBtnClick.bind(this),
    onCardDelete: this.handleCardDelete.bind(this),
    onCardShift: this.handleCardShift.bind(this),
  };
  this.clUnit = new mtmBox(boxOption);

  this.apiLessonUnit = new ApiCp("cp", "lesson_unit");
  this.apiQuestionAtom = new ApiCp("cp", "question_atom");
  this.apiVideoAtom = new ApiCp("cp", "video_atom");
};

// ===============================================================
// ============================ Handler ==========================
lessonUnit.prototype.handleClick = function (clBox) {
  if (this.options.onUnitClick) {
    this.options.onUnitClick(this);
  }
};

lessonUnit.prototype.handleCardClick = function (clCard) {
  // assign card to editor!
  if (this.options.onCardClick) {
    this.options.onCardClick(clCard);
  }
};

lessonUnit.prototype.handleCardCreateBtnClick = async function () {
  try {
    const index = this.clUnit.getCardsNum();
    console.log(index);
    index === 0 ? await this.addVideoCard(index) : await this.addQuestionCard(index);
  } catch (error) {
    console.log(error);
  }
};

lessonUnit.prototype.handleCardAdd = function (clCard) {
  this.clUnit.scrollToEnd();
  this.clUnit.selectCard(clCard);
  this.handleCardClick(clCard);
};

lessonUnit.prototype.handleCardDelete = function (clCard) {
  const contentId = clCard.getData().id;
  this.removeContentId(contentId);
  if (this.options.onCardDelete) {
    this.options.onCardDelete();
  }
};

lessonUnit.prototype.handleCardShift = function (oldIndex, newIndex) {
  this.shiftContentIds(oldIndex, newIndex);
};

// ===============================================================
// ============================== URL ============================
// ===============================================================
lessonUnit.prototype.urlGet = async function (id) {
  try {
    const data = await this.apiLessonUnit.get(id);
    return data;
  } catch (error) {
    console.error(error);
  }
};

lessonUnit.prototype.urlUpdate = async function (id, dataToUpdate) {
  try {
    const updatedData = await this.apiLessonUnit.update(id, dataToUpdate);
    this.data = updatedData;
    return updatedData;
  } catch (error) {
    console.log(error);
  }
};

lessonUnit.prototype.urlGetQuestion = async function (id) {
  try {
    const data = await this.apiQuestionAtom.get(id);
    return data;
  } catch (error) {
    console.error(error);
  }
};

lessonUnit.prototype.urlGetVideo = async function (id) {
  try {
    const data = await this.apiVideoAtom.get(id);
    return data;
  } catch (error) {
    console.error(error);
  }
};

lessonUnit.prototype.urlCreateQuestion = async function (dataToCreate = {}) {
  try {
    // const createdData = apiCreateQuestion(dataToCreate);
    const createdData = await this.apiQuestionAtom.create(dataToCreate);
    return createdData;
  } catch (error) {
    console.error(error);
  }
};

lessonUnit.prototype.urlCreateVideo = async function (dataToCreate = {}) {
  try {
    // const createdData = apiCreateVideo(dataToCreate);
    const createdData = await this.apiVideoAtom.create(dataToCreate);
    return createdData;
  } catch (error) {
    console.error(error);
  }
};

// ===============================================================
// ============================== API ============================
// ===============================================================
lessonUnit.prototype.getData = function () {
  return this.data;
};

lessonUnit.prototype.activate = async function (id) {
  try {
    this.clUnit.activate();

    const data = await this.urlGet(id);
    this.data = data;
    this.id = data.id;

    // console.log("lesson-unit > data : ", this.data);

    const content_ids = this.getValidIds(data.content_ids);
    this.initContents(content_ids);
  } catch (error) {
    console.error(error);
  }
};

lessonUnit.prototype.initContents = async function (contentIds) {
  const cardsNum = contentIds.length;
  // console.log("lesson-unit > initContents > contentIds: ", contentIds);
  for (let i = 0; i < cardsNum; i++) {
    const contentId = contentIds[i];

    if (i === 0) {
      const clCard = this.createVideoCard(i);
      this.setVideoCardData(clCard, contentId);
    } else {
      const clCard = this.createQuestionCard(i);
      this.setQuestionCardData(clCard, contentId);
    }
  }
};

lessonUnit.prototype.setVideoCardData = async function (clCard, contentId) {
  try {
    const data = await this.urlGetVideo(contentId);
    clCard.setData(data);
  } catch (error) {
    console.log(error);
  }
};
lessonUnit.prototype.setQuestionCardData = async function (clCard, contentId) {
  try {
    const data = await this.urlGetQuestion(contentId);
    clCard.setData(data);
  } catch (error) {
    console.log(error);
  }
};

lessonUnit.prototype.addQuestionCard = async function (index) {
  // create button click -> create video card-> set data -> updated content id
  try {
    const clCard = this.createQuestionCard(index);
    const data = await this.urlCreateQuestion();

    clCard.setData(data);
    this.handleCardAdd(clCard);

    const contentId = data.id;
    this.addContentId(contentId, index);
  } catch (error) {
    console.log(error);
  }
};

lessonUnit.prototype.addVideoCard = async function (index) {
  // create button click -> create video card-> set data -> updated content id
  try {
    const clCard = this.createVideoCard(index);
    const data = await this.urlCreateVideo();

    clCard.setData(data);
    this.handleCardAdd(clCard);

    const contentId = data.id;
    this.addContentId(contentId, index);
  } catch (error) {}
};

lessonUnit.prototype.createQuestionCard = function (index) {
  // create empty question card
  const clCard = this.clUnit.createQuestionCard(index);
  clCard.setIndex(index);
  return clCard;
};

lessonUnit.prototype.createVideoCard = function (index) {
  // create empty video card
  const clCard = this.clUnit.createVideoCard(index);
  clCard.setIndex(index);
  return clCard;
};

lessonUnit.prototype.addContentId = function (idToAdd, index) {
  // NOTICE
  // index는 일단 고려하지 말자. 어짜피 현재는 항상 마지막에 추가된다.
  const prevContentIdsText = this.data.content_ids;
  const prevContentIds = this.getValidIds(prevContentIdsText);

  prevContentIds.push(idToAdd);
  const nextContentIdsText = prevContentIds.join(",");
  const dataToUpdate = {
    content_ids: nextContentIdsText,
  };

  this.urlUpdate(this.id, dataToUpdate);
};

lessonUnit.prototype.removeContentId = function (idToDelete) {
  const prevContentIdsText = this.data.content_ids;
  const prevContentIds = this.getValidIds(prevContentIdsText);

  const nextContentIds = prevContentIds.filter((id) => id !== idToDelete);
  const dataToUpdate = {
    content_ids: nextContentIds.join(","),
  };
  this.urlUpdate(this.id, dataToUpdate);
};

lessonUnit.prototype.shiftContentIds = function (oldIndex, newIndex) {
  const contentIdsText = this.data.content_ids;
  const contentIds = contentIdsText.split(",");
  this.swapMethods(contentIds, oldIndex, newIndex);

  const dataToUpdate = {
    content_ids: contentIds.join(","),
  };
  this.urlUpdate(this.id, dataToUpdate);
};

lessonUnit.prototype.deactivate = function () {
  this.data = null;
  this.id = null;
  this.index = null;
  this.clUnit.deactivate();
};

lessonUnit.prototype.getRootElement = function () {
  return this.clUnit.getRootElement();
};

lessonUnit.prototype.setIndex = function (index) {
  this.index = index;
};

lessonUnit.prototype.getIndex = function () {
  return this.index;
};

lessonUnit.prototype.getId = function () {
  return this.id;
};

lessonUnit.prototype.unselect = function () {
  this.clUnit.unselect();
};

lessonUnit.prototype.getCardsNum = function () {
  return this.clUnit.getCardsNum();
};
// ===============================================================
// ============================= TOOL ============================
// ===============================================================
lessonUnit.prototype.getValidIds = function (textField) {
  // Handle Null or empty string
  if (!textField) return [];

  const ids = textField.split(",");
  // TODO!!!!
  // 현재 uuid 는 "-"가 있는 데이터도 있고 없는 데이터도 있다.
  // regex를 수정해야될까?
  // const validIds = ids.filter((id) => this.validateUUID(id.trim()));
  // return validIds;
  return ids;
};

lessonUnit.prototype.validateUUID = function (uuid) {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
};

lessonUnit.prototype.swapMethods = function (array, index1, index2) {
  const temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
};
