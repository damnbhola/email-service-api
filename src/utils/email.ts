// src/utils/email.ts
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const sendEmail = async (
  to: string,
  from: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> => {
  const msg = {
    to,
    from,
    subject,
    text,
    html: html || `<p>${text}</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("SendGrid error:", error?.response?.body || error.message);
    throw new Error("Failed to send email");
  }
};

interface DynamicTemplateData {
  [key: string]: string | number | boolean;
}

const companyNoReplyEmail = process.env.COMPANY_NO_REPLY_EMAIL!;

export const sendNoReplyEmail = async (
  to: string,
  templateId: string,
  dynamicData: DynamicTemplateData
): Promise<void> => {
  const msg = {
    to,
    from: companyNoReplyEmail,
    templateId,
    dynamic_template_data: dynamicData,
  };

  try {
    await sgMail.send(msg);
    console.log(`Template email sent to ${to}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      "SendGrid template error:",
      error?.response?.body || error.message
    );
    throw new Error("Failed to send template email");
  }
};
