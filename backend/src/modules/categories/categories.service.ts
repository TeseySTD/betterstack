import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './repositories/categories.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CategoriesService {
    constructor(
        private readonly repo: CategoriesRepository,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    findAll() { return this.repo.findAll(); }

    findOne(id: number) {
        const category = this.repo.findById(id);
        if (!category) throw new NotFoundException(`Category with ID ${id} not found`);
        return category;
    }

    create(dto: CreateCategoryDto) {
        const newCategory = this.repo.create(dto);
        return newCategory;
    }

    update(id: number, dto: UpdateCategoryDto) {
        const updatedCategory = this.repo.update(id, dto);
        return updatedCategory;
    }

    async remove(id: number) {
        const category = await this.repo.findById(id);
        if (!category) throw new NotFoundException('Category not found');

        await this.repo.delete(id);

        this.eventEmitter.emit('category.deleted', { categoryId: id });

        return { success: true };
    }
}