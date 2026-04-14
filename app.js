
// ══════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════
const TASK_DEF = [
  { id:'t1', cat:'daily',    name:'গল্প লিখু (Story Writing)',  meta:'Creative writing',         badge:'DO IT', targetH:0.5  },
  { id:'t2', cat:'daily',    name:'১/২ ঘণ্টা (Half Hour Task)', meta:'30 min focused session',   badge:'DO IT', targetH:0.5  },
  { id:'t3', cat:'daily',    name:'২ বেলা খাবার (2 Meals)',     meta:'Eat properly',              badge:'DO IT', targetH:0    },
  { id:'e1', cat:'exercise', name:'Calisthenics / Gym',          meta:'Exercise session',          badge:'1.5H',  targetH:1.5  },
  { id:'e2', cat:'exercise', name:'Run / Football',              meta:'Cardio session',            badge:'1.5H',  targetH:1.5  },
  { id:'s1', cat:'study',    name:'8 Hours HSC Study',           meta:'Total study target',        badge:'8H',    targetH:8    },
  { id:'s2', cat:'study',    name:'Physics',                     meta:'Deep study',                badge:'3H',    targetH:3    },
  { id:'s3', cat:'study',    name:'Chemistry',                   meta:'Deep study',                badge:'3H',    targetH:3    },
  { id:'s4', cat:'study',    name:'Biology',                     meta:'Deep study',                badge:'3H',    targetH:3    },
  { id:'s5', cat:'study',    name:'English / Bangla',            meta:'Language practice',         badge:'2H',    targetH:2    },
  { id:'a1', cat:'ai',       name:'Python',                      meta:'Coding practice',           badge:'2H',    targetH:2    },
  { id:'a2', cat:'ai',       name:'AI Learning',                 meta:'Skill building',            badge:'2H',    targetH:2    },
  { id:'p1', cat:'prayer',   name:'Namaz / Prayer',              meta:'1.5 hrs daily',             badge:'1.5H',  targetH:1.5  },
];
 
const BADGES_DEF = [
  { id:'first',    icon:'🌟', name:'First Win',   desc:'Complete 1 task',        check:s=>s.totalDone>=1 },
  { id:'streak3',  icon:'🔥', name:'On Fire',     desc:'3 day streak',           check:s=>s.streak>=3 },
  { id:'streak7',  icon:'💥', name:'Week Warrior',desc:'7 day streak',           check:s=>s.streak>=7 },
  { id:'perfect',  icon:'💎', name:'Perfect Day', desc:'100% in one day',        check:s=>s.bestDay===100 },
  { id:'hydrated', icon:'💧', name:'Hydrated',    desc:'8 glasses in a day',     check:s=>s.maxWater>=8 },
  { id:'scholar',  icon:'📚', name:'Scholar',     desc:'30 total study tasks',   check:s=>s.studyDone>=30 },
  { id:'athlete',  icon:'🏃', name:'Athlete',     desc:'20 exercise tasks done', check:s=>s.exDone>=20 },
  { id:'coder',    icon:'💻', name:'Coder',       desc:'20 AI/Python sessions',  check:s=>s.aiDone>=20 },
  { id:'pomo5',    icon:'🍅', name:'Focused',     desc:'5 Pomodoro sessions',    check:s=>s.pomoTotal>=5 },
  { id:'pomo25',   icon:'🎯', name:'Deep Work',   desc:'25 Pomodoro sessions',   check:s=>s.pomoTotal>=25 },
  { id:'lvl5',     icon:'⚡', name:'Level 5',     desc:'Reach Level 5',          check:s=>s.level>=5 },
  { id:'lvl10',    icon:'👑', name:'Level 10',    desc:'Reach Level 10',         check:s=>s.level>=10 },
];
 
const MOODS = ['😴','😐','🙂','😊','🔥'];
const MOOD_MSG = ['Rest up!','Getting there!','Good day!','Feeling great!','ON FIRE! 🚀'];
const KEY = 'missionOS_v1';
const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
 
// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════

let currentModalTask = null;
let pomoInterval = null;
let pomoRunning = false;
let pomoSecsLeft = 25*60;
let pomoIsBreak = false;
let pomoTotalToday = 0;
 

 
// ══════════════════════════════════════════════
// TASK RENDERING
// ══════════════════════════════════════════════
function buildTasks(){
  const cats = { daily:'tasks-daily', exercise:'tasks-exercise', study:'tasks-study', ai:'tasks-ai', prayer:'tasks-prayer' };
  Object.values(cats).forEach(id=>{ document.getElementById(id).innerHTML=''; });
 
  TASK_DEF.forEach(t=>{
    const done = !!today().tasks[t.id];
    const logged = today().timeLog[t.id]||0;
    const loggedH = (logged/60).toFixed(1);
    const el = document.createElement('div');
    el.className = 'task-card' + (done?' done':'');
    el.id = 'card-'+t.id;
    el.innerHTML = `
      <div class="cb ${done?'done-cb':''}" id="cb-${t.id}">${done?'✓':''}</div>
      <div class="task-info">
        <div class="task-name">${t.name}</div>
        <div class="task-meta">${t.meta}${logged>0?' · ⏱ '+loggedH+'h logged':''}</div>
      </div>
      <div class="task-right">
        <div class="badge">${t.badge}</div>
        ${t.targetH>0?`<div class="time-log-btn" onclick="openTimeModal('${t.id}',event)">+ Log Time</div>`:''}
      </div>`;
    el.addEventListener('click', ()=>toggleTask(t.id));
    document.getElementById(cats[t.cat]).appendChild(el);
  });
  updateCatPcts();
}
 
function toggleTask(id){
  const d = today();
  d.tasks[id] = !d.tasks[id];
  save();
  buildTasks();
  updateAll();
  if(d.tasks[id]) celebrateTask();
}
 
function celebrateTask(){
  const colors=['#ff4d6d','#0af5f5','#ffd60a','#39d353','#bf5af2','#ff9500'];
  for(let i=0;i<18;i++){
    const el=document.createElement('div');
    el.className='confetti-piece';
    el.style.cssText=`left:${Math.random()*100}%;width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${0.8+Math.random()*0.8}s;animation-delay:${Math.random()*0.3}s;`;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(), 1200);
  }
}
 
function updateCatPcts(){
  const cats = {daily:['t1','t2','t3'], exercise:['e1','e2'], study:['s1','s2','s3','s4','s5'], ai:['a1','a2'], prayer:['p1']};
  Object.entries(cats).forEach(([cat,ids])=>{
    const done=ids.filter(id=>today().tasks[id]).length;
    const pct=Math.round(done/ids.length*100);
    const el=document.getElementById('pct-'+cat);
    if(el) el.textContent=pct+'%';
  });
}
 
// ══════════════════════════════════════════════
// STATS & XP
// ══════════════════════════════════════════════
function getDayPct(dateStr){
  const d=store[dateStr];
  if(!d) return 0;
  const done=TASK_DEF.filter(t=>d.tasks[t.id]).length;
  return Math.round(done/TASK_DEF.length*100);
}
 
function calcAvg(days){
  let sum=0,count=0;
  for(let i=0;i<days;i++){
    const d=new Date(); d.setDate(d.getDate()-i);
    const s=d.toISOString().slice(0,10);
    if(store[s]){ sum+=getDayPct(s); count++; }
  }
  return count?Math.round(sum/count):0;
}
 
function calcStreak(){
  let streak=0;
  for(let i=0;i<365;i++){
    const d=new Date(); d.setDate(d.getDate()-i);
    const s=d.toISOString().slice(0,10);
    if(getDayPct(s)>=80) streak++;
    else break;
  }
  return streak;
}
 
