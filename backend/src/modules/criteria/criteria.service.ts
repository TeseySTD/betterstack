import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCriterionDto } from './dto/create-criterion.dto';
import { UpdateCriterionDto } from './dto/update-criterion.dto';

@Injectable()
export class CriteriaService {
    private criteria = [
        { id: 1, name: 'Cross-platform', type: 'boolean', weight: 5 },
        { id: 2, name: 'Startup Time (sec)', type: 'number', weight: 8 },
        { id: 3, name: 'Price (USD)', type: 'number', weight: 10 },
    ];
    private nextId = 4;
    findAll() { return this.criteria; }

    findOne(id: number) {
        const criterion = this.criteria.find(c => c.id === id);
        if (!criterion) throw new NotFoundException(`Criterion with ID ${id} not found`);
        return criterion;
    }

    create(dto: CreateCriterionDto) {
        const newCriterion = { id: this.nextId++, ...dto };
        this.criteria.push(newCriterion);
        return newCriterion;
    }

    update(id: number, dto: UpdateCriterionDto) {
        const criterion = this.findOne(id);
        Object.assign(criterion, dto);
        return criterion;
    }

    remove(id: number) {
        const index = this.criteria.findIndex(c => c.id === id);
        if (index === -1) throw new NotFoundException(`Criterion with ID ${id} not found`);
        this.criteria.splice(index, 1);
        return { success: true };
    }
}