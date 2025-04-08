import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private apollo: Apollo) {}

  getEmployees(): Observable<any> {
    return this.apollo.watchQuery({
      query: gql`
        query {
          getAllEmployees {
            id
            first_name
            last_name
            email
            gender
            salary
            department
            designation
            date_of_joining
            employee_photo
          }
        }
      `
    }).valueChanges;
  }

  addEmployee(data: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddEmployee(
          $first_name: String!
          $last_name: String!
          $email: String!
          $gender: String!
          $designation: String!
          $salary: Float!
          $date_of_joining: String!
          $department: String!
          $employee_photo: String
        ) {
          addEmployee(
            first_name: $first_name
            last_name: $last_name
            email: $email
            gender: $gender
            designation: $designation
            salary: $salary
            date_of_joining: $date_of_joining
            department: $department
            employee_photo: $employee_photo
          ) {
            id
          }
        }
      `,
      variables: { ...data },
    });
  }

  updateEmployee(id: string, data: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateEmployee(
          $id: ID!
          $first_name: String
          $last_name: String
          $email: String
          $designation: String
          $salary: Float
          $department: String
          $employee_photo: String
        ) {
          updateEmployee(
            id: $id
            first_name: $first_name
            last_name: $last_name
            email: $email
            designation: $designation
            salary: $salary
            department: $department
            employee_photo: $employee_photo
          ) {
            id
          }
        }
      `,
      variables: { id, ...data },
    });
  }

  deleteEmployee(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation DeleteEmployee($id: ID!) {
          deleteEmployee(id: $id)
        }
      `,
      variables: { id },
    });
  }

  getEmployeeById(id: string): Observable<any> {
    return this.apollo.query({
      query: gql`
        query ($id: ID!) {
          getEmployeeById(id: $id) {
            id
            first_name
            last_name
            email
            gender
            designation
            department
            salary
            date_of_joining
            employee_photo
          }
        }
      `,
      variables: { id }
    });
  }
}



