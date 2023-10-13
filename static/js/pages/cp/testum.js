import { testumUnit } from "./testum-unit";
// import * as api from "../../core/api/api-testum";
// import * as apiTestumUnit from "../../core/api/api-testum-unit";
import { removeChildNodes } from "../../core/utils/remove-child-nodes";
import { ApiCp } from "../../core/api/api-cp";

export const mtmTestum = function (element, options = {}) {
  if (!element) {
    throw new Error("you need element of testum");
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

mtmTestum.prototype._init = function () {
  this._initAPI();
  this._initVariable();
};

mtmTestum.prototype._initAPI = function () {
  this.apiTestum = new ApiCp("cp", "testum");
  this.apiTestumUnit = new ApiCp("cp", "testum_unit");
};

mtmTestum.prototype._initVariable = function () {
  this.data = null;
  this.id = null;

  this.clUnits = [];
  this.clSelectedUnit = null;
};

// ===============================================================
// ============================= Handler =========================
// ===============================================================
mtmTestum.prototype.handleUnitClick = function (clUnit) {
  if (this.clSelectedUnit !== clUnit) {
    this.setSelectedUnit(clUnit);
  }
  // editor -> deactivate?
  if (this.options.onUnitClick) {
    const cardsNum = clUnit.getCardsNum();
    this.options.onUnitClick(cardsNum);
  }
};

mtmTestum.prototype.handleCardClick = function (clCard) {
  if (this.options.onCardClick) {
    this.options.onCardClick(clCard);
  }
};

mtmTestum.prototype.handleCardDelete = function () {
  // editor -> deactivate?
  if (this.options.onCardDelete) {
    this.options.onCardDelete();
  }
};
// ===============================================================
// ============================= URL =============================
// ===============================================================
//testum
mtmTestum.prototype.urlGet = async function (id) {
  try {
    // const data = await api.get(id);
    const data = await this.apiTestum.get(id);
    return data;
  } catch (err) {
    console.error(err);
  }
};

mtmTestum.prototype.urlUpdate = async function (id, dataToUpdate) {
  try {
    const updatedData = await this.apiTestum.update(id, dataToUpdate);
    this.data = updatedData;
    return updatedData;
  } catch (err) {
    console.error(err);
  }
};

mtmTestum.prototype.urlCreateUnit = async function (dataToCreate) {
  try {
    const newUnitData = await this.apiTestumUnit.create(dataToCreate);
    return newUnitData;
  } catch (error) {
    console.log(error);
  }
};

// ===============================================================
// ============================= API =============================
// ===============================================================
mtmTestum.prototype.activate = async function (id) {
  try {
    this.deactivate();
    const data = await this.urlGet(id);
    this.data = data;
    this.id = data.id;
    console.log("testum > data : ", this.data);
    const unitIds = this.getValidIds(data.unit_ids);
    console.log("testum > unitIds: ", unitIds);
    for (let i = 0; i < unitIds.length; i++) {
      const unitId = unitIds[i];
      const unitIndex = i;
      this.addUnit(unitId, unitIndex);
    }
  } catch (err) {
    console.error(err);
  }
};

mtmTestum.prototype.deactivate = function () {
  this._initVariable();
  this.resetUnitElements();
};

mtmTestum.prototype.addUnit = async function (unitId, unitIndex) {
  const clUnit = new testumUnit(this.unitOption);
  clUnit.activate(unitId);
  this.setUnitIndex(clUnit, unitIndex);

  this.clUnits.splice(unitIndex, 0, clUnit);
  const elUnit = clUnit.getRootElement();
  this.addUnitElement(elUnit, unitIndex);
  //   this.handleUnitCreate(elUnit);
};

mtmTestum.prototype.addUnitElement = function (element, index) {
  this.elThis.insertBefore(element, this.elThis.children[index]);
};

mtmTestum.prototype.createUnit = async function () {
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

mtmTestum.prototype.addUnitId = function (idToAdd) {
  const prevUnitIdsText = this.data.unit_ids;
  const prevUnitIds = this.getValidIds(prevUnitIdsText);
  prevUnitIds.push(idToAdd);

  const nextUnitIdsText = prevUnitIds.join(",");

  const dataToUpdate = {
    unit_ids: nextUnitIdsText,
  };
  this.urlUpdate(this.id, dataToUpdate);
};

mtmTestum.prototype.deleteUnit = function () {
  if (!this.clSelectedUnit) {
    console.error("you might have error in testum > deleteUnit");
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

mtmTestum.prototype.removeUnitElement = function (index) {
  this.elThis.removeChild(this.elThis.children[index]);
};

mtmTestum.prototype.removeUnitId = function (idToRemove) {
  const prevUnitIdsText = this.data.unit_ids;
  const prevUnitIds = this.getValidIds(prevUnitIdsText);

  const nextUnitIds = prevUnitIds.filter((id) => id !== idToRemove);

  const dataToUpdate = {
    unit_ids: nextUnitIds.join(","),
  };
  this.urlUpdate(this.id, dataToUpdate);
};

mtmTestum.prototype.resetUnitElements = function () {
  removeChildNodes.removeAll(this.elThis);
};

mtmTestum.prototype.resetUnitIndex = function () {
  this.clUnits.forEach((clUnit, index) => {
    this.setUnitIndex(clUnit, index);
  });
};

mtmTestum.prototype.setUnitIndex = function (clUnit, index) {
  clUnit.setIndex(index);
};

mtmTestum.prototype.shiftUnit = function (oldIndex, newIndex) {
  this.swapMethods(this.clUnits, oldIndex, newIndex);
  this.resetUnitIndex();

  const unit_ids = this.data.unit_ids.split(",");

  this.swapMethods(unit_ids, oldIndex, newIndex);
  const dataToUpdate = {
    unit_ids: unit_ids.join(","),
  };

  this.urlUpdate(this.id, dataToUpdate);
};

mtmTestum.prototype.setSelectedUnit = function (clSelectedUnit) {
  this.resetSelectedUnit();
  this.clSelectedUnit = clSelectedUnit;
};

mtmTestum.prototype.resetSelectedUnit = function () {
  if (this.clSelectedUnit) {
    this.clSelectedUnit.unselect();
    this.clSelectedUnit = null;
  }
};
// ===============================================================
// ============================= TOOL ============================
// ===============================================================
mtmTestum.prototype.getValidIds = function (textField) {
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

mtmTestum.prototype.validateUUID = function (uuid) {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
};

mtmTestum.prototype.swapMethods = function (array, index1, index2) {
  const temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
};
