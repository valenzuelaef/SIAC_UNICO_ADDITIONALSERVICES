using Claro.SIACU.App.AdditionalServices.Areas.AdditionalServices.Models.CargaInicialCustomers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Claro.SIACU.App.AdditionalServices.Areas.AdditionalServices.Models.InitialData
{
    public class InitialDataResponse
    {
        [DataMember(Name = "MessageResponse")]
        public InitialDataMessageResponse MessageResponse { get; set; }
    }

    [DataContract(Name = "MessageResponse")]
    public class InitialDataMessageResponse
    {
        [DataMember(Name = "Header")]
        public DataPower.HeaderRes Header { get; set; }
        [DataMember(Name = "Body")]
        public InitialDataBodyResponse Body { get; set; }
    }

    [DataContract(Name = "Body")]
    public class InitialDataBodyResponse
    {
        [DataMember(Name = "datoscliente/obtenerDatosCliente")]
        public CustomerInformationResponse CustomerInformation { get; set; }

        [DataMember(Name = "serviciosprincipales/obtenerServicios")]
        public CoreServicesResponse CoreServices { get; set; }

        [DataMember(Name = "serviciosadicionales/obtenerServAdicionales")]
        public AdditionalServicesResponse AdditionalServices { get; set; }

        [DataMember(Name = "puntosatencion/realizarPuntoAtencion")]
        public PuntoAtencionResponse PuntoAtencion { get; set; }
        [DataMember(Name = "consultaIGV/consultarIGV")]
        public IgvResponse Igv { get; set; }
        [DataMember(Name = "puntosatencion/obtenerOficinaVentaUsuario")]
        public OficinaVentaUsuarioResponse obtenerOficinaVentaUsuario { get; set; }
        [DataMember(Name = "puntosatencion/obtenerDatosUsuarioCuentaRed")]
        public obtenerDatosUsuarioCuentaRedResponse obtenerDatosUsuarioCuentaRed { get; set; }
        
    }

   
}