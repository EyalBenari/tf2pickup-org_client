import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { race, Subject } from 'rxjs';
import { MDCSwitch } from '@material/switch';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay } from '@angular/cdk/overlay';
import { MinimumTf2InGameHoursDialogComponent } from './minimum-tf2-in-game-hours-dialog/minimum-tf2-in-game-hours-dialog.component';
import { Location } from '@angular/common';
import { map, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Data } from '@angular/router';
import { PlayerRestrictions } from './player-restrictions';
import { queueClassNames, queueLoading } from '@app/queue/queue.selectors';
import { Store } from '@ngrx/store';
import { Tf2ClassName } from '@app/shared/models/tf2-class-name';

@Component({
  selector: 'app-player-restrictions',
  templateUrl: './player-restrictions.component.html',
  styleUrls: ['./player-restrictions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerRestrictionsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  minimumSkillThresholdsForm = this.formBuilder.group<
    Partial<Record<Tf2ClassName, FormControl<number>>>
  >({});
  form = this.formBuilder.group({
    etf2lAccountRequired: [false],
    minimumTf2InGameHours: [0],
    denyPlayersWithNoSkillAssigned: [false],
  });
  queueClasses = this.store.select(queueClassNames);
  queueLoading = this.store.select(queueLoading);

  @ViewChild('etf2lAccountRequiredSwitch')
  etf2lAccountRequiredControl: ElementRef;

  @ViewChild('denyPlayersWithNoSkillAssignedSwitch')
  denyPlayersWithNoSkillAssignedControl: ElementRef;

  private etf2lAccountRequiredSwitch: MDCSwitch;
  private denyPlayersWithNoSkillAssignedSwitch: MDCSwitch;
  private destroyed = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private configurationService: ConfigurationService,
    private changeDetector: ChangeDetectorRef,
    private overlay: Overlay,
    private location: Location,
    private route: ActivatedRoute,
    private store: Store,
  ) {}

  ngOnInit() {
    this.route.data
      .pipe(
        map<Data, PlayerRestrictions>(data => data.playerRestrictions),
        takeUntil(this.destroyed),
      )
      .subscribe(
        ({
          etf2lAccountRequired,
          minimumTf2InGameHours,
          denyPlayersWithNoSkillAssigned,
          minimumSkillThresholds,
        }) => {
          this.form.patchValue({
            etf2lAccountRequired,
            minimumTf2InGameHours,
            denyPlayersWithNoSkillAssigned,
          });
          this.minimumSkillThresholdsForm.patchValue(minimumSkillThresholds);
          this.changeDetector.markForCheck();
        },
      );
  }

  ngAfterViewInit() {
    this.etf2lAccountRequiredSwitch = new MDCSwitch(
      this.etf2lAccountRequiredControl.nativeElement,
    );
    this.denyPlayersWithNoSkillAssignedSwitch = new MDCSwitch(
      this.denyPlayersWithNoSkillAssignedControl.nativeElement,
    );
  }

  ngOnDestroy() {
    this.etf2lAccountRequiredSwitch.destroy();
    this.denyPlayersWithNoSkillAssignedSwitch.destroy();
    this.destroyed.next();
    this.destroyed.complete();
  }

  save() {
    this.configurationService
      .storeValues(
        {
          key: 'players.etf2l_account_required',
          value: this.etf2lAccountRequired,
        },
        {
          key: 'players.minimum_in_game_hours',
          value: this.minimumTf2InGameHours,
        },
        {
          key: 'queue.deny_players_with_no_skill_assigned',
          value: this.denyPlayersWithNoSkillAssigned,
        },
        {
          key: 'queue.minimum_skill_thresholds',
          value: this.minimumSkillThresholds,
        },
      )
      .subscribe(() => this.location.back());
  }

  updateEtf2lAccountRequired() {
    this.form.patchValue({
      etf2lAccountRequired: !this.etf2lAccountRequired,
    });
    this.form.markAsDirty();
    this.changeDetector.markForCheck();
  }

  updateDenyPlayersWithNoSkillAssigned() {
    this.form.patchValue({
      denyPlayersWithNoSkillAssigned: !this.denyPlayersWithNoSkillAssigned,
    });
    this.form.markAsDirty();
    this.changeDetector.markForCheck();
  }

  updateSkillThreshold() {
    console.log('ASDASD');
    this.form.markAsDirty();
    this.changeDetector.markForCheck();
  }

  openMinimumTf2InGameHoursDialog() {
    const overlay = this.overlay.create();
    const portal = new ComponentPortal(MinimumTf2InGameHoursDialogComponent);
    const component = overlay.attach(portal);

    component.instance.minimumTf2InGameHours = this.minimumTf2InGameHours;
    component.instance.accept.subscribe(minimumTf2InGameHours => {
      this.form.patchValue({ minimumTf2InGameHours });
      this.form.markAsDirty();
      this.changeDetector.markForCheck();
    });

    race(component.instance.accept, component.instance.cancel).subscribe(() => {
      overlay.dispose();
    });
  }

  get etf2lAccountRequired(): boolean {
    return this.form.get('etf2lAccountRequired').value;
  }

  get minimumTf2InGameHours(): number {
    return this.form.get('minimumTf2InGameHours').value;
  }

  get denyPlayersWithNoSkillAssigned(): boolean {
    return this.form.get('denyPlayersWithNoSkillAssigned').value;
  }

  get minimumSkillThresholds(): Partial<Record<Tf2ClassName, number>> {
    return this.minimumSkillThresholdsForm.value;
  }
}
