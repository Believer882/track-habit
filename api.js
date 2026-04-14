const supabase = window.supabase.createClient(
  "YOUR_PROJECT_URL",
  "YOUR_ANON_KEY"
)

// 🔐 LOGIN
async function login(){
  const email = prompt("Enter your email")
  if(!email) return

  await supabase.auth.signInWithOtp({ email })
  alert("Check your email to login")
}

// 💾 SAVE DATA
async function saveToCloud(data){
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if(!user) return

  return supabase.from("days").upsert({
    user_id: user.id,
    date: data.date,
    tasks: data.tasks,
    water: data.water,
    mood: data.mood,
    time_log: data.timeLog,
    pomo_count: data.pomoCount
  })
}

// 📥 LOAD DATA
async function loadFromCloud(){
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if(!user) return []

  const { data } = await supabase
    .from("days")
    .select("*")
    .eq("user_id", user.id)

  return data
}
