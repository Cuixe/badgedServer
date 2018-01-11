var SHILED_IO_URL = "http://img.shields.io/badge/";
var GREEN_COLOR = "brightgreen"
var YELLOW_COLOR = "yellow"
var RED_COLOR = "red"
var JACOCO_SINGLE_TASK = 'jacocoTestReport'
var JACOCO_MULTI_TASK = 'jacocoMultiprojectReport'

var GITLAB_URL=''
var GITLAB_PRIVATE_TOKEN=''
var projecPath;

module.exports = {
    gitlabData: {
        url:GITLAB_URL,
        privateToken: GITLAB_PRIVATE_TOKEN
    },
    projecPath: projecPath,
    SHILED_IO_URL: SHILED_IO_URL,
    GREEN_COLOR: GREEN_COLOR,
    YELLOW_COLOR: YELLOW_COLOR,
    RED_COLOR: RED_COLOR,
    JACOCO_SINGLE_TASK:JACOCO_SINGLE_TASK,
    JACOCO_MULTI_TASK:JACOCO_MULTI_TASK,
}