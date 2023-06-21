const { getConnection } = require('typeorm');
const Joi = require('joi');
const User = require('../entitites/User');
const { handleValidationFailure } = require('../utils/validation.response');

const userSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Field name harus diisi',
  }),
  email: Joi.string().required().email().messages({
    'any.required': 'Field email harus diisi',
    'string.email': 'Field email harus berupa email',
  }),
});

const UserIndex = async (request, h) => {
  try {
    const userRepository = getConnection().getRepository(User);
    const users = (await userRepository.find()).map((user) => {
      const { id, ...userWithoutId } = user;
      return userWithoutId;
    });
    const response = {
      timespamp: Date.now(),
      data: users,
    };
    return h.response(response).code(200);
  } catch (error) {
    return h.response(error).code(500);
  }
};
const userCreate = async (request, h) => {
  try {
    console.log(request.payload);
    const { error } = userSchema.validate(request.payload, {
      abortEarly: false,
    });
    if (error) {
      console.log(error);
      return handleValidationFailure(request, h, error);
    }
    const userRepository = getConnection().getRepository(User);
    const newUser = userRepository.create(request.payload);
    const savedUser = await userRepository.save(newUser);
    const response = {
      timespamp: Date.now(),
      data: savedUser,
    };
    return h.response(response).code(200);
  } catch (error) {
    return h.response(error.details).code(500);
  }
};
const userFindById = async (request, h) => {
  try {
    const userRepository = getConnection().getRepository(User);
    const user = await userRepository.findOneBy({ id: request.params.id });
    const response = {
      timespamp: Date.now(),
      message: 'User ditemukan',
      data: null,
    };
    if (user) {
      const { id, ...userWithoutId } = user;
      response.data = userWithoutId;
      return h.response(response).code(200);
    }
    response.message = 'user tidak ditemukan';
    return h.response(response).code(404);
  } catch (error) {
    console.log(error);
    return h.response(error).code(404);
  }
};
const userDelete = async (request, h) => {
  try {
    const { id } = request.params;
    const userRepository = getConnection().getRepository(User);
    const deletedUser = await userRepository.delete(id);
    const response = {
      timespamp: Date.now(),
      data: deletedUser,
    };
    return h.response(response).code(200);
  } catch (error) {
    return h.response(error).code(404);
  }
};
const userUpdate = async (request, h) => {
  try {
    const { id } = request.params;
    const userRepository = getConnection().getRepository(User);
    const user = await userRepository.findOneBy({ id });
    if (user) {
      userRepository.merge(user, request.payload);
      const updatedUser = await userRepository.save(user);
      const response = {
        timespamp: Date.now(),
        data: updatedUser,
      };
      return h.response(response).code(200);
    }
    return h.response('User tidak ditemukan').code(404);
  } catch (error) {
    return h.response(error).code(404);
  }
};
module.exports = {
  UserIndex,
  userCreate,
  userFindById,
  userDelete,
  userUpdate,
};
