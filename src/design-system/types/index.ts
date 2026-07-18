import type { ColorToken } from '../tokens/colors';
import type { SpacingToken } from '../tokens/spacing';
import type { RadiusToken } from '../tokens/radius';
import type { ShadowToken } from '../tokens/shadows';
import type { MotionToken } from '../tokens/motion';
import type { TypographyToken } from '../tokens/typography';
import type { BreakpointToken } from '../tokens/breakpoints';
import type { ZIndexToken } from '../tokens/zIndex';

export interface DesignSystemTokens {
  colors: ColorToken;
  spacing: SpacingToken;
  radius: RadiusToken;
  shadows: ShadowToken;
  motion: MotionToken;
  typography: TypographyToken;
  breakpoints: BreakpointToken;
  zIndex: ZIndexToken;
}
