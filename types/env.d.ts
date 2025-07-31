declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_LISK_NODE_URL: string;
      EXPO_PUBLIC_WHATSAPP_TOKEN: string;
      EXPO_PUBLIC_WHATSAPP_PHONE_ID: string;
      EXPO_PUBLIC_WALLET_PASSPHRASE: string;
    }
  }
}

export {};