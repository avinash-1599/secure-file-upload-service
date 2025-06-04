const { EntitySchema } = require('typeorm');

const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    email: { type: 'varchar', unique: true },
    password: { type: 'varchar' },
    created_at: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' },
  },
});

module.exports = {User};
