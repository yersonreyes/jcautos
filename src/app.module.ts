import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VeeklsModule } from './veekls/veekls.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',        // Cambia a la IP o nombre de tu servidor de MySQL si es necesario
      port: 3306,               // Puerto por defecto de MySQL
      username: 'devjyrau_wpjyrnov2024dev',   // Usuario de la base de datos
      password: '4!pf(50qbS', // Contraseña de la base de datos
      database: 'devjyrau_wpjyrnov2024dev', // Nombre de la base de datos
      autoLoadEntities: true,   // Carga automática de ent  idades
      synchronize: true,        // Para desarrollo, puedes dejarlo en true; en producción es mejor false
    }),
    VeeklsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
