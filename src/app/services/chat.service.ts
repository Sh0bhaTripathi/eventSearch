import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

// import { ApiAiClient } from 'api-ai-javascript';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient'
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
// Message class for displaying messages in the component

export class Message {
  constructor(public content: string, public sentBy: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);
  contexts = false;
  eventsSearched: Array<any> = [];
  constructor(private http:HttpClient) {}

  // Sends and receives messages via DialogFlow
  converse(reqObj) {
    const userMessage = new Message(reqObj.query, 'user');
    this.update(userMessage);
    console.log("send message--->>", reqObj);
    // return this.client.textRequest(msg)
    //            .then(res => {
    //            		console.log("recieved message--->>", res);
    //               const speech = res.result.fulfillment.speech;
    //               const botMessage = new Message(speech, 'bot');
    //               this.update(botMessage);
    //            });
		return this.http.post(`/api/v1/detectIntent`, reqObj).subscribe(
			(res:any) => {
     		console.log("recieved message--->>", res);

        const speech = res.fulfillmentText;
        var params = {
          ...res.parameters.fields
        }
        console.log("params--->>", params);
        this.contexts = res.outputContexts;
        const botMessage = new Message(speech, 'bot');
        this.update(botMessage);
        //if(res.intent.displayName === 'events.search')
        let that = this;
        if(res.fulfillmentMessages){
          res.fulfillmentMessages.forEach(function(element){
            console.log("element--->>>>",element);
            //var then = that;
            switch (element.message) {
              case "card":
                if(params.location[params.location.kind] ) { //&& params.date_time[params.date_time.kind]
                   console.log("if part")
                  let obj = {
                      location: params.location.structValue.fields.city.stringValue,
                      date_time:{
                        // start: params.date_time.structValue.fields.startDateTime.stringValue,
                        // end: params.date_time.structValue.fields.endDateTime.stringValue
                      }
                    }

                  that.getAllEvents(obj).subscribe(
                    (data: any)=>{
                      console.log("events search--->>>", data);
                      that.eventsSearched = data.events;
                    },
                    error=>{
                      console.log("error--->>", error);
                    })
                } else {
                  console.log("else part")
                }
              break;
              case 'quickReplies':
              break;
            }
          })
        }
       },
       error=>{
       		console.log("error--->>>", error);
       });
    }



  getAllEvents(obj){
    console.log(obj.location,"<-----location")
    return this.http.get(`/api/v1/getAllEvents?location=${encodeURIComponent(obj.location)}`);
    // &range_start=${encodeURIComponent(obj.date_time.start)}&range_end=${encodeURIComponent(obj.date_time.end)}
  }

  // Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  }
}
