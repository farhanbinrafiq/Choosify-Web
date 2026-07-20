import { cn } from '../lib/utils';

/** Shared shell for cart preview, filter popup, and other floating panels.
 *  Radius/shadow aligned to Choosify.dc.html filter panel (16px / deep shadow).
 */
export const floatingPanelShellClass =
  'bg-white border border-[#E8EDF2] shadow-[0_20px_50px_rgba(0,0,0,0.28)] flex flex-col overflow-hidden font-sans';

export const floatingPanelDesktopClass =
  'w-[min(24rem,calc(100vw-1.5rem))] max-h-[min(32rem,calc(100vh-10rem))] rounded-2xl';

export const floatingPanelTabletClass =
  'fixed bottom-4 left-1/2 w-[min(24rem,calc(100vw-1.5rem))] max-h-[70vh] rounded-2xl z-[250]';

export const floatingPanelMobileClass =
  'fixed bottom-0 left-0 right-0 h-[72vh] rounded-t-2xl z-[250] w-full pointer-events-auto';

export function getFloatingPanelClassName(options: {
  isMobile: boolean;
  isTablet: boolean;
  textClass?: string;
  relativeDesktop?: boolean;
}) {
  const { isMobile, isTablet, textClass = 'text-[#1A1A2E]', relativeDesktop = true } = options;

  return cn(
    floatingPanelShellClass,
    textClass,
    'pointer-events-auto',
    isMobile
      ? floatingPanelMobileClass
      : isTablet
        ? floatingPanelTabletClass
        : cn(relativeDesktop ? 'relative' : 'fixed', floatingPanelDesktopClass),
  );
}
