import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { CustomQueriesModule } from 'src/custom/custom.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductModule } from 'src/product/product.module';
import { CartProductService } from './cart-product.service';
import { CartProduct } from './entities/cart-products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Product, CartProduct]),
    CustomQueriesModule,
    ProductModule,
  ],
  providers: [CartResolver, CartService, CartProductService],
})
export class CartModule {}
