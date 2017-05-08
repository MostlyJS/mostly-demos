import { beforeHook, afterHook } from './hooks';
import memory from 'feathers-memory';

export default function() {
  const app = this;

  // initialize service
  const service = new memory();
  app.use('dummies', service);

  // service hooks
  //app.service('dummies').before(beforeHook).after(afterHook);

  // some testing data
  const dummies = app.service('dummies');
  console.log(dummies.after);
  dummies.create({id: 1, text: 'A million people walk into a Silicon Valley bar'}, {}, function(){});
  dummies.create({id: 2, text: 'Nobody buys anything'}, {}, function(){});
  dummies.create({id: 3, text: 'Bar declared massive success'}, {}, function(){});
  dummies.create({id: 4, text: 'Foo meet dummies'}, {}, function(){});
}
