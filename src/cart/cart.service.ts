import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { CustomQueries } from 'src/custom/custom.service';
import { ProductService } from 'src/product/product.service';
import { ErrorService } from 'src/custom/errors.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private _cartRepo: Repository<Cart>,
    @InjectRepository(Product)
    private _productRepo: Repository<Product>,
    private readonly _productService: ProductService,
    private readonly _customQuery: CustomQueries,
    private readonly _errorService: ErrorService,
  ) {}

  async getCartRelations(relations: string[] = []): Promise<string[]> {
    return ['products', ...relations];
  }

  async createCart(): Promise<Cart> {
    try {
      const cart = this._cartRepo.create();
      return this._cartRepo.save(cart);
    } catch (error) {
      this._errorService.failedCreateCart(error);
    }
  }

  async calculateTotal(cartId: number = 1): Promise<number> {
    try {
      const cart = await this.findCart(cartId);
      let total = 0;
      if (cart) {
        for (const product of cart.products) {
          const price = product.sale_price || product.price;
          total += price * product.quantity;
        }
      }
      return total;
    } catch (error) {
      this._errorService.failedCalcTotalPricesInCart(error);
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
      this._errorService.failedToFindProduct(cartId);
    }
  }

  async findCarts(
    where?: FindOptionsWhere<Cart>,
    order: FindOptionsOrder<Cart> = undefined,
  ): Promise<[{ cart: Cart; total: number }[], number]> {
    const relations = await this.getCartRelations();
    const [carts, count] = await this._customQuery.findItems(
      1,
      30,
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

  async addProductToCart(
    cartId: number,
    productId: number,
  ): Promise<{ cart: Cart; totalprice: number }> {
    try {
      let cart: Cart;
      const existingCart = await this.findCart(cartId);

      if (!existingCart) {
        cart = await this.createCart();
      } else {
        cart = existingCart;
      }
      const product = await this._productService.findProduct(
        { id: productId },
        undefined,
        undefined,
      );
      product.cart = cart;
      await this._productRepo.save(product);
      return await this.getCart(cartId);
    } catch (error) {
      throw this._errorService.failedToAddProductToCart(error);
    }
  }

  async removeProductFromCart(
    cartId: number,
    productId: number,
  ): Promise<{ cart: Cart; totalprice: number }> {
    try {
      const cart = await this.findCart(cartId);
      const product = await this._productService.findProduct(
        { id: productId },
        undefined,
        undefined,
      );
      if (cart && product) {
        product.cart = null;
        await this._productRepo.save(product);
      }
      return await this.getCart(cartId);
    } catch (error) {
      throw this._errorService.failedToDeleteProductFromCart(error);
    }
  }
}
