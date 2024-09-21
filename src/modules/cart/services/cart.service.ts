import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { ErrorService } from 'src/common/services/errors.service';
import { CartProductService } from './cart-product.service';
import { PaginationConst } from 'src/common/consts/variables.consts';
import { Product } from 'src/modules/product/entities/product.entity';
import { ProductService } from 'src/modules/product/services/product.service';
import { CartProduct } from '../entities/cart-products.entity';
import { Cart } from '../entities/cart.entity';
import { SharedProductService } from 'src/shared/product-shared.service';
import { CustomQueriesUtils } from 'src/common/utils/sharedQueries.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private _cartRepo: Repository<Cart>,
    @InjectRepository(CartProduct)
    private readonly _cartProduct: Repository<CartProduct>,
    private readonly _productService: ProductService,
    private readonly _sharedProductService: SharedProductService,
    private readonly _cartProductService: CartProductService,
    private readonly _customQuery: CustomQueriesUtils,
    private readonly _errorService: ErrorService,
  ) {}

  async getCartRelations(relations: string[] = []): Promise<string[]> {
    return ['cartProducts', ...relations];
  }

  async createCart(): Promise<Cart> {
    try {
      const cart = this._cartRepo.create();
      return this._cartRepo.save(cart);
    } catch (error) {
      throw this._errorService.failedCreateCart(error);
    }
  }

  async calculateTotal(cartId: number): Promise<number> {
    try {
      const cart = await this.findCart(cartId);
      let total = 0;
      if (cart) {
        for (const product of cart.cartProducts) {
          const price = product.sale_price || product.price;
          total += price * product.quantity;
        }
      }
      return total;
    } catch (error) {
      throw this._errorService.failedCalcTotalPricesInCart(error);
    }
  }

  async findCart(
    cartId: number,
    order: FindOptionsOrder<Cart> = undefined,
  ): Promise<Cart> {
    try {
      const relations = await this.getCartRelations();
      return await this._customQuery.findItem(
        this._cartRepo,
        { id: cartId },
        order,
        relations,
      );
    } catch (error) {
      throw this._errorService.failedToFindProduct(cartId);
    }
  }

  async findCartForChecking(
    cartId: number,
    order: FindOptionsOrder<Cart> = undefined,
  ): Promise<Cart> {
    try {
      const cart = await this._cartRepo.findOne({ where: { id: cartId } });
      if (!cart) {
        return await this.createCart();
      }
      return cart;
    } catch (error) {
      throw this._errorService.failedToFindProduct(cartId);
    }
  }

  async findCarts(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
    where?: FindOptionsWhere<Cart>,
    order: FindOptionsOrder<Cart> = undefined,
  ): Promise<[{ cart: Cart; total: number }[], number]> {
    const relations = await this.getCartRelations();
    const [carts, count] = await this._customQuery.findItems(
      page,
      pageSize,
      this._cartRepo,
      where,
      order,
      relations,
    );
    const cartsWithTotals = await Promise.all(
      carts.map(async (cart) => {
        const total = await this.calculateTotal(cart.id);
        return { cart, total };
      }),
    );
    return [cartsWithTotals, count];
  }

  async getCart(cartId: number): Promise<{ cart: Cart; totalprice: number }> {
    try {
      const cart = await this.findCart(cartId);
      const totalprice = await this.calculateTotal(cartId);
      return { cart, totalprice };
    } catch (error) {
      throw this._errorService.failedGetCart(error);
    }
  }

  async getAllCarts(): Promise<[{ cart: Cart; total: number }[], number]> {
    try {
      return await this.findCarts();
    } catch (error) {
      throw this._errorService.failedToGetAllCart(error);
    }
  }

  async reflectChangesForAddingProduct(
    cart: Cart,
    product: Product,
    quantity: number,
  ): Promise<any> {
    await Promise.all([
      this._productService.decreaseProductQuantity(quantity, product),
      this._cartProductService.createCartProduct(quantity, product, cart),
    ]);
  }

  async addProductToCart(
    cartId: number,
    productId: number,
    quantity: number,
  ): Promise<{ cart: Cart; totalprice: number }> {
    try {
      const cart = await this.findCartForChecking(cartId);
      const product = await this._productService.findProductById(productId);
      await this.reflectChangesForAddingProduct(cart, product, quantity);
      return await this.getCart(cartId);
    } catch (error) {
      throw this._errorService.failedToAddProductToCart(error);
    }
  }

  async reflectChangeForRemovingProduct(
    cartProductId: number,
    product: Product,
    quantity: number,
  ) {
    await Promise.all([
      this._productService.IncreaseProductQuantity(quantity, product),
      this._cartProductService.deleteCartProduct(cartProductId),
    ]);
  }

  async removeProductFromCart(
    cartId: number,
    cartProductId: number,
  ): Promise<{ cart: Cart; totalprice: number }> {
    try {
      const cartProduct = await this._customQuery.findItem(this._cartProduct, {
        cart: { id: cartId },
        id: cartProductId,
      });
      const product = await this._sharedProductService.findProduct({
        name: cartProduct.name,
      });
      await this.reflectChangeForRemovingProduct(
        cartProduct.id,
        product,
        cartProduct.quantity,
      );
      return await this.getCart(cartId);
    } catch (error) {
      throw this._errorService.failedToDeleteProductFromCart(error);
    }
  }
}
