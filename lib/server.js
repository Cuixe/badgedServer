var request = require('request');
var express = require('express');
var properties = require('properties')
var createHandler = require('node-gitlab-webhook')

var gitlab = require('./gitlabBadge')
var constants = require('./constants')
var builder = require('./projectBuilder')
var metrics = require('./badgeService')
var notifier = require('./notifier')

constants.projecPath = __dirname.replace("/lib", "");

var handler = createHandler([
    { path: '/webhook/singleProject', secret: 'secret'},
    { path: '/webhook/multiProject', secret: 'secret'}
])

var app = express();

app.all('/webhook/:projectType', function(req, res) {
    notifier.info("Request: " + req.path);
    handler(req, res, function (err) {
        res.statusCode = 404
        res.end('no such location')
    })
});

app.get('/jacoco/:projectId/:metric', function(req, res) {
    notifier.info("Request: " + req.path);
    metrics.buildMetricBadge(req.params.projectId, req.params.metric, res);
});

app.get('/build/:projectType/:projectId', function(req, res) {
    notifier.info("Request: " + req.path);
    switch(req.params.projectType) {
        case 'simple':
            builder.compileProject(req.params.projectId, constants.JACOCO_SINGLE_TASK, function(err, status) {
                response.send(status)
            });
            break;
        case 'multiple':
            builder.compileProject(req.params.projectId, constants.JACOCO_MULTI_TASK, function(err, status) {
                response.send(status)
            });
            break;
    }
});

app.get('/git/:projectId/:option', function (req, res) {
    notifier.info("Request: " + req.path);
    switch(req.params.option) {
        case 'detail':
            gitlab.getProyectInfo(req.params.projectId, res);
            break;
        case 'buildStatus':
            gitlab.buildStatusBadge(req.params.projectId, res);
            break;
            case 'buildStatus':
        gitlab.buildStatusBadge(req.params.projectId, res);
            break;
        case 'lastTag':
            gitlab.lastTagBadge(req.params.projectId, res);
            break;

    }
});

properties.parse ("etc/configuration.1.properties", { path: true }, function (error, obj) {
    if (error) {
        notifier.error(error);
        console.error(error);
    } else {
        constants.gitlabData.url = obj['badge.gitlab.url'];
        constants.gitlabData.privateToken = obj['badge.gitlab.token'];
        app.listen(obj['badge.port']);
        notifier.notify('info', 'LISTENING PORT ' + obj['badge.port'])
        console.log( 'LISTENING PORT ' + obj['badge.port'])
    }
});

/*handler.on('push', function (event) {
    var payload = event.payload
    var repository = payload.repository;
    notifier.debug("Webhook: ", payload);
    switch (event.path) {
        case '/webhook/singleProject':
            builder.buildSingleProject(payload.project_id, repository.name, repository.git_ssh_url, function(err, status) {
            });
            break
        case '/webhook/multiProject':
            builder.buildMultiProject(payload.project_id, repository.name, repository.git_ssh_url, function(err, status) {

            });
            break
        default:
            notifier.notify('debug', "UNSUPPORTED")
            break
    }
});*/

handler.on('*', function(event) {
    console.log(JSON.stringify(event))
})