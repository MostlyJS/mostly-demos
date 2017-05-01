import bodyParser from 'body-parser';
import compress from 'compression';
import cors from 'cors';
import express from 'express';
import favicon from 'favicon';
import qs from 'qs';
import { handler } from 'feathers-errors';
import nats from 'nats';
import mostly from 'mostly-node';
import poplar from 'mostly-poplarjs-rest';
import feathers from 'mostly-feathers-rest';

const trans = new mostly(nats.connect(), {
  logLevel: 'info'
});

const app = express();

// overrite the express/qs parser's depth limit
app.set('query parser', function (str) {
  return qs.parse(str, { depth: 10 });
});

app.use(compress())
  .options('*', cors({ maxAge: 60 * 60 * 24 * 365 }))
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }));

trans.ready(() => {
  app.use(poplar(app, trans, '/poplar'));
  app.use(feathers(app, trans, '/feathers'));
  app.listen(3001);
});
