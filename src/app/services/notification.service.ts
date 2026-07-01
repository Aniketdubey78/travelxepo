import { isPlatformBrowser } from '@angular/common';
import { Injectable ,Inject,PLATFORM_ID } from '@angular/core';
import { Socket } from 'ngx-socket-io';
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
    private socket: Socket,
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
    this.socket.connect();
   
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
     
        if (this.socket.ioSocket.connected) {
          this.emitJoinRoom(userId);
        }

        this.socket.removeAllListeners('connect');
        this.socket.ioSocket.removeAllListeners('connect');

      
        this.socket.on('connect', () => {
          this.emitJoinRoom(userId);
        });
      }
    } catch (e) {
      console.error("Error parsing loggedInUser from sessionStorage", e);
    }
  }

  private emitJoinRoom(userId: string) {
    
    this.socket.emit("join_room", { userId: userId });
    console.log('Room join event emitted for userId:', userId);
  }

  private setupStatusListeners() {
   
    this.socket.ioSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.ioSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    this.socket.ioSocket.on('connect_error', (error: any) => {
      console.error('Connection error:', error);
    });

    
    this.socket.on('connected', (data: any) => {
      console.log('Server acknowledgment:', data?.message);
    });
  }

  

  listentoNotification(): Observable<any> {
    return this.socket.fromEvent('notification_received');
  }

  listentoprivatenotification(): Observable<any> {
    return this.socket.fromEvent('private-notification');
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
