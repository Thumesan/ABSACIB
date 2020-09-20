import { Component, OnInit, Input, Output } from '@angular/core';
import { ContactModel } from '../Models/contactModel';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PhonebookService } from '../Services/phonebook.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  FormData: FormGroup;
  isDeleted = false;
  showAlert = false;
  successMessage = '';
  private _selectedContact: ContactModel;

  @Output() loadContacts: EventEmitter<any> = new EventEmitter();

  @Input() set selectedContact(contact: ContactModel) {
    this.isDeleted = false;
    this._selectedContact = contact;
    this.buildForm(this._selectedContact);
  }

  isChanged = false;
  constructor(private builder: FormBuilder, private phonebookService: PhonebookService) {}

  ngOnInit() {
    this.buildForm(this.selectedContact);
  }

  get selectedContact(): ContactModel {
    return this._selectedContact;
  }

  buildForm(selectedContact) {
    this.FormData = this.builder.group({
      Firstname: new FormControl(selectedContact.first_name, [Validators.required]),
      Lastname: new FormControl(selectedContact.last_name, [Validators.required]),
      Phonenumber: new FormControl(selectedContact.phone_number, [Validators.required]),
    });
  }

  get f() { return this.FormData.controls; }

  deleteContact(selectedContact: ContactModel) {
    const contactId = selectedContact.id;
    this.phonebookService.DeleteContact(contactId).subscribe(() => {
      this.showAlert = true;
      this.isDeleted = true;
      this.successMessage = 'Contact deleted successfully';
      this.f.Firstname.setValue('');
      this.f.Lastname.setValue('');
      this.f.Phonenumber.setValue('');
      this.loadContacts.emit();
    }, (err) => {
      this.showAlert = true;
      this.successMessage = 'An error occurred, contact not deleted.';
      console.log(err);
    });
  }

  editContact() {
    const contactToChange: ContactModel = {
      id: this.selectedContact.id,
      first_name: this.f.Firstname.value,
      last_name: this.f.Lastname.value,
      phone_number: this.f.Phonenumber.value
    };
    this.phonebookService.EditContact(contactToChange).subscribe(() => {
      this.showAlert = true;
      this.successMessage = 'Successfully saved changes to contact.';
      this.loadContacts.emit();
    }, (err) => {
      this.showAlert = true;
      this.successMessage = 'An error occurred, contact did not update.';
      console.log(err);
    });
  }

  identifyChange() {
    if (this.f.Firstname.value !== this.selectedContact.first_name ||
      this.f.Lastname.value !== this.selectedContact.last_name ||
      this.f.Phonenumber.value !== this.selectedContact.phone_number) {
      this.isChanged = true;
    } else {
      this.isChanged = false;
    }
  }
}
