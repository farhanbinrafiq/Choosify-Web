import { cn } from '../lib/utils';

/** Shared shell for cart preview, filter popup, and other floating panels. */
export const floatingPanelShellClass =
  'bg-white border border-[#e8edf2] shadow-[0_24px_55px_rgba(0,0,0,0.16)] flex flex-col overflow-hidden font-sans';

export const floatingPanelDesktopClass =
  'w-[min(24rem,calc(100vw-1.5rem))] max-h-[min(32rem,calc(100vh-10rem))] rounded-[5px]';

export const floatingPanelTabletClass =
  'fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(24rem,calc(100vw-1.5rem))] max-h-[70vh] rounded-[5px] z-[250]';

export const floatingPanelMobileClass =
  'fixed bottom-0 left-0 right-0 h-[72vh] rounded-t-[5px] z-[250] w-full pointer-events-auto';

export function getFloatingPanelClassName(options: {
  isMobile: boolean;
  isTablet: boolean;
  textClass?: string;
  relativeDesktop?: boolean;
}) {
  const { isMobile, isTablet, textClass = 'text-[#1A1D4E]', relativeDesktop = true } = options;

  return cn(
    floatingPanelShellClass,
    textClass,
    isMobile
      ? floatingPanelMobileClass
      : isTablet
        ? floatingPanelTabletClass
        : cn(relativeDesktop ? 'relative' : 'fixed', floatingPanelDesktopClass),
  );
}
