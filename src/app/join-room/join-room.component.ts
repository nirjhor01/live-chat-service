import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {

  joinRoomForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.joinRoomForm = this.fb.group({
      user: ['', Validators.required],
      room: ['', Validators.required],
      mail:['',Validators.required]
    });
  }

  joinRoom(){
    //const {user, room} = this.joinRoomForm.value;
    const user = this.joinRoomForm.value.user;
    const room = this.joinRoomForm.value.room;
    const mail = this.joinRoomForm.value.mail;
    //console.log("mail = "+ mail);

    sessionStorage.setItem("user", user);
    sessionStorage.setItem("room", room);
    localStorage.setItem("user",user);
    localStorage.setItem("room",room);

    this.chatService.joinRoom(user, room, mail)
    .then(()=>{
      this.router.navigate(['chat']);
    }).catch((err)=>{
      console.log(err);
    })

  }

}