import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateProductDto {
  @IsString({ message: 'name should be is string format' })
  @IsNotEmpty({ message: 'name is required' })
  @MinLength(3, { message: 'name can not be less than 3 characters' })
  @MaxLength(30, { message: 'name can not be more than 30 characters' })
  @Field(() => String)
  name: string;

  @IsNotEmpty({ message: 'price is required' })
  @Field(() => Float)
  price: string;

  @IsOptional()
  @Field(() => Float, { nullable: true })
  sale_price?: string;

  @IsNotEmpty({ message: 'qauntity is required' })
  @Field(() => Int)
  quantity: string;
}
