import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly service: CategoriesService) { }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    findAll() { return this.service.findAll(); }

    @Get(':id')
    @ApiOperation({ summary: 'Get category by ID' })
    findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

    @Post()
    @ApiOperation({ summary: 'Create new category' })
    create(@Body() dto: CreateCategoryDto) { return this.service.create(dto); }

    @Put(':id')
    @ApiOperation({ summary: 'Update category' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete category' })
    remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}