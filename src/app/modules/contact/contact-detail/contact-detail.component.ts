import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DropDownModel } from 'app/models/DropDownModel';
import { Contact, Address, Mobile, Email } from 'app/models/contact';
import { ContactService } from '../contact.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { ContactType, AddressType, DealOn, ContactTitle, NoImagePath, AddressTypeDD } from 'app/shared/constants';
import { Overlay } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html'
})
export class ContactDetailComponent implements OnInit {
  model: Contact = new Contact();
  isLoading: boolean = false;
  public paramId: any;
  TitleDropDown: Array<DropDownModel> = ContactTitle;
  ContactTypeDropDown: Array<DropDownModel> = ContactType;
  DealOnDropDown: Array<DropDownModel> = DealOn;
  AddressTypeDropDown: Array<DropDownModel> = AddressTypeDD;
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  companies: any[] = [];
  fileToUpload: File = null;
  url: any = NoImagePath;
  addressSet = [{ Id: undefined, Address1: '', State: undefined, City: undefined, PostCode: '', Country: undefined, IsPrimary: true, IsDeleted: false, ContactId: undefined, AddressType: 'Home' }];
  emailSet = [{ Id: undefined, EmailId: '', IsPrimary: true, IsDeleted: false }];
  visibleEmail: number = 0;
  mobileSet = [{ Id: undefined, MobileNumber: '', IsPrimary: true, IsDeleted: false, isDisabled: true, tempId: 1, MobileType: "home" }];
  validFileType: boolean = true;
  CompanyId;
  isDisabled: boolean = false;
  isViewMode: boolean = false;
  EmailError: string;
  ContactError: string;
  AddressError: string;
  isImportant: boolean = false;
  constructor(private route: ActivatedRoute, private contactService: ContactService, private router: Router,
    private _notify: NotificationService, private modalDialog: Modal, private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.route.url.subscribe(segment => {
      this.isViewMode = segment.some(x => x.path.toLocaleLowerCase() === "view");
      if(segment.some(x => x.path.toLocaleLowerCase() !== "new"))
      {
        this.addressSet.pop();
      }
    });
    this.model.ContactType = this.ContactTypeDropDown[0].Id;
    this.model.Title = this.TitleDropDown[0].Id;
    this.model.IsImportant = false;
    this.model.Address = [];
    this.model.EmailAddress = [];
    this.model.MobileNumbers = [];
    this.route.params.subscribe(param => this.paramId = param["id"]);
    this.contactService.getCountries().subscribe(res => {
      this.countries = res;
    });

    this.contactService.getCompanies().subscribe(res => {
      this.companies = res;
    });

    this.contactService.getAllCities().subscribe(res => {
      this.cities = res;
    });

    this.contactService.getAllStates().subscribe(res => {
      this.states = res;
    });

    if (this.paramId.toString() != "new") {
      this.contactService.getContactById(this.paramId).subscribe(
        response => {
          this.model = <Contact>response;
          this.CompanyId = response.CompanyName;

          if (this.model.MobileNumbers.length) {
            this.mobileSet = [];
          }
          if (this.model.EmailAddress.length) {
            this.emailSet = [];
          }


          this.model.Address.forEach(element => {
            this.addressSet.push({
              Address1: element.Address1,
              Id: element.Id,
              City: element.CityId,
              IsDeleted: false,
              IsPrimary: element.IsPrimary,
              PostCode: element.PostCode,
              State: element.State,
              Country: element.CountryId,
              ContactId: this.paramId === 'new' ? undefined : +this.paramId,
              AddressType: element.AddressType
            });
          });

          this.model.EmailAddress.forEach(element => {
            this.emailSet.push({
              Id: element.Id,
              IsDeleted: false,
              IsPrimary: element.IsPrimary,
              EmailId: element.EmailId
            });
          });

          this.model.MobileNumbers.forEach((element, index) => {
            this.mobileSet.push({
              Id: element.Id,
              IsDeleted: false,
              IsPrimary: element.IsPrimary,
              MobileNumber: element.MobileNumber,
              isDisabled: false,
              tempId: index + 1,
              MobileType: element.MobileType
            });
          });
        }, err => {
          this._notify.error(err.Result);
        });

      this.contactService.getContactPhoto(this.paramId).subscribe(
        response => {
          if (response) {
            this.url = "data:image/png;base64," + response;
          }
        }, error => {
          this._notify.error(error.result);
        });

    }
  }

  CountryChanges(countryId: number) {
    this.contactService.getStates(countryId).subscribe(res => {
      this.states = res;
    });
  }

