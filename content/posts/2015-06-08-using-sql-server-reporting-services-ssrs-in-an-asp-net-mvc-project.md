---
id: 574
title: Using SQL Server Reporting Services (SSRS) in an ASP.NET MVC project
date: 2015-06-08T14:21:49-04:00
author: brad
layout: post
guid: http://br4d.net/?p=574
permalink: /using-sql-server-reporting-services-ssrs-in-an-asp-net-mvc-project/
categories:
  - ASP.NET
  - 'CSharp'
  - Programming
  - SQL
  - Uncategorized
---
There are a handful of examples out on the internet on how to use SSRS from an ASP.NET website but all of the ones I came across seemed like hacks. They range from throwing an ASPX page with a ReportViewer control to complex JavaScript hacks. The following method is the one I have used for many years that adheres to the true MVC manner. This method connects to SSRS through the web service using Microsoft.Reporting.WebForms assembly.

Note that this is tailored to remote reports though a similar approach is valid for local ones.

First off, add a reference to this assembly (Microsoft.Reporting.WebForms.dll) to your project. You may have to find the installer on [Microsoft’s website](http://www.microsoft.com/en-us/download/details.aspx?id=35747) if you do not see it listed in Visual Studio.

Now, I normally use a custom ActionResult named SSRSReportResult but for the sake of simplicity, we will just create a private method that fetches the report for us:

{{< highlight csharp >}}
public ActionResult GetServerReport(IEnumerable<ReportParameter> reportParams, string reportPath, string format = "PDF")
{
    // process and return report as FileContentResult
    ServerReport r = new ServerReport();
    r.ReportServerUrl = new Uri(ConfigurationManager.AppSettings["ReportServerUrl"]);
    r.ReportPath = reportPath; // Your path will be something like "/My.Reports/ReportName"
    r.ReportServerCredentials = new SSRSReportConnection();
    if (reportParams != null && reportParams.Any())
    {
        r.SetParameters(reportParams);
    }
    r.Refresh();

    string fileNamePrefix = reportType.ToString(); // this will be the start of the filename that is downloaded by the user
    string mimeType = "";
    string fileNameExtension = "";
    string deviceInfo =
        "<DeviceInfo>" +
        "  <MarginLeft>0.5in</MarginLeft>" +
        "  <MarginRight>0.5in</MarginRight>" +
        "  <MarginTop>0.5in</MarginTop>" +
        "  <MarginBottom>0.5in</MarginBottom>" +
        "  <PageWidth>8.5in</PageWidth>" +
        "  <PageHeight>11in</PageHeight>" +
        "</DeviceInfo>";

    var fileData = r.Render(format, deviceInfo, null, out mimeType, out fileNameExtension);
    return File(fileData, mimeType, String.Format("{1}_{0}.pdf", DateTime.Now.Ticks, reportPath));
}
{{< /highlight >}}

This method that fetches the report for us does have some dependencies. The worst part of all of this is setting up proper credentials so that can use the report server web service. I usually store my credentials in the web.config and use the above mentioned SSRSReportConnection class to fetch these for me.

{{< highlight csharp >}}
public class SSRSReportConnection : IReportServerConnection2
{
    public IEnumerable<Cookie> Cookies
    {
        get { return null; }
    }

    public IEnumerable<string> Headers
    {
        get { return null; }
    }

    public Uri ReportServerUrl
    {
        get
        {
            string url = ConfigurationManager.AppSettings["ReportServerUrl"];

            if (string.IsNullOrEmpty(url))
            {
                throw new Exception("Missing url from the Web.config file for reporting services.");
            }

            return new Uri(url);
        }
    }

    public int Timeout
    {
        get
        {
            //get timeout from configuration, default fallback is 1 hour if not specified in configuration
            string timeout = ConfigurationManager.AppSettings["ReportServerUrl"];

            int result = 0;
            Int32.TryParse(timeout, out result);

            if (result == 0)
            {
                result = 600000;
            }

            return result;
        }
    }

    public bool GetFormsCredentials(out Cookie authCookie, out string userName, out string password, out string authority)
    {
        authCookie = null;
        userName = null;
        password = null;
        authority = null;

        // Not using form credentials
        return false;
    }

    public System.Security.Principal.WindowsIdentity ImpersonationUser
    {
        // Use the default Windows user.  Credentials will be provided by the NetworkCredentials property.
        get { return null; }
    }

    public System.Net.ICredentials NetworkCredentials
    {
        get
        {
            // Read the user information from the web.config file.  By reading the information on demand instead of
            // storing it, the credentials will not be stored in session, reducing the vulnerable surface area to the
            // web.config file, which can be secured with an ACL.

            // User name
            string userName = ConfigurationManager.AppSettings["ReportViewerUser"];

            if (string.IsNullOrEmpty(userName))
            {
                throw new Exception("Missing user name from Web.config file for reporting services.");
            }

            // Password
            string password = ConfigurationManager.AppSettings["ReportViewerPassword"];

            if (string.IsNullOrEmpty(password))
            {
                throw new Exception("Missing password from Web.config file for reporting services.");
            }

            // Domain
            string domain = ConfigurationManager.AppSettings["ReportViewerDomain"];

            if (string.IsNullOrEmpty(domain))
            {
                throw new Exception("Missing domain from Web.config file for reporting services.");
            }

            return new NetworkCredential(userName, password, domain);
        }
    }
}
{{< /highlight >}}

Notice that this credentials class inherits from IReportServerConnection2 and it reads many keys from the config file:

{{< highlight xml >}}
<add key="ReportServerUrl" value="http://your-path/ReportServer" />
<add key="ReportViewerUser" value="YourUserName" />
<add key="ReportViewerPassword" value="YourPassword" />
<add key="ReportViewerDomain" value="YourDomainOrMachineName" />
{{< /highlight >}}

You can find the exact credentials in Report Services Configuration Manager (on the Web Service URL tab) on the machine that the reports are on. Now that everything is in place it is time to use this report method!

{{< highlight csharp >}}
[HttpPost, ValidateAntiForgeryToken]
public ActionResult Report(ReportViewModel model)
{
    if (ModelState.IsValid)
    {
        // if you have any params for the report, set them here by adding them into a List<ReportParamater> and passing
        // it as the first argument below. You can do something like this:
        // List<ReportParameter> parameters = new List<ReportParameter>(){ new ReportParameter("ParamName", paramValue) };
        return GetServerReport(null, "ReportPathOrName");
    }

    return View(model);
}
{{< /highlight >}}
