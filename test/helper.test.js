var Helper = require('./../lib/helper');
require('chai').should();

describe('Helper test', function() {
    describe('translit', function() {
        it('should return passed str', function () {
            Helper.translit('some').should.equal('some');
        });
        it('should return passed str', function () {
            Helper.translit('!@#$%^&*()_+{}[]/').should.equal('!@#$%^&*()_+{}[]/');
        });
        it('should return passed str', function () {
            Helper.translit('').should.equal('');
        });
        it('should throw error', function () {
            var a = function () {
                Helper.translit(55);
            };
            a.should.throw('Unexpected type of param');
        });
        it('should throw error', function () {
            var a = function () {
                Helper.translit(['a', 'b']);
            };
            a.should.throw('Unexpected type of param');
        });
        it('should translitarate', function () {
            Helper.translit('соме').should.equal('some');
        });
    });
    describe('lastPartUrl', function() {
        it('should return last part', function () {
            Helper.lastUrlPart('http://some/some2/last').should.equal('last');
        });
        it('should return all', function () {
            Helper.lastUrlPart('http:somesome2last').should.equal('http:somesome2last');
        });
    });
});