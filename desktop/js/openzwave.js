
/* This file is part of Jeedom.
 *
 * Jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
 */

 $(".li_eqLogic").on('click', function () {
    printModuleInfo($(this).attr('data-eqLogic_id'));
    return false;
});

 $('#bt_syncEqLogic,#bt_syncEqLogic2').on('click', function () {
    syncEqLogicWithRazberry();
});
 $('.changeIncludeState').on('click', function () {
    var nbZwayServer = 0;
    var serverId = 1;
    for(var i in listServerZway){
        if(listServerZway[i].name != null){
            serverId = i
            nbZwayServer++
        }
    }
    if(nbZwayServer < 2){
        changeIncludeState($(this).attr('data-mode'), $(this).attr('data-state'),serverId);
    }else{
        var options = '';
        var mode = $(this).attr('data-mode');
        var state =  $(this).attr('data-state');
        for(var i in listServerZway){
            if(listServerZway[i].name != null){
                options += '<option value="'+i+'">'+listServerZway[i].name+'</option>';
            }
        }
        bootbox.dialog({
            title: "Choix du server z-wave",
            message: '<div class="row">  ' +
            '<div class="col-md-12"> ' +
            '<form class="form-horizontal" onsubmit="return false;"> ' +
            '<div class="form-group"> ' +
            '<label class="col-md-4 control-label">{{Serveur}}</label> ' +
            '<div class="col-md-4"> ' +
            '<select id="sel_serverZway" class="form-control input-md"> ' +
            options +
            '</select> ' +
            '</div> ' +
            '</div> ' +
            '</form> </div>  </div>',
            buttons: {
              "Annuler": {
                className: "btn-default",
                callback: function () {
                }
            },
            success: {
                label: "D'accord",
                className: "btn-primary",
                callback: function () {
                  changeIncludeState(mode, state,$('#sel_serverZway').value());
              }
          },
      }
  });
}
});

$('#bt_displayZwaveData').on('click', function () {
    $('#md_modal').dialog({title: "{{Arbre Z-Wave de l'équipement}}"});
    $('#md_modal').load('index.php?v=d&plugin=openzwave&modal=zwave.data&id=' + $('.eqLogicAttr[data-l1key=id]').value()).dialog('open');
});

$('#bt_zwaveNetwork').on('click', function () {
    $('#md_modal').dialog({title: "{{Réseaux zwave}}"});
    $('#md_modal').load('index.php?v=d&plugin=openzwave&modal=network').dialog('open');
});

$('#bt_configureDevice').on('click', function () {
    $('#md_modal').dialog({title: "{{Configuration du module}}"});
    $('#md_modal').load('index.php?v=d&plugin=openzwave&modal=node.configure&id='+ $('.eqLogicAttr[data-l1key=logicalId]').value()+'&serverId='+ $('.eqLogicAttr[data-l1key=configuration][data-l2key=serverID]').value()).dialog('open');
});

$('#bt_zwaveConfig').on('click', function () {
    $('#md_modal').dialog({title: "{{Configuration zwave}}"});
    $('#md_modal').load('index.php?v=d&plugin=openzwave&modal=config').dialog('open');
});

$('#bt_zwaveConsole').on('click', function () {
    $('#md_modal').dialog({title: "{{Console zwave}}"});
    $('#md_modal').load('index.php?v=d&plugin=openzwave&modal=console').dialog('open');
});

$("#table_cmd").sortable({axis: "y", cursor: "move", items: ".cmd", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});

function printEqLogic(_eqLogic){
 if($('.li_eqLogic.active').attr('data-eqlogic_id') != ''){
    $('#img_device').attr("src", $('.eqLogicDisplayCard[data-eqLogic_id='+$('.li_eqLogic.active').attr('data-eqlogic_id')+'] img').attr('src'));
}else{
    $('#img_device').attr("src",'plugins/openzwave/doc/images/openzwave_icon.png');
}
}