function calcXP(){
  let xp=0;
  Object.entries(store).forEach(([date,d])=>{
    if(!d) return;
    const done=TASK_DEF.filter(t=>d.tasks[t.id]).length;
    xp += done*10;
    xp += (d.pomoCount||0)*15;
    if(getDayPct(date)===100) xp+=50;
  });
  return xp;
}
 
function xpToLevel(xp){ return Math.floor(xp/200)+1; }
function xpInLevel(xp){ return xp%200; }
 
function updateAll(){
  const pct=getDayPct(todayStr());
  const streak=calcStreak();
  const avg7=calcAvg(7);
  const avg30=calcAvg(30);
  const xp=calcXP();
  const level=xpToLevel(xp);
 
  document.getElementById('statToday').textContent=pct+'%';
  document.getElementById('statStreak').textContent=streak+'🔥';
  document.getElementById('stat7').textContent=avg7+'%';
  document.getElementById('stat30').textContent=avg30+'%';
  document.getElementById('xpLevel').textContent='LEVEL '+level;
  document.getElementById('xpPts').textContent=xp+' XP';
  document.getElementById('xpBar').style.width=(xpInLevel(xp)/2)+'%';
 
  renderStreak();
  renderAnalytics();
  renderBadges(xp,level,streak);
  renderTimeChart();
}
 
// ══════════════════════════════════════════════
// STREAK ROW
// ══════════════════════════════════════════════
function renderStreak(){
  const row=document.getElementById('streakRow');
  row.innerHTML='';
  const now=new Date();
  for(let i=13;i>=0;i--){
    const d=new Date(now); d.setDate(now.getDate()-i);
    const s=d.toISOString().slice(0,10);
    const pct=getDayPct(s);
    const isToday=s===todayStr();
    const div=document.createElement('div');
    div.className='streak-pip'+(pct>=80?' hit':pct>0?' partial':'')+(isToday?' today-pip':'');
    div.innerHTML=`<span>${DAYS[d.getDay()]}</span><span class="streak-big">${pct>0?pct+'%':'—'}</span>`;
    row.appendChild(div);
  }
  // scroll to end
  setTimeout(()=>{ row.scrollLeft=row.scrollWidth; },50);
}
 
// ══════════════════════════════════════════════
// WATER
// ══════════════════════════════════════════════
function buildWater(){
  const grid=document.getElementById('waterGrid');
  grid.innerHTML='';
  const w=today().water||0;
  for(let i=0;i<8;i++){
    const g=document.createElement('div');
    g.className='glass'+(i<w?' done-g':'');
    g.innerHTML=`<div class="glass-fill" style="height:${i<w?100:0}%"></div>`;
    g.onclick=()=>setWater(i<w?i:i+1);
    grid.appendChild(g);
  }
  document.getElementById('waterCount').textContent=(w)+'/8 glasses';
}
 
function setWater(n){
  today().water=n;
  save(); buildWater();
  if(n===8){ showToast('💧 Fully hydrated! +20 XP'); }
}
 
// ══════════════════════════════════════════════
// MOOD
// ══════════════════════════════════════════════
function buildMood(){
  const row=document.getElementById('moodRow');
  row.innerHTML='';
  const cur=today().mood;
  MOODS.forEach((m,i)=>{
    const b=document.createElement('div');
    b.className='mood-btn'+(cur===i?' selected':'');
    b.textContent=m;
    b.onclick=()=>setMood(i);
    row.appendChild(b);
  });
  document.getElementById('moodMsg').textContent=cur!==null?MOOD_MSG[cur]:'How are you feeling today?';
}
 
function setMood(i){
  today().mood=i; save(); buildMood();
}
 
// ══════════════════════════════════════════════
// TIME LOG MODAL
// ══════════════════════════════════════════════
function openTimeModal(id,e){
  e.stopPropagation();
  currentModalTask=id;
  const t=TASK_DEF.find(x=>x.id===id);
  document.getElementById('modalTaskName').textContent=t.name;
  document.getElementById('modalTarget').textContent=t.targetH+'h target';
  const logged=today().timeLog[id]||0;
  document.getElementById('timeHr').value=Math.floor(logged/60);
  document.getElementById('timeMin').value=logged%60;
  document.getElementById('timeModal').classList.add('open');
}
 
