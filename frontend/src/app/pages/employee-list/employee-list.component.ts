import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { EmployeeService } from '../../services/employee.service';
import gql from 'graphql-tag';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  loggedInUserEmail: string = '';
  searchDepartment: string = '';
  searchDesignation: string = '';

  constructor(
    private employeeService: EmployeeService, 
    private router: Router,
    private apollo: Apollo 
  ) {}

  ngOnInit(): void {
    this.getLoggedInUserEmail();
    this.employeeService.getEmployees().subscribe({
      next: (result: any) => this.employees = result.data.getAllEmployees,
      error: (err) => console.error('Error loading employees:', err)
    });
  }

  getLoggedInUserEmail() {

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          this.loggedInUserEmail = decodedToken.username || '';
          console.log('Logged in as:', this.loggedInUserEmail);
        } catch (err) {
          console.error('Invalid token');
        }
      }
    }
  }

  searchEmployees() {
    const SEARCH_QUERY = gql`
      query searchEmployee($department: String, $designation: String) {
        searchEmployee(department: $department, designation: $designation) {
          id
          first_name
          last_name
          email
          designation
          department
        }
      }
    `;
  
    this.apollo.query({
      query: SEARCH_QUERY,
      variables: {
        department: this.searchDepartment || null,
        designation: this.searchDesignation || null
      },
      fetchPolicy: 'no-cache'
    }).subscribe({
      next: (result: any) => {
        this.employees = result.data.searchEmployee;
      },
      error: (err) => {
        console.error('Search failed:', err);
      }
    });
  }

  resetSearch() {
    this.searchDepartment = '';
    this.searchDesignation = '';
    this.ngOnInit();
  }
  
  
  

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  viewDetails(id: string) {
    this.router.navigate(['/employees/details', id]);
  }

  editEmployee(emp: any) {
    this.router.navigate(['/employees/edit', emp.id], {
      state: { employee: emp }
    });
  }
  
  

  addEmployee() {
    this.router.navigate(['/employees/add']);
  }

  deleteEmployee(id: string) {
    const confirmed = confirm('Are you sure you want to delete this employee?');
    if (confirmed) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          alert('Employee deleted');
          this.ngOnInit();
        },
        error: (err) => alert('Error deleting employee: ' + err.message)
      });
    }
  }
  
}