import { lessonUnit } from "./lesson-unit";
// import * as api from "../../core/api/api-lesson";
// import * as apiLessonUnit from "../../core/api/api-lesson-unit";
import { removeChildNodes } from "../../core/utils/remove-child-nodes";
import { ApiCp } from "../../core/api/api-cp";

export const mtmLesson = function (element, options = {}) {
  if (!element) {
    throw new Error("you need element of lesson");
  }

  this.elThis = element;
  this.options = options;
  this.unitOption = {
    onUnitClick: this.handleUnitClick.bind(this),
    onCardClick: this.handleCardClick.bind(this),
    onCardDelete: this.handleCardDelete.bind(this),
  };
  this._init();
};

mtmLesson.prototype._init = function () {
  this._initVariable();
  this._initAPI();
};

mtmLesson.prototype._initAPI = function () {
  this.apiLesson = new ApiCp("cp", "lesson");
  this.apiLessonUnit = new ApiCp("cp", "lesson_unit");
};

mtmLesson.prototype._initVariable = function () {
  this.data = null;
  this.id = null;

  this.clUnits = [];
  this.clSelectedUnit = null;
};

// ===============================================================
// ============================= Handler =========================
// ===============================================================
mtmLesson.prototype.handleUnitClick = function (clUnit) {
  if (this.clSelectedUnit !== clUnit) {
    this.setSelectedUnit(clUnit);
  }
  // editor -> deactivate?
  if (this.options.onUnitClick) {
    const cardsNum = clUnit.getCardsNum();
    this.options.onUnitClick(cardsNum);
  }
};

mtmLesson.prototype.handleCardClick = function (clCard) {
  if (this.options.onCardClick) {
    this.options.onCardClick(clCard);
  }
};

mtmLesson.prototype.handleCardDelete = function () {
  // editor -> deactivate?
  if (this.options.onCardDelete) {
    this.options.onCardDelete();
  }
};
// ===============================================================
// ============================= URL =============================
// ===============================================================
//lesson
mtmLesson.prototype.urlGet = async function (id) {
  try {
    const data = await this.apiLesson.get(id);
    return data;
  } catch (err) {
    console.error(err);
  }
};

mtmLesson.prototype.urlUpdate = async function (id, dataToUpdate) {
  try {
    const updatedData = await this.apiLesson.update(id, dataToUpdate);
    this.data = updatedData;
    return updatedData;
  } catch (err) {
    console.error(err);
  }
};

mtmLesson.prototype.urlCreateUnit = async function (dataToCreate) {
  try {
    const newUnitData = await this.apiLessonUnit.create(dataToCreate);
    return newUnitData;
  } catch (error) {
    console.log(error);
  }
};

// ===============================================================
// ============================= API =============================
// ===============================================================
mtmLesson.prototype.activate = async function (id) {
  try {
    this.deactivate();
    const data = await this.urlGet(id);
    this.data = data;
    this.id = data.id;
    console.log("lesson > data : ", this.data);
    const unitIds = this.getValidIds(data.unit_ids);
    console.log("lesson > unitIds: ", unitIds);
    for (let i = 0; i < unitIds.length; i++) {
      const unitId = unitIds[i];
      const unitIndex = i;
      this.addUnit(unitId, unitIndex);
    }
  } catch (err) {
    console.error(err);
  }
};

mtmLesson.prototype.deactivate = function () {
  this._initVariable();
  this.resetUnitElements();
};

mtmLesson.prototype.addUnit = async function (unitId, unitIndex) {
  const clUnit = new lessonUnit(this.unitOption);
  clUnit.activate(unitId);
  this.setUnitIndex(clUnit, unitIndex);

  this.clUnits.splice(unitIndex, 0, clUnit);
  const elUnit = clUnit.getRootElement();
  this.addUnitElement(elUnit, unitIndex);
  //   this.handleUnitCreate(elUnit);
};

mtmLesson.prototype.addUnitElement = function (element, index) {
  this.elThis.insertBefore(element, this.elThis.children[index]);
};

mtmLesson.prototype.createUnit = async function () {
  try {
    const unitData = await this.urlCreateUnit();
    const id = unitData.id;
    const index = this.clUnits.length;
    this.addUnit(id, index);
    this.addUnitId(id);
  } catch (err) {
    console.error(err);
  }
};

mtmLesson.prototype.addUnitId = function (idToAdd) {
  const prevUnitIdsText = this.data.unit_ids;
  const prevUnitIds = this.getValidIds(prevUnitIdsText);
  prevUnitIds.push(idToAdd);

  const nextUnitIdsText = prevUnitIds.join(",");

  const dataToUpdate = {
    unit_ids: nextUnitIdsText,
  };
  this.urlUpdate(this.id, dataToUpdate);
};

mtmLesson.prototype.deleteUnit = function () {
  if (!this.clSelectedUnit) {
    console.error("you might have error in lesson > deleteUnit");
    return;
  }

  const index = this.clSelectedUnit.getIndex();
  const id = this.clSelectedUnit.getId();

  this.removeUnitElement(index);
  this.resetSelectedUnit();

  this.clUnits.splice(index, 1);
  this.resetUnitIndex();

  this.removeUnitId(id);
};

mtmLesson.prototype.removeUnitElement = function (index) {
  this.elThis.removeChild(this.elThis.children[index]);
};

mtmLesson.prototype.removeUnitId = function (idToRemove) {
  const prevUnitIdsText = this.data.unit_ids;
  const prevUnitIds = this.getValidIds(prevUnitIdsText);

  const nextUnitIds = prevUnitIds.filter((id) => id !== idToRemove);

  const dataToUpdate = {
    unit_ids: nextUnitIds.join(","),
  };
  this.urlUpdate(this.id, dataToUpdate);
};

mtmLesson.prototype.resetUnitElements = function () {
  removeChildNodes.removeAll(this.elThis);
};

mtmLesson.prototype.resetUnitIndex = function () {
  this.clUnits.forEach((clUnit, index) => {
    this.setUnitIndex(clUnit, index);
  });
};

mtmLesson.prototype.setUnitIndex = function (clUnit, index) {
  clUnit.setIndex(index);
};

mtmLesson.prototype.shiftUnit = function (oldIndex, newIndex) {
  this.swapMethods(this.clUnits, oldIndex, newIndex);
  this.resetUnitIndex();

  const unit_ids = this.data.unit_ids.split(",");

  this.swapMethods(unit_ids, oldIndex, newIndex);
  const dataToUpdate = {
    unit_ids: unit_ids.join(","),
  };

  this.urlUpdate(this.id, dataToUpdate);
};

mtmLesson.prototype.setSelectedUnit = function (clSelectedUnit) {
  this.resetSelectedUnit();
  this.clSelectedUnit = clSelectedUnit;
};

mtmLesson.prototype.resetSelectedUnit = function () {
  if (this.clSelectedUnit) {
    this.clSelectedUnit.unselect();
    this.clSelectedUnit = null;
  }
};
// ===============================================================
// ============================= TOOL ============================
// ===============================================================
mtmLesson.prototype.getValidIds = function (textField) {
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

mtmLesson.prototype.validateUUID = function (uuid) {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
};

mtmLesson.prototype.swapMethods = function (array, index1, index2) {
  const temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
};
