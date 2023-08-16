//@auth
//@req(baseUrl, cronTime, dbuser, dbpass)
var repoName          = getParam("repoName");
var defaultScriptName = "${env.envName}-wp-backup-" + repoName;
var scriptName        = getParam("scriptName", defaultScriptName);
var envName           = getParam("envName", "${env.envName}");
var envAppid          = getParam("envAppid", "${env.appid}");
var userId            = getparam("userId", "");
var backupCount       = getParam("backupCount", "5");
var storageNodeId     = getParam("storageNodeId");
var backupExecNode    = getParam("backupExecNode");
var storageEnv        = getParam("storageEnv");
var nodeGroup         = getParam("nodeGroup");
var dbuser            = getParam("dbuser");
var dbpass            = getParam("dbpass");
var dbname            = getParam("dbname");
var repoPass          = getParam("repoPass");

function run() {
    var BackupManager = use("scripts/backup-manager.js", {
        session           : session,
        baseUrl           : baseUrl,
        uid               : userId,
        cronTime          : cronTime,
        scriptName        : scriptName,
        envName           : envName,
        envAppid          : envAppid,
        backupCount       : backupCount,
        storageNodeId     : storageNodeId,
        backupExecNode    : backupExecNode,
        storageEnv        : storageEnv,
        nodeGroup         : nodeGroup,
        dbuser            : dbuser,
        dbpass            : dbpass,
        dbname            : dbname,
        repoName          : repoName,
        repoPass          : repoPass,
    });

    jelastic.local.ReturnResult(
        BackupManager.install()
    );
}

function use(script, config) {
    var Transport = com.hivext.api.core.utils.Transport,
        url = baseUrl + "/" + script + "?_r=" + Math.random(),   
        body = new Transport().get(url);
    return new (new Function("return " + body)())(config);
}

try {
    run();
} catch (ex) {
    var resp = {
        result : com.hivext.api.Response.ERROR_UNKNOWN,
        error: "Error: " + toJSON(ex)
    };

    jelastic.marketplace.console.WriteLog("ERROR: " + resp);
    jelastic.local.ReturnResult(resp);
}
