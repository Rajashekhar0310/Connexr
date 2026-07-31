/*using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Limits
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 524288000;
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 524288000;
});

// Forwarded Headers
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto;

    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// Umbraco
builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddComposers()
    .Build();

WebApplication app = builder.Build();

app.UseForwardedHeaders();

// REQUIRED
await app.BootUmbracoAsync();

app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
    });

await app.RunAsync();*/

//using Microsoft.AspNetCore.Http.Features;
//using Microsoft.AspNetCore.HttpOverrides;
//using Microsoft.AspNetCore.Authentication.Cookies;

//WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

//// --------------------
//// Upload Limits
//// --------------------
//builder.Services.Configure<FormOptions>(options =>
//{
//    options.MultipartBodyLengthLimit = 524288000;
//});

//builder.WebHost.ConfigureKestrel(options =>
//{
//    options.Limits.MaxRequestBodySize = 524288000;
//});

//// --------------------
//// Forwarded Headers (IMPORTANT for IIS / EC2)
//// --------------------
//builder.Services.Configure<ForwardedHeadersOptions>(options =>
//{
//    options.ForwardedHeaders =
//        ForwardedHeaders.XForwardedFor |
//        ForwardedHeaders.XForwardedProto;

//    options.KnownNetworks.Clear();
//    options.KnownProxies.Clear();
//});

//// --------------------
//// IMPORTANT FIX FOR UMBRACO AUTH (LOCAL + IP)
//// --------------------
//builder.Services.AddHttpContextAccessor();

//builder.Services.Configure<CookieAuthenticationOptions>(
//    CookieAuthenticationDefaults.AuthenticationScheme,
//    options =>
//    {
//        options.Cookie.SameSite = SameSiteMode.Lax;
//        options.Cookie.SecurePolicy = CookieSecurePolicy.None;
//    });

//// --------------------
//// UMBRACO
//// --------------------
//builder.CreateUmbracoBuilder()
//    .AddBackOffice()
//    .AddWebsite()
//    .AddComposers()
//    .Build();

//WebApplication app = builder.Build();

//// MUST be first middleware
//app.UseForwardedHeaders();

//// Boot Umbraco
//await app.BootUmbracoAsync();

//// Umbraco pipeline
//app.UseUmbraco()
//    .WithMiddleware(u =>
//    {
//        u.UseBackOffice();
//        u.UseWebsite();
//    })
//    .WithEndpoints(u =>
//    {
//        u.UseBackOfficeEndpoints();
//        u.UseWebsiteEndpoints();
//    });

//await app.RunAsync();

/*using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Authentication.Cookies;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// --------------------
// Upload Limits
// --------------------
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 524288000;
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 524288000;
});

// --------------------
// Forwarded Headers (IIS / EC2)
// --------------------
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto |
        ForwardedHeaders.XForwardedHost;

    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// --------------------
// Auth support
// --------------------
builder.Services.AddHttpContextAccessor();

builder.Services.Configure<CookieAuthenticationOptions>(
    CookieAuthenticationDefaults.AuthenticationScheme,
    options =>
    {
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.None;
    });

// --------------------
// UMBRACO
// --------------------
builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddComposers()
    .Build();

WebApplication app = builder.Build();

// --------------------
// MUST BE FIRST MIDDLEWARE
// --------------------
app.UseForwardedHeaders();

// --------------------
// 🔥 FORCE HTTP SCHEME (your requested fix)
// --------------------
app.Use((context, next) =>
{
    context.Request.Scheme = "http";
    return next();
});

// --------------------
// Boot Umbraco
// --------------------
await app.BootUmbracoAsync();

// --------------------
// Umbraco Pipeline
// --------------------
app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
    });

await app.RunAsync();*/


using Connexr_dev.Models;
using Connexr_dev.Services;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Authentication.Cookies;
using Connexr_dev.Configuration;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<ICareerService, CareerService>();
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddControllers();
Console.WriteLine(
    builder.Configuration.GetConnectionString("umbracoDbDSN"));

// --------------------
// Upload limits
// --------------------
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 524288000;
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 524288000;
});

// --------------------
// Forwarded headers (IMPORTANT for IIS / SSL)
// --------------------
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto |
        ForwardedHeaders.XForwardedHost;

    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// --------------------
// Cookie auth fix
// --------------------
builder.Services.AddHttpContextAccessor();

builder.Services.Configure<CookieAuthenticationOptions>(
    CookieAuthenticationDefaults.AuthenticationScheme,
    options =>
    {
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    });

// --------------------
// Umbraco
// --------------------
builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddComposers()
    .Build();

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();

// IMPORTANT: first middleware
app.UseForwardedHeaders();

// ❌ DO NOT force scheme manually
// REMOVE any Use((ctx,next)=>ctx.Request.Scheme="http")

await app.BootUmbracoAsync();

app.UseRouting();

app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        // Register attribute-routed controllers
        u.EndpointRouteBuilder.MapControllers();

        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
    });
//app.MapPost("/career/apply", async (
//    HttpRequest request,
//    ICareerService careerService) =>
//{
//    var form = await request.ReadFormAsync();

//    var model = new CareerApplicationModel
//    {
//        JobTitle = form["JobTitle"],
//        FullName = form["FullName"],
//        Email = form["Email"],
//        Phone = form["Phone"],
//        CurrentLocation = form["CurrentLocation"],
//        Experience = form["Experience"],
//        CurrentCompany = form["CurrentCompany"],
//        LinkedIn = form["LinkedIn"],
//        CoverLetter = form["CoverLetter"],
//        Resume = form.Files["Resume"]
//    };

//    var result = await careerService.SubmitApplicationAsync(model);

//    return Results.Json(result);
//});

app.MapPost("/career/apply", async (
    HttpRequest request,
    ICareerService careerService) =>
{
    var form = await request.ReadFormAsync();

    var model = new CareerApplicationModel
    {
        JobTitle = form["JobTitle"],
        FullName = form["FullName"],
        Email = form["Email"],
        Phone = form["Phone"],
        CurrentLocation = form["CurrentLocation"],
        Experience = form["Experience"],
        CurrentCompany = form["CurrentCompany"],
        LinkedIn = form["LinkedIn"],
        CoverLetter = form["CoverLetter"],
        Resume = form.Files["Resume"]
    };

    var result = await careerService.SubmitApplicationAsync(model);

    Console.WriteLine($"Success = {result.Success}");
    Console.WriteLine($"Message = {result.Message}");

    return Results.Json(new
    {
        success = result.Success,
        message = result.Message
    });
});
app.MapPost("/career/status", async (
    int id,
    string status,
    ICareerService careerService) =>
{
    Console.WriteLine("===== STATUS ENDPOINT HIT =====");
    Console.WriteLine($"Id: {id}");
    Console.WriteLine($"Status: {status}");

    await careerService.UpdateStatusAsync(id, status);

    return Results.Ok(new
    {
        success = true
    });
});
using Umbraco.Cms.Web.Common.Security;

app.MapPost("/hr/login", async (
    HttpContext httpContext,
    IMemberSignInManager signInManager,
    string username,
    string password) =>
{
    var result = await signInManager.PasswordSignInAsync(
        username,
        password,
        false,
        false);

    if (!result.Succeeded)
    {
        return Results.Redirect("/hr-login?error=1");
    }

    return Results.Redirect("/HRApplications");
});

await app.RunAsync();