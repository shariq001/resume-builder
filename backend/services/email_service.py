import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from backend.core.config import settings

def send_reset_password_email(to_email: str, token: str):
    if not settings.SMTP_EMAIL or not settings.SMTP_PASSWORD:
        print("Warning: SMTP credentials not set. Cannot send email.")
        return

    reset_link = f"{settings.FRONTEND_URL}/auth/reset-password?token={token}"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Reset Your Password - ATS Resume Builder"
    msg["From"] = settings.SMTP_EMAIL
    msg["To"] = to_email

    text = f"Hi,\n\nPlease reset your password by clicking the link below:\n{reset_link}\n\nIf you did not request this, please ignore this email."
    html = f"""\
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1a202c; margin-bottom: 20px;">Reset Your Password</h2>
          <p style="color: #4a5568; line-height: 1.6;">You requested to reset your password for your ATS Resume Builder account.</p>
          <p style="color: #4a5568; line-height: 1.6;">Click the button below to set a new password. This link will expire in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{reset_link}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #718096; font-size: 14px; margin-top: 20px;">If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      </body>
    </html>
    """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    msg.attach(part1)
    msg.attach(part2)

    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10)
        server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_EMAIL, to_email, msg.as_string())
        server.quit()
        print(f"Password reset email sent successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")
