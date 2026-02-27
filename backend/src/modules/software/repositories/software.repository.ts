import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Software } from '../entities/software.entity';

@Injectable()
export class SoftwareRepository {
    constructor(
        @InjectRepository(Software)
        private readonly ormRepo: Repository<Software>,
    ) { }
    async onModuleInit() {
        const count = await this.ormRepo.count();
        if (count === 0) {
            console.log('[Software] Database is empty. Seeding default software tools...');
            await this.ormRepo.save([
                // Category 1: IDEs (Requires criteria 1 and 2)
                { categoryId: 1, name: 'JetBrains Rider', websiteUrl: 'https://jetbrains.com/rider', features: { "1": true, "2": 3.2 } },
                { categoryId: 1, name: 'Visual Studio Code', websiteUrl: 'https://code.visualstudio.com', features: { "1": true, "2": 1.5 } },

                // Category 2: Databases (Requires criteria 1 and 3)
                { categoryId: 2, name: 'DataGrip', websiteUrl: 'https://jetbrains.com/datagrip', features: { "1": true, "3": 199 } },
                { categoryId: 2, name: 'DBeaver', websiteUrl: 'https://dbeaver.io', features: { "1": true, "3": 0 } },

                // Category 3: Programming Languages (Requires criteria 4 and 5)
                { categoryId: 3, name: 'Rust', websiteUrl: 'https://rust-lang.org', features: { "4": true, "5": 'Steep' } },
                { categoryId: 3, name: 'Go', websiteUrl: 'https://go.dev', features: { "4": false, "5": 'Easy' } },
            ]);
        }
    }

    findAll() { return this.ormRepo.find(); }
    findById(id: number) { return this.ormRepo.findOneBy({ id }); }
    create(dto: any) { return this.ormRepo.save(dto); }
    update(id: number, dto: any) { return this.ormRepo.update(id, dto); }
    delete(id: number) { return this.ormRepo.delete(id); }

    deleteByCategoryId(categoryId: number) {
        return this.ormRepo.delete({ categoryId });
    }
}