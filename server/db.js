const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
});

const User = sequelize.define('User', {
    uid: { type: DataTypes.STRING, primaryKey: true },
    phone: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    userType: { type: DataTypes.ENUM('patient', 'hospital', 'admin'), defaultValue: 'patient' },
    location: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 'verified' }
});

const Inventory = sequelize.define('Inventory', {
    id: { type: DataTypes.STRING, primaryKey: true },
    hospitalId: { type: DataTypes.STRING, allowNull: false },
    hospitalName: { type: DataTypes.STRING },
    bloodType: { type: DataTypes.STRING },
    organType: { type: DataTypes.STRING },
    quantity: { type: DataTypes.INTEGER },
    expiryDate: { type: DataTypes.STRING },
    addedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

const Request = sequelize.define('Request', {
    id: { type: DataTypes.STRING, primaryKey: true },
    patientId: { type: DataTypes.STRING, allowNull: false },
    patientName: { type: DataTypes.STRING },
    patientPhone: { type: DataTypes.STRING },
    patientLocation: { type: DataTypes.STRING },
    hospitalId: { type: DataTypes.STRING, allowNull: false },
    bloodType: { type: DataTypes.STRING },
    organType: { type: DataTypes.STRING },
    requestType: { type: DataTypes.STRING, defaultValue: 'EMERGENCY' },
    status: { type: DataTypes.STRING, defaultValue: 'PENDING' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// Associations
User.hasMany(Inventory, { foreignKey: 'hospitalId', sourceKey: 'uid' });
Inventory.belongsTo(User, { foreignKey: 'hospitalId', targetKey: 'uid' });

module.exports = { sequelize, User, Inventory, Request };
