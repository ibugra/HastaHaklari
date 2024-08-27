import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HastaHaklariComponent } from './hasta-haklari.component';

describe('HastaHaklariComponent', () => {
  let component: HastaHaklariComponent;
  let fixture: ComponentFixture<HastaHaklariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HastaHaklariComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HastaHaklariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
