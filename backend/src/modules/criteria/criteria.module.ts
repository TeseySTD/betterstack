import { Module } from "@nestjs/common";
import { CriteriaService } from "./criteria.service";
import { CriteriaController } from "./criteria.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Criterion } from "./entities/criterion.entity";
import { CriteriaRepository } from "./repositories/criteria.repository";

@Module({
    imports: [TypeOrmModule.forFeature([Criterion])],
    controllers: [CriteriaController],
    providers: [CriteriaService, CriteriaRepository],
})
export class CriteriaModule { }