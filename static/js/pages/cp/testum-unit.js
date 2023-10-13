// import * as apiTestumUnit from "../../core/api/api-testum-unit";
// import * as apiQuestion from "../../core/api/api-question-atom";
import { ApiCp } from "../../core/api/api-cp";
import { mtmBox } from "./mtm-box";
// require("../../../../css/core/view/component/section-question-box.css");
export const testumUnit = function (options = {}) {
  this.options = options;

  this.data = null;
  this.id = null;

  this.index = null;

  this._init();
};

testumUnit.prototype._init = function () {
  const boxOption = {
    onBoxClick: this.handleClick.bind(this),
    onCardClick: this.handleCardClick.bind(this),
    onCardCreateBtnClick: this.handleCardCreateBtnClick.bind(this),
    onCardDelete: this.handleCardDelete.bind(this),
    onCardShift: this.handleCardShift.bind(this),
  };
  this.clUnit = new mtmBox(boxOption);

  this.apiTestumUnit = new ApiCp("cp", "testum");
  this.apiQuestionAtom = new ApiCp("cp", "question_atom");
};

// ===============================================================
// ============================ Handler ==========================
testumUnit.prototype.handleClick = function (clBox) {
  if (this.options.onUnitClick) {
    this.options.onUnitClick(this);
  }
};

testumUnit.prototype.handleCardClick = function (clCard) {
  // assign card to editor!
  if (this.options.onCardClick) {
    this.options.onCardClick(clCard);
  }
};

testumUnit.prototype.handleCardCreateBtnClick = async function () {
  try {
    const index = this.clUnit.getCardsNum();
    await this.addQuestionCard(index);
  } catch (error) {
    console.log(error);
  }
};

testumUnit.prototype.handleCardAdd = function (clCard) {
  this.clUnit.scrollToEnd();
  this.clUnit.selectCard(clCard);
  this.handleCardClick(clCard);
};

testumUnit.prototype.handleCardDelete = function (clCard) {
  const contentId = clCard.getData().id;
  this.removeContentId(contentId);
  if (this.options.onCardDelete) {
    this.options.onCardDelete();
  }
};

testumUnit.prototype.handleCardShift = function (oldIndex, newIndex) {
  this.shiftContentIds(oldIndex, newIndex);
};

// ===============================================================
// ============================== URL ============================
// ===============================================================
testumUnit.prototype.urlGet = async function (id) {
  try {
    const data = await this.apiTestumUnit.get(id);
    return data;
  } catch (error) {
    console.error(error);
  }
};

testumUnit.prototype.urlUpdate = async function (id, dataToUpdate) {
  try {
    const updatedData = await this.apiTestumUnit.update(id, dataToUpdate);
    this.data = updatedData;
    return updatedData;
  } catch (error) {
    console.log(error);
  }
};

testumUnit.prototype.urlGetQuestion = async function (id) {
  try {
    const data = await this.apiQuestionAtom.get(id);
    return data;
  } catch (error) {
    console.error(error);
  }
};

testumUnit.prototype.urlCreateQuestion = async function (dataToCreate = {}) {
  try {
    const createdData = await this.apiQuestionAtom.create(dataToCreate);
    return createdData;
  } catch (error) {
    console.error(error);
  }
};
// ===============================================================
// ============================== API ============================
// ===============================================================
testumUnit.prototype.getData = function () {
  return this.data;
};

testumUnit.prototype.activate = async function (id) {
  try {
    this.clUnit.activate();

    const data = await this.urlGet(id);
    this.data = data;
    this.id = data.id;

    // console.log("testum-unit > data : ", this.data);

    const content_ids = this.getValidIds(data.content_ids);
    this.initContents(content_ids);
  } catch (error) {
    console.error(error);
  }
};

testumUnit.prototype.initContents = async function (contentIds) {
  const cardsNum = contentIds.length;
  // console.log("lesson-unit > initContents > contentIds: ", contentIds);
  for (let i = 0; i < cardsNum; i++) {
    const contentId = contentIds[i];
    const clCard = this.createQuestionCard(i);
    this.setQuestionCardData(clCard, contentId);
  }
};

testumUnit.prototype.setQuestionCardData = async function (clCard, contentId) {
  try {
    const data = await this.urlGetQuestion(contentId);
    clCard.setData(data);
  } catch (error) {
    console.log(error);
  }
};

testumUnit.prototype.addQuestionCard = async function (index) {
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

testumUnit.prototype.createQuestionCard = function (index) {
  // create empty question card
  const clCard = this.clUnit.createQuestionCard(index);
  clCard.setIndex(index);
  return clCard;
};

testumUnit.prototype.addContentId = function (idToAdd, index) {
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

testumUnit.prototype.removeContentId = function (idToDelete) {
  const prevContentIdsText = this.data.content_ids;
  const prevContentIds = this.getValidIds(prevContentIdsText);

  const nextContentIds = prevContentIds.filter((id) => id !== idToDelete);
  const dataToUpdate = {
    content_ids: nextContentIds.join(","),
  };
  this.urlUpdate(this.id, dataToUpdate);
};

testumUnit.prototype.shiftContentIds = function (oldIndex, newIndex) {
  const contentIdsText = this.data.content_ids;
  const contentIds = contentIdsText.split(",");
  this.swapMethods(contentIds, oldIndex, newIndex);

  const dataToUpdate = {
    content_ids: contentIds.join(","),
  };
  this.urlUpdate(this.id, dataToUpdate);
};

testumUnit.prototype.deactivate = function () {
  this.data = null;
  this.id = null;
  this.index = null;
  this.clUnit.deactivate();
};

testumUnit.prototype.getRootElement = function () {
  return this.clUnit.getRootElement();
};

testumUnit.prototype.setIndex = function (index) {
  this.index = index;
};

testumUnit.prototype.getIndex = function () {
  return this.index;
};

testumUnit.prototype.getId = function () {
  return this.id;
};

testumUnit.prototype.unselect = function () {
  this.clUnit.unselect();
};

testumUnit.prototype.getCardsNum = function () {
  return this.clUnit.getCardsNum();
};
// ===============================================================
// ============================= TOOL ============================
// ===============================================================
testumUnit.prototype.getValidIds = function (textField) {
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

testumUnit.prototype.validateUUID = function (uuid) {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
};

testumUnit.prototype.swapMethods = function (array, index1, index2) {
  const temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
};
