/*!ZZ
 * Column chart for Most Used Modules.
 * History
 * 2015-Aug-10
 * List of Parameters passed to generateTable function
 */

google.load('visualization', '1.0', {packages: ['corechart','table']});

function mostUsedModules(sysHost, startDate, endDate, numRec) {

    console.log('query = ' + query);   /* query = 1 for first call */

    var jsonChartData = $.ajax
        ({url: "include/mostUsedModules.php",
         data: "sysHost=" + sysHost + "&startDate=" + startDate + "&endDate=" + endDate + 
         "&query=" + query + "&numRec=" + numRec,
         dataType:"json", async: false
         }).responseText;

    // Hide all tables which are not required.
    var idsToHide = ['mod1_div', 'mod2_div','lblModVer0', 'mod3_div', 'lblModVer1', 'lblUserList0', 
        'mod4_div','lblUserList1','lblExecList0','exec_div', 'lblExecList1', 'lblExecDetailRow', 
        'lblExecDetailList','exec_detail_div','lblRunDetail','run_detail_div', 'lblRunDetail1',
        'lblObj', 'obj_div', 'lblRunObj', 'runObj_div', 'lblRunEnv', 'run_env_div',
        'lblFunc', 'func_div'];
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonChartData);             /* if no data is returned do Nothing!! */
    if (count != 0) {

        // Create our data table out of JSON data loaded from server.
        var ChartData = new google.visualization.DataTable(jsonChartData);

        // Define Chart Options .
        var options = {title: 'Modules Usage',
            chartArea:{width: '80%', left: 'auto'},
            legend: {position: 'top'},
            hAxis:{title: 'Modules'},
            vAxis:{title: '#Instance / #Users (log scale)', scaleType: 'log', format:'short'}
        };

        // Instantiate and draw chart.
        var chart = new google.visualization.ColumnChart(document.getElementById('mod1_div'));
        chart.draw(ChartData, options);

        // Create our datatable out of Json Data loaded from php call.
        var div_id = 'mod2_div';
        var table = drawTable(ChartData, div_id, count);
        document.getElementById("lblMod").style.visibility = 'visible';

        function selectChart() {
            // grab a few details before redirecting
            var selection = chart.getSelection();
            var row = selection[0].row;
            var col = selection[0].column;
            var module = [ChartData.getValue(row,0)];

            if (query == 1) { query = 2 }
            console.log('query = ' + query);
            gT0(sysHost, startDate, endDate, module);

        }

        function selectTable() {
            // grab a few details before redirecting
            var selection = table.getSelection();
            var row = selection[0].row;
            var col = selection[0].column;
            var module = [ChartData.getValue(row,0)];

            if (query == 1) { query = 2 }
            console.log('query = ' + query);
            gT0(sysHost, startDate, endDate, module);
        }

        // Add listener (Get Version Details).
        google.visualization.events.addListener(chart, 'select', selectChart);
        google.visualization.events.addListener(table, 'select', selectTable);

    }
}                                                           /* mostUsedModules ends */

function gT0(syshost, startDate, endDate, module) {         /* List version of given modules   */

    console.log("module= " + module);

    /* query = 2 Call from xalt_usage.html page */
    var jsonTableData = $.ajax
        ({url: "include/mostUsedModules.php",
         data: "sysHost=" + sysHost + "&startDate=" + startDate + "&endDate=" + endDate + 
         "&query=" + query + "&module=" + module,
         dataType:"json", async: false
         }).responseText;

    var div_id = 'mod3_div';

    // List ids to hide
    var idsToHide = ['lblModVer0', 'lblModVer1', 'mod3_div',
        'lblUserList0', 'mod4_div','lblUserList1', 'lblExecList0','exec_div', 
        'lblExecList1', 'lblExecDetailRow', 'lblExecDetailList','exec_detail_div',
        'lblRunDetail','run_detail_div', 'lblRunDetail1', 'lblObj', 'obj_div', 
        'lblRunObj', 'runObj_div', 'lblRunEnv', 'run_env_div', 'lblFunc', 'func_div'];
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);             /* if no data is returned do Nothing!! */

    if (count != 0) {

        document.getElementById("lblModVer0").style.visibility = 'visible';
        document.getElementById("lblModVer1").style.visibility = 'visible';
        document.getElementById("mod3_div").style.visibility = 'visible';

        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = drawTable(TableData, div_id, count);

        function selectHandler() {
            // grab a few details before redirecting
            var selection = table.getSelection();
            var row = selection[0].row;
            var col = selection[0].column;
            var module = TableData.getValue(row,0);
            var version = TableData.getValue(row,1);

            gT1(sysHost, startDate, endDate, module, version);   /* get list of Users */ 
        }

        // Add our Actions handler.
        google.visualization.events.addListener(table, 'select', selectHandler);

    }
}   

