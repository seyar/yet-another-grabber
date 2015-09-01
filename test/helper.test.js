var utils = require('./../lib/utils');
require('chai').should();

describe('utils test', function() {
    describe('translit', function() {
        it('should return passed str', function () {
            utils.translit('some').should.equal('some');
        });
        it('should return passed str', function () {
            utils.translit('!@#$%^&*()_+{}[]/').should.equal('!@#$%^&*()_+{}[]/');
        });
        it('should return passed str', function () {
            utils.translit('').should.equal('');
        });
        it('should throw error', function () {
            var a = function () {
                utils.translit(55);
            };
            a.should.throw('Unexpected type of param');
        });
        it('should throw error', function () {
            var a = function () {
                utils.translit(['a', 'b']);
            };
            a.should.throw('Unexpected type of param');
        });
        it('should translitarate', function () {
            utils.translit('соме').should.equal('some');
        });
    });
    describe('lastPartUrl', function() {
        it('should return last part', function () {
            utils.lastUrlPart('http://some/some2/last').should.equal('last');
        });
        it('should return all', function () {
            utils.lastUrlPart('http:somesome2last').should.equal('http:somesome2last');
        });
    });
});