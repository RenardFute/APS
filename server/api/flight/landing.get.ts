import {defineEventHandler, useQuery} from "h3";


export default defineEventHandler((event) => {

    const query = useQuery(event)
    const iata = query.iata

    return fetch('http://api.aviationstack.com/v1/flights?flight_iata='+iata+'&access_key=11ffb854d221f06e0432b9450c7b3a7e&limit=1')
        .then(res => res.json())
        .then(json => {
            if(json.pagination.count == 1){
                if(json.data[0].arrival.actual == null){
                    return json.data[0].arrival.estimated;
                }
                else {
                    return json.data[0].arrival.actual;
                }
            }
        })
        .catch(err => console.error('Error while fetching flight info ('+ iata + ') :' + err))
})