function closeTimeModal(){
  document.getElementById('timeModal').classList.remove('open');
  currentModalTask=null;
}
 
function saveTime(){
  if(!currentModalTask) return;
  const h=parseInt(document.getElementById('timeHr').value)||0;
  const m=parseInt(document.getElementById('timeMin').value)||0;
  today().timeLog[currentModalTask]=(h*60)+m;
  save(); closeTimeModal(); buildTasks(); renderTimeChart();
  showToast('⏱ Time logged!');
}
 
// ══════════════════════════════════════════════
// POMODORO
// ══════════════════════════════════════════════
function buildPomoSelect(){
  const sel=document.getElementById('pomoTaskSel');
  sel.innerHTML='<option value="">— Select task —</option>';
  TASK_DEF.filter(t=>t.targetH>0).forEach(t=>{
    const opt=document.createElement('option');
    opt.value=t.id; opt.textContent=t.name;
    sel.appendChild(opt);
  });
}
 
function updatePomoDial(){
  const total=pomoIsBreak?5*60:25*60;
  const frac=pomoSecsLeft/total;
  const circ=452;
  document.getElementById('pomoProg').style.strokeDashoffset=(circ*(1-frac));
  const m=Math.floor(pomoSecsLeft/60).toString().padStart(2,'0');
  const s=(pomoSecsLeft%60).toString().padStart(2,'0');
  document.getElementById('pomoTime').textContent=m+':'+s;
  document.getElementById('pomoPhase').textContent=pomoIsBreak?'BREAK':'FOCUS';
}
 
function togglePomo(){
  if(pomoRunning){
    clearInterval(pomoInterval); pomoRunning=false;
    document.getElementById('pomoStartBtn').textContent='▶ RESUME';
  } else {
    pomoRunning=true;
    document.getElementById('pomoStartBtn').textContent='⏸ PAUSE';
    pomoInterval=setInterval(()=>{
      pomoSecsLeft--;
      updatePomoDial();
      if(pomoSecsLeft<=0){
        clearInterval(pomoInterval); pomoRunning=false;
        if(!pomoIsBreak){
          // session done
          today().pomoCount=(today().pomoCount||0)+1;
          pomoTotalToday++;
          save();
          document.getElementById('pomoCount').textContent=today().pomoCount;
          showToast('🍅 Session done! Take a break!');
          // auto log time to selected task
          const sel=document.getElementById('pomoTaskSel').value;
          if(sel){ today().timeLog[sel]=(today().timeLog[sel]||0)+25; save(); buildTasks(); }
          updateAll();
        } else { showToast('⚡ Break over! Back to work!'); }
        pomoIsBreak=!pomoIsBreak;
        pomoSecsLeft=pomoIsBreak?5*60:25*60;
        document.getElementById('pomoStartBtn').textContent='▶ START';
        updatePomoDial();
      }
    },1000);
  }
}
 
function resetPomo(){
  clearInterval(pomoInterval); pomoRunning=false; pomoIsBreak=false;
  pomoSecsLeft=25*60; updatePomoDial();
  document.getElementById('pomoStartBtn').textContent='▶ START';
}
 
