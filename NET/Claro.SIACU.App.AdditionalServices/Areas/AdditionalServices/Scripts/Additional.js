//(function ($, undefined) {

//    'use strict';

//    var Form = function ($element, options) {
//        $.extend(this, $.fn.Additional.defaults, $element.data(), typeof options === 'object' && options);

//        this.setControls({
//            form: $element,
//            btnAdd: $('#btnAdd', $element),
//            btnRemove: $('#btnRemove', $element),
//            tblProductTable: $('#tblCustomerAssociateEquiment', $element),
//            tblProductsSummary: $('#tblCustomerEquipmentSummary', $element),
//            chPrograma: $('#chPrograma', $element),
//            dvPrograma: $('#dvPrograma', $element),

//            spCostoFijoRegular: $('#spCostoFijoRegular', $element),
//            spCostoFijoPromocional: $('#spCostoFijoPromocional', $element),
//            spServiciosAgregados: $('#spServiciosAgregados', $element),
//            spServiciosDesactivados: $('#spServiciosDesactivados', $element)
//        });
//    }

//    Form.prototype = {
//        constructor: Form,

//        init: function () {
//            var that = this,
//                controls = that.getControls();

//            controls.btnAdd.addEvent(that, 'click', that.btnAdd_click);
//            controls.btnRemove.addEvent(that, 'click', that.btnRemove_click);
//            controls.chPrograma.addEvent(that, 'click', that.chPrograma_click);

//            controls.dvPrograma.hide();
//            that.render();
//        },

//        render: function () {
//            var that = this,
//                controls = this.getControls();

//            that.loadAdditionalServicesData();
//        },

//        getControls: function () {
//            return this.m_controls || {};
//        },

//        setControls: function (value) {
//            this.m_controls = value;
//        },

//        loadAdditionalServicesData: function () {
//            var that = this,
//                controls = that.getControls();
   
//            return $.app.ajax({
//                type: "POST",
//                contentType: "application/json; charset=utf-8",
//                dataType: 'json',
//                url: '/AdditionalServices/Home/Load',
//                data: null,
//                success: function (response) {
//                    if (response.data != null) {
//                        that.fillProductsTable_DataTable(controls.tblProductTable, response.data.lstServicioAdicional);
//                        that.initCustomerProductsSummary_DataTable(response.data.lstServicioPlan);
//                    }
//                },
//                error: function (errormessage) {
//                }
//            });
//        },

//        fillProductsTable_DataTable: function (customerProductsTable, data) {
//            var that = this,
//                controls = that.getControls();

//            that.fillListEquipmentsToDisassociate(data);

//            customerProductsTable.DataTable({
//                "columnDefs": [
//                  {
//                      'targets': 0,
//                      'checkboxes': {
//                          'selectRow': true
//                      }
//                  },
//                  {
//                      "render": function (data, type, row) {
//                          return '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data + '</span>';
//                      },
//                      "targets": 2
//                  },
//                  {
//                      "render": function (data, type, row) {
//                          //return 'S/' + data;
//                          return '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S/' + data + '</span>';
//                      },
//                      "targets": 3
//                  },
//                  {
//                      "targets": [0,1,4],
//                      "visible": false,
//                      "searchable": false
//                  },
//                  {
//                      "targets": "_all",
//                      "sortable": false,
//                      "searchable": false,
//                      "orderable": false
//                  }
//                ],
//                "select": {
//                    "style": "multi"
//                },
//                "order": [[1, 'asc']],
//                "columns": [
//                    { "data": "strCodigoServicio" },
//                    { "data": "strTipoServicio" },
//                    { "data": "strNombreServicio" },
//                    { "data": "dblMontoServicio" },
//                    { "data": "dblPromocion" }
//                ],
//                "data": data,
//                "createdRow": function (row, data, dataIndex) {
//                    if (data.intServicioActivado == 1) {
//                        $(row).addClass("info-naranja");
//                    }
//                },
//                "drawCallback": function (settings) {
//                    var api = this.api();
//                    var rows = api.rows({ page: 'current' }).nodes();
//                    var last = null;
//                    var groupadmin = [];
//                    api.column(1, { page: 'current' }).data().each(function (group, i) {
//                        if (last !== group && groupadmin.indexOf(i) == -1) {
//                            var imagen;
//                            switch (group) {
//                                case 'Cable':
//                                    imagen = 'ico_cable.svg';
//                                    break;
//                                case 'Internet':
//                                    imagen = 'ico_internet.svg';
//                                    break;
//                                default:
//                                    imagen = 'ico_phone.svg';
//                            }
//                            $(rows).eq(i).before(
//                                '<tr><td colspan="4" class="info-gestion"><img src="/Content/Images/SUFija/' + imagen + '">' + group + '</td></tr>'
//                            );
//                            groupadmin.push(i);
//                            last = group;
//                        }
//                    });
//                },
//                "info": false,
//                "scrollX": true,
//                "scrollY": false,
//                "scrollCollapse": false,
//                "paging": false,
//                "searching": false,
//                "destroy": true
//            });
//            var table = controls.tblProductTable.DataTable();

