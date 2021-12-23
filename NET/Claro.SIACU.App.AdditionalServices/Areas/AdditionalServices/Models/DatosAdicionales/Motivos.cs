using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Claro.SIACU.App.AdditionalServices.Areas.AdditionalServices.Models.DatosAdicionales
{
    public class Motivos
    {
        [DataMember(Name = "codMotivo")]
        public string CodMotivo { get; set; }

        [DataMember(Name = "descripcion")]
        public string Descripcion { get; set; }
    }
}