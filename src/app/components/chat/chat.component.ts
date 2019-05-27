import { Component, OnInit, ViewChild, ElementRef, Renderer, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
// import { scan } from 'rxjs/operators';
// import 'rxjs/add/operator/scan';
import {MatButtonModule, 
    MatCardModule,
    MatDialogModule,
    MatIconModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatListModule,
    MatSidenavModule, 
    MatToolbarModule,
    MatChipsModule, 
    MatSelectModule } from '@angular/material';
import { ChatService, Message } from '../../services/chat.service';
import { SliderItemDirective } from './../slider/slider-item.directive';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
	 @ViewChild("openChat") private openChat: ElementRef;
	 @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  messages: Observable<Message[]>;
  formValue: string;
  disableScrollDown = false;
  isOpen = false;
  eventsSearched: Array<any> = [];
  constructor(public chat: ChatService, private renderer: Renderer) { }

  ngOnInit() {
    console.log("local storage-->>>>",localStorage);
    if(JSON.parse(localStorage.getItem("searchParams"))) {
      this.chat.getAllEventsBylastSearches(localStorage.getItem("searchParams"))
    }
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable()
        .scan((acc, val) => {
        	 	return acc.concat(val);
        	});
  }

  ngAfterViewChecked() {
        this.scrollToBottom();
    }

  sendMessage() {
  	if(this.formValue) {
      this.chat.chips = [];
  		let reqObj = {
	  		query: this.formValue,
	  		contexts: (this.chat.contexts ? JSON.stringify(this.chat.contexts) : false)
	  	}
	    this.chat.converse(reqObj);
	    this.formValue = '';
      if(this.chat.eventsSearched.length > 0) {
        this.eventsSearched = this.chat.eventsSearched;
      }
  	}
  	
  }
  
   // @HostListener('click', ['$event'])
   openForm(e) {
   	e.preventDefault();
   	console.log("open form");
   	this.isOpen = !this.isOpen
   	this.isOpen ? this.renderer.setElementClass(this.openChat.nativeElement, 'block',this.isOpen): this.renderer.setElementClass(this.openChat.nativeElement, 'none',this.isOpen);
	  //this.openChat.nativeElement.style.display = "block";
	}

	closeForm() {
	  this.openChat.nativeElement.style.display = "none";
	}

	private onScroll() {
        let element = this.myScrollContainer.nativeElement
        let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight
        if (this.disableScrollDown && atBottom) {
            this.disableScrollDown = false
        } else {
            this.disableScrollDown = true
        }
    }

     private scrollToBottom(): void {
        if (this.disableScrollDown) {
            return
        }
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }

    bookTicketRedirect(event, url) {
      console.log(url, "<---url")
      window.open(url, '_blank');
    }

    clickChip(event, chip) {
    console.log(chip);
    this.formValue = chip;
    this.sendMessage();
    this.chat.chips = [];
  }
}
