import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { ApiService } from '../shared/api.service';

import { MustMatch } from '../_helpers/must-match.validator';
import { UserModel } from './user-dash board.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  loginForm!: FormGroup;
  userModelObj: UserModel = new UserModel();
  userData!: any;
  showAdd!: boolean;
  showUpdate!: boolean;
  constructor(private formBuilder: FormBuilder, private api: ApiService) {}

  //json-server --watch db.json
  //json-server --watch db.json
  //json-server --watch db.json

  ngOnInit() {
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(7),
            Validators.pattern(/^[a-z][a-z0-9]*$/i),
          ],
        ],
        confirm_password: [
          '',
          [
            Validators.required,
            Validators.minLength(7),
            Validators.pattern(/^[a-z][a-z0-9]*$/i),
          ],
        ],
        nickname: [
          '',
          [Validators.required, Validators.pattern(/^[A-Za-z0-9-]+$/)],
        ],
        phone_number: [
          '',
          [
            Validators.required,
            Validators.minLength(9),
            Validators.pattern(/^\+380 ?[0-9]{9}$/),
          ],
        ],
        websites: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
            ),
          ],
        ],
        checkbox: [null],
      },
      { validator: MustMatch('password', 'confirm_password') }
    );

    this.getAllUser();
  }

  clickAddUser() {
    this.loginForm.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  postUserDetails() {
    this.userModelObj.email = this.loginForm.value.email;
    this.userModelObj.password = this.loginForm.value.password;
    this.userModelObj.confirm_password = this.loginForm.value.confirm_password;
    this.userModelObj.nickname = this.loginForm.value.nickname;
    this.userModelObj.phone_number = this.loginForm.value.phone_number;
    this.userModelObj.websites = this.loginForm.value.websites;

    this.api.postUser(this.userModelObj).subscribe(
      (res) => {
        console.log(res);
        alert('User Added Successfully');
        let ref = document.getElementById('cancel');
        ref?.click();
        this.loginForm.reset();
        this.getAllUser();
      },
      (err) => {
        alert('Something Went Wrong');
      }
    );
  }
  getAllUser() {
    this.api.getUser().subscribe((res) => {
      this.userData = res;
    });
  }

  deleteUser(row: any) {
    let txt;
    let ask = confirm(
      'This action will remove a user with this email: ' +
        row.email +
        'are you shure?'
    );
    if (ask == true) {
      txt = 'You pressed OK!';

      this.api.deleteUsers(row.id).subscribe((res) => {
        this.getAllUser();
      });
    } else {
      txt = 'You pressed Cancel!';
    }
  }

  onEdit(row: any) {
    this.showAdd = false;
    this.showUpdate = true;

    this.userModelObj.id = row.id;

    this.loginForm.controls['email'].setValue(row.email);
    this.loginForm.controls['password'].setValue(row.password);
    this.loginForm.controls['confirm_password'].setValue(row.confirm_password);
    this.loginForm.controls['nickname'].setValue(row.nickname);
    this.loginForm.controls['phone_number'].setValue(row.phone_number);
    this.loginForm.controls['websites'].setValue(row.websites);
  }

  uptadeUserDetails() {
    this.userModelObj.email = this.loginForm.value.email;
    this.userModelObj.password = this.loginForm.value.password;
    this.userModelObj.confirm_password = this.loginForm.value.confirm_password;
    this.userModelObj.nickname = this.loginForm.value.nickname;
    this.userModelObj.phone_number = this.loginForm.value.phone_number;
    this.userModelObj.websites = this.loginForm.value.websites;

    this.api
      .updateUsers(this.userModelObj, this.userModelObj.id)
      .subscribe((res) => {
        alert('Updated Successfully');
        let ref = document.getElementById('cancel');
        ref?.click();
        this.loginForm.reset();
        this.getAllUser();
      });
  }
}
