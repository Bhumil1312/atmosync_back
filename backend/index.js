require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

const esp32LogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'esp32.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

app.use('/devices/data', morgan(':date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms :req[body]', {
  stream: esp32LogStream
}));

const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

app.use('/auth', authRoutes);     
app.use('/devices', deviceRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
