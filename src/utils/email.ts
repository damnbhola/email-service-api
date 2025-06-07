// utils/email.ts
export const sendResetEmail = async (email: string, resetLink: string) => {
  console.log(`📧 Sending password reset email to ${email}`);
  console.log(`🔗 Reset link: ${resetLink}`);
};
