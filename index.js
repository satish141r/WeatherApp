// const API_KEY="26970e0003427d0912b86fbbbe3efbd0";
// async function fetchWeatherDetails(){
  
//     try{
//         let city="goa";
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//         const data=await response.json();
    
//         console.log("Weather data->",data);
    
   
//         renderWeatherInfo(data);
//     }
//     catch(err){
//         console.log("error"+err);
//     }

// }
// function renderWeatherInfo(data){
//          let newPara=document.createElement('p');
//         newPara.textContent=`${data?.main?.temp.toFixed(2)} °C`;   //imporatant
//         document.body.appendChild(newPara);
// }

// async function getCustomWeatherDetails(){
//     try{
//         let lat=17.6333;
//         let lon=18.3333;
//         let result=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
//         let data=await result.json();
//         // console.log(data);
//         renderWeatherInfo(data);
//     }
//     catch(err){
//         console.log("error"+err);
//     }

// }

// function switchTab(clickedTab) {

//     apiErrorContainer.classList.remove("active");
  
//     if (clickedTab !== currentTab) {
//       currentTab.classList.remove("current-tab");
//       currentTab = clickedTab;
//       currentTab.classList.add("current-tab");
  
//       if (!searchForm.classList.contains("active")) {
//         userInfoContainer.classList.remove("active");
//         grantAccessContainer.classList.remove("active");
//         searchForm.classList.add("active");
//       } 
//       else {
//         searchForm.classList.remove("active");
//         userInfoContainer.classList.remove("active");
//         //getFromSessionStorage();
//       }
  
//       // console.log("Current Tab", currentTab);
//     }
//   }

//   //to get ur current
//   function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);

//     }
//     else{
//         console.log('geolocation is not supported')
//     }
//   }
//   function showPosition(position){
//     let lat=position.coords.latitude;
//     let lon=position.coords.longitude;

//     console.log(lat);
//     console.log(lon);
//   }
  

const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector("weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector(" [data-searchForm]");
const loadingScreen=document.querySelector(".loading");
const userInfoContainer=document.querySelector('.user-info-container');


let currentTab=userTab;
const API_KEY="26970e0003427d0912b86fbbbe3efbd0";
currentTab.classList.add("current-tab");

getFromSessionStorage();

userTab.addEventListener('click',()=>{
  // pass clicked tab as input 
  switchTab(userTab);
});
searchTab.addEventListener('click',()=>{
  // pass clicked tab as input 
  switchTab(searchTab);
});
function switchTab(clickedTab){
    if(clickedTab!=currentTab){
      currentTab.classList.remove("current-tab");
      currentTab=clickedTab;
      currentTab.classList.add("current-tab");
     

      if(!searchForm.classList.contains("active")){
        // seaarch from tab is invisible?
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active"); 
      }
      else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        showError.classList.remove("active");

        getFromSessionStorage();
      }
    }
}
function getFromSessionStorage()
{
  const localCoordinates=sessionStorage.getItem("user-coordinates");
  if(!localCoordinates){
    grantAccessContainer.classList.add("active");

  }
  else{
    const coordinates=JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}
async function fetchUserWeatherInfo(coordinates)
{
  const {lat,lon}=coordinates;
  console.log(coordinates);
  //make grant container invisible
  grantAccessContainer.classList.remove("active");
  // make loader visible 
  loadingScreen.classList.add("active");
  

  //api call
  try{
    
    const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data=await response.json();
    console.log(data);
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch(err){
    loadingScreen.classList.remove("active");
    console.log("errror->",err);
  }
}
function renderWeatherInfo(weatherInfo){
  // firstly we have to fetch elements 
  const cityName= document.querySelector("[data-cityName]");
  const countryIcon=document.querySelector("[data-countryIcon")
  const desc=document.querySelector("[data-weatherDesc]");
  const weatherIcon=document.querySelector("[data-weatherIcon]");
  const temp=document.querySelector("[data-temp]");
  const windSpeed=document.querySelector("[data-windSpeed]");
  const humidity=document.querySelector("[data-humidity]");
  const cloudiness=document.querySelector("[data-cloudiness]");

  //fetch value from weather info objectand put in UI element
  cityName.innerText=weatherInfo?.name;

  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText=`${weatherInfo?.main?.temp} °C`;
  windSpeed.innerText=`${weatherInfo?.wind?.speed} M/s`;
  humidity.innerText=`${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  }
  else {
      //HW - show an alert for no gelolocation support available
  }
}

function showPosition(position) {

  const userCoordinates = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
  }

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  console.log(userCoordinates);
  fetchUserWeatherInfo(userCoordinates);

}
 
  const grantAccessButton=document.querySelector("[data-grantAccess]");
  grantAccessButton.addEventListener('click',getLocation); 

let searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if(cityName === "")
      return;
  else 

      fetchSearchWeatherInfo(cityName);
})

const showError=document.querySelector(".showerror");
const showErrorPara=document.querySelector("[data-errorPara]");

async function fetchSearchWeatherInfo(city)
{
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");
  try{
    
    let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    let data=await response.json();
    console.log(data);
    if(data?.message){
      console.log(data?.message);
      showErrorPara.innerText=data?.message;
      showError.classList.add("active");
      loadingScreen.classList.remove("active");
    }
    else{
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      showError.classList.remove("active");

      renderWeatherInfo(data);
    }
  
    
  }
  catch(err){
    console.log("errorr",err);
    console.log(data);

  
  }
  
}