  StateChanges(stateId: number) {
    this.contactService.getCities(stateId).subscribe(res => {
      this.cities = res;
    });
  }

  addAddress() {
    let isEmpty = false;
    this.addressSet.forEach(element => {
      if (!element.Address1 && !element.IsDeleted) {
        isEmpty = true;
      }
    });
    if (!isEmpty) {
      this.AddressError = '';
      this.addressSet.push({ Id: undefined, Address1: '', State: undefined, City: undefined, PostCode: '', Country: undefined, IsPrimary: false, IsDeleted: false, ContactId: undefined, AddressType: 'Home' });
    } else {
      // this._notify.error('Please fill all added address');
      this.AddressError = 'Please fill all added address';
    }
  }

  addEmail() {
    let isEmpty = false;
    this.emailSet.forEach(element => {
      if (!element.EmailId && !element.IsDeleted) {
        isEmpty = true;
      }
    });
    if (!isEmpty) {
      this.EmailError = '';
      this.emailSet.push({ Id: undefined, EmailId: '', IsPrimary: false, IsDeleted: false });
    } else {
      // this._notify.error('Please fill all added email');
      this.EmailError = 'Please fill all added email';
    }
  }

  addMobile() {
    let isEmpty = false;
    this.mobileSet.forEach(element => {
      if (!element.MobileNumber && !element.IsDeleted) {
        isEmpty = true;
      }
    });
    if (!isEmpty) {
      this.ContactError = '';
      // const isPrimary = this.mobileSet.some(x => x.IsPrimary === true);
      this.mobileSet.push({
        Id: undefined, MobileNumber: '', IsPrimary: false, IsDeleted: false, isDisabled: false, tempId: this.mobileSet.length + 1,
        MobileType: "home"
      });
    } else {
      //this._notify.error('Please fill all added contact number(s)'); 
      this.ContactError = 'Please fill all added contact number(s)';
    }
  }

  _keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  validations() {
    let isEmpty = false;
    this.mobileSet.forEach(element => {
      if (!element.MobileNumber && !element.IsDeleted) {
        isEmpty = true;
      }
    });
    if (isEmpty) {
      this._notify.error('Please fill all added contact number(s)');
      return false;
    }
    this.emailSet.forEach(element => {
      if (!element.EmailId && !element.IsDeleted) {
        isEmpty = true;
      }
    });
    if (isEmpty) {
      this._notify.error('Please fill all added email');
      return false;
    }
    this.addressSet.forEach(element => {
      if (!element.Address1 && !element.IsDeleted) {
        isEmpty = true;
      }
    });
    if (isEmpty) {
      this._notify.error('Please fill all added address');
      return false;
    }
    return true;
  }

  addCompany()
  {
    alert(1);
  }
  setimportantcontact()
  {
    this.isImportant = !this.isImportant;
  }

