import { Component, OnInit, Inject } from '@angular/core';
import { detectBody } from 'app/app.helpers';
import { DOCUMENT } from '@angular/platform-browser';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class LayoutComponent implements OnInit {

  layoutMenu: any;
  constructor(@Inject(DOCUMENT) private document: Document, private authService: AuthService) { }
  public ngOnInit(): any {
    detectBody();
    this.document.body.classList.remove('skin-1');
    this.document.body.classList.remove('skin-3');
    this.document.body.classList.add(this.authService.getTheme());
  }

  public onResize() {
    detectBody();
  }
}
