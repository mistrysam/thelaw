import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2DebounceModule } from 'ng2-debounce';
import { CaseListComponent } from './case-list/case-list.component';
import { SharedModule } from 'app/shared/shared.module';
import { CaseService } from './case.service';
import { caseRouting } from 'app/modules/case/case.routing';
import { CaseAddComponent } from './case-add/case-add.component';
import { ContactService } from '../contact/contact.service';
import { CaseChangeStatusComponent } from './case-change-status/case-change-status.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { BootstrapModalModule, Modal } from 'ngx-modialog/plugins/bootstrap';
import { CommunicationListComponent } from './case-communication/communication-list/communication-list.component';
import { CommunicationDetailComponent } from './case-communication/communication-detail/communication-detail.component';
import { TimeTrackingListComponent } from './time-tracking/time-tracking-list/time-tracking-list.component';
import { TimeTrackingDetailComponent } from './time-tracking/time-tracking-detail/time-tracking-detail.component';
import { NoteListComponent } from './case-note/note-list/note-list.component';
import { NoteDetailComponent } from './case-note/note-detail/note-detail.component';
import { CommunicationDashboardComponent } from './case-communication/communication-dashboard/communication-dashboard.component';
import { DocumentListComponent } from './case-document/document-list/document-list.component';
import { DocumentDetailComponent } from './case-document/document-detail/document-detail.component';
import { PopoverModule } from "ngx-popover";
import { CaseAppealTypeDetailComponent } from './case-appeal-type-detail/case-appeal-type-detail.component';
import { CaseEvidenceListComponent } from './case-evidence-list/case-evidence-list.component';
import { CaseEvidenceDetailComponent } from './case-evidence-detail/case-evidence-detail.component';
import { JudgeDetailComponent } from './judge-detail/judge-detail.component';
import { ContactQuickAddComponent } from './contact-quick-add/contact-quick-add.component';
import { DataTableModule } from 'primeng/datatable';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { ChipsModule } from 'primeng/chips';
import { CourtDetailComponent } from './court-detail/court-detail.component';
import { TaskCategoryDetailComponent } from './task-category/task-category-detail/task-category-detail.component';
import { StageDetailComponent } from './stage/stage-detail/stage-detail.component';
import { CaseHistoryComponent } from './case-history/case-history.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    caseRouting,
    AngularMultiSelectModule,
    BootstrapModalModule,
    PopoverModule,
    DataTableModule,
    CalendarModule,
    FileUploadModule,
    ChipsModule,
    Ng2DebounceModule
  ],
  declarations: [
    CaseListComponent,
    CaseAddComponent,
    CaseChangeStatusComponent,
    CommunicationListComponent,
    CommunicationDetailComponent,
    TimeTrackingDetailComponent,
    TimeTrackingListComponent,
    NoteListComponent,
    NoteDetailComponent,
    CommunicationDashboardComponent,
    DocumentListComponent,
    DocumentDetailComponent,
    CaseAppealTypeDetailComponent,
    CaseEvidenceListComponent,
    CaseEvidenceDetailComponent,
    JudgeDetailComponent,
    ContactQuickAddComponent,
    CourtDetailComponent,
    TaskCategoryDetailComponent,
    StageDetailComponent,
    CaseHistoryComponent
  ],
  providers: [
    CaseService,
    ContactService,
    Modal
  ],
  entryComponents: [
    CaseChangeStatusComponent,
    CaseAppealTypeDetailComponent,
    JudgeDetailComponent,
    ContactQuickAddComponent,
    CourtDetailComponent,
    TaskCategoryDetailComponent,
    StageDetailComponent
  ]
})
export class CaseModule { }