function renderTimeChart(){
  const chart=document.getElementById('timeLogChart');
  if(!chart) return;
  chart.innerHTML='';
  const tl=today().timeLog||{};
  const max=Math.max(...TASK_DEF.filter(t=>t.targetH>0).map(t=>(tl[t.id]||0)/60),0.1);
  TASK_DEF.filter(t=>t.targetH>0).forEach(t=>{
    const h=((tl[t.id]||0)/60);
    const pct=Math.min(h/Math.max(t.targetH,max)*100,100);
    const colors={daily:'#ff4d6d',exercise:'#39d353',study:'#0af5f5',ai:'#bf5af2',prayer:'#ffd60a'};
    chart.innerHTML+=`<div class="bar-row">
      <div class="bar-day">${t.id.toUpperCase()}</div>
      <div class="bar-wrap"><div class="bar-fill" style="width:${pct}%;background:${colors[t.cat]}"></div></div>
      <div class="bar-pct">${h.toFixed(1)}h</div>
    </div>`;
  });
}
 
// ══════════════════════════════════════════════
// ANALYTICS
// ══════════════════════════════════════════════
function renderAnalytics(){
  const avg7=calcAvg(7), avg30=calcAvg(30), streak=calcStreak();
  document.getElementById('an7').textContent=avg7+'%';
  document.getElementById('an30').textContent=avg30+'%';
 
  // best day
  let best=0;
  Object.keys(store).forEach(d=>{ const p=getDayPct(d); if(p>best) best=p; });
  document.getElementById('anBest').textContent=best+'%';
 
  // best streak
  let bestStreak=0,cur=0;
  for(let i=364;i>=0;i--){
    const d=new Date(); d.setDate(d.getDate()-i);
    const s=d.toISOString().slice(0,10);
    if(getDayPct(s)>=80){ cur++; bestStreak=Math.max(bestStreak,cur); } else cur=0;
  }
  document.getElementById('anStreak').textContent=bestStreak;
 
  // 14-day bar chart
  const hist=document.getElementById('histChart');
  if(hist){
    hist.innerHTML='';
    const colors=['#ff4d6d','#ff9500','#ffd60a','#39d353','#0af5f5','#bf5af2','#ff6eb4'];
    for(let i=13;i>=0;i--){
      const d=new Date(); d.setDate(d.getDate()-i);
      const s=d.toISOString().slice(0,10);
      const pct=getDayPct(s);
      const color=colors[Math.floor(i%colors.length)];
      hist.innerHTML+=`<div class="bar-row">
        <div class="bar-day">${DAYS[d.getDay()]}</div>
        <div class="bar-wrap"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div>
        <div class="bar-pct">${pct}%</div>
      </div>`;
    }
  }
 
  // task time averages
  const ttc=document.getElementById('taskTimeChart');
  if(ttc){
    ttc.innerHTML='';
    const colors2={daily:'#ff4d6d',exercise:'#39d353',study:'#0af5f5',ai:'#bf5af2',prayer:'#ffd60a'};
    TASK_DEF.filter(t=>t.targetH>0).forEach(t=>{
      let totalMins=0, dayCount=0;
      Object.values(store).forEach(d=>{ if(d&&d.timeLog&&d.timeLog[t.id]){ totalMins+=d.timeLog[t.id]; dayCount++; } });
      const avgH=dayCount?(totalMins/dayCount/60).toFixed(1):0;
      const pct=Math.min(parseFloat(avgH)/t.targetH*100,100);
      ttc.innerHTML+=`<div class="bar-row">
        <div class="bar-day" style="width:36px;font-size:0.5rem">${t.name.slice(0,6)}</div>
        <div class="bar-wrap"><div class="bar-fill" style="width:${pct}%;background:${colors2[t.cat]}"></div></div>
        <div class="bar-pct">${avgH}h</div>
      </div>`;
    });
  }
}
 