function gT1(sysHost, startDate, endDate, module, version) {      /* get list of Users  */

    console.log("&module=" + module + "&version=" + version);

    var jsonTableData = $.ajax
        ({url:"include/userList.php", 
         data: "sysHost=" + sysHost + "&startDate=" + startDate + "&endDate=" + endDate + 
         "&module=" + module + "&version=" + version,
         datatype: "json", async: false
         }).responseText;

    var div_id = 'mod4_div';

    // List ids to hide
    var idsToHide = ['lblUserList0', 'lblUserList1','mod4_div', 'lblExecList0','exec_div', 
        'lblExecList1', 'lblExecDetailRow', 'lblExecDetailList','exec_detail_div',
        'lblRunDetail','run_detail_div', 'lblRunDetail1', 'lblObj', 'obj_div', 
        'lblRunObj', 'runObj_div', 
        'lblRunEnv', 'run_env_div', 'lblFunc', 'func_div'];
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);             /* if no data is returned do Nothing!! */
    if (count != 0) {

        document.getElementById("lblUserList0").style.visibility = 'visible';
        document.getElementById("lblUserList1").style.visibility = 'visible';
        document.getElementById("mod4_div").style.visibility = 'visible';

        console.log("&module=" + module + "&version=" + version);
        
        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = drawTable(TableData, div_id, count);

        function selectHandler() {
            // grab a few details before redirecting
            var selection = table.getSelection();
            var row = selection[0].row;
            var col = selection[0].column;
            var user = TableData.getValue(row,0);

            gT2(sysHost, startDate, endDate, module, version, user);    /* get list of executables */ 
        }

        // Add our Actions handler.
        google.visualization.events.addListener(table, 'select', selectHandler);

    }
}   

function gT2(sysHost, startDate, endDate, module, version, user) {       /* get list of executables */

    console.log("&module=" + module + "&version=" + version + "&user=" + user);

    var jsonTableData = $.ajax
        ({url:"include/execList.php", 
         data: "sysHost=" + sysHost + "&startDate=" + startDate + "&endDate=" + endDate + 
         "&module=" + module + "&version=" + version + "&user=" + user,
         datatype: "json", async: false
         }).responseText;

    var div_id = 'exec_div';

    // List ids to hide
    var idsToHide = ['lblExecList0', 'lblExecList1', 'exec_div',
        'lblExecDetailRow','lblExecDetailList','exec_detail_div',
        'lblRunDetail','run_detail_div','lblRunDetail1', 'lblObj', 'obj_div', 
        'lblRunObj', 'runObj_div', 'lblRunEnv', 'run_env_div', 'lblFunc', 'func_div'];
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);             /* if no data is returned do Nothing!! */
    if (count != 0) {

        document.getElementById("lblExecList0").style.visibility = 'visible';
        document.getElementById("lblExecList1").style.visibility = 'visible';
        document.getElementById("exec_div").style.visibility = 'visible';

        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = drawTable(TableData, div_id, count);

        function selectHandler() {
            // grab a few details before redirecting
            var selection = table.getSelection();
            var row  = selection[0].row;
            var col  = selection[0].column;
            var exec = TableData.getValue(row,0);
            var totalNumRec = TableData.getValue(row,3);
            var page = 0;                         /* pagination changes */

            gT3(sysHost, startDate, endDate, module, version, user, exec, page, totalNumRec);    /* get executable details */
        }

        // Add our Actions handler.
        google.visualization.events.addListener(table, 'select', selectHandler);

    }
}

