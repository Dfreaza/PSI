import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteDeletionComponent } from './website-deletion.component';

describe('WebsiteDeletionComponent', () => {
  let component: WebsiteDeletionComponent;
  let fixture: ComponentFixture<WebsiteDeletionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebsiteDeletionComponent]
    });
    fixture = TestBed.createComponent(WebsiteDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
