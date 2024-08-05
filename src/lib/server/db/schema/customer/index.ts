/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  sqliteTable,
  text,
  integer,
  // customType,
} from 'drizzle-orm/sqlite-core'
import { sql, relations } from 'drizzle-orm'

import { userTable, productItemTable } from '$db/schema'

export const customerTable = sqliteTable('customer', {
  id: text('id').notNull().primaryKey(),
  // .$defaultFn(() => generateId(15)),
  is_retail: integer('is_retail', { mode: 'boolean' }).notNull(),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date(),
  ),
  name: text('name').notNull(),
  email: text('email').unique(),
  birth_date: text('birth_date'),
  cellphone: text('cellphone').notNull(),
  phone: text('phone').notNull(),
  cpf_cnpj: text('cpf_cnpj').notNull(),
  rg_ie: text('rg_ie').notNull(),
  max_credit: integer('max_credit').notNull(),
  used_credit: integer('used_credit').notNull(),
})
export const customerRelations = relations(customerTable, ({ one, many }) => ({
  adresses: many(addressTable),
  orders: many(customerOrderTable),
}))

export type SelectCustomer = typeof customerTable.$inferSelect
export type InsertCustomer = typeof customerTable.$inferInsert

export const addressTable = sqliteTable('address', {
  id: text('id').notNull().primaryKey(),
  // .$defaultFn(() => generateId(15)),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date(),
  ),
  customer_id: text('customer_id')
    .notNull()
    .references(() => customerTable.id),
  cep: text('cep').notNull(),
  street: text('street').notNull(),
  number: text('number').notNull(),
  complement: text('complement').notNull(),
  neighborhood: text('neighborhood').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  country: text('country').notNull(),
})

export const addressRelations = relations(addressTable, ({ one, many }) => ({
  customer: one(customerTable),
  orders: many(customerOrderTable),
}))

export type SelectAddress = typeof addressTable.$inferSelect
export type InsertAddress = typeof addressTable.$inferInsert

export const customerOrderTable = sqliteTable('customer_order', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  // .$defaultFn(() => generateId(15)),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date(),
  ),
  customer_id: text('customer_id').references(() => customerTable.id),
  address_id: text('address_id').references(() => addressTable.id),
  payment_method: text('payment_method').notNull(),
  total: integer('total').notNull(),
  status: text('status', {
    enum: [
      'PENDING',
      'CONFIRMED',
      'PREPARING',
      'ON THE WAY',
      'DELIVERED',
      'CANCELED',
    ],
  }).notNull(),
})

export const customerOrderRelations = relations(
  customerOrderTable,
  ({ one, many }) => ({
    customer: one(customerTable, {
      fields: [customerOrderTable.customer_id],
      references: [customerTable.id],
    }),
    address: one(addressTable, {
      fields: [customerOrderTable.address_id],
      references: [addressTable.id],
    }),
    items: many(orderItemTable),
  }),
)
export type SelectCustomerOrder = typeof customerOrderTable.$inferSelect
export type InsertCustomerOrder = typeof customerOrderTable.$inferInsert

export const orderItemTable = sqliteTable('order_item', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date(),
  ),
  order_id: integer('order_id')
    .notNull()
    .references(() => customerOrderTable.id),
  product_id: text('product_id')
    .notNull()
    .references(() => productItemTable.id),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
})

export const orderItemRelations = relations(
  orderItemTable,
  ({ one, many }) => ({
    order: one(customerOrderTable, {
      fields: [orderItemTable.order_id],
      references: [customerOrderTable.id],
    }),
    product: one(productItemTable, {
      fields: [orderItemTable.product_id],
      references: [productItemTable.id],
    }),
  }),
)

export type SelectOrderItem = typeof orderItemTable.$inferSelect
export type InsertOrderItem = typeof orderItemTable.$inferInsert
