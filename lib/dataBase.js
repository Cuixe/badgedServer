var flat = require('flat-file-db');
var db = flat.sync('./metrics.db');

module.exports = {
    
    get: function(projectId) {
        return db.get(projectId)
    },

    put:function(projectId, data) {
        db.put(projectId, data)
    },

    del: function(projectId) {
        db.del(projectId)
    },

    has: function(projectId) {
        return db.has(projectId)
    }
}