/**********************Node js requests *****************************/
$('body').one('nodeJsConnect', function () {
    socket.on('zwave::controller.data.controllerState', function (_options) {
        _options = json_decode(_options);
        $.hideAlert();
        if (_options.state == 1) {
            $('.changeIncludeState[data-mode=1]:not(.card)').removeClass('btn-default').addClass('btn-success');
            $('.changeIncludeState.card[data-mode=1]').css('background-color','#8000FF');
            $('.changeIncludeState.card[data-mode=1] span center').text('{{Arrêter l\'inclusion}}');
            $('.changeIncludeState[data-mode=1]').attr('data-state', 0);
            $('.changeIncludeState[data-mode=1]:not(.card)').html('<i class="fa fa-sign-in fa-rotate-90"></i> {{Arrêter l\'inclusion}}');
            $('#div_inclusionAlert'+_options.serverId).showAlert({message: '{{Vous êtes en mode inclusion}} '+_options.name+'. {{Cliquez à nouveau sur le bouton d\'inclusion pour sortir de ce mode}}', level: 'warning'});
        }else if (_options.state == 5) {
            $('.changeIncludeState[data-mode=0]:not(.card)').removeClass('btn-default').addClass('btn-danger');
            $('.changeIncludeState.card[data-mode=0]').css('background-color','#8000FF');
            $('.changeIncludeState.card[data-mode=0] span center').text('{{Arrêter l\'exclusion}}');
            $('.changeIncludeState[data-mode=0]').attr('data-state', 0);
            $('.changeIncludeState[data-mode=0]:not(.card)').html('<i class="fa fa-sign-out fa-rotate-90"></i> {{Arrêter l\'exclusion}}');
            $('#div_inclusionAlert'+_options.serverId).showAlert({message: '{{Vous êtes en mode exclusion sur}} '+_options.name+'. {{Cliquez à nouveau sur le bouton d\'exclusion pour sortir de ce mode}}', level: 'warning'});
        }else{
           $('.changeIncludeState.card[data-mode=0]').css('background-color','#ffffff');
           $('.changeIncludeState.card[data-mode=1]').css('background-color','#ffffff');
           $('.changeIncludeState[data-mode=0]:not(.card)').html('<i class="fa fa-sign-in fa-rotate-90"></i> {{Mode exclusion}}');
           $('.changeIncludeState[data-mode=1]:not(.card)').html('<i class="fa fa-sign-in fa-rotate-90"></i> {{Mode inclusion}}');
           $('.changeIncludeState.card[data-mode=1] span center').text('{{Mode inclusion}}');
           $('.changeIncludeState.card[data-mode=0] span center').text('{{Mode exclusion}}');
           $('.changeIncludeState[data-mode=1]').attr('data-state', 1);
           $('.changeIncludeState[data-mode=0]').attr('data-state', 1);
           $('.changeIncludeState[data-mode=1]:not(.card)').removeClass('btn-success').addClass('btn-default');
           $('.changeIncludeState[data-mode=0]:not(.card)').removeClass('btn-danger').addClass('btn-default');
       }
   });

setTimeout(function () {
    socket.on('zwave::includeDevice', function (_options) {
        if (modifyWithoutSave) {
            $('#div_inclusionAlert').showAlert({message: '{{Un périphérique vient d\'être inclus/exclu. Veuillez réactualiser la page}}', level: 'warning'});
        } else {
            if (_options == '') {
                window.location.reload();
            } else {
                window.location.href = 'index.php?v=d&p=openzwave&m=openzwave&id=' + _options;
            }
        }
    });
}, 3000);
});


function printModuleInfo(_id) {
    $.ajax({// fonction permettant de faire de l'ajax
        type: "POST", // méthode de transmission des données au fichier php
        url: "plugins/openzwave/core/ajax/openzwave.ajax.php", // url du fichier php
        data: {
            action: "getModuleInfo",
            id: _id,
        },
        dataType: 'json',
        global: false,
        error: function (request, status, error) {
            handleAjaxError(request, status, error);
        },
        success: function (data) { // si l'appel a bien fonctionné
        if (data.state != 'ok') {
            $('#div_alert').showAlert({message: data.result, level: 'danger'});
            return;
        }
        $('.zwaveInfo').value('');
        for (var i in data.result) {
            var value = data.result[i]['value'];
            if (isset(data.result[i]['unite'])) {
                value += ' ' + data.result[i]['unite'];
            }
            $('.zwaveInfo[data-l1key=' + i + ']').value(value);
            $('.zwaveInfo[data-l1key=' + i + ']').attr('title', data.result[i]['datetime']);
        }
    }
});
}

function syncEqLogicWithRazberry() {
    $.ajax({// fonction permettant de faire de l'ajax
        type: "POST", // méthode de transmission des données au fichier php
        url: "plugins/openzwave/core/ajax/openzwave.ajax.php", // url du fichier php
        data: {
            action: "syncEqLogicWithRazberry",
        },
        dataType: 'json',
        error: function (request, status, error) {
            handleAjaxError(request, status, error);
        },
        success: function (data) { // si l'appel a bien fonctionné
        if (data.state != 'ok') {
            $('#div_alert').showAlert({message: data.result, level: 'danger'});
            return;
        }
        window.location.reload();
    }
});
}

