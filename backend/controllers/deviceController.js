const Device = require('../models/device');
const Reading = require('../models/reading');

exports.addNewDevice = async (req, res) => {
  try {
    const { device_id, device_name, location, lab_incharge, status } = req.body;
    if (!device_id || !device_name || !status) {
      return res.status(400).json({ error: 'Device ID, Name, and Status are required.' });
    }
    const device = await Device.create({
      device_id,
      device_name,
      location,
      lab_incharge,
      status
    });
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.fetchAllDevices = async (req, res) => {
  try {
    const devices = await Device.findAll();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.fetchDevice = async (req, res) => {
  try {
    const { device_id } = req.params;
    const device = await Device.findByPk(device_id, {
      include: [{ model: Reading }]
    });
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeDevice = async (req, res) => {
  try {
    const { device_id } = req.params;
    const device = await Device.findByPk(device_id);
    if (!device) return res.status(404).json({ error: 'Device not found' });
    await device.destroy();
    res.json({ message: 'Device removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const { device_id } = req.params;
    const { device_name, location, lab_incharge, status } = req.body;
    const device = await Device.findByPk(device_id);
    if (!device) return res.status(404).json({ error: 'Device not found' });
    device.device_name = device_name ?? device.device_name;
    device.location = location ?? device.location;
    device.lab_incharge = lab_incharge ?? device.lab_incharge;
    device.status = status ?? device.status;
    await device.save();
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.receiveDeviceData = async (req, res) => {
  try {
    const { device_id, timestamp, temperature, humidity } = req.body;
    if (!device_id || temperature == null || humidity == null) {
      return res.status(400).json({ error: 'device_id, temperature, and humidity are required.' });
    }

    const device = await Device.findOne({ where: { device_id } });
    if (!device) {
      return res.status(404).json({ error: 'Device not found.' });
    }

    const reading = await Reading.create({
      device_id,
      timestamp: timestamp || new Date(),
      temperature,
      humidity
    });

    res.status(201).json({ message: 'Data received', reading });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


