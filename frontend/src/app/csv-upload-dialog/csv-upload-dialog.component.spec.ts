import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvUploadDialogComponent } from './csv-upload-dialog.component';

describe('CsvUploadDialogComponent', () => {
  let component: CsvUploadDialogComponent;
  let fixture: ComponentFixture<CsvUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsvUploadDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
