require('dotenv/config');
const { dataSource } = require('./data-source');

async function markMigrationExecuted() {
    await dataSource.initialize();
    const qr = dataSource.createQueryRunner();
    await qr.connect();

    try {
        console.log('Marking migration as executed...');

        // Check if migration already exists in the migrations table
        const existing = await qr.query(
            `SELECT * FROM "migrations" WHERE "name" = $1`,
            ['AddMissingColumnsToUsers1773972780316']
        );

        if (existing.length === 0) {
            // Insert the migration record
            await qr.query(
                `INSERT INTO "migrations" ("name", "timestamp") VALUES ($1, $2)`,
                ['AddMissingColumnsToUsers1773972780316', Math.floor(Date.now() / 1000)]
            );
            console.log('✓ Migration marked as executed');
        } else {
            console.log('✓ Migration already marked as executed');
        }
    } catch (error) {
        console.error('Error marking migration as executed:', error.message);
        process.exit(1);
    } finally {
        await qr.release();
        await dataSource.destroy();
    }
}

markMigrationExecuted();
