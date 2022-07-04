<template>
  <div id="card-body">
    <div id="logo-container">
      <div v-if="pending">
        Loading ...
      </div>
      <div v-else>
        <img class="logo" :src="getAirlineLogoURL()" :alt="infos.airline.iata">
      </div>
    </div>
    <div id="info-container">
      <div v-if="pending">
        Loading ...
      </div>
      <div v-else>
        <div id="flight-iata-container" >
          <h1 id="iata"> {{iata}} </h1>
          <h2 class="separator">-</h2>
          <h1 id="from"> {{infos.departure.iata}} </h1>
        </div>
        <div id="flight-details">
          <div class="flight-detail" v-if="infos.departure.actual">
            <AirplaneTakeoff class="icon"/>
            <h1 class="text">{{getTakeOfTime()}}</h1>
          </div>
          <div class="flight-detail" v-else>
            <AirplaneTakeoff class="icon"/>
            <Clock class="icon"/>
            <h1 class="text">{{getEstimatedTakeoff()}}</h1>
          </div>


          <div class="flight-detail">
            <Airport class="icon"/>
            <h1 class="text">T{{infos.arrival.terminal}}</h1>
          </div>

          <div class="flight-detail">
            <DoorSliding class="icon"/>
            <h1 class="text" v-if="infos.arrival.gate">{{infos.arrival.gate}}</h1>
            <h1 class="text" v-else>A?</h1>
          </div>

          <div class="flight-detail">
            <Suitcase class="icon"/>
            <h1 class="text" v-if="infos.arrival.baggage">{{infos.arrival.baggage}}</h1>
            <h1 class="text" v-else>?</h1>
          </div>



          <div class="flight-detail" v-if="infos.arrival.actual">
            <AirplaneLanding class="icon"/>
            <h1 class="text">{{getLandingTime()}}</h1>
          </div>
          <div class="flight-detail" v-else>
            <AirplaneLanding class="icon"/>
            <Clock class="icon"/>
            <h1 class="text">{{getEstimatedLandingTime()}}</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useFetch} from "nuxt/app";
import AirplaneTakeoff from 'vue-material-design-icons/AirplaneTakeoff';
import AirplaneLanding from 'vue-material-design-icons/AirplaneLanding';
import DoorSliding from 'vue-material-design-icons/DoorSliding';
import Suitcase from 'vue-material-design-icons/BagSuitcase';
import Airport from 'vue-material-design-icons/Airport';
import Clock from 'vue-material-design-icons/ClockOutline';

const props = defineProps({
  iata: {
    type: String,
    required: true
  }
})

const {pending, refresh, data: infos} = await useFetch('/api/flight/data?iata='+props.iata)

watch(props, (newProps) => {
  refresh();
})

function getTakeOfTime(){
  if(infos.value.departure.actual == null){
    return "--:--"
  }
  const date = new Date(infos.value.departure.actual);
  let hours = date.getUTCHours();
  if (hours < 10){
    hours = "0"+hours;
  }
  let minutes = date.getUTCMinutes();
  if(minutes < 10){
    minutes = "0"+minutes;
  }
  return hours + ":" + minutes;
}

function getEstimatedTakeoff(){
  if(infos.value.departure.estimated == null){
    return "--:--"
  }
  const date = new Date(infos.value.departure.estimated);
  let hours = date.getUTCHours();
  if (hours < 10){
    hours = "0"+hours;
  }
  let minutes = date.getUTCMinutes();
  if(minutes < 10){
    minutes = "0"+minutes;
  }
  return hours + ":" + minutes;
}

function getLandingTime(){
  if(infos.value.arrival.actual == null){
    return "--:--"
  }
  const date = new Date(infos.value.arrival.actual);
  let hours = date.getUTCHours();
  if (hours < 10){
    hours = "0"+hours;
  }
  let minutes = date.getUTCMinutes();
  if(minutes < 10){
    minutes = "0"+minutes;
  }
  return hours + ":" + minutes;
}

function getEstimatedLandingTime(){
  if(infos.value.arrival.estimated == null){
    return "--:--"
  }
  const date = new Date(infos.value.arrival.estimated);
  let hours = date.getUTCHours();
  if (hours < 10){
    hours = "0"+hours;
  }
  let minutes = date.getUTCMinutes();
  if(minutes < 10){
    minutes = "0"+minutes;
  }
  return hours + ":" + minutes;
}

function getAirlineLogoURL(){
  return "https://daisycon.io/images/airline/?width=100&height=100&iata=" + infos.value.airline.iata;
}
</script>

<style scoped lang="scss">
  #card-body{
    background: #ffffff;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    position: relative;
    box-shadow: 10px 10px 10px 10px rgba(0, 0, 0, 0.2);
    align-items: center;
  }

  #logo-container {
    width: 100px;
    height: 100px;
    border-radius: 5px;
    margin-right: 10px;

    .logo {
      display: block;
    }
  }

  #info-container {
    width: 100%;

    #flight-iata-container{
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0 0 0 5px;
      font-size: 0.7em;

      .separator {
        margin: 10px;
      }
    }

    #flight-details {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      column-gap: 5px;

      .flight-detail {
        display: flex;
        align-items: center;

        .icon {
          margin: 2px;
        }

        .text {
          font-size: 1em;
          margin: 5px;
        }
      }
    }
  }
</style>