//            $('#tblCustomerAssociateEquiment').on('click', 'tbody td, thead th:first-child', function (e) {
//                var $row = $(this).closest('tr');
//                var data = table.row($row).data();

//                if (data != undefined || data != null) {
//                    var searchequipment = that.lstEquipmentsToAssociate.indexOf(data);
                    
//                    if (searchequipment > 0) {
//                        that.lstEquipmentsToAssociate.splice(searchequipment, 1);
//                    } else{
//                        that.lstEquipmentsToAssociate.push(data);
//                    }

//                    if (that.lstEquipmentsToAssociate.length > 0) {
//                        controls.btnAdd.prop('disabled', false);
//                        controls.btnRemove.prop('disabled', true);
//                    } else {
//                        controls.btnRemove.prop('disabled', false);
//                    }
//                }
//            });
//        },

//        initCustomerProductsSummary_DataTable: function (data) {
//            var that = this, controls = that.getControls();

//            that.fillListEquipmentsToAssociate(data);
//            that.getCountFixed(that.lstEquipmentsToAssociate);

//            controls.tblProductsSummary.DataTable({
//                "columnDefs": [
//                   {
//                       'targets': 0,
//                       'checkboxes': {
//                           'selectRow': true
//                       }
//                   },
//                  {
//                       "render": function (data, type, row) {
//                           return '<span>&nbsp;&nbsp;&nbsp;&nbsp;' + data + '</span>';
//                       },
//                       "targets": 2
//                   },
//                   {
//                       "render": function (data, type, row) {
//                           return '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S/' + data + '</span>';
//                       },
//                       "targets": 3
//                   },
//                   {
//                       "render": function (data, type, row) {
//                           return '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S/' + data + '</span>';
//                       },
//                       "targets": 4
//                   },
//                  {
//                      "targets": [0,1],
//                      "visible": false,
//                      "searchable": false
//                  },
//                  {
//                      "targets": "_all",
//                      "sortable": false,
//                      "searchable": false,
//                      "orderable": false
//                  }
//                ],
//                "select": {
//                    "style": "multi"
//                },
//                "order": [[1, 'asc']],
//                "columns": [
//                    { "data": "strCodigoServicio" },
//                    { "data": "strTipoServicio" },
//                    { "data": "strNombreServicio" },
//                    { "data": "dblPromocion" },
//                    { "data": "dblMontoServicio" }
//                ],
//                "data": data,
//                "createdRow": function(row, data, dataIndex) {
//                    if (data.intServicioActivado == 0) {
//                        $(row).addClass("info-celeste");
//                    }
//                },
//                "drawCallback": function (settings) {
//                    var api = this.api();
//                    var rows = api.rows({ page: 'current' }).nodes();
//                    var last = null;
//                    var groupadmin = [];
//                    api.column(1, { page: 'current' }).data().each(function (group, i) {
//                        if (last !== group && groupadmin.indexOf(i) == -1) {
//                            var imagen;
//                            switch (group) {
//                                case 'Cable':
//                                    imagen = 'ico_cable.svg';
//                                    break;
//                                case 'Internet':
//                                    imagen = 'ico_internet.svg';
//                                    break;
//                                default:
//                                    imagen = 'ico_phone.svg';
//                            }
//                            $(rows).eq(i).before(
//                                '<tr id="' + i + '"><td colspan="4" class="info-agrupa"><img src="/Content/Images/SUFija/' + imagen + '">' + group + '</td></tr>'
//                            );
//                            groupadmin.push(i);
//                            last = group;
//                        }
//                    });
//                },
//                "info": false,
//                "scrollX": true,
//                "scrollY": false,
//                "scrollCollapse": true,
//                "paging": false,
//                "searching": false,
//                "destroy": true
//            });
//            var table = controls.tblProductsSummary.DataTable();

