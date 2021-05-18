import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisterModel } from 'src/app/models/register-model';
import { RegisterService } from 'src/app/services/register.service';
import { Users } from 'src/app/models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private service: RegisterService
  ) { }

  userForm: FormGroup;
  reg: RegisterModel;
  regex: RegExp;
  message: string;
  isbusy: boolean;
  messageValidate = {
    userName: {
      required: 'Required User Name',
      matchUserName: '',
    },
    email: {
      required: 'Required Email',
      notValid: 'The email you entered is not valid',
      matchEmail: ''
    },
    pass: {
      required: 'Required Password',
      minLength: 'The minimum password is 6 sections',
      notMatch: 'The password must contain an uppercase number,a lowercase letter, and a distinguished character',
    },
    passConfirm: {
      required: 'Confirm passwore is required',
      minLength: 'The minimum password is 6 sections',
      isMatch: 'The passwords do not match'
    }
  };

  ngOnInit() {
    this.isbusy = false;
    this.message = '';
    this.reg = {
      userName: '',
      email: '',
      password: ''
    };

    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.userForm.valueChanges.subscribe(x => {
      if (this.userForm.status == 'VALID') {
        this.isbusy = true;
      }
    }, ex => console.log(ex))
  }

  register() {
    if (this.userForm.valid) {
      this.validateRegisterModel();
      this.service.Register(this.reg).subscribe(succes => {
        this.message = 'The data has been added sucessfully in order to activate the e-mail sent to your e-mail';
        this.userForm.reset();
        this.userForm.value.password = '';
      }, err => console.log(err));
    }
  }

  validateRegisterModel() {
    this.reg.userName = this.userForm.value.userName;
    this.reg.email = this.userForm.value.email;
    this.reg.password = this.userForm.value.password;
  }

  isPasswordMatch() {
    if (this.userForm.value.password !== '' && this.userForm.value.passwordConfirm !== '') {
      if ((this.userForm.value.password !== this.userForm.value.passwordConfirm) &&
        this.userForm.value.password.length > 5 && this.userForm.value.passwordConfirm.length > 5) {
        return true;
      }
    }
    return false;
  }

  isPasswordValid() {
    const pass = this.userForm.value.password;
    if (pass !== '' && pass.length > 5) {
      this.regex = new RegExp('[a-z]');
      if (!this.regex.test(pass)) {
        this.messageValidate.pass.notMatch = 'The password must contain at least alowercase letter';
        return false;
      }
      this.regex = new RegExp('[A-Z]');
      if (!this.regex.test(pass)) {
        this.messageValidate.pass.notMatch = 'The password must contain at least great  letter';
        return false;
      }
      this.regex = new RegExp('[~!@#$%^&*()+<>{}]');
      if (!this.regex.test(pass)) {
        this.messageValidate.pass.notMatch = 'The password must contain at least sepcial  letter';
        return false;
      }
      this.regex = new RegExp('[0-9]');
      if (!this.regex.test(pass)) {
        this.messageValidate.pass.notMatch = 'The password must contain at least alowercase letter';
        return false;
      }
    }
    return true;
  }

  isUserNameExist() {
    const name = this.userForm.value.userName;
    if (name != null && name != '' && this.isbusy === false) {
      this.service.UserNameExist(name).subscribe(x => {
        this.messageValidate.userName.matchUserName = 'This username is already in use';
      }, ex => console.log(ex));
      return true;
    } else {
      this.messageValidate.userName.matchUserName = null;
    }
    return false;
  }

  isEmailExist() {
    const email = this.userForm.value.email;
    if (email != null && email != '' && this.isbusy === false) {
      this.service.EmailExist(email).subscribe(x => {
        this.messageValidate.email.matchEmail = 'This email is already used';
      }, ex => console.log(ex));
      return true;
    } else {
      this.messageValidate.email.matchEmail = null;
    }
    return false;
  }
}
