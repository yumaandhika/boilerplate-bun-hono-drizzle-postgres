import { jsonb, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const componentsTable = pgTable(
  'components', 
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 256 }),
    type: varchar('type', { length: 50 }), // e.g., 'processor', 'motherboard', 'ram'
    brand: varchar('brand', { length: 256 }),
    model: varchar('model', { length: 256 }),
    releaseDate: timestamp('release_date'),
    specifications: jsonb('specifications'),
    // default
    deletedAt: timestamp('deleted_at'), // Nullable timestamp for soft delete
    createdAt: timestamp('created_at').defaultNow(), // Default to the current timestamp
    updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date()), // Update timestamp on update
  },
);