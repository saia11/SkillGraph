import { Pool, PoolClient } from 'pg';
import { DatabaseConfig } from '@/dto';
// Use global process object (available in Node.js)
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

class DatabaseConnection {
  private pool: Pool;
  private static instance: DatabaseConnection;

  private constructor() {
    const config: DatabaseConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'skillgraph',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
    };

    this.pool = new Pool({
      ...config,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    });

    // Handle pool errors
    this.pool.on('error', (err: Error) => {
      console.error('Unexpected error on idle client', err);
    });

    // Handle pool connection events
    this.pool.on('connect', () => {
      console.log('Database connection established');
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  public async query(text: string, params?: any[]) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Database query error', { text, error });
      throw error;
    }
  }

  public async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }

  // Health check method
  public async isHealthy(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  // Initialize database with schema
  public async initializeSchema(): Promise<void> {
    try {
      // Get current file directory in ESM
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      
      const schemaPath = join(__dirname, 'schema.sql');
      const schema = readFileSync(schemaPath, 'utf8');
      
      // Split schema into individual statements and execute them
      const statements = schema
        .split(';')
        .map((stmt: string) => stmt.trim())
        .filter((stmt: string) => stmt.length > 0);

      for (const statement of statements) {
        await this.query(statement);
      }
      
      console.log('Database schema initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database schema:', error);
      throw error;
    }
  }
}

export default DatabaseConnection;
