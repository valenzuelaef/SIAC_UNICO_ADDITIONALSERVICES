using System.Web.Mvc;
using System.Web.Optimization;

namespace Claro.SIACU.App.AdditionalServices.Areas.AdditionalServices
{
    public class AdditionalServicesAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "AdditionalServices";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "AdditionalServices_default",
                "AdditionalServices/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );

            RegisterBundles(BundleTable.Bundles);
        }

        private void RegisterBundles(BundleCollection bundles)
        {
            Claro.SIACU.App.AdditionalServices.Areas.AdditionalServices.Utils.BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}