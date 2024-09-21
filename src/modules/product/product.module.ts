import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartProduct } from '../cart/entities/cart-products.entity';
import { CartProductService } from '../cart/services/cart-product.service';
import { ProductController } from './controllers/product.controller';
import { Product } from './entities/product.entity';
import { ProductResolver } from './resolvers/product.resolver';
import { ProductService } from './services/product.service';
import { SharedProductService } from 'src/shared/product-shared.service';
import { ProductMapper } from './mappers/product-mapper.service';
import { ProductRepository } from './repositories/product-repository.service';
import { CustomQueriesUtils } from 'src/common/utils/sharedQueries.service';
import { ErrorService } from 'src/common/services/errors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, CartProduct])],
  controllers: [ProductController],
  providers: [
    ProductResolver,
    ProductService,
    ProductMapper,
    ProductRepository,
    CartProductService,
    SharedProductService,
    CustomQueriesUtils,
    ErrorService,
  ],
  exports: [
    ProductService,
    SharedProductService,
    CustomQueriesUtils,
    ErrorService,
  ],
})
export class ProductModule {}
