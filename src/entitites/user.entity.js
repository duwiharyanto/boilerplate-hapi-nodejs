// User.js (contoh entitas)

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
      unique: true,
      nullable: false,
      width: 11,
      unsigned: true,
    },
    name: {
      type: 'varchar',
    },
    email: {
      type: 'varchar',
    },
    createdAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updatedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
    password: {
      type: 'text',
    },
    uuid: {
      type: 'uuid',
      generated: 'uuid',
    },
    deletedAt: {
      type: 'timestamp',
      nullable: true,
    },
  },
});