function gT3(sysHost, startDate, endDate, module, version, user, exec, page, totalNumRec) {      /* get executable details */

    console.log("&user= " + user + "&exec=" + exec + "&page=" + page + "&totalNumRec= " + totalNumRec);

    var start = new Date().getTime();

    var jsonTableData = $.ajax
        ({url:"include/execDetailList.php", 
         data: "sysHost=" + sysHost + "&startDate=" + startDate + "&endDate=" + endDate + 
             "&module=" + module + "&version=" + version + "&user=" + user + "&exec=" + exec + 
             "&page=" + page + "&totalNumRec=" + totalNumRec,
         success: function(){
         var end = new Date().getTime();
         console.log("seconds TAKEN: ", (end - start)/1000);},
         datatype: "json", async: false
         }).responseText;

    var div_id = 'exec_detail_div';

    // List ids to hide
    var idsToHide = ['lblExecDetailRow', 'lblExecDetailList', 'exec_detail_div', 
        'lblRunDetail','run_detail_div', 'lblRunDetail1', 'lblObj', 'obj_div', 
        'lblRunObj', 'runObj_div', 'lblRunEnv', 'run_env_div', 'lblFunc', 'func_div'];
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);        /* if no data is returned do Nothing!! */
    if (count != 0) {
        document.getElementById("lblExecDetailRow").style.visibility = 'visible';
        document.getElementById("lblExecDetailList").style.visibility = 'visible';
        document.getElementById("exec_detail_div").style.visibility = 'visible';

        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = drawExecDetail(TableData, div_id ,page);

        function myPageEventHandler(e) {
            page = e['page'];
            /* get executable details */
            gT3(sysHost, startDate, endDate, module, version, user, exec, page, totalNumRec);    
        }

        function selectHandler() {
            // grab a few details before redirecting
            var selection = table.getSelection();
            var row = selection[0].row;
            var col = selection[0].column;
            var uuid = TableData.getValue(row,6);

            // Get run details irrespective of who built the code
            gT4(uuid);            /* get job run details */
            gT5(uuid);            /* get objects at linktime */ 
            gT8(uuid);            /* get functions */ 
        }

        // Add our Actions handler.
        google.visualization.events.addListener(table, 'select', selectHandler);

        // google.visualization.table exposes a 'page' event.
        google.visualization.events.addListener(table, 'page', myPageEventHandler);

    }
}

function gT4(uuid) {               /* get job run details */

    console.log("&uuid=" + uuid);

    var jsonTableData = $.ajax
        ({url:"include/runDetail.php",
         data: "uuid=" + uuid,
         datatype: "json", async: false
         }).responseText;

    var div_id = 'run_detail_div';

    // List ids to hide
    var idsToHide = ['lblRunDetail','run_detail_div','lblRunDetail1', 
        'lblRunObj', 'runObj_div','lblRunEnv', 'run_env_div'];
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);             /* if no data is returned do Nothing!! */
    if (count != 0) {
        document.getElementById("lblRunDetail").style.visibility = 'visible';
        document.getElementById("run_detail_div").style.visibility = 'visible';
        document.getElementById("lblRunDetail1").style.visibility = 'visible';

        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = drawTable(TableData, div_id, count);

        function selectHandler() {
            // grab a few details before redirecting
            var selection = table.getSelection();
            var row = selection[0].row;
            var col = selection[0].column;
            var runId = TableData.getValue(row,0);

            gT6(runId);            /* get runtime env info */ 
            gT7(runId);            /* get objects at runtime info */ 
        }

        // Add our Actions handler.
        google.visualization.events.addListener(table, 'select', selectHandler);

    }
}

