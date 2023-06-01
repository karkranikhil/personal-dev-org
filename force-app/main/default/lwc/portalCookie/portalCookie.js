import { LightningElement, track, api } from 'lwc';

export default class PortalCookie extends LightningElement {

    @track cookieName = 'artBookingSession';
    @track cookieVal = '';

    @api bookingSession = '';

    connectedCallback(){
        this.checkCookies();
        //this.deleteCookie(this.cookieName);
    }

    checkCookies(){
        var result = this.retrieveCookie();
        console.log('found cookie?' + result);

        if(result == ''){
            var newUuid = crypto.randomUUID();
            this.createCookie(this.cookieName, newUuid, 5);
            this.bookingSession = newUuid;
        }
        else{
            console.log('cookie found!');
            this.bookingSession = result;
        }
        console.log("@@ Cookie from BrowseFLOW", this.bookingSession);
    }

    retrieveCookie(){
        console.log('getting cookies');
        console.log(document.cookie);

        var cookieString = "; " + document.cookie;
        var parts = cookieString.split("; " + this.cookieName + "=");
        return decodeURIComponent(parts.pop().split(";").shift());
    }

    createCookie(name, value, daysToLive){
        console.log('creating new cookie');

        var expires;
 
        if (daysToLive) {
            const date = new Date();
            date.setTime(date.getTime() + (daysToLive * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
 
        document.cookie = name + "=" + value + expires + "; path=/";

    }

    deleteCookie(cookieName){
        this.createCookie(cookieName, '', null);
    }

}