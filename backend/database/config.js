const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    const uri = process.env.DB_CNN;
    if (!uri) {
      console.warn('DB_CNN no definida — simulación sin persistencia.');
      return;
    }
    await mongoose.connect(uri);
    console.log('DB Online');
  } catch (error) {
    console.error('Error MongoDB:', error);
    console.warn('Continuando sin base de datos.');
  }
};

module.exports = { dbConnection };
