const { EntitySchema } = require('typeorm');

const File = new EntitySchema({
  name: 'File',
  tableName: 'files',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    original_filename: { type: 'varchar' },
    storage_path: { type: 'text' },
    title: { type: 'varchar', nullable: true },
    description: { type: 'text', nullable: true },
    status: { type: 'varchar', default: 'uploaded' },
    extracted_data: { type: 'text', nullable: true },
    uploaded_at: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' },
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'user_id' },
      onDelete: 'CASCADE',
      eager: true
    },
  },
});

module.exports = { File };
