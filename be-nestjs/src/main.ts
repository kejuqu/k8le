import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);

  console.log('port: ', port);

  await app.listen(port, () => {
    console.log(`🚀🚀🚀 应用已启动，本地地址: http://localhost:${port}`);
  });
}
bootstrap();
