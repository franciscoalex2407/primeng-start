import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(public toast: ToastrService) {}

  public toastError(msg = '', title = '') {
    this.toast.error(msg, title, {
      enableHtml: true,
      progressBar: true,
    });
  }
  public toastWarning(msg = '', title = '') {
    this.toast.warning(msg, title, {
      enableHtml: true,
      progressBar: true,
    });
  }
  public toastSuccess(msg = '', title = '') {
    this.toast.success(msg, title, {
      enableHtml: true,
      progressBar: true,
    });
  }

  // presentAlert(message: string, title = 'Aviso!', size = '4') {
  //   const dialogRef = this.dialog.open<any>(AlertComponent, {
  //     width: '95%',
  //     maxWidth: '450px',
  //     maxHeight: '90%',
  //     data: {
  //       title,
  //       message,
  //       size,
  //     },
  //   });

  //   return dialogRef;
  // }

  // presentAlertError(message: string, title = 'Aviso!', size = '4') {
  //   const dialogRef = this.dialog.open<any>(AlertComponent, {
  //     width: '95%',
  //     maxWidth: '450px',
  //     maxHeight: '90%',
  //     data: {
  //       title,
  //       message,
  //       size,
  //       type: 'error',
  //     },
  //   });

  //   return dialogRef;
  // }

  // presentAlertConfirm(message: string, title = 'Aviso!', options: any = {}) {
  //   const dialogRef = this.dialog.open<any>(AlertConfirmComponent, {
  //     width: '95%',
  //     maxWidth: '500px',
  //     maxHeight: '90%',
  //     data: {
  //       ...options,
  //       title,
  //       message,
  //     },
  //   });

  //   return dialogRef;
  // }

  // presentAlertPrompt(
  //   message: string,
  //   title = 'Aviso!',
  //   input: InputProps = {}
  // ) {
  //   const dialogRef = this.dialog.open<any>(AlertPromptComponent, {
  //     width: '95%',
  //     maxWidth: '450px',
  //     maxHeight: '90%',
  //     data: {
  //       title,
  //       message,
  //       input,
  //     },
  //   });

  //   return dialogRef;
  // }
}
