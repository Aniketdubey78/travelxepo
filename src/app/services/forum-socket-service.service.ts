import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import {url} from '../config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ForumSocketServiceService {

  private foremurl = url + '/forum'

   constructor(private socket: Socket, private http: HttpClient) { }

  connectSocket(): void {
    this.socket.connect();
  }

  getInitialForums(): void {
    this.socket.emit('fetch_initial_forums');
  }

  onInitialForumsLoaded(): Observable<any[]> {
    return this.socket.fromEvent<any[]>('initial_forums_loaded');
  }

  createNewForum(title: string, description: string, category: string): void {
    this.socket.emit('create_new_forum', { title, description, category });
  }

  onNewForumCreated(): Observable<any> {
    return this.socket.fromEvent<any>('forum_created_global');
  }

  joinForum(forumId: string, userId: string): void {
    this.socket.emit('join_forum_room', { forumId, userId });
  }

  sendMessage(forumId: string, userId: string, message: string): void {
    this.socket.emit('send_forum_message', { forumId, userId, message });
  }

  getMessages(): Observable<any> {
    return this.socket.fromEvent<any>('receive_forum_message');
  }

  onError(): Observable<any> {
    return this.socket.fromEvent<any>('error_occurred');
  }

  fetchrecentforem(){
    return this.http.get<any>(this.foremurl);
  }
}
