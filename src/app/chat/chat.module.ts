import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { ChatComponent } from '../components/chat/chat.component';
import { SliderComponent } from './../components/slider/slider.component';
import { SharedModule } from './../shared/shared.module';
import { SliderItemDirective } from './../components/slider/slider-item.directive';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    ChatComponent,
    SliderComponent,
    SliderItemDirective
  ],
  exports: [ ChatComponent ], // <-- export here
  providers: [ChatService]
})
export class ChatModule { }