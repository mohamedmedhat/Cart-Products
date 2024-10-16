import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartProduct } from './entities/cart-products.entity';
import { Product } from '../product/entities/product.entity';
import { ProductModule } from '../product/product.module';
import { CartResolver } from './resolvers/cart.resolver';
import { CartProductService } from './services/cart-product.service';
import { CartService } from './services/cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Product, CartProduct]),
    ProductModule,
  ],
  providers: [CartResolver, CartService, CartProductService],
})
export class CartModule {}
