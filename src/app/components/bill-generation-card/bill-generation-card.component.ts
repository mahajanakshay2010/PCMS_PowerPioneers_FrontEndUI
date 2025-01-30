import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SearchplanService } from '../../services/searchplan.service';

@Component({
  selector: 'app-bill-generation-card',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    CommonModule // Import CommonModule for pipes like currency
  ],
  templateUrl: './bill-generation-card.component.html',
  styleUrls: ['./bill-generation-card.component.css']
})
export class BillGenerationCardComponent implements OnInit {
  billForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private searchplanService: SearchplanService,
    public dialogRef: MatDialogRef<BillGenerationCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.billForm = this.fb.group({
      userplanid: [{ value: '', disabled: true }, Validators.required],
      planPrice: [{ value: 0, disabled: true }, Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      totalPrice: [{ value: 0, disabled: true }],
      dueDate: []
    });
  }

  ngOnInit(): void {
    this.loadBillDetails();
  }
  
  loadBillDetails(): void {
    const userPlanId = this.data.userPlanId; // Get the userPlanId from the injected data
    const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    this.searchplanService.generateBill(userId, userPlanId).subscribe(response => {
      const formattedDueDate = new Date(response.dueDate).toISOString().split('T')[0];
      this.billForm.patchValue({
        // userplanid: response.userPlanId,
        planPrice: response.pricePerUnit,
        quantity: response.units_consumed,
        totalPrice: response.totalCost,
        // dueDate: formattedDueDate
      });
    });
  }

  onDownload(): void {
    // Logic to download the bill
    console.log('Bill downloaded:', this.billForm.value);
    const doc = new jsPDF();
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Generation Bill', 10, 10);

    // Add bill details
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Userplan ID: ${this.billForm.get('userplanid')?.value}`, 10, 20);
    doc.text(`Cost per Unit: ${this.billForm.get('planPrice')?.value}`, 10, 30);
    doc.text(`Quantity: ${this.billForm.get('quantity')?.value}`, 10, 40);
    doc.text(`Total: ${this.billForm.get('totalPrice')?.value}`, 10, 50);

    // Save the pdf
    doc.save('bill.pdf');
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}