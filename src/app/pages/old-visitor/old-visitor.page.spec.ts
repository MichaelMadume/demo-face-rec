import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OldVisitorPage } from './old-visitor.page';

describe('OldVisitorPage', () => {
  let component: OldVisitorPage;
  let fixture: ComponentFixture<OldVisitorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OldVisitorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OldVisitorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
