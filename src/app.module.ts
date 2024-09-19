import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { CustomQueriesModule } from './custom/custom.module';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/entities/cart.entity';
import { MulterModule } from '@nestjs/platform-express';

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
        entities: [Product, Cart],
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
      useFactory: async() => ({
        dest: './uploads',
        limits:{
          fileSize: 1000 * 1000 * 10
        }
      })
    }),
    ProductModule,
    CustomQueriesModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
