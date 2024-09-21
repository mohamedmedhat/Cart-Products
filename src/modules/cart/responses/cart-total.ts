import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Cart } from '../entities/cart.entity';

@ObjectType()
export class CartWithTotal {
  @Field(() => Cart)
  cart: Cart;

  @Field(() => Float)
  totalprice: number;
}

@ObjectType()
export class CartsResponse {
  @Field(() => [CartWithTotal])
  carts: { cart: Cart; total: number }[];

  @Field(() => Number)
  totalCount: number;
}

