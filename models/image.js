'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(models.Image, {foreignKey: 'user_id'})
      models.Image.belongsTo(models.User, {foreignKey: 'user_id'})
    }
  };
  Image.init({
    image_path: DataTypes.STRING,
    user_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};