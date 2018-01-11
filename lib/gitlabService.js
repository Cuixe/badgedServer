var constants = require('./constants')
var notifier = require('./notifier')
var request = require('request');

module.exports = {

    getProyectDataByName: function(projectName, cb) {
        var search_query = '/projects?search=' + projectName;
        executeGitRequest(search_query, cb)
    },

    getProyectDataById: function(projectId, cb) {
        var search_query = '/projects/'+projectId;
        executeGitRequest(search_query, cb)
    },

    getBuildData: function(projectId, cb) {
        var url = '/projects/' + projectId + '/builds';
        executeGitRequest(url, function(err, data) {
            if(err != undefined) {
                response.send(err)
            } else {
                if(data) {
                    cb(err, data[0]);
                }
            }
        });
    },

    getLastTagData: function(projectId, cb) {
        var url = '/projects/' + projectId + '/repository/tags';
        executeGitRequest(url, function(err, data) {
            if(err != undefined) {
                response.send(err)
            } else {
                if(data) {
                    cb(err, data[0]);
                }
            }
        });
    }

}

function executeGitRequest(url, cb) {
    var token;
    if(url.indexOf('?') == -1) {
        token = '?private_token=' + constants.gitlabData.privateToken
    } else {
        token = '&private_token=' + constants.gitlabData.privateToken
    }
    url = constants.gitlabData.url + '/api/v3/' + url + token;
    request.get({
        url: url,
        json: true
    }, function (err, res) {
            notifier.debug("Gitlab Request: " + constants.gitlabData.url + '/api/v3/' + url)
            if (err) {
                notifier.error("Gitlab Response ERROR: ", err);
                return cb(err);
            }
            notifier.debug("Gitlab Response: ", res.body);
            cb(null, res.body);
        }
    );
}