  save() {
    if (!this.validations()) {
      return;
    }
    this.isLoading = true;
    this.addressSet.forEach(address => {
      if (address.Id) { 
        if (address.IsDeleted) {
          this.contactService.deleteAddress(address.Id).subscribe(res => { });
        } else {
          const addressModel: Address = {
            Id: address.Id,
            Address1: address.Address1,
            CityId: address.City,
            CountryId: address.Country,
            IsPrimary: address.IsPrimary,
            State: address.State,
            PostCode: address.PostCode,
            AddressType: address.AddressType,
            ContactId: this.paramId === 'new' ? undefined : +this.paramId,
            IsActive: true
          }
          if (address.City && address.State && address.Country) {
            this.model.Address.push(addressModel);
          }
        }
      } else {
        const addressModel: Address = {
          Id: undefined,
          Address1: address.Address1,
          CityId: address.City,
          CountryId: address.Country,
          IsPrimary: address.IsPrimary,
          State: address.State,
          PostCode: address.PostCode,
          AddressType: address.AddressType,
          ContactId: this.paramId === 'new' ? undefined : +this.paramId,
          IsActive: true
        }
        if (address.City && address.State && address.Country) {
          this.model.Address.push(addressModel);
        }
      }
    });

    this.mobileSet.forEach(mobile => {
      if (mobile.Id) {
        if (mobile.IsDeleted) {
          this.contactService.deleteMobile(mobile.Id).subscribe(res => { });
        } else {
          const mobileModel: Mobile = {
            Id: mobile.Id,
            MobileNumber: mobile.MobileNumber,
            IsPrimary: mobile.IsPrimary,
            MobileType: mobile.MobileType,
            ContactId: this.paramId === 'new' ? undefined : +this.paramId,
            IsActive: true
          }
          if (mobileModel.MobileNumber) {
            this.model.MobileNumbers.push(mobileModel);
          }
        }
      } else {
        const mobileModel: Mobile = {
          Id: undefined,
          MobileNumber: mobile.MobileNumber,
          IsPrimary: mobile.IsPrimary,
          MobileType: mobile.MobileType,
          ContactId: this.paramId === 'new' ? undefined : +this.paramId,
          IsActive: true
        }
        if (mobileModel.MobileNumber) {
          this.model.MobileNumbers.push(mobileModel);
        }
      }
    });

    this.emailSet.forEach(email => {
      if (email.Id) {
        if (email.IsDeleted) {
          this.contactService.deleteMobile(email.Id).subscribe(res => { });
        } else {
          const emailModel: Email = {
            Id: email.Id,
            EmailId: email.EmailId,
            IsPrimary: email.IsPrimary,
            ContactId: this.paramId === 'new' ? undefined : +this.paramId,
            IsActive: true
          }
          if (emailModel.EmailId) {
            this.model.EmailAddress.push(emailModel);
          }
        }
      } else {
        const emailModel: Email = {
          Id: undefined,
          EmailId: email.EmailId,
          IsPrimary: email.IsPrimary,
          ContactId: this.paramId === 'new' ? undefined : +this.paramId,
          IsActive: true
        }
        if (emailModel.EmailId) {
          this.model.EmailAddress.push(emailModel);
        }
      }
    });

    this.contactService.addOrUpdate(this.model).subscribe(
      response => {
        this.isLoading = false;
        if (response) {
          if (this.fileToUpload && this.fileToUpload.name) {
            const formData = new FormData();
            formData.append("Photo", this.fileToUpload);
            return this.contactService.uploadFileWithData(response.Id, formData).subscribe(res => {
              this._notify.success(` Contact ${this.paramId === 'new' ? 'added' : 'updated'} successfully.`);
              if (this.paramId !== "new") {
                setTimeout(() => {
                  this.router.navigate(['../../contact'], { relativeTo: this.route });
                });
              }
            }, error => {
              this._notify.error(error.Result);
            });
          }
          if (this.paramId === 'new') {
            this._notify.success("Contact added successfully.");
          }
          else {
            this._notify.success("Contact updated successfully.");
          }

          setTimeout(() => {
            this.router.navigate(['../../contact'], { relativeTo: this.route });
          });
        }
      }, err => {
        this.isLoading = false;
        this._notify.error(err.Result);
      });
  }

  toggleIsImportant() {
    this.model.IsImportant = !this.model.IsImportant;
  }

  companySearch(term: string) {
    return this.contactService.companySearch(term);
  }

  autocompleListFormatter = (data: any) => {
    let html = `<span>${data.CompanyName}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  onSelectCompany(item: any) {
    if (item) {
      this.model.CompanyId = item.Id;
    } else {
      this.model.CompanyId = undefined;
    }
  }

  onFileChange(event: any) {
    const target = event.target || event.srcElement;
    const files: FileList = target.files;
    if (files.length > 0) {
      if (files[0].type == "image/jpg" || files[0].type == "image/jpeg" || files[0].type == "image/png") {
        this.validFileType = true;
        this.fileToUpload = files[0];
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.url = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);

        if (this.paramId !== "new") {
          const formData = new FormData();
          formData.append("Photo", this.fileToUpload);
          this.contactService.uploadFileWithData(this.paramId, formData).subscribe(response => {
            if (response) {
              this._notify.success("Conact photo uploaded successfully");
            }
          }, error => { this._notify.error(error.result); })
        }
      } else {
        this.validFileType = false;
      }
    }
  }

  deletePhoto() {
    if (this.paramId !== "new") {
      let x = this.modalDialog.confirm()
        .size('sm')
        .title('Delete Contact Photo')
        .body(`Are you sure want to delete Contact Photo?`)
        .open().result.then(result => {
          if (result === true) {
            this.contactService.deleteContactPhoto(this.paramId).subscribe(response => {
              if (response) {
                this._notify.success("Photo deleted successfullyodal")
                this.url = NoImagePath;
                this.fileToUpload = null;
              }
            }, error => {
              this._notify.error(error.result);
            });
          }
        });
    } else {
      this.url = NoImagePath;
      this.fileToUpload = null;
    }
  }

  changeIsPrimary(data: any) {
    data.isPrimary = !data.isPrimary;
    // if (!data.IsPrimary) {
    //   this.mobileSet.forEach(x => x.isDisabled = false);
    // } else {
    //   this.mobileSet.filter(x => x.tempId !== data.tempId).forEach(y => y.isDisabled = true);
    // }
  }

}
