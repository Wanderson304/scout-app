
/*
  When you run node-sass on a project, we output status messages
  and error alerts as green and red panels using these functions.
*/

(function(){

    function alert (error, projectID) {
        if ($("#project-settings").is(":visible")) {
            var id = $("#projectID").val();
            $("#sidebar ." + id).click();
        }

        projectID = projectID || "sa0";
        var file = error.file;
        var bugLine = error.line;
        var col = error.column;
        var code = error.status;
        var time = new Date().timeNow();
        var title = scout.localize("ALERT_TITLE");
        title = title.replace("{{time}}", time).replace("{{code}}", code).replace("{{bugLine}}", bugLine).replace("{{col}}", col);
        var footer = '<em>' + file + '</em>';
        var bugFile = file.replace('\\','/').split('/');
        bugFile = bugFile[bugFile.length - 1];

        var fileContents = ugui.helpers.readAFile(file);
        fileContents = fileContents.split('\n');
        var count = fileContents.length;

        var theError = '<span class="num">' + bugLine + ':</span> <span class="text-primary">' + fileContents[(bugLine-1)] + '</span>';
        var errorPreview = theError;
        //Replace tabbed returns with bullet points, and regular returns with <BR>'s
        var errorMessage = error.message
            .replace(/[\r,\n]\s\s/g, '<br /><span class="bullet"></span>')
            .replace(/[\n\r]/g, '<br />')
            .replace(file,'');

        //Make sure there are at least 3 lines in the file and the error isn't on the first or last line
        if (count > 3 && (bugLine-1) !== 0 && (bugLine) !== count) {
            errorPreview =
              //line before the error
              '<span class="num">' + (bugLine-1) + ':</span> ' + fileContents[(bugLine-2)] + '\n' +
              theError + '\n' +
              //line after the error
              '<span class="num">' + (bugLine+1) + ':</span> ' + fileContents[bugLine];
        }

        var formmatedError =
            '<div class="panel panel-primary ' + projectID + '">' +
              '<div class="panel-heading">' +
                '<span class="pull-right glyphicon glyphicon-remove"></span>' +
                '<h3 class="panel-title">' + title + '</h3>' +
              '</div>' +
              '<div class="panel-body">' +
                errorMessage + '<br />' +
                '<strong>' + bugFile + '</strong><br />' +
                '<pre>' +
                  '<code>' +
                    errorPreview +
                  '</code>' +
                '</pre>' +
              '</div>' +
              '<div class="panel-footer">' +
                footer +
              '</div>' +
            '</div>';

        $("#printConsole").prepend(formmatedError);

        $("#printConsole .panel .glyphicon-remove").click( function () {
            $(this).parent().parent().fadeOut(400, "linear", function () {
                $(this).remove();
            });
        });

        $("#sidebar .active").click();
    }

    function message (message, projectID) {
        if ($("#project-settings").is(":visible")) {
            var id = $("#projectID").val();
            $("#sidebar ." + id).click();
        }

        projectID = projectID || "sa0";
        var folderPathSplit = message.stats.entry.split('\\').join('/').split('/');
        var folderAndFile = folderPathSplit[folderPathSplit.length - 2] + '\\' + folderPathSplit[folderPathSplit.length - 1];
        var time = new Date().timeNow();
        var duration = message.stats.duration + scout.localize('MILLISECONDS_SHORT');
        if (message.stats.duration > 499) {
            duration = (Math.round(message.stats.duration/100)/10) + ' ' + scout.localize("SECONDS");
        }

        var processedTime = scout.localize("PROCESSED_IN_DURATION") ;
        processedTime = processedTime.replace("{{duration}}", duration);
        var formattedMessage =
        '<div class="alert alert-success ' + projectID + '" role="alert" title="' + processedTime + '">' +
          '<strong>' + time + '</strong> ' +
          folderAndFile +
          '<span class="pull-right glyphicon glyphicon-remove"></span>' +
        '</div>';

        $("#printConsole").prepend(formattedMessage);

        $("#printConsole .alert .glyphicon-remove").click( function () {
            $(this).parent().fadeOut(400, "linear", function () {
                $(this).remove();
            });
        });

        $("#sidebar .active").click();
    }

    scout.helpers.alert = alert;
    scout.helpers.message = message;

})();
