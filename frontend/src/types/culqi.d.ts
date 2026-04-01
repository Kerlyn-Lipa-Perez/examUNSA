// Tipos para CulqiCheckout v4
// https://docs.culqi.com/es/documentacion/checkout/v4/culqi-checkout

interface CulqiToken {
  id: string;
  email: string;
  card_number: string;
  creation_date: number;
  active: boolean;
}

interface CulqiError {
  type: string;
  user_message: string;
  merchant_message: string;
}

interface CulqiSettings {
  title: string;
  currency: string;
  amount: number;
  order?: string;
  xculqirsaid?: string;
  rsapublickey?: string;
}

interface CulqiOptions {
  lang?: string;
  installments?: boolean;
  paymentMethods?: {
    tarjeta?: boolean;
    yape?: boolean;
    bancaMovil?: boolean;
    agente?: boolean;
    billetera?: boolean;
    cuotealo?: boolean;
  };
  style?: {
    logo?: string;
    bannerColor?: string;
    buttonBackground?: string;
    menuColor?: string;
    linksColor?: string;
    buttonText?: string;
    buttonTextColor?: string;
    priceColor?: string;
  };
}

interface CulqiStatic {
  publicKey: string;
  settings: (settings: CulqiSettings) => void;
  options: (options: CulqiOptions) => void;
  open: () => void;
  close: () => void;
  token?: CulqiToken;
  order?: unknown;
  error?: CulqiError;
}

declare global {
  interface Window {
    Culqi: CulqiStatic;
    culqi: () => void;
  }
}

export {};
