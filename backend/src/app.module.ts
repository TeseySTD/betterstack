import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { CriteriaModule } from './modules/criteria/criteria.module';
import { SoftwareModule } from './modules/software/software.module';

@Module({
  imports:[CategoriesModule, CriteriaModule, SoftwareModule],
})
export class AppModule {}
