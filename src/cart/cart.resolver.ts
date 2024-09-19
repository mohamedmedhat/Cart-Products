import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CartWithTotal } from './entities/cart-total';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(() => Cart)
  async createCart(): Promise<Cart> {
    return await this.cartService.createCart();
  }

  @Mutation(() => CartWithTotal)
  async addProductTocart(
    @Args('cardId', { type: () => ID }) cardId: number,
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<CartWithTotal> {
    return await this.cartService.addProductToCart(cardId, productId);
  }

  @Mutation(() => CartWithTotal)
  async deleteProductFromCart(
    @Args('cardId', { type: () => ID }) cardId: number,
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<CartWithTotal> {
    return await this.cartService.removeProductFromCart(cardId, productId);
  }

  @Query(() => CartWithTotal)
  async getCartWithTotal(
    @Args('cartId', { type: () => Number, nullable: true }) cartId: number = 1,
  ): Promise<CartWithTotal> {
    const { cart, totalprice } = await this.cartService.getCart(cartId);
    return { cart, totalprice };
  }
}
