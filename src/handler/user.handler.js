const { getConnection, IsNull } = require('typeorm');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const User = require('../entitites/user.entity');
const {
  handleValidationFailure,
  handleException,
} = require('../utils/validation.response');
require('dotenv').config();

const saltRounds = 10;
const userSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Field name harus diisi',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Field password harus diisi',
  }),
  image: Joi.any()
    .required()
    .custom((value, helpers) => {
      if (!value) {
        return helpers.error('any.required');
      }
      if (!value.filename) {
        return helpers.error('any.invalid');
      }

      const allowedExtensions = ['jpeg', 'jpg'];
      const fileExtension = value.filename.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .messages({
      'any.required': 'Field image harus diisi',
      'any.invalid': 'Field image tidak sesuai format',
    }),
  email: Joi.string().required().email().messages({
    'any.required': 'Field email harus diisi',
    'string.email': 'Field email harus berupa email',
  }),
});

const UserIndex = async (request, h) => {
  try {
    const userRepository = getConnection().getRepository(User);
    const users = (
      await userRepository.find({
        where: {
          deletedAt: IsNull(),
        },
        order: {
          id: 'DESC',
        },
      })
    ).map((user) => {
      const { id, ...userWithoutId } = user;
      return userWithoutId;
    });
    const response = {
      timespamp: Date.now(),
      data: users,
    };
    return h.response(response).code(200);
  } catch (error) {
    return handleException(h, error);
  }
};
const userCreate = async (request, h) => {
  try {
    const newProps = { ...request.payload };
    const { error } = userSchema.validate(request.payload, {
      abortEarly: false,
    });
    if (error) {
      return handleValidationFailure(request, h, error);
    }
    const hashedPassword = await bcrypt.hash(
      request.payload.password,
      saltRounds
    );
    const file = request.payload.image;
    const filePath = path.join('./public/uploads', file.filename);
    const fileData = fs.readFileSync(file.path);
    fs.writeFileSync(filePath, fileData);
    fs.unlinkSync(file.path);
    newProps.password = hashedPassword;
    newProps.image = filePath;
    const userRepository = getConnection().getRepository(User);
    const newUser = userRepository.create(newProps);
    const savedUser = await userRepository.save(newUser);
    const response = {
      timespamp: Date.now(),
      data: savedUser,
    };
    return h.response(response).code(200);
  } catch (error) {
    return handleException(h, error);
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
    return handleException(h, error);
  }
};
const userDelete = async (request, h) => {
  try {
    const { uuid } = request.params;
    // console.log(uuid);
    const userRepository = getConnection().getRepository(User);
    // const deletedUser = await userRepository.softDelete({ uuid });
    const deletedUser = await userRepository.delete({ uuid });
    const response = {
      timespamp: Date.now(),
      data: deletedUser,
    };
    return h.response(response).code(200);
  } catch (error) {
    return handleException(h, error);
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
    return handleException(h, error);
  }
};
module.exports = {
  UserIndex,
  userCreate,
  userFindById,
  userDelete,
  userUpdate,
};
