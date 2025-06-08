const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const authenticateAdmin = require('../middleware/authenticate');

// --- Public endpoint for ESP32 to send data ---
router.post('/data', deviceController.receiveDeviceData);

// --- Admin-protected routes ---
router.post('/add', authenticateAdmin, deviceController.addNewDevice);
router.get('/all', authenticateAdmin, deviceController.fetchAllDevices);
router.get('/:device_id', authenticateAdmin, deviceController.fetchDevice);
router.delete('/:device_id', authenticateAdmin, deviceController.removeDevice);
router.put('/:device_id', authenticateAdmin, deviceController.updateDevice);

module.exports = router;
