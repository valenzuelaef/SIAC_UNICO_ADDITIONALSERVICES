using System.Runtime.Serialization;

namespace Claro.SIACU.App.AdditionalServices.Areas.AdditionalServices.Models.Audit
{
    [DataContract(Name = "auditResponse")]
    public class AuditResponse
    {
        [DataMember(Name = "idTransaccion")]
        public string strIDTransaction { get; set; }
        [DataMember(Name = "codigoRespuesta")]
        public string strResponseCode { get; set; }
        [DataMember(Name = "mensajeRespuesta")]
        public string strResponseMsg { get; set; }
    }
}