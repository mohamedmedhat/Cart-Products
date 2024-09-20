import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CartWithTotal } from './responses/cart-total';
import { CartProduct } from './entities/cart-products.entity';
import { CartProductService } from './cart-product.service';

@Resolver(() => Cart)
export class CartResolver {
  constructor(
    private readonly cartService: CartService,
    private readonly cartProductService: CartProductService,
  ) {}

  @Mutation(() => Cart)
  async createCart(): Promise<Cart> {
    return await this.cartService.createCart();
  }

  @Mutation(() => CartWithTotal)
  async addProductTocart(
    @Args('cardId', { type: () => Int }) cartId: number,
    @Args('productId', { type: () => Int }) productId: number,
    @Args('quantity', { type: () => Int }) quantity: number,
  ): Promise<CartWithTotal> {
    return await this.cartService.addProductToCart(cartId, productId, quantity);
  }

  @Mutation(() => CartWithTotal)
  async deleteProductFromCart(
    @Args('cardId', { type: () => ID }) cartId: number,
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<CartWithTotal> {
    return await this.cartService.removeProductFromCart(cartId, productId);
  }

  @Query(() => [CartProduct])
  async getAllCartProductsByName(
    @Args('productName', { type: () => String }) productName: string,
  ): Promise<CartProduct[]> {
    return await this.cartProductService.getAllCartProductsByName(productName);
  }

  @Query(() => CartWithTotal)
  async getCartWithTotal(
    @Args('cartId', { type: () => ID }) cartId: number,
  ): Promise<CartWithTotal> {
    return await this.cartService.getCart(cartId);
  }
}