// ══════════════════════════════════════════════
// BADGES
// ══════════════════════════════════════════════
function renderBadges(xp,level,streak){
  // compute stats for badge checks
  let totalDone=0,studyDone=0,exDone=0,aiDone=0,bestDay=0,maxWater=0,pomoTotal=0;
  Object.entries(store).forEach(([date,d])=>{
    if(!d) return;
    TASK_DEF.forEach(t=>{
      if(d.tasks&&d.tasks[t.id]){
        totalDone++;
        if(t.cat==='study') studyDone++;
        if(t.cat==='exercise') exDone++;
        if(t.cat==='ai') aiDone++;
      }
    });
    const pct=getDayPct(date);
    if(pct>bestDay) bestDay=pct;
    if((d.water||0)>maxWater) maxWater=d.water||0;
    pomoTotal+=(d.pomoCount||0);
  });
  const stats={totalDone,studyDone,exDone,aiDone,bestDay,maxWater,pomoTotal,streak,level};
 
  const grid=document.getElementById('badgeGrid');
  grid.innerHTML='';
  BADGES_DEF.forEach(b=>{
    const earned=b.check(stats);
    grid.innerHTML+=`<div class="badge-item ${earned?'earned':''}">
      <span class="badge-icon">${b.icon}</span>
      <div class="badge-name">${b.name}</div>
      <div style="font-size:0.5rem;color:${earned?'#ffd60a80':'#333'};margin-top:3px;">${b.desc}</div>
    </div>`;
  });
}
 
// ══════════════════════════════════════════════
// UTILS
// ══════════════════════════════════════════════
function resetDay(){
  if(!confirm('Reset today\'s tasks?')) return;
  store[todayStr()]={tasks:{},water:0,mood:today().mood,timeLog:{},pomoCount:today().pomoCount||0};
  save(); buildTasks(); buildWater(); buildMood(); updateAll();
}
 
function showToast(msg){
  const t=document.createElement('div');
  t.className='toast'; t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2200);
}
 
function switchPage(name, btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.bnav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  btn.classList.add('active');
  if(name==='stats') renderAnalytics();
  if(name==='pomo') renderTimeChart();
  if(name==='badges') renderBadges(calcXP(),xpToLevel(calcXP()),calcStreak());
  if(name==='history') renderCalendar();
}
 
function setGreeting(){
  const h=new Date().getHours();
  document.getElementById('greetStr').textContent=h<12?'GOOD MORNING':h<17?'GOOD AFTERNOON':'GOOD EVENING';
  document.getElementById('dateStr').textContent=new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
}
 
// close modal on outside tap
document.getElementById('timeModal').addEventListener('click',function(e){
  if(e.target===this) closeTimeModal();
});
 
 
// ══════════════════════════════════════════════
// CALENDAR / HISTORY
// ══════════════════════════════════════════════
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth(); // 0-indexed
 
const MONTH_NAMES = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const DAY_SHORT = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
 
function changeMonth(delta){
  calMonth += delta;
  if(calMonth > 11){ calMonth=0; calYear++; }
  if(calMonth < 0){ calMonth=11; calYear--; }
  renderCalendar();
}
 
function renderCalendar(){
  document.getElementById('calMonthTitle').textContent = MONTH_NAMES[calMonth]+' '+calYear;
 
  // Day headers
  const heads = document.getElementById('calDayHeads');
  heads.innerHTML = '';
  DAY_SHORT.forEach(d=>{ heads.innerHTML += `<div class="cal-day-head">${d}</div>`; });
 
  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';
 
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  const todayD = todayStr();
 
  // empty cells
  for(let i=0;i<firstDay;i++){
    grid.innerHTML += '<div class="cal-cell empty"></div>';
  }
 
  let monthSum=0, monthCount=0, monthBest=0, monthPerfect=0;
 
  for(let d=1; d<=daysInMonth; d++){
    const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const pct = getDayPct(dateStr);
    const hasData = !!store[dateStr];
    const isToday = dateStr === todayD;
    const isFuture = dateStr > todayD;
 
    if(hasData){ monthSum+=pct; monthCount++; if(pct>monthBest) monthBest=pct; if(pct===100) monthPerfect++; }
 
    let cls = 'cal-cell';
    if(isToday) cls += ' today-cell';
    if(!isFuture && hasData){
      cls += ' has-data';
      if(pct>=80) cls += ' perfect-cell';
      else if(pct>=40) cls += ' good-cell';
      else cls += ' low-cell';
    }
    if(isFuture) cls += ' empty" style="opacity:0.3';
 
    grid.innerHTML += `<div class="${cls}" onclick="openDayModal('${dateStr}')">
      <div class="cal-num">${d}</div>
      <div class="cal-pct">${hasData && !isFuture ? pct+'%' : ''}</div>
    </div>`;
  }
 
  // month summary
  document.getElementById('calMonthAvg').textContent = monthCount ? Math.round(monthSum/monthCount)+'%' : '0%';
  document.getElementById('calMonthBest').textContent = monthBest+'%';
  document.getElementById('calMonthDays').textContent = monthCount;
  document.getElementById('calMonthPerfect').textContent = monthPerfect;
}
 
