// scripts/migrate-roles.js
// One-time migration script to translate isAdmin (boolean) to role (string)
// Usage: RUN LOCALLY FIRST -> node scripts/migrate-roles.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { roles } = require('../config/roles');

const migrateRoles = async () => {
    try {
        console.log(`Connecting to database at ${process.env.MONGO_URI.split('@')[1]}...`);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB.');

        const users = await User.find({});
        console.log(`Found ${users.length} users. Migrating...`);

        let migratedCount = 0;

        for (const user of users) {
            let userUpdated = false;

            // Migrate role
            if (!user.role) {
                user.role = user.isAdmin ? roles.ADMIN : roles.USER;
                userUpdated = true;
            }

            // Ensure isBanned field exists
            if (user.isBanned === undefined) {
                user.isBanned = false;
                userUpdated = true;
            }

            // Remove legacy isAdmin flag
            if (user.isAdmin !== undefined) {
                user.isAdmin = undefined;
                userUpdated = true;
            }

            if (userUpdated) {
                await user.save({ validateBeforeSave: false }); // Skip validation in case other schema rules changed
                migratedCount++;
            }
        }

        // Clean up schema to drop isAdmin entirely
        await mongoose.connection.collection('users').updateMany(
            { isAdmin: { $exists: true } },
            { $unset: { isAdmin: "" } }
        );

        console.log(`✅ Migration complete. Updated ${migratedCount} users.`);
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await mongoose.connection.close();
        console.log('Disconnected from database.');
        process.exit(0);
    }
};

migrateRoles();
