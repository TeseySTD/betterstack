import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    private categories = [
        { id: 1, slug: 'ides', name: 'IDEs', description: 'Integrated Dev Environments' },
    ];
    private nextId = 2;

    findAll() { return this.categories; }

    findOne(id: number) {
        const category = this.categories.find(c => c.id === id);
        if (!category) throw new NotFoundException(`Category with ID ${id} not found`);
        return category;
    }

    create(dto: CreateCategoryDto) {
        const newCategory = { id: this.nextId++, ...dto };
        this.categories.push(newCategory);
        return newCategory;
    }

    update(id: number, dto: UpdateCategoryDto) {
        const category = this.findOne(id);
        Object.assign(category, dto);
        return category;
    }

    remove(id: number) {
        const index = this.categories.findIndex(c => c.id === id);
        if (index === -1) throw new NotFoundException(`Category with ID ${id} not found`);
        this.categories.splice(index, 1);
        return { success: true };
    }
}