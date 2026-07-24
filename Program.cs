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



using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);
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

// IMPORTANT: first middleware
app.UseForwardedHeaders();

// ❌ DO NOT force scheme manually
// REMOVE any Use((ctx,next)=>ctx.Request.Scheme="http")

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

await app.RunAsync();