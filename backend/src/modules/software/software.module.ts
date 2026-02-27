import { Module } from "@nestjs/common";
import { SoftwareController } from "./software.controller";
import { SoftwareService } from "./software.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Software } from "./entities/software.entity";
import { SoftwareRepository } from "./repositories/software.repository";

@Module({
    imports: [TypeOrmModule.forFeature([Software])],
    controllers: [SoftwareController],
    providers: [SoftwareService, SoftwareRepository],
})
export class SoftwareModule { }