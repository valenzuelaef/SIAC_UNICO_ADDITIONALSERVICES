using Claro.SIACU.App.AdditionalServices.Areas.AdditionalServices.Models.DatosAdicionales;
using Claro.SIACU.App.AdditionalServices.Areas.AdditionalServices.Models.Transversal;
using Claro.SIACU.App.AdditionalServices.Areas.AdditionalServices.Utils;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Mvc;
using WEBCONFIG = System.Configuration.ConfigurationManager;


namespace Claro.SIACU.App.AdditionalServices.Areas.AdditionalServices.Controllers
{
    public class HomeController : Controller
    {

           


        static DatosAdicionalesResponse oDatosAdi = new DatosAdicionalesResponse();
        static string stridSession;
        PlanFijaServicio fixPlanesCoreService = new PlanFijaServicio();
        //static string strIpSession = Utils.Common.GetApplicationIp();
        static string strIpSession = "172.19.84.167";
        static byte[] databytesFile;
        //
        // GET: /AdditionalServices/Home/
        public ActionResult Index()
        {
            return PartialView();
        }

        public ActionResult CustomerData()
        {
            return PartialView();
        }
        
        public ActionResult RenderPartialView(string partialView)
        
        {
            return PartialView(partialView); // partialView == "Information" ? null : PartialView(partialView);
        }

