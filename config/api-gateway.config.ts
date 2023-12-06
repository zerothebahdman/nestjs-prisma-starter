import * as Yup from 'yup';

export default () => {
  const envVarsSchema = Yup.object()
    .shape({
      PORT: Yup.string().default('3000'),
      NODE_ENV: Yup.string()
        .oneOf(['development', 'production', 'staging', 'test'])
        .default('development')
        .required(),
      API_GATEWAY_HOST: Yup.string().default('localhost'),
      API_GATEWAY_BASE_PATH: Yup.string().default('/api'),
      API_GATEWAY_TIMEOUT: Yup.string().default('30000'),
      APP_NAME: Yup.string().default('API Gateway').required(),
      DATABASE_URL: Yup.string().required(),
      MAIL_FROM: Yup.string().required(),
      MAIL_HOST: Yup.string().required(),
      MAIL_PORT: Yup.string().required(),
      MAIL_USER: Yup.string().required(),
      MAIL_PASSWORD: Yup.string().required(),
      REDIS_URL: Yup.string().required(),
      JWT_ACCESS_TOKEN_EXPIRES: Yup.string().default('1hr'),
      JWT_REFRESH_TOKEN_EXPIRES: Yup.string().default('30d'),
    })
    .unknown();
  let envVars: Yup.InferType<typeof envVarsSchema>;
  try {
    envVars = envVarsSchema.validateSync(process.env, {
      strict: true,
      abortEarly: true,
      stripUnknown: true,
    });
  } catch (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    port: envVars.PORT,
    env: envVars.NODE_ENV,
    app_name: envVars.APP_NAME,
    api_gateway_host: envVars.API_GATEWAY_HOST,
    api_gateway_base_path: envVars.API_GATEWAY_BASE_PATH,
    api_gateway_timeout: envVars.API_GATEWAY_TIMEOUT,
    database_url: envVars.DATABASE_URL,
    mail: {
      from: envVars.MAIL_FROM,
      host: envVars.MAIL_HOST,
      port: envVars.MAIL_PORT,
      user: envVars.MAIL_USER,
      password: envVars.MAIL_PASSWORD,
      disabled: envVars.NODE_ENV === 'test',
    },
    redis_url: envVars.REDIS_URL,
    jwt_access_token_expires: envVars.JWT_ACCESS_TOKEN_EXPIRES,
    jwt_refresh_token_expires: envVars.JWT_REFRESH_TOKEN_EXPIRES,
  };
};
