import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../_services/user.service';
import {RoleService} from '../_services/role.service';
import {User} from '../model/User';
import {ModalDirective} from 'ng-uikit-pro-standard';
import {AlertsService} from '../_services/alerts.service';
import swal from 'sweetalert';
import {ReloadPageService} from '../_services/reload-page.service';
import {isObject} from 'rxjs/internal-compatibility';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users = [];
  userForm: FormGroup;
  listRoles: any;
  errorMessage = '';
  isResetPasswordFailed = false;


  constructor(private userService: UserService,
              private roleService: RoleService,
              private alertsService: AlertsService,
              private reloadPageService: ReloadPageService) {
  }

  get password() {
    return this.userForm.get('password');
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllRole();

  }

  getAllUsers() {
    this.userService.getUsers().subscribe((data: any[]) => {
        this.users = data;
      },
      err => {
        this.users = JSON.parse(err.error).message;
      }
    );
  }

  getAllRole() {
    this.roleService.getRole().subscribe(data => {
        this.listRoles = data;
      },
      error => {
        console.log(error);
      });
  }

  editUserForm(user: User, modalDirective: ModalDirective) {
    modalDirective.toggle();

    const userRoleSelected = this.listRoles.find(i => i.id === user.roleSet[0].id);

    this.userForm = new FormGroup({
      id: new FormControl(user.id),
      name: new FormControl(user.name),
      lastName: new FormControl(user.lastName),
      email: new FormControl(user.email),
      password: new FormControl('', Validators.required),
      roleSet: new FormControl(user.roleSet)
    });

    this.userForm.get('roleSet').setValue(userRoleSelected);
  }

  resetPassword(modalDirective: ModalDirective): void {

    const index = this.users.findIndex(user => user.id === this.userForm.value.id);
    this.users[index] = this.userForm.value;
    const id = this.users[index].id;

    const userRoleSelected = this.listRoles.find(i => i.id === this.users[index].roleSet.id);
    this.userForm.value.roleSet = [userRoleSelected];

    this.userService.editUserById(id, this.users[index]).subscribe(response => {

        modalDirective.toggle();
        this.alertsService.success();

        this.isResetPasswordFailed = false;
        this.reloadPageService.reload();

      },
      err => {
        this.errorMessage = err.error.message;
        this.isResetPasswordFailed = true;
      });
  }

  editUser(modalDirective: ModalDirective): void {

    const index = this.users.findIndex(user => user.id == this.userForm.value.id);
    this.users[index] = this.userForm.value;
    const id = this.users[index].id;

    const userRoleSelected = this.listRoles.find(i => i.id === this.users[index].roleSet.id);
    this.userForm.value.roleSet = [userRoleSelected];

    console.log(this.userForm.value.roleSet = [userRoleSelected]);

    this.userService.editUserById(id, this.users[index]).subscribe(response => {
        this.alertsService.success();
        modalDirective.toggle();
        this.reloadPageService.reload();

      },
      err => {
        console.log(err);
      });

  }

  deleteUser(user: User, idTable: number) {

    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this registration!',
      icon: 'warning',
      buttons: ['Cancel', 'Ok'],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {

          const index = this.users.findIndex(obj => obj.id = user.id);
          const id = this.users[index].id;

          this.userService.deleteUser(id).subscribe(response => {
              this.reloadPageService.reload();
            },
            error => {
              console.log(error);
            });

          this.users.splice(idTable, 1);

          swal('Your registration/file has been deleted!', {
            icon: 'success',
          });
        }
      });

  }

  selectedObject(event) {
    if (this.userForm.value.roleSet instanceof isObject){
      this.userForm.value.roleSet = [event];
    }
  }
}
