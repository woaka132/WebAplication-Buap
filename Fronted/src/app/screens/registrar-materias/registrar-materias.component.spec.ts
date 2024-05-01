import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarMateriasComponent } from './registrar-materias.component';

describe('RegistrarMateriasComponent', () => {
  let component: RegistrarMateriasComponent;
  let fixture: ComponentFixture<RegistrarMateriasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrarMateriasComponent]
    });
    fixture = TestBed.createComponent(RegistrarMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
