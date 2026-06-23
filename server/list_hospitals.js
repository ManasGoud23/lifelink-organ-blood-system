const { User } = require('./db');
async function listHospitals() {
    const hospitals = await User.findAll({ where: { userType: 'hospital' }, limit: 5 });
    hospitals.forEach(h => {
        console.log(`HOSPITAL: ${h.name} | PHONE: ${h.phone} | PW: hospital123 | LOC: ${h.location}`);
    });
    process.exit();
}
listHospitals();
