import nats from 'nats';
import mostly from '../../../mostly-core';
import feathers from '../../../mostly-feathers';
import service from './service';
import hooks from 'feathers-hooks';

const trans = new mostly(nats.connect(), {
  logLevel: 'info'
});

trans.ready(() => {
  var app = feathers(trans)
    .configure(hooks)
    .configure(service);
});
