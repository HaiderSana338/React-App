module.exports = (sequelize, Sequelize) => {
    const Phone = sequelize.define("phone", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        phoneType: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: Sequelize.STRING, // Consider using STRING for phone numbers
            allowNull: false,
        },
        contactId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'contacts', // This should match the table name of the Contact model
                key: 'id',
                onDelete: 'CASCADE', // Enable cascading deletion
            },
        },
    });

    return Phone;
};
