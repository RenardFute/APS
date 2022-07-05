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
            let index = json.pagination.count == 2 ? 0 : 0;
            if(json.data[index].arrival.departure == null){
                return json.data[index].departure.estimated;
            }
            else {
                return json.data[index].departure.actual;
            }
        })
        .catch(err => console.error('Error while fetching flight info ('+ iata + ') :' + err))
})