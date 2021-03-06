var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Has Many Association', function() {
    describe('create nested associations()', function() {

      describe('with single level depth', function() {

        describe('and objects', function() {

          before(function(done) {
            // Check Customer hasMany Payments
            assert.strictEqual(Associations.Customer.attributes.payments.collection, 'payment');
            assert.strictEqual(Associations.Payment.attributes.a_customer.model, 'customer');
            done();
          });

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new customer and payment association', function(done) {

            var data = {
              name: 'has many nested',
              payments: [
                { amount: 1 },
                { amount: 2 }
              ]
            };

            Associations.Customer.create(data).exec(function(err, values) {
              assert.ifError(err);

              // Look up the customer again to be sure the payments were added
              Associations.Customer.findOne(values.id)
              .populate('payments', { sort: 'amount ASC' })
              .exec(function(err, model) {
                assert.ifError(err);
                assert.strictEqual(model.payments.length, 2);
                assert.strictEqual(model.payments[1].amount, 2);
                done();
              });

            });
          });
        });

        describe('and objects mixed with ids', function() {
          var pmtId;

          before(function(done) {
            Associations.Payment.create({ amount: 1 }).exec(function(err, payment) {
              assert.ifError(err);
              pmtId = payment.id;
              done();
            });
          });

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new customer and payment association', function(done) {

            var data = {
              name: 'has many nested',
              payments: [
                pmtId,
                { amount: 2 }
              ]
            };

            Associations.Customer.create(data).exec(function(err, values) {
              assert.ifError(err);

              // Look up the customer again to be sure the payments were added
              Associations.Customer.findOne(values.id)
              .populate('payments', { sort: 'amount ASC' })
              .exec(function(err, model) {
                assert.ifError(err);
                assert.strictEqual(model.payments.length, 2);
                assert.strictEqual(model.payments[1].amount, 2);
                done();
              });

            });
          });
        });

      });
    });
  });
});
