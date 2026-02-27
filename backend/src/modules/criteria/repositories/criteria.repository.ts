import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Criterion } from '../entities/criterion.entity';
import { CreateCriterionDto } from '../dto/create-criterion.dto';

@Injectable()
export class CriteriaRepository {
    constructor(
        @InjectRepository(Criterion)
        private readonly ormRepo: Repository<Criterion>,
    ) { }
    async onModuleInit() {
        const count = await this.ormRepo.count();
        if (count === 0) {
            console.log('[Criteria] Database is empty. Seeding default criteria...');
            await this.ormRepo.save([
                { name: 'Cross-platform', type: 'boolean', weight: 5 },       // ID: 1
                { name: 'Startup Time (sec)', type: 'number', weight: 8 },    // ID: 2
                { name: 'Price (USD)', type: 'number', weight: 10 },          // ID: 3
                { name: 'Memory Safety', type: 'boolean', weight: 9 },        // ID: 4
                { name: 'Learning Curve', type: 'string', weight: 4 },        // ID: 5
            ]);
        }
    }
    
    findAll() { return this.ormRepo.find(); }
    findById(id: number) { return this.ormRepo.findOneBy({ id }); }
    create(dto: CreateCriterionDto) { return this.ormRepo.save(dto); }
    update(id: number, dto: any) { return this.ormRepo.update(id, dto); }
    delete(id: number) { return this.ormRepo.delete(id); }
}