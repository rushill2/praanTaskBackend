import { Request, Response } from 'express';
import csvParser from 'csv-parser';
import fs from 'fs';
import DeviceData, { IDeviceData } from '../models/DeviceData';
const { MongoClient, BulkWriteResult, MongoClientOptions, Db } = require('mongodb');
import DBHandler from '../database/databaseHandler';
/*
Class for api route controllers
Member functions: getDeviceData, getDevicePMData, filterDeviceData, bulkUploadData
*/
class DeviceController {

    /* 
    GET Route for device data by device name. Example call: http://localhost:5000/DeviceA
    Inputs: Request, Response
    Purpose: Serves device data by device name
    */
    public static async getDeviceData(req: Request, res: Response) {
      const device = req.params.deviceId;
      
      try {
        // db connection
        const db = await DBHandler.connectToMongoDB();
        const collection = db.collection('devicedatas');
        
        // get device data
        const deviceData: IDeviceData[] = await collection.find({ device }).toArray();
    
        res.json(deviceData);
      } catch (error) {
        console.error('DeviceController.ts | getDeviceData error:', error);
        res.status(500).json({ error: 'Failed to get device data' });
      }
    }
    
    /* 
    GET Route for device PM data (1, 2.5 or 10) data by device name. Example call: http://localhost:5000/DeviceA/pm/1
    Inputs: Request, Response
    Purpose: Serves device PM data by device name
    */
    public static async getDevicePMData(req: Request, res: Response) {
      const queryDevice = req.params.deviceId;
      const queryPM = parseInt(req.params.pmValue, 10); // Convert pmValue to an integer
      console.log(queryPM);
    
      try {
        // db connection
        const db = await DBHandler.connectToMongoDB();
        const collection = db.collection('devicedatas');
        
        // get device data
        const deviceData: IDeviceData[] = await collection.find({ device: queryDevice }).toArray();
        let pmData: number[] | undefined;
    
        // Check the requested PM value and assign the corresponding value
        if (queryPM === 1) {
          pmData = deviceData.map((data) => data.p1);
        } else if (queryPM === 10) {
          pmData = deviceData.map((data) => data.p10);
        } else if (queryPM === 25) {
          pmData = deviceData.map((data) => data.p25);
        } else {
          res.status(400).json({ error: 'Invalid PM value' });
          return;
        }
        // filtered device data
        res.json(pmData);
      } catch (error) {
        console.error("DeviceController.ts | getDevicePMData error:", error);
        res.status(500).json({ error: 'Failed to get device PM data' });
      }
    }
    
    /* 
    GET Route for device data by device name, filtered by within startDate and endDate parameters. Example call: http://localhost:5000/DeviceA/filter?startDate=2021-03-19&endDate=2021-03-20
    Inputs: Request, Response
    Purpose: Serves device data by device name, within a threshold of days
    */
    public static async filterDeviceData(req: Request, res: Response) {
      try {
        const { deviceId } = req.params;
        const { startDate, endDate } = req.query;
        const db = await DBHandler.connectToMongoDB();
        const collection = db.collection('devicedatas');
    
        // Convert start and end dates to Date objects
        const startTime = new Date(startDate as string);
        const endTime = new Date(endDate as string);
    
        // Validate the start and end dates
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          throw new Error('Invalid start time or end time');
        }
    
        const deviceData: IDeviceData[] = await collection.find({
          device: deviceId,
          t: { $gte: startTime, $lte: endTime },
        }).toArray();
    
        res.status(200).json(deviceData);
      } catch (error) {
        console.error("DeviceController.ts | filterDeviceData error:", error);
        res.status(500).json({ error: 'An error occurred' });
      }
    }
    
    
    /* 
    POST Route for bulk upload. Example call: http://localhost:5000/bulk-upload
    Inputs: Request, Response
    Purpose: Bulk upload to mongodb in batches of 100 to avoid timeouts
    */
    public static bulkUploadData(req: Request, res: Response) {
      try {
        const csvFilePath = 'data/test_dataset_all.csv';
        let invalidDatesCount = 0;
        let validDatesCount = 0;
        const bulkInsertData: IDeviceData[] = [];
    
        fs.createReadStream(csvFilePath)
          .pipe(csvParser())
          .on('data', (data: any) => {
            try {
              const dateTimeString = data.t;
              const dateParts = dateTimeString.substring(0, 8).split('/');
              const timeParts = dateTimeString.substring(9).split(':');
              const year = Number(dateParts[0]);
              const month = Number(dateParts[1]);
              const day = Number(dateParts[2]);
              const hour = Number(timeParts[0]);
              const minute = Number(timeParts[1]);
              const second = Number(timeParts[2]);
              const parsedDate = new Date(year + 2000, month - 1, day, hour, minute, second);
    
              if (isNaN(parsedDate.getTime())) {
                invalidDatesCount++;
                return;
              } else {
                validDatesCount++;
              }
    
              const deviceData: IDeviceData = new DeviceData({
                device: data.device,
                t: parsedDate,
                w: parseInt(data.w),
                h: data.h,
                p1: parseFloat(data.p1),
                p25: parseFloat(data.p25),
                p10: parseFloat(data.p10),
              });
    
              bulkInsertData.push(deviceData);
    
            } catch (error) {
              console.error('Error processing row:', data);
            }
          })
          .on('end', async () => {
            try {
              await DBHandler.performBulkInsert(bulkInsertData);
              res.status(200).json({ message: `Bulk upload completed. Processed ${validDatesCount} records successfully` });
            } catch (error) {
              console.error('Bulk insert error:', error);
              res.status(500).json({ error: 'An error occurred during bulk insert' });
            }
          });
      } catch (error) {
        console.error('Bulk upload error:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
    }
}

export default DeviceController;