// DAY DETAIL MODAL
function openDayModal(dateStr){
  const d = store[dateStr];
  const pct = getDayPct(dateStr);
  const dateObj = new Date(dateStr+'T12:00:00');
  const dayName = dateObj.toLocaleDateString('en-US',{weekday:'long'}).toUpperCase();
  const dateLabel = dateObj.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
 
  document.getElementById('dayModalTitle').textContent = dayName;
  document.getElementById('dayModalDate').textContent = dateLabel;
 
  // color the pct
  const pctEl = document.getElementById('dayModalPct');
  pctEl.textContent = pct+'%';
  pctEl.style.color = pct>=80 ? 'var(--g)' : pct>=40 ? 'var(--y)' : pct>0 ? 'var(--r)' : 'var(--muted)';
 
  const done = d ? TASK_DEF.filter(t=>d.tasks&&d.tasks[t.id]).length : 0;
  const mood = d ? d.mood : null;
  const water = d ? (d.water||0) : 0;
  const pomo = d ? (d.pomoCount||0) : 0;
 
  document.getElementById('dmDone').textContent = done+'/'+TASK_DEF.length;
  document.getElementById('dmMood').textContent = mood!==null ? ['😴','😐','🙂','😊','🔥'][mood] : '—';
  document.getElementById('dmWater').textContent = water+'💧';
  document.getElementById('dmPomo').textContent = pomo+'🍅';
 
  // tasks list
  const tl = document.getElementById('dayModalTasks');
  tl.innerHTML = '';
  const catColors = {daily:'var(--r)',exercise:'var(--g)',study:'var(--b)',ai:'var(--p)',prayer:'var(--y)'};
  TASK_DEF.forEach(t=>{
    const isDone = d && d.tasks && d.tasks[t.id];
    const loggedMins = d && d.timeLog ? (d.timeLog[t.id]||0) : 0;
    const loggedH = loggedMins ? (loggedMins/60).toFixed(1)+'h logged' : '';
    tl.innerHTML += `<div class="day-task-row">
      <div class="day-task-cb ${isDone?'done-cb':'not-cb'}" style="${isDone?'background:'+catColors[t.cat]+';border:none;color:#000;':''}">${isDone?'✓':'✗'}</div>
      <div class="day-task-nm" style="color:${isDone?'var(--text)':'var(--muted)'}">${t.name}</div>
      <div class="day-task-time">${loggedH}</div>
    </div>`;
  });
 
  if(!d || done===0){
    tl.innerHTML = '<div style="text-align:center;color:var(--muted);font-size:0.7rem;padding:20px 0;">No data for this day</div>';
  }
 
  document.getElementById('dayModal').classList.add('open');
}
 
function closeDayModal(){
  document.getElementById('dayModal').classList.remove('open');
}
 
// close day modal on outside tap
document.getElementById('dayModal').addEventListener('click',function(e){
  if(e.target===this) closeDayModal();
});
 
// ══════════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════════
load();
setGreeting();
buildTasks();
buildWater();
buildMood();
buildPomoSelect();
updatePomoDial();
document.getElementById('pomoCount').textContent=today().pomoCount||0;
updateAll();
renderCalendar();

