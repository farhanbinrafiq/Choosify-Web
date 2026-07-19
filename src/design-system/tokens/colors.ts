/**
 * Choosify 3.0 / DS-2.0 color tokens
 * Canonical source — align with `src/index.css` @theme and Tailwind theme extensions.
 */

export const colors = {
  brand: {
    orange: {
      /** Choosify 3.0 primary */
      primary: '#EB4501',
      deep: '#EB4501',
      /** Legacy alias used widely in JSX */
      legacy: '#EB4501',
      hover: '#CF4400',
      tint: '#FFF0E8',
      surface: '#FFF8F4',
    },
    navy: {
      DEFAULT: '#000435',
      heading: '#1A1D4E',
      ink: '#0A0A1F',
      chrome: '#0A0A1F',
    },
    accent: {
      green: '#07DD05',
      royalBlue: '#2323FF',
      alertRed: '#FF000D',
      playRed: '#E02424',
      discoverGradient: 'linear-gradient(90deg,#6C4CFF,#EB4501)',
    },
  },
  chrome: {
    headerBg:
      'radial-gradient(900px 200px at 15% 0%, hsla(22,100%,50%,0.16), transparent 70%),radial-gradient(700px 200px at 90% 100%, hsla(12,92%,45%,0.12), transparent 70%),rgba(10,10,31,0.94)',
    footerBg:
      'radial-gradient(1200px 500px at 15% 0%, hsla(22,100%,50%,0.18), transparent 65%),radial-gradient(900px 500px at 90% 20%, hsla(12,92%,45%,0.14), transparent 65%),rgba(10,10,31,0.96)',
    border: 'rgba(255,255,255,0.07)',
  },
  surface: {
    white: '#FFFFFF',
    feed: '#F0F8FF',
    ice: '#F0F8FF',
    muted: '#F7F8FA',
    softBlue: '#F4F8FC',
    softOrange: '#FFF9F5',
    selected: '#FFF0E8',
    profileMenu: '#F4F7F9',
  },
  border: {
    DEFAULT: '#e8edf2',
    subtle: '#eef2f6',
    blueGrey: '#D6E1EC',
  },
  text: {
    heading: '#1a1a2e',
    body: '#1A1D4E',
    muted: '#8a9bb0',
    inverse: '#FFFFFF',
  },
} as const;

export type ColorToken = typeof colors;
