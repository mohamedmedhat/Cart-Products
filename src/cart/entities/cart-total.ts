import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Cart } from './cart.entity';

@ObjectType()
export class CartWithTotal {
  @Field(() => Cart)
  cart: Cart;

  @Field(() => Float)
  totalprice: number;
}
