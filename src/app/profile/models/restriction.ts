import { Tf2ClassName } from '@app/shared/models/tf2-class-name';

export interface Restriction {
  reason: 'account needs review' | 'player skill too low';
  gameClasses?: Tf2ClassName[];
}
