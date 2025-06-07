const resetPasswordTemplateId = process.env
  .SENDGRID_RESET_PASSWORD_TEMPLATE_ID as string;

export const NO_REPLY_EMAIL_TEMPLATES = {
  RESET_PASSWORD: resetPasswordTemplateId,
};
