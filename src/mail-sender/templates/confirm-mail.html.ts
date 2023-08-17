import config from 'config/api-gateway.config';
const EMAIL_VERIFICATION = (name: string, code: string) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <h1 style="text-align: center;">Welcome to ${config().app_name}!</h1>
    <p style="text-align: center;">Hi ${name},</p>
    <p style="text-align: center;">Thank you for joining ${
      config().app_name
    }. Please verify your email address by clicking the button below.</p>
    <div style="text-align: center;">
      ${code}
    </div>
    <p style="text-align: center;">If you did not sign up for ${
      config().app_name
    }, please ignore this email.</p>
    <p style="text-align: center;">Thank you,</p>
    <p style="text-align: center;">${config().app_name} Team</p>
  </div>
`;

export { EMAIL_VERIFICATION };
