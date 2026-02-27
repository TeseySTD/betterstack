import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { CriteriaModule } from './modules/criteria/criteria.module';

@Module({
  imports:[CategoriesModule, CriteriaModule],
})
export class AppModule {}
