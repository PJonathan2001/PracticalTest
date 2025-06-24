import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import config from './config/default';

app.listen(config.port, () => {
  console.log(`Servidor escuchando en puerto ${config.port}`);
  console.log(`Frontend URL: ${config.frontendUrl}`);
  console.log(`Base URL: ${config.baseUrl}`);
  console.log(`Entorno: ${config.nodeEnv}`);
}); 