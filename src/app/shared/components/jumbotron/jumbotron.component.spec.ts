import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JumbotronComponent } from './jumbotron.component';

describe('JumbotronComponent', () => {
  let component: JumbotronComponent;
  let fixture: ComponentFixture<JumbotronComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [JumbotronComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JumbotronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
