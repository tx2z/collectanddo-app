import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss'],
})
export class AddButtonComponent implements OnInit {

  constructor(
    private router: Router
    ) { }

  ngOnInit() {}

  goToCollect() {
    this.router.navigate(['/collect']);
  }

  goToGroup() {
    this.router.navigate(['/collect']);
  }

  goToEvent() {
    this.router.navigate(['/event']);
  }
}
