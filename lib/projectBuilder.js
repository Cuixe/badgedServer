var exec = require('child_process').exec;
var parseString = require('xml2js').parseString;
var fs = require('fs');
var db = require('./dataBase')
var gitlabService = require('./gitlabService')
var notifier = require('./notifier')

module.exports = {
    buildSingleProject: function(projectId, projectName, projectUrl, cb) {
        var self = this;
        self.executeBuild(projectId, projectName, projectUrl, 'master', 'jacocoTestReport', cb)
    },
    buildMultiProject: function(projectId, projectName, projectUrl, cb) {
        var self = this;
        self.executeBuild(projectId, projectName, projectUrl, 'master', 'jacocoMultiprojectReport',cb)
    },

    executeBuild: function(projectId, projectName, projectUrl, branch, jacocoTask, cb) {
        var self = this;
        var command = "./bin/compile.sh " + projectName + " " + projectUrl + " " + branch + " " + jacocoTask
        notifier.info("Iniciando proceso del poyecto " + projectName);
        exec(command, function(err, stdout, stderr) {
            if (err) {
                notifier.error("Error al ejecutar el comando: ", err);
            } else if(stdout.indexOf("BUILD SUCCESSFUL") > -1) {
                notifier.debug("Compilación del poyecto " + projectName + " exitosa");
                var init = stdout.indexOf("Checking coverage results") + 27;
                var end = stdout.indexOf(jacocoTask + ".xml")
                notifier.debug("Obteniendo estadisticos...")
                var file = stdout.substring(init, end) + jacocoTask + ".xml"
                notifier.debug("Procesando archivo: " + file);
                var xml = fs.readFileSync(file, 'utf8');
                var data = self.extractMetricsFromXML(xml, function(err, data) {
                    if(err) {
                        notifier.error("Error al compilar el proyecto", err)
                        cb(err);
                    } else {
                        notifier.debug('Guardando estadisticos', data)
                        db.put(projectId, data);
                        notifier.info('Proceso Termiando para proyecto: ' + projectName)
                        cb(err, "SUCCEED");
                    }
                });
            } else {
                notifier.info("Compilación falló")
                notifier.debug("SALIDA: \n", stdout)
            }
        });
    },

    compileProject: function(projectId, jacocoTask, cb) {
        var self = this;
        var data = gitlabService.getProyectDataById(projectId, function(err, data){
            if(err) {
                notifier.error("Error al compilar el proyecto", err)
            } else {
                var url = data.ssh_url_to_repo;
                var init = url.lastIndexOf('/')+1;
                var end = url.length;
                var name = url.substring(init, end).replace(".git","");
                self.executeBuild(projectId, name, url, 'master', jacocoTask, cb);
            }
        });
        
    },

    extractMetricsFromXML: function(xml, cb) {
        parseString(xml, function (err, result) {
            var data = {}
            if (result.report.counter) {
                for(var i=0; i<result.report.counter.length;i++) {
                    var metric = result.report.counter[i]['$']
                    var missed = parseInt(metric.missed);
                    var covered = parseInt(metric.covered);
                    var total = missed + covered;
                    var percentage = (covered*100) / total;
                    data[metric.type] = {
                        percentage:Math.round(percentage),
                        missed:missed,
                        covered:covered
                    }
                }
                cb(err, data);
            } else {
                cb({message:'Result Not Found'});
            }
        });
    }
}