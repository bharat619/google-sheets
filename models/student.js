'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    studentName: DataTypes.STRING,
    gender: DataTypes.STRING,
    classLevel: DataTypes.STRING,
    homeState: DataTypes.STRING,
    major: DataTypes.STRING
  }, {});
  Student.associate = function(models) {
    // associations can be defined here
  };
  return Student;
};