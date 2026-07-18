import type { SpotlightContent } from '../types/spotlight/experience/content';
import type { SpotlightRelatedExperienceBundle } from '../types/spotlight/graph/relatedExperience';
import { resolveRelatedContentStub } from './spotlightRelatedContent';
import { mapRelatedBundleToExperience } from '../types/spotlight/graph/relatedExperience';
import { buildPersonalizedRails } from './spotlightPersonalizedRails';

export function resolveRelatedExperience(
  source: SpotlightContent,
  allContent: SpotlightContent[],
): SpotlightRelatedExperienceBundle {
  const legacy = resolveRelatedContentStub(source, allContent);
  const sections = mapRelatedBundleToExperience(legacy);

  const announcements = allContent
    .filter((c) => c.contentType === 'announcement' && c.publisher.publisherId === source.publisher.publisherId)
    .slice(0, 4);
  if (announcements.length) {
    sections.push({
      kind: 'announcements',
      title: 'Related Announcements',
      entityIds: announcements.map((a) => a.sourceId),
      contentIds: announcements.map((a) => a.contentId),
    });
  }

  const events = allContent
    .filter((c) => c.contentType === 'event')
    .slice(0, 4);
  if (events.length) {
    sections.push({
      kind: 'events',
      title: 'Related Events',
      entityIds: events.map((e) => e.sourceId),
      contentIds: events.map((e) => e.contentId),
    });
  }

  const personalized = buildPersonalizedRails(allContent, [source.contentId]);
  for (const rail of personalized.slice(0, 3)) {
    sections.push({
      kind: 'recommendations',
      title: rail.title,
      entityIds: rail.contentIds,
      contentIds: rail.contentIds,
    });
  }

  return {
    sourceContentId: source.contentId,
    sourcePublisherId: source.publisher.publisherId,
    sections,
    generatedAt: new Date().toISOString(),
    strategy: 'graph_traversal',
  };
}