        [HttpPost]
        public JsonResult Load()
        {
            return Json(new
            { 
                data = fixPlanesCoreService
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetInitialConfiguration(Models.InitialData.InitialDataBodyRequest oBodyRequest, string SessionID, string TransactionID)
        {

            Models.InitialData.InitialDataRequest oInitialDataRequest = new Models.InitialData.InitialDataRequest();
            Models.InitialData.AdditionalFixedDataRequest oDatosAdicionalesDataRequest = new Models.InitialData.AdditionalFixedDataRequest();
            Models.InitialData.InitialDataResponse oInitialDataResponse = new Models.InitialData.InitialDataResponse();
            Models.InitialData.AdditionalFixedDataResponse oAdditionalFixedDataResponse = new Models.InitialData.AdditionalFixedDataResponse();
            Tools.Entity.AuditRequest oAuditRequest = Utils.Common.CreateAuditRequest<Tools.Entity.AuditRequest>(SessionID);
            stridSession = SessionID;
            Dictionary<string, string> oConfiguraciones = new Dictionary<string, string>();
            //PlanFijaServicio fixPlanesCoreService = new PlanFijaServicio();
              fixPlanesCoreService = new PlanFijaServicio();
            DatosAdicionalesResponse oDatosAdiPaso01 = new DatosAdicionalesResponse();

 
            try
            {

                    string strUrl = WEBCONFIG.AppSettings["DPGetCargaDatosClienteFija"];
            oInitialDataRequest.Audit = oAuditRequest;
            oInitialDataRequest.MessageRequest = new Models.InitialData.InitialDataMessageRequest
            {
                Header = new Models.DataPower.HeaderReq
                {
                    HeaderRequest = new Models.DataPower.HeaderRequest
                    {
                        consumer = "SIACU",
                        country = "PE",
                        dispositivo = "MOVIL",
                        language = "ES",
                        modulo = "siacu",
                        msgType = "Request",
                        operation = "obtenerDatosInicial",
                        pid = DateTime.Now.ToString("yyyyMMddHHmmssfff"),
                        system = "SIACU",
                        timestamp = DateTime.Now.ToString("o"),
                        userId = Utils.Common.CurrentUser,
                        wsIp = strIpSession
                    }
                },
                        Body = new Models.InitialData.InitialDataBodyRequest
                        {
                            ContractID = oBodyRequest.ContractID,
                            CustomerID = oBodyRequest.CustomerID,
                            UserAccount = oBodyRequest.UserAccount,
                            codeRol = oBodyRequest.codeRol,
                            codeCac = oBodyRequest.codeCac,
                            state = oBodyRequest.state,
                            Type = oBodyRequest.Type,
                            flagConvivencia = ConfigurationManager.AppSettings["flagConvivenciaAsIsToBeReingFija"]
                        }
                    };

            Tools.Traces.Logging.Info(SessionID, oInitialDataRequest.Audit.Transaction, "Url: " + strUrl);
            Tools.Traces.Logging.Info(SessionID, oInitialDataRequest.Audit.Transaction, "Request: " + JsonConvert.SerializeObject(oInitialDataRequest));
            oInitialDataResponse = Utils.RestService.PostInvoque<Models.InitialData.InitialDataResponse>(strUrl, oInitialDataRequest.Audit, oInitialDataRequest, true);
            Tools.Traces.Logging.Info(SessionID, oInitialDataRequest.Audit.Transaction, "Response: " + JsonConvert.SerializeObject(oInitialDataResponse));

            oInitialDataResponse.MessageResponse.Body.PuntoAtencion.listaRegistros = oInitialDataResponse.MessageResponse.Body.PuntoAtencion.CodigoRespuesta == "0" ?
            oInitialDataResponse.MessageResponse.Body.PuntoAtencion.listaRegistros.OrderBy(x => x.nombre).ToList() : oInitialDataResponse.MessageResponse.Body.PuntoAtencion.listaRegistros;

                 

                #region "Datos adicionales"
                    this.GetDatosAdicionales(new DatosAdicionalesBodyRequest
                    {
                        IdTransaccion = TransactionID,
                        IdProceso = Tools.Utils.Constants.numeroUno.ToString(),
                        IdProducto = oInitialDataResponse.MessageResponse.Body.CoreServices.Technology,
                        FechaDesde = string.Empty,
                        FechaHasta = string.Empty,
                        Estado = string.Empty,
                        Asesor = string.Empty,
                        Cuenta = string.Empty,
                        TipoTransaccion = string.Empty,
                        CodIteraccion = string.Empty,
                        CadDac = string.Empty,
                        CoId = oBodyRequest.ContractID,
                        ContratoId = oBodyRequest.ContractID,
                        coIdPub = oBodyRequest.coIdPub,//ContratoPublico-TOBE
                        customerId = oBodyRequest.CustomerID
                    });

                if (oDatosAdi.MessageResponse.Body.servicios.configuracionesfija_obtenerConfiguraciones.ProductTransaction != null){
                    foreach (var item in oDatosAdi.MessageResponse.Body.servicios.configuracionesfija_obtenerConfiguraciones.ProductTransaction.ConfigurationAttributes.Where(x => x.AttributeType == "CONFIGURACIONES"))
                    {
                        oConfiguraciones[item.AttributeName + "_" + item.AttributeIdentifier] = item.AttributeValue;
                    }
                  }


                #endregion
            }
            catch (Exception ex)
            {
                Tools.Traces.Logging.Error(SessionID, oInitialDataRequest.Audit.Transaction, ex.Message);
                string sep = " - ";
                int posResponse = ex.Message.IndexOf(sep);
                string result = ex.Message.Substring(posResponse + sep.Length);
                oInitialDataResponse = JsonConvert.DeserializeObject<Models.InitialData.InitialDataResponse>(result);
            }

            return Json(new
            {
                oInitialDataResponse,
                oDatosAdi,
                oConfiguraciones,
                oAuditRequest
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetDatosAdicionales(DatosAdicionalesBodyRequest request )
        {
            string strUrl = WEBCONFIG.AppSettings["DPGetObtenerDatosAcionales"];
            DatosAdicionalesRequest oDatosAcicionalesDataRequest = new DatosAdicionalesRequest();
            DatosAdicionalesResponse oDatosAcicionalesDataResponse = new DatosAdicionalesResponse();

            Tools.Entity.AuditRequest oAuditRequest = Utils.Common.CreateAuditRequest<Tools.Entity.AuditRequest>(stridSession);

            oDatosAcicionalesDataRequest.Audit = oAuditRequest;

            oDatosAcicionalesDataRequest.MessageRequest = new DatosAdicionalesMessageRequest
            {
                Header = new Models.DataPower.HeaderReq
                {
                    HeaderRequest = new Models.DataPower.HeaderRequest
                    {
                        consumer = "TCRM",
                        country = "PERU",
                        dispositivo = "MOVIL",
                        language = "ES",
                        modulo = "OM",
                        msgType = "REQUEST",
                        operation = "obtenerDatosInicialAdicionales",
                        pid = DateTime.Now.ToString("yyyyMMddHHmmssfff"),
                        system = "SIACU",
                        timestamp = DateTime.Now.ToString("o"),
                        userId = Utils.Common.CurrentUser,
                        wsIp = strIpSession
                    }
                },
                Body = new DatosAdicionalesBodyRequest
                {
                    IdTransaccion = request.IdTransaccion,
                    IdProceso = request.IdProceso,
                    IdProducto = request.IdProducto == null ? "" : request.IdProducto,
                    tecnologia = request.tecnologia == null ? string.Empty : request.tecnologia,
                    customerId = request.customerId == null ? string.Empty : request.customerId,
                    canal = string.Empty,
                    FechaDesde = request.tecnologia == null ? string.Empty : request.FechaDesde,
                    FechaHasta = request.tecnologia == null ? string.Empty : request.FechaHasta,
                    Estado = request.tecnologia == null ? string.Empty : request.Estado,
                    Asesor = request.tecnologia == null ? string.Empty : request.Asesor,
                    Cuenta = request.tecnologia == null ? string.Empty : request.Cuenta,
                    TipoTransaccion = request.tecnologia == null ? string.Empty : request.TipoTransaccion,
                    CodIteraccion = request.tecnologia == null ? string.Empty : request.CodIteraccion,
                    CadDac = request.tecnologia == null ? string.Empty : request.CadDac,
                    CoId = request.tecnologia == null ? string.Empty : request.CoId,
                    ContratoId = request.ContratoId == null ? "" : request.ContratoId,
                    plan = request.plan == null ? "" : request.plan,
                    coIdPub = request.coIdPub == null ? "" : request.coIdPub, //ContratoPublico-TOBE
                    flagConvivencia = ConfigurationManager.AppSettings["flagConvivenciaAsIsToBeReingFija"]//ContratoPublico-TOBE
                }
            };

            try
            {
                Tools.Traces.Logging.Info(stridSession, oDatosAcicionalesDataRequest.Audit.Transaction, "Url: " + strUrl); 
                Tools.Traces.Logging.Info(stridSession, oDatosAcicionalesDataRequest.Audit.Transaction, "Request GetDatosAdicionales DP PostServiciosAdicionales: " + JsonConvert.SerializeObject(oDatosAcicionalesDataRequest));
                oDatosAcicionalesDataResponse = Utils.RestService.PostInvoque<DatosAdicionalesResponse>(strUrl, oDatosAcicionalesDataRequest.Audit, oDatosAcicionalesDataRequest, true);
                Tools.Traces.Logging.Info(stridSession, oDatosAcicionalesDataRequest.Audit.Transaction, "Response GetDatosAdicionales DP PostServiciosAdicionales: " + JsonConvert.SerializeObject(oDatosAcicionalesDataResponse));
                oDatosAdi = oDatosAcicionalesDataResponse;
            }
            catch (Exception ex)
            {
                Tools.Traces.Logging.Error(stridSession, oDatosAcicionalesDataRequest.Audit.Transaction, ex.Message);
                string sep = " - ";
                int posResponse = ex.Message.IndexOf(sep);
                string result = ex.Message.Substring(posResponse + sep.Length);
                oDatosAcicionalesDataResponse = JsonConvert.DeserializeObject<DatosAdicionalesResponse>(result);
            }


            return Json(new
            {
                data = oDatosAcicionalesDataResponse,
            }, JsonRequestBehavior.AllowGet);

        }

        public FileContentResult ShowRecordSharedFile(string strIdSession)
        {
            Tools.Entity.AuditRequest oAuditRequest = Common.CreateAuditRequest<Tools.Entity.AuditRequest>(strIdSession);
            byte[] databytes;
            string strContenType = "application/pdf";
            try
            {
                Tools.Entity.AuditRequest oAudit = Utils.Common.CreateAuditRequest<Tools.Entity.AuditRequest>(strIdSession);
                databytes = databytesFile;
            }
            catch (Exception ex)
            {
                Tools.Traces.Logging.Error(strIdSession, oAuditRequest.Transaction, ex.Message);
                databytes = null;
            }

            return File(databytes, strContenType);
        }

       


        [HttpPost]
        public JsonResult postGeneraTransaccion(GuardarDatosDataBodyRequest request, string stridSession, string TransactionID)
        {
            request.idFlujo = TransactionID == Tools.Utils.Constants.NumberFiveString ? ConfigurationManager.AppSettings["IdFlujoServiciosAdicionalesFTTH"] : ConfigurationManager.AppSettings["IdFlujoServiciosAdicionalesFTTHONE"];
            string strUrl = ConfigurationManager.AppSettings["DPGetGuardarDatosAgendamiento"];
            Models.Transversal.GuardarDatosRequest oDataRequest = new Models.Transversal.GuardarDatosRequest();
            Models.Transversal.GuardarDatosResponse oDataResponse = new Models.Transversal.GuardarDatosResponse();
            Tools.Entity.AuditRequest oAuditRequest = Utils.Common.CreateAuditRequest<Tools.Entity.AuditRequest>(stridSession);

            

            //SETEAMOS LOS NULL A VACIO
            request.Servicios.Select(m => new Models.Transversal.Servicios
            {
                Servicio = m.Servicio,
                parametros = m.parametros.Where(u => u.valor == null).ToList()
            }).ToList().ForEach(y =>
            {
                foreach (var item in y.parametros)
                {
                    item.valor = "";
                }
            });

            //Encriptamos a base64 la notas -  Tipificacion
            request.Servicios.Where(m => m.Servicio == "Tipificacion")
           .Select(m => new Models.Transversal.Servicios
           {
               Servicio = m.Servicio,
               parametros = m.parametros.Where(u => u.parametro == "Notas").ToList()
           }).ToList().ForEach(y => y.parametros.FirstOrDefault().valor = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(y.parametros.FirstOrDefault().valor)));

            //Encriptamos a base64 la inter_30 - Tipificacion
            request.Servicios.Where(m => m.Servicio == "Plantilla")
           .Select(m => new Models.Transversal.Servicios
           {
               Servicio = m.Servicio,
               parametros = m.parametros.Where(u => u.parametro == "inter30").ToList()
           }).ToList().ForEach(y => y.parametros.FirstOrDefault().valor = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(y.parametros.FirstOrDefault().valor)));

            //Encriptamos a base64 la lista de Servicios Tipificacion
            request.Servicios.Where(m => m.Servicio == "RegistroServicioTipificacion")
           .Select(m => new Models.Transversal.Servicios
           {
               Servicio = m.Servicio,
               parametros = m.parametros.Where(u => u.parametro == "listaServicio").ToList()
           }).ToList().ForEach(y => y.parametros.FirstOrDefault().valor = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(y.parametros.FirstOrDefault().valor)));


            //Encriptamos a base64 las Tareas Pogramadas
            request.Servicios.Where(m => m.Servicio == "TareasPogramadas")
                 .Select(m => new Models.Transversal.Servicios
                 {
                     Servicio = m.Servicio,
                     parametros = m.parametros.Where(u => u.parametro == "listaRegistro").ToList()
                 }).ToList().ForEach(y => y.parametros.FirstOrDefault().valor = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(y.parametros.FirstOrDefault().valor)));


            //Encriptamos a base64 la Constancia
            request.Servicios.Where(m => m.Servicio == "Constancia")
           .Select(m => new Models.Transversal.Servicios
           {
               Servicio = m.Servicio,
               parametros = m.parametros.Where(u => u.parametro == "DRIVE_CONSTANCIA").ToList()
           }).ToList().ForEach(y => y.parametros.FirstOrDefault().valor = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(y.parametros.FirstOrDefault().valor)));


            oDataRequest.Audit = oAuditRequest;

            oDataRequest.MessageRequest = new Models.Transversal.GuardarDatosDataMessageRequest
            {
                Header = new Models.DataPower.HeaderReq
                {
                    HeaderRequest = new Models.DataPower.HeaderRequest
                    {
                        consumer = "TCRM",
                        country = "PE",
                        dispositivo = "MOVIL",
                        language = "ES",
                        modulo = "sisact",
                        msgType = "REQUEST",
                        operation = "GeneraTransaccion",
                        pid = DateTime.Now.ToString("yyyyMMddHHmmssfff"),
                        system = "SIACU",
                        timestamp = DateTime.Now.ToString("o"),
                        userId = Utils.Common.CurrentUser,
                        wsIp = strIpSession
                    }
                },
                Body = new Models.Transversal.GuardarDatosDataBodyRequest
                {
                    idFlujo = request.idFlujo,
                    Servicios = request.Servicios
                }
            };
            var ok = false;
            var msg = "";
            try
            {
                databytesFile = null;
                Tools.Traces.Logging.Info(stridSession, oDataRequest.Audit.Transaction, "Url: " + strUrl); 
                Tools.Traces.Logging.Info(stridSession, oDataRequest.Audit.Transaction, "Request postGeneraTransaccion DP PostServiciosAdicionales: " + JsonConvert.SerializeObject(oDataRequest));
                oDataResponse = Utils.RestService.PostInvoque<Models.Transversal.GuardarDatosResponse>(strUrl, oDataRequest.Audit, oDataRequest, true);
                Tools.Traces.Logging.Info(stridSession, oDataRequest.Audit.Transaction, "Response postGeneraTransaccion DP PostServiciosAdicionales: " + JsonConvert.SerializeObject(oDataResponse));

                /***********************INICIO DE CONTROL DE CONSTANCIA*******************************************************/
                    if ((oDataResponse != null) && (oDataResponse.MessageResponse != null) && (oDataResponse.MessageResponse.Body != null) ){
                        databytesFile = Convert.FromBase64String((oDataResponse.MessageResponse.Body.constancia != null ? oDataResponse.MessageResponse.Body.constancia : ""));
                    }
                /**************************FIN DE CONTROL DE CONSTANCIA****************************************************************/
                ok = true;
               
            }
            catch (Exception ex)
            {
                Tools.Traces.Logging.Error(stridSession, oDataRequest.Audit.Transaction, ex.Message);
                string sep = " - ";
                ok = false;
                int posResponse = ex.Message.IndexOf(sep);
                string result = ex.Message.Substring(posResponse + sep.Length);
                msg = result;
            }

            return Json(new
            {
                data = oDataResponse,
                succes = ok,
                request = JsonConvert.SerializeObject(oDataRequest),
                response = JsonConvert.SerializeObject(oDataResponse),
                exError = msg,
            }, JsonRequestBehavior.AllowGet);
        }

      
    }
}