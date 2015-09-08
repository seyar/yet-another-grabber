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
    describe('cleanText', function() {
        it.only('should clean comments, scripts, carriage returns', function () {
            var str = '<div>123</div><!--456-->\
            <link rel="stylesheet" href="#"/>\
            <link rel="stylesheet" href="#">\
            <!-- 45454 -->\
            <style>\
            h1 { color: red;}\
            h2 { \
                color: red;\
            }\
            </style>\
            <script>somecode();</script>\
            <script type="application/javascript">\
                alert("");\
            </script>';
            utils.cleanText(str).should.equal('<div>123</div>');
        });
    });
    describe('striptags', function() {
        it('should strip all tags', function () {
            var str = '<div>123</div><div>456</div>';
            utils.striptags(str).should.equal('123456');
        });
    });
});