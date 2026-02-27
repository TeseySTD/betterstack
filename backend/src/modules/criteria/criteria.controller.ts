import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CriteriaService } from './criteria.service';
import { CreateCriterionDto } from './dto/create-criterion.dto';
import { UpdateCriterionDto } from './dto/update-criterion.dto';

@ApiTags('Criteria')
@Controller('criteria')
export class CriteriaController {
    constructor(private readonly service: CriteriaService) { }

    @Get()
    @ApiOperation({ summary: 'Get all criteria' })
    findAll() { return this.service.findAll(); }

    @Get(':id')
    @ApiOperation({ summary: 'Get criterion by ID' })
    findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

    @Post()
    @ApiOperation({ summary: 'Create new criterion' })
    create(@Body() dto: CreateCriterionDto) { return this.service.create(dto); }

    @Put(':id')
    @ApiOperation({ summary: 'Update criterion' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCriterionDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete criterion' })
    remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}