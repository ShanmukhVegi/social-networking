import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { ActivatedRoute,Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-myhome',
  templateUrl: './myhome.component.html',
  styleUrls: ['./myhome.component.css']
})
export class MyhomeComponent implements OnInit {
  user="";
  homecol:any="white";
  blogcol:any="white";
  searchcol:any="white";
  profcol:any="white";

  onhome=true;
  onblog=false;
  onsearch=false;
  onprofile=false;

  oncolor:any="red";
  offcolor:any="white";
  fileInputLabel:any;

  constructor(private location: LocationStrategy,private route:ActivatedRoute,private router:Router,private http: HttpClient) { 
    var current_user=localStorage.getItem("user");
    if(current_user==null){this.router.navigateByUrl("/myApp.com");};
    console.log("THE USER IS ",current_user);
    //disabling back button
    history.pushState(null, "", window.location.href);  
    this.location.onPopState(() => {
    history.pushState(null, "", window.location.href);

    
}); 
  }



  ngOnInit(): void {
    console.log("INSIDE MY HOME");
    
    this.home();
  }



  //home related data

  homedata:any=[];
  myuser="";
  

  async home(){

    //setting things up
    this.onblog=false;
    this.onsearch=false;
    this.onprofile=false;
    this.onhome=true;
    this.blogcol=this.offcolor;
    this.profcol=this.offcolor;
    this.searchcol=this.offcolor;
    this.homecol=this.oncolor;
    
    this.homedata=[];
    var data=await this.http.get<any>('http://localhost:8080/getfollow?user='+localStorage.getItem("user")).toPromise();
    console.log("THE DATA IN HOME IS ",data[0]);
    this.myuser=data[0].user;

    for(var i=0;i<data[0].following.length;i++){
      var data1=await this.http.get<any>('http://localhost:8080/blogs?user='+data[0].following[i]).toPromise();
      for(var j=0;j<data1[0].blogs.length;j++){
        this.homedata.push({"user":data[0].following[i],"blog":data1[0].blogs[j]});
      }
    }

    console.log(this.homedata," is the home data");
    //this.shuffleArray(this.homedata);
  }  
  

homeblogshow=false;
homeblogdata="";
homeblogauthor="";
showhomeblog(i:number){
  this.homeblogshow=true;
  this.homeblogdata=this.homedata[i].blog;
  this.homeblogauthor=this.homedata[i].user;

}
gohome(){
  this.homeblogshow=false;
  this.homeblogdata="";
  this.homeblogauthor="";
}


  //blog related data starts here : 

  loadingblogs=false;
  addb=false;
  current_blog="";
  blogs:any=[];
  addblog(){
    this.current_blog="";
    this.addb=true;
  }
  async addnow(){
    this.current_blog=this.current_blog.trim();
    if(this.current_blog==""){alert("Please add some content in your blog"); return;}
    var cblogs=[...this.blogs];
    cblogs.push(this.current_blog);
    var data1={"user":localStorage.getItem("user"),"blogs":cblogs};
    var data=await this.http.post<any>('http://localhost:8080/blogs',data1).toPromise();
    if(data=="ERROR"){alert("Problem in adding blog, please try again");}
    else{
      this.blogs.push(this.current_blog); 
      this.current_blog=""; 
      this.addb=false;
      alert("Blog is posted Successfully");
      this.myblogs();
        }
  }
  async myblogs(){
    this.loadingblogs=true;
    this.addb=false;
    var data=await this.http.get<any>('http://localhost:8080/blogs?user='+localStorage.getItem("user")).toPromise();
    this.blogs=data[0].blogs;
    console.log("THE BLOGS ARE : ",this.blogs);
    this.loadingblogs=false;
    console.log("Tapped on my blogs");

    //setting up things so that only blog is visible
    this.onhome=false;
    this.onsearch=false;
    this.onprofile=false;
    this.onblog=true;
    this.blogcol=this.oncolor;
    this.profcol=this.offcolor;
    this.homecol=this.offcolor;
    this.searchcol=this.offcolor;
  }
  canceladdblog(){this.addb=false;}
  editblog(i:number){
    console.log("EDIT BLOG");
    this.current_blog=this.blogs[i];
    this.addb=true;
  }

  //blog related data ends here




  //search related data starts here :

showsearchbar=true;
searchName="";
users:any=[];
searchResults:string[]=[];
selecteduser="";
isuserselected=false;
showresults=false;
selectedprofile={"name":"","display_name":""};
selectedcountfollowing=0;
selectedcountfollowers=0;
selectedfollowerslist:string[]=[];
selectedfollowinglist:string[]=[];
isusersfollowingselected=false;
isusersfollowersselected=false;
searchblogs:string[]=[];

followcol="green";
followstatus="follow";

async search(){



    //setting up things so that only search is visible
    this.onhome=false;
    this.onprofile=false;
    this.onblog=false;
    this.onsearch=true;
    this.blogcol=this.offcolor;
    this.profcol=this.offcolor;
    this.homecol=this.offcolor;
    this.searchcol=this.oncolor;
    this.searchResults=[];
    this.selecteduser="";
    this.isuserselected=false;
    this.showresults=false;
    this.selectedprofile={"name":"","display_name":""};
    this.selectedcountfollowing=0;
    this.selectedcountfollowers=0;
    this.isusersfollowingselected=false;
    this.isusersfollowersselected=false;
    this.users=[];




    //getting all the users
    var data=await this.http.get<any>('http://localhost:8080/users').toPromise();
    for(var i=0;i<data.length;i++){
      this.users.push(data[i].name);
    }

    console.log("the users are ",this.users);


  }


