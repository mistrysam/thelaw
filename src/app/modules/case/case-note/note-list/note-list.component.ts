import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseService } from 'app/modules/case/case.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { Case } from 'app/models/case';
import { FilterModel, Sorting, Page } from 'app/models/page';
import { PageSize } from 'app/shared/constants';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html'
})
export class NoteListComponent implements OnInit {
  rows = [];
  public page: Page = new Page();
  loadingIndicator: boolean = false;
  sorting: Sorting = new Sorting();
  reorderable: boolean = true;
  filterModel: FilterModel[] = [{
    columnName: 'NotesBy',
    value: ''
  }, {
    columnName: 'Subject',
    value: ''
  }];

  CaseId: number;
  caseDetail: Case = new Case();
  pageSize: number = PageSize;
  constructor(private route: ActivatedRoute, private caseService: CaseService,
    public router: Router,
    private _notify: NotificationService) {
    this.page.pageNumber = 0;
    this.page.size = 5;
  }

  ngOnInit() {
    this.route.params.subscribe(param => this.CaseId = param['caseId']);
    this.caseService.getCaseById(this.CaseId).subscribe(response => {
      this.caseDetail = response;
    }, error => {

    });
    this.sorting = { columnName: "NoteDate", dir: false };
  }

  setPage(event) {
    if (event.sortField) {
      this.sorting = { columnName: event.sortField, dir: event.sortOrder === 1 };
    } else {
      this.sorting = { columnName: "NoteDate", dir: false };
    }
    let filterColumnString = "";
    let searchValue = ""
    if (event.filters) {
      filterColumnString = 'columnName=';
      searchValue = '&searchValue=';
      this.page.pageNumber = 0;

      Object.keys(event.filters).forEach(key => {
        filterColumnString += `${key},`;
        searchValue += `${event.filters[key].value},`;
      });
      filterColumnString = filterColumnString.slice(0, -1);
      searchValue = searchValue.slice(0, -1);
    }
    setTimeout(() => this.getDataSource(filterColumnString, searchValue), 0);
  }

  getDataSource(filterColumn?: string, filterValue?: string) {
    this.loadingIndicator = true;
    this.caseService.getNotesByCaseIdPageData(this.CaseId, this.page, this.sorting, filterColumn, filterValue).subscribe(pagedData => {
      this.loadingIndicator = false;
      this.page.totalElements = pagedData.TotalNumberOfRecords;
      this.page.totalPages = pagedData.TotalNumberOfPages;
      this.page.pageNumber = pagedData.PageNumber;
      this.rows = pagedData.Results;
    });
  }

  onSort(sort: any) {
    this.loadingIndicator = true;
    if (sort && sort.sorts[0]) {
      this.sorting = {
        columnName: sort.sorts[0].prop,
        dir: sort.sorts[0].dir === 'asc'
      };
    }
    return this.getDataSource();
  }

  filterData(event) {
    const target = event.target;
    let filter = this.filterModel.filter(x => x.value.length >= 2);
    if (filter.length) {
      let filterColumnString = 'columnName=';
      let searchValue = '&searchValue='
      filter.forEach((model) => {
        filterColumnString += model.columnName + ",";
        searchValue += model.value + ",";
      });
      filterColumnString = filterColumnString.substring(0, filterColumnString.length - 1);
      searchValue = searchValue.substring(0, searchValue.length - 1);
      this.getDataSource(filterColumnString, searchValue);
    } else {
      this.getDataSource();
    }
  }


  editClick(id) {
    this.router.navigate([`./${id}`], { relativeTo: this.route });
  }

  deleteClick(id) {
    if (confirm('Are you sure you want to delete this note?')) {
      this.caseService.deleteNote(id).subscribe(
        response => {
          this.rows = this.rows.filter(row => {
            return row.Id !== id;
          });
        }, err => {
          this._notify.error(err.Result);
        });
    }
  }

  createNewNote() {
    this.router.navigate([`./new`], { relativeTo: this.route });
  }

  paginate(event) {
    this.page.size = event.rows;
    if (!event.first) {
      this.page.pageNumber = 0;
    } else {
      this.page.pageNumber = event.first / this.page.size;
    }
  }

  markImportant(data) {
    this.loadingIndicator = true;
    this.caseService.markNoteAsImportant(data.Id).subscribe(res => {
      if (res) {
        //data.IsImportant = data.IsImportant ? false : true;
        data.IsImportant = !data.IsImportant;
        this.caseService.sendImpNotification(data.IsImportant);
        this.loadingIndicator = false;
      }
    }, error => {
      this.loadingIndicator = false;
      this._notify.error('Something went wrong, Please try again');
    });
  }
}
