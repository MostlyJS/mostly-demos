import nats from 'nats';
import mostly from 'mostly-node';
import feathers from 'mostly-feathers';
import hooks from 'feathers-hooks';
import service from './service';

const trans = new mostly(nats.connect(), {
  logLevel: 'info'
});

trans.ready(() => {
  var app = feathers(trans)
    .configure(hooks)
    .configure(service);
});
