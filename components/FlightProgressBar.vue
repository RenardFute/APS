<template>
  <div id="container">
    <Circle class="dot"/>
    <div id="progress">
      <div id="bar">
      </div>
      <Airplane id="plane"/>
    </div>
    <Circle class="dot"/>
  </div>
</template>

<script setup>
  import Circle from "vue-material-design-icons/CircleMedium"
  import Airplane from "vue-material-design-icons/Airplane"
  import {useFetch, useLazyFetch} from "nuxt/app";

  const props = defineProps({
    iata: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: false
    }
  })

  const {data: progress} = useLazyFetch("/api/flight/progress?iata=" + props.iata + (props.date ? "&date=" + props.date : ""))
  const {data: state} = useLazyFetch("/api/flight/state?iata=" + props.iata + (props.date ? "&date=" + props.date : ""))

  watch(progress, (newProgress) => {
    document.getElementById("bar").style.width = newProgress*100 + "%";
    document.getElementById("plane").style.left = ((newProgress*100) - 1) + "%";
  })

  watch(state, (newState) => {
    if(newState === "landed"){
      document.getElementById("bar").style.backgroundColor = "#99FFCD";
      document.getElementById("plane").style.backgroundColor = "#23e383";
      document.getElementById("plane").style.left = "99%";
    }
    else if(newState === "scheduled"){
      document.getElementById("bar").style.backgroundColor = "#FFF56D";
    }
    else if(newState === "late"){
      document.getElementById("bar").style.backgroundColor = "#FFD36E";
    }
    else if(newState === "active"){
      document.getElementById("bar").style.backgroundColor = "#9FB4FF";
    }
  })

</script>

<style scoped lang="scss">
  #container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    #progress{
      width: 100%;
      height: 5px;
      margin: 5px;
      border: none;
      border-top: 5px dotted rgba(40, 38, 38, 0.7);
      background-color: #ffffff;
      display: flex;
      position: relative;

      #bar {
        margin: -5px 0px;
        display: block;
        height: 100%;
        content: "";
      }

      #plane {
        position: absolute;
        top: -15px;
        transform: rotateZ(45deg);
      }
    }

    .dot {
      padding: -5px;
      margin: 0px -8px;
    }
  }
</style>