function gT5(uuid) {               /* get object information*/

    console.log("&uuid=" + uuid);
    var jsonTableData = $.ajax
        ({url:"include/getExecObj.php", 
         data: "uuid=" + uuid,
         datatype: "json", async: false
         }).responseText;

    var div_id = 'obj_div';

    // List ids to hide
    var idsToHide = ['lblObj', 'obj_div'];
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);         /* if no data is returned do Nothing!! */
    if (count != 0) {
        document.getElementById("lblObj").style.visibility = 'visible';
        document.getElementById("obj_div").style.visibility = 'visible';

        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = drawTable(TableData, div_id, count);

    }
}

function gT6(runId) {               /* get runtime env information*/

    console.log("&runId=" + runId);
    var jsonTableData = $.ajax
        ({url:"include/getRunEnv.php", 
         data: "runId=" + runId,
         datatype: "json", async: false
         }).responseText;

    var div_id = 'run_env_div';

    // List ids to hide
    var idsToHide = ['lblRunEnv', 'run_env_div'];
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);         /* if no data is returned do Nothing!! */
    if (count != 0) {
        document.getElementById("lblRunEnv").style.visibility = 'visible';
        document.getElementById("run_env_div").style.visibility = 'visible';

        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = drawTable(TableData, div_id, count);
    }
}

function gT7(runId) {               /* get objects at runtime */

    console.log("&runId=" + runId);
    var jsonTableData = $.ajax
        ({url:"include/getRunObj.php", 
         data: "runId=" + runId,
         datatype: "json", async: false
         }).responseText;

    var div_id = 'runObj_div';

    // List ids to hide
    var idsToHide = ['lblRunObj', 'runObj_div'];
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);         /* if no data is returned do Nothing!! */
    if (count != 0) {
        document.getElementById("lblRunObj").style.visibility = 'visible';
        document.getElementById("runObj_div").style.visibility = 'visible';

        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = drawTable(TableData, div_id, count);
    }
}

function gT8(uuid) {               /* get fuctions called */

    console.log("&uuid=" + uuid);
    var jsonTableData = $.ajax
        ({url:"include/getExecFunc.php",
         data: "uuid=" + uuid,
         datatype: "json", async: false
         }).responseText;

    var div_id = 'func_div';

    // List ids to hide
    var idsToHide = ['lblFunc', 'func_div'];
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);         /* if no data is returned do Nothing!! */
    if (count != 0) {
        document.getElementById("lblFunc").style.visibility = 'visible';
        document.getElementById("func_div").style.visibility = 'visible';

        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = drawTable(TableData, div_id, count);

    }
}

function drawExecDetail(TableData, div_id, page) {

    var tab_options = {title: 'Table View', showRowNumber: true,
        width: '100%', hieght: '100%', page: 'enable',
        pageSize: '10', startPage: parseInt(page), 
        pagingSymbols: {prev: ['< prev'],next: ['next >']},
        allowHtml: true, alternatingRowStyle: true
    }

    // Instantiate and Draw our Table
    var table = new google.visualization.Table(document.getElementById(div_id));
    table.clearChart();
    table.draw(TableData, tab_options);
    return(table);
}

function drawTable(TableData, div_id, count) {

    var tab_options;
    if (count > 10){
        tab_options = {title: 'Table View',
            showRowNumber: true,
            height: 260,
            width: '100%',
            allowHtml: true,
            alternatingRowStyle: true
        }
    } else {
        tab_options = {title: 'Table View',
            showRowNumber: true,
            height: '100%',
            width: '100%',
            allowHtml: true,
            alternatingRowStyle: true,
            page: 'enable', pageSize: '10'
        }

    }
    // Instantiate and Draw our Table
    var table = new google.visualization.Table(document.getElementById(div_id));

    table.clearChart();
    table.draw(TableData, tab_options);
    return(table);
}

function checkJsonData (jsonTableData) {
    var o = JSON.parse(jsonTableData);
    return (o.rows.length);
}

function hideAllDivs (idsToHide) {

    var attrToHide = document.querySelectorAll("*[style]");
    for(var i=0; i< attrToHide.length; i++) {
        if ($.inArray(attrToHide[i].id, idsToHide) != -1){     // if ID is present in the list Hide it
            attrToHide[i].style.visibility = "hidden";
        }
    }
}

