using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Claro.SIACU.App.AdditionalServices.Areas.AdditionalServices.Models
{
    public class ConfigurationForm
    {
        public int strInternetService { get; set; }
        public int strCableService { get; set; }
        public int strTelephonyService { get; set; }
    }
}