  searchchanged(){
    this.showresults=true;
    this.isuserselected=false;
    this.searchName=this.searchName.toLowerCase().trim();
    console.log("search changed to ",this.searchName);
    this.searchResults=[];
    this.searchblogs=[];
    if(this.searchName==""){return;}
    for(var i=0;i<this.users.length;i++){
      if(this.users[i]==this.searchName){
        this.searchResults.push(this.users[i]);
      }
      else if(this.users[i].includes(this.searchName)){
        this.searchResults.push(this.users[i]);
      }
    }
    this.searchResults.sort((a,b) => a.length - b.length);
    console.log(this.searchResults);
  }

  index=0;
  async selected_user(i:number){

    this.index=i;
    this.showresults=false;
    this.selecteduser=this.searchResults[i];
    this.selectedfollowerslist=[];
    this.selectedfollowinglist=[];
    this.searchblogs=[];
    this.followcol="green";
    this.followstatus="follow";
    console.log("searchreulst is ",this.searchResults," ",i);
    var data=await this.http.get<any>('http://localhost:8080/usersByName?user='+this.selecteduser).toPromise();
    this.selectedprofile=data[0];


    console.log(this.selecteduser," is the user selected");
    data=await this.http.get<any>("http://localhost:8080/getfollow?user="+this.selecteduser).toPromise();
    console.log("data is ",data[0]);
    this.selectedcountfollowers=data[0].followedby.length;
    this.selectedcountfollowing=data[0].following.length;

    for(var j=0;j<data[0].following.length;j++){
        this.selectedfollowinglist.push(data[0].following[j]);
        
      }
     for(var j=0;j<data[0].followedby.length;j++){
        this.selectedfollowerslist.push(data[0].followedby[j]);
        if(data[0].followedby[j]===localStorage.getItem("user")){
          this.followstatus="unfollow";
          this.followcol="red";
        }
      }

    data=await this.http.get<any>("http://localhost:8080/blogs?user="+this.selecteduser).toPromise();
    for(var j=0;j<data[0].blogs.length;j++){
      this.searchblogs.push(data[0].blogs[j]);
    }
    this.isuserselected=true;


  }

  getselectedfollowers(){
    this.showsearchbar=false;
    this.isusersfollowersselected=true;
  }

  getselectedfollowing(){
    this.showsearchbar=false;
    this.isusersfollowingselected=true;
  }

  goselectedback(){
    this.isusersfollowersselected=false;
    this.isusersfollowingselected=false;
    this.showblog=false;
    this.showsearchbar=true;
  }
  async set_selected_follower(i:number){

    this.selecteduser=this.selectedfollowerslist[i];
    var data=await this.http.get<any>('http://localhost:8080/usersByName?user='+this.selecteduser).toPromise();
    this.selectedprofile=data[0];

    data=await this.http.get<any>("http://localhost:8080/getfollow?user="+this.selecteduser).toPromise();
    this.selectedcountfollowers=data[0].followedby.length;
      this.selectedcountfollowing=data[0].following.length;
      for(var i=0;i<data[0].following.length;i++){
        this.selectedfollowinglist.push(data[0].following[i]);
      }
      for(var i=0;i<data[0].followedby.length;i++){
        this.selectedfollowerslist.push(data[0].followedby[i]);
      }
    this.searchName="";
    this.goselectedback();
    

  }

  async set_selected_following(i:number){
    
    this.selecteduser=this.selectedfollowinglist[i];
    var data=await this.http.get<any>('http://localhost:8080/usersByName?user='+this.selecteduser).toPromise();
    this.selectedprofile=data[0];

    data=await this.http.get<any>("http://localhost:8080/getfollow?user="+this.selecteduser).toPromise();
    this.selectedcountfollowers=data[0].followedby.length;
      this.selectedcountfollowing=data[0].following.length;

      for(var i=0;i<data[0].following.length;i++){
        this.selectedfollowinglist.push(data[0].following[i]);
      }
      for(var i=0;i<data[0].followedby.length;i++){
        this.selectedfollowerslist.push(data[0].followedby[i]);
      }
    this.searchName="";
    this.goselectedback();

    
  }

