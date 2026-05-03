
export const NotificationService = {
  /**
   * Stub for sending emails. Replace with Nodemailer/SendGrid/AWS SES in production.
   */
  sendEmail: async (to: string, subject: string, body: string) => {
    console.log(`[EMAIL STUB] To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    return true;
  },

  /**
   * Stub for sending SMS. Replace with Twilio/SNS in production.
   */
  sendSMS: async (phone: string, message: string) => {
    console.log(`[SMS STUB] To: ${phone} | Message: ${message}`);
    return true;
  },

  /**
   * Triggered when an appointment is created.
   */
  notifyAppointmentCreated: async (appointment: any, patientEmail?: string | null, patientPhone?: string | null) => {
    const dateStr = new Date(appointment.startAt).toLocaleString();
    
    // Email Notification
    if (patientEmail) {
      const subject = `Appointment Confirmation: ${dateStr}`;
      const message = `Dear Patient,\n\nYour appointment with ${appointment.doctor?.firstName} ${appointment.doctor?.lastName} is confirmed for ${dateStr}.\n\n${appointment.videoLink ? `Telehealth Link: ${appointment.videoLink}` : ''}\n\nThank you,\nMediNexus Clinic`;
      await NotificationService.sendEmail(patientEmail, subject, message);
    }

    // SMS Notification
    if (patientPhone) {
      const smsMsg = `MediNexus: Appt confirmed for ${dateStr}.`;
      await NotificationService.sendSMS(patientPhone, smsMsg);
    }
  }
};
