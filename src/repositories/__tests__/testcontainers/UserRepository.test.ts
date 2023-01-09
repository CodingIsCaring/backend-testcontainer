import { MongoDBContainer } from 'testcontainers';
import { Config } from '../../../configurations/Config';
import { initializeMongoDb } from '../../../configurations/mongodb/MongoDBConnection';
import { UserRepository } from '../../UserRepository';

describe('UserRepository with Test Containers', () => {
  let mongodbContainer;

  beforeAll(async () => {
    mongodbContainer = await new MongoDBContainer('mongo:4.4.6').start();
    Config.dataBase.port = mongodbContainer.getMappedPort(27017);
    Config.dataBase.host = mongodbContainer.getHost();
    await initializeMongoDb();
  }, 100000);

  afterAll(async () => {
    await mongodbContainer.stop();
  });

  it('should insert user', async () => {
    const repository = new UserRepository();

    await repository.insert({ name: 'Paca' });
    const users = await repository.findAll();

    expect(users.length).toEqual(1);
    expect(users[0].name).toEqual('Paca');
  });

  it('should update user', async () => {
    const repository = new UserRepository();

    const user = await repository.findOne({ name: 'Paca' });

    await repository.update(user!._id, { name: 'Ms. Paca' });
    const users = await repository.findAll();

    expect(users.length).toEqual(1);
    expect(users[0].name).toEqual('Ms. Paca');
  });

  it('should delete user', async () => {
    const repository = new UserRepository();
    const user = await repository.findOne({ name: 'Ms. Paca' });

    await repository.delete(user!._id);
    const users = await repository.findAll();

    expect(users.length).toEqual(0);
  });

});
