var db = require('./dataBase')
var constants = require('./constants')
var notifier = require('./notifier')

module.exports = {

    buildMetricBadge: function(projectId, metric, response) {
        notifier.info('Obteniendo metricas del proyecto: ' + projectId);
        if(db.has(projectId)) {
            var data = db.get(projectId);
            var metricData = data[metric.toUpperCase()];
            var color = constants.GREEN_COLOR;
            if (metricData.percentage < 60) {
                color = constants.RED_COLOR;
            } else if (metricData.percentage >= 60 && metricData.percentage < 85) {
                color = constants.YELLOW_COLOR;
            }
            var url = constants.SHILED_IO_URL + metric.toLowerCase() + "-" + metricData.percentage + "-" + color + ".svg";
            notifier.debug('Generando url: ' + url);
            response.redirect(302, url);
        } else {
            notifier.info('Metricas del proyecto ' + projectId + ' no encontradas');
            var url = constants.SHILED_IO_URL + metric.toLowerCase() + "-notAvilable-lightgrey.svg";
            response.redirect(302, url);
        }
    }
}