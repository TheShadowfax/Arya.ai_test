import { Component, OnInit, Directive } from '@angular/core';
import { FormGroup, FormControl, Validators, NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { UserService, IUserDetailsState } from '../shared/user.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    readonly userService: UserService,

  ) { }

  file: File;

  profileForm = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    id: new FormControl('', { validators: [Validators.required] }),
    firstName: new FormControl('', { validators: [Validators.required] }),
    lastName: new FormControl('', { validators: [Validators.required] }),
    password: new FormControl('', { validators: [] }),
    confirmPassword: new FormControl('', { validators: [] }),
    dp: new FormControl('', { validators: [] })

  })

  ngOnInit(): void {
    this.profileForm.markAsUntouched();
    this.profileForm.markAsPristine()
    const userInfo = this.userService.getSnapShot();
    this.profileForm.controls.email.setValue(userInfo.email);
    this.profileForm.controls.id.setValue(userInfo.id);
    this.profileForm.controls.firstName.setValue(userInfo.firstName);
    this.profileForm.controls.lastName.setValue(userInfo.lastName);
    this.profileForm.controls.dp.setValue(userInfo.dp);
  }


  updateUserDetails() {
    let body = {} as IUserDetailsState;

    if (this.profileForm.controls.firstName.dirty) {
      body.firstName = this.profileForm.controls.firstName.value;
    }

    if (this.profileForm.controls.lastName.dirty) {
      body.lastName = this.profileForm.controls.lastName.value;
    }

    if (this.profileForm.controls.password.dirty) {
      body.password = this.profileForm.controls.password.value;
    }

    if (this.profileForm.controls.dp.dirty) {
      body.dp = this.profileForm.controls.dp.value;
    }


    return this.userService.postUserInfo(body).then((v) => {
      this.ngOnInit();
      this.profileForm.markAsDirty()
    });

  }


  onFileInput(event$) {
    const files = event$.target.files as FileList;
    const file = files[0];
    console.log(file);

    if (file && file.size < 500 * 1000) {
      const fileReader = new FileReader();
      fileReader.onload = ((fr) => {
        console.log(fileReader.result);
        this.profileForm.controls.dp.setValue(btoa(fileReader.result as string))
      })
      fileReader.readAsDataURL(file)
      console.log(file.arrayBuffer());
      this.file = file;
      this.profileForm.controls.dp.markAsDirty()
    } else {
      console.log('error in file size', file?.size);

    }



  }

  removeDP() {
    let body = {} as IUserDetailsState;
    body.dp = null;
    return this.userService.postUserInfo(body).then((v) => {
      this.ngOnInit();
      this.profileForm.markAsDirty()
    });

  }

  decode(data) {
    return atob(data);
  }

}
