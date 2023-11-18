import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

const envPath = '.env';

config({ path: envPath, debug: true });

const configService = new ConfigService();

const pg = new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  logging: configService.get('POSTGRES_DEBUG_QUERIES') === 1 ? true : false,
  entities: [`${__dirname}/src/**/entities/*{entity.js,entity.ts}`],
  migrations: [`${__dirname}/**/*-migrations.ts`],
  migrationsTableName: '_migrations',
});

pg.initialize()
  .then(() => {
    console.log('data source initialized');
  })
  .catch((err) => {
    console.log('data source error', err);
  });

export default pg;
