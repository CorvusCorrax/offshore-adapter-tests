var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('1:m association :: .update()', function() {
    describe('update nested associations()', function() {
      describe('with single level depth', function() {

        describe('when association doesn\'t exist', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Customer;

          before(function(done) {
            // Check Customer hasMany Payments
            assert.strictEqual(Associations.Customer.attributes.payments.collection, 'payment');
            assert.strictEqual(Associations.Payment.attributes.a_customer.model, 'customer');

            var data = {
              name: 'has many nested update'
            };

            Associations.Customer.create(data).exec(function(err, values) {
              assert.ifError(err);
              Customer = values;
              done();
            });

          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create new payments', function(done) {

            var data = {
              name: '1:m update nested - updated',
              payments: [
                { amount: 1 }
              ]
            };

            Associations.Customer.update({ id: Customer.id }, data).exec(function(err, values) {
              assert.ifError(err);

              // Look up the customer again to be sure the payments were added
              Associations.Customer.findOne(values[0].id)
              .populate('payments')
              .exec(function(err, model) {
                assert.ifError(err);
                assert.equal(model.name, '1:m update nested - updated');
                assert.strictEqual(model.payments.length, 1);
                assert.strictEqual(model.payments[0].amount, 1);
                done();
              });

            });
          });
        });


        describe('when associations already exist', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Customer;

          before(function(done) {

            var data = {
              name: '1:m update nested',
              payments: [
                { amount: 1 },
                { amount: 2 }
              ]
            };

            Associations.Customer.create(data).exec(function(err, customer) {
              assert.ifError(err);
              Customer = customer;
              done();
            });

          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should reset associations with the updated associations', function(done) {

            var data = {
              name: '1:m update nested - updated',
              payments: [
                { amount: 3 },
                { amount: 4 },
                { amount: 5 }
              ]
            };

            Associations.Customer.update({ id: Customer.id }, data).exec(function(err, values) {
              assert.ifError(err);

              // Look up the customer again to be sure the payments were added
              Associations.Customer.findOne(values[0].id)
              .populate('payments', { sort: 'amount ASC' })
              .exec(function(err, model) {
                assert.ifError(err);
                assert.equal(model.name, '1:m update nested - updated');
                assert.strictEqual(model.payments.length, 3);
                assert.strictEqual(model.payments[0].amount, 3);
                assert.strictEqual(model.payments[1].amount, 4);
                assert.strictEqual(model.payments[2].amount, 5);
                done();
              });

            });
          });
        });

        describe('when associations have primary keys', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Customer, Payments;

          before(function(done) {

            var paymentData = [
              { amount: 1 },
              { amount: 2 }
            ];

            var data = {
              name: '1:m update nested',
              payments: [
                { amount: 100 },
                { amount: 200 }
              ]
            };

            Associations.Payment.create(paymentData).exec(function(err, payments) {
              assert.ifError(err);
              Payments = payments;

              Associations.Customer.create(data).exec(function(err, customer) {
                assert.ifError(err);
                Customer = customer;
                done();
              });
            });
          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should update association values', function(done) {

            var data = {
              name: '1:m update nested - updated',
              payments: Payments.map(function(payment) { return payment.toObject(); })
            };

            Associations.Customer.update({ id: Customer.id }, data).exec(function(err, values) {
              assert.ifError(err);

              // Look up the customer again to be sure the payments were added
              Associations.Customer.findOne(values[0].id)
              .populate('payments',{sort:{amount : 1}})
              .exec(function(err, model) {
                assert.ifError(err);
                assert.equal(model.name, '1:m update nested - updated');
                assert.strictEqual(model.payments.length, 2);

                // Ensure association values were updated
                assert.strictEqual(model.payments[0].amount, 1);
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
