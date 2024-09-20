import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProduct } from './entities/cart-products.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Cart } from './entities/cart.entity';
import { CustomQueries } from 'src/custom/custom.service';

@Injectable()
export class CartProductService {
  constructor(
    @InjectRepository(CartProduct)
    private readonly _cartProductRepo: Repository<CartProduct>,
    private readonly _customQuery: CustomQueries,
  ) {}

  async getCartProductRelations(
    additionalRelations: string[] = [],
  ): Promise<string[]> {
    return ['cart', ...additionalRelations];
  }

  async deleteCartProductRelations(cartProduct: CartProduct) {
    cartProduct.cart = null;
    return await this._cartProductRepo.save(cartProduct);
  }

  async deleteCartProductsRelations(cartProducts: CartProduct[]) {
    for (const cartProduct of cartProducts) {
      cartProduct.cart = null;
      await this._cartProductRepo.save(cartProduct);
    }
  }

  async getAllCartProductsByName(productName: string): Promise<CartProduct[]> {
    console.log('Fetching cart products with name:', productName);
    const cartProducts = await this._customQuery.findItemsWithOutPagination(
      this._cartProductRepo,
      { name: productName },
    );
    console.log('Fetched Cart Products:', cartProducts);
    return cartProducts;
  }

  async findCartProductById(id: number): Promise<CartProduct> {
    try {
      const relations = await this.getCartProductRelations();
      return await this._customQuery.findItem(
        this._cartProductRepo,
        { id },
        undefined,
        relations,
      );
    } catch (error) {}
  }

  async createCartProduct(
    quantity: number,
    product: Product,
    cart: Cart,
  ): Promise<CartProduct> {
    const newCartProduct = this._cartProductRepo.create({
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      imageUrl: product.imageUrl,
      quantity,
      cart,
    });
    return await this._cartProductRepo.save(newCartProduct);
  }

  async updateAllCartProductsWithName(
    name: string,
    updatedProduct: Product,
  ): Promise<CartProduct[]> {
    const cartProducts = await this.getAllCartProductsByName(name);
    console.log('Cart Products before update:', cartProducts);
    for (const product of cartProducts) {
      product.name = updatedProduct.name;
      product.price = updatedProduct.price;
      product.sale_price = updatedProduct.sale_price;
      product.imageUrl = updatedProduct.imageUrl;
      product.updated_at = new Date();
    }
    const savedProducts = await this._cartProductRepo.save(cartProducts);
    console.log('Saved Cart Products:', savedProducts);
    return savedProducts;
  }

  async deleteCartProduct(cartProductId: number): Promise<boolean> {
    try {
      const cartProduct = await this.findCartProductById(cartProductId);
      await Promise.all([
        this.deleteCartProductRelations(cartProduct),
        this._cartProductRepo.remove(cartProduct),
      ]);
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteAllCartProductsWithName(name: string) {
    try {
      const cartProducts = await this.getAllCartProductsByName(name);
      await Promise.all([
        this.deleteCartProductsRelations(cartProducts),
        this._cartProductRepo.remove(cartProducts),
      ]);
    } catch (error) {}
  }
}
