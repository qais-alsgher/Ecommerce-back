"use strict";
class GeneralController {
  constructor(model) {
    this.model = model;
  }

  // general route for creating anything
  async create(obj) {
    try {
      return await this.model.create(obj);
    } catch (err) {
      console.log("Error in GeneralController.create: ", err.message);
    }
  }

  // general function for reading anything by id or all
  async read(id) {
    try {
      if (id) {
        return await this.model.findOne({ where: { id: id } });
      } else {
        return await this.model.findAll();
      }
    } catch (err) {
      console.log("Error in GeneralController.read: ", err.message);
    }
  }

  // general function for updating anything by id
  async update(id, obj) {
    try {
      const dataById = await this.model.findOne({ where: { id: id } });
      return await dataById.update(obj);
    } catch (err) {
      console.log("Error in GeneralController.update: ", err.message);
    }
  }

  // general function for deleting anything by id
  async delete(id) {
    try {
      return await this.model.destroy({ where: { id: id } });
    } catch (err) {
      console.log("Error in GeneralController.delete: ", err.message);
    }
  }
}

module.exports = GeneralController;
