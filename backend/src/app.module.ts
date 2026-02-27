import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { CriteriaModule } from './modules/criteria/criteria.module';
import { SoftwareModule } from './modules/software/software.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'betterstack_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    EventEmitterModule.forRoot(),

    CategoriesModule,
    CriteriaModule,
    SoftwareModule,
  ],
})
export class AppModule { }
