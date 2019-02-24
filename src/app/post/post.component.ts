import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Post } from '../post';
import { FormBuilder, FormGroup } from '@angular/forms';
import { patchComponentDefWithScope } from '@angular/core/src/render3/jit/module';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  posts:Post[] = [];
  form:FormGroup;

  constructor(private titleService:Title,private http:HttpClient,private fb: FormBuilder) {
      this.titleService.setTitle('post');
   }

  ngOnInit() {
    const obj$ = this.http.get('https://jsonplaceholder.typicode.com/posts')
    obj$.subscribe({
      next:(response:any[])=> {
        this . posts = response.slice(0,5).map((res)=>{
          return new Post(res.id,res.title,res.body);
        });
        console.log(this.posts);
      }
    })
    this.form = this.fb.group({
      id:[''],
      title:[''],
      body:['']
    })
  }
  onSubmit(form:FormGroup){
      const value = form.value;
      if(value.id){ //update
        const obj$ = this.http.put('https://jsonplaceholder.typicode.com/posts'+value.id,value)
        obj$.subscribe({
          next:(response:any)=>{
            //console.log(response);
            const post = new Post(response.id,response.title,response.body)
            const index =this.posts
            .findIndex((p) =>{
              return p.id === post.id
            });
          }

        })

      }else{//create
        const obj$ = this.http.post('https://jsonplaceholder.typicode.com/posts',value)
        obj$.subscribe({
          next:(response:any)=>{console.log(response);
            const post = new Post(response.id,response.title,response.body)
            //this.posts = [post,...this.posts]; -->copy array
            this.posts.unshift(post); //passby ref.
            this.form.reset()
          }
        })
      }

  }
  onClick(post:Post){
    this.form.patchValue({
      id:post.id,
      title:post.title,
      body:post.title
    })


  }
  ondelete(post:Post){
    const con = confirm('Are you sure? ')
    if(con){
      const obj$ = this.http.delete('https://jsonplaceholder.typicode.com/posts'+post.id)
      obj$.subscribe({
        next:()=>{
          const index = this.posts.findIndex((p)=>{
            return p.id === post.id
          });
          this.posts.splice(index,1);
        }
      })

    }else{

    }
  }

}
