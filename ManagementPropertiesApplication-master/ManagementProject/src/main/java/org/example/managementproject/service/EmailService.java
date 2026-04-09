package org.example.managementproject.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.managementproject.model.Booking;
import org.example.managementproject.model.Property;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;


    @Value("${app.mail.from}")
    private String fromEmail;

    // ─── Booking Created ──────────────────────────────────────────────────────

    @Async
    public void sendBookingCreated(Booking booking) {
        String subject = "Booking Request Received – " + booking.getProperty().getTitle();
        String body = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                  <div style="background: #2563eb; padding: 24px; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 22px;">Booking Request Received</h1>
                  </div>
                  <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
                    <p style="color: #374151;">Hi <strong>%s</strong>,</p>
                    <p style="color: #374151;">Your booking request has been submitted and is awaiting confirmation.</p>
                    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
                      <h3 style="margin: 0 0 12px; color: #111827;">Booking Details</h3>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Property:</strong> %s</p>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Location:</strong> %s, %s</p>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Check-in:</strong> %s</p>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Check-out:</strong> %s</p>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Guests:</strong> %d</p>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Total Price:</strong> $%.2f</p>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">You will receive another email once the agent confirms or rejects your booking.</p>
                  </div>
                </div>
                """.formatted(
                booking.getUser().getFirstName(),
                booking.getProperty().getTitle(),
                booking.getProperty().getCity(),
                booking.getProperty().getCountry(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getGuests(),
                booking.getTotalPrice()
        );
        sendEmail(booking.getUser().getEmail(), subject, body);

    }

    // ─── Booking Confirmed ────────────────────────────────────────────────────

    @Async
    public void sendBookingConfirmed(Booking booking) {
        String subject = "✅ Booking Confirmed – " + booking.getProperty().getTitle();
        String body = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                  <div style="background: #16a34a; padding: 24px; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 22px;">Booking Confirmed!</h1>
                  </div>
                  <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
                    <p style="color: #374151;">Hi <strong>%s</strong>,</p>
                    <p style="color: #374151;">Great news! Your booking has been <strong style="color: #16a34a;">confirmed</strong>.</p>
                    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
                      <h3 style="margin: 0 0 12px; color: #111827;">Booking Details</h3>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Property:</strong> %s</p>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Location:</strong> %s, %s</p>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Check-in:</strong> %s</p>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Check-out:</strong> %s</p>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Total Price:</strong> $%.2f</p>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">We look forward to hosting you. Have a great stay!</p>
                  </div>
                </div>
                """.formatted(
                booking.getUser().getFirstName(),
                booking.getProperty().getTitle(),
                booking.getProperty().getCity(),
                booking.getProperty().getCountry(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getTotalPrice()
        );
        sendEmail(booking.getUser().getEmail(), subject, body);
    }

    // ─── Booking Cancelled ────────────────────────────────────────────────────

    @Async
    public void sendBookingCancelled(Booking booking) {
        String subject = "❌ Booking Cancelled – " + booking.getProperty().getTitle();
        String body = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                  <div style="background: #dc2626; padding: 24px; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 22px;">Booking Cancelled</h1>
                  </div>
                  <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
                    <p style="color: #374151;">Hi <strong>%s</strong>,</p>
                    <p style="color: #374151;">Your booking for <strong>%s</strong> has been <strong style="color: #dc2626;">cancelled</strong>.</p>
                    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Check-in:</strong> %s</p>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Check-out:</strong> %s</p>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">If you have any questions please contact support.</p>
                  </div>
                </div>
                """.formatted(
                booking.getUser().getFirstName(),
                booking.getProperty().getTitle(),
                booking.getCheckInDate(),
                booking.getCheckOutDate()
        );
        sendEmail(booking.getUser().getEmail(), subject, body);
    }

    // ─── Booking Rejected ─────────────────────────────────────────────────────

    @Async
    public void sendBookingRejected(Booking booking) {
        String subject = "Booking Update – " + booking.getProperty().getTitle();
        String body = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                  <div style="background: #6b7280; padding: 24px; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 22px;">Booking Not Available</h1>
                  </div>
                  <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
                    <p style="color: #374151;">Hi <strong>%s</strong>,</p>
                    <p style="color: #374151;">Unfortunately your booking request for <strong>%s</strong> could not be accommodated for the requested dates.</p>
                    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Check-in:</strong> %s</p>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Check-out:</strong> %s</p>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">Please browse our other available properties and try again.</p>
                  </div>
                </div>
                """.formatted(
                booking.getUser().getFirstName(),
                booking.getProperty().getTitle(),
                booking.getCheckInDate(),
                booking.getCheckOutDate()
        );
        sendEmail(booking.getUser().getEmail(), subject, body);
    }

    // ─── Agent Notification ───────────────────────────────────────────────────

    @Async
    public void sendNewBookingToAgent(Booking booking) {
        String subject = "New Booking Request – " + booking.getProperty().getTitle();
        String body = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                  <div style="background: #7c3aed; padding: 24px; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 22px;">New Booking Request</h1>
                  </div>
                  <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
                    <p style="color: #374151;">Hi <strong>%s</strong>,</p>
                    <p style="color: #374151;">You have a new booking request for <strong>%s</strong>.</p>
                    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Guest:</strong> %s</p>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Check-in:</strong> %s</p>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Check-out:</strong> %s</p>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Guests:</strong> %d</p>
                      <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Total:</strong> $%.2f</p>
                      %s
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">Please log in to confirm or reject this booking.</p>
                  </div>
                </div>
                """.formatted(
                booking.getProperty().getAgent().getFirstName(),
                booking.getProperty().getTitle(),
                booking.getUser().getFirstName() + " " + booking.getUser().getLastName(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getGuests(),
                booking.getTotalPrice(),
                booking.getSpecialRequests() != null
                        ? "<p style='margin: 4px 0; color: #6b7280;'><strong style='color: #374151;'>Special Requests:</strong> " + booking.getSpecialRequests() + "</p>"
                        : ""
        );
        sendEmail(booking.getProperty().getAgent().getEmail(), subject, body);
    }
    @Async
    public void sendPropertyApproved(Property property) {
        String subject = "✅ Property Approved – " + property.getTitle();
        String body = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
              <div style="background: #16a34a; padding: 24px; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 22px;">Property Approved!</h1>
              </div>
              <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
                <p style="color: #374151;">Hi <strong>%s</strong>,</p>
                <p style="color: #374151;">Great news! Your property listing or recent edits have been <strong style="color: #16a34a;">approved</strong> and are now live on the platform.</p>
                <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <h3 style="margin: 0 0 12px; color: #111827;">Property Details</h3>
                  <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Title:</strong> %s</p>
                  <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Location:</strong> %s, %s</p>
                  <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Price/Night:</strong> $%.2f</p>
                </div>
                <p style="color: #6b7280; font-size: 14px;">Guests can view and book your property. Good luck!</p>
              </div>
            </div>
            """.formatted(
                property.getAgent().getFirstName(),
                property.getTitle(),
                property.getCity(),
                property.getCountry(),
                property.getPricePerNight()
        );
        sendEmail(property.getAgent().getEmail(), subject, body);
    }

    @Async
    public void sendPropertyPendingNotification(Property property) {
        String subject = "🔔 New Property/Edit Awaiting Approval – " + property.getTitle();
        String body = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
              <div style="background: #fbbf24; padding: 24px; border-radius: 8px 8px 0 0;">
                <h1 style="color: black; margin: 0; font-size: 22px;">Approval Required</h1>
              </div>
              <div style="background: #fdfaf3; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #fde68a;">
                <p style="color: #374151;">Hello Admin,</p>
                <p style="color: #374151;">Agent <strong>%s</strong> has submitted a new property or an edit for approval.</p>
                <div style="background: white; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <h3 style="margin: 0 0 12px; color: #111827;">Property Submission</h3>
                  <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Title:</strong> %s</p>
                  <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Location:</strong> %s, %s</p>
                </div>
                <p style="color: #6b7280; font-size: 14px;">Please log in to the Admin Dashboard to review the submission.</p>
              </div>
            </div>
            """.formatted(
                property.getAgent().getFirstName() + " " + property.getAgent().getLastName(),
                property.getTitle(),
                property.getCity(),
                property.getCountry()
        );
        // We might want a dedicated admin notification email here, 
        // using the 'fromEmail' as a placeholder for admin dest if not configured.
        sendEmail(fromEmail, subject, body); 
    }

    @Async
    public void sendPropertyRejected(Property property) {
        String subject = "❌ Property Rejected – " + property.getTitle();
        String body = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
              <div style="background: #dc2626; padding: 24px; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 22px;">Property Not Approved</h1>
              </div>
              <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
                <p style="color: #374151;">Hi <strong>%s</strong>,</p>
                <p style="color: #374151;">Unfortunately your property submission or recent edit has been <strong style="color: #dc2626;">rejected</strong> by our team.</p>
                <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <h3 style="margin: 0 0 12px; color: #111827;">Property Details</h3>
                  <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Title:</strong> %s</p>
                  <p style="margin: 4px 0; color: #6b7280;"><strong style="color: #374151;">Location:</strong> %s, %s</p>
                </div>
                <p style="color: #6b7280; font-size: 14px;">Please review our listing guidelines and resubmit with any necessary changes.</p>
              </div>
            </div>
            """.formatted(
                property.getAgent().getFirstName(),
                property.getTitle(),
                property.getCity(),
                property.getCountry()
        );
        sendEmail(property.getAgent().getEmail(), subject, body);
    }

    // ─── Password Reset ───────────────────────────────────────────────────────

    @Async
    public void sendPasswordResetEmail(String toEmail, String firstName, String resetLink) {
        String subject = "🔑 Password Reset Request";
        String body = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                  <div style="background: #2563eb; padding: 24px; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 22px;">Password Reset</h1>
                  </div>
                  <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
                    <p style="color: #374151;">Hi <strong>%s</strong>,</p>
                    <p style="color: #374151;">We received a request to reset your password. Click the button below to set a new password:</p>
                    <div style="text-align: center; margin: 24px 0;">
                      <a href="%s" style="display: inline-block; background: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                        Reset Password
                      </a>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">This link will expire in <strong>30 minutes</strong>.</p>
                    <p style="color: #6b7280; font-size: 14px;">If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
                    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-top: 16px;">
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">If the button doesn't work, copy and paste this link into your browser:</p>
                      <p style="margin: 4px 0 0; color: #2563eb; font-size: 12px; word-break: break-all;">%s</p>
                    </div>
                  </div>
                </div>
                """.formatted(firstName, resetLink, resetLink);
        sendEmail(toEmail, subject, body);
    }

    // ─── Core send method ─────────────────────────────────────────────────────

    private void sendEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = HTML
            mailSender.send(message);
            log.info("Email sent to {} — {}", to, subject);
        } catch (Exception e) {
            // Graceful failure: log the error but don't rethrow.
            // This prevents Mailtrap rate limits or SMTP errors from rolling back business transactions.
            String errorMsg = e.getMessage();
            if (errorMsg != null && errorMsg.contains("550 5.7.0")) {
                log.error("EMAIL RATE LIMIT HIT: Mailtrap free tier limit reached. Email to {} failed.", to);
            } else {
                log.error("FAILED TO SEND EMAIL to {}: {}", to, errorMsg);
            }
        }
    }
}