  async changeFollowStatus(){

    var thisselectedfollowinglist:string[]=[];
    var thisselectedfollowerslist:string[]=[];
    console.log("HERE");
    var data=await this.http.get<any>("http://localhost:8080/getfollow?user="+localStorage.getItem("user")).toPromise();
    for(var i=0;i<data[0].following.length;i++){
      thisselectedfollowinglist.push(data[0].following[i]);
    }

    console.log("DONE ABOVE");
    for(var i=0;i<data[0].followedby.length;i++){
      thisselectedfollowerslist.push(data[0].followedby[i]);
    }


    if(this.followstatus==="unfollow"){

      
      if(confirm("Are you sure you want to unfollow "+this.selecteduser+"?")){
        

        var data=await this.http.post<any>('http://localhost:8080/removefollowing',{"thisuser":localStorage.getItem("user"),"thatuser":this.selecteduser}).toPromise();
        data=await this.http.post<any>('http://localhost:8080/removefollowedby',{"thisuser":localStorage.getItem("user"),"thatuser":this.selecteduser}).toPromise();
        this.selected_user(this.index);
        alert("unFollowed");

      }

    }
    else{
      if(confirm("Are you sure you want to follow "+this.selecteduser+"?")){
        console.log("BELOWW");
        var data=await this.http.post<any>('http://localhost:8080/addfollowing',{"thisuser":localStorage.getItem("user"),"thatuser":this.selecteduser}).toPromise();
        data=await this.http.post<any>('http://localhost:8080/addfollowedby',{"thisuser":localStorage.getItem("user"),"thatuser":this.selecteduser}).toPromise();
        this.selected_user(this.index);
        alert("Followed..!");
      }
    }
  }
  showblog=false;
  blogdata="";
  show_selected_blog(i:number){
    this.showsearchbar=false;
    this.showblog=true;
    this.blogdata=this.searchblogs[i];
  }

  




  //search related data ends here



  //myProfile related data
  profile={"name":"","display_name":""};
  editdata=false;
  new_profilePhoto:any;
  countfollowers:number=0;;
  countfollowing=0;
  following=false;
  followers=false;
  followinglist:any=[];
  followerslist:any=[];
  changephoto=false;
  imageurl="";

  async myprofile(){
    this.onhome=false;
    this.onsearch=false;
    this.onblog=false;
    this.onprofile=true;
    this.blogcol=this.offcolor;
    this.homecol=this.offcolor;
    this.searchcol=this.offcolor;
    this.profcol=this.oncolor;

    var data=await this.http.get<any>('http://localhost:8080/usersByName?user='+localStorage.getItem("user")).toPromise();
    this.profile=data[0];
    console.log("the profile is ",this.profile);
    this.imageurl=data[0].image;


    var data=await this.http.get<any>("http://localhost:8080/getfollow?user="+localStorage.getItem("user")).toPromise();
    this.countfollowers=data[0].followedby.length;
    this.countfollowing=data[0].following.length;
    this.followerslist=data[0].followedby;
    this.followinglist=data[0].following;



  }

  uploadedImage:any;
  newname="";
  onFileSelect(event:any) {
    this.uploadedImage = event.target.files[0];
  }
  onFormSubmit(){
    const formData = new FormData();
    formData.append('uploadedImage', this.uploadedImage);
    var data=this.http.post<any>('http://localhost:8080/uploadfile?user='+this.myuser, formData).toPromise();
    console.log(data+" is image uploaded data");
    alert("Image updated successfully");
    this.goback();
  
}

  
  image_change(){
    this.changephoto=true;
  }

  edit_details(){
    this.changepass=false;
    this.editdata=true;
  }
  async change_name(){
    this.newname=this.newname.trim();
    if(this.newname==""){alert("Display Name cannot be empty");}
    var data= await this.http.post<any>("http://localhost:8080/changename",{"user":localStorage.getItem("user"),"display_name":this.newname}).toPromise();
    
    this.profile.display_name=this.newname;
    alert("Name changed Successfully");
    this.newname="";
    this.editdata=false;
  }

  
  changepass=false;
  change_password(){
    this.editdata=false;
    this.changepass=true;
  }

  newpass="";
  newcpass="";
  async change_pass(){
    this.newpass=this.newpass.trim();
    this.newcpass=this.newcpass.trim();
    if(this.newpass==""){alert("please enter a valid password"); return;}
    if(this.newcpass==""){alert("Please enter a valud confirm password"); return;}
    if(this.newpass!=this.newcpass){alert("Password doesn't match"); return;}
    var data = await this.http.post<any>("http://localhost:8080/changepass",{"user":localStorage.getItem("user"),"pass":this.newpass}).toPromise();
    alert("Password changed Successfully");
    this.newpass="";
    this.newcpass="";
    this.changepass=false;
  }


  getfollowers(){
    this.followers=true;

  }
  getfollowing(){
    console.log("The follwers list is ",this.followerslist);
    this.following=true;

  }

  goback(){
    this.following=false;
    this.followers=false;
    this.editdata=false;
    this.changepass=false;
    this.changephoto=false;
  }

  search_user_from_followers(i:number){
    this.search();
    this.searchResults=[...this.followerslist]; //calling the search functionality
    this.selected_user(i)
  }

  search_user_from_following(i:number){
    this.search();
    this.searchResults=[...this.followinglist]; //calling the search functionality
    this.selected_user(i)
  }










  //LOGOUT

  logout(){
    if(confirm("Are you sure you want to logout?")) {
      console.log("Implement delete functionality here");
      localStorage.removeItem("user");
      location.reload();
      this.router.navigateByUrl("/myApp.com");}
  }

  

}