//            $('#tblCustomerEquipmentSummary').on('click', 'tbody td, thead th:first-child', function (e) {
//                var $row = $(this).closest('tr');
//                var data = table.row($row).data();

//                if (data != undefined || data != null) {
//                    var searchequipment = that.lstEquipmentsToAssociate2.indexOf(data);

//                    if (searchequipment >= 0) {
//                        that.lstEquipmentsToAssociate2.splice(searchequipment, 1);
//                    } else {
//                        that.lstEquipmentsToAssociate2.push(data);
//                    }

//                    if (that.lstEquipmentsToAssociate2.length > 0) {
//                        controls.btnAdd.prop('disabled', true);
//                        controls.btnRemove.prop('disabled', false);
//                    } else {
//                        controls.btnAdd.prop('disabled', false);
//                    }
//                }
//            });
//        },

//        btnAdd_click: function () {
//            var that = this, controls = that.getControls();

//            if (that.lstEquipmentsToDisassociate.length > 0 || that.lstEquipmentsToAssociate.length > 0) {
//                for (var j = 0; j < that.lstEquipmentsToAssociate.length; j++) {
//                    var searchequipment = that.lstEquipmentsToDisassociate.indexOf(that.lstEquipmentsToAssociate[j]);
                    
//                    if (searchequipment >= 0) {
//                        that.lstEquipmentsToDisassociate.splice(searchequipment, 1);
//                    }
//                }                
//                }
//            //Actualizar ambas listas
//            if (that.lstEquipmentsToDisassociate.length == 0) {
//                var table = controls.tblProductTable.DataTable();
//                table.rows().remove().draw();
//            } else {
//                that.getDisassociateItem(that.lstEquipmentsToDisassociate);
//            }
//            that.getAssociateItem(that.lstEquipmentsToAssociate);

//            //Actualizar conteo y cargos fijos
//            that.getCountFixed(that.lstEquipmentsToAssociate);
//        },

//        getCountFixed: function (dataAgregados) {
//            var that = this, controls = that.getControls();
//            //Conteo de servicios agregados y desactivados
//            var conteoDesactivos = 0;
//            var conteoAgregados = 0;
//            for (var i = 0; i < dataAgregados.length; i++) {
//                if (dataAgregados[i].intServicioActivado == 0) {
//                    conteoAgregados += 1;
//                }
//            }
//            controls.spServiciosAgregados.empty().text(conteoAgregados);

//            for (var i = 0; i < that.lstEquipmentsToDisassociate.length; i++) {
//                if (that.lstEquipmentsToDisassociate[i].intServicioActivado == 1) {
//                    conteoDesactivos += 1;
//                }
//            }
//            controls.spServiciosDesactivados.empty().text(conteoDesactivos);

//            var cargoFijo = 0;
//            var cargoPromocion = 0;
//            for (var i = 0; i < dataAgregados.length; i++) {
//                cargoFijo += dataAgregados[i].dblMontoServicio;
//                cargoPromocion += dataAgregados[i].dblPromocion;
//            }
//            var restaCargos = cargoFijo - cargoPromocion;
//            cargoFijo = that.getRound(cargoFijo);
//            cargoPromocion = that.getRound(restaCargos);

//            //Cargos fijos regular y promocional
//            controls.spCostoFijoRegular.empty().text('S/ ' + cargoFijo);
//            controls.spCostoFijoPromocional.empty().text('S/ ' + cargoPromocion);
//        },

//        getRound: function (num) {
//            var decimales = 2;
//            var signo = (num >= 0 ? 1 : -1);
//            num = num * signo;
//            if (decimales === 0) //con 0 decimales
//                return signo * Math.round(num);
//            // round(x * 10 ^ decimales)
//            num = num.toString().split('e');
//            num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimales) : decimales)));
//            // x * 10 ^ (-decimales)
//            num = num.toString().split('e');
//            return signo * (num[0] + 'e' + (num[1] ? (+num[1] - decimales) : -decimales));
//        },

