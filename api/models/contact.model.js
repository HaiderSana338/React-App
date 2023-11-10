module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("contact", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        contactName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    });
  
    return Contact;
};