import { Injectable } from '@angular/core';
import { HttpClientService } from 'app/lib/http/http-client.service';
import { Contact, Address } from 'app/models/contact';
import { Page, Sorting } from '../../models/page';
import { Subject } from 'rxjs/Subject';
import { environment } from 'environments/environment';
import { PageSize } from 'app/shared/constants';
@Injectable()
export class ContactService {
  deleteNotification = new Subject<boolean>();
  impNotification = new Subject<boolean>();

  constructor(private httpService: HttpClientService) { }

  getContactById(id: number) {
    return this.httpService.get('contact/GetContactById/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err.detail;
    });
  }

  getAddressByContactId(contactId: number) {
    return this.httpService.get('address/GetAddresssByContactId?contactId=' + contactId).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err.detail;
    });
  }

  getContacts() {
    return this.httpService.get('contact/getall').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  addOrUpdate(contactModel: Contact) {
    let url = ''
    if (contactModel.Id) {
      url = 'contact/update';
      return this.httpService.put(url, contactModel).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        else {
          throw 'We are facing some issue with server, Plesae try after some time.';
        }

      }).catch((err: any) => {
        throw err;
      })
    } else {
      url = 'contact/create';
      return this.httpService.post(url, contactModel).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        else {
          throw 'We are facing some issue with server, Plesae try after some time.';
        }

      }).catch((err: any) => {
        throw err;
      })
    }
  }

  addOrUpdateAddress(addressModel: Address) {
    let url = ''
    if (addressModel.Id) {
      url = 'address/update';
      return this.httpService.put(url, addressModel).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        else {
          throw 'We are facing some issue with server, Plesae try after some time.';
        }

      }).catch((err: any) => {
        throw err;
      })
    } else {
      url = 'address/create';
      return this.httpService.post(url, addressModel).map((res: any) => {
        if (res.Success) {
          return res.Result;
        }
        else {
          throw 'We are facing some issue with server, Plesae try after some time.';
        }

      }).catch((err: any) => {
        throw err;
      })
    }
  }

  deleteContact(id: number) {
    return this.httpService.delete('contact/delete/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  deleteAddress(id: number) {
    return this.httpService.delete('address/delete/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  deleteMobile(id: number) {
    return this.httpService.delete('mobile/delete/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  deleteEmail(id: number) {
    return this.httpService.delete('EmailAddress/delete/' + id).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getDashboardData() {
    return this.httpService.get('Contact/GetDashboardData').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err.detail;
    });
  }

  getNewlyAddedContacts() {
    return this.httpService.get('contact/GetNewAdded').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getContactsByType(type: string) {
    return this.httpService.get('contact/GetContactByType?type=' + type).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    })
  }

  contactSearch(term: string) {
    return this.httpService.get('Contact/GetContactsName?search=' + term).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  advocateSearch(term: string) {
    return this.httpService.get('Contact/GetAdvocate?search=' + term).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  clientSearch(term: string) {
    return this.httpService.get('Contact/GetClients?search=' + term).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  companySearch(term: string) {
    return this.httpService.get('Contact/GetCompany?search=' + term).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  associateSearch(term: string) {
    return this.httpService.get('Contact/GetAssociates?search=' + term).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getCountries() {
    return this.httpService.get('country/getall').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getStates(countryId: number) {
    return this.httpService.get('state/GetStateByCountryId/' + countryId).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getAllStates() {
    return this.httpService.get('state/GetAll').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getCities(stateId: number) {
    return this.httpService.get('City/GetCityStateById/' + stateId).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getAllCities() {
    return this.httpService.get('City/GetAll').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getCompanies() {
    return this.httpService.get('Companies/getall').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  uploadFileWithData(id: number, formData) {
    return this.httpService.postFormData('Contact/UploadPhoto/' + id, formData).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getContactPhoto(id: number) {
    return this.httpService.get(`Contact/GetPhoto/${id}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  deleteContactPhoto(id: number) {
    return this.httpService.get(`Contact/DeletePhoto/${id}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  contactFullTextSearch(text: string, page: Page, sort: Sorting) {
    const link = `page=${page.pageNumber}&pageSize=${page.size}&orderBy=${sort.columnName}&ascending=${sort.dir}
    &searchValue=${text}`;
    return this.httpService.get(`Contact/GetFullTextSearch?${link}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  getContactPageData(contactType: string, page: Page, sort: Sorting, filterColumn?: string,
    filterValue?: string, isImportant?: boolean) {
    if (contactType === 'Importants') {
      contactType = undefined;
      isImportant = true;
    }

    let filter = '';
    if (filterColumn) {
      filter += '&' + filterColumn + filterValue;
    }
    let url = `Contact/GetAllFilter?page=${page.pageNumber}&pageSize=${page.size}&orderBy=${sort.columnName}&ascending=${sort.dir}${filter}`;
    if (contactType) {
      url = url + `&type=${contactType}`;
    }
    if (isImportant) {
      url = url + `&isImportant=true`;
    }
    return this.httpService.get(url).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }
  toggleImportant(id) {
    return this.httpService.post(`Contact/MarkImportantContact/${id}`, {}).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }
  sendDeleteNotification() {
    this.deleteNotification.next(true);
  }

  getDeleteNotification() {
    return this.deleteNotification.asObservable();
  }

  sendImpNotification(isImp) {
    this.impNotification.next(isImp);
  }

  getImpNotification() {
    return this.impNotification.asObservable();
  }

  importDocument(formData: FormData) {
    return this.httpService.postFormData(`Contact/ImportContact`, formData).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    });
  }

  exportContacts() {
    window.open(`${environment.origin}Contact/ExportContact`, '_blank');
  }
}
