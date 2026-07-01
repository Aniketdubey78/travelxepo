import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { Observable } from 'rxjs';
import {url} from '../config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ForumSocketServiceService {

  private foremurl = url + '/forum'

   constructor(private socketService: SocketService, private http: HttpClient) { }

  connectSocket(): void {
    this.socketService.connect();
  }

  getInitialForums(): void {
    this.socketService.emit('fetch_initial_forums');
  }

  onInitialForumsLoaded(): Observable<any[]> {
    return this.socketService.on('initial_forums_loaded');
  }

  createNewForum(title: string, description: string, category: string): void {
    this.socketService.emit('create_new_forum', { title, description, category });
  }

  onNewForumCreated(): Observable<any> {
    return this.socketService.on('forum_created_global');
  }

  joinForum(forumId: string, userId: string): void {
    this.socketService.emit('join_forum_room', { forumId, userId });
  }

  sendMessage(forumId: string, userId: string, message: string): void {
    this.socketService.emit('send_forum_message', { forumId, userId, message });
  }

  getMessages(): Observable<any> {
    return this.socketService.on('receive_forum_message');
  }

  onError(): Observable<any> {
    return this.socketService.on('error_occurred');
  }

  fetchrecentforem(){
    return this.http.get<any>(this.foremurl);
  }
}
