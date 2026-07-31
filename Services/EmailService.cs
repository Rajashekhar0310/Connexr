using Connexr_dev.Configuration;
using Connexr_dev.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit;

namespace Connexr_dev.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }

    public async Task SendHrNotificationAsync(
        CareerApplicationModel model,
        string resumePath)


    
    {
        Console.WriteLine("HR email method started");
        var email = new MimeMessage();

        email.From.Add(
            new MailboxAddress(
                _settings.FromName,
                _settings.FromEmail));

        email.To.Add(
            MailboxAddress.Parse(_settings.HrEmail));

        email.Subject =
            $"New Career Application - {model.JobTitle}";

        email.Body = new TextPart("html")
        {
            Text = $@"
<h2>New Career Application</h2>

<table border='1' cellpadding='8' cellspacing='0'>
<tr><td><b>Job Title</b></td><td>{model.JobTitle}</td></tr>
<tr><td><b>Candidate</b></td><td>{model.FullName}</td></tr>
<tr><td><b>Email</b></td><td>{model.Email}</td></tr>
<tr><td><b>Phone</b></td><td>{model.Phone}</td></tr>
<tr><td><b>Location</b></td><td>{model.CurrentLocation}</td></tr>
<tr><td><b>Experience</b></td><td>{model.Experience}</td></tr>
<tr><td><b>Company</b></td><td>{model.CurrentCompany}</td></tr>
<tr><td><b>LinkedIn</b></td><td>{model.LinkedIn}</td></tr>
<tr><td><b>Cover Letter</b></td><td>{model.CoverLetter}</td></tr>
<tr><td><b>Resume</b></td><td>{resumePath}</td></tr>
</table>"
        };
        

        using var smtp = new SmtpClient(new ProtocolLogger(Console.OpenStandardOutput()));

        await smtp.ConnectAsync(
            _settings.SmtpServer,
            _settings.Port,
            SecureSocketOptions.StartTls);

        await smtp.AuthenticateAsync(
            _settings.Username,
            _settings.Password);

        await smtp.SendAsync(email);

        await smtp.DisconnectAsync(true);
    }

    public async Task SendCandidateConfirmationAsync(
        CareerApplicationModel model)
    {
        var email = new MimeMessage();

        email.From.Add(
            new MailboxAddress(
                _settings.FromName,
                _settings.FromEmail));

        email.To.Add(
            MailboxAddress.Parse(model.Email));

        email.Subject =
            "Application Received - Connexr";

        email.Body = new TextPart("html")
        {
            Text = $@"
<h2>Thank you for applying!</h2>

<p>Hi {model.FullName},</p>

<p>
We have successfully received your application
for the position of
<strong>{model.JobTitle}</strong>.
</p>

<p>
Our recruitment team will review your profile
and contact you if your experience matches
our requirements.
</p>

<p>
Regards,<br/>
Connexr Recruitment Team
</p>"
        };

        using var smtp = new SmtpClient();

        Console.WriteLine("Connecting...");

        await smtp.ConnectAsync(
            _settings.SmtpServer,
            _settings.Port,
            SecureSocketOptions.StartTls);

        Console.WriteLine("Connected");

        Console.WriteLine("Authenticating...");

        await smtp.AuthenticateAsync(
            _settings.Username,
            _settings.Password);

        Console.WriteLine("Authenticated");

        Console.WriteLine("Sending...");

        await smtp.SendAsync(email);

        Console.WriteLine("Sent");

        await smtp.DisconnectAsync(true);

        Console.WriteLine("Disconnected");
    }
}