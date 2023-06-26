// routes/devices.ts
import express from 'express';
import DeviceController from '../controllers/DeviceController';

const router = express.Router();

router.get('/:deviceId', DeviceController.getDeviceData);
router.get("/:deviceId/pm/:pmValue", DeviceController.getDevicePMData);
router.get('/:deviceId/filter', DeviceController.filterDeviceData);
router.post('/bulk-upload', DeviceController.bulkUploadData);

module.exports = router;

