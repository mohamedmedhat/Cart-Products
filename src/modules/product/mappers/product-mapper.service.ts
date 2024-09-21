import { Injectable } from "@nestjs/common";
import { Product } from "../entities/product.entity";
import { UpdateProductInput } from "../dto/update-product.dto";
import { CreateProductDto } from "../dto/create_product.dto";

@Injectable()
export class ProductMapper {
  async toUpdateEntity(data: UpdateProductInput, imageUrl: string, product: Product): Promise<Product> {
    product.name = data.name;
    product.price = parseFloat(data.price);
    product.sale_price = parseFloat(data.sale_price);
    product.imageUrl = imageUrl;
    product.quantity = parseInt(data.quantity);
    product.updated_at = new Date();
    return product;
  }
}