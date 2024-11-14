export interface Environment {
    production: boolean;
    sendgridApiKey: string;
  }
  

  export const environment: Environment = {
    production: false,
    sendgridApiKey: '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'  // Reemplaza esto con tu API key real de SendGrid
  };