import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { ConfirmationService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class PromptUpdateService {
  constructor(
    private swUpdate: SwUpdate,
    private confirmationService: ConfirmationService
  ) {}

  checkUpdates() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(
          filter(
            (evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'
          )
        )
        .subscribe((evt) => {
          this.promptUser().then((userConfirmed) => {
            if (userConfirmed) {
              // Reload the page to update to the latest version.
              document.location.reload();
            }
          });
        });
    }
  }

  promptUser(): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        header: 'Atenção',
        message: `Nova versão disponível`,
        acceptIcon: ' ',
        acceptLabel: 'Ok',
        rejectVisible: false,
        // rejectButtonStyleClass: 'p-button-outlined',
        // icon: 'pi pi-sync',
        accept: () => resolve(true), // User accepted the update
        reject: () => resolve(false), // User declined the update
      });
    });
  }
}
