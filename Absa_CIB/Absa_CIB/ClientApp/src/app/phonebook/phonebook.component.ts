import { Component, OnInit } from '@angular/core';
import { PhonebookService } from '../Services/phonebook.service';
import { ContactModel } from '../Models/contactModel';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AddContactRequest } from '../Models/AddContactRequest';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-phonebook',
  templateUrl: './phonebook.component.html',
  providers: [NgbModalConfig, NgbModal],
  styleUrls: ['./phonebook.component.css']
})
export class PhonebookComponent implements OnInit {
  phonebookContacts: ContactModel[];
  searchedContacts: ContactModel[];
  selectedContact: ContactModel;
  FormData: FormGroup;
  showAlert = false;
  successMessage = '';

  constructor(
    private phonebookService: PhonebookService,
    private modalService: NgbModal,
    private builder: FormBuilder) { }

  ngOnInit() {
    // Build Form
    this.buildForm();
    // Load All contacts
    this.loadContacts();
  }

  buildForm() {
    this.FormData = this.builder.group({
      Firstname: new FormControl('', [Validators.required]),
      Lastname: new FormControl('', [Validators.required]),
      Phonenumber: new FormControl('', [Validators.required]),
    });
  }

  public loadContacts() {
    this.phonebookContacts = [];
    this.searchedContacts = [];
    this.phonebookService.LoadContacts().subscribe((x: ContactModel[]) => {
      if (x !== undefined || x !== null) {
        x.forEach((contact) => {
          this.phonebookContacts.push(contact);
          this.searchedContacts = this.phonebookContacts.sort((a, b) => b.first_name > a.first_name ? -1 : 1);
        });
      }
    });
  }

  public setContact(contact: ContactModel) {
    this.selectedContact = contact;
  }

  open(content) {
    this.modalService.open(content);
  }

  get f() { return this.FormData.controls; }

  saveContact() {
    const addContactRequest: AddContactRequest = {
      first_name: this.f.Firstname.value,
      last_name: this.f.Lastname.value,
      phone_number: this.f.Phonenumber.value
    };

    this.phonebookService.AddContact(addContactRequest).subscribe(() => {
      this.showAlert = true;
      this.successMessage = 'Contact added successfully';
      this.buildForm();
      this.loadContacts();
      this.modalService.dismissAll();
    }, (err) => {
      console.log(err);
      this.showAlert = true;
      this.successMessage = 'An Error occurred, please try again.';
    });
  }

  searchContacts(searchText) {
    const lowerFilter = searchText.toLocaleLowerCase();
    this.searchedContacts = this.phonebookContacts.filter(
      (x: ContactModel) =>
        x.first_name.toLocaleLowerCase().includes(lowerFilter) ||
        x.last_name.toString().toLocaleLowerCase().includes(lowerFilter) ||
        x.phone_number.toString().toLocaleLowerCase().includes(lowerFilter)
    );
  }

}
