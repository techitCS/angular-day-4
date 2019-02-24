import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Account } from '../account';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  form: FormGroup;
  constructor(
    private fb: FormBuilder,private accountService:AccountService,
    private titleService:Title
  ) {
    this.titleService.setTitle('profile');
   }

  ngOnInit() {
    this.form = this.fb.group({
      firstName: [this.accountService.account.firstName,[Validators.required,Validators.minLength(3)]] ,
      lastName: [this.accountService.account.lastName,[Validators.required,Validators.minLength(3)]]
    });
  }
  onSubmit(form: FormGroup){
    if(form.valid){
      const {firstName,lastName}= form.value;
      const  account = new Account(firstName,lastName);
      this.accountService.account = account;
      //alert('you input firstname is '+ firstName + ' and lastname ' + lastName);

    }else{
      alert('please input firstname or lastname');
    }
    
  }

}
