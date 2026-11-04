import { useGlobalState } from '../../context/GlobalStateContext';

/**
 * Heading + optional description for a homepage section, from the published Website Studio
 * homepage (or the draft, inside the token-gated preview). Blank title = the built-in heading.
 */
export function useHomeSectionCopy(sectionId: string, defaultTitle: string, defaultSubtitle = '') {
  const { homepageConfig } = useGlobalState();
  const section = homepageConfig?.sections?.find((s) => s.id === sectionId);
  return {
    title: section?.title?.trim() || defaultTitle,
    subtitle: section?.subtitle?.trim() || defaultSubtitle,
  };
}
