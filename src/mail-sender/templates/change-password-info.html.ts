import config from '../../../config/api-gateway.config';
const PASSWORD_RESET = (name: string, code: string) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <h1 style="text-align: left;">Welcome to ${config().app_name}!</h1>
    <p style="text-align: left;">Hi ${name},</p>
    <p style="text-align: left;">You have requested to reset your password. Please use the code below to reset your password.</p>
    <div style="text-align: center;">
      ${code}
    </div>
    <p style="text-align: left;">If you did not request to reset your password, please ignore this email.</p>
    <p style="text-align: left;">Thank you,</p>
    <p style="text-align: left;">${config().app_name} Team</p>
  </div>
`;

export { PASSWORD_RESET };
