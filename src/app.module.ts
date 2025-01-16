import { Module } from '@nestjs/common';
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
      username: 'jyrautos_wpjyrprd',   // Usuario de la base de datos
      password: '-4G25SpX)o', // Contraseña de la base de datos
      database: 'jyrautos_wpjyrprd', // Nombre de la base de datos
      autoLoadEntities: true,   // Carga automática de ent  idades
      synchronize: true,        // Para desarrollo, puedes dejarlo en true; en producción es mejor false
    }),
    VeeklsModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
