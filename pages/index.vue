<template>
  <div>
    <div id="controls">
      <button @click="addFlight">
        +
      </button>
      <textarea id="flight-input"></textarea>
      <button @click="sortFlights">
        🔄
      </button>
    </div>
    <h1>Flights:</h1>
    <ul id="flight-list">
      <FlightCard class="flight-list-item" v-for="flight in flights" :iata="flight"/>
    </ul>
  </div>
</template>

<script>
  import {useFetch} from "nuxt/app";

  export default {
    data() {
      return {
        flights: []
      }
    },
    methods: {
       addFlight() {
        this.flights.push(document.getElementById("flight-input").value)
        console.log("Adding flight: " + document.getElementById("flight-input").value)
        this.sortFlights()
       },
      sortFlights(){
         this.flights.sort((a, b) => {
           const {data: dateA} = useFetch("/api/flight/landing?iata=" + a)
           const {data: dateB} = useFetch("/api/flight/landing?iata=" + b);
           return new Date(dateB.value) - new Date(dateA.value)
         })
      }
    }
  }
</script>

<style scoped lang="scss">

  #controls {
    display: flex;
    align-items: center;
  }

  #flight-list{
    padding: 0;
    .flight-list-item {
      margin: 40px 10px;
    }
  }
</style>