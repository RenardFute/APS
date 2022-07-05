import {defineEventHandler, useQuery} from "h3";


export default defineEventHandler((event) => {

    const query = useQuery(event)
    const iata = query.iata
    const today = new Date();
    const day = (today.getDate() < 10) ? "0" + today.getDate() : today.getDate();
    const month = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1;
    let date = today.getFullYear() + '-' + month + '-' + day;
    if(query.date){
        date = query.flight_date + "";
    }

    return fetch('https://api.aviationstack.com/v1/flights?flight_iata='+iata+'&access_key=e607542536c7767eda39c8c159fc5c8f&limit=2' + (query.date ? '&flight_date='+date : ''))
        .then(res => res.json())
        .then(json => {
            let index = 0;
            if(json.pagination.count == 2) {
                index = 0;
            }
            if(json.pagination.count == 0) return 0;

            if(json.data[index].flight_status == "landed"){
                return 1;
            }
            if(json.data[index].flight_status == "active" || json.data[index].departure.actual != null){
                let todayT = new Date().getTime();
                todayT += 2 * 60 * 60 * 1000;
                let today = new Date(todayT);
                let estimatedArrival = new Date(json.data[index].arrival.estimated).getTime();
                let departure = (json.data[index].departure.actual != null) ? new Date(json.data[index].departure.actual) : new Date(json.data[index].departure.estimated);

                if(json.data[index].arrival.delay != null){
                    estimatedArrival += json.data[index].arrival.delay * 60 * 1000;
                }
                else if(json.data[index].departure.delay != null){
                    estimatedArrival += json.data[index].departure.delay * 60 * 1000;
                }

                console.log("Arrival", new Date(estimatedArrival));
                console.log("Arrival (in ms)", estimatedArrival)

                console.log("Today", today)
                console.log("Today (in ms)", today.getTime())

                console.log("Departure", departure)
                console.log("Departure (in ms)", departure.getTime())

                let minutesSpent = (today.getTime() - departure.getTime()) / 1000 / 60;
                let flightLength = (estimatedArrival - departure.getTime()) / 1000 / 60;
                console.log("Flight (" + iata + ") is " + minutesSpent + " minutes left of " + flightLength + " minutes");
                return Math.min(minutesSpent / flightLength, 1);
            }
            if(json.data[index].flight_status == "cancelled" || json.data[index].flight_status == "scheduled"){
                return 0;
            }
            return json.data[index].flight_status;

        })
        .catch(err => console.error('Error while fetching flight info ('+ iata + ') :' + err))
})