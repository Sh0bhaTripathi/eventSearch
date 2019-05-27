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
  constructor(public content: string, public sentBy: string, public events:Array<any>) {
      this.content = content;
      this.sentBy = sentBy;
      this.events = events;
  }
  getSentBy() {
      return this.sentBy;
  }
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

  categories = [
        {
            "resource_uri": "https://www.eventbriteapi.com/v3/categories/103/",
            "id": "103",
            "name": "Music",
            "name_localized": "Music",
            "short_name": "Music",
            "short_name_localized": "Music",
            "synonyms":["musical", "music","musicals","club","music concerts"]
        },
        {
            "resource_uri": "https://www.eventbriteapi.com/v3/categories/101/",
            "id": "101",
            "name": "Business & Professional",
            "name_localized": "Business & Professional",
            "short_name": "Business",
            "short_name_localized": "Business",
            "synonyms":["Business", "business","Business & Professional"]
        },
        {
            "resource_uri": "https://www.eventbriteapi.com/v3/categories/110/",
            "id": "110",
            "name": "Food & Drink",
            "name_localized": "Food & Drink",
            "short_name": "Food & Drink",
            "short_name_localized": "Food & Drink",
            "synonyms":["Food & Drink", "food","drinks", "drink"]
        },
        {
            "resource_uri": "https://www.eventbriteapi.com/v3/categories/113/",
            "id": "113",
            "name": "Community & Culture",
            "name_localized": "Community & Culture",
            "short_name": "Community",
            "short_name_localized": "Community",
            "synonyms":["festval", "festivals","Community & Culture", "culture", "cultural"]
        },
        {
            "resource_uri": "",
            "id": "",
            "name": "All Events",
            "name_localized": "All",
            "short_name": "all",
            "short_name_localized": "All",
            "synonyms":["All", "events","all events"]
        },
        {
            "resource_uri": "https://www.eventbriteapi.com/v3/categories/102/",
            "id": "102",
            "name": "Science & Tech",
            "name_localized": "Science & Technology",
            "short_name": "Science & Tech",
            "short_name_localized": "Science & Tech"
        }
        // {
        //     "resource_uri": "https://www.eventbriteapi.com/v3/categories/105/",
        //     "id": "105",
        //     "name": "Performing & Visual Arts",
        //     "name_localized": "Performing & Visual Arts",
        //     "short_name": "Arts",
        //     "short_name_localized": "Arts"
        // },
        // {
        //     "resource_uri": "https://www.eventbriteapi.com/v3/categories/104/",
        //     "id": "104",
        //     "name": "Film & Media",
        //     "name_localized": "Film, Media & Entertainment",
        //     "short_name": "Film & Media",
        //     "short_name_localized": "Film & Media"
        // },
        // {
        //     "resource_uri": "https://www.eventbriteapi.com/v3/categories/108/",
        //     "id": "108",
        //     "name": "Sports & Fitness",
        //     "name_localized": "Sports & Fitness",
        //     "short_name": "Sports & Fitness",
        //     "short_name_localized": "Sports & Fitness"
        // },
        // {
        //     "resource_uri": "https://www.eventbriteapi.com/v3/categories/107/",
        //     "id": "107",
        //     "name": "Health & Wellness",
        //     "name_localized": "Health & Wellness",
        //     "short_name": "Health",
        //     "short_name_localized": "Health"
        // },
        // {
        //     "resource_uri": "https://www.eventbriteapi.com/v3/categories/109/",
        //     "id": "109",
        //     "name": "Travel & Outdoor",
        //     "name_localized": "Travel & Outdoor",
        //     "short_name": "Travel & Outdoor",
        //     "short_name_localized": "Travel & Outdoor",
        //     "synonyms":["Travel & Outdoor"]
        // },
        // {
        //     "resource_uri": "https://www.eventbriteapi.com/v3/categories/111/",
        //     "id": "111",
        //     "name": "Charity & Causes",
        //     "name_localized": "Charity & Causes",
        //     "short_name": "Charity & Causes",
        //     "short_name_localized": "Charity & Causes"
        // },
        // {
        //     "resource_uri": "https://www.eventbriteapi.com/v3/categories/114/",
        //     "id": "114",
        //     "name": "Religion & Spirituality",
        //     "name_localized": "Religion & Spirituality",
        //     "short_name": "Spirituality",
        //     "short_name_localized": "Spirituality"
        // },
        // {
        //     "resource_uri": "https://www.eventbriteapi.com/v3/categories/115/",
        //     "id": "115",
        //     "name": "Family & Education",
        //     "name_localized": "Family & Education",
        //     "short_name": "Family & Education",
        //     "short_name_localized": "Family & Education"
        // },
        // {
        //     "resource_uri": "https://www.eventbriteapi.com/v3/categories/116/",
        //     "id": "116",
        //     "name": "Seasonal & Holiday",
        //     "name_localized": "Seasonal & Holiday",
        //     "short_name": "Holiday",
        //     "short_name_localized": "Holiday"
        // },
        // {
        //     "resource_uri": "https://www.eventbriteapi.com/v3/categories/112/",
        //     "id": "112",
        //     "name": "Government & Politics",
        //     "name_localized": "Government & Politics",
        //     "short_name": "Government",
        //     "short_name_localized": "Government"
        // },
        // {
        //     "resource_uri": "https://www.eventbriteapi.com/v3/categories/106/",
        //     "id": "106",
        //     "name": "Fashion & Beauty",
        //     "name_localized": "Fashion & Beauty",
        //     "short_name": "Fashion",
        //     "short_name_localized": "Fashion"
        // },
        // {
        //     "resource_uri": "https://www.eventbriteapi.com/v3/categories/117/",
        //     "id": "117",
        //     "name": "Home & Lifestyle",
        //     "name_localized": "Home & Lifestyle",
        //     "short_name": "Home & Lifestyle",
        //     "short_name_localized": "Home & Lifestyle"
        // },
        // {
        //     "resource_uri": "https://www.eventbriteapi.com/v3/categories/118/",
        //     "id": "118",
        //     "name": "Auto, Boat & Air",
        //     "name_localized": "Auto, Boat & Air",
        //     "short_name": "Auto, Boat & Air",
        //     "short_name_localized": "Auto, Boat & Air"
        // },
        // {
        //     "resource_uri": "https://www.eventbriteapi.com/v3/categories/119/",
        //     "id": "119",
        //     "name": "Hobbies & Special Interest",
        //     "name_localized": "Hobbies & Special Interest",
        //     "short_name": "Hobbies",
        //     "short_name_localized": "Hobbies"
        // },
        // {
        //     "resource_uri": "https://www.eventbriteapi.com/v3/categories/199/",
        //     "id": "199",
        //     "name": "Other",
        //     "name_localized": "Other",
        //     "short_name": "Other",
        //     "short_name_localized": "Other"
        // },
        // {
        //     "resource_uri": "https://www.eventbriteapi.com/v3/categories/120/",
        //     "id": "120",
        //     "name": "School Activities",
        //     "name_localized": "School Activities",
        //     "short_name": "School Activities",
        //     "short_name_localized": "School Activities"
        // }
    ];
  chips = [];
  constructor(private http:HttpClient) {
    const botMessage = new Message('Hi, I am bot to help you with searching for tickets to events, like movies, sports, and concerts.', 'bot', []);
    setTimeout(a=>this.update(botMessage), 200);
    if(localStorage.getItem('email')) {

         // const botMessage = new Message('Hi, I am bot to help you with searching for tickets to events, like movies, sports, and concerts.', 'bot', []);
         // this.update(botMessage);
    } else {
            this.http.post(`/api/v1/detectIntent`, {query: localStorage.getItem('email'), contexts:false}).subscribe(
            (res:any) => {
            console.log("recieved message--->>", res);
            const speech = res.fulfillmentText;
            this.contexts = res.outputContexts;
            const botMessage = new Message(speech, 'bot',[]);
            setTimeout(a=>this.update(botMessage), 0);
        },error=>{

        })
    }
    this.chips = this.categories.map(x=> x.name );
  }

  // Sends and receives messages via DialogFlow
  converse(reqObj) {
    const userMessage = new Message(reqObj.query, 'user',[]);
    setTimeout(a=>this.update(userMessage),1000);
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
        const botMessage = new Message(speech, 'bot',[]);
        setTimeout(a=>this.update(botMessage),1000);
        //if(res.intent.displayName === 'events.search')
        let that = this;
        if(res.intent.displayName) {
          let key = "email";
          console.log("local----------",localStorage.getItem('email'))
          if(!localStorage.getItem("email")){
            localStorage.setItem("email", params.email.stringValue);
          }
          
        }
        if(res.fulfillmentMessages){
          res.fulfillmentMessages.forEach(function(element){
            console.log("element--->>>>",element);
            //var then = that;
            switch (element.message) {
              case "card":
                if(params.location[params.location.kind] ) { //&& params.date_time[params.date_time.kind]
                  let obj = {
                      location: params.location.structValue.fields.city.stringValue,
                      date_time:{
                        // start: params.date_time.structValue.fields.startDateTime.stringValue,
                        // end: params.date_time.structValue.fields.endDateTime.stringValue
                      }
                    }

                  if(params.event_type && params.event_type.stringValue){
                    obj['catId'] = that.categories.find(x=>x.name == params.event_type.stringValue).id;
                    obj['q'] = params.event_type.stringValue;
                  }
                  localStorage.setItem("searchParams", JSON.stringify(obj));
                  console.log("searched items---->>>>",JSON.parse(localStorage.getItem("searchParams")));
                  console.log("obj--->>", obj)
                  that.getAllEvents(obj).subscribe(
                    (data: any)=>{
                      that.eventsSearched = data.events;
                      if(data.events.length > 0){
                        const botMessage = new Message('', 'bot', data.events);
                        setTimeout(a=>that.update(botMessage),1000);
                        //localStorage.setItem("events", params.email.stringValue);
                      } else {
                        const botMessage = new Message('No event is found for '+ params.event_type.stringValue+' category, choose some other category.', 'bot', data.events);
                        setTimeout(a=>that.update(botMessage),1000);
                      }
                      console.log("events search--->>>", that.eventsSearched);

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

  getAllEventsBylastSearches(obj) {
      console.log(obj);
    this.getAllEvents(JSON.parse(obj)).subscribe(
      (data: any)=>{
        this.eventsSearched = data.events;
        if(data.events.length > 0){
          const botMessage = new Message('Here are the Events, previously searched by you.', 'bot', data.events);
          setTimeout(a=>this.update(botMessage),1000);
          //localStorage.setItem("events", params.email.stringValue);
        }

      },
      error=>{
        console.log("error--->>", error);
      })
  }

  getAllEvents(obj){
    console.log(obj.location,"<-----location")
    return this.http.get(`/api/v1/getAllEvents?location=${encodeURIComponent(obj.location)}&catId=${obj.catId}&q=${obj.q}`);
    // &range_start=${encodeURIComponent(obj.date_time.start)}&range_end=${encodeURIComponent(obj.date_time.end)}
  }

  // Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  }

  detectIntent(obj) {
      return this.http.post(`/api/v1/detectIntent`, obj);
  }
}
