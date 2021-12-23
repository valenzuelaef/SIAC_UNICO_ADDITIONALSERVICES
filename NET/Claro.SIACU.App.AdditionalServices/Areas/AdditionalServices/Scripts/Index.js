(function ($, undefined) {

     'use strict';
     
     var Form = function ($element, options) {
          
        $.extend(this, $.fn.AdditionalServices.defaults, $element.data(), typeof options === 'object' && options);
  
       

        this.setControls({
            form: $element,

         
            tblProductTable: $('#tblCustomerAssociateEquiment', $element),
            tblProductsSummary: $('#tblCustomerEquipmentSummary', $element),
            stepsContainer: $('.process-row-step', $element),
           
            btnStep: $('.next-step'),
            btnPrevStep: $('.prev-step'),
            divCustomerInformation: $('#divCustomerDataView', $element),
            btnConstancy: $('.Constancy-step'),
            btnSave: $('.Save-step'),
            loadingModal: $("#myModalLoad", $element),
        });
    }

    Form.prototype = {
        constructor: Form,

        init: function () {
            var that = this,
                controls = this.getControls();

          
            that.render();
        },

        render: function () {
            var that = this,
                controls = this.getControls();

            moment.locale('es');
            //that.getLoadingPage();
            that.transactionStart();
        },

        timer: function () {
            var that = this,
                controls = that.getControls();
            that.resizeContent();
            var time = moment().format('DD/MM/YYYY hh:mm:ss a');
            $('#idSession').html(string.format('Session ID: {0} &nbsp&nbsp {1}', Session.UrlParams.IdSession, time));
            var t = setTimeout(function () { that.timer() }, 500);
        },

        getControls: function () {
            return this.m_controls || {};
        },
        setControls: function (value) {
            this.m_controls = value;
        },

        resizeContent: function () {

            var controls = this.getControls();
            $('#navbar-body').css('height', $(window).outerHeight() - $('#main-header').outerHeight() - $('#main-footer').outerHeight());
        },

        updateControl: function (object) {

            for (var prop in object) {
                if (typeof this.m_controls[prop] == 'undefined') {
                    this.m_controls[prop] = object[prop];
                }
            }

        },

        transactionData: {},
        transactionStart: function () {
            var that = this, controls = that.getControls();

            //Session.SessionParams.DATACUSTOMER.ContractID = "13326803";
            //Session.SessionParams.DATACUSTOMER.CustomerID = "36248101";
            var plataformaAT = !$.string.isEmptyOrNull(Session.SessionParams.DATACUSTOMER.objPostDataAccount.plataformaAT) ? Session.SessionParams.DATACUSTOMER.objPostDataAccount.plataformaAT : '';
            var idTransactionFront = $.app.getTypeClientAsIsOrToBe(plataformaAT, '5', '13');
            //var customerPromise = that.customerInformationPromise(controls.divCustomerDataView);
            var customerInformationPromise = $.reusableViews.viewOfTheLeftSide(controls.divCustomerInformation);
            var initialConfigurationPromise = $.app.transactionInitialConfigurationPromise(Session.SessionParams, idTransactionFront)

            Promise.all([customerInformationPromise, initialConfigurationPromise])
                .then(function (res) {

                var initialConfiguration = res[1].oInitialDataResponse.MessageResponse.Body,
                       // AdditionalFixedData = res[1].oDatosAdiPaso01.MessageResponse.Body,
                        AdditionalFixedData = res[1].oDatosAdi.MessageResponse.Body,
                    AuditRequest = res[1].oAuditRequest,
                       // fixPlanesCoreService = res[1].fixPlanesCoreService,
                    Configuraciones = res[1].oConfiguraciones,
                    AdditionalServices = initialConfiguration.AdditionalServices || {},
                    CoreServices = initialConfiguration.CoreServices || {},
                    CustomerInformation = initialConfiguration.CustomerInformation || {},
                    Igv = initialConfiguration.Igv,
                    PuntoAtencion = initialConfiguration.PuntoAtencion || {},
                    DatosUsuarioCtaRed = initialConfiguration.obtenerDatosUsuarioCuentaRed || {},
                    OficinaVentaUsuario = initialConfiguration.obtenerOficinaVentaUsuario || {},
                    Tipificacion = AdditionalFixedData.servicios.tipificacionreglas_obtenerInformacionTipificacion || {},
                    Instalacion = AdditionalFixedData.servicios.datosinstalacioncliente_obtenerDatosInstalacion || {},
                    Configuration = AdditionalFixedData.servicios.configuracionesfija_obtenerConfiguraciones || {},

                    ValidarTransaccion = AdditionalFixedData.servicios.consultatransaccionfija_validarTransaccion || {},

                    AuditRequest = AuditRequest || {};
                that.transactionData.Data = {};
                    that.transactionData.Data.idTransactionFront = idTransactionFront;
                    that.transactionData.Data.plataformaAT = plataformaAT;
                that.transactionData.Data.AdditionalServices = (AdditionalServices.CodeResponse == '0') ? AdditionalServices.AdditionalServiceList : [];
                that.transactionData.Data.AdditionalEquipment = (AdditionalServices.CodeResponse == '0') ? AdditionalServices.AdditionalEquipmentList : [];
                that.transactionData.Data.CoreServices = (CoreServices.CodeResponse == '0') ? CoreServices.ServiceList : [];
                that.transactionData.Data.CustomerInformation = (CustomerInformation.CodeResponse == '0') ? CustomerInformation.CustomerList[0] : [];
                that.transactionData.Data.ListIgv = (Igv.CodeResponse == '0') ? Igv.listaIGV : [];
                that.transactionData.Data.Configuration = (Configuration.CodeResponse == '0') ? Configuration.ProductTransaction.ConfigurationAttributes : [];
                that.transactionData.Data.PuntoAtencion = (PuntoAtencion.CodigoRespuesta == '0') ? PuntoAtencion.listaRegistros : [];
                that.transactionData.Data.DatosUsuarioCtaRed = (DatosUsuarioCtaRed.CodigoRespuesta == '0') ? DatosUsuarioCtaRed.listaDatosUsuarioCtaRed : [];
                that.transactionData.Data.OficinaVentaUsuario = (OficinaVentaUsuario.CodigoRespuesta == '0') ? OficinaVentaUsuario.listaOficinaVenta : [];
                that.transactionData.Data.AuditRequest = AuditRequest;

                that.transactionData.Data.ValidarTransaccion = (ValidarTransaccion.ResponseAudit.CodigoRespuesta == '0') ? ValidarTransaccion.ResponseData : [];
                    //that.transactionData.Data.FixPlanesServCapanas = (fixPlanesCoreService.codigoRespuesta == '0') ? fixPlanesCoreService.ListPlanFijaServicio : [];
                that.transactionData.Data.Instalacion = (Instalacion.codigoRespuesta == '0') ? Instalacion : [];
                that.transactionData.Data.Tipificacion = (Tipificacion.CodigoRespuesta == '0') ? Tipificacion.listaTipificacionRegla : [];
                that.transactionData.Configuration = {};
                that.transactionData.Configuration.Constants = {};
                that.transactionData.Configuration.Constants = Configuraciones;
                    that.transactionData.Configuration.Constants.Technology = CoreServices.Technology;

                    $.reusableBusiness.getIgv(that.transactionData.Data.ListIgv, function (igv) {

                      that.transactionData.Data.Configuration.Constantes_Igv = igv
                    // Load Customer Information - Left Panel
                        $.app.renderCustomerInformation(that.transactionData);
                    // Load Core Service Information - Left Panel
                        //debugger;
                        //if (!$.array.isEmptyOrNull(that.transactionData.Data.CoreServices))
                        $.app.renderCoreServices(that.transactionData);
                    // Load Additional Service Information - Left Panel
                        //if (!$.array.isEmptyOrNull(that.transactionData.Data.AdditionalServices))
                        $.app.renderAdditionalServices(that.transactionData);
                    // Load Additional Equipment Information - Left Panel
                        //if (!$.array.isEmptyOrNull(that.transactionData.Data.AdditionalEquipment))
                        $.app.renderAdditionalEquipment(that.transactionData);


                    });
                    /***********VALIDACION DE ESTADO DE CONTRATO******************/
                    if (!that.InitialValidation()) {
                        return false;
                    }
                    /***INI-Nuevas configuraciones***/

                    if (that.transactionData.Configuration.Constants.Technology == '9') {
                        that.transactionData.Configuration.Constants.Programacion_TipoTrabajoAlta = that.transactionData.Data.idTransactionFront == '5' ? that.transactionData.Configuration.Constants.Programacion_TipoTrabajoAlta : '1093';
                        that.transactionData.Configuration.Constants.Programacion_TipoTrabajoBaja = that.transactionData.Data.idTransactionFront == '5' ? that.transactionData.Configuration.Constants.Programacion_TipoTrabajoBaja : '1094';
                    } else {
                        that.transactionData.Configuration.Constants.Programacion_TipoTrabajoAlta = that.transactionData.Data.idTransactionFront == '5' ? that.transactionData.Configuration.Constants.Programacion_TipoTrabajoAlta : '1105';
                        that.transactionData.Configuration.Constants.Programacion_TipoTrabajoBaja = that.transactionData.Data.idTransactionFront == '5' ? that.transactionData.Configuration.Constants.Programacion_TipoTrabajoBaja : '1106';
                    }
 
                    that.transactionData.Configuration.Constants.Plataforma_Facturador = that.transactionData.Data.idTransactionFront == '5' ? 'BSCS7' : 'CBIO';
                    //that.transactionData.Configuration.Constants.tip_servicio = that.TransferSession.Data.idTransactionFront == '5' ? '0061' : '0101';
                    /***FIN-Nuevas configuraciones***/

                var attributes = that.transactionData.Data.Configuration;
                that.transactionData.Configuration.Steps = attributes.filter(function (e) { return (e.AttributeName == 'step') });
                that.transactionData.Configuration.Views = attributes.filter(function (e) { return (e.AttributeType == 'CONTENEDOR') });
               
                that.transactionData.Configuration.Constants.Technology = CoreServices.Technology;
                    that.transactionData.Configuration.Constants.planCode = CoreServices.planCode;
                var
                    viewsPromise = that.viewsRenderPromise(),
                    stepsPromise = that.stepsRenderPromise(controls.stepsContainer);

                Promise.all([viewsPromise, stepsPromise]) // Carga de las Vistas de la Transacción
                    .then(function (renderResponse) {

                        controls = that.AsignControls(that, controls.form);
                           /* $.reusableBusiness.LoadPointOfAttention(controls.ddlCenterofAttention, that.transactionData);

                            that.loadAdditionalServicesData(that.transactionData.Data.FixPlanesServCapanas);*/
                        controls.btnSave.addEvent(that, 'click', that.Save_click);
                        controls.btnConstancy.addEvent(that, 'click', that.Constancy_Generate);
                        controls.btnCopy.addEvent(that, 'click', $.app.copyToClipboard);
                        controls.btnStep.addEvent(that, 'click', that.navigateTabs);
                        controls.btnAdd.addEvent(that, 'click', that.btnAdd_click);
                        controls.btnRemove.addEvent(that, 'click', that.btnRemove_click);
                        controls.chPrograma.addEvent(that, 'click', that.chPrograma_click);
                        controls.dvPrograma.hide();
                        // Change Events
                         controls.mailCheck.addEvent(that, 'click', that.onMailCheck);
                        controls.mailText.addEvent(that, 'focusout', that.onFocusoutEmail);
                        controls.txtCalendar.datepicker({ format: 'dd/mm/yyyy' });
                        controls.ddlCenterofAttention.change(function () { that.ddlCenterofAttention_Click() });
                        controls.ddlTimeZone.change(function () { that.ddlTimeZone_Click() });
                        controls.txtReferencePhone.addEvent(that, 'keypress', that.onKeyPressLimit);
                        controls.txtReferencePhone.addEvent(that, 'keyup paste', that.onPasteLimit);
                        if (controls.mailText.length > 0) { controls.mailText.val(that.transactionData.Data.CustomerInformation.Email); }

                        $('#btnTareaProgramada').prop("disabled", true);
                    }
                    )
                    .catch(function (e) {
                        $.unblockUI();
                        alert(string.format('Ocurrio un error al cargar la transacción - {0}', e));
                        $('#navbar-body').showMessageErrorLoadingTransaction();
                    })
                    .then(function (renderResponse) {

                            that.LoadProceso2();

                        });            
            }

            )
                .catch(function (e) {
                    $.unblockUI();
                    alert(string.format('Ocurrio un error al obtener la Configuración - {0}', e));
                    $('#navbar-body').showMessageErrorLoadingTransaction();
                })
                .then(function () {

                   // $.unblockUI();
                });

        },

        LoadProceso2: function () {
            var that = this,
            controls = this.getControls();

            var objLoadParameters = {
                ContratoId: Session.SessionParams.DATACUSTOMER.ContractID,
                IdTransaccion: that.transactionData.Data.idTransactionFront,
                IdProceso: '2',
                IdProducto: Session.SessionParams.DATACUSTOMER.objPostDataAccount.plataformaAT === 'TOBE' ? that.transactionData.Configuration.Constants.Technology : '5',//ContratoPublico-TOBE//SI EN CASO ES FTTH Y NO HAY PLANES, ENTONCES LO BUSCA BAJO EL FLUJO HFC 
                tecnologia: Session.SessionParams.DATACUSTOMER.objPostDataAccount.plataformaAT === 'TOBE' ? that.transactionData.Configuration.Constants.Technology : '5',//ContratoPublico-TOBE//SI EN CASO ES FTTH Y NO HAY PLANES, ENTONCES LO BUSCA BAJO EL FLUJO HFC 
                plan: that.transactionData.Configuration.Constants.planCode,
                tipo: '',
                coIdPub: Session.SessionParams.DATACUSTOMER.coIdPub
            };

            $.app.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                url: '/AdditionalServices/Home/GetDatosAdicionales',
                data: JSON.stringify(objLoadParameters),
                success: function (response) {
                    
                    that.transactionData.Current = {};
                    that.transactionData.Current.Plan = {};
                    that.transactionData.Current.ServicesCore = [];
                    that.transactionData.Current.AdditionalPoints = [];
                    that.transactionData.Current.AdditionalServices = [];
                    that.transactionData.Current.AdditionalEquipment = [];
                    that.additionalServicesSession = {};
                    that.additionalServicesSession.Data = {};

                    that.lstEquipmentsToAssociate = [];
                    that.lstEquipmentsToAssociate2 = [];
                    that.lstEquipmentsToDisassociate = [];


                    that.lstEquipmentsToAssociateInit = [];
                    that.lstEquipmentsToAssociate2Init = [];
                    that.lstEquipmentsToDisassociateInit = [];

                    that.lstServiciosDesactivar = [];
                    that.lstServiciosActivar = [];

                    that.lstServiciosDesactivarPreCarga = [];
                    that.lstServiciosActivarPreCarga = [];
                    that.transactionData.Data.FixPlanesServCapanas = (response.data.MessageResponse.Body.servicios.PlanFijaServicioCampana.codigoRespuesta == '0') ? response.data.MessageResponse.Body.servicios.PlanFijaServicioCampana.ListPlanFijaServicio : [];
                    if (that.transactionData.Data.FixPlanesServCapanas != []) {

                        that.transactionData.Data.FixPlanesServCapanas = that.transactionData.Data.FixPlanesServCapanas
																		.filter(function (item) {
																		    return item.ServiceType != 'ALQUILER EQUIPOS IPTV' &&
                                                                                 item.ServiceType != 'ALQUILER EQUIPOS'
																		});
                        debugger;
                        $.each(that.transactionData.Data.FixPlanesServCapanas, function (idx, service) {
                            that.transactionData.Data.FixPlanesServCapanas[idx]["check"] = false;
                            that.transactionData.Data.FixPlanesServCapanas[idx].ServiceType = service.ServiceType == null ? "" : service.ServiceType;
                            that.transactionData.Data.FixPlanesServCapanas[idx].familia = service.familia == null ? "" : service.familia;
                            that.transactionData.Data.FixPlanesServCapanas[idx].FixedCharge = service.FixedCharge == null || service.FixedCharge == '' ? "0.00" : (parseFloat(service.FixedCharge) * parseFloat("1." + that.transactionData.Data.Configuration.Constantes_Igv)).toFixed(2);
                            that.transactionData.Data.FixPlanesServCapanas[idx].cargoFijoPromocion = service.cargoFijoPromocion == null || service.cargoFijoPromocion == '' ? "0.00" : parseFloat(service.cargoFijoPromocion).toFixed(2);
                           
                        });


                        that.transactionData.Data.FixPlanesServCapanas = that.transactionData.Data.FixPlanesServCapanas.sort(function (a, b) { var x = a.ServiceType.toLowerCase(), y = b.ServiceType.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });


                        that.additionalServicesSession.Data.AdditionalServices = that.transactionData.Data.FixPlanesServCapanas;
                        that.additionalServicesSession.Data.FixedPlanDetail = that.transactionData.Data.FixPlanesServCapanas;

                        $.reusableBusiness.LoadPointOfAttention(controls.ddlCenterofAttention, that.transactionData);

                        that.loadAdditionalServicesData(that.transactionData.Data.FixPlanesServCapanas);
                        $.unblockUI();
                    } else {
                        alert('Error al consultar los servicios adicionales.');
                        $.unblockUI();
                    }

                },
                error: function (ex) {
                    alert('Error al consultar los servicios adicionales.' + ex);
                    $.unblockUI();
                }
            }
            );

        },

        onPasteLimit: function (e) {

            var that = this,
            controls = this.getControls();

            var tval = controls.txtReferencePhone.val(),
            tlength = tval.length,
            set = 12,
            remain = parseInt(set - tlength);

            controls.txtReferencePhone.val((tval).substring(0, 12));

         

        },

        onKeyPressLimit: function (e) {
            var that = this,
              controls = this.getControls();

            var tval = controls.txtReferencePhone.val(),
            tlength = tval.length, 
            set = 12,
            remain = parseInt(set - tlength);
                 
                if (remain <= 0 && e.which !== 0 && e.charCode !== 0) {
                    controls.txtReferencePhone.val((tval).substring(0, tlength - 1));
                    return false;
                }
        },
        navigateTabs: function () {

            var that = this,
                controls = this.getControls();

            var $activeTab = $('.step.tab-pane.active');
            var stepValidation = $activeTab.attr('data-validation');

            if (typeof stepValidation !== 'undefined' && stepValidation !== '') {
                if (that[stepValidation]()) { navigateTabs(event) }
            }
            else {
                navigateTabs(event);
            }
        },


        getImage: function (group) {

            var imagen = "";
            switch (group) {
                case 'Cable':
                    imagen = 'ico_cable.svg';
                    break;
                case 'Internet':
                    imagen = 'ico_internet.svg';
                    break;
                default:
                    imagen = 'ico_phone.svg';
            }
            return string.format("/Content/Images/SUFija/{0}", imagen);

        },
        /* PartialView SummaryPackage - Resumen */
        
        generarActualizacionServicios: function(filter1, filter2, opcion) {
            var array1 = filter1;
            var array2 = filter2;
            var that = this;""
            var tempArr = array2.filter(function (item) {
                return array1.indexOf(item) == -1 ? true : false;//!array1.includes(item);
            });
            array1 = array1.filter(function (item) {
                return array2.indexOf(item) == -1 ? true : false; //!array2.includes(item);
            });
            array2 = tempArr;

            if (opcion) {
                that.lstServiciosDesactivar = array1;
                that.lstServiciosActivar = array2;
            }
            else {
                debugger;
                var IdServ = '';
                var tempArr2 = [];
                $.each(array1, function (idx, item) {
                    IdServ += item.LineID + ';' + item.idServPvuTobe + ';';
                });

                $.each(array2, function (idx, item) {
                    if (IdServ.indexOf(item.LineID) == -1) {
                        tempArr2 = tempArr2.concat(item);
                    }
                });


                that.lstServiciosDesactivarPreCarga = array1;   //Grilla Derecha
                that.lstServiciosActivarPreCarga = tempArr2;// array2;      //Grilla Izquierda
            }
         

          
            //nuevoArray1 = array1;
            //nuevoArray2 = array2;

        },


        generatePlanDetail: function () {

            var that = this,
                arrPlan, content, separator,
                controls = this.getControls();

            controls.resumeServicesActivados.empty();
            controls.resumeServicesDesactivados.empty();
            controls.divContenServicesAdd.hide();
            controls.divContenServicesRemove.hide();

            content = ''
            separator = '<span class="text-line text-line-red  remove-padding">+</span>';
             
            var ServiciosNuevos = [];
             
            that.generarActualizacionServicios(that.lstEquipmentsToDisassociateInit, that.lstEquipmentsToAssociate2, true);
                       
            that.lstServiciosDesactivar;
            that.lstServiciosActivar  ;


           
            var sumaServiciosAdd = 0 ,
                sumaServiciosQuit = 0 ;


            $.each(that.lstServiciosActivar, function (idx, service) {
                content +=  content.length > 0  ?  separator  : "";
                content += string.format('<img src="{0}" alt="" class="icon-collapse-bar-horizontal remove-padding" style="width: 30px;" />', that.getImage(service.ServiceType));
                content += string.format('<span class="text-line">{0}</span>', service.ServiceDescription);
                sumaServiciosAdd +=  parseFloat(service.FixedCharge);
            });
            controls.resumeServicesActivados.append(content);

            content = "";
            $.each(that.lstServiciosDesactivar, function (idx, service) {
                content += content.length > 0 ? separator : "";
                content += string.format('<img src="{0}" alt="" class="icon-collapse-bar-horizontal remove-padding" style="width: 30px;" />', that.getImage(service.ServiceType));
                content += string.format('<span class="text-line">{0}</span>', service.ServiceDescription);
                sumaServiciosQuit += parseFloat(service.FixedCharge);
            });
            controls.resumeServicesDesactivados.append(content);
           
            var markup = "";
            
          

            var el = that.lstServiciosActivar;
            if (el.length > 0) {
                controls.divContenServicesAdd.show();
                markup += '<b>--------------- SERVICIOS ACTIVADOS ---------------</b><br />';
                       //<span class="summary">INTERNET | puerto 25 | Costo S/. 175.00</span> <br />
                       //<span class="summary">TELEFONIA | 200 Min Multidestino | Costo S/. 16.00</span> <br />
                       //<span class="summary">CABLE | Paquete Fox Premium | Costo S/. 15.00</span> <br />
            $.each(el, function (i, eq) {
                markup += string.format('<span class="summary"> {0} | {1}  Costo S/.  {2}  </span> <br />', eq.ServiceType, eq.ServiceDescription, eq.FixedCharge);
                
            })
            }
            var nuevoCargoFijo = 0;

            nuevoCargoFijo = parseFloat(that.transactionData.Data.CustomerInformation.PackageCost) + parseFloat(sumaServiciosAdd);
            nuevoCargoFijo = nuevoCargoFijo - parseFloat(sumaServiciosQuit);
            nuevoCargoFijo = nuevoCargoFijo.toFixed(2);

            

            //var contServicesRemove = 0;
            var el = that.lstServiciosDesactivar;
            if (el.length > 0) {
                controls.divContenServicesRemove.show();
                markup += '<b>--------------- SERVICIOS DESACTIVADOS ---------------</b><br />';
            $.each(el, function (i, eq) {
                markup += string.format('<span class="summary"> {0} | {1}  Costo S/.  {2}  </span> <br />', eq.ServiceType, eq.ServiceDescription, eq.FixedCharge);
            })
            }
            
            //parseFloat(controls.spCostoFijoRegular.text().replace("S/", "")) + parseFloat(that.transactionData.Data.CustomerInformation.PackageCost)).toFixed(2)
            markup += '<br />'
            markup += string.format('<b>Fecha de Programación: </b> <span class="summary">{0}</span> <br />', $("#chPrograma").prop("checked") ? controls.txtCalendar.val() : that.getFechaActual());
            markup += string.format('<b>Cargo Fijo Actual: </b> <span class="summary">S/. {0}</span> <br />', that.transactionData.Data.CustomerInformation.PackageCost);
            //markup += string.format('<b>Cargo Fijo Promocional:</b> <span class="summary">{0}</span> <br />', "");
            markup += string.format(' <b>Nuevo Cargo Fijo:  </b> <span class="summary">S/. {0}</span> <br />', nuevoCargoFijo);
            //markup += string.format('<b>Siguiente Recibo:  </b> <span class="summary">{0}</span> <br />', "");
            markup += '<br />'

            $("#resumeContent").empty();
            $("#resumeContent").append(markup);

             
            markup = '';
            markup += '<br />';
            markup += String.format(' Sr. ó Sra. <b>{0},  </b>, durante {1}, meses se estará brindando el descuento de <b> {2}, </b> por el alquiler del <b>paquete {3},   <br />',
            that.transactionData.Data.CustomerInformation.CustomerName, "", "", "");
            markup += String.format('Asimismo, mencionarle que en el siguinte recibo se estará cobrando el proporcional más el cobro del mes del <br />  paquete contratado que será el monto de <b> {0}.</b><br />', controls.spCostoFijoRegular.text());
            markup += String.format('<br /> Después de la promoción, percibirá un cobro adicional de <b> {0}</b> correspondiente al <b>paquete {1}.</></b><br />', controls.spCostoFijoRegular.text(), "--");
            markup += '<br /> <span>*Recordarle que el paquete se estara activando en las proximas horas.</span>';
            $("#speechone").empty();
            $("#speechone").append(markup);




        },

        ServicesValidation: function () {

            var that = this, controls = this.getControls();

            if ($("#chPrograma").prop("checked")) {
                if ($.trim(controls.txtCalendar.val()) == "") {
                    alert("Debe seleccionar una fecha de programación.", "Alerta");
                    controls.txtCalendar.focus();
                    return false;
                }
            }

            if (!that.onFocusoutEmail()) {
                alert('Ingrese una dirección de correo válida.');
                return false;
            }

            if ((that.lstServiciosDesactivar.length <= 0 && that.lstServiciosActivar.length <= 0) ||
                    ((controls.spServiciosAgregados.text() == "0") && (controls.spServiciosDesactivados.text() == "0"))
                ) {
                alert('Debe agregar o quitar un servicio adicional para seguir con el proceso');
                return false;
            }



            if ($("#ddlCenterofAttention option:selected").html() == '-Seleccionar-') {
                controls.ddlCenterofAttention.closest('.form-control').addClass('has-error');
                controls.centroAtencionZoneErrorMessage.text('Seleccione un Centro de Atención válido');
                alert('Seleccione un Centro de Atención válido');
                controls.ddlCenterofAttention.focus();
                return false;
            }

            that.generatePlanDetail();

            return true;
        },

             

    
        onMailCheck: function () {

            var that = this,
                controls = this.getControls();
            var temp = controls.mailText.val();

            if (controls.mailCheck.is(':checked')) {
                controls.mailText.attr('disabled', false);
                controls.mailText.val(that.transactionData.Data.CustomerInformation.Email);
            }
            else {
                controls.mailErrorMessage.text('');
                controls.mailText.val('');
                controls.mailText.closest('.form-group').removeClass('has-error');
                controls.mailText.attr('disabled', true);
            }
        },

        onFocusoutEmail: function () {

            var that = this,
                controls = this.getControls();

            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

            if (controls.mailCheck.is(':checked')) {
                if (!filter.test(controls.mailText.val())) {
                    controls.mailText.closest('.form-control').addClass('has-error');
                    controls.mailErrorMessage.text('Ingrese una dirección de correo válida.');
                    controls.mailText.focus();

                    return false;
                }
                else {
                    controls.mailText.closest('.form-control').removeClass('has-error');
                    controls.mailErrorMessage.text('');

                    return true;
                }
            }

            return true;
        },


        ddlCenterofAttention_Click: function () {
            var controls = this.getControls();
            controls.ddlCenterofAttention.closest('.form-control').removeClass('has-error');
            controls.centroAtencionZoneErrorMessage.text('');
            
        },

        AsignControls: function (that, $element) {
                      
            that.updateControl({
                               
                spCostoFijoRegular: $('#spCostoFijoRegular', $element),
                spCostoFijoPromocional: $('#spCostoFijoPromocional', $element),
           
                spServiciosAgregados: $('#spServiciosAgregados', $element),
                spServiciosDesactivados: $('#spServiciosDesactivados', $element),

                chPrograma: $('#chPrograma', $element),
                dvPrograma: $('#dvPrograma', $element),

                btnAdd: $('#btnAdd', $element),
                btnRemove: $('#btnRemove', $element),
                txtCalendar: $('#txtCalendar', $element),
                ddlTimeZone: $('#ddlTimeZone', $element),
                txtNote: $('#txtNote', $element),
                txtReferencePhone: $('#txtReferencePhone', $element),
                ddlCenterofAttention: $('#ddlCenterofAttention', $element),
                resumeServicesActivados: $('#resumeServicesActivados', $element),
                resumeServicesDesactivados: $('#resumeServicesDesactivados', $element),
                divContenServicesAdd: $('#divContenServicesAdd', $element),
                divContenServicesRemove: $('#divContenServicesRemove', $element),
                mailText: $('#txtEmail', $element),
                mailCheck: $('#chkEmail', $element),
                btnCopy: $('#btnCopy', $element),

                mailErrorMessage: $('#ErrorMessageEmail', $element),
                centroAtencionZoneErrorMessage: $('#ErrorMessageddlCenterofAttention', $element),
                timeZoneErrorMessage: $('#ErrorMessageddlTimeZone', $element),

               

            });

            return that.getControls();
        },

        /* Partial View CustomerData - Datos Cliente */
        /*
        customerInformationPromise: function (container) {

            return new Promise(function (resolve, reject) {

                $.ajax({
                    type: 'POST',
                    async: false,
                    url: '/AdditionalServices/Home/CustomerData',
                    success: function (res) {
                        container.html(res);
                        resolve(true);
                    },
                    error: function (err) { reject(err) }
                });
                  
            });
        },
*/
        InitialValidation: function () {

            var that = this,
                controls = that.getControls(),
               stateContract = !$.string.isEmptyOrNull(that.transactionData.Data.CustomerInformation.ContractStatus) ? that.transactionData.Data.CustomerInformation.ContractStatus : '',
               stateService = !$.string.isEmptyOrNull(that.transactionData.Data.CustomerInformation.ServiceStatus) ? that.transactionData.Data.CustomerInformation.ServiceStatus : '';

            if (!$.array.isEmptyOrNull(that.transactionData.Data.CustomerInformation)) {

                            console.log('stateContracto: ' + stateContract);
                            console.log('stateService:  ' + stateService);
                            console.log('Plataforma:  ' + Session.SessionParams.DATACUSTOMER.objPostDataAccount.plataformaAT);
                            if (Session.SessionParams.DATACUSTOMER.objPostDataAccount.plataformaAT === 'TOBE') {
                                    if (stateContract.trim().toUpperCase() != 'ACTIVO' || stateService.trim().toUpperCase() != 'ACTIVO') {
                                        alert("El contrato no se encuentra activo.", 'Alerta', function () {
                        $.unblockUI();
                        parent.window.close();
                    });
                    return false;
                }
            }
            else {
                                    if (stateContract.trim().toUpperCase() != 'ACTIVO') {
                                        alert("El contrato no se encuentra activo.", 'Alerta', function () {
                                            $.unblockUI();
                                            parent.window.close();
                                        });
                return false;
            }
                            }
            }

            if (!$.array.isEmptyOrNull(that.transactionData.Data.ValidarTransaccion)) {
                if (that.transactionData.Data.ValidarTransaccion.Codigo == "-3") {
                    alert(that.transactionData.Data.ValidarTransaccion.Mensaje, 'Alerta', function () {
                        $.unblockUI();
                        parent.window.close();
                    });
                    return false;
                }

                if (that.transactionData.Data.ValidarTransaccion.Codigo == "-1") {
                    alert("Error al validar transacción", 'Alerta', function () {
                        $.unblockUI();
                        parent.window.close();
                    });
                    return false;
                }

            }


            return true;
        },

        getFechaActual: function () {
            var that = this;
            var d = new Date();
            var FechaActual = that.AboveZero(d.getDate()) + "/" + (that.AboveZero(d.getMonth() + 1)) + "/" + d.getFullYear();
            return FechaActual;
        },
        AboveZero: function (i) {

            if (i < 10) {
                i = '0' + i;
            }
            return i;
        },


        stepsRenderPromise: function (container) {
            var that = this,
                controls = that.getControls();

            return new Promise(function (resolve, reject) {
                $.app.createSteps(that.transactionData.Configuration.Steps, container);
                resolve();
            });
        },

        viewsRenderPromise: function () {
            var that = this,
                controls = that.getControls();

            return new Promise(function (resolve, reject) {
                var transactionViews = that.transactionData.Configuration.Views;
                $.app.ViewsRender(transactionViews, transactionViews, '', 'transactionContent', resolve);
            });
        },

        loadAdditionalServicesDataSummary: function (data) {
            var that = this,
                controls = that.getControls();

            var currentServicesNames = that.transactionData.Data.AdditionalServices.map(function (el) { return el.ServiceDescription; }),
                currentServicesList = that.transactionData.Data.AdditionalServices
                    .filter(function (el) {
                        return $.inArray(el.ServiceDescription, currentServicesNames) > 0;
                    }
                    ),
                additionalServicesList = that.transactionData.Data.AdditionalServices
                    .filter(function (el) {
                        return $.inArray(el.LineID, currentServicesList.map(function (e) { return e.LineID })) < 0;
                    }
                    );


            that.initCustomerProductsSummary_DataTable(currentServicesList);
            //that.fillProductsTable_DataTable(controls.tblProductTable, additionalServicesList);
            //that.fillProductsTable_DataTable(controls.tblProductTable, data);
        },

        loadAdditionalServicesData: function (data) {
            var that = this,
                controls = that.getControls();

            var currentServicesNames = that.additionalServicesSession.Data.AdditionalServices.map(function (el) { return el.ServiceDescription; }),
                currentServicesList = that.additionalServicesSession.Data.FixedPlanDetail
                    .filter(function (el) {
                        return $.inArray(el.ServiceDescription, currentServicesNames) > 0;
                    }
                    ),
                additionalServicesList = that.additionalServicesSession.Data.FixedPlanDetail
                    .filter(function (el) {
                        return $.inArray(el.LineID, currentServicesList.map(function (e) { return e.LineID })) < 0;
                    }
                    );
           



            var coreServices = that.additionalServicesSession.Data.AdditionalServices
               .filter(function (item) {
                   return item.coreAdicional == 'CORE' &&
                       item.ServiceEquiptment == 'SERVICIO'
               });


            var additionalServices = that.additionalServicesSession.Data.AdditionalServices
             .filter(function (item) {
                 return item.coreAdicional == 'ADICIONAL' &&
                     item.ServiceEquiptment == 'SERVICIO'
             });

            var serviciosAdicionalesCliente = that.transactionData.Data.AdditionalServices;

            console.log('ContractID: ' + Session.SessionParams.DATACUSTOMER.ContractID);
            console.log('coIdPub: ' + Session.SessionParams.DATACUSTOMER.coIdPub);
            console.log('planCode: ' + that.transactionData.Configuration.Constants.planCode);
            console.log('additionalServices: ');
            console.log(additionalServices);
            if ($.array.isEmptyOrNull(additionalServices)) {
                alert("El plan  del cliente no tiene configurado servicios adicionales.", 'Alerta', function () {
                        $.unblockUI();
                        parent.window.close();
                    });
               
                return false;
            }
        
            that.fnGetNombreServicios(additionalServices);

            
            //that.fillProductsTable_DataTable(controls.tblProductTable, additionalServicesList);
            //that.initCustomerProductsSummary_DataTable(currentServicesList);

            //that.fillProductsTable_DataTable(controls.tblProductTable, coreServices, additionalServices);
            //that.initCustomerProductsSummary_DataTable(additionalServices, coreServices);


            that.fillProductsTable_DataTable(controls.tblProductTable, that.additionalServicesSession.Data.AdditionalServices, that.transactionData.Data.AdditionalServices);
            that.initCustomerProductsSummary_DataTable(that.transactionData.Data.AdditionalServices, that.additionalServicesSession.Data.AdditionalServices);


        },

          uncheckRow: function(tableName, IdTR, swit) {
              var table = $(tableName).DataTable();
              var row = table.row();//"#" + IdTR);
              //var row = IdTR;
                var rowData = row.data();
              
                var $tr = $(row.node());
              //var $checkbox = $tr.find('input[type="checkbox"]')

                var $checkbox = IdTR.find('input[type="checkbox"]')
                //if($checkbox.is(':checked')){
                //    $checkbox.prop('checked', false);
                //}
                //else {
                //    $checkbox.prop('checked', true);
                //}
               
                $checkbox.prop('checked', swit);

            },


        fillProductsTable_DataTable: function (customerProductsTable, data, serviciosParaDesasociarAsociar) {
            
            var that = this,
                controls = that.getControls();
         
            var dataSource = that.transactionData.Data.FixPlanesServCapanas;

          
            that.fillListEquipmentsToDisassociate(serviciosParaDesasociarAsociar);

           $('#tblCustomerAssociateEquiment').DataTable({
            "columnDefs": [
            {
                'targets': 0,
                'checkboxes': {
                    'selectRow': true
                },

            },

            {
                'targets': 1,
                'checkboxes': {
                    'selectRow': true
                },
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" />';
                },
                "fnCreatedRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(0)', nRow).html('<input type="checkbox" name="checkbox" class="checkbox" value="' + 3 + '">');

                }

            },

            {
                "render": function (data, type, row) {
                    return '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data + '</span>';
                },
                "targets": 2
            },
            {
                "render": function (data, type, row) {
                    //return 'S/' + data;
                    return '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S/' + data + '</span>';
                },
                "targets": 3
            },
            {
                "targets": [0,4],
                "visible": false,
                "searchable": false
            },
            {
                "targets": "_all",
                "sortable": false,
                "searchable": false,
                "orderable": false
            }
        ],
        "select": {
                "style": "multi"
        },
        "data": data,
            "order": [[1, 'asc']],
            "columns": [
                //{ "data": "strCodigoServicio" },
                //{ "data": "strTipoServicio" },
                //{ "data": "strNombreServicio" },
                //{ "data": "dblMontoServicio" },
                //{ "data": "dblPromocion" }
                { "data": "LineID"},
                { "data": "ServiceType" },
                { "data": "ServiceDescription" },
                { "data": "FixedCharge" },
                { "data": "cargoFijoPromocion" }
            ],
           
            "createdRow": function (row, data, dataIndex) {
                //if (data.intServicioActivado == 1) {
                    $(row).addClass("info-naranja");
                //}
            },
            "drawCallback": function (settings) {
                var api = this.api();
                var rows = api.rows({ page: 'current' }).nodes();
                var last = null;
                var groupadmin = [];
                    if (Session.SessionParams.DATACUSTOMER.objPostDataAccount.plataformaAT === 'TOBE')
                        api.column(1, { page: 'current' }).data().each(function (ServiceType, i) {
                            if (last !== ServiceType && groupadmin.indexOf(i) == -1) {
                                var imagen;
                                switch (ServiceType) {
                                    case 'SERVICIOS ADICIONALES - CABLE':
                                        imagen = 'ico_cable.svg';
                                        break;
                                    case 'SERVICIOS ADICIONALES - INTERNET':
                                        imagen = 'ico_internet.svg';
                                        break;
                                    case 'SERVICIOS ADICIONALES - TELEFONIA':
                                        imagen = 'ico_phone.svg';
                                        break;
                                    case 'SERVICIOS ADICIONALES - CABLE IPTV':
                                        imagen = 'ico_cable.svg';
                                        break;
                                    case 'SERVICIOS ADICIONALES - TELEFONIA FTTH':
                                        imagen = 'ico_phone.svg';
                                        break;
                                }
                                $(rows).eq(i).before(
                                    '<tr id="' + i + '"><td colspan="4" class="info-gestion"><img src="/Content/Images/SUFija/' + imagen + '">' + ServiceType + '</td></tr>'
                                );
                                groupadmin.push(i);
                                last = ServiceType;
                            }
                        });
                    else
                api.column(1, { page: 'current' }).data().each(function (group, i) {
                    if (last !== group && groupadmin.indexOf(i) == -1) {
                        var imagen;

                                switch (ServiceType) {
                            case 'Cable':
                                imagen = 'ico_cable.svg';
                                break;
                            case 'Internet':
                                imagen = 'ico_internet.svg';
                                break;
                                    case 'Telefonia':
                                imagen = 'ico_phone.svg';
                                        break;
                        }
                        $(rows).eq(i).before(
                            '<tr><td colspan="4" class="info-gestion"><img src="/Content/Images/SUFija/' + imagen + '">' + group + '</td></tr>'
                        );
                        groupadmin.push(i);
                        last = group;
                    }
                });
            },
            "info": false,
            "scrollX": true,
            "scrollY": false,
            "scrollCollapse": false,
            "paging": false,
            "searching": false,
            "destroy": true
            });

            //$.unblockUI();
            
           
            var table = $('#tblCustomerAssociateEquiment').DataTable();// controls.tblProductTable.DataTable();

            $('#tblCustomerAssociateEquiment input:checkbox').change(function () {
                var $row = $(this).closest('tr');
                var data = table.row($row).data(); 
                ////that.uncheckRow("#tblCustomerAssociateEquiment", $row, data.check ? false : true);

            });
        


            $('#tblCustomerAssociateEquiment').on('click', 'tbody td, thead th:first-child', function (e) {
                var $row = $(this).closest('tr');
                var data = table.row($row).data();
                
                if (data != undefined || data != null) {

                    //var searchequipment = that.lstEquipmentsToAssociate.indexOf(data);
                    
                    //if (searchequipment >= 0) {
                    //      that.lstEquipmentsToAssociate.splice(searchequipment, 1);
                    //    that.lstEquipmentsToAssociate.filter(function (el, idx) { return el.LineID != data.LineID });
                      
                    //} else {
                    //    that.lstEquipmentsToAssociate.push(data);
                    //}
                     
                    data.check = data.check ? false : true;

                    that.uncheckRow("#tblCustomerAssociateEquiment", $row, data.check);

                    if (that.lstEquipmentsToAssociate.length > 0) {
                        controls.btnAdd.prop('disabled', false);
                        controls.btnRemove.prop('disabled', true);
                    } else {
                        controls.btnRemove.prop('disabled', false);
                    }
                }
            });
            
        },

        /*Carga los  Servicio Actuales del cliente*/
        initCustomerProductsSummary_DataTable: function (data, serviciosParaAsociar) {
            var that = this, controls = that.getControls();
            data= data.sort(function (a, b) { return a.ServiceType < b.ServiceType ? -1 : +(a.ServiceType > b.ServiceType) });
            debugger;
            that.fillListEquipmentsToAssociate(serviciosParaAsociar);

            //that.getCountFixed(that.transactionData.Data.AdditionalServices);

            that.getCountFixed(data, true);

 
            $('#tblCustomerEquipmentSummary').DataTable({
                //controls.tblProductsSummary.DataTable({
                    "columnDefs": [
                       {
                           'targets': 0,
                           'checkboxes': {
                               'selectRow': true
                           }
                       },

                         {
                             'targets': 1,
                             'checkboxes': {
                                 'selectRow': true
                             },
                             'render': function (data, type, full, meta) {
                                 return '<input type="checkbox" />';
                             },
                             "fnCreatedRow": function (nRow, aData, iDataIndex) {
                                 $('td:eq(0)', nRow).html('<input type="checkbox" name="checkbox" class="checkbox" value="' + aData.LineID + '">');

                             }

                         },

                      {
                          "render": function (data, type, row) {
                              return '<span>&nbsp;&nbsp;&nbsp;&nbsp;' + data + '</span>';
                          },
                          "targets": 2
                      },
                       {
                           "render": function (data, type, row) {
                               return '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S/' + data + '</span>';
                           },
                           "targets": 3
                       },
                       {
                           "render": function (data, type, row) {
                               return '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S/' + data + '</span>';
                           },
                           "targets": 4
                       },
                      {
                          "targets": [0],//[0,1],
                          "visible": false,
                          "searchable": false
                      },
                      {
                          "targets": "_all",
                          "sortable": false,
                          "searchable": false,
                          "orderable": false
                      }
                    ],
                    "select": {
                        "style": "multi"
                    },
                    "order": [[1, 'asc']],
                    "data": data,
                    "columns": [

                        //esto era para probar con la data del cliente, 
                            //{ "data": "EquipmentSerial" },
                            //{ "data": "ServiceName" },
                            //{ "data": "ServiceDescription" },
                            //{ "data": "FixedChargePromotion" },
                            //{ "data": "FixedCharge" }

                             { "data": "LineID" },
                            { "data": "ServiceType" },
                            { "data": "ServiceDescription" },
                            { "data": "cargoFijoPromocion" },
                            { "data": "FixedCharge" }
                    ],
                   
                    "createdRow": function(row, data, dataIndex) {
                        //if (data.intServicioActivado == 0) {
                            $(row).addClass("info-celeste");
                        //}
                    },
                    "drawCallback": function (settings) {
                        var api = this.api();
                        var rows = api.rows({ page: 'current' }).nodes();
                        var last = null;
                        var groupadmin = [];
                    if (Session.SessionParams.DATACUSTOMER.objPostDataAccount.plataformaAT === 'TOBE')
                        api.column(1, { page: 'current' }).data().each(function (ServiceType, i) {
                        if (last !== ServiceType && groupadmin.indexOf(i) == -1) {
                            var imagen;
                            switch (ServiceType) {
                                case 'SERVICIOS ADICIONALES - CABLE':
                                    imagen = 'ico_cable.svg';
                                    break;
                                case 'SERVICIOS ADICIONALES - INTERNET':
                                    imagen = 'ico_internet.svg';
                                    break;
                                case 'SERVICIOS ADICIONALES - TELEFONIA':
                                    imagen = 'ico_phone.svg';
                                    break;
                                case 'SERVICIOS ADICIONALES - CABLE IPTV':
                                    imagen = 'ico_cable.svg';
                                    break;
                                case 'SERVICIOS ADICIONALES - TELEFONIA FTTH':
                                    imagen = 'ico_phone.svg';
                                    break;
                            }
                            $(rows).eq(i).before(
                                '<tr id="' + i + '"><td colspan="4" class="info-agrupa"><img src="/Content/Images/SUFija/' + imagen + '">' + ServiceType + '</td></tr>'
                            );
                            groupadmin.push(i);
                            last = ServiceType;
                        }
                    });
                    else
                        api.column(1, { page: 'current' }).data().each(function (group, i) {
                            if (last !== group && groupadmin.indexOf(i) == -1) {
                                var imagen;

                            switch (ServiceType) {
                                    case 'Cable':
                                        imagen = 'ico_cable.svg';
                                        break;
                                    case 'Internet':
                                        imagen = 'ico_internet.svg';
                                        break;
                                case 'Telefonia':
                                        imagen = 'ico_phone.svg';
                                    break;
        
                                }
                                $(rows).eq(i).before(
                                    '<tr id="' + i + '"><td colspan="4" class="info-agrupa"><img src="/Content/Images/SUFija/' + imagen + '">' + group + '</td></tr>'
                                );
                                groupadmin.push(i);
                                last = group;
                            }
                        });
                    },
                    "info": false,
                    "scrollX": true,
                    "scrollY": false,
                    "scrollCollapse": true,
                    "paging": false,
                    "searching": false,
                    "destroy": true 
                });
            var table = $('#tblCustomerEquipmentSummary').DataTable();//  controls.tblProductsSummary.DataTable();


                $('#tblCustomerEquipmentSummary input:checkbox').change(function () {
                    var $row = $(this).closest('tr');
                    var data = table.row($row).data();
                    ///that.uncheckRow("#tblCustomerEquipmentSummary", $row, data.check ? false : true);

                });

                $('#tblCustomerEquipmentSummary').on('click', 'tbody td, thead th:first-child', function (e) {
                    var $row = $(this).closest('tr');
                    var data = table.row($row).data();

                    if (data != undefined || data != null) {

                        //var searchequipment = that.lstEquipmentsToAssociate2.indexOf(data);

                        //if (searchequipment >= 0) {
                        //    that.lstEquipmentsToAssociate2.splice(searchequipment, 1);
                        //    that.lstEquipmentsToAssociate2.filter(function (el, idx) { return el.LineID != data.LineID });

                        //} else {
                        //    that.lstEquipmentsToAssociate2.push(data);
                        //}
                       
                        data.check = data.check ? false : true;
                         
                        that.uncheckRow("#tblCustomerEquipmentSummary", $row, data.check);
                        if (that.lstEquipmentsToAssociate2.length > 0) {
                            controls.btnAdd.prop('disabled', true);
                            controls.btnRemove.prop('disabled', false);
                        } else {
                            controls.btnAdd.prop('disabled', false);
                        }
                    }
                });
            $('.dataTables_filter').hide();

            //$.unblockUI();
            
        },

        jsonOrderMatriz: function () {
            var that = this;
            that.lstEquipmentsToDisassociate = that.lstEquipmentsToDisassociate.sort(function (a, b) { var x = a.ServiceType.toLowerCase(), y = b.ServiceType.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
            that.lstEquipmentsToAssociate2 = that.lstEquipmentsToAssociate2.sort(function (a, b) { var x = a.ServiceType.toLowerCase(), y = b.ServiceType.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
            that.lstEquipmentsToAssociate = that.lstEquipmentsToAssociate.sort(function (a, b) { var x = a.ServiceType.toLowerCase(), y = b.ServiceType.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });

        },

        btnAdd_click: function () {
            var that = this, controls = that.getControls();
            var datosParaAsociar = that.lstEquipmentsToAssociate.filter(function (el, idx) { return el.check });
            var countServTel = 0;
            var countServTelAdded = 0;

            for (var i = 0; i < datosParaAsociar.length; i++) {
                if (datosParaAsociar[i].ServiceType == "Telefonía" || datosParaAsociar[i].ServiceType == "Telefonia" || datosParaAsociar[i].familia == "Telefonía" || datosParaAsociar[i].familia == "Telefonia") {
                    countServTel = countServTel + 1;
                }
            }
            for (var i = 0; i < that.lstEquipmentsToDisassociate.length; i++) {
                if (that.lstEquipmentsToDisassociate[i].ServiceType == "Telefonía" || that.lstEquipmentsToDisassociate[i].ServiceType == "Telefonia" || that.lstEquipmentsToDisassociate[i].familia == "Telefonía" || that.lstEquipmentsToDisassociate[i].familia == "Telefonia") {
                    countServTelAdded = countServTelAdded + 1;
                }
            }
            if (countServTel > 0) {
                if (countServTel == 1) {
                    if (countServTelAdded > 0) {
                        alert('No puede agregar más de un servicio de telefonía. Sólo se permite 1.');
                        return;
                    }
                }
                else {
                    alert('No puede agregar más de un servicio de telefonía. Sólo se permite 1.');
                    return;
                }
            }
            
            //that.jsonOrderMatriz();
            //if (that.lstEquipmentsToDisassociate.length > 0 || that.lstEquipmentsToAssociate.length > 0) {
            //    for (var j = 0; j < that.lstEquipmentsToAssociate.length; j++) {
            //        var searchequipment = that.lstEquipmentsToDisassociate.indexOf(that.lstEquipmentsToAssociate[j]);

            //        if (searchequipment >= 0) {
            //            that.lstEquipmentsToDisassociate.splice(searchequipment, 1);
            //        }
            //    }
            //}
                      
            that.lstEquipmentsToDisassociate = that.lstEquipmentsToDisassociate.concat(datosParaAsociar);
            that.lstEquipmentsToAssociate = that.lstEquipmentsToAssociate.filter(function (el, idx) { return el.check != true });
            
            if (that.lstEquipmentsToAssociate.length == 0) {
                var table = $('#tblCustomerAssociateEquiment').DataTable()
                table.rows().remove().draw();
            };

           
            that.lstEquipmentsToAssociate2 = that.lstEquipmentsToDisassociate;
            $.each(that.lstEquipmentsToAssociate2, function (idx, service) {
                that.lstEquipmentsToAssociate2[idx]["check"] = false;
            });


            that.jsonOrderMatriz();
            that.getAssociateItem(that.lstEquipmentsToDisassociate);
            that.getDisassociateItem(that.lstEquipmentsToAssociate);

            //Actualizar conteo y cargos fijos
            that.getCountFixed(that.lstEquipmentsToDisassociate, false);
           
            return;
         

            //Actualizar ambas listas
            if (that.lstEquipmentsToDisassociate.length == 0) {
                //var table = controls.tblProductTable.DataTable();
                var table = $('#tblCustomerAssociateEquiment').DataTable()
                table.rows().remove().draw();
            } else {
                //==>$('#tblCustomerAssociateEquiment')
                that.getDisassociateItem(that.lstEquipmentsToDisassociate);
            }

            //=>>$('#tblCustomerEquipmentSummary')
            that.getAssociateItem(that.lstEquipmentsToAssociate);

            //Actualizar conteo y cargos fijos
            that.getCountFixed(that.lstEquipmentsToAssociate);
        },

        fnGetNombreServicios: function (oldData) {

            var that = this,
               controls = that.getControls();

            var attNuevos = [];
                     

            /****************************************************************************************************************************
            OBTENEMOS AQUELLOS SERVICIOS ADICIONALES DEL CLIENTE QUE EXISTEN EN EL PLAN COMERCIAL DE OBTENER FIJA CAMPAÑAS DE PVU
                *** EXCLUIMOS A LOS QUE SON "CORE ADICIONAL" PORQUE ESTOS SERVICIOS NO SE PODRÍAN DESACTIVAR, YA QUE SON SERVICIOS
                    QUE VAN AMARRADOS A LOS SERVICIOS PRINCIPALES
            ****************************************************************************************************************************/
            $.each(that.transactionData.Data.AdditionalServices, function (idx, service) {
                var feed = [];
                //debugger;
                feed = that.additionalServicesSession.Data.AdditionalServices.filter(function (item) { return item.LineID == service.idServPvu && item.coreAdicional != "CORE ADICIONAL" });
                //feed = that.additionalServicesSession.Data.AdditionalServices.filter(function (item) { return item.LineID == service.LineID && item.coreAdicional != "CORE ADICIONAL" });
               // console.log('service.idServPvu --> ' + service.idServPvu + ' -- ' + 'service.idServPvuTobe --> ' + service.idServPvuTobe);
                feed = that.additionalServicesSession.Data.AdditionalServices.filter(function (item) {
                    return (item.LineID == service.idServPvu || item.LineID == service.idServPvuTobe) && item.coreAdicional != "CORE ADICIONAL"})
                            .map(function (item) {
                                return {
                                    CodeGroup : item.CodeGroup,
                                    FixedCharge: item.FixedCharge,
                                    Group: item.Group,
                                    LineID: Session.SessionParams.DATACUSTOMER.objPostDataAccount.plataformaAT === 'TOBE' ? service.idServPvu : item.LineID,//$.string.isEmptyOrNull(item.idServPvu)? item.LineID : item.idServPvu,//Baja de servicio -> Para As Is/Tobe enviar el campo idServPvu
                                    PlanCode: item.PlanCode,
                                    ServiceDescription: item.ServiceDescription,
                                    ServiceEquiptment: item.ServiceEquiptment,
                                    ServiceType: item.ServiceType,
                                    cantidad: item.cantidad,
                                    capacidad: item.capacidad,
                                    cargoFijoPromocion: item.cargoFijoPromocion,
                                    check: item.check,
                                    coSer: item.coSer,
                                    codigoExterno: item.codigoExterno,
                                    codigoTipEqu: item.codigoTipEqu,
                                    coreAdicional: item.coreAdicional,
                                    descEquipo: item.descEquipo,
                                    descExterno: item.descExterno,
                                    grupoPadre: item.grupoPadre,
                                    idDet: item.idDet,
                                    idEquipo: item.idEquipo,
                                    idProductoCBIO: item.idProductoCBIO,
                                    poId: item.poId,
                                    poType: item.poType,
                                    pop1: item.pop1,
                                    pop2: item.pop2,
                                    sncode: item.sncode,
                                    spCode: item.spCode,
                                    tipEqu: item.tipEqu,
                                    tipoEquipo: item.tipoEquipo,
                                    unidadCapacidad: item.unidadCapacidad,
                                    idServPvuTobe: service.idServPvuTobe,
                                    familia: item.familia,
                                }
                            }); 
                attNuevos = attNuevos.concat(feed);
            });

            debugger;
            that.transactionData.Data.AdditionalServices = [];
            that.transactionData.Data.AdditionalServices = attNuevos;


            /****************************************************************************************************************************
            QUITAMOS LOS SERIVIOS QUE YA TIENE EL CLIENTE VS LOS SERVICIOS DEL PLAN COMERCIAL 
           ****************************************************************************************************************************/
            var ServiciosAdiPlanComercial = [];
            var nuevosServiciosAdiPlanComercial = [];
            debugger;
            var AdiServices = that.additionalServicesSession.Data.AdditionalServices
               .filter(function (item) {
                   return item.coreAdicional == 'ADICIONAL' &&
                       item.ServiceEquiptment == 'SERVICIO'
               });

            that.generarActualizacionServicios(that.transactionData.Data.AdditionalServices,  AdiServices, false);
            that.lstServiciosDesactivarPreCarga;
            that.lstServiciosActivarPreCarga;
            that.additionalServicesSession.Data.AdditionalServices = that.lstServiciosActivarPreCarga;;
             

        },

        btnRemove_click: function () {
            var that = this, controls = that.getControls();
            debugger;
            var datosParaDesAsociar = that.lstEquipmentsToDisassociate.filter(function (el, idx) { return el.check }); //   that.lstEquipmentsToAssociate2.filter(function (el, idx) { return el.check });
            that.lstEquipmentsToAssociate = that.lstEquipmentsToAssociate.concat(datosParaDesAsociar);

            that.lstEquipmentsToAssociate2 = that.lstEquipmentsToDisassociate.filter(function (el, idx) { return el.check != true }); //that.lstEquipmentsToAssociate2.filter(function (el, idx) { return el.check != true });

            if (that.lstEquipmentsToAssociate2.length == 0) {
                var table = $('#tblCustomerEquipmentSummary').DataTable()
                table.rows().remove().draw();
            };
          
            that.lstEquipmentsToDisassociate = that.lstEquipmentsToAssociate2;
            $.each(that.lstEquipmentsToDisassociate, function (idx, service) {
                that.lstEquipmentsToDisassociate[idx]["check"] = false;
            });

            $.each(that.lstEquipmentsToAssociate, function (idx, service) {
                that.lstEquipmentsToAssociate[idx]["check"] = false;
            });

            that.jsonOrderMatriz();
            that.getAssociateItem(that.lstEquipmentsToDisassociate);
            that.getDisassociateItem(that.lstEquipmentsToAssociate);

          
            //Actualizar conteo y cargos fijos
            that.getCountFixed(that.lstEquipmentsToDisassociate, false);

            return;



            that.jsonOrderMatriz();

            if (that.lstEquipmentsToAssociate.length == 0) {
                //var table = controls.tblProductsSummary.DataTable();
                var table = $('#tblCustomerEquipmentSummary').DataTable()
                table.rows().remove().draw();
            } else {
                that.getAssociateItem(that.lstEquipmentsToAssociate);
            }
            that.getDisassociateItem(that.lstEquipmentsToDisassociate);

            that.getCountFixed(that.lstEquipmentsToAssociate);
        },

        getJSONProgramacionTarea: function(){
        
        },

        getCountFixed: function (dataAgregados, opcCargaInicial) {
            var that = this;

            that.generarActualizacionServicios(that.lstEquipmentsToDisassociateInit, that.lstEquipmentsToAssociate2, true);
       

            var that = this, controls = that.getControls();
            //Conteo de servicios agregados y desactivados
            var conteoDesactivos = 0;
            var conteoAgregados = 0;
            for (var i = 0; i < that.lstServiciosActivar.length; i++) {
                if (0 == 0) {
                    //if (dataAgregados[i].intServicioActivado == 0) {
                    conteoAgregados += 1;
                }
            }
            //  that.lstServiciosDesactivar;  that.lstServiciosActivar;
            controls.spServiciosAgregados.empty().text(conteoAgregados);

            for (var i = 0; i < that.lstServiciosDesactivar.length; i++) {
                if (1 == 1) {
                    //if (that.lstEquipmentsToDisassociate[i].intServicioActivado == 1) {
                    conteoDesactivos += 1;
                }
            }

       ///ESTO ES PARA CUANDO CARGUE LA GRILLA NO MUESTRE QUE  HAY DESACTIVADOS, ESTO EMPIEZA DESPUES QUE EL USUARIO EMPIEZA A MANIPULAR LA GRILLA
            if (opcCargaInicial) {
                controls.spServiciosDesactivados.empty().text(0);
            }
            else {
                controls.spServiciosDesactivados.empty().text(conteoDesactivos);
            }
           



            dataAgregados =  that.lstServiciosActivar
            var cargoFijo = 0;
            var cargoPromocion = 0;
            for (var i = 0; i < dataAgregados.length; i++) {
                cargoFijo += parseFloat( dataAgregados[i].FixedCharge,2);
                cargoPromocion += parseFloat(dataAgregados[i].cargoFijoPromocion, 2);
            }
            var restaCargos = cargoFijo - cargoPromocion;
            cargoFijo = that.getRound(cargoFijo);
            //cargoPromocion = that.getRound(restaCargos);
 
            //Cargos fijos regular y promocional
            controls.spCostoFijoRegular.empty().text('S/ ' + cargoFijo);
            controls.spCostoFijoPromocional.empty().text('S/ ' + cargoPromocion);
            
               
           

        },

        getRound: function (num) {
            var decimales = 2;
            var signo = (num >= 0 ? 1 : -1);
            num = num * signo;
            if (decimales === 0) //con 0 decimales
                return signo * Math.round(num);
            // round(x * 10 ^ decimales)
            num = num.toString().split('e');
            num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimales) : decimales)));
            // x * 10 ^ (-decimales)
            num = num.toString().split('e');
            return signo * (num[0] + 'e' + (num[1] ? (+num[1] - decimales) : -decimales));
        },

        getDisassociateItem: function (data) {
            var that = this, controls = that.getControls();
            //var table = controls.tblProductTable.DataTable();
            var table = $('#tblCustomerAssociateEquiment').DataTable();
            table.clear();
            for (var i = 0; i < data.length; i++) {
                table.row.add(data[i]).draw();
            }
        },

        getAssociateItem: function (data) {
            var that = this, controls = that.getControls();
            //var table = controls.tblProductsSummary.DataTable();
            var table = $('#tblCustomerEquipmentSummary').DataTable();
            table.clear();
            for (var i = 0; i < data.length; i++) {
                table.row.add(data[i]).draw();
            }
        },

       
        fillListEquipmentsToDisassociate: function (data) {
            var that = this,
                controls = that.getControls();
            for (var j = 0; j < data.length; j++) {
                that.lstEquipmentsToDisassociate.push(data[j]);
                that.lstEquipmentsToDisassociateInit.push(data[j]);
            }
        },

        fillListEquipmentsToAssociate: function (data) {
            var that = this,
                controls = that.getControls();
            for (var j = 0; j < data.length; j++) {
                that.lstEquipmentsToAssociate.push(data[j]);
                that.lstEquipmentsToAssociateInit.push(data[j]);
            }
        },

        chPrograma_click: function () {
            var that = this,
                controls = that.getControls();

            if (controls.chPrograma.prop('checked')) {
                controls.dvPrograma.show();
            } else {
                controls.dvPrograma.hide();
            }
        },

        ddlTimeZone_Click: function () {
            var that = this,
                controls = that.getControls();
             

            controls.ddlTimeZone.closest('.form-control').removeClass('has-error');
            controls.timeZoneErrorMessage.text('');
        },

     

        getLoadingPage: function () {
            var strUrlLogo = window.location.protocol + '//' + window.location.host + '/Content/images/SUFija/loading_Claro.gif';
            $.blockUI({
                message: '<div align="center"><img src="' + strUrlLogo + '" width="25" height="25" /> Cargando ... </div>',
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    opacity: .5,
                    color: '#fff',
                }
            });
        },
       
       
        getHoraActual: function () {
            var that = this;
            var d = new Date();
            var HoraActual = that.AboveZero(d.getHours()) + ":" + (that.AboveZero(d.getMinutes() + 1)) + ":" + d.getSeconds();
            return HoraActual;
        },
         
        Constancy_Generate: function () {
          
            var params = ['height=600',
                'width=750',
                'resizable=yes',
                'location=yes'
            ].join(',');

            var strIdSession = Session.UrlParams.IdSession;
            window.open('/AdditionalServices/Home/ShowRecordSharedFile' + "?&strIdSession=" + strIdSession, "_blank", params);
        },
        stopCountDown: false,

        fnCheckTipoConsumidor: function(){
            var that = this;
            return    that.transactionData.Data.CustomerInformation.CustomerType == that.transactionData.Configuration.Constants.Constantes_Consumer ? true : false;
        },
        
        getListaTipificacionTransversal: function () {
            
            var that = this, controls = this.getControls();

            $.each(that.lstServiciosActivar, function (idx, service) {
                that.lstServiciosActivar[idx]["Type"] = "A";
            });
            $.each(that.lstServiciosDesactivar, function (idx, service) {
                that.lstServiciosDesactivar[idx]["Type"] = "D";
            });

            var resutl = that.lstServiciosDesactivar;
            resutl = resutl.concat(that.lstServiciosActivar);



            var xjsonTrama = {
                "listaTrama": []
            };
            
           
            
            $.each(resutl, function (idx, service) {
                
                /*
                "codInter" : "168067",
		        "serv" : "Internet 7000Kbps - Pack",
		        "tipServ" : "CORE ADICIONAL",
		        "grupServ" : "CLARO TV DIGITAL",
		        "cf" : "61",
		        "equipo" : "DECO REGULAR",
		        "cantidad" : "2"
                */
                
                var x = {
                    "codInter": "@idInteraccion",
                    "serv": service.ServiceDescription, 
                    "tipServ": service.coreAdicional,
                    "grupServ": "",
                    "cf": "",
                    "equipo": service.ServiceEquiptment,
                    "cantidad" : "1"
                };

                xjsonTrama.listaTrama.push(x);
                
            });

            return xjsonTrama.listaTrama;
            
        },

        getServiciosTransversal: function () {
            
            var that = this, controls = this.getControls();

            $.each(that.lstServiciosActivar, function (idx, service) {
                that.lstServiciosActivar[idx]["Type"] = "A";
            });
            $.each(that.lstServiciosDesactivar, function (idx, service) {
                that.lstServiciosDesactivar[idx]["Type"] = "D";
            });

            var resutl = that.lstServiciosDesactivar;
            resutl = resutl.concat(that.lstServiciosActivar);



            var xjsonTrama = {
                "listaTrama": []
            };
            
           
            
            $.each(resutl, function (idx, service) {

               var x = {
                   //"cod": service.Type == "A" ? "14" : "15", 
                   "cod": service.Type == "A" ? that.transactionData.Configuration.Constants.Programacion_TipoCodAlta : that.transactionData.Configuration.Constants.Programacion_TipoCodBaja,
                    "msisdn": "",
                    "fecprog":  ($("#chPrograma").prop("checked") ? controls.txtCalendar.val() : that.getFechaActual()), 
                    "codid_pri": that.transactionData.Data.CustomerInformation.ContractNumber,
                    "customerid_pri": that.transactionData.Data.CustomerInformation.CustomerID,
                    "id_eai_sw": that.transactionData.Data.AuditRequest.Transaction,
                    "tipo_servicio": that.transactionData.Configuration.Constants.Constantes_Producto,
                    //"coser": service.coSer, //service.LineID,
                    "coser": Session.SessionParams.DATACUSTOMER.objPostDataAccount.plataformaAT === 'TOBE' ? service.LineID: service.coSer , //that.transactionData.Data.idTransactionFront == '5' ? service.coSer : service.LineID,//ContratoPublico-TOBE
                    "tipo_reg": service.Type,
                    "usuario_sis": that.transactionData.Configuration.Constants.Constantes_UsrAplicacionSIAPOST , // that.transactionData.Configuration.Constants.Constantes_UsrAplicacion,
                    "usuario_app": Session.SessionParams.USERACCESS.login,
                    "email_usuario_app": "",
                    "estado": "1", //that.transactionData.Data.Configuration.Programacion_CodigoEstado,
                    "esbatch": that.transactionData.Data.AuditRequest.Transaction,
                    "xmlentrada": that.getXMLTareaProgramadaActivarDesactivar(service),
                    "desc_co_ser": service.ServiceDescription,
                    "codigo_interaccion": '@idInteraccion',
                    "nrocuenta": Session.SessionParams.DATACUSTOMER.Account,
                    "cod_error": "",
                    "msj_error": ""
                };

               xjsonTrama.listaTrama.push(x);
                
            });

            return xjsonTrama.listaTrama;
            
        },

        getXMLTareaProgramadaActivarDesactivar: function (model){
       
            var strXml;
            var that = this, controls = this.getControls();
            var tipoTrabajo = model.Type == "A" ? that.transactionData.Configuration.Constants.Programacion_TipoTrabajoAlta : that.transactionData.Configuration.Constants.Programacion_TipoTrabajoBaja;
            var igv = "1." + that.transactionData.Data.Configuration.Constantes_Igv;
            var FixedChargeWithOutIgv = parseFloat(model.FixedCharge) / parseFloat(igv); //Sobre base 118 para multiplicarlo en SGA.

            strXml = model.Type == "A" ? "<activarServiciosAdicionalesRequest>" : "<desactivarServiciosAdicionalesRequest>";
            strXml += "<idTransaccion>" + that.transactionData.Data.AuditRequest.Transaction + "</idTransaccion>";
            strXml += "<codigoAplicacion>" + that.transactionData.Configuration.Constants.Programacion_Aplicacion + "</codigoAplicacion>";
            strXml += "<ipAplicacion>" + that.transactionData.Data.AuditRequest.IPAddress + "</ipAplicacion>";
            strXml += "<fechaProgramacion>" + ($("#chPrograma").prop("checked") ? controls.txtCalendar.val() : that.getFechaActual()) + "</fechaProgramacion>"; //
            strXml += "<fechaRegistro>" + that.getFechaActual() + "</fechaRegistro>";
            strXml += "<flagBusqueda>" + "0" + "</flagBusqueda>";

            if (model.Type == "D") {
                strXml += "<flagOccPenalidad>" + "0" + "</flagOccPenalidad>";
                strXml += "<penalidad>" + "0.0" + "</penalidad>";
                strXml += "<montoFidPenalidad>" + "0.0" + "</montoFidPenalidad>";
                strXml += "<nuevoCF>" + "0.0" + "</nuevoCF>";
                strXml += "<cicloFac>" + that.transactionData.Data.CustomerInformation.BillingCycle + "</cicloFac>";
                strXml += "<ticklerCode/>";
                strXml += "<usuario>" + Session.SessionParams.USERACCESS.login + "</usuario>";
                strXml += "<interaccion/>";
            }


            strXml += "<coId>" + that.transactionData.Data.CustomerInformation.ContractNumber + "</coId>";
            strXml += "<codCliente>" + that.transactionData.Data.CustomerInformation.CustomerID + "</codCliente>";
            strXml += "<usuario>" + Session.SessionParams.USERACCESS.login + "</usuario>";
            strXml += "<telReferencia>" + controls.txtReferencePhone.val() + "<telReferencia/>";
            strXml += "<tipoServicio>" + that.transactionData.Configuration.Constants.Constantes_Producto + "</tipoServicio>";
            strXml += "<coSer>" + model.coSer /*model.LineID*/ + "</coSer>";
            strXml += "<tipoRegistro>" + model.Type + "</tipoRegistro>";
            strXml += "<usuarioSistema>" + that.transactionData.Configuration.Constants.Constantes_UsrAplicacionSIAPOST + "</usuarioSistema>";
            strXml += "<usuarioApp>" + Session.SessionParams.USERACCESS.login + "</usuarioApp>";
            strXml += "<emailUsuarioApp/>";
            strXml += "<desCoSer>" + model.ServiceDescription + "</desCoSer>";
            strXml += "<codigoInteraccion/>";
            strXml += "<nroCuenta>" + Session.SessionParams.DATACUSTOMER.Account + "</nroCuenta>";
            strXml += "<costo>" + (Session.SessionParams.DATACUSTOMER.objPostDataAccount.plataformaAT === 'TOBE' ? parseFloat(model.FixedCharge).toFixed(2) : FixedChargeWithOutIgv.toFixed(2)) + "</costo>";
            strXml += "<tipTra>" + tipoTrabajo + "</tipTra>";
            strXml += "<flgReingenieria>" + "1" + "</flgReingenieria>";
            strXml += "<codMotot>" + that.transactionData.Configuration.Constants.Programacion_TipoMotivo + "</codMotot>";
                      
            if (model.ServiceType == "Cable") {
                strXml += "<datosReg>" + model.descExterno + "</datosReg>";
            }
            /**/
            strXml += "<sncode>" + model.sncode + "</sncode>";
            strXml += "<spcode>" + model.spCode + "</spcode>";
            strXml += "<dscequ>" + ($.string.isEmptyOrNull(model.descEquipo) ? '' : model.descEquipo) + "</dscequ>";
            strXml += "<usureg>" + Session.SessionParams.USERACCESS.login + "</usureg>";
            strXml += "<nodopostventa>" + 'Nodo ' + $("#spnNode").text() + "</nodopostventa>";
            strXml += "<platf_facturador>" + that.transactionData.Configuration.Constants.Plataforma_Facturador + "</platf_facturador>";
            strXml += "<poid>" + model.poId + "</poid>";
            strXml += "<potype>" + model.poType + "</potype>";
            strXml += "<idproductocbio>" + model.idProductoCBIO + "</idproductocbio>";
            strXml += "<pop1>" + model.pop1 + "</pop1>";
            strXml += "<pop2>" + model.pop2 + "</pop2>";
            /**/
            if (model.Type == "A" && model.cargoFijoPromocion != "0") {
                strXml += "<listaOpcionalRequest>";
                strXml += "<request>";
                strXml += "      <nombre>CPCODE</nombre>";
                strXml += "<valor>" + model.spCode + "</valor>";
                strXml += "</request>";
                strXml += "</listaOpcionalRequest>";
            }
                   
            strXml += model.Type == "A" ? "</activarServiciosAdicionalesRequest>" : "</desactivarServiciosAdicionalesRequest>";

            return strXml;

        },

        funcionServiciosContancia: function() {
            /*****************************************LOGICA PARA LA CONSTANCIA DE SERVICIOS ADICIONALES*************************************/
            var that = this, controls = this.getControls();
            var a = 0, b = 0, swith = "", conteoAct = 0, conteoDes = 0, label = "";
            $.each(that.lstServiciosActivar, function (idx, service) {
                a += parseFloat(service.FixedCharge);
                conteoAct += 1;
            });


            $.each(that.lstServiciosDesactivar, function (idx, service) {
                b += parseFloat(service.FixedCharge);
                conteoDes += 1;
            });

            swith = ((a > 0) && (b > 0)) ? "Activacion/Desactivacion" : ((a > 0) && (b == 0)) ? "Activacion" : "Desactivacion";

            if ((swith == "Activacion") && (conteoAct == 1)) {
                label = that.lstServiciosActivar[0].ServiceDescription;
            }
            else if ((swith == "Desactivacion") && (conteoDes == 1)) {
                label = that.lstServiciosDesactivar[0].ServiceDescription;
            }
            else {
                label = "Varios Servicios";
            }

            return { servicioName: label, Action: swith }
            /*************************FIN DE LOGICA******************************************/
        },



        getXMLTramaConstancia: function () {

            var that = this,
                controls = that.getControls();

            var r = that.funcionServiciosContancia();
            var xml = ""; 
            xml += "<FORMATO_TRANSACCION>{0}</FORMATO_TRANSACCION>";
            xml += "<NRO_SERVICIO>{1}</NRO_SERVICIO>";
            xml += "<TITULAR_CLIENTE>{2}</TITULAR_CLIENTE>";
            xml += "<CENTRO_ATENCION_AREA>{3}</CENTRO_ATENCION_AREA>"; //179 linea
            xml += "<TIPO_DOC_IDENTIDAD>{4}</TIPO_DOC_IDENTIDAD>";//180 
            xml += "<NRO_DOC_IDENTIDAD>{5}</NRO_DOC_IDENTIDAD>";//181
            xml += "<FECHA_TRANSACCION_PROGRAM>{6}</FECHA_TRANSACCION_PROGRAM>";//182
            xml += "<CASO_INTER>{7}</CASO_INTER>";//183
            xml += "<REPRES_LEGAL>{8}</REPRES_LEGAL>";//184 
            xml += "<FECHA_EJECUCION>{9}</FECHA_EJECUCION>";//191 
            xml += "<APLICA_PROGRAMACION>{10}</APLICA_PROGRAMACION>";//204
            xml += "<ACCION_RETENCION>{11}</ACCION_RETENCION>"; //226
            xml += "<IGV_TAX>{12}</IGV_TAX>";//243
            xml += "<COSTO_TRANSACCION>{13}</COSTO_TRANSACCION>"; //248
            xml += "<EMAIL>{14}</EMAIL>";//195
            xml += "<FECHA_AUTORIZACION>{15}</FECHA_AUTORIZACION>";//275
            xml += "<ACCION_EJECUTAR>{16}</ACCION_EJECUTAR>";//277
            xml += "<ENVIO_CORREO>{17}</ENVIO_CORREO>";//283
            xml += "<FECHA_TRANSACCION>{18}</FECHA_TRANSACCION>";//290
            xml += "<CARGO_FIJO_CON_IGV>{19}</CARGO_FIJO_CON_IGV>";//350
            xml += "<TIPO_TRANSACCION>{20}</TIPO_TRANSACCION>";//362
            xml += "<CONTRATO>{21}</CONTRATO>";//284
            xml += "<SERV_COMERCIAL>{22}</SERV_COMERCIAL>";//369
            xml += "<ACCION_EJECUTADA>{23}</ACCION_EJECUTADA>";//371
            xml += "<CARGO_FIJO>{24}</CARGO_FIJO>";///esto es el estado/A/D //374
            xml += "<CONTENIDO_COMERCIAL>{25}</CONTENIDO_COMERCIAL>";
            xml += "<CONTENIDO_COMERCIAL2>{26}</CONTENIDO_COMERCIAL2>";
            xml += "<CORREO_AUTORIZADO>{27}</CORREO_AUTORIZADO>";//408
            xml += "<PROGRAMADO>{28}</PROGRAMADO>";//373

            xml = string.format(xml,
                                that.transactionData.Configuration.Constants.Constancia_FormatoTransaccion,
                                $("#spCostoFijoRegular").text(),
                                that.transactionData.Data.CustomerInformation.CustomerName,
                                $("#ddlCenterofAttention option:selected").html(),
                                Session.SessionParams.DATACUSTOMER.DocumentType.toUpperCase(),
                                that.fnCheckTipoConsumidor() ? that.transactionData.Data.CustomerInformation.DocumentNumber : Session.SessionParams.DATACUSTOMER.DNIRUC,
                                controls.txtCalendar.val() == "" ? that.getFechaActual() : controls.txtCalendar.val(),
                                "@idInteraccion",
                                that.transactionData.Data.CustomerInformation.LegalRepresentative == null ? "" : that.transactionData.Data.CustomerInformation.LegalRepresentative,
                                $("#chPrograma").prop("checked") ? controls.txtCalendar.val() : "",
                                $("#chPrograma").prop("checked") ? "SI" : "NO",
                                r.Action, //"Activación",
                                "0.18",
                                "0.00",
                                $("#chkEmail").prop("checked") ? controls.mailText.val() : "",
                                controls.txtCalendar.val() == "" ? that.getFechaActual() : controls.txtCalendar.val(),
                                that.transactionData.Configuration.Constants.Constancia_AccionEjecutar,
                                $("#chkEmail").prop("checked") ? "SI" : "NO",
                                that.getFechaActual(),
                                $("#spCostoFijoRegular").text(), //controls.txtNote.val(),
                                that.transactionData.Configuration.Constants.Constancia_TipoTransaccion,
                                that.transactionData.Data.CustomerInformation.ContractNumber,
                                r.servicioName, //"DES_CO_SER_SELECCIONADO",
                                r.Action, //"Activación",
                                $("#spCostoFijoRegular").text(),
                                that.transactionData.Configuration.Constants.Constancia_ContenidoComercial,
                                that.transactionData.Configuration.Constants.Constancia_ContenidoComercial2,
                                $("#chkEmail").prop("checked") ? "SI" : "NO",
                                $("#chPrograma").prop("checked") ? "SI" : "NO"
                                );

            return "<PLANTILLA>" + xml + "</PLANTILLA>";

        },
       


        Save_click: function () {
            var that = this;
            confirm("¿Esta seguro de guardar los cambios?", null, function () {
                // that.getLoadingPage();
                that.stopCountDown = true;
                $('#countdown').css('display', 'none');

                that.GuardarDatos();
            });
        },

        ///####################################Transversal####################################///
        GuardarDatos: function () {
            var that = this,
                controls = that.getControls();

         

            //that.getServiciosTransversal();

            that.getLoadingPage();
             
            var r = that.funcionServiciosContancia();


            var servicios = [
                {
                    "servicio": "Cliente",
                    "parametros": [
                        {
                            "parametro": "phone",
                            "valor": that.transactionData.Configuration.Constants.Tipificacion_KeyCustomerInteract + that.transactionData.Data.CustomerInformation.CustomerID
                        },
                        {
                            "parametro": "usuario",
                            "valor": Session.SessionParams.USERACCESS.login
                        },
                        {
                            "parametro": "nombres",
                            "valor": that.transactionData.Data.CustomerInformation.CustomerName
                        },
                        {
                            "parametro": "apellidos",
                            "valor": that.transactionData.Data.CustomerInformation.CustomerName
                        },
                        {
                            "parametro": "razonsocial",
                            "valor": that.transactionData.Data.CustomerInformation.LegalRepresentative
                        },
                        {
                            "parametro": "tipoDoc",
                            "valor": that.transactionData.Data.CustomerInformation.LegalRepresentativeDocument
                        },
                        {
                            "parametro": "numDoc",
                            "valor": that.transactionData.Data.CustomerInformation.DocumentNumber
                        },
                        {
                            "parametro": "domicilio",
                            "valor": that.transactionData.Data.Instalacion.Direccion//that.transactionData.Data.Instalation.Direccion
                        },
                        {
                            "parametro": "distrito",
                            "valor": that.transactionData.Data.CustomerInformation.BillingDistrict
                        },
                        {
                            "parametro": "departamento",
                            "valor": that.transactionData.Data.CustomerInformation.BillingDepartament
                        },
                        {
                            "parametro": "provincia",
                            "valor": that.transactionData.Data.CustomerInformation.BillingProvince
                        },
                        {
                            "parametro": "modalidad",
                            "valor": that.transactionData.Configuration.Constants.Tipificacion_Modalidad
                        }
                    ]
                },
                {
                    "servicio": "Tipificacion",
                    "parametros": [
                        {
                            "parametro": "coid",
                            "valor": that.transactionData.Data.CustomerInformation.ContractNumber
                        },
                        {
                            "parametro": "customer_id",
                            "valor": that.transactionData.Data.CustomerInformation.CustomerID
                        },
                        {
                            "parametro": "Phone",
                            "valor": that.transactionData.Configuration.Constants.Tipificacion_KeyCustomerInteract + that.transactionData.Data.CustomerInformation.CustomerID
                        },
                        {
                            "parametro": "flagReg",
                            "valor": that.transactionData.Configuration.Constants.Tipificacion_FlagReg
                        },
                        {
                            "parametro": "contingenciaClarify",
                            "valor": that.transactionData.Configuration.Constants.Tipificacion_ContingenciaClarify
                        },
                        {
                            "parametro": "tipo",
                            "valor": that.transactionData.Data.Tipificacion[0].Tipo  //that.transactionData.Configuration.Constants.Tipo
                        },
                        {
                            "parametro": "clase",
                            "valor": that.transactionData.Data.Tipificacion[0].Clase //that.transactionData.Configuration.Constants.Clase
                        },
                        {
                            "parametro": "SubClase",
                            "valor": that.transactionData.Data.Tipificacion[0].SubClase //that.transactionData.Configuration.Constants.SubClase
                        },
                        {
                            "parametro": "metodoContacto",
                            "valor": that.transactionData.Configuration.Constants.Tipificacion_MetodoContacto
                        },
                        {
                            "parametro": "tipoTipificacion",
                            "valor": that.transactionData.Configuration.Constants.Tipificacion_TipoTipificacion
                        },
                        {
                            "parametro": "agente",
                            "valor": Session.SessionParams.USERACCESS.login
                        },
                        {
                            "parametro": "usrProceso",
                            "valor": that.transactionData.Configuration.Constants.Constantes_UsrAplicacion//that.transactionData.Configuration.Constants.USRAPLICACION
                        },
                        {
                            "parametro": "hechoEnUno",
                            "valor": that.transactionData.Configuration.Constants.Tipificacion_HechoDeUno
                        },
                        {
                            "parametro": "Notas",
                            "valor": $.string.isEmptyOrNull(controls.txtNote.val()) ? '-' : controls.txtNote.val().replace(/\t/g, " ").replace(/\n/g, "\\n")
                        },
                        {
                            "parametro": "flagCaso",
                            "valor": that.transactionData.Configuration.Constants.Tipificacion_FlagCaso
                        },
                        {
                            "parametro": "resultado",
                            "valor": that.transactionData.Configuration.Constants.Tipificacion_Resultado
                        },
                        {
                            "parametro": "tipoInter",
                            "valor": that.transactionData.Configuration.Constants.Tipificacion_TipoInter
                        }
                    ]
                },
                {
                    "servicio": "Plantilla",
                    "parametros": [
                        {
                            "parametro": "nroIteraccion",
                            "valor": ""
                        },

                         {
                             "parametro": "CLARONUMBER", //"P_CLARO_NUMBER",
                             "valor": that.transactionData.Data.CustomerInformation.PhoneNumber01
                         },

                         {
                             "parametro": "FIRSTNAME" ,// "P_FIRST_NAME",
                             "valor": that.transactionData.Data.CustomerInformation.CustomerName
                         },

                         {
                             "parametro": "LASTNAME", //"P_LAST_NAME",
                             "valor": that.transactionData.Data.CustomerInformation.CustomerName
                         },
                         {
                             "parametro": "DOCUMENTNUMBER", // "P_DOCUMENT_NUMBER",
                             "valor": that.transactionData.Data.CustomerInformation.DocumentNumber
                         },
                        {
                            "parametro": "REFERENCEPHONE", //"P_REFERENCE_PHONE",
                            "valor": controls.txtReferencePhone.val()
                        },
                         {
                             "parametro": "REASON", //"P_REASON",
                             "valor": Session.SessionParams.DATACUSTOMER.BusinessName 
                         },
                        {
                            "parametro": "xinter1",
                            "valor": Session.SessionParams.DATACUSTOMER.CustomerContact//.ContractNumber//cambiar por strContactClient en session.datacustomer
                        },
                        {
                            "parametro": "xinter2",
                            "valor": that.transactionData.Data.CustomerInformation.DocumentNumber
                        },
                        {
                            "parametro": "xinter3",
                            "valor": controls.spCostoFijoRegular.text().replace("S/", "")//""
                        },
                        {
                            "parametro": "inter4",
                            "valor": r.servicioName, //"dscCoser" //strHdnDesCoSerSel
                        },
                        {
                            "parametro": "inter5",
                            "valor": "costoBSCS"// ==>SIACU_POST_BSCS_SP_LISTAR_SERVICIOS_TELEFONO
                        },
                        {
                            "parametro": "inter6",
                            "valor": Session.SessionParams.DATACUSTOMER.BillingCycle
                        },
                        {
                            "parametro": "IMEI",
                            "valor": that.lstServiciosActivar.length == 0 ? 'D':'A'
                        },
                        {
                            "parametro": "inter7",
                            "valor": Session.SessionParams.DATASERVICE.Plan
                        },
                        {
                            "parametro": "inter15",
                            "valor": $("#ddlCenterofAttention option:selected").html()
                        },
                        {
                            "parametro": "inter19",
                            "valor": ""
                        },
                        {
                            "parametro": "inter20",
                            "valor": "strHdnCargoFijoSel"  
                        },

                        {
                            "parametro": "inter21",
                            "valor": "CO_SER" //COD.SERVICIO
                        },
                        {
                            "parametro": "inter29",
                            "valor": r.servicioName//"dscCoser"
                        },
                        {
                            "parametro": "inter30",
                            "valor": $.string.isEmptyOrNull(controls.txtNote.val()) ? '-' : controls.txtNote.val().replace(/\t/g, " ").replace(/\n/g, "\\n")
                        },
                        {
                            "parametro": "inter25",
                            "valor": parseFloat(( parseInt(Session.SessionParams.DATACUSTOMER.BillingCycle)).toFixed(2))
                        },
                       {
                           "parametro": "OPERATIONTYPE", //"P_OPERATION_TYPE",
                           "valor": ""//TipoTransaccion(A/D)
                       },
                        
                        {
                            "parametro": "ADJUSTMENTREASON", // "P_ADJUSTMENT_REASON",
                            "valor": that.transactionData.Data.CustomerInformation.ContractNumber
                        },
                        {
                            "parametro": "inter8",
                            "valor":parseFloat(( parseInt(that.transactionData.Data.CustomerInformation.CustomerID).toFixed(2)))
                        },
                        {
                            "parametro": "TYPEDOCUMENT", // "P_TYPE_DOCUMENT",
                            "valor": that.transactionData.Data.CustomerInformation.CustomerType
                        },
                         {
                             "parametro": "LASTNAMEREP", // "P_LASTNAME_REP",
                             "valor": Session.SessionParams.DATACUSTOMER.DocumentType.toUpperCase()
                         },
                         {
                             "parametro": "inter16",
                             "valor": that.fnCheckTipoConsumidor() ? Session.SessionParams.DATACUSTOMER.FullName :  ""
                         },
                          {
                              "parametro": "NAMELEGALREP", // "P_NAME_LEGAL_REP",
                              "valor": that.fnCheckTipoConsumidor() ? Session.SessionParams.DATACUSTOMER.FullName : (that.transactionData.Data.CustomerInformation.LegalRepresentative == null || that.transactionData.Data.CustomerInformation.LegalRepresentative == "") ? Session.SessionParams.DATACUSTOMER.FullName : that.transactionData.Data.CustomerInformation.LegalRepresentative
                          },
                        {
                            "parametro": "OLDLASTNAME", // "P_OLD_LAST_NAME",
                            "valor": that.fnCheckTipoConsumidor() ? that.transactionData.Data.CustomerInformation.DocumentNumber  : Session.SessionParams.DATACUSTOMER.DNIRUC
                        },
                         {
                             "parametro": "CLAROLOCAL4", // "P_CLAROLOCAL4",
                             "valor": $("#chkEmail").prop("checked") ? "SI" : "NO"
                         },
                         {
                             "parametro": "EMAIL", // "P_EMAIL",
                             "valor": $("#chkEmail").prop("checked") ? controls.mailText.val() : ""
                         },
                          {
                              "parametro": "CLAROLOCAL5", // "P_CLAROLOCAL5",
                              "valor": $("#chPrograma").prop("checked") ? "SI" : "NO"
                          },
                          {
                              "parametro": "CLAROLOCAL6", // "P_CLAROLOCAL6",
                              "valor": $("#chPrograma").prop("checked") ? controls.txtCalendar.val() : that.getFechaActual()
                          },
                    ]
                },
                
                
                {
                    "servicio": "RegistroServicioTipificacion",
                    "parametros": [

                        {
                            "parametro": "listaServicio",
                            "valor": JSON.stringify(that.getListaTipificacionTransversal())
                        },


                    ]
                },



                


                {
                    "servicio": "TareasPogramadas",
                    "parametros": [

                        {
                            "parametro": "listaRegistro",
                            "valor":JSON.stringify (  that.getServiciosTransversal())
                        },


                    ]
                },


                
                {
                    "servicio": "Constancia",
                    "parametros": [

                        {
                            "parametro": "DRIVE_CONSTANCIA",
                            "valor": that.getXMLTramaConstancia()
                        },


                    ]
                },
                {
                    "servicio": "Correo",
                    "parametros": [
                        {
                            "parametro": "remitente",
                            "valor": that.transactionData.Configuration.Constants.Correo_remitente
                        },
                        {
                            "parametro": "destinatario",
                            "valor": controls.mailText.val()
                        },
                        {
                            "parametro": "asunto",
                            "valor": that.transactionData.Configuration.Constants.Correo_asunto
                        },
                        {
                            "parametro": "htmlFlag",
                            "valor": that.transactionData.Configuration.Constants.Correo_htmlFlag
                        },
                        {
                            "parametro": "driver/fileName",
                            "valor": that.transactionData.Configuration.Constants.Correo_driver
                        },
                        {
                            "parametro": "formatoConstancia",
                            "valor": that.transactionData.Configuration.Constants.Correo_formatoConstancia
                        },
                        {
                            "parametro": "directory",
                            "valor": that.transactionData.Configuration.Constants.Correo_directory
                        },
                        {
                            "parametro": "fileName",
                            "valor": "@idInteraccion_@p_fecha_" + that.transactionData.Configuration.Constants.Correo_fileName + "@extension" //that.transactionData.Configuration.Constants.Constantes_fileName
                        },
                        //that.transactionData.Configuration.Constants.fileName 
                        {
                            "parametro": "p_fecha",
                            "valor": "dd_MM_yyyy"
                        },
                        {
                            "parametro": "mensaje",
                            "valor": that.transactionData.Configuration.Constants.Correo_mensaje
                        },
                    ]
                },
                {
                    "servicio": "Auditoria",
                    "parametros": [
                        {
                            "parametro": "ipcliente",
                            "valor": that.transactionData.Data.AuditRequest.idApplication// "172.19.91.216" //System.Web.HttpContext.Current.Request.UserHostAddress;
                        },
                        {
                            "parametro": "nombrecliente",
                            "valor": that.transactionData.Data.CustomerInformation.CustomerName
                        },
                        {
                            "parametro": "ipservidor",
                            "valor": that.transactionData.Data.AuditRequest.IPAddress// that.transactionData.Data.AuditRequest.IPAddress// "172.19.91.216" //audit.ipAddress,
                        },
                        {
                            "parametro": "nombreservidor",
                            "valor": that.transactionData.Data.AuditRequest.ApplicationName // that.transactionData.Data.AuditRequest.ApplicationName//"SIAC_UNICO" //audit.applicationName
                        },
                        {
                            "parametro": "cuentausuario",
                            "valor": Session.SessionParams.USERACCESS.login
                        },
                        {
                            "parametro": "monto",
                            "valor": that.transactionData.Configuration.Constants.Constantes_Monto //that.transactionData.Configuration.Constants.Monto
                        },
                        {
                            "parametro": "texto",
                            "valor": string.format("/Ip Cliente: {0}/Usuario:  {1}/Opcion: {2}/Fecha y Hora: {3} {4}", that.transactionData.Data.AuditRequest.idApplication, Session.SessionParams.USERACCESS.login, "Activacion Desactivacion Servicios Adicionales", that.getFechaActual(), that.getHoraActual())//"15/10/2020 19:03:21")
                        },
                        {
                            "parametro": "telefono",
                            "valor": that.transactionData.Data.CustomerInformation.CustomerID
                        },
                        {
                            "parametro": "TRANSACCION_DESCRIPCION",
                            "valor": that.transactionData.Configuration.Constants.Constancia_TransaccionDescripcion
                        }
                    ]
                },			 
				 {   "servicio": "Trazabilidad",
				    "parametros": [
					    {
					        "parametro": "tipoTransaccion",
					        "valor": that.transactionData.Configuration.Constants.Constancia_FormatoTransaccion
					    },
					    {
					        "parametro": "tarea",
					        "valor": "generaConstancia"
					    },
					    {
					        "parametro": "fechaRegistro",
					        "valor": that.getFechaActual()
					    },
					    {
					        "parametro": "descripcion",
					        "valor": "Trazabilidad generada desde SIACUNICO"
					    }
				    ]
                }
            ];


            var objLoadParameters = {};
            objLoadParameters.idFlujo = '';
            objLoadParameters.servicios = servicios;
            objLoadParameters.stridSession = Session.UrlParams.IdTransaction;
            objLoadParameters.TransactionID = that.transactionData.Data.idTransactionFront;
            debugger;
            var urlBase = '/AdditionalServices/Home/postGeneraTransaccion';
            $.app.ajax({
                type: 'POST',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(objLoadParameters),
                url: urlBase,
                success: function (response) {
                    debugger;
                    if (response != null) {
                        if (response.data != null && response.data.MessageResponse != null) {
                        if (response.succes) {

                                if ((response.data.MessageResponse.Body.codigoRespuesta = ! "0")) {
                                alert('No se pudo ejecutar la transacción. Informe o vuelva a intentar')
                            }
                            else {
                                    //var nroSot = response.data.MessageResponse.Body.numeroSOT;
                                    var idInteraccion = response.data.MessageResponse.Body.idInteraccion;
                                alert('La transacción se ha grabado satisfactoriamente.<br/>');
                                controls.btnConstancy.show();
                                controls.btnPrevStep.hide();
                                controls.btnSave.hide();
                            }
                        }
                        else {
                            alert('No se pudo ejecutar la transacción. Informe o vuelva a intentar')
                        }

                        sessionStorage.propertyIsEnumerable("dataFull");
                        sessionStorage.propertyIsEnumerable("dataResponse");
                        sessionStorage.propertyIsEnumerable("dataRequest");
                        sessionStorage.setItem("dataFull", JSON.stringify(response));
                        sessionStorage.setItem("dataResponse", JSON.stringify(response.response));
                        sessionStorage.setItem("dataRequest", JSON.stringify(response.request));
                        }
                        else {
                            alert('No se pudo ejecutar la transacción. Informe o vuelva a intentar')
                        }
                    }
                    else {
                        alert('No se pudo ejecutar la transacción. Informe o vuelva a intentar')
                    }
                  
                    response = {};
                    $.unblockUI();
                }
            });
        },


    },
     

        $.fn.AdditionalServices = function () {
            var option = arguments[0],
                args = arguments,
                value,
                allowedMethods = [];

            this.each(function () {
                var $this = $(this),
                    data = $this.data('AdditionalServices'),
                    options = $.extend({}, $.fn.AdditionalServices.defaults,
                        $this.data(), typeof option === 'object' && option);

                if (!data) {
                    data = new Form($this, options);
                    $this.data('AdditionalServices', data);
                }

                if (typeof option === 'string') {
                    if ($.inArray(option, allowedMethods) < 0) {
                        throw "Unknown method: " + option;
                    }
                    value = data[option](args[1]);
                } else {
                    data.init();
                    if (args[1]) {
                        value = data[args[1]].apply(data, [].slice.call(args, 2));
                    }
                }
            });

            return value || this;
        };

    $.fn.AdditionalServices.defaults = {
    }

    $('#divIndex').AdditionalServices();

})(jQuery, null);