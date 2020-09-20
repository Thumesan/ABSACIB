import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { ContactModel } from '../Models/contactModel';
import { AddContactRequest } from '../Models/AddContactRequest';

@Injectable({
  providedIn: 'root'
})
export class PhonebookService {
  private api = environment.baseUrl + '/Phonebook';


  constructor(private http: HttpClient) { }

  public LoadContacts() {
    return this.http.get(this.api);
  }

  public AddContact(addContactRequest: AddContactRequest) {
    return this.http.post(this.api, addContactRequest);
  }

  public DeleteContact(contactId) {
    return this.http.delete(this.api + '/' + contactId);
  }

  public EditContact(contactToChange: ContactModel) {
    const contactId = contactToChange.id;
    return this.http.put(this.api + '/' + contactId, contactToChange);
  }
}
