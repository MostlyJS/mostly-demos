import util from 'util';
import poplar from '../../../mostly-poplarjs';

const Entity = poplar.Entity;
const ApiBuilder = poplar.ApiBuilder;

// User Entity
var DummyEntity = new Entity({
  username: true,
  age: true,
  description: { as: 'introduction' },
  nation: { value: 'China' },
  gender: { default: 'unknown' },
  fullname: function(obj) {
    return util.format('%s %s', obj.firstName || '', obj.lastName || '');
  },
  isAdult: function(obj) {
    return obj.age >= 18 ? true : false;
  },
  hasCreditCard: function(obj) {
    return obj.creditCard ? true : false;
  }
});

var DummyApi = new ApiBuilder('dummies');

DummyApi.before('*', function(ctx, next) {
  console.log('before.dummies.* called');
  next();
});

DummyApi.before('info', function(ctx, next) {
  console.log('before.dummies.info called');
  next();
});

DummyApi.after('info', function(ctx, next) {
  console.log('after.dummies.info called');
  next();
});

DummyApi.after('*', function(ctx, next) {
  console.log('after.dummies.* called');
  next();
});

DummyApi.define('info', {
  accepts: [
    {
      arg: 'id',
      type: 'number',
      validates: {
        required: { message: 'id can\'t be empty' },
        isInt: { message: 'id must be a integer' },
        largerThan20: function(val) {
          if (val <= 20) {
            return 'id must be large than 20';
          }
        }
      },
      description: 'user id'
    }
  ],
  description: 'Get user info',
  http: { path: 'info', verb: 'get' },
  presenter: DummyEntity,
  returns: function(ctx, cb) {
    cb();
  }
}, function(params, cb) {

  cb(null, {
    username: 'Dummy',
    age: 25,
    description: 'A dummy who is yummy',
    firstName: 'Dummy',
    lastName: 'Yummy',
    creditCard: 88888888888888,
    gender: 'male'
  });
});

DummyApi.define('show', {
  accepts: [
    {
      arg: 'id',
      type: 'number',
      required: true,
      description: 'user id'
    }
  ],
  description: 'Get user info',
  http: { path: ':id', verb: 'get' }
}, function(params) {
  cb(null, { id: params.id });
});

module.exports = DummyApi;