//        getDisassociateItem: function (data) {
//            var that = this, controls = that.getControls();
//            var table = controls.tblProductTable.DataTable();
//            table.clear();
//            if (data == undefined) { return };
//            for (var i = 0; i < data.length; i++) {
//                table.row.add(data[i]).draw();
//            }
//        },

//        getAssociateItem: function (data) {
//            var that = this, controls = that.getControls();
//            if (data == undefined) { return };
//            var table = controls.tblProductsSummary.DataTable();
//            table.clear();
//            for (var i = 0; i < data.length; i++) {
//                table.row.add(data[i]).draw();
//            }
//        },

//        fillListEquipmentsToDisassociate: function (data) {
//            var that = this,
//            controls = that.getControls();

//            if (data == undefined) { return };
//            for (var j = 0; j < data.length; j++) {
//                that.lstEquipmentsToDisassociate.push(data[j]);
//            }
//        },

//        fillListEquipmentsToAssociate: function (data) {
//            var that = this,
//            controls = that.getControls();
//            if (data == undefined) { return };
//            for (var j = 0; j < data.length; j++) {
//                that.lstEquipmentsToAssociate.push(data[j]);
//            }
//        },

//        btnRemove_click: function () {
//            var that = this, controls = that.getControls(); 

//            if (that.lstEquipmentsToDisassociate.length > 0 || that.lstEquipmentsToAssociate2.length > 0) {

//                for (var j = 0; j < that.lstEquipmentsToAssociate2.length; j++) {
//                    var searchequipment = that.lstEquipmentsToDisassociate.indexOf(that.lstEquipmentsToAssociate2[j]);

//                    if (searchequipment < 0) {
//                        that.lstEquipmentsToDisassociate.push(that.lstEquipmentsToAssociate2[j]);
//                    }
//                }
                
//                for (var j = 0; j < that.lstEquipmentsToAssociate2.length; j++) {
//                    var searchequipment = that.lstEquipmentsToAssociate.indexOf(that.lstEquipmentsToAssociate2[j]);

//                    if (searchequipment >= 0) {
//                        that.lstEquipmentsToAssociate.splice(searchequipment, 1);
//                    }
//                }
//            }

//            if (that.lstEquipmentsToAssociate.length == 0) {
//                var table = controls.tblProductsSummary.DataTable();
//                table.rows().remove().draw();
//            } else {
//                that.getAssociateItem(that.lstEquipmentsToAssociate);
//            }
//            that.getDisassociateItem(that.lstEquipmentsToDisassociate);

//            that.getCountFixed(that.lstEquipmentsToAssociate);
//        },

//        chPrograma_click: function () {
//            var that = this,
//            controls = that.getControls();

//            if (controls.chPrograma.prop('checked')) {
//                controls.dvPrograma.show();
//            } else {
//                controls.dvPrograma.hide();
//            }
//        },

//        lstEquipmentsToAssociate: [],
//        lstEquipmentsToDisassociate: [],
//        lstEquipmentsToAssociate2: []
//    }
 
//   $.fn.Additional = function () {
//       var option = arguments[0],
//           args = arguments,
//           value,
//           allowedMethods = [];

//       this.each(function () {
//           var $this = $(this),
//               data = $this.data('Additional'),
//               options = $.extend({}, $.fn.Additional.defaults,
//                   $this.data(), typeof option === 'object' && option);

//           if (!data) {
//               data = new Form($this, options);
//               $this.data('Additional', data);
//           }

//           if (typeof option === 'string') {
//               if ($.inArray(option, allowedMethods) < 0) {
//                   throw "Unknown method: " + option;
//               }
//               value = data[option](args[1]);
//           } else {
//               data.init();
//               if (args[1]) {
//                   value = data[args[1]].apply(data, [].slice.call(args, 2));
//               }
//           }
//       });

//       return value || this;
//   };

//    $.fn.Additional.defaults = {
//    }

//    $('#divIndex').Additional();

//})(jQuery, null);
