import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { NotebooksModule } from './notebooks/notebooks.module';
import { DocumentsModule } from './documents/documents.module';
import { FlashcardsModule } from './flashcards/flashcards.module';
import { ExercisesModule } from './exercises/exercises.module';
import { LlmModule } from './llm/llm.module';
import config from './common/configs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GqlConfigService } from './gql-config.service';

// Register enums for GraphQL
import './common/enums';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),

    AuthModule,
    UsersModule,
    PostsModule,
    NotebooksModule,
    DocumentsModule,
    FlashcardsModule,
    ExercisesModule,
    LlmModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule { }
