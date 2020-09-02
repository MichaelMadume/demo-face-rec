import { Component, OnInit } from '@angular/core';
import { VisitorRegisterationService } from 'src/app/shared/services/visitor-registeration.service';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.page.html',
  styleUrls: ['./completed.page.scss'],
})
export class CompletedPage implements OnInit {

  hostName: string;

  constructor(
    private visRegService: VisitorRegisterationService,
  ) { }

  ngOnInit() {
    this.hostName = this.visRegService.visit.hostName.split(' ')[0];
  }

}
