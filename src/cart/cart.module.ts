import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { CustomQueriesModule } from 'src/custom/custom.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Product]),
    CustomQueriesModule,
    ProductModule
  ],
  providers: [CartResolver, CartService],
})
export class CartModule {}
