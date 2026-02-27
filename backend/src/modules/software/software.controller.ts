import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SoftwareService } from './software.service';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';

@ApiTags('Software')
@Controller('software')
export class SoftwareController {
    constructor(private readonly service: SoftwareService) { }

    @Get()
    @ApiOperation({ summary: 'Get all software' })
    findAll() { return this.service.findAll(); }

    @Get(':id')
    @ApiOperation({ summary: 'Get software by id' })
    findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

    @Post()
    @ApiOperation({ summary: 'Create new software' })
    create(@Body() dto: CreateSoftwareDto) { return this.service.create(dto); }

    @Put(':id')
    @ApiOperation({ summary: 'Update software' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSoftwareDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete software' })
    remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}