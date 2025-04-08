import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'YuilRin*123',
    database: 'octaltask',
    entities: [User],
    synchronize: true, // true khi dev
  }),
  TypeOrmModule.forFeature([User]),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


