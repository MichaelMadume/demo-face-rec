import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SttService {

    recognition: SpeechRecognition;

    sttSubject = new Subject<SpeechRecognitionAlternative>();

    constructor() {
        // tslint:disable-next-line: no-string-literal
        window['SpeechRecognition'] = window['webkitSpeechRecognition'] || window['SpeechRecognition'];
        if ('SpeechRecognition' in window) {
            console.log('Speech Recognition Available');
            this.initSpeechRecognition();
        } else {
            console.log('Speech Recognition Unavailable');
        }
    }

    initSpeechRecognition() {
        // tslint:disable-next-line: no-string-literal
        this.recognition = new window['SpeechRecognition']();
        this.recognition.onresult = (event) => {
            const speechToTextResult = event.results[0][0];
            console.log(speechToTextResult.transcript);
            this.sttSubject.next(speechToTextResult);
        };
        this.recognition.onend = (event) => {
            setTimeout(() => {
                this.startListening();
            }, 100);
        };
    }

    startListening() {
        this.recognition.start();
    }

}