function changeIncludeState(_mode, _state,_serverID) {
    $.ajax({// fonction permettant de faire de l'ajax
        type: "POST", // méthode de transmission des données au fichier php
        url: "plugins/openzwave/core/ajax/openzwave.ajax.php", // url du fichier php
        data: {
            action: "changeIncludeState",
            mode: _mode,
            state: _state,
            serverID: _serverID,
        },
        dataType: 'json',
        error: function (request, status, error) {
            handleAjaxError(request, status, error);
        },
        success: function (data) { // si l'appel a bien fonctionné
        if (data.state != 'ok') {
            $('#div_alert').showAlert({message: data.result, level: 'danger'});
            return;
        }
    }
});
}

function addCmdToTable(_cmd) {
    if (!isset(_cmd)) {
        var _cmd = {configuration: {}};
    }
    var tr = '<tr class="cmd" data-cmd_id="' + init(_cmd.id) + '">';
    tr += '<td>';
    tr += '<div class="row">';
    tr += '<div class="col-sm-6">';
    tr += '<a class="cmdAction btn btn-default btn-sm" data-l1key="chooseIcon"><i class="fa fa-flag"></i> Icone</a>';
    tr += '<span class="cmdAttr" data-l1key="display" data-l2key="icon" style="margin-left : 10px;"></span>';
    tr += '</div>';
    tr += '<div class="col-sm-6">';
    tr += '<input class="cmdAttr form-control input-sm" data-l1key="name">';
    tr += '</div>';
    tr += '</div>';
    tr += '<select class="cmdAttr form-control tooltips input-sm" data-l1key="value" style="display : none;margin-top : 5px;" title="{{La valeur de la commande vaut par défaut la commande}}">';
    tr += '<option value="">Aucune</option>';
    tr += '</select>';
    tr += '</td>';
    tr += '<td class="expertModeVisible">';
    tr += '<input class="cmdAttr form-control input-sm" data-l1key="id" style="display : none;">';
    tr += '<span class="type" type="' + init(_cmd.type) + '">' + jeedom.cmd.availableType() + '</span>';
    tr += '<span class="subType" subType="' + init(_cmd.subType) + '"></span>';
    tr += '</td>';
    tr += '<td class="expertModeVisible"><input class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="instanceId" value="0"></td>';
    tr += '<td class="expertModeVisible"><input class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="class" ></td>';
    tr += '<td class="expertModeVisible">';
    tr += '<input class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="value" >';
    tr += '<input class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="returnStateValue" placeholder="{{Valeur retour d\'état}}" style="margin-top : 5px;">';
    tr += '<input class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="returnStateTime" placeholder="{{Durée avant retour d\'état (min)}}" style="margin-top : 5px;">';
    tr += '</td>';
    tr += '<td>';
    tr += '<span><input type="checkbox" class="cmdAttr" data-l1key="isHistorized" /> {{Historiser}}<br/></span>';
    tr += '<span><input type="checkbox" class="cmdAttr" data-l1key="isVisible" checked/> {{Afficher}}<br/></span>';
    tr += '<span class="expertModeVisible"><input type="checkbox" class="cmdAttr" data-l1key="display" data-l2key="invertBinary" /> {{Inverser}}<br/></span>';
    tr += '</td>';
    tr += '<td>';
    tr += '<input class="cmdAttr form-control tooltips input-sm" data-l1key="unite"  style="width : 100px;" placeholder="Unité" title="{{Unité}}">';
    tr += '<input class="tooltips cmdAttr form-control input-sm expertModeVisible" data-l1key="configuration" data-l2key="minValue" placeholder="{{Min}}" title="{{Min}}" style="margin-top : 5px;"> ';
    tr += '<input class="tooltips cmdAttr form-control input-sm expertModeVisible" data-l1key="configuration" data-l2key="maxValue" placeholder="{{Max}}" title="{{Max}}" style="margin-top : 5px;">';
    tr += '</td>';
    tr += '<td>';
    if (is_numeric(_cmd.id)) {
        tr += '<a class="btn btn-default btn-xs cmdAction expertModeVisible" data-action="configure"><i class="fa fa-cogs"></i></a> ';
        tr += '<a class="btn btn-default btn-xs cmdAction" data-action="test"><i class="fa fa-rss"></i> {{Tester}}</a>';
    }
    tr += '<i class="fa fa-minus-circle pull-right cmdAction cursor" data-action="remove"></i></td>';
    tr += '</tr>';
    $('#table_cmd tbody').append(tr);
    var tr = $('#table_cmd tbody tr:last');
    jeedom.eqLogic.builSelectCmd({
        id: $(".li_eqLogic.active").attr('data-eqLogic_id'),
        filter: {type: 'info'},
        error: function (error) {
            $('#div_alert').showAlert({message: error.message, level: 'danger'});
        },
        success: function (result) {
            tr.find('.cmdAttr[data-l1key=value]').append(result);
            tr.setValues(_cmd, '.cmdAttr');
            jeedom.cmd.changeType(tr, init(_cmd.subType));
        }
    });
}
