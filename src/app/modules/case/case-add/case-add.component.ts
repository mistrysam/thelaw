import { Component, OnInit } from '@angular/core';
import { CaseService } from '../case.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ContactService } from '../../contact/contact.service';
import { Case } from 'app/models/case';
import { DropDownModel } from 'app/models/dropDownModel';
import { CaseType, CasePriority, WorkedAs, BillingFrequencies, CasePricingType } from 'app/shared/constants';

import { Observable } from 'rxjs/Observable';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BSModalContext, Modal } from 'ngx-modialog/plugins/bootstrap';
import { overlayConfigFactory } from 'ngx-modialog';
import { CaseAppealTypeDetailComponent } from 'app/modules/case/case-appeal-type-detail/case-appeal-type-detail.component';
import { JudgeDetailComponent } from 'app/modules/case/judge-detail/judge-detail.component';
import { ContactQuickAddComponent } from 'app/modules/case/contact-quick-add/contact-quick-add.component';
import { CourtDetailComponent } from '../court-detail/court-detail.component';

@Component({
  selector: 'app-case-add',
  templateUrl: './case-add.component.html'
})
export class CaseAddComponent implements OnInit {
  public paramId: any;
  courts: any[] = [];
  judges: any[] = [];
  associates: any[] = [];
  offices: any[] = [];
  selectedJudges: any[] = [];
  selectedAssociates: any[] = [];
  CaseAppealTypeDropDown: any[] = [];
  CaseStatusDropDown: any[] = [];
  model: Case = new Case();
  CaseTypeDropDown: Array<DropDownModel> = CaseType;
  PriorityDropDown: Array<DropDownModel> = CasePriority;
  WorkedAsDropDown: Array<DropDownModel> = WorkedAs;
  BillingFrequencyDropDown: Array<DropDownModel> = BillingFrequencies;
  ClientId; OpponentContactId; OppnentAdvocateId; WitnessContactId; JugmentFavourId;
  isLoading: boolean = false;
  settings = {};
  associatesSettings = {};
  taskTimeTrackingId: number;
  contactType: string;
  otherCaseStatus: string;
  casePricingType: Array<DropDownModel> = CasePricingType;
  isViewModel: boolean;
  currentYear = new Date().getFullYear();
  constructor(private route: ActivatedRoute, private caseService: CaseService, private _notify: NotificationService,
    private contactService: ContactService, private _sanitizer: DomSanitizer, private router: Router, private modal: Modal) { }

