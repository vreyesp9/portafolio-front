import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorUsuarioComponent } from './mantenedor-usuario.component';

describe('MantenedorUsuarioComponent', () => {
  let component: MantenedorUsuarioComponent;
  let fixture: ComponentFixture<MantenedorUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenedorUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenedorUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
