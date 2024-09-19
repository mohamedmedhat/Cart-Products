import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create_product.dto';
import { Product } from './entities/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomFilesService } from 'src/custom/custom-files.service';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly _productService: ProductService) {}

  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'add product' })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
          nullable: false,
        },
        price: {
          type: 'number',
          format: 'float',
          nullable: false,
        },
        quantity: {
          type: 'number',
          format: 'int32',
          nullable: false,
        },
        sale_price: {
          type: 'number',
          format: 'float',
          nullable: true,
        },
      },
    },
  })
  @Post('add')
  @Version('1')
  @UseInterceptors(
    FileInterceptor('file', CustomFilesService.getMulterOptions()),
  )
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateProductDto,
  ): Promise<Product> {
    return await this._productService.createProduct(
      `/images/${file.filename}`,
      data,
    );
  }

  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'update product' })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
          nullable: false,
        },
        price: {
          type: 'number',
          format: 'float',
          nullable: false,
        },
        quantity: {
          type: 'number',
          format: 'int32',
          nullable: false,
        },
        sale_price: {
          type: 'number',
          format: 'float',
          nullable: true,
        },
      },
    },
  })
  @Put('update/:id')
  @Version('1')
  @UseInterceptors(
    FileInterceptor('file', CustomFilesService.getMulterOptions()),
  )
  async updateProduct(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
    @Body() data: CreateProductDto,
  ): Promise<Product> {
    const imageUrl = file.filename;
    return await this._productService.updateProduct(id, imageUrl, data);
  }
}
