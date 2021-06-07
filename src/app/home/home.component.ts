import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import {Router,ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user="";
  pass="";
  cpass="";
  registerval=false;
  users_array:any[]=[];
  pass_array:any[]=[];
  data:any;
  constructor(private http: HttpClient,private authService: SocialAuthService,private router:Router,private route:ActivatedRoute) {   }
  ngOnInit(){
    
    this.http.get<any>('http://localhost:8080/users').subscribe(data => {
            console.log(data);
            for(var i=0;i<data.length;i++){
              this.users_array.push(data[i].name);
              this.pass_array.push(data[i].pass);
            }
            
        });
      console.log("THE USERS ARRAY IS",this.users_array);
      if(localStorage.getItem("user")!=null){this.router.navigateByUrl("/myhome");}
  }

  login(){
    console.log("Tapped ");
    var flag=0;
    this.user=this.user.trim().toLowerCase();
    this.pass=this.pass.trim().toLowerCase();
    if(this.user==""){alert("Please enter a valid Username"); return;}
    if(this.pass==""){alert("Please enter password"); return;}
    console.log(this.users_array);
    console.log(this.pass_array);
    for(var i=0;i<this.users_array.length;i++){
      if(this.users_array[i]==this.user){
        flag=1;
        console.log(this.pass_array[i]," is the pass and ",this.pass);
        if(this.pass_array[i]==this.pass){
          localStorage.removeItem("user");
          localStorage.setItem("user",this.user);
          this.router.navigateByUrl("/myhome");
          return;
        }
      }
    }
    if(flag==0){alert("No Such User Exists"); return;}
    alert("Password Doesn't match");
  }

  randomString(length:number, chars:any) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}


  signInWithGoogle(){
    console.log("HELOOOOO");
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
      if(user!=null){
        if(!this.users_array.includes(user.email)){
          var password= this.randomString(20, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
          var data={"name":user.email,"pass":password,"display_name":user.email,"image":"defaulticon.png"};
            this.http.post<any>('http://localhost:8080/users',data).subscribe(data => {});
            this.http.post<any>('http://localhost:8080/newUserBlog?user='+user.email,data).subscribe(data => { });
            this.http.post<any>('http://localhost:8080/addfollow',{"user":user.email}).subscribe(data=>{});
        }
        localStorage.setItem("user",user.email);
        this.router.navigateByUrl("/myhome");
      }
    });
    
  }

  signOut(): void {
    this.authService.signOut();
  }
  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }
  register(){
    this.user="";
    this.pass="";
    this.cpass="";
    this.registerval=true;
    console.log("Register..!");
  }
  signin(){
    this.user="";
    this.pass="";
    this.registerval=false;
  }
  newregistration(){
    console.log("New Register");
    if(this.user==""){alert("Please enter a valid Username"); return;}
    if(this.pass=="" || this.cpass==""){alert("Please check Password fields"); return;}
    if(this.pass!=this.cpass){alert("Password and confirm password doesn't match"); return;}
    if(this.users_array.includes(this.user)){alert("User Already Exists, Please use another username"); return;}
    this.user=this.user.trim().toLowerCase();
    this.pass=this.pass.trim().toLowerCase();
    this.cpass=this.cpass.trim().toLowerCase();
    var data={"name":this.user,"pass":this.pass,"display_name":this.user,"image":"defaulticon.png"};

    

    this.http.post<any>('http://localhost:8080/users',data).subscribe(data => {
            console.log(data);
            this.users_array.push(data);
        });
    this.http.post<any>('http://localhost:8080/newUserBlog?user='+this.user,{}).subscribe(data => { });
    this.http.post<any>('http://localhost:8080/addfollow',{"user":this.user}).subscribe(data=>{});
      
    this.users_array.push(this.user);
    this.pass_array.push(this.pass);
    this.user="";
    this.pass="";
    this.cpass="";
    alert("Signup success");
  }

}
