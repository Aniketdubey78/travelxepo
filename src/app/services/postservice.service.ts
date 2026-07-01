import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../config';
import { Observable } from 'rxjs';
import { PostModel } from '../models/postfrom.model';
import { tap } from 'rxjs/operators';
import { Story } from '../models/story.model';
import { comment } from '../models/comment.model';
import { postdetail } from '../models/postdetails.model';


@Injectable({
  providedIn: 'root'
})
export class PostserviceService {
  private postrequestapi = url + "/posts";
  private commentpostapi = url + "/comments";
   private getposts = url + "/posts";
   private storypost = url + "/stories";
   private journeydetails = url + "/fulljourneystory"
   private postjourney = '';
   private currentuserstory = '';
   private savethepost = url + '/savedpost'
   private getpost =  ''
   private commneturl = '';

  postdetails:any={};
  getallposts:any[]=[];
  stories:any[]=[];
  currentJourneyData:any={};

  constructor(private  http:HttpClient) { }
  
  postrequest(data:any):Observable<PostModel>{
    const posts:PostModel = {
      title: data.title,
      busoperator: data.busoperator,
      routefrom: data.routefrom,
      routeto: data.routeto,
      rating: data.rating,
      highlight: data.highlight,
      pitshops: data.pitshops,
      fullstory: data.fullstory,
      image: data.image,
      authorId: data.authorId,
      logindetails: data.logindetails,
      postUUID: data.postUUID
    }
    
    
    
    return this.http.post<PostModel>(this.postrequestapi, posts).pipe(
      tap((res:any) => {
        this.postdetails = res;
         console.log('Backend Response saved in Service:', this.postdetails);
      })
    )
    }

    commentpost(data:any):Observable<comment>{
      const commnets:comment = {
        postId: data.postId,
        userId: data.userId,
        comment: data.content,
       
      }
      return this.http.post<comment>(this.commentpostapi, commnets).pipe(
        tap((res:any) => {
          console.log('Comment posted successfully:', res);
        })
      );
    }

     fetchAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.getposts).pipe(
      tap((res: any) => {
        this.getallposts = res.data; 
      })
    );
  }

  fetchpost(postId:string):Observable<PostModel>{
    this.getpost = url + `/posts/${postId}`
    return this.http.get<any>(this.getpost)
  }

  StoryPost(data:any):Observable<Story>{
    const story:Story = {
      authorId: data.authorId,
      storiesimages: data.storiesimages,
      createdAt: data.createdAt
    }
    return this.http.post<Story>(this.storypost, story).pipe(
      tap((res: any) => {
        console.log('Story posted successfully:', res);
      })
    );
  }

  getuserstory(currenuser:string,limit:number){

    this.currentuserstory = url +`/stories/${currenuser}`
    const params = new HttpParams()
    .set('limit',limit.toString())

    return this.http.get<any>(this.currentuserstory,{params})

  }

     fetchAllStories(): Observable<any[]> {
    return this.http.get<any[]>(this.storypost).pipe(
      tap((res: any) => {
        this.stories = res.data; 
      })
    );
  }

  postdetailsrequest(formdata:any) : Observable<postdetail>{
   return this.http.post<postdetail>(this.journeydetails,formdata).pipe(
    tap((res:any) => {
      this.currentJourneyData = res.data;
    })
   )
   }

   fetchjourney(currentpost:string):Observable<postdetail>{
    this.postjourney = url + `/fulljourneystory/${currentpost}`
    console.log(this.postjourney)
    return this.http.get<any>(this.postjourney)
    
   }

   allsavedpost:any=null;

   savedpostinDB(currentpost:string,currentuser:string){
     const saveddata = {
      post:currentpost,
      user:currentuser
     }
     return this.http.post<any>(this.savethepost,saveddata).pipe(
      tap((res:any) => {
       this.allsavedpost =res.data;
      })
     )
   }
   
   ftechusercomement(currentuser:string):Observable<comment[]>{
    this.commneturl = url + `/comments/${currentuser}`
    return this.http.get<any[]>(this.commneturl)
   }

  }

