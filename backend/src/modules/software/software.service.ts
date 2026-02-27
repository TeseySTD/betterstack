import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';
import { Software } from './entities/software.entity';

@Injectable()
export class SoftwareService {
    private softwareList: Software[] = [
        {
            id: 1,
            categoryId: 1,
            name: 'JetBrains Rider',
            websiteUrl: 'https://...',
            features: [{ 1: true }, { 2: 3.2 }]
        },
        {
            id: 2,
            categoryId: 1,
            name: 'Visual Studio 2022',
            websiteUrl: 'https://...',
            features: [{ 1: false }, { 2: 5.1 }]
        }
    ];
    private nextId = 3;

    findAll() { return this.softwareList; }

    findOne(id: number) {
        const sw = this.softwareList.find(s => s.id === id);
        if (!sw) throw new NotFoundException(`Софт з ID ${id} не знайдено`);
        return sw;
    }

    create(dto: CreateSoftwareDto) {
        const newSw = { id: this.nextId++, ...dto };
        this.softwareList.push(newSw);
        return newSw;
    }

    update(id: number, dto: UpdateSoftwareDto) {
        const sw = this.findOne(id);
        Object.assign(sw, dto);
        return sw;
    }

    remove(id: number) {
        const index = this.softwareList.findIndex(s => s.id === id);
        if (index === -1) throw new NotFoundException(`Софт ${id} не знайдено`);
        this.softwareList.splice(index, 1);
        return { success: true };
    }
}