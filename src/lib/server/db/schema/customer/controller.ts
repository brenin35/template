/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  customerOrderTable,

  addressTable,
  orderItemTable,
} from './index'

import type {
  SelectCustomerOrder,
  InsertCustomerOrder,
  InsertAddress,
  InsertOrderItem,

  SelectAddress,
  SelectOrderItem,
  SelectUser, InsertStockTransaction,
} from '$db/schema'
import { db } from '$db'
import { eq, ne, or, sql } from 'drizzle-orm'

import { product } from '$db/controller'

export const customer = {
  tables: {
    addressTable,
    customerOrderTable,
    orderItemTable,
  },


  insertAddress: async (input: InsertAddress) => {
    return db.insert(addressTable).values(input)
  },
  getCustomerAddress: async (customerId: SelectUser['id']) => {
    return db
      .select()
      .from(addressTable)
      .where(eq(addressTable.user_id, customerId))
  },
  insertOrder: async (input: {
    order_info: Omit<InsertCustomerOrder, 'status'>
    order_items: InsertOrderItem[]
  }) => {
    const { order_info, order_items } = input

    const [order] = await db
      .insert(customerOrderTable)
      .values({
        payment_method: order_info.payment_method,
        status: 'PENDING',
        total: order_info.total,
        user_id: order_info.user_id,
        address_id: order_info.address_id,
        observation: order_info.observation,
      })
      .returning()


    let items: InsertOrderItem[] = []
    for (const item of order_items) {
      items.push({
        ...item,
        order_id: order.id,
      })
      await product.insertStockTransaction({
        item_id: item.product_id,
        quantity: item.quantity,
        order_id: order.id,
        type: 'Saida',
        meta_data: {
          todo: 'TODO: put metadata',
        },
      })
    }
    await db.insert(orderItemTable).values(items)

  },

  getCustomerOrders: async (userId: SelectUser['id']) => {
    return db.query.customerOrderTable.findMany({
      where: eq(customerOrderTable.user_id, userId),
      with: {
        address: true,
        items: {
          with: {
            product: true,
          },
        },
      },
    })
  },
  getCurrentOrders: async () => {
    return db.query.customerOrderTable.findMany({
      where: or(
        ne(customerOrderTable.status, 'DELIVERED'),
        ne(customerOrderTable.status, 'CANCELED'),
      ),
      with: {
        address: true,
        customer: true,
        items: {
          with: {
            product: true,
          },
        },
      },
    })
  },
}