  ngOnInit() {
    this.route.url.subscribe(segment => {
      this.isViewModel = segment.some(x => x.path.toLocaleLowerCase() === "view");
    });
    this.model.CaseYear = new Date().getFullYear();
    this.settings = {
      singleSelection: false,
      text: "Select Judges",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      badgeShowLimit: 3,
      enableSearchFilter: true,
      disabled: this.isViewModel === true
    }
    this.associatesSettings = {
      singleSelection: false,
      text: "Select Associates",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      badgeShowLimit: 3,
      enableSearchFilter: true,
      disabled: this.isViewModel === true
    };
    this.route.params.subscribe(param => this.paramId = param["id"]);
    this.model.NotifyMe = true;

    this.caseService.getCaseAppealTypes().subscribe(res => {
      this.CaseAppealTypeDropDown = res;
    });
    this.caseService.getCaseStatusList().subscribe(res => {
      this.CaseStatusDropDown = res;
    });
    this.caseService.getCourtsDD().subscribe(res => {
      this.courts = res;
    }, err => {
      this._notify.error(err.Result);
    });

    this.caseService.getAllAssociates().subscribe(res => {
      this.associates = [];
      res.forEach(element => {
        this.associates.push({ id: element.Id, itemName: element.FirstName + " " + element.LastName });
      });
    }, err => {
      this._notify.error(err.Result);
    });
    this.caseService.getJudgesDD().subscribe(res => {
      res.forEach(element => {
        this.judges.push({ id: element.Id, itemName: element.FirstName + ' ' + element.LastName });
      });

    }, err => {
      this._notify.error(err.Result);
    });
    this.model.PricingType = CasePricingType[0].Id;
    this.model.BillingFrequency = BillingFrequencies[1].Id;
    if (this.paramId.toString() != "new") {
      this.caseService.getCaseById(this.paramId).subscribe(
        response => {
          this.model = <Case>response;
          this.OpponentContactId = response.OpponentContactName;
          this.OppnentAdvocateId = response.OppnentAdvocateName;
          this.WitnessContactId = response.WitnessContactName;
          this.JugmentFavourId = response.JugmentFavourToName;
          this.judges.forEach(element => {
            if (response.JudgeIds.indexOf(element.id) != -1) {
              this.selectedJudges.push(element);
            }
          });

          this.associates.forEach(element => {
            if (response.AssociatesId.indexOf(element.id) != -1) {
              this.selectedAssociates.push(element);
            }
          });

          if (this.model.ClientId) {
            this.contactService.getContactById(this.model.ClientId).subscribe(res => {
              this.ClientId = res.FirstName + ' ' + res.LastName;
            });
            this.getOfficeAddresses(this.model.ClientId);
          }
          this.otherCaseStatus = '';
          if (this.model.CaseStatus.startsWith('Other')) {
            this.otherCaseStatus = (this.model.CaseStatus.split('-')).length > 0 ? this.model.CaseStatus.split('-')[1] : '';
            this.model.CaseStatus = 'Other';
          }
        }, err => {
          this._notify.error(err.Result);
        });
      this.caseService.getTimeTrackingByCaseId(this.paramId).subscribe(response => {
        this.taskTimeTrackingId = response.length ? response[response.length - 1].Id : undefined;
      }, error => {
        this._notify.error(error.Result);
      });
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

  autocompleListFormatter = (data: any) => {
    let html = `<span>${data.Name} - ${data.ContactType ? data.ContactType : ''} </span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  contactSearch(term: string): Observable<any[]> {
    return this.contactService.contactSearch(term);
  }

  advocateSearch(term: string) {
    return this.contactService.advocateSearch(term);
  }

  getOfficeAddresses(contactId: number) {
    this.contactService.getAddressByContactId(contactId).subscribe(res => {
      res.forEach(element => {
        if (element.AddressType === 'Office')
          this.offices.push(element);
      });
    }, err => {
      this._notify.error(err.Result);
    });
  }

  onSelectClient(item: any) {
    if (item && ((this.OpponentContactId && item.Id === this.OpponentContactId.Id) ||
      (this.OppnentAdvocateId && item.Id === this.OppnentAdvocateId.Id))) {
      this._notify.error("Client and Oppnent should not be same person!");
      this.ClientId = "";
      return;
    }
    if (item) {
      this.getOfficeAddresses(item.Id);
      this.model.ClientId = item.Id;
    } else {
      this.model.ClientId = undefined;
    }
  }

  onSelectOponent(item: any) {
    if (item && item.Id === this.ClientId.Id) {
      this._notify.error("Client and Oppnent should not be same person!");
      this.OpponentContactId = "";
      return;
    }
    if (item) {
      this.model.OpponentContactId = item.Id;
    } else {
      this.model.OpponentContactId = undefined;
    }
  }

  onSelectOponentAdvocate(item: any) {
    if (item && item.Id === this.ClientId.Id) {
      this._notify.error("Client and Oppnent should not be same person!");
      this.OppnentAdvocateId = "";
      return;
    }
    if (item) {
      this.model.OppnentAdvocateId = item.Id;
    } else {
      this.model.OppnentAdvocateId = undefined;
    }
  }

  onSelectWitness(item: any) {
    if (item) {
      this.model.WitnessContactId = item.Id;
    } else {
      this.model.WitnessContactId = undefined;
    }
  }

  onSelectJugmentFavourTo(item: any) {
    if (item) {
      this.model.JugmentFavourTo = item.Id;
    } else {
      this.model.JugmentFavourTo = undefined;
    }
  }

  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  save() {
    if (this.model.CaseYear > this.currentYear) {
      return false;
    }
    this.isLoading = true;
    this.model.JudgeIds = [];
    this.model.AssociatesId = [];
    this.selectedAssociates.forEach(element => {
      this.model.AssociatesId.push(element.id);
    });
    if (this.model.CaseStatus === 'Other' && this.otherCaseStatus.length > 0) {
      this.model.CaseStatus = this.model.CaseStatus + '-' + this.otherCaseStatus;
    }
    this.selectedJudges.forEach(element => {
      this.model.JudgeIds.push(element.id);
    });
    this.caseService.addOrUpdate(this.model).subscribe(
      response => {
        this.isLoading = false;
        if (response) {
          if (this.paramId === 'new') {
            this._notify.success("Case added successfully.");
          }
          else {
            this._notify.success("Case updated successfully.");
          }

          setTimeout(() => {
            this.router.navigate(['../../'], { relativeTo: this.route });
          });
        }
      }, err => {
        this.isLoading = false;
        this._notify.error(err.Result);
      });
  }

  onCancelClick() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  appAppealType() {
    const resul = this.modal.open(CaseAppealTypeDetailComponent, overlayConfigFactory({ caseModel: this.model }, BSModalContext));
    resul.result.then(res => {
      if (res) {
        this.caseService.getCaseAppealTypes().subscribe(res => {
          this._notify.success("New Appeal created successfully!");
          this.CaseAppealTypeDropDown = res;
        });
      }
    });
  }

  appJugge() {
    const resul = this.modal.open(JudgeDetailComponent, overlayConfigFactory({ caseModel: this.model }, BSModalContext));
    resul.result.then(res => {
      if (res) {
        this.judges = [];
        this._notify.success("New Judge added successfully!");
        this.caseService.getJudgesDD().subscribe(res => {
          res.forEach(element => {
            this.judges.push({ id: element.Id, itemName: element.FirstName + ' ' + element.LastName });
          });
        });
      }
    });
  }

  addCourt() {
    const resul = this.modal.open(CourtDetailComponent, overlayConfigFactory({ caseModel: this.model }, BSModalContext));
    resul.result.then(res => {
      if (res) {
        this.courts = [];
        this._notify.success("New Court added successfully!");
        this.caseService.getCourtsDD().subscribe(res => {
          this.courts = res;
        });
      }
    });
  }

  addClient() {
    this.contactType = "Client";
    this.openQuickAddPopup();
  }

  addAssociates() {
    this.contactType = "Associates";
    this.openQuickAddPopup();
  }

  addOpponentContact() {
    this.contactType = "Opponent";
    this.openQuickAddPopup();
  }

  addOpponentAdvocate() {
    this.contactType = "Advocate";
    this.openQuickAddPopup();
  }

  openQuickAddPopup() {
    const resul = this.modal.open(ContactQuickAddComponent, overlayConfigFactory({ contactType: this.contactType }, BSModalContext));
    resul.result.then(res => {
      if (res) {
        this._notify.success(`New ${this.contactType} successfully!`);
      }
    });
  }

  getAssociates(event) {
    // this.caseService.searchAssociateName(event.target.value).subscribe(res => {
    //   this.associates = [];
    //   res.forEach(element => {
    //     this.associates.push({ id: element.Id, itemName: element.Name });
    //   });

    // }, err => {
    //   this._notify.error(err.Result);
    // });
  }

  changeDoctNo() {
    this.model.DoctNumber = `${this.model.CaseNo}-${this.model.CaseYear}`;
  }

  redirectToContact(id: number) {
    this.router.navigate([`../../contact/${id}`], { relativeTo: this.route });
  }

}
