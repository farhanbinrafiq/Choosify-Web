/** Official brand mark assets under /public/icons */

export const BRAND_ICON = {
  google: '/icons/google.svg',
  facebook: '/icons/facebook.svg',
  messenger: '/icons/messenger.png',
  instagram: '/icons/instagram.svg',
  linkedin: '/icons/linkedin.svg',
  tiktok: '/icons/tiktok.svg',
  youtube: '/icons/youtube.svg',
  telegram: '/icons/telegram.png',
  pinterest: '/icons/pinterest.png',
  twitter: '/icons/twitter.svg',
  snapchat: '/icons/snapchat.png',
  whatsapp: '/icons/whatsapp.svg',
} as const;

export const PAYMENT_ICON = {
  visa: '/icons/visa.svg',
  mastercard: '/icons/mastercard.svg',
  paypal: '/icons/paypal.png',
  amex: '/icons/amex.svg',
  applePay: '/icons/apple-pay.svg',
  googlePay: '/icons/google-pay.svg',
  bkash: '/icons/bkash.png',
  nagad: '/icons/nagad.png',
  ucb: '/icons/ucb.png',
  cityBank: '/icons/city-bank.png',
  bracBank: '/icons/brac-bank.png',
  easternBank: '/icons/eastern-bank.png',
  standardChartered: '/icons/standard-chartered.png',
} as const;

export const APP_STORE_ICON = {
  android: '/icons/android.png',
  apple: '/icons/apple.png',
  googlePlay: '/icons/google-play.png',
  appStore: '/icons/app-store.png',
} as const;

export type BrandIconKey = keyof typeof BRAND_ICON;
export type PaymentIconKey = keyof typeof PAYMENT_ICON;

export function socialIconSrc(platform: string): string | undefined {
  const n = platform.toLowerCase();
  if (n.includes('messenger')) return BRAND_ICON.messenger;
  if (n.includes('facebook')) return BRAND_ICON.facebook;
  if (n.includes('instagram')) return BRAND_ICON.instagram;
  if (n.includes('linkedin')) return BRAND_ICON.linkedin;
  if (n.includes('tiktok')) return BRAND_ICON.tiktok;
  if (n.includes('youtube')) return BRAND_ICON.youtube;
  if (n.includes('telegram')) return BRAND_ICON.telegram;
  if (n.includes('pinterest')) return BRAND_ICON.pinterest;
  if (n.includes('whatsapp')) return BRAND_ICON.whatsapp;
  if (n.includes('twitter') || n === 'x' || n.includes('x.com')) return BRAND_ICON.twitter;
  if (n.includes('snapchat')) return BRAND_ICON.snapchat;
  if (n.includes('google')) return BRAND_ICON.google;
  return undefined;
}
