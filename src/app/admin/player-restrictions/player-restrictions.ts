import { Tf2ClassName } from '@app/shared/models/tf2-class-name';

export interface PlayerRestrictions {
  etf2lAccountRequired: boolean;
  minimumTf2InGameHours: number;
  denyPlayersWithNoSkillAssigned: boolean;
  minimumSkillThresholds: Partial<Record<Tf2ClassName, number>>;
}
