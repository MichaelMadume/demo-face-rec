import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewVisitorPage } from './new-visitor.page';

describe('NewVisitorPage', () => {
  let component: NewVisitorPage;
  let fixture: ComponentFixture<NewVisitorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVisitorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewVisitorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
