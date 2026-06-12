// ═══════════════════════════════════════════════════════════════
// CONFIGURATION — replace with your Supabase project details
// ═══════════════════════════════════════════════════════════════
const SUPABASE_URL = window.__BOS_CONFIG__?.supabaseUrl || 'https://edoydkllhewebzzesiik.supabase.co';
const SUPABASE_ANON_KEY = window.__BOS_CONFIG__?.supabaseAnonKey || 'sb_publishable_1wvKXathwO2zXAo46XcxKQ_6BZBAlLW';
const STORAGE_BUCKET = 'quotes'; // Supabase Storage bucket name
const SESSION_KEY = 'bos_current_user_id';
const START_PAGE_KEY = 'bos_admin_start_page';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════
const TYPES=["Site Visit","Phone Call","Video Call","Email","Trade Show","Demo"];
const STAGES=["Qualified","Quote","Quote Sent","Approved","PO Received","Closed Won","Closed Lost"];
const DAY_NAMES=["Monday","Tuesday","Wednesday","Thursday","Friday"];
const DAY_SHORT=["Mon","Tue","Wed","Thu","Fri"];
const SC={"Qualified":"b-blue","Quote":"b-amber","Quote Sent":"b-purple","Approved":"b-teal","PO Received":"b-green","Closed Won":"b-green","Closed Lost":"b-coral"};
const DP={"Qualified":20,"Quote":35,"Quote Sent":50,"Approved":75,"PO Received":90,"Closed Won":100,"Closed Lost":0};
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const AV_BG=["#eff6ff","#f0fdf4","#fffbeb","#fef2f2"];
const AV_TX=["#1e40af","#166534","#92400e","#991b1b"];
const KPI_COMPANY=[
  {group:'Company-Wide KPIs',kpi:'Attendance & Punctuality',weight:10},
  {group:'Company-Wide KPIs',kpi:'Adherence to Company Policies & Procedures',weight:10},
  {group:'Company-Wide KPIs',kpi:'Teamwork & Professional Conduct',weight:10},
  {group:'Company-Wide KPIs',kpi:'Contribution toward Company GP Target',weight:15},
  {group:'Company-Wide KPIs',kpi:'Safety & Housekeeping Standards',weight:5},
];
const KPI_ROLE_SECTIONS={
  'Director':[
    {section:'Strategic Performance',weight:10,items:['Revenue growth','Gross profit growth','Achievement of strategic objectives','New business development success','Customer retention rate']},
    {section:'Operational Performance',weight:10,items:['Workshop productivity','On-time job completion','Operational efficiency improvements','Resource utilisation','BOS compliance and reporting accuracy']},
    {section:'Customer Performance',weight:10,items:['Customer satisfaction','Net Promoter Score (NPS)','Customer retention','Resolution of escalated customer issues']},
    {section:'Financial Performance',weight:10,items:['Business profitability','Budget performance','Cost control effectiveness','Cash flow stability']},
    {section:'Leadership Performance',weight:10,items:['Staff engagement','Team development','Employee retention','Achievement of departmental objectives']},
  ],
  'Head of Finance':[
    {section:'Financial Performance',weight:10,items:['Accuracy of financial records','Debtors collection performance','Supplier payment accuracy','Cash flow stability','Budget adherence']},
    {section:'Compliance Performance',weight:10,items:['Statutory submissions completed on time','Audit readiness','Compliance with financial controls','Accuracy of financial reporting']},
    {section:'Systems & Process Performance',weight:10,items:['Process improvement implementation','Administrative accuracy','System effectiveness','BOS support and development contributions']},
    {section:'Operational Support Performance',weight:10,items:['Timeliness of management reporting','Effectiveness of operational support','Workflow coordination support','Internal stakeholder satisfaction']},
    {section:'Leadership Performance',weight:10,items:['Departmental organisation','Administrative efficiency','Support provided to management','Contribution to strategic objectives']},
  ],
  'Head of Operations':[
    {section:'Customer Performance',weight:10,items:['Customer satisfaction and retention','Resolution time for operational or customer issues']},
    {section:'Operational Performance',weight:10,items:['Operational efficiency and turnaround times','Workflow coordination effectiveness','Procurement and parts turnaround efficiency','Reduction in operational delays and bottlenecks','Workshop productivity and scheduling performance']},
    {section:'Quotation & Procurement Performance',weight:10,items:['Accuracy and timeliness of quotations']},
    {section:'Systems & Reporting Performance',weight:10,items:['CRM and operational reporting accuracy']},
    {section:'Leadership Performance',weight:10,items:['Team coordination and communication']},
  ],
  'Business Support Lead':[
    {section:'Customer Service Performance',weight:8.3,items:['Customer enquiries responded to within agreed timeframes.','Professional customer service standards maintained.','Accuracy of communication and documentation.']},
    {section:'Administrative Performance',weight:8.3,items:['Accuracy of quotations and sales orders.','Filing and recordkeeping accuracy.','Job card administration accuracy.','Meeting documentation completion.']},
    {section:'BOS Performance',weight:8.3,items:['BOS updates completed timeously.','Workflow tracking accuracy.','Data integrity and reporting accuracy.']},
    {section:'Supplier Administration Performance',weight:8.3,items:['Supplier documentation accuracy.','Invoice capture accuracy.','Procurement administration efficiency.']},
    {section:'Human Resources Administration',weight:8.3,items:['Accuracy of attendance and leave records.','Timely completion of HR documentation.','Compliance with company policies and procedures.']},
    {section:'Process & Compliance Performance',weight:8.3,items:['SOPs maintained and updated.','Administrative process compliance.','Record management effectiveness.']},
  ],
  'Technical Representative':[
    {section:'Business Development',weight:10,items:['Monthly sales generated','New customer acquisition','Quote conversion rate','Sales pipeline growth','Customer retention rate']},
    {section:'Customer Service',weight:10,items:['Customer satisfaction','Customer response times','Customer follow-up completion','Customer relationship development']},
    {section:'Technical Performance',weight:10,items:['Accuracy of job assessments','Accuracy of parts identification','Quality of technical recommendations','Reduction in assessment-related rework']},
    {section:'Administration',weight:10,items:['BOS update compliance','Activity tracking accuracy','Job card completion accuracy','Reporting quality']},
    {section:'Operational Contribution',weight:10,items:['Team collaboration','Communication effectiveness','Workshop support contribution','Attendance and punctuality']},
  ],
  'Technician':[
    {section:'Technical Performance',weight:10,items:['Quality of workmanship','First-time repair success rate','Accuracy of diagnostics','Rework levels']},
    {section:'Productivity Performance',weight:10,items:['Jobs completed within allocated timeframes','Workshop productivity contribution','Job completion efficiency','Turnaround times']},
    {section:'Safety Performance',weight:10,items:['Compliance with PPE requirements','Adherence to safety procedures','Incident-free work performance','Housekeeping standards']},
    {section:'Administrative Performance',weight:10,items:['Job card completion accuracy','Quality of technical reporting','Timeliness of documentation','Accuracy of repair records']},
    {section:'Team Performance',weight:10,items:['Teamwork and cooperation','Communication effectiveness','Reliability and attendance','Contribution to workshop objectives']},
  ],
  'Technical Assistant':[
    {section:'Workshop Performance',weight:12.5,items:['Completion of assigned tasks','Workshop cleanliness and organisation','Productivity and efficiency','Quality of support provided']},
    {section:'Safety Performance',weight:12.5,items:['Compliance with PPE requirements','Adherence to safety procedures','Incident-free work performance','Housekeeping standards']},
    {section:'Team Performance',weight:12.5,items:['Attendance and punctuality','Teamwork and cooperation','Responsiveness to instructions','Positive contribution to workshop operations']},
    {section:'Development Performance',weight:12.5,items:['Skills improvement and training participation','Technical knowledge development','Ability to take on increased responsibility','Progress toward Technician competency']},
  ],
  'Domestic & Facilities Assistant':[
    {section:'Housekeeping Standards',weight:12.5,items:['Cleanliness and presentation of assigned areas.','Consistency of cleaning standards.','Hygiene and sanitation compliance.','Staff and management satisfaction.']},
    {section:'Facilities Management',weight:12.5,items:['Timely reporting of maintenance issues.','Availability of cleaning and household supplies.','Organisation and presentation of communal areas.','Care of company facilities and equipment.']},
    {section:'Hospitality & Support',weight:12.5,items:['Quality of hospitality services.','Preparedness for meetings and visitors.','Responsiveness to support requests.','Assistance provided during company activities.']},
    {section:'Reliability & Professionalism',weight:12.5,items:['Attendance and punctuality.','Dependability and work ethic.','Compliance with company procedures.','Professional conduct and confidentiality.']},
  ],
};
const KPI_ROLES=Object.keys(KPI_ROLE_SECTIONS);

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════
let currentUser=null;
let users=[], activities=[], deals=[], quotes=[], forecasts={}, wipJobs=[];
let modalMode='', targetId=null;
let wipStaffRows=[];
let plannerEntries=[], plannerWeekStart=null, teamMembers=[], plannerTaskRows=[];
let performanceTimesheets=[];
let kpiScorecards=[], performanceMode='time', kpiScoreSeed={};

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
const isSuperAdmin=()=>currentUser?.role==='super_admin';
const isAdmin=()=>['admin','super_admin'].includes(currentUser?.role);
const isRep=()=>currentUser?.role==='rep';
const reps=()=>users.filter(u=>u.role==='rep');
const repNames=()=>reps().map(u=>u.name);
const repOpts=(sel='')=>repNames().map(n=>`<option${n===sel?' selected':''}>${n}</option>`).join('');
const today=()=>new Date().toISOString().slice(0,10);
const fmtDate=d=>{if(!d)return'';const p=d.split('-');return`${p[2]}/${p[1]}/${p[0]}`};
const fmt=n=>'R '+Math.round(n).toLocaleString('en-ZA');
const sameId=(a,b)=>String(a)===String(b);
const findById=(list,id)=>list.find(x=>sameId(x.id,id));
const pctFmt=(v,t)=>t>0?Math.round(v/t*100):0;
const pctColor=p=>p>=100?'good':p>=60?'mid':'low';
const barColorPct=p=>p>=100?'bar-green':p>=60?'bar-amber':'bar-red';
const initials=n=>(n||'?').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
const avStyle=i=>{const j=(i||0)%4;return`background:${AV_BG[j]};color:${AV_TX[j]}`};
const monthKey=(y,m)=>`${y}-${String(m+1).padStart(2,'0')}`;
const currentMonthKey=()=>{const n=new Date();return monthKey(n.getFullYear(),n.getMonth())};
const rolePillClass=r=>r==='super_admin'?'pill-super':r==='admin'?'pill-admin':r==='team'?'pill-team':'pill-rep';
const roleLabel=r=>r==='super_admin'?'Super Admin':r==='admin'?'Admin':r==='team'?'Team':'Rep';
const g=id=>document.getElementById(id)?.value||'';
const wonForRepMonth=(rn,mk)=>deals.filter(d=>d.rep===rn&&d.status==='Won'&&d.close?.startsWith(mk)).reduce((s,d)=>s+d.value,0);
const weightedForRep=rn=>deals.filter(d=>d.rep===rn&&d.status==='Active').reduce((s,d)=>s+d.value*d.prob/100,0);
const quotesForDeal=dealId=>quotes.filter(q=>sameId(q.deal_id,dealId));
const daysUntil=d=>{if(!d)return null;return Math.ceil((new Date(d)-new Date(today()))/86400000)};
const addDays=(dateStr,n)=>{const d=new Date(dateStr);d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
const fmtMonth=d=>{const p=d.split('-');return`${MONTHS[parseInt(p[1])-1]} ${p[0]}`};
const kpiTemplateRows=role=>[
  ...KPI_COMPANY.map(r=>({...r,items:[]})),
  ...(KPI_ROLE_SECTIONS[role]||[]).map(r=>({group:`${role} KPIs`,kpi:r.section,weight:r.weight,items:r.items||[],roleSection:true}))
];
const kpiScorePercent=items=>items.reduce((s,i)=>s+((parseFloat(i.score)||0)/5*(parseFloat(i.weight)||0)),0);
const kpiBandClass=p=>p>=85?'b-green':p>=70?'b-blue':p>=55?'b-amber':'b-coral';
function getMondayOf(dateStr){const d=new Date(dateStr);const day=d.getDay();const diff=(day===0?-6:1-day);d.setDate(d.getDate()+diff);return d.toISOString().slice(0,10);}
function plannerPrevWeek(){plannerWeekStart=addDays(plannerWeekStart,-7);renderPlanner();}
function plannerNextWeek(){plannerWeekStart=addDays(plannerWeekStart,7);renderPlanner();}
function plannerThisWeek(){plannerWeekStart=getMondayOf(today());renderPlanner();}
const canUsePlanner=()=>isAdmin()||isRep();
const isOwnPlannerName=name=>String(name||'').toLowerCase()===String(currentUser?.name||'').toLowerCase();
const plannerVisibleMembers=()=>isAdmin()?teamMembers:[{id:currentUser?.id||'me',name:currentUser?.name||'Me'}];
const canModifyPlannerEntry=e=>isAdmin()||(isRep()&&e&&isOwnPlannerName(e.staff_name)&&!e.locked_by_admin);
const canCompletePlannerEntry=e=>isAdmin()||(isRep()&&e&&isOwnPlannerName(e.staff_name));
const adminStartPageStorageKey=()=>`${START_PAGE_KEY}_${currentUser?.id||'default'}`;
function getAdminStartPage(){
  if(!isAdmin())return 'dashboard';
  const allowed=['dashboard','deals','forecast','eod','conversion','activity','pipeline','wip','cashflow','planner','perf','users'];
  const saved=localStorage.getItem(adminStartPageStorageKey())||'dashboard';
  return allowed.includes(saved)?saved:'dashboard';
}
function saveAdminStartPage(){
  if(!isAdmin())return;
  const sel=document.getElementById('admin-start-page');
  if(!sel)return;
  localStorage.setItem(adminStartPageStorageKey(),sel.value||'dashboard');
  toast('Start page saved');
}

function getFC(rn,mk){
  if(!forecasts[rn])forecasts[rn]={};
  if(!forecasts[rn][mk])forecasts[rn][mk]={won_target:0,weighted_target:0,notes:'',submitted:false,submitted_at:null,admin_override:false};
  return forecasts[rn][mk];
}

// ── UI ─────────────────────────────────────────────────────────
function showLoading(msg='Loading…'){document.getElementById('loading-msg').textContent=msg;document.getElementById('loading-overlay').style.display='flex';}
function hideLoading(){document.getElementById('loading-overlay').style.display='none';}
function toast(msg,type='ok'){const t=document.getElementById('toast');t.textContent=msg;t.className=`toast show ${type}`;setTimeout(()=>t.classList.remove('show'),3200);}

// ═══════════════════════════════════════════════════════════════
// DATA LAYER
// ═══════════════════════════════════════════════════════════════
async function loadAllData(){
  showLoading('Loading data…');
  try{
    const[{data:u},{data:a},{data:d},{data:q},{data:f},{data:wj},{data:pe},{data:tm}]=await Promise.all([
      sb.from('users').select('*').order('name'),
      sb.from('activities').select('*').order('date',{ascending:false}),
      sb.from('deals').select('*').order('created_at',{ascending:false}),
      sb.from('quotes').select('*').order('uploaded_at',{ascending:false}),
      sb.from('forecasts').select('*'),
      sb.from('wip_jobs').select('*, wip_staff_tasks(*)').order('created_at',{ascending:false}),
      sb.from('team_planner').select('*').order('week_start').order('day_index'),
      sb.from('team_members').select('*').order('name'),
    ]);
    users=u||[];activities=a||[];deals=d||[];quotes=q||[];wipJobs=wj||[];plannerEntries=pe||[];teamMembers=tm||[];
    try{const{data:pts}=await sb.from('performance_timesheets').select('*').order('date',{ascending:false});performanceTimesheets=pts||[];}
    catch(pe2){console.warn('performance_timesheets not available:',pe2);performanceTimesheets=[];}
    try{const{data:ks}=await sb.from('kpi_scorecards').select('*').order('created_at',{ascending:false});kpiScorecards=ks||[];}
    catch(ks2){console.warn('kpi_scorecards not available:',ks2);kpiScorecards=[];}
    forecasts={};
    (f||[]).forEach(row=>{
      if(!forecasts[row.rep_name])forecasts[row.rep_name]={};
      forecasts[row.rep_name][row.month_key]={won_target:row.won_target,weighted_target:row.weighted_target,notes:row.notes,submitted:row.submitted,submitted_at:row.submitted_at,admin_override:row.admin_override};
    });
  }catch(e){toast('Failed to load data','err');console.error(e);}
  hideLoading();
}

async function dbInsert(table,data){const{data:r,error}=await sb.from(table).insert(data).select().single();if(error)throw error;return r;}
async function dbUpdate(table,id,data){const{error}=await sb.from(table).update(data).eq('id',id);if(error)throw error;}
async function dbDelete(table,id){const{error}=await sb.from(table).delete().eq('id',id);if(error)throw error;}
async function dbUpsertForecast(rn,mk,data){const{error}=await sb.from('forecasts').upsert({rep_name:rn,month_key:mk,...data},{onConflict:'rep_name,month_key'});if(error)throw error;}

// ── QUOTE STORAGE ───────────────────────────────────────────────
async function uploadQuoteToDB(dealId,file){
  // 1. Upload file to Supabase Storage
  const filePath=`${dealId}/${Date.now()}_${file.name}`;
  const{error:upErr}=await sb.storage.from(STORAGE_BUCKET).upload(filePath,file,{contentType:'application/pdf',upsert:false});
  if(upErr)throw upErr;
  // 2. Get public URL
  const{data:{publicUrl}}=sb.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
  // 3. Save metadata to quotes table
  const row=await dbInsert('quotes',{deal_id:dealId,file_name:file.name,file_path:filePath,public_url:publicUrl,uploaded_by:currentUser.name,uploaded_at:today()});
  return row;
}

async function deleteQuoteFromDB(quoteId,filePath){
  await sb.storage.from(STORAGE_BUCKET).remove([filePath]);
  await dbDelete('quotes',quoteId);
}

// ═══════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════
function applyAuthenticatedUI(){
  document.getElementById('login-screen').style.display='none';
  document.getElementById('main-app').style.display='block';
  document.getElementById('topbar-name').textContent=currentUser.name;
  const rb=document.getElementById('topbar-role');rb.className='role-pill '+rolePillClass(currentUser.role);
  rb.innerHTML=`<i class="ti ti-${currentUser.role==='super_admin'?'shield-check':currentUser.role==='admin'?'shield':currentUser.role==='team'?'users':'user'}"></i> ${roleLabel(currentUser.role)}`;
  document.getElementById('tab-wip-btn').style.display=isAdmin()?'':'none';
  document.getElementById('tab-cashflow-btn').style.display=isAdmin()?'':'none';
  document.getElementById('tab-planner-btn').style.display=canUsePlanner()?'':'none';
  document.getElementById('tab-perf-btn').style.display=isAdmin()?'':'none';
  document.getElementById('tab-users-btn').style.display=isAdmin()?'':'none';
  const startWrap=document.getElementById('admin-start-page-wrap');
  const startSel=document.getElementById('admin-start-page');
  if(startWrap)startWrap.style.display=isAdmin()?'inline-flex':'none';
  if(startSel)startSel.value=getAdminStartPage();
}

async function restoreSession(){
  const storedId=localStorage.getItem(SESSION_KEY);
  if(!storedId)return;
  showLoading('Restoring session…');
  try{
    const{data,error}=await sb.from('users').select('*').eq('id',storedId).maybeSingle();
    if(error||!data){localStorage.removeItem(SESSION_KEY);return;}
    currentUser=data;
    applyAuthenticatedUI();
    await loadAllData();
    switchTab(getAdminStartPage());
  }catch(e){
    localStorage.removeItem(SESSION_KEY);
    console.error(e);
  }finally{
    hideLoading();
  }
}

async function doLogin(){
  const un=g('login-user').trim().toLowerCase(),pw=g('login-pass');
  if(!un||!pw){document.getElementById('login-error').textContent='Please enter username and password.';document.getElementById('login-error').style.display='block';return;}
  const btn=document.getElementById('login-btn');btn.disabled=true;btn.innerHTML='<div class="spinner"></div> Signing in…';
  document.getElementById('login-error').style.display='none';
  try{
    const{data,error}=await sb.from('users').select('*').eq('username',un).eq('password',pw).maybeSingle();
    if(error||!data){document.getElementById('login-error').textContent='Incorrect username or password.';document.getElementById('login-error').style.display='block';return;}
    currentUser=data;
    localStorage.setItem(SESSION_KEY,String(currentUser.id));
    applyAuthenticatedUI();
    await loadAllData();
    switchTab(getAdminStartPage());
  }catch(e){document.getElementById('login-error').textContent='Login failed. Please try again.';document.getElementById('login-error').style.display='block';console.error(e);}
  finally{btn.disabled=false;btn.innerHTML='<i class="ti ti-login"></i> Sign in';}
}

function doLogout(){
  localStorage.removeItem(SESSION_KEY);
  currentUser=null;users=[];activities=[];deals=[];quotes=[];forecasts={};wipJobs=[];wipStaffRows=[];plannerEntries=[];plannerWeekStart=null;teamMembers=[];plannerTaskRows=[];performanceTimesheets=[];kpiScorecards=[];performanceMode='time';kpiScoreSeed={};
  document.getElementById('login-screen').style.display='block';
  document.getElementById('main-app').style.display='none';
  document.getElementById('login-user').value='';document.getElementById('login-pass').value='';
  document.getElementById('login-error').style.display='none';
}

// ═══════════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════════
function switchTab(t){
  const names=['dashboard','deals','forecast','eod','conversion','activity','pipeline','wip','cashflow','planner','perf','users'];
  document.querySelectorAll('.tab').forEach((el,i)=>el.classList.toggle('active',names[i]===t));
  document.querySelectorAll('.panel').forEach(el=>el.classList.remove('active'));
  const p=document.getElementById('tab-'+t);if(p)p.classList.add('active');
  const pln=document.getElementById('pipe-lock-notice');if(pln)pln.style.display=isAdmin()?'none':'inline-flex';
  if(t==='dashboard')renderDashboard();
  if(t==='deals')renderDeals();
  if(t==='forecast')renderForecast();
  if(t==='eod')renderEOD();
  if(t==='conversion')renderConversion();
  if(t==='activity')renderActivity();
  if(t==='pipeline')renderPipeline();
  if(t==='wip')renderWIP();
  if(t==='cashflow')renderCashflow();
  if(t==='planner')renderPlanner();
  if(t==='perf')renderPerformance();
  if(t==='users')renderUsers();
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════
function renderDashboard(){
  const mk=currentMonthKey();const repList=reps();
  if(!repList.length){document.getElementById('dash-content').innerHTML=`<div class="info-banner"><i class="ti ti-info-circle" style="font-size:20px;flex-shrink:0"></i><div><div style="font-weight:500;margin-bottom:3px">No reps yet</div><div>Add reps in the <a href="#" onclick="switchTab('users');return false" style="color:var(--info-text)">Users tab</a> to start tracking sales.</div></div></div>`;return;}
  let teamWonT=0,teamWtT=0,teamWonA=0,teamWtA=0;
  repList.forEach(r=>{const fc=getFC(r.name,mk);teamWonT+=fc.won_target||0;teamWtT+=fc.weighted_target||0;teamWonA+=wonForRepMonth(r.name,mk);teamWtA+=weightedForRep(r.name);});
  const wonPct=pctFmt(teamWonA,teamWonT),wtPct=pctFmt(teamWtA,teamWtT);
  const active=deals.filter(d=>d.status==='Active');
  const tp=active.reduce((s,d)=>s+d.value,0),wt=active.reduce((s,d)=>s+d.value*d.prob/100,0);
  const pend=activities.filter(a=>a.followup==='Yes').length;
  const overallWin=deals.length>0?Math.round(deals.filter(d=>d.status==='Won').length/deals.length*100):0;
  let h=`<div class="kpi-grid">
    <div class="kpi"><div class="kpi-label">Active pipeline</div><div class="kpi-val">${fmt(tp)}</div></div>
    <div class="kpi"><div class="kpi-label">Weighted pipeline</div><div class="kpi-val">${fmt(Math.round(wt))}</div></div>
    <div class="kpi"><div class="kpi-label">Overall win rate</div><div class="kpi-val">${overallWin}%</div></div>
    <div class="kpi"><div class="kpi-label">Follow-ups pending</div><div class="kpi-val">${pend}</div></div>
    <div class="kpi"><div class="kpi-label">Won vs target (${MONTHS[new Date().getMonth()]})</div><div class="kpi-val ${pctColor(wonPct)}">${teamWonT?wonPct+'%':'—'}</div><div class="kpi-sub">${teamWonT?fmt(teamWonA)+' of '+fmt(teamWonT):'No targets set'}</div></div>
    <div class="kpi"><div class="kpi-label">Weighted vs target</div><div class="kpi-val ${pctColor(wtPct)}">${teamWtT?wtPct+'%':'—'}</div><div class="kpi-sub">${teamWtT?fmt(Math.round(teamWtA))+' of '+fmt(teamWtT):''}</div></div>
  </div>`;
  h+=`<div class="section-hd" style="margin-bottom:10px">Rep target progress — ${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}</div>`;
  repList.forEach((r,i)=>{
    const fc=getFC(r.name,mk);const wonA=wonForRepMonth(r.name,mk),wtA=weightedForRep(r.name);
    const wonP=pctFmt(wonA,fc.won_target),wtP=pctFmt(wtA,fc.weighted_target);
    const hasTarget=fc.submitted&&(fc.won_target>0||fc.weighted_target>0);
    h+=`<div class="target-strip"><div class="target-strip-hd">
      <div class="target-strip-name"><div class="avatar" style="${avStyle(i)};width:28px;height:28px;font-size:10px;font-weight:600">${initials(r.name)}</div>
        <span>${r.name}</span>${fc.submitted?`<span class="submitted-badge" style="margin-left:4px"><i class="ti ti-check" style="font-size:10px"></i> Submitted</span>`:''}
      </div>
      ${hasTarget?`<div class="target-strip-pcts"><div class="target-pct"><div class="target-pct-val ${pctColor(wonP)}">${wonP}%</div><div class="target-pct-label">Won</div></div><div class="target-pct"><div class="target-pct-val ${pctColor(wtP)}">${wtP}%</div><div class="target-pct-label">Weighted</div></div></div>`:''}
    </div>
    ${hasTarget?`<div style="margin-bottom:6px"><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-secondary);margin-bottom:3px"><span>Won: ${fmt(wonA)} of ${fmt(fc.won_target)}</span><span>${wonP}%</span></div><div class="bar-track"><div class="bar-fill ${barColorPct(wonP)}" style="width:${Math.min(wonP,100)}%"></div></div></div><div><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-secondary);margin-bottom:3px"><span>Weighted: ${fmt(Math.round(wtA))} of ${fmt(fc.weighted_target)}</span><span>${wtP}%</span></div><div class="bar-track"><div class="bar-fill bar-blue" style="width:${Math.min(wtP,100)}%"></div></div></div>`:`<div style="font-size:12px;color:var(--text-tertiary);font-style:italic">No forecast submitted yet</div>`}
    </div>`;
  });
  const funnelStages=STAGES.filter(s=>s!=='Closed Won'&&s!=='Closed Lost');
  let fH=`<div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap">`;
  funnelStages.forEach(s=>{const ds=deals.filter(d=>d.stage===s);const v=ds.reduce((t,d)=>t+d.value,0);fH+=`<div style="flex:1;min-width:80px;background:var(--bg-secondary);border-radius:var(--radius-md);padding:12px;text-align:center;border:0.5px solid var(--border-light)"><div style="font-size:10px;color:var(--text-secondary);font-weight:500;text-transform:uppercase;margin-bottom:5px">${s}</div><div style="font-size:18px;font-weight:600">${ds.length}</div><div style="font-size:10px;color:var(--text-secondary);margin-top:3px">${v?fmt(v):''}</div></div>`;});
  fH+=`</div>`;
  h+=`<div class="section-hd" style="margin-top:20px;margin-bottom:10px">Pipeline funnel</div>${fH}<div class="two-col"><div><div class="section-hd">Pipeline by stage</div>`;
  h+=STAGES.map(s=>{const ds=deals.filter(d=>d.stage===s);const v=ds.reduce((t,d)=>t+d.value,0);return`<div class="stage-row"><span class="badge ${SC[s]||'b-gray'}" style="min-width:90px;text-align:center">${s}</span><span style="font-size:12px;color:var(--text-secondary)">${ds.length} deal${ds.length!==1?'s':''}</span><span style="margin-left:auto;font-size:12px;font-weight:500">${v?fmt(v):''}</span></div>`;}).join('');
  h+=`</div><div><div class="section-hd">Rep performance</div>`;
  h+=repList.map((r,i)=>{const rd=deals.filter(d=>d.rep===r.name);const wr=rd.length>0?Math.round(rd.filter(d=>d.status==='Won').length/rd.length*100):0;const wv=rd.filter(d=>d.status==='Won').reduce((s,d)=>s+d.value,0);return`<div class="stage-row"><div class="avatar" style="${avStyle(i)};width:28px;height:28px;font-size:10px;font-weight:600">${initials(r.name)}</div><span style="font-size:13px;font-weight:500">${r.name}</span><span style="margin-left:6px" class="badge ${wr>=60?'b-green':wr>=35?'b-amber':'b-coral'}">${wr}% win</span><span style="margin-left:auto;font-size:12px;font-weight:500">${wv?fmt(wv):'—'}</span></div>`;}).join('');
  h+=`</div></div>`;document.getElementById('dash-content').innerHTML=h;
}

// ═══════════════════════════════════════════════════════════════
// DEALS TAB
// ═══════════════════════════════════════════════════════════════
function renderDeals(){
  const searchQ=(document.getElementById('deal-search')?.value||'').toLowerCase();
  const stageFil=document.getElementById('deal-stage')?.value||'';
  const repFil=document.getElementById('deal-rep')?.value||'';
  const activeDeals=deals.filter(d=>d.status==='Active');
  const totalPipe=activeDeals.reduce((s,d)=>s+d.value,0);
  const weighted=activeDeals.reduce((s,d)=>s+d.value*d.prob/100,0);
  const withQuotes=activeDeals.filter(d=>quotesForDeal(d.id).length>0).length;
  const overdue=activeDeals.filter(d=>d.close&&daysUntil(d.close)<0).length;
  const repNames2=[...new Set(activeDeals.map(d=>d.rep))].sort();
  let filtered=activeDeals.filter(d=>
    (!stageFil||d.stage===stageFil)&&(!repFil||d.rep===repFil)&&
    (!searchQ||[d.opportunity,d.customer,d.company].join(' ').toLowerCase().includes(searchQ))
  );
  if(isRep())filtered=filtered.filter(d=>d.rep===currentUser.name);

  let h=`<div class="kpi-grid">
    <div class="kpi"><div class="kpi-label">Active deals</div><div class="kpi-val">${activeDeals.length}</div></div>
    <div class="kpi"><div class="kpi-label">Pipeline value</div><div class="kpi-val" style="font-size:17px">${fmt(totalPipe)}</div></div>
    <div class="kpi"><div class="kpi-label">Weighted value</div><div class="kpi-val" style="font-size:17px">${fmt(Math.round(weighted))}</div></div>
    <div class="kpi"><div class="kpi-label">Quotes uploaded</div><div class="kpi-val">${withQuotes} / ${activeDeals.length}</div></div>
    <div class="kpi"><div class="kpi-label">Overdue</div><div class="kpi-val ${overdue>0?'low':''}">${overdue}</div></div>
  </div>
  <div class="toolbar">
    <input type="text" id="deal-search" placeholder="Search deals…" oninput="renderDeals()" value="${searchQ}" style="width:175px">
    <select id="deal-stage" onchange="renderDeals()" style="height:32px"><option value="">All stages</option>${STAGES.map(s=>`<option${s===stageFil?' selected':''}>${s}</option>`).join('')}</select>
    ${!isRep()?`<select id="deal-rep" onchange="renderDeals()" style="height:32px"><option value="">All reps</option>${repNames2.map(r=>`<option${r===repFil?' selected':''}>${r}</option>`).join('')}</select>`:''}
    <button class="btn primary" onclick="openModal('pipeline')"><i class="ti ti-plus"></i> Add deal</button>
  </div>`;

  if(!filtered.length){h+=`<div class="empty">No active deals match your filters</div>`;document.getElementById('deals-content').innerHTML=h;return;}

  h+=`<div class="deals-grid">`;
  filtered.forEach(d=>{
    const qs=quotesForDeal(d.id);
    const days=daysUntil(d.close);
    const closeClass=days===null?'':days<0?'overdue':days<=7?'due-soon':'';
    const closeLabel=days===null?'No close date':days<0?`${Math.abs(days)}d overdue`:days===0?'Due today':days<=7?`Due in ${days}d`:`Close ${fmtDate(d.close)}`;
    h+=`<div class="deal-card">
      <div class="deal-card-top" style="cursor:pointer" onclick="openModal('viewDeal','${d.id}')">
        <div class="deal-card-hd">
          <div style="flex:1;min-width:0">
            <div class="deal-opp">${d.opportunity}</div>
            <div class="deal-meta">${d.customer} · ${d.company}</div>
          </div>
          <span class="badge ${SC[d.stage]||'b-gray'}" style="flex-shrink:0">${d.stage}</span>
        </div>
        <div class="deal-stats">
          <span class="deal-val">${fmt(d.value)}</span>
          <span class="badge b-gray">${d.prob}%</span>
          <span style="font-size:12px;color:var(--text-secondary)">${d.rep}</span>
          <span class="close-tag ${closeClass}" style="margin-left:auto">${closeLabel}</span>
        </div>
      </div>
      <div class="deal-card-body">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div class="section-hd" style="margin-bottom:0">Quotes (${qs.length})</div>
          ${isAdmin()?`<label style="cursor:pointer" title="Upload PDF quote" onclick="event.stopPropagation()">
            <div class="btn success" style="font-size:12px;padding:4px 10px"><i class="ti ti-upload"></i> Upload PDF</div>
            <input type="file" accept=".pdf,application/pdf" style="display:none" onchange="handleUpload(event,'${d.id}')">
          </label>`:''}
        </div>
        ${qs.length?qs.map(q=>`<div class="quote-item">
          <i class="ti ti-file-type-pdf" style="font-size:18px;color:#C0392B;flex-shrink:0"></i>
          <span class="quote-item-name" title="${q.file_name}">${q.file_name}</span>
          <span class="quote-item-date">${fmtDate(q.uploaded_at)}</span>
          <a href="${q.public_url}" target="_blank" class="btn" style="font-size:11px;padding:3px 8px;text-decoration:none"><i class="ti ti-eye"></i> View</a>
          ${isAdmin()?`<button class="icon-btn del" onclick="removeQuote(${q.id},'${q.file_path}')" title="Remove quote"><i class="ti ti-trash"></i></button>`:''}
        </div>`).join(''):`<div style="font-size:12px;color:var(--text-tertiary);font-style:italic;padding:4px 0">${isAdmin()?'No quotes yet — upload a PDF above':'No quotes uploaded yet'}</div>`}
        <div class="prog-bar" id="prog-${d.id}"><div class="prog-fill" id="prog-fill-${d.id}" style="width:0%"></div></div>
      </div>
      <div class="deal-card-footer">
        <div style="display:flex;gap:6px">
          <button class="btn" style="font-size:12px" onclick="event.stopPropagation();openModal('editDeal','${d.id}')"><i class="ti ti-edit"></i> Edit</button>
          ${isAdmin()?`<button class="icon-btn del" onclick="event.stopPropagation();openModal('deleteDeal','${d.id}')" title="Delete deal"><i class="ti ti-trash"></i></button>`:''}
        </div>
        <div style="font-size:12px;color:var(--text-secondary)">Weighted: ${fmt(Math.round(d.value*d.prob/100))}</div>
      </div>
    </div>`;
  });
  h+=`</div>`;
  document.getElementById('deals-content').innerHTML=h;
}

async function handleUpload(event,dealId){
  const file=event.target.files[0];event.target.value='';
  if(!file){return;}
  if(file.type!=='application/pdf'&&!file.name.toLowerCase().endsWith('.pdf')){toast('Please select a PDF file','err');return;}
  if(file.size>15*1024*1024){toast('File must be under 15MB','err');return;}
  const prog=document.getElementById(`prog-${dealId}`);
  const fill=document.getElementById(`prog-fill-${dealId}`);
  if(prog){prog.style.display='block';fill.style.width='10%';}
  let tick=10;const interval=setInterval(()=>{tick=Math.min(tick+10,85);if(fill)fill.style.width=tick+'%';},200);
  try{
    const row=await uploadQuoteToDB(dealId,file);
    clearInterval(interval);if(fill)fill.style.width='100%';
    quotes.push(row);
    toast(`"${file.name}" uploaded`);
    setTimeout(()=>{if(prog)prog.style.display='none';renderDeals();},400);
  }catch(e){clearInterval(interval);if(prog)prog.style.display='none';toast('Upload failed: '+e.message,'err');console.error(e);}
}

async function removeQuote(quoteId,filePath){
  if(!confirm('Remove this quote? This cannot be undone.'))return;
  showLoading('Removing…');
  try{await deleteQuoteFromDB(quoteId,filePath);quotes=quotes.filter(q=>q.id!==quoteId);toast('Quote removed');renderDeals();}
  catch(e){toast('Remove failed','err');console.error(e);}
  hideLoading();
}

// ═══════════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════════
function renderUsers(){
  if(!isAdmin()){document.getElementById('users-content').innerHTML=`<div class="empty">Admin access required</div>`;return;}
  const admins=users.filter(u=>u.role==='admin');const repList=reps();const teamList=users.filter(u=>u.role==='team');
  let h=`<div class="info-banner"><i class="ti ti-shield-lock" style="font-size:20px;flex-shrink:0"></i><div><div style="font-weight:500;margin-bottom:2px">User management</div><div>Create admins, reps and team members. Admins manage pipeline, deals, quotes and forecasts. Reps log activities and submit forecasts. Team members access operational tools.</div></div></div>`;
  h+=`<div class="section-hd" style="margin-bottom:10px">Admins</div><div class="toolbar" style="margin-bottom:14px"><button class="btn primary" onclick="openModal('newUser','admin')"><i class="ti ti-plus"></i> Add admin</button></div>`;
  if(!admins.length){h+=`<div style="padding:1.5rem;background:var(--bg-secondary);border-radius:var(--radius-md);margin-bottom:1.5rem;font-size:13px;color:var(--text-secondary)">No admins yet</div>`;}
  else{h+=`<div class="user-grid" style="margin-bottom:1.5rem">${admins.map((u,i)=>userCard(u,i)).join('')}</div>`;}
  h+=`<div class="section-hd" style="margin-bottom:10px">Reps</div><div class="toolbar" style="margin-bottom:14px"><button class="btn primary" onclick="openModal('newUser','rep')"><i class="ti ti-plus"></i> Add rep</button></div>`;
  if(!repList.length){h+=`<div style="padding:1.5rem;background:var(--bg-secondary);border-radius:var(--radius-md);margin-bottom:1.5rem;font-size:13px;color:var(--text-secondary)">No reps yet — add your first rep to start tracking</div>`;}
  else{h+=`<div class="user-grid" style="margin-bottom:1.5rem">${repList.map((u,i)=>userCard(u,i)).join('')}</div>`;}
  h+=`<div class="section-hd" style="margin-bottom:10px">Team</div><div class="toolbar" style="margin-bottom:14px"><button class="btn primary" onclick="openModal('newUser','team')"><i class="ti ti-plus"></i> Add team member</button></div>`;
  if(!teamList.length){h+=`<div style="padding:1.5rem;background:var(--bg-secondary);border-radius:var(--radius-md);font-size:13px;color:var(--text-secondary)">No team members yet — add your first team member</div>`;}
  else{h+=`<div class="user-grid">${teamList.map((u,i)=>userCard(u,i)).join('')}</div>`;}
  document.getElementById('users-content').innerHTML=h;
}

function userCard(u,i){
  const acts=activities.filter(a=>a.rep===u.name).length;
  const pipe=deals.filter(d=>d.rep===u.name&&d.status==='Active').reduce((s,d)=>s+d.value,0);
  return`<div class="user-card">
    <div class="avatar" style="${avStyle(i)}">${initials(u.name)}</div>
    <div class="user-info-block">
      <div class="user-name">${u.name}</div>
      <div class="user-meta"><i class="ti ti-at" style="font-size:12px"></i> ${u.username}</div>
      ${u.territory?`<div class="user-meta"><i class="ti ti-map-pin" style="font-size:12px"></i> ${u.territory}</div>`:''}
      <div class="user-meta" style="margin-top:4px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <span class="role-pill ${rolePillClass(u.role)}" style="font-size:10px;padding:2px 7px">${roleLabel(u.role)}</span>
        ${u.role==='rep'?`<span>${acts} acts</span>${pipe?`<span style="color:var(--success-text);font-weight:500">${fmt(pipe)}</span>`:''}`:''}</div>
    </div>
    <div class="user-actions">
      <button class="icon-btn" onclick="openModal('editUser',${u.id})" title="Edit"><i class="ti ti-edit"></i></button>
      <button class="icon-btn del" onclick="openModal('deleteUser',${u.id})" title="Remove"><i class="ti ti-trash"></i></button>
    </div>
  </div>`;
}

// ═══════════════════════════════════════════════════════════════
// FORECAST
// ═══════════════════════════════════════════════════════════════
function getFCMonthKey(){return document.getElementById('fc-month-sel')?.value||currentMonthKey();}

function renderForecast(){
  const repList=reps();if(!repList.length){document.getElementById('fc-content').innerHTML=`<div class="info-banner"><i class="ti ti-info-circle" style="font-size:20px;flex-shrink:0"></i><div>No reps yet. Add reps in the Users tab first.</div></div>`;return;}
  const now=new Date();let monthOpts='';
  for(let delta=-3;delta<=6;delta++){const d=new Date(now.getFullYear(),now.getMonth()+delta,1);const mk=monthKey(d.getFullYear(),d.getMonth());monthOpts+=`<option value="${mk}"${mk===currentMonthKey()?' selected':''}>${MONTHS[d.getMonth()]} ${d.getFullYear()}</option>`;}
  document.getElementById('fc-content').innerHTML=`<div style="display:flex;align-items:center;gap:10px;margin-bottom:1.5rem;flex-wrap:wrap"><span style="font-size:13px;font-weight:500;color:var(--text-secondary)">Month:</span><select id="fc-month-sel" onchange="renderForecastCards()">${monthOpts}</select></div><div id="fc-cards"></div>`;
  renderForecastCards();
}

function renderForecastCards(){
  const mk=getFCMonthKey();const[y,m]=mk.split('-').map(Number);const ml=`${MONTHS[m-1]} ${y}`;
  const admin=isAdmin();const visibleReps=isRep()?reps().filter(r=>r.name===currentUser.name):reps();
  let h='';
  visibleReps.forEach((r,i)=>{
    const fc=getFC(r.name,mk);const wonA=wonForRepMonth(r.name,mk);const wtA=weightedForRep(r.name);
    const wonP=pctFmt(wonA,fc.won_target);const wtP=pctFmt(wtA,fc.weighted_target);
    const wonDeals=deals.filter(d=>d.rep===r.name&&d.status==='Won'&&d.close?.startsWith(mk));
    const activeCt=deals.filter(d=>d.rep===r.name&&d.status==='Active').length;
    const canEdit=admin||!fc.submitted;
    h+=`<div class="fc-rep-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <div class="avatar" style="${avStyle(i)}">${initials(r.name)}</div>
          <div><div style="font-size:14px;font-weight:500">${r.name}</div><div style="font-size:12px;color:var(--text-secondary)">${r.territory||'No territory'} · ${ml}</div></div>
          ${fc.submitted?`<span class="submitted-badge"><i class="ti ti-check" style="font-size:10px"></i> Submitted ${fc.submitted_at?fmtDate(fc.submitted_at):''}</span>`:''}
          ${fc.admin_override?`<span class="admin-badge"><i class="ti ti-shield" style="font-size:10px"></i> Admin override</span>`:''}
        </div>
      </div>
      ${fc.submitted&&!admin?`<div class="locked-box"><i class="ti ti-lock" style="font-size:16px"></i><div><div style="font-weight:500;color:var(--text-primary)">Forecast locked</div><div>Your forecast for ${ml} has been submitted. Contact your admin if a change is needed.</div></div></div>`:''}
      <div class="fc-targets">
        <div class="fc-target-box">
          <div class="fc-label"><i class="ti ti-trophy" style="font-size:12px"></i> Won revenue target (R)</div>
          <input type="number" id="won-target-${r.id}" value="${fc.won_target||''}" placeholder="e.g. 150 000" min="0" ${canEdit?'':'disabled'} style="width:100%;font-size:14px;font-weight:500;margin-top:4px;opacity:${canEdit?1:0.5}">
          ${fc.won_target>0?`<div style="margin-top:10px"><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-secondary);margin-bottom:4px"><span>Actual won: ${fmt(wonA)}</span><span class="${pctColor(wonP)}" style="font-weight:500;font-size:14px">${wonP}%</span></div><div class="bar-track"><div class="bar-fill ${barColorPct(wonP)}" style="width:${Math.min(wonP,100)}%"></div></div>${wonDeals.length?`<div style="margin-top:6px;font-size:11px;color:var(--text-secondary)">${wonDeals.map(d=>`${d.opportunity} (${fmt(d.value)})`).join(' · ')}</div>`:'<div style="margin-top:6px;font-size:11px;color:var(--text-tertiary);font-style:italic">No deals won yet this month</div>'}</div>`:''}
        </div>
        <div class="fc-target-box">
          <div class="fc-label"><i class="ti ti-chart-line" style="font-size:12px"></i> Weighted pipeline target (R)</div>
          <input type="number" id="wt-target-${r.id}" value="${fc.weighted_target||''}" placeholder="e.g. 250 000" min="0" ${canEdit?'':'disabled'} style="width:100%;font-size:14px;font-weight:500;margin-top:4px;opacity:${canEdit?1:0.5}">
          ${fc.weighted_target>0?`<div style="margin-top:10px"><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-secondary);margin-bottom:4px"><span>Current weighted: ${fmt(Math.round(wtA))}</span><span class="${pctColor(wtP)}" style="font-weight:500;font-size:14px">${wtP}%</span></div><div class="bar-track"><div class="bar-fill bar-blue" style="width:${Math.min(wtP,100)}%"></div></div><div style="margin-top:6px;font-size:11px;color:var(--text-secondary)">${activeCt} active deal${activeCt!==1?'s':''} contributing</div></div>`:''}
        </div>
      </div>
      <div><div style="font-size:12px;color:var(--text-secondary);font-weight:500;margin-bottom:4px">Forecast notes & rationale</div>
        <textarea id="notes-${r.id}" style="width:100%;height:58px;resize:vertical;opacity:${canEdit?1:0.5}" ${canEdit?'':'disabled'}>${fc.notes||''}</textarea>
      </div>
      <div class="fc-save-row">
        ${admin?`<button class="btn" style="font-size:12px" onclick="adminSaveFC('${r.name}',${r.id})"><i class="ti ti-shield"></i> Save as admin override</button>`:''}
        ${admin&&fc.submitted?`<button class="btn" style="font-size:12px" onclick="adminUnlockFC('${r.name}','${mk}')"><i class="ti ti-lock-open"></i> Unlock for rep</button>`:''}
        ${!admin&&!fc.submitted?`<span style="font-size:12px;color:var(--text-secondary)"><i class="ti ti-info-circle"></i> Once submitted, you cannot edit this forecast.</span><button class="btn primary" onclick="repSubmitFC('${r.name}',${r.id})"><i class="ti ti-send"></i> Submit forecast</button>`:''}
      </div>
    </div>`;
  });
  document.getElementById('fc-cards').innerHTML=h||`<div class="empty">No reps to show</div>`;
}

async function repSubmitFC(rn,rid){
  const mk=getFCMonthKey();
  const data={won_target:parseFloat(g(`won-target-${rid}`))||0,weighted_target:parseFloat(g(`wt-target-${rid}`))||0,notes:g(`notes-${rid}`),submitted:true,submitted_at:today(),admin_override:false};
  showLoading('Saving forecast…');
  try{await dbUpsertForecast(rn,mk,data);if(!forecasts[rn])forecasts[rn]={};forecasts[rn][mk]=data;toast('Forecast submitted');renderForecastCards();}
  catch(e){toast('Save failed','err');console.error(e);}hideLoading();
}
async function adminSaveFC(rn,rid){
  const mk=getFCMonthKey();
  const data={won_target:parseFloat(g(`won-target-${rid}`))||0,weighted_target:parseFloat(g(`wt-target-${rid}`))||0,notes:g(`notes-${rid}`),submitted:true,submitted_at:getFC(rn,mk).submitted_at||today(),admin_override:true};
  showLoading('Saving…');
  try{await dbUpsertForecast(rn,mk,data);if(!forecasts[rn])forecasts[rn]={};forecasts[rn][mk]=data;toast('Saved');renderForecastCards();}
  catch(e){toast('Save failed','err');console.error(e);}hideLoading();
}
async function adminUnlockFC(rn,mk){
  const fc=getFC(rn,mk);const data={...fc,submitted:false,admin_override:false};
  showLoading('Unlocking…');
  try{await dbUpsertForecast(rn,mk,data);forecasts[rn][mk]=data;toast('Unlocked for rep');renderForecastCards();}
  catch(e){toast('Failed','err');console.error(e);}hideLoading();
}

// ═══════════════════════════════════════════════════════════════
// EOD
// ═══════════════════════════════════════════════════════════════
function eodDataForRep(rn,rd){
  const nd=new Date(rd);nd.setDate(nd.getDate()+1);const nds=nd.toISOString().slice(0,10);
  const ta=activities.filter(a=>a.rep===rn&&a.date===rd);
  return{todayActs:ta,activePipe:deals.filter(d=>d.rep===rn&&d.status==='Active'),followUpsTomorrow:activities.filter(a=>a.rep===rn&&a.fudate===nds),totalMins:ta.reduce((s,a)=>s+a.mins,0)};
}

function renderEOD(){
  const repList=reps();if(!repList.length){document.getElementById('eod-content').innerHTML=`<div class="info-banner"><i class="ti ti-info-circle" style="font-size:20px;flex-shrink:0"></i><div>No reps yet.</div></div>`;return;}
  const eodDate=today();const vis=isRep()?repList.filter(r=>r.name===currentUser.name):repList;
  let h=`<div style="display:flex;align-items:center;gap:12px;margin-bottom:1.5rem;flex-wrap:wrap">
    <label style="font-size:13px;color:var(--text-secondary)">Report date:</label>
    <input type="date" id="eod-date" value="${eodDate}" onchange="renderEOD()" style="height:32px;width:160px">
    ${isAdmin()?`<button class="btn primary" style="margin-left:auto" onclick="downloadAllPDFs()"><i class="ti ti-download"></i> Download all PDFs</button>`:''}
  </div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px">`;
  vis.forEach((r,i)=>{const d=eodDataForRep(r.name,document.getElementById('eod-date')?.value||eodDate);
    h+=`<div style="background:var(--bg-primary);border:0.5px solid var(--border-light);border-radius:var(--radius-lg);padding:18px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px"><div class="avatar" style="${avStyle(i)}">${initials(r.name)}</div>
          <div><div style="font-size:14px;font-weight:500">${r.name}</div><div style="font-size:12px;color:var(--text-secondary)">${r.territory||''}</div></div>
        </div>
        <button class="btn success" onclick="downloadPDF('${r.name}')"><i class="ti ti-file-download"></i> PDF</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px">
        ${[['Activities',d.todayActs.length],['Mins',d.totalMins],['F/U tmrw',d.followUpsTomorrow.length]].map(([l,v])=>`<div style="background:var(--bg-secondary);border-radius:var(--radius-md);padding:10px;text-align:center"><div style="font-size:10px;color:var(--text-secondary);font-weight:500;text-transform:uppercase;margin-bottom:4px">${l}</div><div style="font-size:18px;font-weight:600">${v}</div></div>`).join('')}
      </div>
      <div style="font-size:11px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px">Today's activities</div>
      ${d.todayActs.length?d.todayActs.map(a=>`<div style="padding:7px 10px;background:var(--bg-secondary);border-radius:var(--radius-md);margin-bottom:5px;font-size:12px"><div style="font-weight:500">${a.customer} — ${a.company}</div><div style="color:var(--text-secondary);margin-top:2px">${a.type} · ${a.mins} mins · ${a.outcome}</div></div>`).join(''):'<div style="font-size:12px;color:var(--text-tertiary);font-style:italic;padding:4px 0">No activities today</div>'}
      <div style="font-size:11px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.04em;margin:12px 0 8px">Follow-ups due tomorrow</div>
      ${d.followUpsTomorrow.length?d.followUpsTomorrow.map(a=>`<div style="padding:7px 10px;background:var(--bg-secondary);border-radius:var(--radius-md);margin-bottom:5px;font-size:12px"><div style="font-weight:500">${a.customer} — ${a.company}</div><div style="color:var(--text-secondary);margin-top:2px">${a.outcome}</div></div>`).join(''):'<div style="font-size:12px;color:var(--text-tertiary);font-style:italic;padding:4px 0">None</div>'}
    </div>`;});
  h+=`</div>`;document.getElementById('eod-content').innerHTML=h;
}

function pdfLogo(id){const img=document.getElementById(id);return img&&img.complete?img:null;}
function addPdfBrandingMM(doc,title='',rightText=''){
  const bos=pdfLogo('bos-pdf-logo'),blake=pdfLogo('blake-pdf-logo');
  if(bos){try{doc.addImage(bos,'JPEG',14,7,16,16);}catch(e){}}
  if(blake){try{doc.addImage(blake,'PNG',34,8,58,14);}catch(e){}}
  doc.setFont('helvetica','bold');doc.setFontSize(10);doc.setTextColor(15,40,80);
  doc.text(title,112,14,{align:'left'});
  if(rightText){doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.setTextColor(80,90,110);doc.text(rightText,196,14,{align:'right'});}
  doc.setDrawColor(180,185,195);doc.line(14,27,196,27);
}
function addPdfFooterMM(doc,mg=18){
  const pc=doc.internal.getNumberOfPages();
  for(let p=1;p<=pc;p++){
    doc.setPage(p);doc.setDrawColor(180,185,195);doc.line(mg,286,210-mg,286);
    doc.setTextColor(80,90,110);doc.setFontSize(7);doc.setFont('helvetica','normal');
    doc.text('B.O.S | Blake Hydraulics — Confidential',mg,291);
    doc.text(`Page ${p} of ${pc}`,210-mg,291,{align:'right'});
  }
}
function addPdfBrandingPT(doc,title='',rightText=''){
  const bos=pdfLogo('bos-pdf-logo'),blake=pdfLogo('blake-pdf-logo');
  doc.setFillColor(255,255,255);doc.rect(0,0,841.89,60,'F');
  if(bos){try{doc.addImage(bos,'JPEG',30,14,32,32);}catch(e){}}
  if(blake){try{doc.addImage(blake,'PNG',72,17,118,29);}catch(e){}}
  doc.setFont('helvetica','bold');doc.setFontSize(13);doc.setTextColor(15,30,68);
  doc.text(title,811.89,28,{align:'right'});
  if(rightText){doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(80,90,110);doc.text(rightText,811.89,42,{align:'right'});}
  doc.setDrawColor(180,185,195);doc.line(30,58,811.89,58);
}
function addPdfFooterPT(doc){
  const pc=doc.internal.getNumberOfPages();
  for(let p=1;p<=pc;p++){
    doc.setPage(p);doc.setDrawColor(180,185,195);doc.line(30,570,811.89,570);
    doc.setFontSize(7.5);doc.setFont('helvetica','normal');doc.setTextColor(80,90,110);
    doc.text(`Generated ${fmtDate(today())} | B.O.S | Blake Hydraulics`,420.945,583,{align:'center'});
    doc.text(`Page ${p} of ${pc}`,811.89,583,{align:'right'});
  }
}

function buildPDFDoc(rn){
  const{jsPDF}=window.jspdf;const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  const rd=document.getElementById('eod-date')?.value||today();const d=eodDataForRep(rn,rd);const rep=users.find(u=>u.name===rn);
  const mg=18,cW=210-mg*2;let y=mg;const NAVY=[15,40,80],LG=[245,247,250],MG=[180,185,195],BK=[20,20,20],MI=[80,90,110];
  function dH(){addPdfBrandingMM(doc,'EOD Report',fmtDate(rd));}
  function chk(n=10){if(y+n>276){doc.addPage();y=34;dH();}}
  dH();y=34;
  doc.setFillColor(...LG);doc.roundedRect(mg,y,cW,16,2,2,'F');doc.setTextColor(...NAVY);doc.setFontSize(12);doc.setFont('helvetica','bold');doc.text(rn,mg+5,y+7);doc.setFontSize(8);doc.setFont('helvetica','normal');doc.setTextColor(...MI);doc.text(rep?.territory||'',mg+5,y+12);doc.text(`${rep?.email||''} ${rep?.phone||''}`,210-mg-5,y+12,{align:'right'});y+=20;
  const sw=(cW-8)/3;[[`Activities`,d.todayActs.length],[`Mins in field`,d.totalMins],[`F/U tomorrow`,d.followUpsTomorrow.length]].forEach(([lbl,val],i)=>{const x=mg+i*(sw+4);doc.setFillColor(235,240,250);doc.roundedRect(x,y,sw,14,1.5,1.5,'F');doc.setTextColor(...MI);doc.setFontSize(7);doc.setFont('helvetica','bold');doc.text(lbl.toUpperCase(),x+sw/2,y+5,{align:'center'});doc.setTextColor(...NAVY);doc.setFontSize(12);doc.setFont('helvetica','bold');doc.text(String(val),x+sw/2,y+11,{align:'center'});});y+=20;
  function sT(t){chk(10);doc.setFillColor(...NAVY);doc.rect(mg,y,cW,7,'F');doc.setTextColor(255,255,255);doc.setFontSize(8);doc.setFont('helvetica','bold');doc.text(t,mg+3,y+4.8);y+=10;}
  function rI(lines,shade){const lH=5,pd=4,tH=lines.length*lH+pd*2;chk(tH+2);doc.setFillColor(shade?248:255,shade?250:255,shade?253:255);doc.rect(mg,y,cW,tH,'F');doc.setDrawColor(...MG);doc.rect(mg,y,cW,tH,'S');lines.forEach((l,i2)=>{doc.setFont('helvetica',i2===0?'bold':'normal');doc.setFontSize(i2===0?8.5:7.5);doc.setTextColor(...(i2===0?BK:MI));doc.text(l,mg+pd,y+pd+(i2+0.75)*lH);});y+=tH+1;}
  sT("TODAY'S ACTIVITIES");d.todayActs.length?d.todayActs.forEach((a,i)=>rI([`${a.customer} — ${a.company}`,`${a.type} · ${a.mins} mins · Follow-up: ${a.followup}`,`Outcome: ${a.outcome}`],i%2===0)):(doc.setTextColor(...MI),doc.setFontSize(8),doc.setFont('helvetica','italic'),doc.text('No activities logged.',mg+3,y+5),y+=10);
  y+=4;sT("ACTIVE PIPELINE");d.activePipe.length?d.activePipe.forEach((dl,i)=>rI([`${dl.opportunity} — ${dl.company}`,`${dl.stage} · ${fmt(dl.value)} · ${dl.prob}% · Close: ${fmtDate(dl.close)}`],i%2===0)):(doc.setTextColor(...MI),doc.setFontSize(8),doc.setFont('helvetica','italic'),doc.text('No active deals.',mg+3,y+5),y+=10);
  y+=4;sT("FOLLOW-UPS DUE TOMORROW");d.followUpsTomorrow.length?d.followUpsTomorrow.forEach((a,i)=>rI([`${a.customer} — ${a.company}`,a.outcome],i%2===0)):(doc.setTextColor(...MI),doc.setFontSize(8),doc.setFont('helvetica','italic'),doc.text('None.',mg+3,y+5),y+=10);
  addPdfFooterMM(doc,mg);
  return doc;
}
function downloadPDF(rn){buildPDFDoc(rn).save(`EOD_${rn.replace(/ /g,'_')}_${document.getElementById('eod-date')?.value||today()}.pdf`);}
function downloadAllPDFs(){reps().forEach(r=>downloadPDF(r.name));}

function downloadCashflowPDF(){
  const fromVal=document.getElementById('cf-from')?.value||today();
  const toVal=document.getElementById('cf-to')?.value||addDays(today(),29);
  buildCashflowPDF(fromVal,toVal).save(`Cashflow_${fromVal}_to_${toVal}.pdf`);
}

function buildCashflowPDF(fromVal,toVal){
  const{jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  const mg=18,cW=210-mg*2;let y=mg;
  const NAVY=[15,40,80],LG=[245,247,250],MG=[180,185,195],BK=[20,20,20],MI=[80,90,110],TEAL=[13,148,136],BLUE=[29,78,216];

  // Collect events
  const events=[];
  wipJobs.forEach(j=>{
    if(!j.deposit_paid&&j.deposit_amount>0&&j.expected_deposit_date&&j.expected_deposit_date>=fromVal&&j.expected_deposit_date<=toVal)
      events.push({date:j.expected_deposit_date,customer:j.customer||'—',nature:j.nature_of_job||'—',invoice:j.invoice||'—',amount:j.deposit_amount,type:'Deposit',overdue:j.expected_deposit_date<today()});
    if(!j.paid_full&&j.expected_payment_date&&j.expected_payment_date>=fromVal&&j.expected_payment_date<=toVal){
      const bal=Math.max(0,(j.total_amount||0)-(j.deposit_amount||0));
      if(bal>0)events.push({date:j.expected_payment_date,customer:j.customer||'—',nature:j.nature_of_job||'—',invoice:j.invoice||'—',amount:bal,type:'Balance',overdue:j.expected_payment_date<today()});
    }
  });
  events.sort((a,b)=>a.date.localeCompare(b.date));
  const totalAmt=events.reduce((s,e)=>s+e.amount,0);
  const depAmt=events.filter(e=>e.type==='Deposit').reduce((s,e)=>s+e.amount,0);
  const balAmt=events.filter(e=>e.type==='Balance').reduce((s,e)=>s+e.amount,0);
  const overdueAmt=events.filter(e=>e.overdue).reduce((s,e)=>s+e.amount,0);

  // Groups (same logic as renderCashflow)
  const daysDiff=Math.ceil((new Date(toVal)-new Date(fromVal))/86400000)+1;
  let groups=[];
  if(daysDiff<=21){let d=fromVal;while(d<=toVal){const evs=events.filter(e=>e.date===d);if(evs.length)groups.push({label:fmtDate(d),events:evs,depTotal:evs.filter(e=>e.type==='Deposit').reduce((s,e)=>s+e.amount,0),balTotal:evs.filter(e=>e.type==='Balance').reduce((s,e)=>s+e.amount,0)});d=addDays(d,1);}}
  else if(daysDiff<=90){let ws=fromVal;while(ws<=toVal){const we=addDays(ws,6)<=toVal?addDays(ws,6):toVal;const evs=events.filter(e=>e.date>=ws&&e.date<=we);if(evs.length)groups.push({label:`${fmtDate(ws)} – ${fmtDate(we)}`,events:evs,depTotal:evs.filter(e=>e.type==='Deposit').reduce((s,e)=>s+e.amount,0),balTotal:evs.filter(e=>e.type==='Balance').reduce((s,e)=>s+e.amount,0)});ws=addDays(ws,7);}}
  else{let ms=new Date(fromVal);ms=new Date(ms.getFullYear(),ms.getMonth(),1);while(ms.toISOString().slice(0,10)<=toVal){const meDate=new Date(ms.getFullYear(),ms.getMonth()+1,0);const msStr=ms.toISOString().slice(0,10);const meStr=meDate.toISOString().slice(0,10)>toVal?toVal:meDate.toISOString().slice(0,10);const evs=events.filter(e=>e.date>=msStr&&e.date<=meStr);if(evs.length)groups.push({label:fmtMonth(msStr),events:evs,depTotal:evs.filter(e=>e.type==='Deposit').reduce((s,e)=>s+e.amount,0),balTotal:evs.filter(e=>e.type==='Balance').reduce((s,e)=>s+e.amount,0)});ms=new Date(ms.getFullYear(),ms.getMonth()+1,1);}}

  function dH(){addPdfBrandingMM(doc,'Cashflow Forecast',`Generated: ${fmtDate(today())}`);}
  function chk(n=10){if(y+n>276){doc.addPage();y=34;dH();}}
  dH();y=34;

  // Title banner
  doc.setFillColor(...LG);doc.roundedRect(mg,y,cW,16,2,2,'F');
  doc.setTextColor(...NAVY);doc.setFontSize(12);doc.setFont('helvetica','bold');doc.text('Cashflow Forecast Report',mg+5,y+7);
  doc.setFontSize(8);doc.setFont('helvetica','normal');doc.setTextColor(...MI);
  doc.text(`Period: ${fmtDate(fromVal)} — ${fmtDate(toVal)}  ·  ${events.length} payment${events.length!==1?'s':''}`,mg+5,y+12);
  y+=22;

  // KPI boxes
  const kpis=[['Total Forecast',fmt(totalAmt),false],['Balance Payments',fmt(balAmt),false],['Deposits',fmt(depAmt),false],['Overdue',fmt(overdueAmt),overdueAmt>0]];
  const kW=(cW-9)/4;
  kpis.forEach(([lbl,val,warn],i)=>{
    const x=mg+i*(kW+3);
    doc.setFillColor(warn?255:235,warn?245:240,warn?235:250);doc.roundedRect(x,y,kW,15,1.5,1.5,'F');
    doc.setTextColor(...MI);doc.setFontSize(6);doc.setFont('helvetica','bold');doc.text(lbl.toUpperCase(),x+kW/2,y+5,{align:'center'});
    doc.setTextColor(warn?146:NAVY[0],warn?64:NAVY[1],warn?14:NAVY[2]);doc.setFontSize(8.5);doc.setFont('helvetica','bold');doc.text(val,x+kW/2,y+11.5,{align:'center'});
  });
  y+=20;

  // Bar chart
  if(groups.length){
    doc.setFillColor(...NAVY);doc.rect(mg,y,cW,7,'F');doc.setTextColor(255,255,255);doc.setFontSize(8);doc.setFont('helvetica','bold');doc.text('CASHFLOW CHART',mg+3,y+4.8);y+=10;
    doc.setFillColor(...TEAL);doc.rect(mg,y,4,4,'F');doc.setTextColor(...MI);doc.setFontSize(7);doc.setFont('helvetica','normal');doc.text('Deposits',mg+6,y+3.2);
    doc.setFillColor(...BLUE);doc.rect(mg+36,y,4,4,'F');doc.text('Balance Payments',mg+42,y+3.2);y+=8;
    const maxG=groups.reduce((m,g)=>Math.max(m,g.depTotal+g.balTotal),0)||1;
    const bW=cW-55;const bH=5;
    groups.forEach((g,i)=>{
      chk(9);
      if(i%2===0){doc.setFillColor(248,250,253);doc.rect(mg,y-1,cW,bH+2,'F');}
      doc.setTextColor(...MI);doc.setFontSize(6.5);doc.setFont('helvetica','normal');doc.text(g.label,mg,y+bH-1,{maxWidth:48});
      const dW=Math.round(g.depTotal/maxG*bW);const bW2=Math.round(g.balTotal/maxG*bW);
      if(dW>0){doc.setFillColor(...TEAL);doc.rect(mg+50,y,dW,bH,'F');}
      if(bW2>0){doc.setFillColor(...BLUE);doc.rect(mg+50+dW,y,bW2,bH,'F');}
      doc.setTextColor(...BK);doc.setFontSize(6.5);doc.setFont('helvetica','bold');doc.text(fmt(g.depTotal+g.balTotal),210-mg,y+bH-1,{align:'right'});
      y+=bH+3;
    });
    y+=4;
  }

  // Payment schedule table
  chk(20);
  doc.setFillColor(...NAVY);doc.rect(mg,y,cW,7,'F');doc.setTextColor(255,255,255);doc.setFontSize(8);doc.setFont('helvetica','bold');doc.text('PAYMENT SCHEDULE',mg+3,y+4.8);y+=10;
  if(!events.length){
    doc.setTextColor(...MI);doc.setFontSize(8);doc.setFont('helvetica','italic');doc.text('No outstanding payments in this period.',mg+3,y+5);y+=10;
  } else {
    const cols=[['Due Date',28],['Customer',40],['Nature of Job',46],['Invoice',18],['Type',18],['Amount (R)',24]];
    doc.setFillColor(235,240,250);doc.rect(mg,y,cW,6,'F');
    doc.setTextColor(...NAVY);doc.setFontSize(6.5);doc.setFont('helvetica','bold');
    let hx=mg;cols.forEach(([lbl,w])=>{doc.text(lbl,hx+1.5,y+4.2);hx+=w;});y+=7;
    events.forEach((e,i)=>{
      chk(7);const rH=6;
      if(e.overdue){doc.setFillColor(255,251,235);}else if(i%2===0){doc.setFillColor(248,250,253);}else{doc.setFillColor(255,255,255);}
      doc.rect(mg,y,cW,rH,'F');doc.setDrawColor(...MG);doc.setLineWidth(0.1);doc.line(mg,y+rH,mg+cW,y+rH);
      const vals=[fmtDate(e.date),e.customer,e.nature,e.invoice,e.type,fmt(e.amount)];
      let rx=mg;
      vals.forEach((v,vi)=>{
        const w=cols[vi][1];const maxC=Math.floor(w/1.7);
        const txt=String(v).length>maxC?String(v).slice(0,maxC-1)+'…':String(v);
        doc.setFont('helvetica',vi===5?'bold':'normal');doc.setFontSize(7);
        doc.setTextColor(vi===5?NAVY[0]:BK[0],vi===5?NAVY[1]:BK[1],vi===5?NAVY[2]:BK[2]);
        doc.text(txt,rx+1.5,y+4.2);rx+=w;
      });
      if(e.overdue){doc.setTextColor(146,64,14);doc.setFontSize(5.5);doc.setFont('helvetica','bold');doc.text('⚠ OVERDUE',mg+1.5,y+rH-0.8);}
      y+=rH;
    });
    y+=3;chk(8);
    doc.setFillColor(...NAVY);doc.rect(mg,y,cW,7,'F');doc.setTextColor(255,255,255);doc.setFontSize(7.5);doc.setFont('helvetica','bold');
    doc.text(`Total: ${fmt(totalAmt)}     Payments: ${events.length}${overdueAmt>0?`     Overdue: ${fmt(overdueAmt)}`:''}`,mg+3,y+4.8);
    y+=10;
  }

  // Page footers
  addPdfFooterMM(doc,mg);
  return doc;
}

// ═══════════════════════════════════════════════════════════════
// TEAM PERFORMANCE PDF
// ═══════════════════════════════════════════════════════════════
function downloadPerformancePDF(){
  const fromVal=document.getElementById('tp-from')?.value||addDays(today(),-29);
  const toVal=document.getElementById('tp-to')?.value||today();
  const memberFilter=document.getElementById('tp-member')?.value||'';
  buildPerformancePDF(fromVal,toVal,memberFilter).save(`Team_Performance_${fromVal}_to_${toVal}.pdf`);
}

function buildPerformancePDF(fromVal,toVal,memberFilter=''){
  const{jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  const mg=18,cW=210-mg*2;let y=mg;
  const NAVY=[15,40,80],LG=[245,247,250],MG=[180,185,195],BK=[20,20,20],MI=[80,90,110];
  const TEAL=[13,148,136],GREEN=[22,101,52],AMBER=[146,64,14],RED=[153,27,27];

  // Filter + aggregate — mirrors renderPerformance logic
  let entries=performanceTimesheets.filter(e=>e.date>=fromVal&&e.date<=toVal);
  if(memberFilter)entries=entries.filter(e=>e.team_member_name===memberFilter);

  const jobMap={};
  entries.forEach(e=>{
    if(!jobMap[e.job_id]){
      const j=wipJobs.find(x=>x.id===e.job_id)||{};
      jobMap[e.job_id]={job_id:e.job_id,job_number:j.job_number||'—',customer:j.customer||'—',nature:j.nature_of_job||'—',hours_allocated:parseFloat(j.labour_hours_allocated)||0,entries:[],hours_used:0};
    }
    jobMap[e.job_id].entries.push(e);
    jobMap[e.job_id].hours_used+=parseFloat(e.hours_used)||0;
  });
  const jobs=Object.values(jobMap).sort((a,b)=>a.job_number.localeCompare(b.job_number));
  jobs.forEach(j=>{
    j.eff=j.hours_allocated>0?(j.hours_used/j.hours_allocated*100):null;
    if(j.eff===null){j.slabel='No Allocation';}
    else if(j.eff<95){j.slabel='Ahead of Target';}
    else if(j.eff<=105){j.slabel='On Target';}
    else if(j.eff<=130){j.slabel='Behind Target';}
    else{j.slabel='Significantly Behind';}
  });

  const totalAlloc=jobs.reduce((s,j)=>s+j.hours_allocated,0);
  const totalUsed=jobs.reduce((s,j)=>s+j.hours_used,0);
  const overallEff=totalAlloc>0?(totalUsed/totalAlloc*100):null;
  const aheadN=jobs.filter(j=>j.eff!==null&&j.eff<95).length;
  const onN=jobs.filter(j=>j.eff!==null&&j.eff>=95&&j.eff<=105).length;
  const behindN=jobs.filter(j=>j.eff!==null&&j.eff>105).length;
  const sortedEntries=[...entries].sort((a,b)=>b.date.localeCompare(a.date));

  function dH(){
    addPdfBrandingMM(doc,'Team Performance Report',`Generated: ${fmtDate(today())}`);
  }
  function chk(n=10){if(y+n>276){doc.addPage();y=34;dH();}}
  dH();y=34;

  // Title banner
  doc.setFillColor(...LG);doc.roundedRect(mg,y,cW,16,2,2,'F');
  doc.setTextColor(...NAVY);doc.setFontSize(12);doc.setFont('helvetica','bold');doc.text('Team Performance Report',mg+5,y+7);
  doc.setFontSize(8);doc.setFont('helvetica','normal');doc.setTextColor(...MI);
  doc.text(`Period: ${fmtDate(fromVal)} — ${fmtDate(toVal)}${memberFilter?'   ·   '+memberFilter:'   ·   All members'}   ·   ${sortedEntries.length} entr${sortedEntries.length!==1?'ies':'y'}`,mg+5,y+12);
  y+=22;

  // KPI boxes
  const effStr=overallEff!==null?overallEff.toFixed(1)+'%':'—';
  const effWarn=overallEff!==null&&overallEff>105;
  const kpis=[['Jobs Tracked',String(jobs.length),false],['Hours Allocated',totalAlloc.toFixed(1)+'h',false],['Hours Used',totalUsed.toFixed(1)+'h',false],['Overall Efficiency',effStr,effWarn]];
  const kW=(cW-9)/4;
  kpis.forEach(([lbl,val,warn],i)=>{
    const x=mg+i*(kW+3);
    doc.setFillColor(warn?255:235,warn?245:240,warn?235:250);doc.roundedRect(x,y,kW,15,1.5,1.5,'F');
    doc.setTextColor(...MI);doc.setFontSize(6);doc.setFont('helvetica','bold');doc.text(lbl.toUpperCase(),x+kW/2,y+5,{align:'center'});
    doc.setTextColor(warn?AMBER[0]:NAVY[0],warn?AMBER[1]:NAVY[1],warn?AMBER[2]:NAVY[2]);doc.setFontSize(8.5);doc.setFont('helvetica','bold');doc.text(val,x+kW/2,y+11.5,{align:'center'});
  });
  y+=20;

  // Status summary strip
  chk(10);
  doc.setFillColor(235,240,250);doc.roundedRect(mg,y,cW,9,1,1,'F');
  doc.setFontSize(7);doc.setFont('helvetica','normal');doc.setTextColor(...MI);
  const summaryTxt=`Ahead of Target: ${aheadN}   |   On Target: ${onN}   |   Behind Target: ${behindN}`;
  doc.text(summaryTxt,mg+cW/2,y+5.5,{align:'center'});
  y+=14;

  // Efficiency chart
  if(jobs.filter(j=>j.eff!==null).length){
    chk(15);
    doc.setFillColor(...NAVY);doc.rect(mg,y,cW,7,'F');doc.setTextColor(255,255,255);doc.setFontSize(8);doc.setFont('helvetica','bold');doc.text('EFFICIENCY BY JOB',mg+3,y+4.8);y+=10;
    // Legend
    doc.setFillColor(...TEAL);doc.rect(mg,y,3,3,'F');doc.setTextColor(...MI);doc.setFontSize(6.5);doc.setFont('helvetica','normal');doc.text('Ahead <95%',mg+5,y+2.5);
    doc.setFillColor(...GREEN);doc.rect(mg+36,y,3,3,'F');doc.text('On Target 95-105%',mg+41,y+2.5);
    doc.setFillColor(...AMBER);doc.rect(mg+82,y,3,3,'F');doc.text('Behind >105%',mg+87,y+2.5);
    y+=7;
    const barMaxW=cW-52;const barH=5;const markerX=mg+36+barMaxW/2;
    // Target marker line label
    doc.setTextColor(...MI);doc.setFontSize(5.5);doc.setFont('helvetica','normal');doc.text('100%',markerX-3,y);
    y+=3;
    jobs.filter(j=>j.eff!==null).forEach((j,i)=>{
      chk(8);
      if(i%2===0){doc.setFillColor(248,250,253);doc.rect(mg,y-1,cW,barH+2,'F');}
      const label=(j.job_number!=='—'?j.job_number:j.customer).slice(0,16);
      doc.setTextColor(...MI);doc.setFontSize(6.5);doc.setFont('helvetica','normal');doc.text(label,mg,y+barH-1);
      // Bar: scale 0-200% maps to 0-barMaxW, 100% at barMaxW/2
      const barW=Math.min(j.eff,200)/200*barMaxW;
      const col=j.eff<95?TEAL:j.eff<=105?GREEN:j.eff<=130?AMBER:RED;
      doc.setFillColor(...col);doc.rect(mg+36,y,barW,barH,'F');
      // 100% marker
      doc.setDrawColor(...MG);doc.setLineWidth(0.3);doc.line(markerX,y-1,markerX,y+barH+1);
      doc.setTextColor(...col);doc.setFontSize(6.5);doc.setFont('helvetica','bold');doc.text(j.eff.toFixed(1)+'%',mg+36+barMaxW+2,y+barH-1);
      y+=barH+3;
    });
    y+=4;
  }

  // Job summary table
  chk(20);
  doc.setFillColor(...NAVY);doc.rect(mg,y,cW,7,'F');doc.setTextColor(255,255,255);doc.setFontSize(8);doc.setFont('helvetica','bold');doc.text('JOB SUMMARY',mg+3,y+4.8);y+=10;
  const jCols=[['Job #',18],['Customer',38],['Nature of Job',50],['Alloc h',18],['Used h',18],['Efficiency',22],['Cumulative',22],['Status',26]];
  doc.setFillColor(235,240,250);doc.rect(mg,y,cW,6,'F');
  doc.setTextColor(...NAVY);doc.setFontSize(6.5);doc.setFont('helvetica','bold');
  let hx=mg;jCols.forEach(([lbl,w])=>{doc.text(lbl,hx+1.5,y+4.2);hx+=w;});y+=7;
  let cumSum=0,cumCount=0;
  jobs.forEach((j,i)=>{
    chk(7);
    if(j.eff!==null){cumSum+=j.eff;cumCount++;}
    const cum=cumCount>0?(cumSum/cumCount):null;
    const members=[...new Set(j.entries.map(e=>e.team_member_name))].join(', ');
    if(i%2===0){doc.setFillColor(248,250,253);}else{doc.setFillColor(255,255,255);}
    doc.rect(mg,y,cW,6,'F');doc.setDrawColor(...MG);doc.setLineWidth(0.1);doc.line(mg,y+6,mg+cW,y+6);
    const effCol=j.eff===null?MI:j.eff<95?TEAL:j.eff<=105?GREEN:j.eff<=130?AMBER:RED;
    const rowVals=[j.job_number,j.customer,j.nature,j.hours_allocated?j.hours_allocated+'h':'—',j.hours_used.toFixed(1)+'h',j.eff!==null?j.eff.toFixed(1)+'%':'—',cum!==null?cum.toFixed(1)+'%':'—',j.slabel];
    let rx=mg;
    rowVals.forEach((v,vi)=>{
      const w=jCols[vi][1];const maxC=Math.floor(w/1.6);
      const txt=String(v).length>maxC?String(v).slice(0,maxC-1)+'…':String(v);
      const isEff=vi===5;const isStatus=vi===7;
      doc.setFont('helvetica',isEff||vi===0?'bold':'normal');doc.setFontSize(6.5);
      doc.setTextColor(...(isEff?effCol:isStatus?(j.eff===null?MI:j.eff<95?TEAL:j.eff<=105?GREEN:j.eff<=130?AMBER:RED):BK));
      doc.text(txt,rx+1.5,y+4.2);rx+=w;
    });
    y+=6;
  });
  y+=4;

  // Timesheet entries table
  chk(20);
  doc.setFillColor(...NAVY);doc.rect(mg,y,cW,7,'F');doc.setTextColor(255,255,255);doc.setFontSize(8);doc.setFont('helvetica','bold');doc.text('TIMESHEET ENTRIES',mg+3,y+4.8);y+=10;
  if(!sortedEntries.length){
    doc.setTextColor(...MI);doc.setFontSize(8);doc.setFont('helvetica','italic');doc.text('No timesheet entries in this period.',mg+3,y+5);y+=10;
  } else {
    const eCols=[['Date',22],['Team Member',40],['Job #',18],['Hours Used',22],['Efficiency',22],['Notes',50]];
    doc.setFillColor(235,240,250);doc.rect(mg,y,cW,6,'F');
    doc.setTextColor(...NAVY);doc.setFontSize(6.5);doc.setFont('helvetica','bold');
    let ehx=mg;eCols.forEach(([lbl,w])=>{doc.text(lbl,ehx+1.5,y+4.2);ehx+=w;});y+=7;
    sortedEntries.forEach((e,i)=>{
      chk(7);
      const j=wipJobs.find(x=>x.id===e.job_id)||{};
      const alloc=parseFloat(j.labour_hours_allocated)||0;
      const used=parseFloat(e.hours_used)||0;
      const eff=alloc>0?(used/alloc*100):null;
      const effCol=eff===null?MI:eff<95?TEAL:eff<=105?GREEN:eff<=130?AMBER:RED;
      if(i%2===0){doc.setFillColor(248,250,253);}else{doc.setFillColor(255,255,255);}
      doc.rect(mg,y,cW,6,'F');doc.setDrawColor(...MG);doc.setLineWidth(0.1);doc.line(mg,y+6,mg+cW,y+6);
      const eVals=[fmtDate(e.date),e.team_member_name,j.job_number||'—',used.toFixed(1)+'h',eff!==null?eff.toFixed(1)+'%':'—',e.notes||''];
      let erx=mg;
      eVals.forEach((v,vi)=>{
        const w=eCols[vi][1];const maxC=Math.floor(w/1.6);
        const txt=String(v).length>maxC?String(v).slice(0,maxC-1)+'…':String(v);
        const isEff=vi===4;
        doc.setFont('helvetica',vi===0||vi===3?'bold':'normal');doc.setFontSize(6.5);
        doc.setTextColor(...(isEff?effCol:BK));
        doc.text(txt,erx+1.5,y+4.2);erx+=w;
      });
      y+=6;
    });
    y+=3;chk(8);
    doc.setFillColor(...NAVY);doc.rect(mg,y,cW,7,'F');doc.setTextColor(255,255,255);doc.setFontSize(7.5);doc.setFont('helvetica','bold');
    doc.text(`Entries: ${sortedEntries.length}   |   Total hours used: ${totalUsed.toFixed(1)}h${overallEff!==null?'   |   Overall efficiency: '+overallEff.toFixed(1)+'%':''}`,mg+3,y+4.8);
    y+=10;
  }

  // Page footers
  const pc=doc.internal.getNumberOfPages();
  addPdfFooterMM(doc,mg);
  return doc;
}

function downloadKpiScorecardPDF(){
  const monthVal=document.getElementById('kpi-month-filter')?.value||currentMonthKey();
  const userFilter=document.getElementById('kpi-user-filter')?.value||'';
  const roleFilter=document.getElementById('kpi-role-filter')?.value||'';
  let rows=kpiScorecards.filter(s=>s.month_key===monthVal);
  if(userFilter)rows=rows.filter(s=>String(s.user_id||'')===userFilter);
  if(roleFilter)rows=rows.filter(s=>s.role_name===roleFilter);
  rows=[...rows].sort((a,b)=>(b.final_score||0)-(a.final_score||0));
  if(!rows.length){toast('No KPI scorecards to export','err');return;}
  const userLabel=userFilter?(users.find(u=>String(u.id)===userFilter)?.name||'User'):'All_Users';
  const roleLabelPart=roleFilter||'All_Roles';
  const safe=s=>String(s||'').replace(/[^a-z0-9]+/gi,'_').replace(/^_+|_+$/g,'');
  buildKpiScorecardPDF(monthVal,userFilter,roleFilter,rows).save(`KPI_Scorecards_${monthVal}_${safe(userLabel)}_${safe(roleLabelPart)}.pdf`);
}

function buildKpiScorecardPDF(monthVal,userFilter='',roleFilter='',rows=[]){
  const{jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  const mg=15,cW=180;
  const BK=[20,20,20],GRAY=[120,120,120],BORDER=[35,35,35],LIGHT=[245,247,250],BLUE=[22,45,130];
  const bosLogo=pdfLogo('bos-pdf-logo'),blakeLogo=pdfLogo('blake-pdf-logo');
  const lineH=5.2;
  const esc=v=>String(v||'');
  const weighted=item=>((parseFloat(item.score)||0)/5*(parseFloat(item.weight)||0));
  const scoreByTemplate=(rec,tmpl)=>{
    const saved=Array.isArray(rec.scores)?rec.scores:[];
    const map={};saved.forEach(s=>{map[s.kpi]=s;});
    return tmpl.map(t=>({...t,score:map[t.kpi]?.score||0,comment:map[t.kpi]?.comment||''}));
  };
  const rowBox=(x,y,w,h)=>{doc.setDrawColor(...BORDER);doc.setLineWidth(0.18);doc.rect(x,y,w,h);};
  const text=(v,x,y,opts={})=>doc.text(esc(v),x,y,opts);
  const ensure=(y,h)=>{
    if(y+h<=276)return y;
    doc.addPage();
    if(bosLogo){try{doc.addImage(bosLogo,'JPEG',mg,8,13,13);}catch(e){}}
    if(blakeLogo){try{doc.addImage(blakeLogo,'PNG',mg+17,9,42,10);}catch(e){}}
    doc.setFont('helvetica','bold');doc.setFontSize(11);doc.setTextColor(...BLUE);
    text('KPI Scorecard (continued)',mg+64,16);
    doc.setDrawColor(180,185,195);doc.line(mg,24,mg+cW,24);
    return 30;
  };
  const drawHeader=(rec)=>{
    if(bosLogo){try{doc.addImage(bosLogo,'JPEG',mg,8,18,18);}catch(e){}}
    if(blakeLogo){try{doc.addImage(blakeLogo,'PNG',mg+23,10,58,14);}catch(e){}}
    doc.setFont('helvetica','bold');doc.setFontSize(16);doc.setTextColor(...BLUE);
    text('Blake Hydraulics KPI Scorecard',mg,34);
    doc.setFontSize(9);doc.setFont('helvetica','normal');doc.setTextColor(...GRAY);
    text(`Generated ${fmtDate(today())}`,210-mg,18,{align:'right'});
    doc.setTextColor(...BK);doc.setFontSize(9);
    [['Employee Name:',rec.employee_name||'—'],['Month:',fmtMonth((rec.month_key||monthVal)+'-01')],['Reviewer:',rec.reviewer||'—']].forEach((r,i)=>{
      const y=44+i*8;
      doc.setFont('helvetica','bold');text(r[0],mg,y);
      doc.setFont('helvetica','normal');text(r[1],mg+34,y);
      doc.setDrawColor(...BORDER);doc.line(mg+33,y+1,mg+cW,y+1);
    });
  };
  const drawSectionHeader=(title,y)=>{
    y=ensure(y,15);
    doc.setFillColor(255,255,255);rowBox(mg,y,135,8);rowBox(mg+135,y,45,8);
    doc.setFont('helvetica','bold');doc.setFontSize(10);doc.setTextColor(...BK);
    text(title,mg+67.5,y+5.4,{align:'center'});
    text('Weighted Score',mg+157.5,y+5.4,{align:'center'});
    return y+8;
  };
  const drawColumnHeader=y=>{
    y=ensure(y,7);
    const widths=[95,25,30,30];let x=mg;
    ['KPI','Weight %','Score (1-5)','Weighted Score'].forEach((h,i)=>{
      rowBox(x,y,widths[i],7);
      doc.setFont('helvetica','bold');doc.setFontSize(9);doc.setTextColor(...BK);
      text(h,x+widths[i]/2,y+4.8,{align:'center'});
      x+=widths[i];
    });
    return y+7;
  };
  const drawScoreRow=(item,y,shade=false)=>{
    y=ensure(y,8);
    const widths=[95,25,30,30];let x=mg;
    const score=parseFloat(item.score)||0, wt=parseFloat(item.weight)||0, ws=weighted(item);
    const vals=[item.kpi,wt.toFixed(wt%1?1:0),score||'',score?ws.toFixed(1):''];
    if(shade){doc.setFillColor(...LIGHT);doc.rect(mg,y,180,8,'F');}
    vals.forEach((v,i)=>{
      rowBox(x,y,widths[i],8);
      doc.setFont('helvetica',i===0?'bold':'normal');doc.setFontSize(8.5);doc.setTextColor(...BK);
      const align=i===0?'left':'center';
      text(v,x+(i===0?2:widths[i]/2),y+5.3,{align});
      x+=widths[i];
    });
    return y+8;
  };
  const drawItemsAndComment=(item,y)=>{
    if(!item.items?.length&&!item.comment)return y;
    const itemLines=(item.items||[]).flatMap(i=>doc.splitTextToSize('• '+i,88));
    const commentLines=doc.splitTextToSize(item.comment||'',74);
    const h=Math.max(14,itemLines.length*lineH+7,commentLines.length*lineH+8);
    y=ensure(y,h);
    rowBox(mg,y,95,h);rowBox(mg+95,y,85,h);
    doc.setFont('helvetica','bold');doc.setFontSize(7.5);doc.setTextColor(...GRAY);text('Requirements',mg+2,y+5);
    doc.setFont('helvetica','normal');doc.setTextColor(...BK);doc.setFontSize(7.4);
    doc.text(itemLines,mg+3,y+10);
    doc.setFont('helvetica','bold');doc.setTextColor(...GRAY);text('Comments:',mg+98,y+5);
    doc.setFont('helvetica','normal');doc.setTextColor(...BK);
    if(item.comment)doc.text(commentLines,mg+98,y+10);
    return y+h;
  };

  rows.forEach((rec,idx)=>{
    if(idx>0)doc.addPage();
    let y=10;
    drawHeader(rec);y=72;
    const tmpl=scoreByTemplate(rec,kpiTemplateRows(rec.role_name||KPI_ROLES[0]));
    const company=tmpl.filter(r=>!r.roleSection);
    const roleRows=tmpl.filter(r=>r.roleSection);

    y=drawSectionHeader('Company-Wide KPIs (50%)',y);
    y=drawColumnHeader(y);
    company.forEach((item,i)=>{y=drawScoreRow(item,y,i%2===1);});
    const companyTotal=company.reduce((s,i)=>s+weighted(i),0);
    y=ensure(y,12);
    rowBox(mg,y,150,8);rowBox(mg+150,y,30,8);
    doc.setFont('helvetica','bold');doc.setFontSize(8.5);text('Company-Wide Total',mg+2,y+5.3);text(companyTotal.toFixed(1),mg+165,y+5.3,{align:'center'});y+=12;

    y=drawSectionHeader(`${rec.role_name||'Role'} KPIs (50%)`,y);
    y=drawColumnHeader(y);
    roleRows.forEach((item,i)=>{y=drawScoreRow(item,y,i%2===1);y=drawItemsAndComment(item,y);});
    const roleTotal=roleRows.reduce((s,i)=>s+weighted(i),0);
    y=ensure(y,12);
    rowBox(mg,y,150,8);rowBox(mg+150,y,30,8);
    doc.setFont('helvetica','bold');doc.setFontSize(8.5);text('Role KPI Total',mg+2,y+5.3);text(roleTotal.toFixed(1),mg+165,y+5.3,{align:'center'});y+=12;

    const finalScore=companyTotal+roleTotal;
    y=ensure(y,50);
    rowBox(mg,y,135,9);rowBox(mg+135,y,45,9);
    doc.setFont('helvetica','bold');doc.setFontSize(10);text('Final Score %',mg+2,y+6);text(finalScore.toFixed(1)+'%',mg+157.5,y+6,{align:'center'});y+=14;

    rowBox(mg,y,180,27);
    doc.setFont('helvetica','bold');doc.setFontSize(10);text('Manager Comments',mg+2,y+6);
    doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(...BK);
    if(rec.comments)doc.text(doc.splitTextToSize(rec.comments,172).slice(0,4),mg+2,y+12);
  });

  addPdfFooterMM(doc,mg);
  return doc;
}

// ═══════════════════════════════════════════════════════════════
// CONVERSION
// ═══════════════════════════════════════════════════════════════
function renderConversion(){
  const repList=reps();if(!repList.length){document.getElementById('conv-content').innerHTML=`<div class="info-banner"><i class="ti ti-info-circle" style="font-size:20px;flex-shrink:0"></i><div>No reps yet.</div></div>`;return;}
  const vis=isRep()?repList.filter(r=>r.name===currentUser.name):repList;
  const allWon=deals.filter(d=>d.status==='Won').length,allTotal=deals.length;
  const allWR=allTotal>0?Math.round(allWon/allTotal*100):0;
  const allWV=deals.filter(d=>d.status==='Won').reduce((s,d)=>s+d.value,0);
  const allAvg=allWon>0?Math.round(allWV/allWon):0;
  let h='';
  if(!isRep()){h+=`<div class="kpi-grid" style="margin-bottom:1.5rem"><div class="kpi"><div class="kpi-label">Overall win rate</div><div class="kpi-val">${allWR}%</div></div><div class="kpi"><div class="kpi-label">Deals won</div><div class="kpi-val">${allWon}</div></div><div class="kpi"><div class="kpi-label">Deals lost</div><div class="kpi-val">${deals.filter(d=>d.status==='Lost').length}</div></div><div class="kpi"><div class="kpi-label">Avg deal (won)</div><div class="kpi-val" style="font-size:16px">${allAvg?fmt(allAvg):'—'}</div></div></div>`;}
  h+=`<div class="section-hd" style="margin-bottom:12px">Stage conversion rates per rep</div>`;
  vis.forEach((r,i)=>{const rd=deals.filter(d=>d.rep===r.name);const wr=rd.length>0?Math.round(rd.filter(d=>d.status==='Won').length/rd.length*100):0;
    h+=`<div style="background:var(--bg-primary);border:0.5px solid var(--border-light);border-radius:var(--radius-lg);padding:16px;margin-bottom:12px"><div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><div class="avatar" style="${avStyle(i)}">${initials(r.name)}</div><div><div style="font-size:14px;font-weight:500">${r.name}</div><div style="font-size:12px;color:var(--text-secondary)">${r.territory||''} · ${rd.length} deals · win rate <span class="${wr>=60?'good':wr>=35?'mid':'low'}" style="font-weight:500">${wr}%</span></div></div></div><div style="display:flex;gap:6px;flex-wrap:wrap">`;
    const so=STAGES.filter(s=>s!=='Closed Lost');
    for(let si=0;si<so.length-1;si++){const fc2=deals.filter(d=>d.rep===r.name&&STAGES.indexOf(d.stage)>=si).length;const tc=deals.filter(d=>d.rep===r.name&&STAGES.indexOf(d.stage)>=si+1).length;const rate=fc2>0?Math.round(tc/fc2*100):null;const rc=rate===null?'':rate>=60?'good':rate>=35?'mid':'low';h+=`<div style="background:var(--bg-secondary);border-radius:var(--radius-md);padding:8px 11px;font-size:12px;min-width:130px"><div style="color:var(--text-secondary);margin-bottom:2px">${so[si]} → ${so[si+1]}</div><div class="${rc}" style="font-weight:600;font-size:15px">${rate!==null?rate+'%':'n/a'}</div><div style="font-size:10px;color:var(--text-tertiary)">${tc} of ${fc2}</div></div>`;}
    h+=`</div></div>`;});
  document.getElementById('conv-content').innerHTML=h;
}

// ═══════════════════════════════════════════════════════════════
// ACTIVITY / PIPELINE
// ═══════════════════════════════════════════════════════════════
function populateFilters(){
  const names=repNames();
  ['act-rep','pipe-rep'].forEach(id=>{const el=document.getElementById(id);if(!el)return;const cur=el.value;el.innerHTML='<option value="">All reps</option>'+names.map(n=>`<option${cur===n?' selected':''}>${n}</option>`).join('');});
  const at=document.getElementById('act-type');if(at){const curT=at.value;at.innerHTML='<option value="">All types</option>'+TYPES.map(t=>`<option${curT===t?' selected':''}>${t}</option>`).join('');}
  const ps=document.getElementById('pipe-stage');if(ps)ps.innerHTML='<option value="">All stages</option>'+STAGES.map(s=>`<option>${s}</option>`).join('');
}

function renderActivity(){
  populateFilters();
  const q=(document.getElementById('act-search')?.value||'').toLowerCase();
  const rep=document.getElementById('act-rep')?.value||'';const type=document.getElementById('act-type')?.value||'';
  let f=activities.filter(a=>(!rep||a.rep===rep)&&(!type||a.type===type)&&(!q||[a.customer,a.company,a.purpose,a.outcome].join(' ').toLowerCase().includes(q)));
  if(isRep())f=f.filter(a=>a.rep===currentUser.name);
  f.sort((a,b)=>b.date.localeCompare(a.date));
  const tb=document.getElementById('act-body');
  if(!f.length){tb.innerHTML=`<tr><td colspan="11"><div class="empty">No activities found</div></td></tr>`;return;}
  tb.innerHTML=f.map(a=>`<tr class="row-link" onclick="openModal('viewActivity','${a.id}')"><td style="white-space:nowrap;overflow:visible">${isAdmin()?`<div style="display:flex;gap:4px"><button class="icon-btn" onclick="event.stopPropagation();openModal('editActivity','${a.id}')" title="Edit activity"><i class="ti ti-edit"></i></button><button class="icon-btn del" onclick="event.stopPropagation();openModal('deleteActivity','${a.id}')" title="Delete activity"><i class="ti ti-trash"></i></button></div>`:''}</td><td>${fmtDate(a.date)}</td><td>${a.rep}</td><td>${a.customer}</td><td>${a.company}</td><td><span class="badge b-blue">${a.type}</span></td><td title="${a.purpose}">${a.purpose}</td><td style="text-align:center">${a.mins}</td><td style="text-align:center"><span class="badge ${a.followup==='Yes'?'b-amber':'b-gray'}">${a.followup}</span></td><td>${fmtDate(a.fudate)||'—'}</td><td title="${a.outcome}">${a.outcome}</td></tr>`).join('');
}

function renderPipeline(){
  populateFilters();
  const q=(document.getElementById('pipe-search')?.value||'').toLowerCase();
  const rep=document.getElementById('pipe-rep')?.value||'';const stage=document.getElementById('pipe-stage')?.value||'';
  let f=deals.filter(d=>(!rep||d.rep===rep)&&(!stage||d.stage===stage)&&(!q||[d.customer,d.company,d.opportunity].join(' ').toLowerCase().includes(q)));
  if(isRep())f=f.filter(d=>d.rep===currentUser.name);
  const tb=document.getElementById('pipe-body');const admin=isAdmin();
  if(!f.length){tb.innerHTML=`<tr><td colspan="12"><div class="empty">No deals found</div></td></tr>`;}
  else tb.innerHTML=f.map(d=>{const qs=quotesForDeal(d.id);return`<tr class="row-link" onclick="openModal('viewDeal','${d.id}')"><td style="white-space:nowrap;overflow:visible"><div style="display:flex;gap:4px"><button class="icon-btn" onclick="event.stopPropagation();openModal('editDeal','${d.id}')" title="Edit deal"><i class="ti ti-pencil"></i></button><button class="icon-btn del" onclick="event.stopPropagation();openModal('deleteDeal','${d.id}')" ${admin?'':'disabled'} title="${admin?'Delete deal':'Admin only'}"><i class="ti ti-trash"></i></button></div></td><td>${d.rep}</td><td>${d.customer}</td><td>${d.company}</td><td title="${d.opportunity}">${d.opportunity}</td><td><span class="badge ${SC[d.stage]||'b-gray'}">${d.stage}</span></td><td style="text-align:right">${fmt(d.value)}</td><td style="text-align:center">${d.prob}%</td><td style="text-align:right">${fmt(Math.round(d.value*d.prob/100))}</td><td>${fmtDate(d.close)||'—'}</td><td><span class="badge ${d.status==='Won'?'b-green':d.status==='Lost'?'b-coral':'b-blue'}">${d.status}</span></td><td style="text-align:center">${qs.length?`<span class="badge b-green" style="cursor:pointer" onclick="event.stopPropagation();switchTab('deals')" title="View in Deals tab">${qs.length} PDF${qs.length!==1?'s':''}</span>`:`<span style="font-size:11px;color:var(--text-tertiary)">None</span>`}</td></tr>`;}).join('');
  document.getElementById('pipe-total').textContent=fmt(f.reduce((s,d)=>s+d.value,0));
  document.getElementById('pipe-weighted').textContent=fmt(Math.round(f.reduce((s,d)=>s+d.value*d.prob/100,0)));
  document.getElementById('pipe-count').textContent=f.length;
}

// ═══════════════════════════════════════════════════════════════
// CASHFLOW FORECAST
// ═══════════════════════════════════════════════════════════════
function setCFRange(days){
  const f=document.getElementById('cf-from');const t=document.getElementById('cf-to');
  if(f&&t){f.value=today();t.value=addDays(today(),days-1);}
  document.querySelectorAll('.cf-range-btn').forEach(b=>b.classList.toggle('active',b.dataset.days==days));
  renderCashflow();
}

function renderCashflow(){
  const fromVal=document.getElementById('cf-from')?.value||today();
  const toVal=document.getElementById('cf-to')?.value||addDays(today(),29);
  const t=document.getElementById('cf-to');if(t&&!t.value)t.value=toVal;
  const f=document.getElementById('cf-from');if(f&&!f.value)f.value=fromVal;

  // Collect unpaid payment events from WIP jobs
  const events=[];
  wipJobs.forEach(j=>{
    if(!j.deposit_paid&&j.deposit_amount>0&&j.expected_deposit_date&&j.expected_deposit_date>=fromVal&&j.expected_deposit_date<=toVal){
      events.push({date:j.expected_deposit_date,customer:j.customer||'—',nature:j.nature_of_job||'—',invoice:j.invoice||'—',quote:j.quote_number||'—',amount:j.deposit_amount,type:'Deposit',status:j.status,overdue:j.expected_deposit_date<today()});
    }
    if(!j.paid_full&&j.expected_payment_date&&j.expected_payment_date>=fromVal&&j.expected_payment_date<=toVal){
      const bal=Math.max(0,(j.total_amount||0)-(j.deposit_amount||0));
      if(bal>0)events.push({date:j.expected_payment_date,customer:j.customer||'—',nature:j.nature_of_job||'—',invoice:j.invoice||'—',quote:j.quote_number||'—',amount:bal,type:'Balance',status:j.status,overdue:j.expected_payment_date<today()});
    }
  });
  events.sort((a,b)=>a.date.localeCompare(b.date));

  const totalAmt=events.reduce((s,e)=>s+e.amount,0);
  const depAmt=events.filter(e=>e.type==='Deposit').reduce((s,e)=>s+e.amount,0);
  const balAmt=events.filter(e=>e.type==='Balance').reduce((s,e)=>s+e.amount,0);
  const overdueAmt=events.filter(e=>e.overdue).reduce((s,e)=>s+e.amount,0);

  // Group by period
  const daysDiff=Math.ceil((new Date(toVal)-new Date(fromVal))/86400000)+1;
  let groups=[];
  if(daysDiff<=21){
    // Daily
    let d=fromVal;
    while(d<=toVal){
      const evs=events.filter(e=>e.date===d);
      if(evs.length)groups.push({label:fmtDate(d),dateStr:d,events:evs,depTotal:evs.filter(e=>e.type==='Deposit').reduce((s,e)=>s+e.amount,0),balTotal:evs.filter(e=>e.type==='Balance').reduce((s,e)=>s+e.amount,0)});
      d=addDays(d,1);
    }
  } else if(daysDiff<=90){
    // Weekly
    let ws=fromVal;
    while(ws<=toVal){
      const we=addDays(ws,6)<=toVal?addDays(ws,6):toVal;
      const evs=events.filter(e=>e.date>=ws&&e.date<=we);
      if(evs.length)groups.push({label:`${fmtDate(ws)} – ${fmtDate(we)}`,events:evs,depTotal:evs.filter(e=>e.type==='Deposit').reduce((s,e)=>s+e.amount,0),balTotal:evs.filter(e=>e.type==='Balance').reduce((s,e)=>s+e.amount,0)});
      ws=addDays(ws,7);
    }
  } else {
    // Monthly
    let ms=new Date(fromVal);ms=new Date(ms.getFullYear(),ms.getMonth(),1);
    while(ms.toISOString().slice(0,10)<=toVal){
      const meDate=new Date(ms.getFullYear(),ms.getMonth()+1,0);
      const msStr=ms.toISOString().slice(0,10);
      const meStr=(meDate.toISOString().slice(0,10)>toVal?toVal:meDate.toISOString().slice(0,10));
      const evs=events.filter(e=>e.date>=msStr&&e.date<=meStr);
      if(evs.length)groups.push({label:fmtMonth(msStr),events:evs,depTotal:evs.filter(e=>e.type==='Deposit').reduce((s,e)=>s+e.amount,0),balTotal:evs.filter(e=>e.type==='Balance').reduce((s,e)=>s+e.amount,0)});
      ms=new Date(ms.getFullYear(),ms.getMonth()+1,1);
    }
  }
  const maxBar=groups.reduce((m,g)=>Math.max(m,g.depTotal+g.balTotal),0)||1;

  let h=`
  <div class="cf-range-btns">
    <span style="font-size:12px;font-weight:500;color:var(--text-secondary);align-self:center;margin-right:4px">Quick range:</span>
    <button class="cf-range-btn" data-days="7" onclick="setCFRange(7)">7 days</button>
    <button class="cf-range-btn active" data-days="30" onclick="setCFRange(30)">30 days</button>
    <button class="cf-range-btn" data-days="60" onclick="setCFRange(60)">60 days</button>
    <button class="cf-range-btn" data-days="90" onclick="setCFRange(90)">90 days</button>
    <button class="cf-range-btn" data-days="180" onclick="setCFRange(180)">6 months</button>
  </div>
  <div class="cf-date-row">
    <label>From</label>
    <input type="date" id="cf-from" value="${fromVal}" onchange="document.querySelectorAll('.cf-range-btn').forEach(b=>b.classList.remove('active'));renderCashflow()" style="height:34px">
    <label>To</label>
    <input type="date" id="cf-to" value="${toVal}" onchange="document.querySelectorAll('.cf-range-btn').forEach(b=>b.classList.remove('active'));renderCashflow()" style="height:34px">
    <button class="btn primary" onclick="downloadCashflowPDF()" style="margin-left:auto"><i class="ti ti-file-download"></i> Download PDF</button>
  </div>
  <div class="kpi-grid" style="margin-bottom:20px">
    <div class="kpi"><div class="kpi-label">Total forecast</div><div class="kpi-val" style="font-size:18px">${fmt(totalAmt)}</div><div class="kpi-sub">${events.length} payment${events.length!==1?'s':''}</div></div>
    <div class="kpi"><div class="kpi-label">Balance payments</div><div class="kpi-val" style="font-size:18px">${fmt(balAmt)}</div><div class="kpi-sub">${events.filter(e=>e.type==='Balance').length} items</div></div>
    <div class="kpi"><div class="kpi-label">Deposits expected</div><div class="kpi-val" style="font-size:18px">${fmt(depAmt)}</div><div class="kpi-sub">${events.filter(e=>e.type==='Deposit').length} items</div></div>
    <div class="kpi"><div class="kpi-label">Overdue</div><div class="kpi-val ${overdueAmt>0?'low':''}" style="font-size:18px">${fmt(overdueAmt)}</div><div class="kpi-sub">${events.filter(e=>e.overdue).length} past due</div></div>
  </div>`;

  if(!events.length){
    h+=`<div class="empty">No outstanding payments in this date range</div>`;
  } else {
    // Chart
    h+=`<div class="section-hd" style="margin-bottom:12px">Cash inflow by ${daysDiff<=21?'day':daysDiff<=90?'week':'month'}</div>
    <div class="cf-legend">
      <span style="display:flex;align-items:center;gap:5px"><span class="cf-legend-dot" style="background:#0d9488"></span>Deposits</span>
      <span style="display:flex;align-items:center;gap:5px"><span class="cf-legend-dot" style="background:var(--accent)"></span>Balance payments</span>
    </div>
    <div class="cf-chart-wrap">`;
    groups.forEach(g=>{
      const total=g.depTotal+g.balTotal;
      const depW=Math.round(g.depTotal/maxBar*100);
      const balW=Math.round(g.balTotal/maxBar*100);
      h+=`<div class="cf-bar-row">
        <div class="cf-bar-label" title="${g.label}">${g.label}</div>
        <div class="cf-bar-track">
          <div class="cf-bar-deposit" style="width:${depW}%"></div>
          <div class="cf-bar-balance" style="width:${balW}%"></div>
        </div>
        <div class="cf-bar-value">${fmt(total)}</div>
      </div>`;
    });
    h+=`</div>`;

    // Detail table
    h+=`<div class="section-hd" style="margin:20px 0 10px">Payment schedule</div>
    <div class="tbl-wrap"><table>
      <colgroup><col style="width:92px"><col style="width:120px"><col style="width:185px"><col style="width:75px"><col style="width:80px"><col style="width:90px"><col style="width:100px"><col style="width:90px"></colgroup>
      <thead><tr><th>Due date</th><th>Customer</th><th>Nature of job</th><th>Invoice</th><th>Quote</th><th>Type</th><th>Amount (R)</th><th>Job status</th></tr></thead>
      <tbody>`;
    let running=0;
    events.forEach(e=>{
      running+=e.amount;
      h+=`<tr class="${e.overdue?'cf-overdue':''}">
        <td>${fmtDate(e.date)}${e.overdue?` <span class="badge b-amber" style="font-size:10px;padding:1px 5px">Overdue</span>`:''}</td>
        <td title="${e.customer}">${e.customer}</td>
        <td title="${e.nature}">${e.nature}</td>
        <td>${e.invoice}</td>
        <td>${e.quote}</td>
        <td><span class="badge ${e.type==='Deposit'?'b-teal':'b-blue'}">${e.type}</span></td>
        <td style="text-align:right;font-weight:500">${fmt(e.amount)}</td>
        <td><span class="badge ${'Jobs On The Go'===e.status?'b-blue':'Awaiting Approval'===e.status?'b-amber':'b-green'}">${e.status}</span></td>
      </tr>`;
    });
    h+=`</tbody></table></div>
    <div class="pipe-footer" style="margin-top:10px">
      <span>Payments shown: <strong>${events.length}</strong></span>
      <span>Total: <strong>${fmt(totalAmt)}</strong></span>
      ${overdueAmt>0?`<span style="color:var(--warn-text)">Overdue: <strong>${fmt(overdueAmt)}</strong></span>`:''}
    </div>`;
  }

  document.getElementById('cashflow-content').innerHTML=h;
  // Mark active quick-range button after re-render
  const cfFrom=document.getElementById('cf-from');const cfTo=document.getElementById('cf-to');
  if(cfFrom&&cfTo){document.querySelectorAll('.cf-range-btn').forEach(b=>{const d=parseInt(b.dataset.days);b.classList.toggle('active',cfFrom.value===today()&&cfTo.value===addDays(today(),d-1));});}
}

// ═══════════════════════════════════════════════════════════════
// TEAM PERFORMANCE
// ═══════════════════════════════════════════════════════════════
function setTPRange(days){
  const f=document.getElementById('tp-from');const t=document.getElementById('tp-to');
  if(f)f.value=addDays(today(),-(days-1));
  if(t)t.value=today();
  document.querySelectorAll('.tp-range-btn').forEach(b=>b.classList.toggle('active',b.dataset.days==days));
  renderPerformance();
}

function performanceModeHeader(mode){
  performanceMode=mode;
  return `<div class="toolbar" style="margin-bottom:16px">
    <label style="font-size:12px;font-weight:500;color:var(--text-secondary)">Performance view</label>
    <select id="tp-mode" onchange="performanceMode=this.value;renderPerformance()" style="height:34px;font-size:13px">
      <option value="time"${mode==='time'?' selected':''}>Time Performance</option>
      <option value="kpi"${mode==='kpi'?' selected':''}>KPI Performance</option>
    </select>
  </div>`;
}

function renderPerformance(){
  const mode=document.getElementById('tp-mode')?.value||performanceMode||'time';
  performanceMode=mode;
  if(mode==='kpi')renderKPIPerformance();
  else renderTimePerformance();
}

function renderTimePerformance(){
  const fromVal=document.getElementById('tp-from')?.value||addDays(today(),-29);
  const toVal=document.getElementById('tp-to')?.value||today();
  const memberFilter=document.getElementById('tp-member')?.value||'';

  // Filter entries by date range + optional member
  let entries=performanceTimesheets.filter(e=>e.date>=fromVal&&e.date<=toVal);
  if(memberFilter)entries=entries.filter(e=>e.team_member_name===memberFilter);

  // Aggregate by job
  const jobMap={};
  entries.forEach(e=>{
    if(!jobMap[e.job_id]){
      const j=wipJobs.find(x=>x.id===e.job_id)||{};
      jobMap[e.job_id]={job_id:e.job_id,job_number:j.job_number||'—',customer:j.customer||'—',nature:j.nature_of_job||'—',hours_allocated:parseFloat(j.labour_hours_allocated)||0,entries:[],hours_used:0};
    }
    jobMap[e.job_id].entries.push(e);
    jobMap[e.job_id].hours_used+=parseFloat(e.hours_used)||0;
  });
  const jobs=Object.values(jobMap).sort((a,b)=>a.job_number.localeCompare(b.job_number));

  // Efficiency: hours_used / hours_allocated * 100%
  jobs.forEach(j=>{
    j.eff=j.hours_allocated>0?(j.hours_used/j.hours_allocated*100):null;
    if(j.eff===null){j.slabel='No allocation';j.sclass='b-gray';j.ecol='var(--text-tertiary)';}
    else if(j.eff<95){j.slabel='Ahead of target';j.sclass='b-teal';j.ecol='#0d9488';}
    else if(j.eff<=105){j.slabel='On target';j.sclass='b-green';j.ecol='var(--success-text)';}
    else if(j.eff<=130){j.slabel='Behind target';j.sclass='b-amber';j.ecol='var(--warn-text)';}
    else{j.slabel='Significantly behind';j.sclass='b-coral';j.ecol='var(--danger-text)';}
  });

  // KPIs
  const totalAlloc=jobs.reduce((s,j)=>s+j.hours_allocated,0);
  const totalUsed=jobs.reduce((s,j)=>s+j.hours_used,0);
  const overallEff=totalAlloc>0?(totalUsed/totalAlloc*100):null;
  const aheadN=jobs.filter(j=>j.eff!==null&&j.eff<95).length;
  const onN=jobs.filter(j=>j.eff!==null&&j.eff>=95&&j.eff<=105).length;
  const behindN=jobs.filter(j=>j.eff!==null&&j.eff>105).length;

  let h=performanceModeHeader('time')+`
  <div class="cf-range-btns">
    <span style="font-size:12px;font-weight:500;color:var(--text-secondary);align-self:center;margin-right:4px">Quick range:</span>
    <button class="tp-range-btn cf-range-btn" data-days="7" onclick="setTPRange(7)">7 days</button>
    <button class="tp-range-btn cf-range-btn active" data-days="30" onclick="setTPRange(30)">30 days</button>
    <button class="tp-range-btn cf-range-btn" data-days="60" onclick="setTPRange(60)">60 days</button>
    <button class="tp-range-btn cf-range-btn" data-days="90" onclick="setTPRange(90)">90 days</button>
    <button class="tp-range-btn cf-range-btn" data-days="180" onclick="setTPRange(180)">6 months</button>
  </div>
  <div class="cf-date-row">
    <label>From</label>
    <input type="date" id="tp-from" value="${fromVal}" onchange="document.querySelectorAll('.tp-range-btn').forEach(b=>b.classList.remove('active'));renderPerformance()" style="height:34px">
    <label>To</label>
    <input type="date" id="tp-to" value="${toVal}" onchange="document.querySelectorAll('.tp-range-btn').forEach(b=>b.classList.remove('active'));renderPerformance()" style="height:34px">
    <select id="tp-member" onchange="renderPerformance()" style="height:34px;font-size:13px">
      <option value="">All team members</option>
      ${users.map(u=>`<option value="${u.name}" ${memberFilter===u.name?'selected':''}>${u.name} (${roleLabel(u.role)})</option>`).join('')}
    </select>
    <button class="btn primary" onclick="openModal('perfAdd')"><i class="ti ti-plus"></i> Log hours</button>
    <button class="btn success" onclick="downloadPerformancePDF()" style="margin-left:auto"><i class="ti ti-file-download"></i> Download PDF</button>
  </div>
  <div class="kpi-grid" style="margin-bottom:20px">
    <div class="kpi"><div class="kpi-label">Jobs tracked</div><div class="kpi-val">${jobs.length}</div><div class="kpi-sub">${entries.length} timesheet entr${entries.length!==1?'ies':'y'}</div></div>
    <div class="kpi"><div class="kpi-label">Hours allocated</div><div class="kpi-val">${totalAlloc.toFixed(1)}</div><div class="kpi-sub">across ${jobs.length} job${jobs.length!==1?'s':''}</div></div>
    <div class="kpi"><div class="kpi-label">Hours used</div><div class="kpi-val">${totalUsed.toFixed(1)}</div><div class="kpi-sub">${totalAlloc>0?(totalUsed<=totalAlloc?`${(totalAlloc-totalUsed).toFixed(1)}h under budget`:`${(totalUsed-totalAlloc).toFixed(1)}h over budget`):''}</div></div>
    <div class="kpi"><div class="kpi-label">Overall efficiency</div><div class="kpi-val ${overallEff===null?'':overallEff<=100?'good':overallEff<=115?'mid':'low'}">${overallEff!==null?overallEff.toFixed(1)+'%':'—'}</div><div class="kpi-sub">${aheadN} ahead · ${onN} on target · ${behindN} behind</div></div>
  </div>`;

  if(!jobs.length){
    h+=`<div class="empty">No timesheet entries in this date range${memberFilter?' for '+memberFilter:''} — click <strong>Log hours</strong> to start tracking</div>`;
  } else {
    // Efficiency chart — 0–200% scale, 100% target marker at 50% of bar width
    h+=`<div class="section-hd" style="margin-bottom:8px">Efficiency by job — hours used vs allocated (100% = on target)</div>
    <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px;font-size:11px;color:var(--text-secondary)">
      <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:2px;background:#0d9488;display:inline-block"></span>Ahead &lt; 95%</span>
      <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:2px;background:var(--success-text);display:inline-block"></span>On target 95–105%</span>
      <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:2px;background:var(--warn-text);display:inline-block"></span>Behind &gt; 105%</span>
    </div>
    <div style="background:var(--bg-secondary);border-radius:var(--radius-lg);padding:14px 16px;margin-bottom:20px;border:0.5px solid var(--border-light)">`;
    jobs.filter(j=>j.eff!==null).forEach(j=>{
      const barW=Math.min(j.eff,200)/200*100;
      const fillClass=j.eff<95?'tp-eff-ahead':j.eff<=105?'tp-eff-on':j.eff<=130?'tp-eff-behind':'tp-eff-over';
      h+=`<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:12px">
        <div style="width:110px;flex-shrink:0;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${j.job_number} – ${j.customer}">${j.job_number!=='—'?j.job_number:j.customer}</div>
        <div class="tp-eff-track"><div class="tp-eff-marker"></div><div class="tp-eff-fill ${fillClass}" style="width:${barW.toFixed(1)}%"></div></div>
        <div style="width:52px;text-align:right;font-weight:600;color:${j.ecol}">${j.eff.toFixed(1)}%</div>
      </div>`;
    });
    h+=`<div style="font-size:10px;color:var(--text-tertiary);text-align:center;margin-top:6px">◄ 0% ···· 50% ···· 100% (target) ···· 150% ···· 200% ►</div></div>`;

    // Job summary table
    h+=`<div class="section-hd" style="margin-bottom:10px">Job summary</div>
    <div class="tbl-wrap" style="margin-bottom:20px"><table>
      <colgroup><col style="width:80px"><col style="width:130px"><col style="width:170px"><col style="width:120px"><col style="width:75px"><col style="width:70px"><col style="width:78px"><col style="width:85px"><col style="width:108px"></colgroup>
      <thead><tr><th>Job #</th><th>Customer</th><th>Nature of job</th><th>Team members</th><th>Alloc h</th><th>Used h</th><th>Efficiency</th><th>Cumulative</th><th>Status</th></tr></thead>
      <tbody>`;
    let cumSum=0,cumCount=0;
    jobs.forEach(j=>{
      if(j.eff!==null){cumSum+=j.eff;cumCount++;}
      const cum=cumCount>0?(cumSum/cumCount):null;
      const members=[...new Set(j.entries.map(e=>e.team_member_name))].join(', ');
      h+=`<tr>
        <td style="font-weight:500">${j.job_number}</td>
        <td title="${j.customer}">${j.customer}</td>
        <td style="max-width:170px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${j.nature}">${j.nature}</td>
        <td style="font-size:11px;color:var(--text-secondary)">${members||'—'}</td>
        <td style="text-align:center">${j.hours_allocated||'—'}</td>
        <td style="text-align:center;font-weight:500">${j.hours_used.toFixed(1)}</td>
        <td style="text-align:center;font-weight:600;color:${j.ecol}">${j.eff!==null?j.eff.toFixed(1)+'%':'—'}</td>
        <td style="text-align:center;color:var(--text-secondary)">${cum!==null?cum.toFixed(1)+'%':'—'}</td>
        <td><span class="badge ${j.sclass}">${j.slabel}</span></td>
      </tr>`;
    });
    h+=`</tbody></table></div>`;

    // Individual entries table with edit / delete
    const sortedEntries=[...entries].sort((a,b)=>b.date.localeCompare(a.date));
    h+=`<div class="section-hd" style="margin-bottom:10px">Timesheet entries</div>
    <div class="tbl-wrap"><table>
      <colgroup><col style="width:90px"><col style="width:140px"><col style="width:85px"><col style="width:160px"><col style="width:75px"><col style="width:70px"><col style="width:78px"><col style="width:110px"><col style="width:70px"></colgroup>
      <thead><tr><th>Date</th><th>Team member</th><th>Job #</th><th>Nature of job</th><th>Alloc h</th><th>Used h</th><th>Efficiency</th><th>Notes</th><th></th></tr></thead>
      <tbody>`;
    sortedEntries.forEach(e=>{
      const j=wipJobs.find(x=>x.id===e.job_id)||{};
      const alloc=parseFloat(j.labour_hours_allocated)||0;
      const used=parseFloat(e.hours_used)||0;
      const eff=alloc>0?(used/alloc*100):null;
      const ecol=eff===null?'var(--text-tertiary)':eff<95?'#0d9488':eff<=105?'var(--success-text)':eff<=130?'var(--warn-text)':'var(--danger-text)';
      h+=`<tr>
        <td>${fmtDate(e.date)}</td>
        <td style="font-weight:500">${e.team_member_name}</td>
        <td>${j.job_number||'—'}</td>
        <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${j.nature_of_job||''}">${j.nature_of_job||'—'}</td>
        <td style="text-align:center">${alloc||'—'}</td>
        <td style="text-align:center;font-weight:500">${used.toFixed(1)}</td>
        <td style="text-align:center;font-weight:600;color:${ecol}">${eff!==null?eff.toFixed(1)+'%':'—'}</td>
        <td style="font-size:11px;color:var(--text-secondary)">${e.notes||''}</td>
        <td style="white-space:nowrap">
          <div style="display:flex;gap:4px">
            <button class="icon-btn" onclick="openModal('perfEdit','${e.id}')" title="Edit entry"><i class="ti ti-pencil"></i></button>
            <button class="icon-btn del" onclick="openModal('perfDelete','${e.id}')" title="Delete entry"><i class="ti ti-trash"></i></button>
          </div>
        </td>
      </tr>`;
    });
    h+=`</tbody></table></div>
    <div class="pipe-footer" style="margin-top:10px">
      <span>Entries: <strong>${sortedEntries.length}</strong></span>
      <span>Jobs: <strong>${jobs.length}</strong></span>
      <span>Hours used: <strong>${totalUsed.toFixed(1)}</strong></span>
      ${overallEff!==null?`<span ${overallEff>105?'style="color:var(--warn-text)"':overallEff<95?'style="color:#0d9488"':''}>Overall efficiency: <strong>${overallEff.toFixed(1)}%</strong></span>`:''}
    </div>`;
  }

  document.getElementById('perf-content').innerHTML=h;
  const tf=document.getElementById('tp-from');const tt=document.getElementById('tp-to');
  if(tf&&tt){document.querySelectorAll('.tp-range-btn').forEach(b=>{const d=parseInt(b.dataset.days);b.classList.toggle('active',tf.value===addDays(today(),-(d-1))&&tt.value===today());});}
}

function renderKPIPerformance(){
  const monthVal=document.getElementById('kpi-month-filter')?.value||currentMonthKey();
  const userFilter=document.getElementById('kpi-user-filter')?.value||'';
  const roleFilter=document.getElementById('kpi-role-filter')?.value||'';
  let rows=kpiScorecards.filter(s=>s.month_key===monthVal);
  if(userFilter)rows=rows.filter(s=>String(s.user_id||'')===userFilter);
  if(roleFilter)rows=rows.filter(s=>s.role_name===roleFilter);
  rows=[...rows].sort((a,b)=>(b.final_score||0)-(a.final_score||0));
  const avg=rows.length?rows.reduce((s,r)=>s+(parseFloat(r.final_score)||0),0)/rows.length:null;
  const top=rows[0];
  const completed=rows.length;
  const roleCount=[...new Set(rows.map(r=>r.role_name))].length;

  let h=performanceModeHeader('kpi')+`
  <div class="cf-date-row">
    <label>Month</label>
    <input type="month" id="kpi-month-filter" value="${monthVal}" onchange="renderPerformance()" style="height:34px">
    <label>User</label>
    <select id="kpi-user-filter" onchange="renderPerformance()" style="height:34px;font-size:13px">
      <option value="">All users</option>
      ${users.map(u=>`<option value="${u.id}" ${userFilter===String(u.id)?'selected':''}>${u.name} (${roleLabel(u.role)})</option>`).join('')}
    </select>
    <label>Role</label>
    <select id="kpi-role-filter" onchange="renderPerformance()" style="height:34px;font-size:13px">
      <option value="">All scorecard roles</option>
      ${KPI_ROLES.map(r=>`<option value="${r}" ${roleFilter===r?'selected':''}>${r}</option>`).join('')}
    </select>
    <button class="btn primary" onclick="openModal('kpiAdd')" style="margin-left:auto"><i class="ti ti-plus"></i> Fill scorecard</button>
    <button class="btn success" onclick="downloadKpiScorecardPDF()"><i class="ti ti-file-download"></i> Download PDF</button>
  </div>
  <div class="kpi-grid" style="margin-bottom:20px">
    <div class="kpi"><div class="kpi-label">Scorecards</div><div class="kpi-val">${completed}</div><div class="kpi-sub">${fmtMonth(monthVal+'-01')}</div></div>
    <div class="kpi"><div class="kpi-label">Average score</div><div class="kpi-val ${avg===null?'':avg>=85?'good':avg>=70?'mid':'low'}">${avg===null?'—':avg.toFixed(1)+'%'}</div><div class="kpi-sub">${roleCount} role${roleCount!==1?'s':''} reviewed</div></div>
    <div class="kpi"><div class="kpi-label">Top score</div><div class="kpi-val">${top?parseFloat(top.final_score||0).toFixed(1)+'%':'—'}</div><div class="kpi-sub">${top?top.employee_name:''}</div></div>
    <div class="kpi"><div class="kpi-label">Scorecard roles</div><div class="kpi-val">${KPI_ROLES.length}</div><div class="kpi-sub">from KPI workbook</div></div>
  </div>`;

  if(!rows.length){
    h+=`<div class="empty">No KPI scorecards for this filter — click <strong>Fill scorecard</strong> to create one.</div>`;
  }else{
    h+=`<div class="section-hd" style="margin-bottom:10px">KPI scorecards</div>
    <div class="tbl-wrap"><table>
      <colgroup><col style="width:78px"><col style="width:120px"><col style="width:190px"><col style="width:170px"><col style="width:110px"><col style="width:90px"><col style="width:150px"></colgroup>
      <thead><tr><th></th><th>Month</th><th>User</th><th>Scorecard role</th><th>Reviewer</th><th>Score</th><th>Comments</th></tr></thead>
      <tbody>`;
    rows.forEach(r=>{
      const score=parseFloat(r.final_score)||0;
      h+=`<tr class="row-link" onclick="openModal('kpiView','${r.id}')">
        <td style="white-space:nowrap;overflow:visible">
          <div style="display:flex;gap:4px">
            <button class="icon-btn" onclick="event.stopPropagation();openModal('kpiEdit','${r.id}')" title="Edit scorecard"><i class="ti ti-pencil"></i></button>
            <button class="icon-btn del" onclick="event.stopPropagation();openModal('kpiDelete','${r.id}')" title="Delete scorecard"><i class="ti ti-trash"></i></button>
          </div>
        </td>
        <td>${fmtMonth((r.month_key||monthVal)+'-01')}</td>
        <td style="font-weight:500">${r.employee_name||'—'}</td>
        <td>${r.role_name||'—'}</td>
        <td>${r.reviewer||'—'}</td>
        <td><span class="badge ${kpiBandClass(score)}">${score.toFixed(1)}%</span></td>
        <td title="${(r.comments||'').replace(/"/g,'&quot;')}">${r.comments||''}</td>
      </tr>`;
    });
    h+=`</tbody></table></div>`;
  }

  document.getElementById('perf-content').innerHTML=h;
}

// ═══════════════════════════════════════════════════════════════
// WIP TRACKER
// ═══════════════════════════════════════════════════════════════
let wipDragId=null;

function sortByManualOrder(list){
  return [...list].sort((a,b)=>{
    const ao=Number(a.sort_order),bo=Number(b.sort_order);
    const ah=Number.isFinite(ao),bh=Number.isFinite(bo);
    if(ah&&bh&&ao!==bo)return ao-bo;
    if(ah&&!bh)return -1;
    if(!ah&&bh)return 1;
    return String(b.created_at||'').localeCompare(String(a.created_at||''));
  });
}

function nextSortOrder(list){
  const nums=list.map(x=>Number(x.sort_order)).filter(Number.isFinite);
  return (nums.length?Math.max(...nums):list.length*1000)+1000;
}

async function persistManualOrder(table,rows){
  for(let i=0;i<rows.length;i++){
    const next=(i+1)*1000;
    if(Number(rows[i].sort_order)!==next){
      await dbUpdate(table,rows[i].id,{sort_order:next});
      rows[i].sort_order=next;
    }
  }
}

function startWIPDrag(ev,id){
  wipDragId=id;
  ev.dataTransfer.effectAllowed='move';
  ev.dataTransfer.setData('text/plain',id);
}

function allowWIPDrop(ev){
  ev.preventDefault();
  ev.dataTransfer.dropEffect='move';
}

async function dropWIPJob(ev,status,beforeId=''){
  ev.preventDefault();
  ev.stopPropagation();
  const id=ev.dataTransfer.getData('text/plain')||wipDragId;
  wipDragId=null;
  if(!id||id===beforeId)return;
  const job=wipJobs.find(j=>j.id===id);
  if(!job)return;
  const nextStatus=status||job.status;
  const group=sortByManualOrder(wipJobs.filter(j=>j.status===nextStatus&&j.id!==id));
  const beforeIndex=beforeId?group.findIndex(j=>j.id===beforeId):-1;
  group.splice(beforeIndex>=0?beforeIndex:group.length,0,job);
  try{
    if(job.status!==nextStatus){
      await dbUpdate('wip_jobs',id,{status:nextStatus});
      job.status=nextStatus;
    }
    await persistManualOrder('wip_jobs',group);
    toast('Job moved');
    renderWIP();
  }catch(err){
    toast('Move failed: '+err.message,'err');
    renderWIP();
  }
}

async function completeWIPJob(id){
  const job=wipJobs.find(j=>j.id===id);
  if(!job||job.status!=='Jobs On The Go')return;
  if(!confirm('Mark this WIP job as complete?'))return;
  try{
    const completeJobs=wipJobs.filter(j=>j.status==='Job Complete'&&j.id!==id);
    const updates={status:'Job Complete',sort_order:nextSortOrder(completeJobs)};
    await dbUpdate('wip_jobs',id,updates);
    Object.assign(job,updates);
    toast('Job marked complete');
    renderWIP();
  }catch(err){
    toast('Update failed: '+err.message,'err');
  }
}

function syncWIPFilters(){
  const customerSel=document.getElementById('wip-customer-filter');
  if(customerSel){
    const cur=customerSel.value;
    const customers=[...new Set(wipJobs.map(j=>j.customer).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    customerSel.innerHTML='<option value="">All customers</option>'+customers.map(c=>`<option value="${c.replace(/"/g,'&quot;')}" ${cur===c?'selected':''}>${c}</option>`).join('');
  }
}

function clearWIPFilters(){
  ['wip-search','wip-status-filter','wip-customer-filter','wip-delivery-from','wip-delivery-to','wip-deposit-filter','wip-payment-filter','wip-invoice-filter','wip-labour-filter'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.value='';
  });
  renderWIP();
}

function renderWIP(){
  syncWIPFilters();
  const search=(document.getElementById('wip-search')?.value||'').toLowerCase();
  const statusFilter=document.getElementById('wip-status-filter')?.value||'';
  const customerFilter=document.getElementById('wip-customer-filter')?.value||'';
  const deliveryFrom=document.getElementById('wip-delivery-from')?.value||'';
  const deliveryTo=document.getElementById('wip-delivery-to')?.value||'';
  const depositFilter=document.getElementById('wip-deposit-filter')?.value||'';
  const paymentFilter=document.getElementById('wip-payment-filter')?.value||'';
  const invoiceFilter=document.getElementById('wip-invoice-filter')?.value||'';
  const labourFilter=document.getElementById('wip-labour-filter')?.value||'';

  const active=wipJobs.filter(j=>j.status==='Jobs On The Go');
  const awaiting=wipJobs.filter(j=>j.status==='Awaiting Approval');
  const complete=wipJobs.filter(j=>j.status==='Job Complete');
  const outstanding=wipJobs.filter(j=>!j.paid_full).reduce((s,j)=>s+(j.total_amount||0)-(j.deposit_paid?(j.deposit_amount||0):0),0);

  document.getElementById('wip-kpi').innerHTML=`
    <div class="kpi"><div class="kpi-label">Jobs On The Go</div><div class="kpi-val">${active.length}</div></div>
    <div class="kpi"><div class="kpi-label">Awaiting Approval</div><div class="kpi-val">${awaiting.length}</div></div>
    <div class="kpi"><div class="kpi-label">Jobs Complete</div><div class="kpi-val">${complete.length}</div></div>
    <div class="kpi"><div class="kpi-label">Outstanding balance</div><div class="kpi-val">${fmt(Math.max(0,outstanding))}</div></div>`;

  const filtered=wipJobs.filter(j=>{
    if(statusFilter&&j.status!==statusFilter)return false;
    if(customerFilter&&j.customer!==customerFilter)return false;
    if(deliveryFrom&&(!j.delivery_date||j.delivery_date<deliveryFrom))return false;
    if(deliveryTo&&(!j.delivery_date||j.delivery_date>deliveryTo))return false;
    if(depositFilter==='paid'&&!(j.deposit_amount>0&&j.deposit_paid))return false;
    if(depositFilter==='unpaid'&&!(j.deposit_amount>0&&!j.deposit_paid))return false;
    if(depositFilter==='none'&&j.deposit_amount>0)return false;
    if(paymentFilter==='paid'&&!j.paid_full)return false;
    if(paymentFilter==='outstanding'&&j.paid_full)return false;
    if(paymentFilter==='overdue'&&(j.paid_full||!j.expected_payment_date||j.expected_payment_date>=today()))return false;
    if(invoiceFilter==='has'&&!j.invoice)return false;
    if(invoiceFilter==='missing'&&j.invoice)return false;
    if(labourFilter==='allocated'&&!(parseFloat(j.labour_hours_allocated)>0))return false;
    if(labourFilter==='unallocated'&&(parseFloat(j.labour_hours_allocated)>0))return false;
    if(search&&!((j.job_number||'').toLowerCase().includes(search)||(j.customer||'').toLowerCase().includes(search)||(j.nature_of_job||'').toLowerCase().includes(search)||(j.quote_number||'').toLowerCase().includes(search)||(j.sales_order||'').toLowerCase().includes(search)||(j.invoice||'').toLowerCase().includes(search)||(j.staff_notes||'').toLowerCase().includes(search)))return false;
    return true;
  });

  const statuses=statusFilter?[statusFilter]:['Jobs On The Go','Awaiting Approval','Job Complete'];
  const stColor={'Jobs On The Go':'b-blue','Awaiting Approval':'b-amber','Job Complete':'b-green'};
  let h='';
  statuses.forEach(st=>{
    const jobs=sortByManualOrder(filtered.filter(j=>j.status===st));
    const stTotal=jobs.reduce((s,j)=>s+(j.total_amount||0),0);
    h+=`<div class="wip-section-wrap" ondragover="allowWIPDrop(event)" ondrop="dropWIPJob(event,'${st}')">
      <div class="wip-section-hd">
        <div class="wip-section-title"><span class="badge ${stColor[st]}">${st}</span> ${jobs.length} job${jobs.length!==1?'s':''}</div>
        <div style="font-size:12px;color:var(--text-secondary)">Total: <strong>${fmt(stTotal)}</strong></div>
      </div>`;
    if(!jobs.length){
      h+=`<div class="empty" style="padding:1.5rem">No jobs in this category</div>`;
    } else {
      h+=`<div class="tbl-wrap"><table>
        <colgroup>
          <col style="width:96px"><col style="width:44px"><col style="width:112px"><col style="width:162px">
          <col style="width:68px"><col style="width:78px"><col style="width:78px">
          <col style="width:88px"><col style="width:92px"><col style="width:92px">
          <col style="width:64px"><col style="width:92px"><col style="width:90px">
          <col style="width:62px"><col style="width:130px">
        </colgroup>
        <thead><tr>
          <th></th><th>#</th><th>Customer</th><th>Nature of job</th>
          <th>Quote</th><th>Sales order</th><th>Invoice</th>
          <th>Delivery</th><th>Total (R)</th><th>Deposit (R)</th>
          <th>Dep paid</th><th>Balance (R)</th><th>Exp payment</th>
          <th>Pd full</th><th>Notes / staff</th>
        </tr></thead><tbody>`;
      jobs.forEach(j=>{
        const bal=(j.total_amount||0)-(j.deposit_amount||0);
        const tasks=j.wip_staff_tasks||[];
        const noteTxt=j.staff_notes?j.staff_notes.slice(0,24)+(j.staff_notes.length>24?'…':''):'';
        const taskBadge=tasks.length?`<span class="badge b-blue" style="margin-top:2px;display:inline-block">${tasks.length} task${tasks.length!==1?'s':''}</span>`:'';
        const noteTitle=j.staff_notes?` title="${j.staff_notes.replace(/"/g,'&quot;')}"`:''
        h+=`<tr class="row-link wip-draggable-row" draggable="true" ondragstart="startWIPDrag(event,'${j.id}')" ondragover="allowWIPDrop(event)" ondrop="dropWIPJob(event,'${st}','${j.id}')" onclick="openModal('viewWIP','${j.id}')">
          <td style="white-space:nowrap;overflow:visible">
            <div style="display:flex;gap:4px">
              <button class="icon-btn" onclick="event.stopPropagation();openModal('wipEdit','${j.id}')" title="Edit"><i class="ti ti-pencil"></i></button>
              <button class="icon-btn del" onclick="event.stopPropagation();openModal('wipDelete','${j.id}')" title="Delete"><i class="ti ti-trash"></i></button>
              ${j.status==='Jobs On The Go'?`<button class="icon-btn" onclick="event.stopPropagation();completeWIPJob('${j.id}')" title="Mark job complete"><i class="ti ti-check"></i></button>`:''}
            </div>
          </td>
          <td>${j.job_number||'—'}</td>
          <td title="${(j.customer||'').replace(/"/g,'&quot;')}">${j.customer||'—'}</td>
          <td title="${(j.nature_of_job||'').replace(/"/g,'&quot;')}">${j.nature_of_job||'—'}</td>
          <td>${j.quote_number||'—'}</td>
          <td>${j.sales_order||'—'}</td>
          <td>${j.invoice||'—'}</td>
          <td>${fmtDate(j.delivery_date)||'—'}</td>
          <td>${fmt(j.total_amount||0)}</td>
          <td>${j.deposit_amount?fmt(j.deposit_amount):'—'}</td>
          <td style="text-align:center">${j.deposit_paid?'<i class="ti ti-check" style="color:#166634"></i>':'<i class="ti ti-x" style="color:#991b1b"></i>'}</td>
          <td>${j.paid_full?'<span class="badge b-green">Paid</span>':fmt(Math.max(0,bal))}</td>
          <td>${fmtDate(j.expected_payment_date)||'—'}</td>
          <td style="text-align:center">${j.paid_full?'<i class="ti ti-check" style="color:#166634"></i>':'<i class="ti ti-x" style="color:#991b1b"></i>'}</td>
          <td${noteTitle}>${noteTxt}${taskBadge?`${noteTxt?'<br>':''}${taskBadge}`:''}</td>
        </tr>`;
      });
      h+=`</tbody></table></div>`;
    }
    h+=`</div>`;
  });
  document.getElementById('wip-content').innerHTML=h;
}

function addWIPStaffRow(){wipStaffRows.push({name:'',task:'',completed:false});renderWIPStaffRows();}
function removeWIPStaffRow(i){wipStaffRows.splice(i,1);renderWIPStaffRows();}
function renderWIPStaffRows(){
  const c=document.getElementById('wip-staff-container');
  if(!c)return;
  if(!wipStaffRows.length){c.innerHTML=`<div style="font-size:12px;color:var(--text-tertiary);font-style:italic;padding:4px 0">No staff assignments added</div>`;return;}
  c.innerHTML=wipStaffRows.map((r,i)=>`<div class="wip-staff-row">
    <input type="text" placeholder="Staff name" value="${r.name}" oninput="wipStaffRows[${i}].name=this.value">
    <input type="text" placeholder="Task / responsibility" value="${r.task}" oninput="wipStaffRows[${i}].task=this.value">
    <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;white-space:nowrap"><input type="checkbox" ${r.completed?'checked':''} onchange="wipStaffRows[${i}].completed=this.checked"> Done</label>
    <button class="icon-btn del" onclick="removeWIPStaffRow(${i})" type="button"><i class="ti ti-x"></i></button>
  </div>`).join('');
}

// ═══════════════════════════════════════════════════════════════
// TEAM PLANNER
// ═══════════════════════════════════════════════════════════════
let plannerDragId=null;

function plannerJsArg(value){
  return String(value||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\r?\n/g,' ');
}

function startPlannerDrag(ev,id){
  plannerDragId=id;
  ev.dataTransfer.effectAllowed='move';
  ev.dataTransfer.setData('text/plain',id);
}

function allowPlannerDrop(ev){
  ev.preventDefault();
  ev.dataTransfer.dropEffect='move';
}

async function dropPlannerEntry(ev,staffName,dayIndex,weekStart,beforeId=''){
  ev.preventDefault();
  ev.stopPropagation();
  const id=ev.dataTransfer.getData('text/plain')||plannerDragId;
  plannerDragId=null;
  if(!id||id===beforeId)return;
  const entry=plannerEntries.find(e=>e.id===id);
  if(!entry)return;
  if(!canModifyPlannerEntry(entry)){toast('This task is locked by admin','err');renderPlanner();return;}
  const nextDay=Number(dayIndex);
  if(isRep()&&!isOwnPlannerName(staffName)){toast('You can only move your own planner tasks','err');renderPlanner();return;}
  const group=sortByManualOrder(plannerEntries.filter(e=>e.week_start===weekStart&&e.staff_name===staffName&&Number(e.day_index)===nextDay&&e.id!==id));
  const beforeIndex=beforeId?group.findIndex(e=>e.id===beforeId):-1;
  group.splice(beforeIndex>=0?beforeIndex:group.length,0,entry);
  try{
    const updates={staff_name:staffName,day_index:nextDay,week_start:weekStart};
    if(entry.staff_name!==staffName||Number(entry.day_index)!==nextDay||entry.week_start!==weekStart){
      await dbUpdate('team_planner',id,updates);
      Object.assign(entry,updates);
    }
    await persistManualOrder('team_planner',group);
    toast('Task moved');
    renderPlanner();
  }catch(err){
    toast('Move failed: '+err.message,'err');
    renderPlanner();
  }
}

function renderPlanner(){
  if(!plannerWeekStart)plannerWeekStart=getMondayOf(today());
  const ws=plannerWeekStart;
  const days=DAY_NAMES.map((_,i)=>addDays(ws,i));
  const todayStr=today();
  const visibleMembers=plannerVisibleMembers();
  const visibleNames=visibleMembers.map(m=>m.name.toLowerCase());
  const weekEntries=plannerEntries.filter(e=>e.week_start===ws&&(isAdmin()||visibleNames.includes(String(e.staff_name||'').toLowerCase())));
  const weekLabel=`${fmtDate(days[0])} – ${fmtDate(days[4])}`;

  let h=`<div class="week-nav">
    <button class="btn" onclick="plannerPrevWeek()"><i class="ti ti-chevron-left"></i> Prev</button>
    <button class="btn" onclick="plannerThisWeek()"><i class="ti ti-calendar-event"></i> This week</button>
    <button class="btn" onclick="plannerNextWeek()">Next <i class="ti ti-chevron-right"></i></button>
    <strong style="font-size:14px;margin-left:4px">${weekLabel}</strong>
    <button class="btn success" style="margin-left:auto" onclick="downloadPlannerPDF()"><i class="ti ti-file-type-pdf"></i> Download PDF</button>
  </div>`;

  if(isAdmin()){
  h+=`<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:16px;padding:12px 14px;background:var(--bg-secondary);border-radius:var(--radius-md);border:0.5px solid var(--border-light)">
    <span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--text-secondary)">Team members</span>
    ${teamMembers.map(m=>`<span style="display:inline-flex;align-items:center;gap:5px;background:var(--bg-primary);border:0.5px solid var(--border-mid);border-radius:99px;padding:3px 10px;font-size:12px">
      ${m.name}
      <button onclick="removeTeamMember('${m.id}')" style="border:none;background:none;cursor:pointer;color:var(--text-tertiary);display:inline-flex;align-items:center;padding:0;line-height:1" title="Remove"><i class="ti ti-x" style="font-size:11px"></i></button>
    </span>`).join('')}
    <div style="display:flex;gap:6px;align-items:center;margin-left:4px">
      <select id="new-member-select" style="height:30px;font-size:12px;min-width:160px">
        <option value="">Select user…</option>
        ${users.map(u=>`<option value="${u.name}">${u.name} (${roleLabel(u.role)})</option>`).join('')}
      </select>
      <button class="btn primary" onclick="addTeamMember()" style="padding:4px 10px;font-size:12px;height:30px"><i class="ti ti-plus"></i> Add</button>
    </div>
  </div>`;
  }else{
    h+=`<div class="info-banner" style="margin-bottom:16px"><i class="ti ti-calendar-week" style="font-size:20px;flex-shrink:0"></i><div><div style="font-weight:500;margin-bottom:2px">Your team planner</div><div>You can add, edit and move your own unlocked planner tasks. Admin-locked tasks are read-only.</div></div></div>`;
  }

  if(!visibleMembers.length){
    h+=`<div class="empty"><i class="ti ti-users" style="font-size:32px;margin-bottom:8px;display:block;opacity:.3"></i>No team members yet.<br><span style="font-size:12px">Select a user above and click Add to get started.</span></div>`;
    document.getElementById('planner-content').innerHTML=h;
    return;
  }

  h+=`<div class="planner-wrap"><table class="planner-table"><thead><tr>
    <th>Team Member</th>
    ${days.map((d,i)=>`<th${d===todayStr?' style="background:var(--info-bg);color:var(--info-text)"':''}>${DAY_SHORT[i]}<br><span style="font-weight:400;font-size:10px">${fmtDate(d)}</span></th>`).join('')}
  </tr></thead><tbody>`;

  visibleMembers.forEach(m=>{
    h+=`<tr><td class="planner-staff-cell">${m.name}</td>`;
    days.forEach((d,di)=>{
      const cellEntries=sortByManualOrder(weekEntries.filter(e=>e.staff_name===m.name&&e.day_index===di));
      const isTodayCol=d===todayStr;
      const dropName=plannerJsArg(m.name);
      h+=`<td class="planner-day-cell"${isTodayCol?' style="background:var(--info-bg)"':''} ondragover="allowPlannerDrop(event)" ondrop="dropPlannerEntry(event,'${dropName}',${di},'${ws}')">`;
      cellEntries.forEach(e=>{
        const wj=wipJobs.find(j=>j.id===e.job_id);
        const title=wj?`${wj.customer||'Job'} — ${wj.nature_of_job||''}`:e.custom_task||'Task';
        const sub=e.notes||'';
        const canModify=canModifyPlannerEntry(e);
        const canComplete=canCompletePlannerEntry(e);
        const dragAttr=canModify?`draggable="true" ondragstart="startPlannerDrag(event,'${e.id}')"`:'';
        h+=`<div class="planner-entry${e.completed?' done':''}${e.locked_by_admin?' locked':''}" ${dragAttr} ondragover="allowPlannerDrop(event)" ondrop="dropPlannerEntry(event,'${dropName}',${di},'${ws}','${e.id}')" onclick="openModal('plannerEdit','${e.id}')">
          <input type="checkbox" class="planner-entry-chk" ${e.completed?'checked':''} ${canComplete?'':'disabled'} onclick="event.stopPropagation();togglePlannerEntry('${e.id}',this.checked)" title="${e.completed?'Mark pending':'Mark complete'}">
          <div class="planner-entry-title" title="${title.replace(/"/g,'&quot;')}">${e.locked_by_admin?'<i class="ti ti-lock" title="Locked by admin" style="font-size:11px;margin-right:3px"></i>':''}${title.length>38?title.slice(0,36)+'…':title}</div>
          ${sub?`<div class="planner-entry-sub">${sub.length>40?sub.slice(0,38)+'…':sub}</div>`:''}
          ${canModify?`<button class="planner-entry-del" onclick="event.stopPropagation();deletePlannerEntry('${e.id}')" title="Remove"><i class="ti ti-x"></i></button>`:''}
        </div>`;
      });
      h+=`<button class="planner-add-btn" onclick="openModal('plannerAdd','${m.name}|${di}|${ws}')"><i class="ti ti-plus"></i> Add</button>`;
      h+=`</td>`;
    });
    h+=`</tr>`;
  });

  h+=`</tbody></table></div>`;
  document.getElementById('planner-content').innerHTML=h;
}

async function addTeamMember(){
  if(!isAdmin()){toast('Admin only','err');return;}
  const sel=document.getElementById('new-member-select');
  const name=(sel?.value||'').trim();
  if(!name){toast('Select a user first','err');return;}
  if(teamMembers.find(m=>m.name.toLowerCase()===name.toLowerCase())){toast('Already on the planner','err');return;}
  try{
    const row=await dbInsert('team_members',{name});
    teamMembers.push(row);
    teamMembers.sort((a,b)=>a.name.localeCompare(b.name));
    toast(`${name} added to planner`);renderPlanner();
  }catch(e){toast('Failed to add: '+e.message,'err');}
}

async function removeTeamMember(id){
  if(!isAdmin()){toast('Admin only','err');return;}
  const m=teamMembers.find(x=>x.id===id);
  if(!confirm(`Remove ${m?.name} from the team planner? Their scheduled entries will also be deleted.`))return;
  try{
    // Remove all planner entries for this member
    const toDelete=plannerEntries.filter(e=>e.staff_name===m.name);
    for(const e of toDelete){await dbDelete('team_planner',e.id);}
    plannerEntries=plannerEntries.filter(e=>e.staff_name!==m.name);
    await dbDelete('team_members',id);
    teamMembers=teamMembers.filter(x=>x.id!==id);
    toast(`${m.name} removed`);renderPlanner();
  }catch(e){toast('Failed to remove: '+e.message,'err');}
}

function addPlannerTaskRow(){plannerTaskRows.push({type:'wip',jobId:'',custom:'',notes:''});renderPlannerTaskRows();}
function removePlannerTaskRow(i){plannerTaskRows.splice(i,1);renderPlannerTaskRows();}
function renderPlannerTaskRows(){
  const c=document.getElementById('planner-task-container');if(!c)return;
  if(!plannerTaskRows.length){c.innerHTML=`<div style="font-size:12px;color:var(--text-tertiary);font-style:italic;padding:4px 0">No tasks added yet</div>`;return;}
  const wipOpts=wipJobs.filter(j=>j.status!=='Job Complete').map(j=>`<option value="${j.id}">${j.customer||'?'}: ${(j.nature_of_job||'').slice(0,40)}</option>`).join('');
  c.innerHTML=plannerTaskRows.map((r,i)=>`
    <div style="background:var(--bg-secondary);border:0.5px solid var(--border-light);border-radius:var(--radius-md);padding:10px 12px;margin-bottom:8px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <select style="height:28px;font-size:12px;flex:1;margin-right:8px" onchange="plannerTaskRows[${i}].type=this.value;renderPlannerTaskRows()">
          <option value="wip"${r.type==='wip'?' selected':''}>Assign WIP job</option>
          <option value="custom"${r.type==='custom'?' selected':''}>Custom task</option>
        </select>
        <button class="icon-btn del" onclick="removePlannerTaskRow(${i})" type="button" style="flex-shrink:0"><i class="ti ti-x"></i></button>
      </div>
      ${r.type==='wip'
        ?`<select style="width:100%;height:30px;font-size:12px;margin-bottom:6px" onchange="plannerTaskRows[${i}].jobId=this.value"><option value="">Select WIP job…</option>${wipOpts.replace(`value="${r.jobId}"`,`value="${r.jobId}" selected`)}</select>`
        :`<input type="text" placeholder="Task description…" value="${r.custom}" oninput="plannerTaskRows[${i}].custom=this.value" style="width:100%;margin-bottom:6px">`
      }
      <input type="text" placeholder="Notes, e.g. 08:00–12:00, bring tools (optional)" value="${r.notes}" oninput="plannerTaskRows[${i}].notes=this.value" style="width:100%;font-size:12px">
    </div>`).join('');
}

async function deletePlannerEntry(id){
  const entry=plannerEntries.find(e=>e.id===id);
  if(!canModifyPlannerEntry(entry)){toast('This task is locked by admin','err');return;}
  if(!confirm('Remove this planner entry?'))return;
  try{
    await dbDelete('team_planner',id);
    plannerEntries=plannerEntries.filter(e=>e.id!==id);
    closeModal();
    toast('Entry removed');renderPlanner();
  }catch(e){toast('Delete failed: '+e.message,'err');}
}

async function togglePlannerEntry(id,completed){
  const e=plannerEntries.find(x=>x.id===id);
  if(!canCompletePlannerEntry(e)){toast('You can only complete your own planner tasks','err');renderPlanner();return;}
  try{
    await dbUpdate('team_planner',id,{completed});
    if(e)e.completed=completed;
    renderPlanner();
  }catch(err){toast('Update failed: '+err.message,'err');}
}

function buildPlannerPDF(){
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:'landscape',unit:'pt',format:'a4'});
  const PW=841.89,PH=595.28;
  const NAVY=[15,30,68],LG=[245,247,250],MG=[220,225,235],WHITE=[255,255,255];
  const TEAL=[13,148,136];

  const ws=plannerWeekStart||getMondayOf(today());
  const days=DAY_NAMES.map((_,i)=>addDays(ws,i));
  const staffList=plannerVisibleMembers().map(m=>m.name);
  const staffSet=staffList.map(n=>n.toLowerCase());
  const weekEntries=plannerEntries.filter(e=>e.week_start===ws&&(isAdmin()||staffSet.includes(String(e.staff_name||'').toLowerCase())));

  // Grid dimensions
  const marginL=30,marginR=30,gridTop=78;
  const gridW=PW-marginL-marginR;
  const COL0=120; // staff name column width
  const dayW=(gridW-COL0)/5;
  const rowH=78;
  const maxRows=Math.max(1,Math.floor((PH-gridTop-48)/rowH));
  const pages=Math.max(1,Math.ceil(staffList.length/maxRows));

  function drawPlannerPage(pageIndex){
    if(pageIndex>0)doc.addPage();
    addPdfBrandingPT(doc,'TEAM PLANNER',`${fmtDate(days[0])} – ${fmtDate(days[4])}${pages>1?' · Page '+(pageIndex+1)+' of '+pages:''}`);
    const start=pageIndex*maxRows;
    const pageStaff=staffList.slice(start,start+maxRows);
    doc.setFillColor(...LG);
    doc.rect(marginL,gridTop,gridW,20,'F');
    doc.setDrawColor(...MG);
    doc.rect(marginL,gridTop,gridW,20,'S');
    doc.setFontSize(8);doc.setFont('helvetica','bold');doc.setTextColor(...NAVY);
    doc.text('TEAM MEMBER',marginL+6,gridTop+13);
    days.forEach((d,i)=>{
      const x=marginL+COL0+i*dayW;
      doc.text(`${DAY_SHORT[i].toUpperCase()} ${fmtDate(d)}`,x+dayW/2,gridTop+13,{align:'center'});
    });

    pageStaff.forEach((name,localRi)=>{
      const ri=start+localRi;
      const y=gridTop+20+localRi*rowH;
      doc.setFillColor(...(ri%2===0?WHITE:LG));
      doc.rect(marginL,y,gridW,rowH,'F');
      doc.setDrawColor(...MG);
      doc.rect(marginL,y,gridW,rowH,'S');

      doc.setFillColor(...LG);
      doc.rect(marginL,y,COL0,rowH,'F');
      doc.setDrawColor(...MG);
      doc.rect(marginL,y,COL0,rowH,'S');
      doc.setFontSize(8);doc.setFont('helvetica','bold');doc.setTextColor(...NAVY);
      const nameLines=doc.splitTextToSize(name,COL0-10);
      doc.text(nameLines,marginL+5,y+12);

      days.forEach((d,di)=>{
        const x=marginL+COL0+di*dayW;
        const cellEntries=sortByManualOrder(weekEntries.filter(e=>e.staff_name===name&&e.day_index===di));
        doc.setDrawColor(...MG);
        doc.rect(x,y,dayW,rowH,'S');

        let ey=y+9;
        cellEntries.forEach((e,ei)=>{
          if(ey>y+rowH-12){
            if(ei===cellEntries.length-1)return;
            doc.setFontSize(6);doc.setFont('helvetica','bold');doc.setTextColor(107,114,128);
            doc.text(`+${cellEntries.length-ei} more`,x+6,y+rowH-5);
            ey=y+rowH;
            return;
          }
          const wj=wipJobs.find(j=>j.id===e.job_id);
          const title=wj?`${wj.customer||''}: ${wj.nature_of_job||''}`.trim():e.custom_task||'Task';
          const isDone=e.completed;
          doc.setFillColor(...(isDone?[220,252,231]:[219,234,254]));
          doc.roundedRect(x+3,ey-6,dayW-6,14,2,2,'F');
          doc.setFillColor(...(isDone?[22,101,52]:[29,78,216]));
          doc.circle(x+8,ey-1,2,'F');
          doc.setFontSize(6.5);doc.setFont('helvetica',isDone?'normal':'bold');
          doc.setTextColor(...(isDone?[22,101,52]:NAVY));
          const tLines=doc.splitTextToSize(title,dayW-18);
          doc.text(tLines[0],x+13,ey);
          if(e.notes&&ey+9<y+rowH-4){
            doc.setFontSize(6);doc.setFont('helvetica','normal');doc.setTextColor(107,114,128);
            const nLines=doc.splitTextToSize(e.notes,dayW-18);
            doc.text(nLines[0],x+13,ey+7);
            ey+=7;
          }
          ey+=10;
        });
      });
    });
  }

  for(let p=0;p<pages;p++)drawPlannerPage(p);
  addPdfFooterPT(doc);

  return doc;
}

function downloadPlannerPDF(){
  const ws=plannerWeekStart||getMondayOf(today());
  const doc=buildPlannerPDF();
  doc.save(`Team_Planner_${ws}.pdf`);
}

// ═══════════════════════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════════════════════
function openModal(mode,extra){
  modalMode=mode;targetId=extra||null;
  const title=document.getElementById('modal-title'),body=document.getElementById('modal-body'),saveBtn=document.getElementById('modal-save-btn');
  saveBtn.style.cssText='';saveBtn.className='btn primary';saveBtn.textContent='Save';

  if(mode==='newUser'){
    const roleLabels={'admin':'Add admin','rep':'Add rep','team':'Add team member'};
    title.textContent=roleLabels[extra]||'Add user';
    body.innerHTML=`<div class="form-2"><div class="form-row"><label>Full name</label><input type="text" id="f-name" placeholder="e.g. Jane Smith"></div>
      <div class="form-row"><label>Username</label><input type="text" id="f-username" placeholder="e.g. jane.smith"></div></div>
      <div class="form-row"><label>Password</label><input type="password" id="f-password" placeholder="Temporary password"></div>
      ${extra==='rep'?`<div class="form-row"><label>Territory / area</label><input type="text" id="f-territory" placeholder="e.g. KZN North"></div>`:''}
      <div class="form-2"><div class="form-row"><label>Email</label><input type="email" id="f-email"></div>
      <div class="form-row"><label>Phone</label><input type="text" id="f-phone"></div></div>`;
  } else if(mode==='editUser'){
    const u=users.find(x=>x.id===extra);title.textContent='Edit user';
    body.innerHTML=`<div class="form-2"><div class="form-row"><label>Full name</label><input type="text" id="f-name" value="${u.name}"></div>
      <div class="form-row"><label>Username</label><input type="text" id="f-username" value="${u.username}"></div></div>
      <div class="form-row"><label>New password <span style="font-weight:400;color:var(--text-secondary)">(leave blank to keep current)</span></label><input type="password" id="f-password" placeholder="Leave blank to keep current"></div>
      ${u.role==='rep'?`<div class="form-row"><label>Territory / area</label><input type="text" id="f-territory" value="${u.territory||''}"></div>`:''}
      <div class="form-2"><div class="form-row"><label>Email</label><input type="email" id="f-email" value="${u.email||''}"></div>
      <div class="form-row"><label>Phone</label><input type="text" id="f-phone" value="${u.phone||''}"></div></div>`;
  } else if(mode==='deleteUser'){
    const u=users.find(x=>x.id===extra);title.textContent='Remove user';
    saveBtn.className='btn danger';saveBtn.textContent='Yes, remove';
    body.innerHTML=`<div class="confirm-box"><i class="ti ti-alert-triangle"></i> Remove <strong>${u.name}</strong> (${roleLabel(u.role)})? Their historical data stays intact.</div>`;
  } else if(mode==='pipeline'||mode==='editDeal'){
    const d=mode==='editDeal'?findById(deals,extra):{};
    title.textContent=mode==='pipeline'?'Add deal':'Edit deal';
    body.innerHTML=`<div class="form-2"><div class="form-row"><label>Rep</label><select id="f-rep"><option value="">Select…</option>${repOpts(d.rep||'')}</select></div>
      <div class="form-row"><label>Stage</label><select id="f-stage" onchange="autoProb(this.value)">${STAGES.map(s=>`<option${s===(d.stage||'Qualified')?' selected':''}>${s}</option>`).join('')}</select></div></div>
      <div class="form-2"><div class="form-row"><label>Customer name</label><input type="text" id="f-cust" value="${d.customer||''}"></div>
      <div class="form-row"><label>Company</label><input type="text" id="f-company" value="${d.company||''}"></div></div>
      <div class="form-row"><label>Opportunity / product</label><input type="text" id="f-opp" value="${d.opportunity||''}"></div>
      <div class="form-2"><div class="form-row"><label>Deal value (R)</label><input type="number" id="f-value" value="${d.value||''}" min="0"></div>
      <div class="form-row"><label>Probability %</label><input type="number" id="f-prob" value="${d.prob!==undefined?d.prob:DP['Qualified']}" min="0" max="100"></div></div>
      <div class="form-2"><div class="form-row"><label>Expected close date</label><input type="date" id="f-close" value="${d.close||''}"></div>
      <div class="form-row"><label>Status</label><select id="f-status"><option${(d.status||'Active')==='Active'?' selected':''}>Active</option><option${d.status==='Won'?' selected':''}>Won</option><option${d.status==='Lost'?' selected':''}>Lost</option></select></div></div>`;
  } else if(mode==='deleteDeal'){
    const d=findById(deals,extra);title.textContent='Delete deal';
    saveBtn.className='btn danger';saveBtn.textContent='Yes, delete';
    const qCount=quotesForDeal(extra).length;
    body.innerHTML=`<div class="confirm-box"><i class="ti ti-alert-triangle"></i> Delete <strong>${d.opportunity}</strong> for ${d.company} (${fmt(d.value)})?${qCount?` <strong>${qCount} uploaded quote${qCount!==1?'s':''} will also be permanently deleted.</strong>`:''} This cannot be undone.</div>`;
  } else if(mode==='editActivity'){
    const a=findById(activities,extra);
    if(!a){toast('Activity record not found','err');return;}
    title.textContent='Edit activity';
    body.innerHTML=`<div class="form-2"><div class="form-row"><label>Date</label><input type="date" id="f-date" value="${a.date}"></div>
      <div class="form-row"><label>Rep</label><select id="f-rep"><option value="">Select…</option>${repOpts(a.rep)}</select></div></div>
      <div class="form-2"><div class="form-row"><label>Customer name</label><input type="text" id="f-cust" value="${a.customer||''}"></div>
      <div class="form-row"><label>Company</label><input type="text" id="f-company" value="${a.company||''}"></div></div>
      <div class="form-2"><div class="form-row"><label>Contact type</label><select id="f-type">${TYPES.map(t=>`<option${t===a.type?' selected':''}>${t}</option>`).join('')}</select></div>
      <div class="form-row"><label>Duration (mins)</label><input type="number" id="f-mins" value="${a.mins||0}" min="1"></div></div>
      <div class="form-row"><label>Purpose / agenda</label><input type="text" id="f-purpose" value="${a.purpose||''}"></div>
      <div class="form-row"><label>Outcome</label><textarea id="f-outcome">${a.outcome||''}</textarea></div>
      <div class="form-2"><div class="form-row"><label>Follow-up required?</label><select id="f-fu"><option${a.followup==='No'?' selected':''}>No</option><option${a.followup==='Yes'?' selected':''}>Yes</option></select></div>
      <div class="form-row"><label>Follow-up date</label><input type="date" id="f-fudate" value="${a.fudate||''}"></div></div>`;
  } else if(mode==='deleteActivity'){
    const a=findById(activities,extra);
    if(!a){toast('Activity record not found','err');return;}
    title.textContent='Delete activity';
    saveBtn.className='btn danger';saveBtn.textContent='Yes, delete';
    body.innerHTML=`<div class="confirm-box"><i class="ti ti-alert-triangle"></i> Delete the activity for <strong>${a.customer}</strong> at ${a.company} on ${fmtDate(a.date)}? This cannot be undone.</div>`;
  } else if(mode==='activity'){
    title.textContent='Log activity';const dr=isRep()?currentUser.name:'';
    body.innerHTML=`<div class="form-2"><div class="form-row"><label>Date</label><input type="date" id="f-date" value="${today()}"></div>
      <div class="form-row"><label>Rep</label><select id="f-rep"><option value="">Select…</option>${repOpts(dr)}</select></div></div>
      <div class="form-2"><div class="form-row"><label>Customer name</label><input type="text" id="f-cust"></div>
      <div class="form-row"><label>Company</label><input type="text" id="f-company"></div></div>
      <div class="form-2"><div class="form-row"><label>Contact type</label><select id="f-type">${TYPES.map(t=>`<option>${t}</option>`).join('')}</select></div>
      <div class="form-row"><label>Duration (mins)</label><input type="number" id="f-mins" value="30" min="1"></div></div>
      <div class="form-row"><label>Purpose / agenda</label><input type="text" id="f-purpose"></div>
      <div class="form-row"><label>Outcome</label><textarea id="f-outcome"></textarea></div>
      <div class="form-2"><div class="form-row"><label>Follow-up required?</label><select id="f-fu"><option>No</option><option>Yes</option></select></div>
      <div class="form-row"><label>Follow-up date</label><input type="date" id="f-fudate"></div></div>`;
  } else if(mode==='wipAdd'||mode==='wipEdit'){
    const j=mode==='wipEdit'?wipJobs.find(x=>x.id===extra):{};
    title.textContent=mode==='wipAdd'?'Add WIP job':'Edit WIP job';
    wipStaffRows=mode==='wipEdit'?(j.wip_staff_tasks||[]).map(t=>({name:t.staff_name||'',task:t.task||'',completed:t.completed||false})):[];
    const wipStatuses=['Jobs On The Go','Awaiting Approval','Job Complete'];
    body.innerHTML=`
      <div class="form-2">
        <div class="form-row"><label>Job #</label><input type="text" id="f-jobnum" placeholder="e.g. 1" value="${j.job_number||''}"></div>
        <div class="form-row"><label>Status</label><select id="f-wip-status">${wipStatuses.map(s=>`<option${s===(j.status||'Jobs On The Go')?' selected':''}>${s}</option>`).join('')}</select></div>
      </div>
      <div class="form-2">
        <div class="form-row"><label>Customer</label><input type="text" id="f-cust" value="${j.customer||''}"></div>
        <div class="form-row"><label>Delivery date</label><input type="date" id="f-delivery" value="${j.delivery_date||''}"></div>
      </div>
      <div class="form-row"><label>Nature of job</label><input type="text" id="f-nature" value="${j.nature_of_job||''}"></div>
      <div class="form-2">
        <div class="form-row"><label>Quote #</label><input type="text" id="f-quote" value="${j.quote_number||''}"></div>
        <div class="form-row"><label>Sales order #</label><input type="text" id="f-so" value="${j.sales_order||''}"></div>
      </div>
      <div class="form-row"><label>Invoice #</label><input type="text" id="f-invoice" value="${j.invoice||''}"></div>
      <div class="form-2">
        <div class="form-row"><label>Total amount (R)</label><input type="number" id="f-total" min="0" step="0.01" value="${j.total_amount||''}"></div>
        <div class="form-row"><label>Deposit amount (R)</label><input type="number" id="f-dep" min="0" step="0.01" value="${j.deposit_amount||''}"></div>
      </div>
      <div class="form-2">
        <div class="form-row"><label>Expected deposit date</label><input type="date" id="f-depdate" value="${j.expected_deposit_date||''}"></div>
        <div class="form-row"><label>Deposit paid?</label><select id="f-deppaid"><option value="false"${!j.deposit_paid?' selected':''}>No</option><option value="true"${j.deposit_paid?' selected':''}>Yes</option></select></div>
      </div>
      <div class="form-2">
        <div class="form-row"><label>Expected payment date</label><input type="date" id="f-paydate" value="${j.expected_payment_date||''}"></div>
        <div class="form-row"><label>Paid in full?</label><select id="f-paidfull"><option value="false"${!j.paid_full?' selected':''}>No</option><option value="true"${j.paid_full?' selected':''}>Yes</option></select></div>
      </div>
      <div class="form-row"><label>Labour hours allocated</label><input type="number" id="f-labour-hours" min="0" step="0.5" placeholder="e.g. 8" value="${j.labour_hours_allocated||''}"></div>
      <div class="form-row"><label>Staff responsibilities & time-frame</label><textarea id="f-staffnotes">${j.staff_notes||''}</textarea></div>
      <div class="wip-staff-hd">
        <span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--text-secondary)">Staff assignments</span>
        <button class="btn" type="button" onclick="addWIPStaffRow()" style="font-size:12px;padding:4px 10px"><i class="ti ti-plus"></i> Add</button>
      </div>
      <div id="wip-staff-container"></div>`;
    renderWIPStaffRows();
  } else if(mode==='wipDelete'){
    const j=wipJobs.find(x=>x.id===extra);
    title.textContent='Remove job';
    saveBtn.className='btn danger';saveBtn.textContent='Yes, remove';
    body.innerHTML=`<div class="confirm-box"><i class="ti ti-alert-triangle"></i> Remove job <strong>${j.nature_of_job}</strong> for <strong>${j.customer}</strong>? This cannot be undone.</div>`;
  } else if(mode==='plannerAdd'){
    // extra = "staffName|dayIndex|weekStart"
    const parts=(extra||'').split('|');
    let staffName=parts[0]||'';const dayIdx=parseInt(parts[1])||0;const ws=parts[2]||getMondayOf(today());
    if(isRep())staffName=currentUser.name;
    title.textContent=`Add tasks — ${staffName} — ${DAY_NAMES[dayIdx]}`;
    saveBtn.textContent='Save all tasks';
    plannerTaskRows=[{type:'wip',jobId:'',custom:'',notes:''}];
    body.innerHTML=`
      <input type="hidden" id="f-planner-staff" value="${staffName}">
      <input type="hidden" id="f-planner-day" value="${dayIdx}">
      <input type="hidden" id="f-planner-ws" value="${ws}">
      <div id="planner-task-container"></div>
      ${isAdmin()?`<label style="display:flex;align-items:center;gap:7px;font-size:12px;margin:8px 0 10px;cursor:pointer"><input type="checkbox" id="f-planner-locked"> Lock these tasks for reps</label>`:''}
      <button class="btn" type="button" onclick="addPlannerTaskRow()" style="width:100%;justify-content:center;margin-top:4px"><i class="ti ti-plus"></i> Add another task</button>`;
    renderPlannerTaskRows();
  } else if(mode==='plannerEdit'){
    const e=plannerEntries.find(x=>x.id===extra);
    if(!e){toast('Planner entry not found','err');return;}
    const canModify=canModifyPlannerEntry(e);
    const wj=wipJobs.find(j=>j.id===e?.job_id);
    title.textContent=`Edit task — ${e?.staff_name} — ${DAY_NAMES[e?.day_index||0]}`;
    if(!canModify){
      saveBtn.style.display='none';
      body.innerHTML=`<div class="info-banner" style="margin-bottom:12px"><i class="ti ti-lock" style="font-size:20px;flex-shrink:0"></i><div><div style="font-weight:500;margin-bottom:2px">Locked by admin</div><div>This planner entry is read-only for rep users.</div></div></div>
      <div class="detail-grid">
        <span class="detail-label">Team member</span><span>${e.staff_name||'—'}</span>
        <span class="detail-label">Day</span><span>${DAY_NAMES[e.day_index||0]}</span>
        <span class="detail-label">Task</span><span>${wj?`${wj.customer||'Job'} — ${wj.nature_of_job||''}`:e.custom_task||'Task'}</span>
        <span class="detail-label">Notes</span><span>${e.notes||'—'}</span>
        <span class="detail-label">Status</span><span>${e.completed?'Complete':'Pending'}</span>
      </div>`;
      document.getElementById('modal-overlay').classList.add('open');
      return;
    }
    const wipOpts=wipJobs.filter(j=>j.status!=='Job Complete').map(j=>`<option value="${j.id}"${j.id===e?.job_id?' selected':''}>${j.customer||'?'}: ${(j.nature_of_job||'').slice(0,40)}</option>`).join('');
    const isCustom=!e?.job_id;
    body.innerHTML=`
      <div class="form-row"><label>Type</label>
        <select id="f-planner-type" onchange="document.getElementById('f-planner-wip-row').style.display=this.value==='wip'?'block':'none';document.getElementById('f-planner-task-row').style.display=this.value==='custom'?'block':'none'">
          <option value="wip"${!isCustom?' selected':''}>Assign WIP job</option>
          <option value="custom"${isCustom?' selected':''}>Custom task</option>
        </select>
      </div>
      <div class="form-row" id="f-planner-wip-row"${isCustom?' style="display:none"':''}>
        <label>WIP job</label>
        <select id="f-planner-job"><option value="">Select job…</option>${wipOpts}</select>
      </div>
      <div class="form-row" id="f-planner-task-row"${!isCustom?' style="display:none"':''}>
        <label>Task description</label>
        <input type="text" id="f-planner-custom" value="${e?.custom_task||''}" placeholder="e.g. Site inspection at client X">
      </div>
      <div class="form-row"><label>Notes <span style="font-weight:400;color:var(--text-secondary)">(optional)</span></label>
        <input type="text" id="f-planner-notes" value="${e?.notes||''}" placeholder="e.g. 08:00–12:00, bring tools"></div>
      ${isAdmin()?`<label style="display:flex;align-items:center;gap:7px;font-size:12px;margin-top:6px;cursor:pointer"><input type="checkbox" id="f-planner-locked" ${e.locked_by_admin?'checked':''}> Lock this task for reps</label>`:''}
      <button class="btn danger" type="button" onclick="deletePlannerEntry('${e.id}')" style="margin-top:12px"><i class="ti ti-trash"></i> Delete task</button>`;
  } else if(mode==='viewActivity'){
    const a=findById(activities,extra);
    if(!a){toast('Activity record not found','err');return;}
    title.textContent='Activity details';saveBtn.style.display='none';
    body.innerHTML=`<div class="detail-grid">
      <span class="detail-label">Date</span><span>${fmtDate(a.date)}</span>
      <span class="detail-label">Rep</span><span>${a.rep}</span>
      <div class="detail-sep"></div>
      <span class="detail-label">Customer</span><span>${a.customer||'—'}</span>
      <span class="detail-label">Company</span><span>${a.company||'—'}</span>
      <div class="detail-sep"></div>
      <span class="detail-label">Type</span><span><span class="badge b-blue">${a.type}</span></span>
      <span class="detail-label">Duration</span><span>${a.mins} mins</span>
      <span class="detail-label">Follow-up</span><span><span class="badge ${a.followup==='Yes'?'b-amber':'b-gray'}">${a.followup}</span></span>
      <span class="detail-label">Follow-up date</span><span>${fmtDate(a.fudate)||'—'}</span>
      <div class="detail-sep"></div>
      <span class="detail-label">Purpose</span><span style="white-space:pre-wrap">${a.purpose||'—'}</span>
      <div class="detail-sep"></div>
      <span class="detail-label">Outcome</span><span style="white-space:pre-wrap">${a.outcome||'—'}</span>
    </div>`;
  } else if(mode==='viewDeal'){
    const d=findById(deals,extra);
    const qs=quotesForDeal(d.id);
    title.textContent='Deal details';saveBtn.style.display='none';
    body.innerHTML=`<div class="detail-grid">
      <span class="detail-label">Customer</span><span>${d.customer||'—'}</span>
      <span class="detail-label">Company</span><span>${d.company||'—'}</span>
      <span class="detail-label">Rep</span><span>${d.rep||'—'}</span>
      <span class="detail-label">Stage</span><span><span class="badge ${SC[d.stage]||'b-gray'}">${d.stage}</span></span>
      <div class="detail-sep"></div>
      <span class="detail-label">Opportunity</span><span style="white-space:pre-wrap">${d.opportunity||'—'}</span>
      <div class="detail-sep"></div>
      <span class="detail-label">Deal value</span><span>${fmt(d.value)}</span>
      <span class="detail-label">Probability</span><span>${d.prob}%</span>
      <span class="detail-label">Weighted value</span><span>${fmt(Math.round(d.value*d.prob/100))}</span>
      <span class="detail-label">Status</span><span><span class="badge ${d.status==='Won'?'b-green':d.status==='Lost'?'b-coral':'b-blue'}">${d.status}</span></span>
      <span class="detail-label">Close date</span><span>${fmtDate(d.close)||'—'}</span>
      <div class="detail-sep"></div>
      <span class="detail-label">Quotes</span><span>${qs.length?qs.map(q=>`<a href="${q.public_url}" target="_blank" style="display:inline-flex;align-items:center;gap:4px;color:var(--accent);text-decoration:none;font-size:12px;margin-bottom:4px"><i class="ti ti-file-type-pdf" style="color:#C0392B"></i>${q.file_name}</a>`).join('<br>'):'No quotes uploaded'}</span>
    </div>`;
  } else if(mode==='viewWIP'){
    const j=wipJobs.find(x=>x.id===extra);
    const tasks=j.wip_staff_tasks||[];
    const bal=Math.max(0,(j.total_amount||0)-(j.deposit_amount||0));
    title.textContent='WIP job details';saveBtn.style.display='none';
    body.innerHTML=`<div class="detail-grid">
      <span class="detail-label">Job #</span><span>${j.job_number||'—'}</span>
      <span class="detail-label">Status</span><span><span class="badge ${'Jobs On The Go'===j.status?'b-blue':'Awaiting Approval'===j.status?'b-amber':'b-green'}">${j.status}</span></span>
      <span class="detail-label">Customer</span><span>${j.customer||'—'}</span>
      <span class="detail-label">Delivery date</span><span>${fmtDate(j.delivery_date)||'—'}</span>
      <div class="detail-sep"></div>
      <span class="detail-label">Nature of job</span><span style="white-space:pre-wrap">${j.nature_of_job||'—'}</span>
      <div class="detail-sep"></div>
      <span class="detail-label">Quote #</span><span>${j.quote_number||'—'}</span>
      <span class="detail-label">Sales order #</span><span>${j.sales_order||'—'}</span>
      <span class="detail-label">Invoice #</span><span>${j.invoice||'—'}</span>
      <div class="detail-sep"></div>
      <span class="detail-label">Total amount</span><span>${fmt(j.total_amount||0)}</span>
      <span class="detail-label">Deposit amount</span><span>${j.deposit_amount?fmt(j.deposit_amount):'—'}</span>
      <span class="detail-label">Exp deposit date</span><span>${fmtDate(j.expected_deposit_date)||'—'}</span>
      <span class="detail-label">Deposit paid</span><span>${j.deposit_paid?'<span class="badge b-green">Yes</span>':'<span class="badge b-gray">No</span>'}</span>
      <span class="detail-label">Balance</span><span>${j.paid_full?'<span class="badge b-green">Paid in full</span>':fmt(bal)}</span>
      <span class="detail-label">Exp payment date</span><span>${fmtDate(j.expected_payment_date)||'—'}</span>
      <span class="detail-label">Paid in full</span><span>${j.paid_full?'<span class="badge b-green">Yes</span>':'<span class="badge b-gray">No</span>'}</span>
      ${j.staff_notes?`<div class="detail-sep"></div><span class="detail-label">Notes</span><span style="white-space:pre-wrap">${j.staff_notes}</span>`:''}
      ${tasks.length?`<div class="detail-sep"></div><span class="detail-label" style="padding-top:4px">Staff</span><span>${tasks.map(t=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span class="badge ${t.completed?'b-green':'b-gray'}" style="flex-shrink:0">${t.completed?'Done':'Pending'}</span><span style="font-size:12px"><strong>${t.staff_name}</strong>${t.task?' — '+t.task:''}</span></div>`).join('')}</span>`:''}
    </div>`;
  } else if(mode==='perfAdd'||mode==='perfEdit'){
    const e=mode==='perfEdit'?performanceTimesheets.find(x=>x.id===extra):{};
    title.textContent=mode==='perfAdd'?'Log hours':'Edit timesheet entry';
    const wipOpts=wipJobs.map(j=>`<option value="${j.id}" ${e.job_id===j.id?'selected':''}>${j.job_number||'(no #)'} — ${j.customer||'Unknown'}</option>`).join('');
    body.innerHTML=`
      <div class="form-row"><label>Team member</label>
        <select id="f-perf-member">
          <option value="">Select…</option>
          ${users.map(u=>`<option value="${u.name}" ${e.team_member_name===u.name?'selected':''}>${u.name} (${roleLabel(u.role)})</option>`).join('')}
        </select>
      </div>
      <div class="form-row"><label>WIP job</label>
        <select id="f-perf-job"><option value="">Select job…</option>${wipOpts}</select>
      </div>
      <div class="form-2">
        <div class="form-row"><label>Date</label><input type="date" id="f-perf-date" value="${e.date||today()}"></div>
        <div class="form-row"><label>Hours used</label><input type="number" id="f-perf-hours" min="0" step="0.25" placeholder="e.g. 3.5" value="${e.hours_used||''}"></div>
      </div>
      <div class="form-row"><label>Notes <span style="font-weight:400;color:var(--text-secondary)">(optional)</span></label><textarea id="f-perf-notes" placeholder="e.g. welding + assembly">${e.notes||''}</textarea></div>`;
  } else if(mode==='perfEntries'){
    const j=wipJobs.find(x=>x.id===extra)||{};
    title.textContent=`Timesheet entries — ${j.job_number||'Job'}${j.customer?' ('+j.customer+')':''}`;
    saveBtn.style.display='none';
    const jobEntries=performanceTimesheets.filter(e=>e.job_id===extra).sort((a,b)=>b.date.localeCompare(a.date));
    if(!jobEntries.length){
      body.innerHTML=`<div style="padding:1.5rem;text-align:center;color:var(--text-secondary);font-size:13px">No entries logged for this job yet.</div>`;
    } else {
      const totalH=jobEntries.reduce((s,e)=>s+parseFloat(e.hours_used||0),0);
      body.innerHTML=`<div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px">Allocated: <strong>${j.labour_hours_allocated||'—'}h</strong> &nbsp;·&nbsp; Total logged: <strong>${totalH.toFixed(1)}h</strong></div>
      <div style="border:0.5px solid var(--border-light);border-radius:var(--radius-md);overflow:hidden">
        ${jobEntries.map(e=>`<div class="tp-entry-row">
          <span style="color:var(--text-secondary)">${fmtDate(e.date)}</span>
          <span style="font-weight:500">${e.team_member_name}</span>
          <span>${parseFloat(e.hours_used).toFixed(1)}h</span>
          <span style="color:var(--text-secondary);font-size:11px">${e.notes||''}</span>
          <span></span>
          <div style="display:flex;gap:4px">
            <button class="icon-btn" onclick="closeModal();openModal('perfEdit','${e.id}')" title="Edit"><i class="ti ti-pencil"></i></button>
            <button class="icon-btn del" onclick="openModal('perfDelete','${e.id}')" title="Delete"><i class="ti ti-trash"></i></button>
          </div>
        </div>`).join('')}
      </div>`;
    }
  } else if(mode==='perfDelete'){
    title.textContent='Delete entry';
    saveBtn.className='btn danger';saveBtn.textContent='Yes, delete';
    const e=performanceTimesheets.find(x=>x.id===extra)||{};
    body.innerHTML=`<div class="confirm-box"><i class="ti ti-alert-triangle"></i> Delete this entry for <strong>${e.team_member_name}</strong> on ${fmtDate(e.date)} (${parseFloat(e.hours_used||0).toFixed(1)}h)?</div>`;
  } else if(mode==='kpiAdd'||mode==='kpiEdit'){
    const rec=mode==='kpiEdit'?kpiScorecards.find(x=>x.id===extra):{};
    const role=rec.role_name||KPI_ROLES[0];
    kpiScoreSeed={};
    (Array.isArray(rec.scores)?rec.scores:[]).forEach(s=>{kpiScoreSeed[s.kpi]={score:s.score,comment:s.comment||''};});
    title.textContent=mode==='kpiAdd'?'Fill KPI scorecard':'Edit KPI scorecard';
    body.innerHTML=`
      <div class="form-2">
        <div class="form-row"><label>User</label>
          <select id="f-kpi-user">
            <option value="">Select user…</option>
            ${users.map(u=>`<option value="${u.id}" ${String(rec.user_id||'')===String(u.id)?'selected':''}>${u.name} (${roleLabel(u.role)})</option>`).join('')}
          </select>
        </div>
        <div class="form-row"><label>Scorecard role</label>
          <select id="f-kpi-role" onchange="renderKpiModalRows(this.value,true)">
            ${KPI_ROLES.map(r=>`<option value="${r}" ${r===role?'selected':''}>${r}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-2">
        <div class="form-row"><label>Month</label><input type="month" id="f-kpi-month" value="${rec.month_key||currentMonthKey()}"></div>
        <div class="form-row"><label>Reviewer</label><input type="text" id="f-kpi-reviewer" value="${rec.reviewer||currentUser?.name||''}"></div>
      </div>
      <div id="kpi-score-rows"></div>
      <div id="kpi-score-preview" style="background:var(--bg-secondary);border:0.5px solid var(--border-light);border-radius:var(--radius-md);padding:10px 12px;font-size:13px;margin-bottom:12px"></div>
      <div class="form-row"><label>Manager comments</label><textarea id="f-kpi-comments" placeholder="Comments, coaching notes or next actions">${rec.comments||''}</textarea></div>`;
    renderKpiModalRows(role);
  } else if(mode==='kpiView'){
    const rec=findById(kpiScorecards,extra)||{};
    const scores=Array.isArray(rec.scores)?rec.scores:[];
    title.textContent='KPI scorecard details';saveBtn.style.display='none';
    let lastGroup='';
    body.innerHTML=`<div class="detail-grid">
      <span class="detail-label">Employee</span><span>${rec.employee_name||'—'}</span>
      <span class="detail-label">Month</span><span>${fmtMonth((rec.month_key||currentMonthKey())+'-01')}</span>
      <span class="detail-label">Role</span><span>${rec.role_name||'—'}</span>
      <span class="detail-label">Reviewer</span><span>${rec.reviewer||'—'}</span>
      <span class="detail-label">Final score</span><span><span class="badge ${kpiBandClass(parseFloat(rec.final_score)||0)}">${(parseFloat(rec.final_score)||0).toFixed(1)}%</span></span>
      ${rec.comments?`<div class="detail-sep"></div><span class="detail-label">Manager comments</span><span style="white-space:pre-wrap">${rec.comments}</span>`:''}
      <div class="detail-sep"></div>
      <div class="detail-full">
        <div class="tbl-wrap"><table>
          <colgroup><col style="width:42%"><col style="width:12%"><col style="width:12%"><col style="width:12%"><col style="width:22%"></colgroup>
          <thead><tr><th>KPI / section</th><th>Weight</th><th>Score</th><th>Weighted</th><th>Comments</th></tr></thead>
          <tbody>
            ${scores.map(s=>{
              const group=s.group||'KPIs';
              const showGroup=group!==lastGroup;lastGroup=group;
              const weighted=((parseFloat(s.score)||0)/5*(parseFloat(s.weight)||0));
              const req=s.items?.length?`<div style="font-size:10px;color:var(--text-secondary);line-height:1.4;margin-top:4px">${s.items.map(i=>`• ${i}`).join('<br>')}</div>`:'';
              return `${showGroup?`<tr><td colspan="5" style="background:var(--bg-secondary);font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-secondary);letter-spacing:.04em">${group}</td></tr>`:''}
              <tr>
                <td><strong>${s.kpi||'—'}</strong>${req}</td>
                <td style="text-align:center">${s.weight||0}%</td>
                <td style="text-align:center">${s.score||'—'}</td>
                <td style="text-align:center;font-weight:600">${s.score?weighted.toFixed(1)+'%':'—'}</td>
                <td style="font-size:11px;color:var(--text-secondary);white-space:pre-wrap">${s.comment||''}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table></div>
      </div>
    </div>`;
  } else if(mode==='kpiDelete'){
    title.textContent='Delete KPI scorecard';
    saveBtn.className='btn danger';saveBtn.textContent='Yes, delete';
    const rec=kpiScorecards.find(x=>x.id===extra)||{};
    body.innerHTML=`<div class="confirm-box"><i class="ti ti-alert-triangle"></i> Delete the KPI scorecard for <strong>${rec.employee_name||'this user'}</strong> (${rec.role_name||'role'})?</div>`;
  }
  document.getElementById('modal-overlay').classList.add('open');
}

function autoProb(s){const el=document.getElementById('f-prob');if(el&&DP[s]!==undefined)el.value=DP[s];}

function renderKpiModalRows(role,resetSeed=false){
  if(resetSeed)kpiScoreSeed={};
  const c=document.getElementById('kpi-score-rows');if(!c)return;
  const rows=kpiTemplateRows(role);
  let lastGroup='';
  let h=`<div class="tbl-wrap" style="margin-bottom:12px"><table>
    <colgroup><col style="width:62%"><col style="width:16%"><col style="width:22%"></colgroup>
    <thead><tr><th>KPI / section</th><th>Weight %</th><th>Score (1-5)</th></tr></thead><tbody>`;
  rows.forEach((r,i)=>{
    if(r.group!==lastGroup){
      lastGroup=r.group;
      h+=`<tr><td colspan="3" style="background:var(--bg-secondary);font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-secondary);letter-spacing:.04em">${r.group}</td></tr>`;
    }
    const seed=kpiScoreSeed[r.kpi]||{};
    const val=typeof seed==='object'?seed.score:seed;
    const comment=typeof seed==='object'?seed.comment||'':'';
    h+=`<tr>
      <td title="${r.kpi.replace(/"/g,'&quot;')}"><strong>${r.kpi}</strong></td>
      <td style="text-align:center">${r.weight}%</td>
      <td>
        <select id="f-kpi-score-${i}" onchange="updateKpiPreview()" style="width:100%;height:30px">
          <option value="">Select…</option>
          ${[1,2,3,4,5].map(n=>`<option value="${n}" ${String(val)===String(n)?'selected':''}>${n}</option>`).join('')}
        </select>
      </td>
    </tr>`;
    if(r.items?.length){
      h+=`<tr><td colspan="3" style="background:#fff;font-size:11px;color:var(--text-secondary);line-height:1.45;padding:8px 10px">
        <div style="font-weight:600;color:var(--text-secondary);margin-bottom:4px">Section requirements</div>
        <ul style="margin:0;padding-left:18px">${r.items.map(item=>`<li>${item}</li>`).join('')}</ul>
        <div style="margin-top:8px"><label style="display:block;font-size:10px;font-weight:600;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:4px">Comments</label><input type="text" id="f-kpi-comment-${i}" value="${comment.replace(/"/g,'&quot;')}" placeholder="Section comments" style="width:100%;height:30px;font-size:12px"></div>
      </td></tr>`;
    }
  });
  h+=`</tbody></table></div>`;
  c.innerHTML=h;
  updateKpiPreview();
}

function updateKpiPreview(){
  const role=document.getElementById('f-kpi-role')?.value||KPI_ROLES[0];
  const rows=kpiTemplateRows(role).map((r,i)=>({...r,score:parseFloat(document.getElementById(`f-kpi-score-${i}`)?.value)||0}));
  const score=kpiScorePercent(rows);
  const el=document.getElementById('kpi-score-preview');
  if(el)el.innerHTML=`Calculated result: <strong>${score.toFixed(1)}%</strong>`;
}

function collectKpiScores(){
  const role=document.getElementById('f-kpi-role')?.value||KPI_ROLES[0];
  return kpiTemplateRows(role).map((r,i)=>({...r,score:parseFloat(document.getElementById(`f-kpi-score-${i}`)?.value)||0,comment:document.getElementById(`f-kpi-comment-${i}`)?.value||null}));
}

async function saveModal(){
  const saveBtn=document.getElementById('modal-save-btn');saveBtn.disabled=true;
  try{
    if(modalMode==='newUser'){
      const role=targetId;
      const row=await dbInsert('users',{name:g('f-name'),username:g('f-username').toLowerCase(),password:g('f-password'),role,territory:g('f-territory')||null,email:g('f-email')||null,phone:g('f-phone')||null});
      users.push(row);toast(`${roleLabel(role)} added`);closeModal();renderUsers();
    } else if(modalMode==='editUser'){
      const u=users.find(x=>x.id===targetId);
      const updates={name:g('f-name'),username:g('f-username').toLowerCase(),territory:g('f-territory')||null,email:g('f-email')||null,phone:g('f-phone')||null};
      if(g('f-password'))updates.password=g('f-password');
      await dbUpdate('users',targetId,updates);Object.assign(u,updates);
      toast('User updated');closeModal();renderUsers();
    } else if(modalMode==='deleteUser'){
      await dbDelete('users',targetId);users=users.filter(u=>u.id!==targetId);
      toast('User removed');closeModal();renderUsers();
    } else if(modalMode==='pipeline'){
      const row=await dbInsert('deals',{rep:g('f-rep'),customer:g('f-cust'),company:g('f-company'),opportunity:g('f-opp'),stage:g('f-stage'),value:parseFloat(g('f-value'))||0,prob:parseFloat(g('f-prob'))||0,close:g('f-close')||null,status:g('f-status')});
      deals.unshift(row);toast('Deal added');closeModal();renderDeals();
    } else if(modalMode==='editDeal'){
      const updates={rep:g('f-rep'),customer:g('f-cust'),company:g('f-company'),opportunity:g('f-opp'),stage:g('f-stage'),value:parseFloat(g('f-value'))||0,prob:parseFloat(g('f-prob'))||0,close:g('f-close')||null,status:g('f-status')};
      await dbUpdate('deals',targetId,updates);const d=findById(deals,targetId);Object.assign(d,updates);
      toast('Deal updated');closeModal();renderDeals();
    } else if(modalMode==='deleteDeal'){
      // Delete all quotes for this deal first
      const dqs=quotesForDeal(targetId);
      for(const q of dqs){await deleteQuoteFromDB(q.id,q.file_path);}
      quotes=quotes.filter(q=>!sameId(q.deal_id,targetId));
      await dbDelete('deals',targetId);deals=deals.filter(d=>!sameId(d.id,targetId));
      toast('Deal deleted');closeModal();renderDeals();
    } else if(modalMode==='editActivity'){
      const updates={date:g('f-date'),rep:g('f-rep'),customer:g('f-cust'),company:g('f-company'),type:g('f-type'),purpose:g('f-purpose'),mins:parseInt(g('f-mins'))||0,followup:g('f-fu'),fudate:g('f-fudate')||null,outcome:g('f-outcome')};
      await dbUpdate('activities',targetId,updates);const a=findById(activities,targetId);if(a)Object.assign(a,updates);
      toast('Activity updated');closeModal();renderActivity();
    } else if(modalMode==='deleteActivity'){
      await dbDelete('activities',targetId);activities=activities.filter(a=>!sameId(a.id,targetId));
      toast('Activity deleted');closeModal();renderActivity();
    } else if(modalMode==='activity'){
      const row=await dbInsert('activities',{date:g('f-date'),rep:g('f-rep'),customer:g('f-cust'),company:g('f-company'),type:g('f-type'),purpose:g('f-purpose'),mins:parseInt(g('f-mins'))||0,followup:g('f-fu'),fudate:g('f-fudate')||null,outcome:g('f-outcome')});
      activities.unshift(row);toast('Activity logged');closeModal();renderActivity();
    } else if(modalMode==='wipAdd'){
      const depPaid=document.getElementById('f-deppaid').value==='true';
      const paidFull=document.getElementById('f-paidfull').value==='true';
      const row=await dbInsert('wip_jobs',{job_number:g('f-jobnum')||null,status:g('f-wip-status'),customer:g('f-cust'),nature_of_job:g('f-nature'),delivery_date:g('f-delivery')||null,quote_number:g('f-quote')||null,sales_order:g('f-so')||null,invoice:g('f-invoice')||null,total_amount:parseFloat(g('f-total'))||0,deposit_amount:parseFloat(g('f-dep'))||0,expected_deposit_date:g('f-depdate')||null,deposit_paid:depPaid,expected_payment_date:g('f-paydate')||null,paid_full:paidFull,staff_notes:g('f-staffnotes')||null,labour_hours_allocated:parseFloat(g('f-labour-hours'))||null});
      const tasks=wipStaffRows.filter(r=>r.name.trim());
      if(tasks.length){await sb.from('wip_staff_tasks').insert(tasks.map(r=>({job_id:row.id,staff_name:r.name,task:r.task,completed:r.completed})));}
      row.wip_staff_tasks=tasks.map(r=>({staff_name:r.name,task:r.task,completed:r.completed}));
      wipJobs.unshift(row);toast('Job added');closeModal();renderWIP();
    } else if(modalMode==='wipEdit'){
      const depPaid=document.getElementById('f-deppaid').value==='true';
      const paidFull=document.getElementById('f-paidfull').value==='true';
      const updates={job_number:g('f-jobnum')||null,status:g('f-wip-status'),customer:g('f-cust'),nature_of_job:g('f-nature'),delivery_date:g('f-delivery')||null,quote_number:g('f-quote')||null,sales_order:g('f-so')||null,invoice:g('f-invoice')||null,total_amount:parseFloat(g('f-total'))||0,deposit_amount:parseFloat(g('f-dep'))||0,expected_deposit_date:g('f-depdate')||null,deposit_paid:depPaid,expected_payment_date:g('f-paydate')||null,paid_full:paidFull,staff_notes:g('f-staffnotes')||null,labour_hours_allocated:parseFloat(g('f-labour-hours'))||null};
      await dbUpdate('wip_jobs',targetId,updates);
      await sb.from('wip_staff_tasks').delete().eq('job_id',targetId);
      const tasks=wipStaffRows.filter(r=>r.name.trim());
      if(tasks.length){await sb.from('wip_staff_tasks').insert(tasks.map(r=>({job_id:targetId,staff_name:r.name,task:r.task,completed:r.completed})));}
      const j=wipJobs.find(x=>x.id===targetId);Object.assign(j,updates);
      j.wip_staff_tasks=tasks.map(r=>({staff_name:r.name,task:r.task,completed:r.completed}));
      toast('Job updated');closeModal();renderWIP();
    } else if(modalMode==='wipDelete'){
      await sb.from('wip_staff_tasks').delete().eq('job_id',targetId);
      await dbDelete('wip_jobs',targetId);
      wipJobs=wipJobs.filter(j=>j.id!==targetId);
      toast('Job removed');closeModal();renderWIP();
    } else if(modalMode==='perfAdd'){
      const member=document.getElementById('f-perf-member')?.value||'';
      const jobId=document.getElementById('f-perf-job')?.value||'';
      const date=document.getElementById('f-perf-date')?.value||today();
      const hoursUsed=parseFloat(document.getElementById('f-perf-hours')?.value)||0;
      const notes=document.getElementById('f-perf-notes')?.value||null;
      if(!member){toast('Select a team member','err');return;}
      if(!jobId){toast('Select a WIP job','err');return;}
      if(!hoursUsed||hoursUsed<=0){toast('Enter hours used','err');return;}
      const row=await dbInsert('performance_timesheets',{team_member_name:member,job_id:jobId,date,hours_used:hoursUsed,notes});
      performanceTimesheets.unshift(row);
      toast('Hours logged');closeModal();renderPerformance();
    } else if(modalMode==='perfEdit'){
      const member=document.getElementById('f-perf-member')?.value||'';
      const jobId=document.getElementById('f-perf-job')?.value||'';
      const date=document.getElementById('f-perf-date')?.value||today();
      const hoursUsed=parseFloat(document.getElementById('f-perf-hours')?.value)||0;
      const notes=document.getElementById('f-perf-notes')?.value||null;
      if(!member){toast('Select a team member','err');return;}
      if(!jobId){toast('Select a WIP job','err');return;}
      if(!hoursUsed||hoursUsed<=0){toast('Enter hours used','err');return;}
      const updates={team_member_name:member,job_id:jobId,date,hours_used:hoursUsed,notes};
      await dbUpdate('performance_timesheets',targetId,updates);
      const e=performanceTimesheets.find(x=>x.id===targetId);Object.assign(e,updates);
      toast('Entry updated');closeModal();renderPerformance();
    } else if(modalMode==='perfDelete'){
      await dbDelete('performance_timesheets',targetId);
      performanceTimesheets=performanceTimesheets.filter(e=>e.id!==targetId);
      toast('Entry deleted');closeModal();renderPerformance();
    } else if(modalMode==='kpiAdd'){
      const userId=document.getElementById('f-kpi-user')?.value||'';
      const user=users.find(u=>String(u.id)===String(userId));
      const roleName=document.getElementById('f-kpi-role')?.value||KPI_ROLES[0];
      const monthKey=document.getElementById('f-kpi-month')?.value||currentMonthKey();
      const reviewer=document.getElementById('f-kpi-reviewer')?.value||currentUser?.name||'';
      const comments=document.getElementById('f-kpi-comments')?.value||null;
      const scores=collectKpiScores();
      if(!user){saveBtn.disabled=false;toast('Select a user','err');return;}
      if(scores.some(s=>!s.score||s.score<1||s.score>5)){saveBtn.disabled=false;toast('Score every KPI from 1 to 5','err');return;}
      const finalScore=Number(kpiScorePercent(scores).toFixed(2));
      const row=await dbInsert('kpi_scorecards',{user_id:user.id,employee_name:user.name,role_name:roleName,month_key:monthKey,reviewer,scores,final_score:finalScore,comments,created_by:currentUser?.name||null});
      kpiScorecards.unshift(row);
      toast('KPI scorecard saved');closeModal();renderPerformance();
    } else if(modalMode==='kpiEdit'){
      const userId=document.getElementById('f-kpi-user')?.value||'';
      const user=users.find(u=>String(u.id)===String(userId));
      const roleName=document.getElementById('f-kpi-role')?.value||KPI_ROLES[0];
      const monthKey=document.getElementById('f-kpi-month')?.value||currentMonthKey();
      const reviewer=document.getElementById('f-kpi-reviewer')?.value||currentUser?.name||'';
      const comments=document.getElementById('f-kpi-comments')?.value||null;
      const scores=collectKpiScores();
      if(!user){saveBtn.disabled=false;toast('Select a user','err');return;}
      if(scores.some(s=>!s.score||s.score<1||s.score>5)){saveBtn.disabled=false;toast('Score every KPI from 1 to 5','err');return;}
      const finalScore=Number(kpiScorePercent(scores).toFixed(2));
      const updates={user_id:user.id,employee_name:user.name,role_name:roleName,month_key:monthKey,reviewer,scores,final_score:finalScore,comments};
      await dbUpdate('kpi_scorecards',targetId,updates);
      const rec=kpiScorecards.find(x=>x.id===targetId);Object.assign(rec,updates);
      toast('KPI scorecard updated');closeModal();renderPerformance();
    } else if(modalMode==='kpiDelete'){
      await dbDelete('kpi_scorecards',targetId);
      kpiScorecards=kpiScorecards.filter(x=>x.id!==targetId);
      toast('KPI scorecard deleted');closeModal();renderPerformance();
    } else if(modalMode==='plannerAdd'){
      const staffName=document.getElementById('f-planner-staff')?.value||'';
      const dayIdx=parseInt(document.getElementById('f-planner-day')?.value)||0;
      const ws=document.getElementById('f-planner-ws')?.value||getMondayOf(today());
      if(isRep()&&!isOwnPlannerName(staffName)){toast('You can only add tasks to your own planner','err');return;}
      const validRows=plannerTaskRows.filter(r=>r.type==='wip'?r.jobId:r.custom.trim());
      if(!validRows.length){toast('Add at least one task','err');return;}
      const locked=isAdmin()&&!!document.getElementById('f-planner-locked')?.checked;
      const existing=sortByManualOrder(plannerEntries.filter(e=>e.week_start===ws&&e.staff_name===staffName&&Number(e.day_index)===dayIdx));
      let nextOrder=nextSortOrder(existing);
      for(const r of validRows){
        const row=await dbInsert('team_planner',{week_start:ws,staff_name:staffName,day_index:dayIdx,job_id:r.type==='wip'?(r.jobId||null):null,custom_task:r.type==='custom'?(r.custom||null):null,notes:r.notes||null,completed:false,locked_by_admin:locked,sort_order:nextOrder});
        nextOrder+=1000;
        plannerEntries.push(row);
      }
      toast(validRows.length===1?'Task added':`${validRows.length} tasks added`);closeModal();renderPlanner();
    } else if(modalMode==='plannerEdit'){
      const e=plannerEntries.find(x=>x.id===targetId);
      if(!canModifyPlannerEntry(e)){toast('This task is locked by admin','err');return;}
      const type=document.getElementById('f-planner-type')?.value||'wip';
      const jobId=type==='wip'?(document.getElementById('f-planner-job')?.value||null):null;
      const customTask=type==='custom'?(document.getElementById('f-planner-custom')?.value||null):null;
      const notes=document.getElementById('f-planner-notes')?.value||null;
      const updates={job_id:jobId||null,custom_task:customTask||null,notes:notes||null};
      if(isAdmin())updates.locked_by_admin=!!document.getElementById('f-planner-locked')?.checked;
      await dbUpdate('team_planner',targetId,updates);Object.assign(e,updates);
      toast('Entry updated');closeModal();renderPlanner();
    }
  }catch(e){toast('Save failed: '+e.message,'err');console.error(e);}
  saveBtn.disabled=false;
}

function closeModal(){document.getElementById('modal-overlay').classList.remove('open');document.getElementById('modal-save-btn').style.cssText='';}
function closeMO(e){if(e.target===document.getElementById('modal-overlay'))closeModal();}

function exposeLegacyGlobals(){
  Object.assign(window,{
    doLogin,doLogout,switchTab,openModal,closeModal,closeMO,saveModal,autoProb,
    saveAdminStartPage,
    renderDashboard,renderDeals,renderForecast,renderForecastCards,renderEOD,renderConversion,renderActivity,renderPipeline,renderWIP,renderCashflow,renderPlanner,renderPerformance,renderKpiModalRows,updateKpiPreview,
    handleUpload,removeQuote,repSubmitFC,adminSaveFC,adminUnlockFC,downloadPDF,downloadAllPDFs,downloadCashflowPDF,downloadPlannerPDF,downloadPerformancePDF,downloadKpiScorecardPDF,
    setCFRange,setTPRange,clearWIPFilters,completeWIPJob,startWIPDrag,allowWIPDrop,dropWIPJob,
    addWIPStaffRow,removeWIPStaffRow,addTeamMember,removeTeamMember,plannerPrevWeek,plannerNextWeek,plannerThisWeek,startPlannerDrag,allowPlannerDrop,dropPlannerEntry,addPlannerTaskRow,removePlannerTaskRow,deletePlannerEntry,togglePlannerEntry
  });
  [
    ['wipStaffRows',()=>wipStaffRows,v=>{wipStaffRows=v;}],
    ['plannerTaskRows',()=>plannerTaskRows,v=>{plannerTaskRows=v;}],
    ['performanceMode',()=>performanceMode,v=>{performanceMode=v;}]
  ].forEach(([name,get,set])=>{
    try{Object.defineProperty(window,name,{get,set,configurable:true});}catch(e){}
  });
}

exposeLegacyGlobals();
restoreSession();
