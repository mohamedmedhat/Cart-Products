import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { CustomQueriesModule } from 'src/custom/custom.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CustomQueriesModule,
  ],
  controllers: [ProductController],
  providers: [ProductResolver, ProductService],
  exports:[ProductService]
})
export class ProductModule {}
