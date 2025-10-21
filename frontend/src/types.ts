export enum AuthProvider {
  Google = 'Google',
  GitHub = 'GitHub',
  WhatsApp = 'WhatsApp',
}

export interface User {
  name: string;
  provider: AuthProvider;
}
