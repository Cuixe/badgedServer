var chai = require('chai');
var db = require('../../lib/dataBase')
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;

describe('DataBasePut', function() {
    it('Should add new row', function() {
        data = { valor:1, dato:'some'}
        db.put(1, data);
        var result = db.get(1)
        expect(result.valor).to.equal(1);
        expect(result.dato).to.equal('some');
    });
});

describe('DataBaseDelete', function() {
    it('Add new row and then delete it', function() {
        data = { valor:1, dato:'some'}
        db.put(1, data);
        var result = db.get(1)
        assert.equal(1, data.valor);
        assert.equal('some', data.dato);
        db.del(1);
        result = db.get(1)
        assert.equal(undefined, result)
    });
});

describe('HasFunction', function() {
    it('Evaluate when exists row data', function() {
        data = { valor:1, dato:'some'}
        db.put(1, data);
        assert.isTrue(db.has(1));
        assert.isFalse(db.has(100));
    });
});

describe('SaveComplexType', function() {
    it('Saving complex json object wicht contains several attributes', function() {
        data = { 
            Data1:{id:1, describe:'some'},
            Data2:{id:2, describe:'some'},
            Data3:{id:3, describe:'some'}
        }
        db.put(1, data);
        var result = db.get(1)
        assert.equal(1, result.Data1.id);
        assert.equal("some", result.Data1.describe);
    });
});

describe('SaveArrayType', function() {
    it('Saving array with 3 elements on it', function() {
        data = [
            {id:1, describe:'some'},
            {id:2, describe:'some'},
            {id:3, describe:'some'}
        ]
        db.put(3, data);
        var result = db.get(3)
        assert.equal(3, result.length);
        assert.equal(1, result[0].id);
        assert.equal("some", result[0].describe);
    });
});