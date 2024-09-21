import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { MulterModule } from '@nestjs/platform-express';
import { CartModule } from './modules/cart/cart.module';
import { CartProduct } from './modules/cart/entities/cart-products.entity';
import { Cart } from './modules/cart/entities/cart.entity';
import { Product } from './modules/product/entities/product.entity';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('RDS_HOST'),
        port: config.getOrThrow<number>('RDS_PORT'),
        username: config.getOrThrow<string>('RDS_USER_NAME'),
        password: config.getOrThrow<string>('RDS_PASSWORD'),
        database: config.getOrThrow<string>('RDS_DATABASE'),
        entities: [Product, Cart, CartProduct],
        autoLoadEntities: true,
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
        factories: [__dirname + '/factories/**/*{.ts,.js}'],
        cli: {
          migrationsDir: __dirname + '/migrations/',
        },
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => ({
        autoSchemaFile: true,
        playground: false,
        plugins: [
          ApolloServerPluginLandingPageLocalDefault({
            footer: true,
            includeCookies: true,
          }),
        ],
      }),
    }),
    MulterModule.registerAsync({
      useFactory: async () => ({
        dest: './uploads',
        limits: {
          fileSize: 1000 * 1000 * 10,
        },
      }),
    }),
    ProductModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
