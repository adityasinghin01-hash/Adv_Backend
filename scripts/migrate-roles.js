// scripts/migrate-roles.js
// One-time migration script to translate isAdmin (boolean) to role (string)
// Usage: RUN LOCALLY FIRST -> node scripts/migrate-roles.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { roles } = require('../config/roles');

const migrateRoles = async () => {
    let migrationFailed = false;

    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI environment variable is not set.');
            process.exit(1);
        }

        console.log(`Connecting to database at ${process.env.MONGO_URI.split('@')[1]}...`);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB.');

        const totalCount = await User.countDocuments({ role: { $exists: false } });
        console.log(`Found ${totalCount} users to migrate. Processing with cursor...`);

        let migratedCount = 0;

        const cursor = User.find({ role: { $exists: false } }).cursor();
        for await (const user of cursor) {
            const newRole = user.isAdmin ? roles.ADMIN : roles.USER;

            await User.updateOne(
                { _id: user._id },
                {
                    $set: { role: newRole, isBanned: user.isBanned ?? false },
                    $unset: { isAdmin: '' }
                }
            );
            migratedCount++;
        }

        console.log(`✅ Migration complete. Updated ${migratedCount} users.`);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        migrationFailed = true;
    } finally {
        await mongoose.connection.close();
        console.log('Disconnected from database.');
        process.exit(migrationFailed ? 1 : 0);
    }
};

migrateRoles();

