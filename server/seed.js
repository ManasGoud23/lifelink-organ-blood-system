const { sequelize, User, Inventory } = require('./db');
const { v4: uuidv4 } = require('uuid'); // I need to install uuid or use something else

// Since I don't want to install more packages if not needed, I'll use a simple random string gen
const generateId = (prefix) => prefix + '_' + Math.random().toString(36).substr(2, 9);

const locations = ['Hyderabad', 'Karimnagar', 'Warangal', 'Nizamabad', 'Secunderabad', 'Rangareddy', 'Medak', 'Siddipet'];
const hospitals_list = [
    'Apollo', 'Care', 'Yashoda', 'NIMS', 'Sunshine', 'Global', 'KIMS', 'Medicover',
    'Rainbow', 'Continental', 'MaxCure', 'Omni', 'Star', 'Lotus', 'Image', 'Life'
];

async function seed() {
    await sequelize.sync({ force: true });
    console.log('Database synced. Seeding hospitals...');

    // Create Admin
    await User.create({
        uid: 'admin_1',
        phone: '9111111111',
        password: 'admin123',
        name: 'Main Admin',
        userType: 'admin',
        location: 'Hyderabad',
        status: 'verified'
    });

    // Create Patient
    await User.create({
        uid: 'patient_1',
        phone: '9876543210',
        password: 'password123',
        name: 'John Doe',
        userType: 'patient',
        location: 'Hyderabad',
        status: 'verified'
    });

    // Create Known Hospital for Quick Login
    await User.create({
        uid: 'hosp_test_1',
        phone: '9988776655',
        password: 'hospital123',
        name: 'City Hospital (Test)',
        userType: 'hospital',
        location: 'Hyderabad',
        status: 'verified'
    });

    // Create 55 Hospitals
    for (let i = 1; i <= 55; i++) {
        const cityName = locations[Math.floor(Math.random() * locations.length)];
        const hospitalNamePrefix = hospitals_list[Math.floor(Math.random() * hospitals_list.length)];
        const name = `${hospitalNamePrefix} hospital ${i} ${cityName}`;

        // Random 10-digit phone
        const phone = '9' + Math.floor(Math.random() * 900000000 + 100000000).toString();
        const uid = 'hosp_' + i;

        await User.create({
            uid: uid,
            phone: phone,
            password: 'hospital123',
            name: name,
            userType: 'hospital',
            location: cityName,
            status: 'verified'
        });

        // Add some random inventory to each hospital
        const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
        const organTypes = ['Heart', 'Liver', 'Kidney', 'Pancreas', 'Lung'];

        // Add 1-2 random items
        for (let j = 0; j < 2; j++) {
            const isOrgan = Math.random() > 0.5;
            await Inventory.create({
                id: generateId('inv'),
                hospitalId: uid,
                hospitalName: name,
                bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
                organType: isOrgan ? organTypes[Math.floor(Math.random() * organTypes.length)] : null,
                quantity: Math.floor(Math.random() * 50) + 1,
                expiryDate: '2025-12-31'
            });
        }
    }

    console.log('Seeding complete! 55 hospitals created.');
    process.exit();
}

seed().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
