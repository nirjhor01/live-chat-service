import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public connection: any;
  public messages$ = new BehaviorSubject<any>([]);
  public connectedUsers$ = new BehaviorSubject<string[]>([]);
  public messages: any[] = [];
  public users: string[] = [];

  constructor() {
    this.initializeConnection();
  }

  // Initialize SignalR connection
  private initializeConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44331/chat")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.on("ReceiveMessage", (user: string, message: string, messageTime: string) => {
      console.log("connection on. Time is here..");
      console.log(user, message, messageTime);
      this.messages = [...this.messages, { user, message, messageTime }];
      this.messages$.next(this.messages);
    });

    this.connection.on("ConnectedUsers", (users: any) => {
      console.log("connected = "+ users);
      this.connectedUsers$.next(users);
      this.users = users;
    });

    // Start the connection
    this.start();
  }

  // Start connection
  public async start() {
    try {
      await this.connection.start();
      console.log("connected");

      // After connection is established, join the room if needed
      // For demonstration purposes, assuming room details are stored in variables
      const user = "admin";
      const room = "talk";
      
      await this.joinRoom(user, room);
    } catch (error) {
      console.log(error);
    }
  }

  // Join Room
  public async joinRoom(user: string, room: string, mail: string) {
    console.log(user, room);
    console.log("joining room");

    try {
      await this.connection.invoke("JoinRoom", {user, room, mail});
      console.log('joined room');
    } catch (error) {
      console.log(error);
    }
  }

  // Send message
  public async sendMessage(message: string) {
    console.log(message);

    try {
      await this.connection.invoke("SendMessage", message);
    } catch (error) {
      console.log(error);
    }
  }

  // Leave room
  public async leaveChat() {
    try {
      await this.connection.stop();
      console.log('left chat');
    } catch (error) {
      console.log(error);
    }
  }

}