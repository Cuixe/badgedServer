var chai = require('chai');
var builder = require('../../lib/projectBuilder')
var assert = chai.assert;
var fs = require('fs');
path = require('path');

describe('ExtractMetricsFromXML', function() {
    it('Passing a prodiuced jacoco xml, should be able to extract metrics', function() {
        var xml = fs.readFileSync(__dirname + '/metrics.xml', 'utf8');
        assert.notEqual(undefined, xml)
        builder.extractMetricsFromXML(xml, function(err, data) {
            assert.equal(124, data.INSTRUCTION.missed)
            assert.equal(677, data.INSTRUCTION.covered)
        })
    });
});
