import { Injectable, NgZone } from '@angular/core';
import { io, Socket as SocketIOSocket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: SocketIOSocket | null = null;
  private socketUrl = 'http://localhost:4000';

  constructor(private ngZone: NgZone) {}

  connect(): void {
    if (this.socket) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.socket = io(this.socketUrl, {
        transports: ['websocket', 'polling'],
        autoConnect: false
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data?: any): void {
    if (this.socket) {
      this.ngZone.runOutsideAngular(() => {
        this.socket!.emit(event, data);
      });
    }
  }

  on(event: string): Observable<any> {
    return new Observable((observer) => {
      if (!this.socket) {
        observer.error('Socket not connected');
        return;
      }

      const handler = (data: any) => {
        this.ngZone.run(() => {
          observer.next(data);
        });
      };

      this.ngZone.runOutsideAngular(() => {
        this.socket!.on(event, handler);
      });

      return () => {
        this.ngZone.runOutsideAngular(() => {
          this.socket!.removeListener(event, handler);
        });
      };
    });
  }

  once(event: string): Observable<any> {
    return new Observable((observer) => {
      if (!this.socket) {
        observer.error('Socket not connected');
        return;
      }

      const handler = (data: any) => {
        this.ngZone.run(() => {
          observer.next(data);
          observer.complete();
        });
      };

      this.ngZone.runOutsideAngular(() => {
        this.socket!.once(event, handler);
      });

      return () => {
        this.ngZone.runOutsideAngular(() => {
          this.socket!.removeListener(event, handler);
        });
      };
    });
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocket(): SocketIOSocket | null {
    return this.socket;
  }
}
