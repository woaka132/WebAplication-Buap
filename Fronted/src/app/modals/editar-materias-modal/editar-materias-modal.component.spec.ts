import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMateriasModalComponent } from './editar-materias-modal.component';

describe('EditarMateriasModalComponent', () => {
  let component: EditarMateriasModalComponent;
  let fixture: ComponentFixture<EditarMateriasModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarMateriasModalComponent]
    });
    fixture = TestBed.createComponent(EditarMateriasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
