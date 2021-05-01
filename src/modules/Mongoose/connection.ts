import mongoose from 'mongoose';
import { MONGO_CONNECTION_URI } from 'modules/Constants';
import { Logger } from 'modules/Logger';

mongoose.connect(MONGO_CONNECTION_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
});

const db = mongoose.connection;
db.on('error', (err) => Logger.error(err));
db.once('open', () => {
  Logger.info('MongoDB connection open.');
});

export { mongoose };
