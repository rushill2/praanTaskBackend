import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the DeviceData document
export interface IDeviceData extends Document {
  device: string;
  t: Date; // Updated to string type for date and time
  w: number;
  h: String;
  p1: number;
  p25: number;
  p10: number;
}

// Define the DeviceData schema
const deviceDataSchema = new Schema<IDeviceData>({
  device: { type: String, required: true },
  t: { type: Date, required: true }, // Updated to string type for date and time
  w: { type: Number, required: true },
  h: { type: String, required: true },
  p1: { type: Number, required: true },
  p25: { type: Number, required: true },
  p10: { type: Number, required: true },
});

// Define and export the DeviceData model
export default mongoose.model<IDeviceData>('DeviceData', deviceDataSchema);
