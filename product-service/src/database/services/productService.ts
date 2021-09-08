import {Client} from 'pg';
import Product from '../../models/Product';
import ProductRequest from '../../models/ProductRequest';
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

export const createProduct = async (productRequest: ProductRequest): Promise<string> => {
  const client = new Client(dbOptions);
  const {title, description, price, count} = productRequest;
  const queryProduct = 'INSERT INTO products(title, description, price) VALUES($1, $2, $3) RETURNING id';
  const valuesProduct = [title, description, price];
  const queryStock = 'INSERT INTO stocks(product_id, count) VALUES($1, $2)';

  try {
    await client.connect();
    await client.query('BEGIN');
    const {rows: products} = await client.query(queryProduct, valuesProduct);
    const productId = products[0].id;
    const countStock = [productId, count];
    await client.query(queryStock, countStock);
    console.log("Product created:" + productId);
    await client.query('COMMIT');
    return productId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw new Error('Failed to create product in database + ' + error);
  } finally {
    client.end();
  }
};