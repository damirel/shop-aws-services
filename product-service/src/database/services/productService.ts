import {Client} from 'pg';
import Product from '../../models/Product';
import {dbOptions} from '../config';

export const getAllProducts = async (): Promise<Product[]> => {
  const client = new Client(dbOptions);
  const query =
        `SELECT p.id, p.title, p.description, p.price, s.count 
        FROM products p 
        JOIN stocks s ON p.id = s.product_id`;

  try {
    await client.connect();
    const {rows: result} = await client.query(query);
    return result;
  } catch (error) {
    throw new Error('Failed to get all products from database + ' + error);
  } finally {
    client.end();
  }
};

export const getProduct = async (id: string): Promise<Product[]> => {
  const client = new Client(dbOptions);
  const query =
      `SELECT p.id, p.title, p.description, p.price, s.count 
        FROM products p 
        LEFT JOIN stocks s ON p.id = s.product_id 
        WHERE p.id='${id}'`;

  try {
    await client.connect();
    const {rows: result} = await client.query(query);
    return result;
  } catch (error) {
    throw new Error('Failed to get product from database + ' + error);
  } finally {
    client.end();
  }
};