// src/utils/email.ts
import Mailjet from "node-mailjet";

const mailjet = new Mailjet({
  apiKey: process.env.MJ_API_KEY || "",
  apiSecret: process.env.MJ_API_SECRET_KEY || "",
});

const companyContacts = {
  ContactPhone: process.env.COMPANY_CONTACT_PHONE || "",
  ContactEmail: process.env.COMPANY_CONTACT_EMAIL || "",
  securityContactPhone: process.env.COMPANY_SECURITY_CONTACT_PHONE || "",
  securityContactEmail: process.env.COMPANY_SECURITY_CONTACT_EMAIL || "",
};

export const sendEmail = async (
  from: string,
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> => {
  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: from },
          To: [{ Email: to }],
          Subject: subject,
          TextPart: text,
          HTMLPart: html || `<p>${text}</p>`,
        },
      ],
    });
    console.log(`Email sent to ${to}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("MailJet error:", error?.response?.body || error.message);
    throw new Error("Failed to send email");
  }
};

export const sendNoReplyEmail = async (
  templateId: number,
  to: string,
  resetUrl: string
): Promise<void> => {
  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          To: [{ Email: to }],
          TemplateID: templateId,
          Variables: {
            resetUrl,
            ...companyContacts,
          },
        },
      ],
    });
    console.log(`Template email sent to ${to}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      "MailJet template error:",
      error?.response?.body || error.message
    );
    throw new Error("Failed to send template email");
  }
};
