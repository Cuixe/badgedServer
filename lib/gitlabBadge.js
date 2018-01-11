var constants = require('./constants')
var notifier = require('./notifier')
var gitlab = require('./gitlabService')

module.exports = {

    getProyectInfo: function(projectName, response) {
        gitlab.getProyectDataByName(projectName, function(err, data) {
            if(err != undefined) {
                response.send(err)
            } else {
                response.send(data)
            }
        });
    },
    getProyectInfoById: function(projectId, response) {
        gitlab.getProyectDataById(projectId, function(err, data) {
            if(err != undefined) {
                response.send(err)
            } else {
                response.send(data)
            }
        });
    },

    buildStatusBadge: function(projectId, response) {
        gitlab.getBuildData(projectId, function(err, build) {
            if(err != undefined) {
                response.send(err)
            } else {
                if(build) {
                    var status = build.status;
                    var color = '';
                    if (status == "failed") {
                        color = constants.RED_COLOR;
                    } else {
                        color = constants.GREEN_COLOR
                    }
                    var shildUrl = constants.SHILED_IO_URL + 'Build Status-' + status + '-' + color + '.svg'
                    notifier.debug("Generando Badge: " + shildUrl)
                    response.redirect(302, shildUrl);
                }
            }
        });
    },

    lastTagBadge: function(projectId, response) {
        var url = '/projects/' + projectId + '/repository/tags';
        gitlab.getLastTagData(projectId, function(err, tag) {
            if(err != undefined) {
                response.send(err)
            } else {
                if(tag) {
                    tagvalue = tag.name
                    var shildUrl = constants.SHILED_IO_URL + 'Last Tag-' + tagvalue + '-orange.svg'
                    notifier.debug("Generando Badge: " + shildUrl)
                    response.redirect(302, shildUrl);
                }
            }
        });
    }
}