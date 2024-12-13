import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatenedorBomberoComponent } from './matenedor-bombero.component';

describe('MatenedorBomberoComponent', () => {
  let component: MatenedorBomberoComponent;
  let fixture: ComponentFixture<MatenedorBomberoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatenedorBomberoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatenedorBomberoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
