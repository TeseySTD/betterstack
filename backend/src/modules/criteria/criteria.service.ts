import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCriterionDto } from './dto/create-criterion.dto';
import { UpdateCriterionDto } from './dto/update-criterion.dto';
import { CriteriaRepository } from './repositories/criteria.repository';

@Injectable()
export class CriteriaService {
    constructor(private readonly repo: CriteriaRepository,) { }

    findAll() { return this.repo.findAll(); }

    findOne(id: number) {
        const criterion = this.repo.findById(id);
        if (!criterion) throw new NotFoundException(`Criterion with ID ${id} not found`);
        return criterion;
    }

    create(dto: CreateCriterionDto) {
        const newCriterion = this.repo.create(dto);
        return newCriterion;
    }

    update(id: number, dto: UpdateCriterionDto) {
        const newCriterion = this.repo.update(id, dto);
        return newCriterion;
    }
    async remove(id: number) {
        const criterion = await this.repo.findById(id);
        if (!criterion) throw new NotFoundException(`Criterion with ID ${id} not found`);

        await this.repo.delete(id);

        return { success: true };
    }
}