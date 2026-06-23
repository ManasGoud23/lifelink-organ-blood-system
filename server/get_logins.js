const { sequelize, User } = require('./db');

async function listAll() {
    await sequelize.authenticate();
    const hospitals = await User.findAll({
        where: { userType: 'hospital' },
        attributes: ['name', 'phone', 'location'],
        order: [['location', 'ASC']]
    });

    console.log('--- HOSPITAL LOGIN DIRECTORY ---');
    console.log('NOTE: ALL PASSWORDS ARE: hospital123');
    console.log('------------------------------');

    hospitals.forEach((h, i) => {
        console.log(`${i + 1}. ${h.name.padEnd(35)} | Phone: ${h.phone} | Loc: ${h.location}`);
    });
    process.exit();
}

listAll();
