export interface Environment {
  production: boolean;
  sendgridApiKey: string;
}


export const environment: Environment = {
  production: false,
  sendgridApiKey: ' '  // Reemplaza esto con tu API key real de SendGrid
};