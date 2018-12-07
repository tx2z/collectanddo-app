import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectedPage } from './collected.page';

describe('CollectedPage', () => {
  let component: CollectedPage;
  let fixture: ComponentFixture<CollectedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
