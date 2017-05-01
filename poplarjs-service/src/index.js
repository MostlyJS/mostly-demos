import nats from 'nats';
import mostly from 'mostly-node';
import poplar from 'mostly-poplarjs';
import dummyApi from './dummy_api';

const trans = new mostly(nats.connect(), {
  logLevel: 'info'
});

trans.ready(() => {
  var app = poplar.create(trans)
    .use(dummyApi)
    .handler();
});
