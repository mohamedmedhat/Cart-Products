import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { CustomQueriesModule } from 'src/custom/custom.module';
import { CartProductService } from 'src/cart/cart-product.service';
import { CartProduct } from 'src/cart/entities/cart-products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, CartProduct]),
    CustomQueriesModule,
  ],
  controllers: [ProductController],
  providers: [ProductResolver, ProductService, CartProductService],
  exports: [ProductService],
})
export class ProductModule {}
