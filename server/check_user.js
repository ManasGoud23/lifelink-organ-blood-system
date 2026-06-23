const { User } = require('./db');

async function checkUser() {
    const user = await User.findOne({ where: { phone: '9740171349' } });
    if (user) {
        console.log('User Found:');
        console.log(`Name: ${user.name}`);
        console.log(`Phone: ${user.phone}`);
        console.log(`Password: ${user.password}`);
        console.log(`Type: ${user.userType}`);
    } else {
        console.log('User 9740171349 not found in database.');
    }
    process.exit();
}

checkUser();
