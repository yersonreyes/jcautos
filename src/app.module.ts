import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VeeklsModule } from './veekls/veekls.module';

@Module({
  imports: [VeeklsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
