import { Router, response } from 'express';
import { getRepository } from 'typeorm';

import CreateService from '../services/Pet/CreateService';
import UpdateService from '../services/Pet/UpdateService';
import Pet from '../models/Pet';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const petsRouter = Router();

/**
 * this route creates a new pet attached to an owner/user
 */
petsRouter.post('/create', async (request, response) => {
  const { name, race, age, weight, city, owner } = request.body;

  const createPet = new CreateService();

  const pet = await createPet.execute({
    name,
    race,
    age,
    weight,
    city,
    owner,
  });

  return response.json(pet);
});

/**
 * this route returns all pets and their respective owners
 */
petsRouter.get('/', async (request, response) => {
  const petRepository = getRepository(Pet);

  const pets = await petRepository.find({ relations: ['owner'] });

  pets.forEach(pet => {
    delete pet.owner.password;
  });

  return response.json(pets);
});

/**
 * this route updates a single pet
 */
petsRouter.put(
  '/edit/:pet_id',
  ensureAuthenticated,
  async (request, response) => {
    const { pet_id } = request.params;
    const { name, race, age, weight, city } = request.body;

    const updatePet = new UpdateService();

    const pet = await updatePet.execute({
      name,
      race,
      age,
      weight,
      city,
      owner: request.user.id,
      petId: pet_id,
    });

    return response.json(pet);
  },
);

export default petsRouter;
