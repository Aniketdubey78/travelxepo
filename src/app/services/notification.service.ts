import { isPlatformBrowser } from '@angular/common';
import { Injectable ,Inject,PLATFORM_ID } from '@angular/core';
import { SocketService } from './socket.service';
import { ToastrService } from 'ngx-toastr';
import {url} from '../config';
import { HttpClient , HttpParams} from '@angular/common/http';
import {  filter, Observable, ReplaySubject, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {     

     activeusernotifications:string ='';
     private likedurl:string = url + '/like'
      
     private notifyurl: string = '';

  constructor(
    private toastr: ToastrService,
    private socketService: SocketService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    if (isPlatformBrowser(this.platformId)) {
       let loggedInUser = sessionStorage.getItem('Loggedinuser');
      if (loggedInUser) {
        try {
          const user = JSON.parse(loggedInUser);
          this.activeusernotifications = user?.data?.user?.id;
          

          this.notifyurl = url + `/notify/${this.activeusernotifications}`
          
        } catch (e) {
          console.error("Error parsing loggedInUser from sessionStorage", e);
        }
      }
      this.initSocketSetup();
    }
  }

  private initSocketSetup() {
    this.socketService.connect();
   
    this.setupStatusListeners();

    this.handleRoomJoining();
  }

  private handleRoomJoining() {
    const loggedInUser = sessionStorage.getItem('Loggedinuser');
    if (!loggedInUser) return;

    try {
      const user = JSON.parse(loggedInUser);
      const userId = user?.data?.user?.id;

      if (userId) {
     
        if (this.socketService.isConnected()) {
          this.emitJoinRoom(userId);
        }

        this.socketService.on('connect').subscribe(() => {
          this.emitJoinRoom(userId);
        });
      }
    } catch (e) {
      console.error("Error parsing loggedInUser from sessionStorage", e);
    }
  }

  private emitJoinRoom(userId: string) {
    
    this.socketService.emit("join_room", { userId: userId });
    console.log('Room join event emitted for userId:', userId);
  }

  private setupStatusListeners() {
   
    this.socketService.on('connect').subscribe(() => {
      console.log('Connected to Socket.IO server');
    });

    this.socketService.on('disconnect').subscribe(() => {
      console.log('Disconnected from Socket.IO server');
    });

    this.socketService.on('connect_error').subscribe((error: any) => {
      console.error('Connection error:', error);
    });

    
    this.socketService.on('connected').subscribe((data: any) => {
      console.log('Server acknowledgment:', data?.message);
    });
  }

  

  listentoNotification(): Observable<any> {
    return this.socketService.on('notification_received');
  }

  listentoprivatenotification(): Observable<any> {
    return this.socketService.on('private-notification');
  }

  fetchallnotifications(page:number, limit:number): Observable<any[]> {
    if (!this.notifyurl) {
      throw new Error('Notification URL is not initialized. Ensure Loggedinuser exists in sessionStorage.');
    }

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any[]>(this.notifyurl, { params });
  }

  emitPostFlags(userId: string, postId: string) {
    const saveddata = {
         postId:postId,
         userId:userId
        }
        return this.http.post<any>(this.likedurl,saveddata)
        
  }

}
