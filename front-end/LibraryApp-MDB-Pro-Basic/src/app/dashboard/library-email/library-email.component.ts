import {Component, HostListener, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LibraryEmailService} from '../../_services/library-email.service';
import {ReloadPageService} from '../../_services/reload-page.service';
import {AlertsService} from '../../_services/alerts.service';

@Component({
  selector: 'app-library-email',
  templateUrl: './library-email.component.html',
  styleUrls: ['./library-email.component.scss']
})
export class LibraryEmailComponent implements OnInit {

  contactForm: FormGroup;
  disabledSubmitButton = true;
  optionsSelect: Array<any>;

  constructor(fb: FormBuilder,
              private libraryEmailService: LibraryEmailService,
              private reloadPageService: ReloadPageService,
              private alertService: AlertsService) {
    this.contactForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      subject: ['', Validators.required],
      emailBody: ['', Validators.required],
    });
  }

  get email() {
    return this.contactForm.get('email');
  }

  get subjects() {
    return this.contactForm.get('subject');
  }

  get message() {
    return this.contactForm.get('emailBody');
  }

  @HostListener('input') oninput() {
    if (this.contactForm.valid) {
      this.disabledSubmitButton = false;
    }
  }

  ngOnInit() {
    this.getOptionsSelected();
  }

  getOptionsSelected() {
    this.optionsSelect = [
      {value: 'Feedback', label: 'Feedback'},
      {value: 'Report a bug', label: 'Report a bug'},
      {value: 'Feature request', label: 'Feature request'},
      {value: 'Other stuff', label: 'Other stuff'},
    ];
  }

  onSubmit() {
    this.libraryEmailService.saveAndSendEmail(this.contactForm.value).subscribe(response => {
        this.alertService.success();
        this.reloadPageService.reload();

      },
      error => {
        console.log(JSON.parse(error.message).message);
      });
  }
}
