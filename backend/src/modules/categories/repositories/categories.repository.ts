import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoriesRepository {
    constructor(
        @InjectRepository(Category)
        private readonly ormRepo: Repository<Category>,
    ) { }
    
    async onModuleInit() {
        const count = await this.ormRepo.count();
        if (count === 0) {
            console.log('[Categories] Database is empty. Seeding default categories...');
            await this.ormRepo.save([
                { slug: 'ides', name: 'IDEs & Editors', requiredCriteriaIds: [1, 2] },
                { slug: 'databases', name: 'Database Clients', requiredCriteriaIds: [1, 3] },
                { slug: 'languages', name: 'Programming Languages', requiredCriteriaIds: [4, 5] },
            ]);
        }
    }

    findAll() { return this.ormRepo.find(); }
    findById(id: number) { return this.ormRepo.findOneBy({ id }); }
    create(dto: CreateCategoryDto) { return this.ormRepo.save(dto); }
    update(id: number, dto: any) { return this.ormRepo.update(id, dto); }
    delete(id: number) { return this.ormRepo.delete(id); }
}