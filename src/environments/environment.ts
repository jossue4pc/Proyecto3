export interface Environment {
  production: boolean;
  sendgridApiKey: string;

}


export const environment: Environment = {
  production: false,
  sendgridApiKey: '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'  // Reemplaza esto con tu API key real de SendGrid
};