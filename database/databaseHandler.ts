const { MongoClient, BulkWriteResult, MongoClientOptions, Db } = require('mongodb');
import DeviceData, { IDeviceData } from '../models/DeviceData';

// for functionality in containerized environments as well as locally run npm apps
const mongoHost = process.env.MONGO_HOST || '127.0.0.1';
const mongoPort = process.env.MONGO_PORT || 27017;
const dbName = process.env.MONGO_DBNAME || 'PraanTask';
const url = `mongodb://${mongoHost}:${mongoPort}/${dbName}`;



class DBHandler{
    public static async performBulkInsert(data: IDeviceData[]): Promise<void> {
  
      const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        socketTimeoutMS: 60000 // Avoids timeouts when containerized
      });
  
      const db = client.db(dbName);
      const collection = db.collection('devicedatas');
  
      let index = 0;
      while (index < data.length) {
        const batch = data.slice(index, index + 100);
        const result: typeof BulkWriteResult = await collection.insertMany(batch, {
            maxTimeMS: 60000
        });
        // console.log(`Inserted ${result.insertedCount} records`);
        index += 100;
      }
  
      client.close();
    }
  
    public static async connectToMongoDB(): Promise<typeof Db> {
      const clientOptions: typeof MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };
  
      try {
        const client = await MongoClient.connect(url, clientOptions);
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        return db;
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      }
    }
  }

  export default DBHandler;