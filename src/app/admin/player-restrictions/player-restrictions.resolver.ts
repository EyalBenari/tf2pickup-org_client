import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { map, Observable } from 'rxjs';
import { PlayerRestrictions } from './player-restrictions';
import { Tf2ClassName } from '@app/shared/models/tf2-class-name';

@Injectable({
  providedIn: 'root',
})
export class PlayerRestrictionsResolver implements Resolve<PlayerRestrictions> {
  constructor(private readonly configurationService: ConfigurationService) {}

  resolve(): Observable<PlayerRestrictions> {
    return this.configurationService
      .fetchValues<
        [boolean, number, boolean, Partial<Record<Tf2ClassName, number>>]
      >(
        'players.etf2l_account_required',
        'players.minimum_in_game_hours',
        'queue.deny_players_with_no_skill_assigned',
        'queue.minimum_skill_thresholds',
      )
      .pipe(
        map(
          ([
            etf2lAccountRequired,
            minimumTf2InGameHours,
            denyPlayersWithNoSkillAssigned,
            minimumSkillThresholds,
          ]) => ({
            etf2lAccountRequired: etf2lAccountRequired.value,
            minimumTf2InGameHours: minimumTf2InGameHours.value,
            denyPlayersWithNoSkillAssigned:
              denyPlayersWithNoSkillAssigned.value,
            minimumSkillThresholds: minimumSkillThresholds.value,
          }),
        ),
      );
  }
}
