import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ErrorService {
  async failedToCreateProduct(error: Error): Promise<void> {
    throw new BadRequestException(
      `failed to create product, Reason: ${error.message}`,
    );
  }

  async failedToUpdateProduct(id: number,error: Error): Promise<void> {
    throw new BadRequestException(
      `failed to update product: ${id}, Reason: ${error.message}`,
    );
  }

  async failedToDeleteProduct(id: number, error: Error): Promise<void> {
    throw new BadRequestException(
      `failed to delete product: ${id}, Reason: ${error.message}`,
    );
  }

  
  async failedToGetProductById(id: number, error: Error): Promise<void> {
    throw new BadRequestException(
      `failed to get product: ${id}, Reason: ${error.message}`,
    );
  }

  async failedToFindProduct(id: number): Promise<void> {
    throw new BadRequestException(`failed to find product with id: ${id}`);
  }

  async failedToFindProducts(error: Error): Promise<void> {
    throw new BadRequestException(`failed to find products, Reason: ${error}`);
  }

  async failedGetAllProducts(error: Error): Promise<void> {
    throw new BadRequestException(`failed to find get all products, Reason: ${error}`);
  }

  async failedToDeleteProductFromCart(error: Error): Promise<void> {
    throw new BadRequestException(
      `failed to delete product form cart, Reason: ${error.message}`,
    );
  }

  async failedToAddProductToCart(error: Error): Promise<void> {
    throw new BadRequestException(
      `failed to add product to cart, Reason: ${error.message}`,
    );
  }

  async failedToFindLastCart(error: Error): Promise<void> {
    throw new BadRequestException(`failed to find last added cart: ${error}`);
  }

  async failedToGetAllCart(error: Error): Promise<void> {
    throw new BadRequestException(
      `failed to get all carts, Reason: ${error.message}`,
    );
  }

  async failedGetCart(error: Error): Promise<void> {
    throw new BadRequestException(
      `failed to get cart, Reason: ${error.message}`,
    );
  }

  async failedCalcTotalPricesInCart(error: Error): Promise<void> {
    throw new BadRequestException(
      `failed to calc total prices in cart, Reason: ${error.message}`,
    );
  }

  async failedCreateCart(error: Error): Promise<void> {
    throw new BadRequestException(
      `failed to create cart, Reason: ${error.message}`,
    );
  }
}
