const KEY = 'missionOS_v1'

let store = {}

function todayStr(){
  return new Date().toISOString().slice(0,10)
}

function getDay(d){
  if(!store[d]){
    store[d] = {
      tasks:{},
      water:0,
      mood:null,
      timeLog:{},
      pomoCount:0
    }
  }
  return store[d]
}

function today(){
  return getDay(todayStr())
}

function load(){
  try{
    const s = localStorage.getItem(KEY)
    if(s) store = JSON.parse(s)
  }catch(e){
    console.error(e)
    store = {}
  }
}

async function save(){
  try{
    localStorage.setItem(KEY, JSON.stringify(store))

    await saveToCloud({
      date: todayStr(),
      ...today()
    })

  }catch(e){
    console.error(e)
  }
}
