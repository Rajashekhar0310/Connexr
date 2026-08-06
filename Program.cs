using Connexr_dev.Models;
using Connexr_dev.Services;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Authentication.Cookies;
using Connexr_dev.Configuration;
using Umbraco.Cms.Web.Common.Security;


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
        //options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
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