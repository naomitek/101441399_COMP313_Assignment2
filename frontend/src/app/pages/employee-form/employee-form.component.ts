import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  selectedImage: string = '';
  editMode: boolean = false;
  employeeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['Male', Validators.required],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      salary: ['', Validators.required],
      date_of_joining: ['', Validators.required],
    });
  
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { [key: string]: any };
    const id = this.route.snapshot.paramMap.get('id');
  
    if (state?.['employee']) {
      this.populateForm(state['employee']);
    } else if (id) {
      this.editMode = true;
      this.employeeId = id;
      this.employeeService.getEmployees().subscribe({
        next: (result: any) => {
          const employee = result.data.getAllEmployees.find((e: any) => e.id === id);
          if (employee) this.populateForm(employee);
        },
        error: (err) => console.error('Error loading employee:', err)
      });
    }
  }
  
  populateForm(emp: any) {
    this.editMode = true;
    this.employeeId = emp.id;
  
    const formattedDate = emp.date_of_joining
      ? emp.date_of_joining.substring(0, 10)
      : '';
  
    this.employeeForm.patchValue({
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      gender: emp.gender,
      designation: emp.designation,
      department: emp.department,
      salary: emp.salary,
      date_of_joining: formattedDate,
    });
  
    this.selectedImage = emp.employee_photo || '';
  }
  
  

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const data = {
        ...this.employeeForm.value,
        salary: parseFloat(this.employeeForm.value.salary),
        employee_photo: this.selectedImage,
      };

      if (this.editMode && this.employeeId) {
        this.employeeService.updateEmployee(this.employeeId, data).subscribe(() => {
          alert('Employee updated!');
          this.router.navigate(['/employees']);
        });
      } else {
        this.employeeService.addEmployee(data).subscribe(() => {
          alert('Employee added!');
          this.router.navigate(['/employees']);
        });
      }
    }
  }

  cancel() {
    this.location.back();
  }
}
