/**
 * Audience targeting model — architecture only, no filtering implementation.
 */

export type SpotlightGenderTarget = 'everyone' | 'male' | 'female' | 'non_binary' | 'unspecified';

export type SpotlightAgeGroup =
  | '13-17'
  | '18-24'
  | '25-34'
  | '35-44'
  | '45-54'
  | '55+'
  | 'all';

export type SpotlightAudienceSegment =
  | 'buyer'
  | 'seller'
  | 'business'
  | 'wholesale'
  | 'retail'
  | 'student'
  | 'professional'
  | 'gaming'
  | 'photography'
  | 'technology'
  | 'fashion'
  | string;

export interface SpotlightGeoTarget {
  country?: string;
  division?: string;
  district?: string;
  /** ISO 3166-2 or custom region codes */
  regionCodes?: string[];
}

export interface SpotlightAudienceTargeting {
  /** When true, all other targeting fields are ignored */
  everyone?: boolean;
  gender?: SpotlightGenderTarget;
  ageGroups?: SpotlightAgeGroup[];
  location?: SpotlightGeoTarget;
  segments?: SpotlightAudienceSegment[];
  /** Future custom segment IDs from audience platform */
  customSegmentIds?: string[];
}
