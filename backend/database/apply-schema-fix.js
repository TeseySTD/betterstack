require('dotenv/config');
const { dataSource } = require('./data-source');

async function applyFix() {
    await dataSource.initialize();
    const qr = dataSource.createQueryRunner();
    await qr.connect();

    try {
        console.log('Applying schema fixes...');

        // Add missing columns to users table
        try {
            await qr.query(`ALTER TABLE "users" ADD "fullName" character varying`);
            console.log('✓ Added fullName column');
        } catch (e) {
            if (e.message.includes('already exists')) {
                console.log('✓ fullName column already exists');
            } else {
                throw e;
            }
        }

        try {
            await qr.query(`ALTER TABLE "users" ADD "bio" text`);
            console.log('✓ Added bio column');
        } catch (e) {
            if (e.message.includes('already exists')) {
                console.log('✓ bio column already exists');
            } else {
                throw e;
            }
        }

        try {
            await qr.query(`ALTER TABLE "users" ADD "avatarUrl" character varying`);
            console.log('✓ Added avatarUrl column');
        } catch (e) {
            if (e.message.includes('already exists')) {
                console.log('✓ avatarUrl column already exists');
            } else {
                throw e;
            }
        }

        try {
            await qr.query(`ALTER TABLE "users" ADD "githubUrl" character varying`);
            console.log('✓ Added githubUrl column');
        } catch (e) {
            if (e.message.includes('already exists')) {
                console.log('✓ githubUrl column already exists');
            } else {
                throw e;
            }
        }

        try {
            await qr.query(`ALTER TABLE "users" ADD "linkedinUrl" character varying`);
            console.log('✓ Added linkedinUrl column');
        } catch (e) {
            if (e.message.includes('already exists')) {
                console.log('✓ linkedinUrl column already exists');
            } else {
                throw e;
            }
        }

        // Add authorId to software table
        try {
            await qr.query(`ALTER TABLE "software" ADD "authorId" integer NOT NULL DEFAULT 1`);
            console.log('✓ Added authorId column');
        } catch (e) {
            if (e.message.includes('already exists')) {
                console.log('✓ authorId column already exists');
            } else {
                throw e;
            }
        }

        // Add foreign key constraint if it doesn't exist
        try {
            await qr.query(`ALTER TABLE "software" ADD CONSTRAINT "FK_697d896d68e3bb29d819b437e35" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            console.log('✓ Added authorId foreign key constraint');
        } catch (e) {
            if (e.message.includes('already exists')) {
                console.log('✓ Foreign key constraint already exists');
            } else {
                throw e;
            }
        }

        console.log('Schema fix completed successfully!');
    } catch (error) {
        console.error('Error applying schema fix:', error.message);
        process.exit(1);
    } finally {
        await qr.release();
        await dataSource.destroy();
    }
}

applyFix();
