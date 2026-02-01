import { DataSource } from 'typeorm';
import { PhoneType } from './entities/phone-type.entity';

const databasePath =
  process.env.DATABASE_PATH ?? './data/contacts.db';

const dataSource = new DataSource({
  type: 'sqlite',
  database: databasePath,
  entities: [PhoneType],
  synchronize: false,
});

async function runSeed(): Promise<void> {
  await dataSource.initialize();
  const repo = dataSource.getRepository(PhoneType);
  const count = await repo.count();
  if (count === 0) {
    await repo.save([
      { typeName: 'móvil' },
      { typeName: 'casa' },
      { typeName: 'trabajo' },
    ]);
    console.log('Seed: insertados tipos de teléfono (móvil, casa, trabajo).');
  } else {
    console.log('Seed: la tabla phone_type ya tiene datos; no se inserta nada.');
  }
  await dataSource.destroy();
}

runSeed().catch((err) => {
  console.error('Error ejecutando seed:', err);
  process.exit(1);
});
