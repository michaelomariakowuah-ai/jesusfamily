const CFG=window.SITE_CONFIG,$=id=>document.getElementById(id);
const sb=supabase.createClient(CFG.supabaseUrl,CFG.supabaseKey);
const mk=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const DEF={site:{tagline:"To empower children in Jesus Christ.",verse:"“Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these.” — Matthew 19:14",about:"Jesus Family is a church family devoted to loving, teaching and empowering children in Jesus Christ. Log in as admin to write your own story here.",contact:""},
 founder:{name:"Our Founder",title:"Founder",bio:"Write about our founder here.",photo:""},
 pay:{text:"Mobile Money | Add your number and account name\nBank Transfer | Add bank, account name and number"}};
let S=JSON.parse(JSON.stringify(DEF)),G=[],SM=[],EV=[],MN=[],admin=false;
const VIEWS=["home","founder","ministers","sermons","events","gallery","prayer","give"];
function view(){const h=(location.hash||"#home").slice(1),v=VIEWS.includes(h)?h:"home";
 document.querySelectorAll(".view").forEach(e=>e.classList.toggle("on",e.id==="v-"+v));
 document.querySelectorAll("#links a").forEach(a=>a.classList.toggle("on",a.hash==="#"+v));scrollTo(0,0)}
addEventListener("hashchange",view);
const xbtn=(table,row)=>{const b=mk("button","x","✕");b.onclick=()=>del(table,row);return b};
async function del(table,row){if(!confirm("Delete this?"))return;
 if(row.path)await sb.storage.from("media").remove([row.path]);
 const{error}=await sb.from(table).delete().eq("id",row.id);if(error)alert(error.message);else load()}
function media(x,tag){const m=document.createElement(tag);m.src=x.url;if(tag!=="img"){m.controls=true;m.preload="metadata"}else{m.loading="lazy";m.alt=x.caption||""}return m}
function render(){
 $("tagline").textContent=S.site.tagline;$("verse").textContent=S.site.verse;$("about").textContent=S.site.about;$("contact").textContent=S.site.contact||"";
 $("f-name").textContent=S.founder.name;$("f-title").textContent=S.founder.title;$("f-bio").textContent=S.founder.bio;
 const fp=$("f-photo");fp.textContent="";
 if(S.founder.photo){const im=new Image();im.src=S.founder.photo;im.alt=S.founder.name;fp.append(im)}else fp.append(mk("div","ph","Founder photo — upload from Admin"));
 const g=$("grid");g.textContent="";if(!G.length)g.append(mk("p","txt","No pictures or videos yet."));
 G.forEach(x=>{const d=mk("div","item");d.append(media(x,x.kind==="video"?"video":"img"));if(x.caption)d.append(mk("p","",x.caption));if(admin)d.append(xbtn("gallery",x));g.append(d)});
 const s=$("sgrid");s.textContent="";if(!SM.length)s.append(mk("p","txt","No sermons posted yet."));
 SM.forEach(x=>{const d=mk("div","item");if(x.url)d.append(media(x,x.kind==="audio"?"audio":"video"));
  const b=mk("div","bd");b.append(mk("h3","",x.title),mk("small","",[x.preacher,x.date].filter(Boolean).join(" · ")));if(x.notes)b.append(mk("div","",x.notes));
  if(x.link&&/^https?:\/\//.test(x.link)){const a=mk("a","","Watch / listen →");a.href=x.link;a.target="_blank";a.rel="noopener";b.append(a)}
  d.append(b);if(admin)d.append(xbtn("sermons",x));s.append(d)});
 const m=$("mgrid");m.textContent="";if(!MN.length)m.append(mk("p","txt","No ministers added yet."));
 MN.forEach(x=>{const d=mk("div","item mc");if(x.url)d.append(media({url:x.url,caption:x.name},"img"));else d.append(mk("div","ph","No photo"));
  const b=mk("div","bd");b.append(mk("h3","",x.name),mk("small","",x.title||""));if(x.bio)b.append(mk("div","",x.bio));d.append(b);if(admin)d.append(xbtn("ministers",x));m.append(d)});
 const l=$("elist");l.textContent="";if(!EV.length)l.append(mk("p","txt","No events yet. Check back soon."));
 EV.forEach(x=>{const d=mk("div","item ev"),dt=mk("div","dt"),D=x.date?new Date(x.date+"T12:00:00"):null;
  dt.append(mk("b","",D?D.getDate():"•"),document.createTextNode(D?D.toLocaleString("en",{month:"short",year:"numeric"}):"TBA"));
  const b=mk("div","bd");b.append(mk("h3","",x.title),mk("small","",[x.time,x.place].filter(Boolean).join(" · ")));if(x.descr)b.append(mk("div","",x.descr));
  d.append(dt,b);if(admin)d.append(xbtn("events",x));l.append(d)});
 const p=$("pay");p.textContent="";(S.pay.text||"").split("\n").filter(Boolean).forEach(l=>{const[a,...b]=l.split("|"),d=mk("div"),t=mk("b","",a.trim());d.append(t,document.createTextNode(b.join("|").trim()));p.append(d)});
}
function fill(){$("e-tag").value=S.site.tagline;$("e-verse").value=S.site.verse;$("e-about").value=S.site.about;$("e-contact").value=S.site.contact||"";
 $("e-fname").value=S.founder.name;$("e-ftitle").value=S.founder.title;$("e-fbio").value=S.founder.bio;$("e-pay").value=S.pay.text}
async function load(){
 const[st,g,sm,ev,mn]=await Promise.all([sb.from("settings").select("*"),sb.from("gallery").select("*").order("created_at",{ascending:false}),
  sb.from("sermons").select("*").order("created_at",{ascending:false}),sb.from("events").select("*").order("date",{ascending:true,nullsFirst:false}),sb.from("ministers").select("*").order("created_at",{ascending:true})]);
 (st.data||[]).forEach(r=>{if(DEF[r.key])S[r.key]={...DEF[r.key],...r.value}});
 G=g.data||[];SM=sm.data||[];MN=mn.data||[];EV=ev.data||[];render();if(!document.body.classList.contains("edit"))fill();
 if(admin)loadAdmin()}
async function loadAdmin(){
 const[d,p]=await Promise.all([sb.from("donations").select("*").order("created_at",{ascending:false}),sb.from("prayers").select("*").order("created_at",{ascending:false})]);
 const a=$("dlist");a.textContent="";(d.data||[]).forEach(x=>a.append(mk("div","",`${new Date(x.created_at).toLocaleDateString()} — ${x.name}: ${x.amount} (${x.purpose})${x.note?" — "+x.note:""}`)));if(!(d.data||[]).length)a.textContent="None yet.";
 const b=$("plist");b.textContent="";(p.data||[]).forEach(x=>b.append(mk("div","",`${new Date(x.created_at).toLocaleDateString()} — ${x.name}: ${x.request}\n`)));if(!(p.data||[]).length)b.textContent="None yet."}
async function upload(file,folder){const path=folder+"/"+Date.now()+"-"+file.name.replace(/[^\w.]+/g,"_");
 const{error}=await sb.storage.from("media").upload(path,file,{contentType:file.type});if(error)throw error;
 return{path,url:sb.storage.from("media").getPublicUrl(path).data.publicUrl}}
async function setKey(key,value){const{error}=await sb.from("settings").upsert({key,value});if(error)throw error}
const ins=async(t,row)=>{const{error}=await sb.from(t).insert(row);if(error)throw error};
document.querySelectorAll("[data-save]").forEach(b=>b.onclick=async()=>{const k=b.dataset.save;try{
 if(k==="site")await setKey("site",{tagline:$("e-tag").value,verse:$("e-verse").value,about:$("e-about").value,contact:$("e-contact").value});
 if(k==="pay")await setKey("pay",{text:$("e-pay").value});
 if(k==="founder"){let photo=S.founder.photo;const f=$("e-fphoto").files[0];if(f){$("fmsg").textContent="Uploading photo…";photo=(await upload(f,"founder")).url}
  await setKey("founder",{name:$("e-fname").value,title:$("e-ftitle").value,bio:$("e-fbio").value,photo});$("fmsg").textContent="Saved ✓"}
 await load();b.textContent="Saved ✓";setTimeout(()=>b.textContent="Save",1500)}catch(e){alert("Could not save: "+e.message)}});
$("up").onclick=async()=>{const fs=[...$("e-files").files];if(!fs.length){$("msg").textContent="Choose files first.";return}
 try{for(let i=0;i<fs.length;i++){$("msg").textContent=`Uploading ${i+1} of ${fs.length}…`;const f=fs[i],u=await upload(f,"gallery");
  await ins("gallery",{kind:f.type.startsWith("video")?"video":"image",url:u.url,path:u.path,caption:$("e-cap").value})}
  $("msg").textContent="Uploaded ✓";$("e-files").value="";$("e-cap").value="";load()}catch(e){$("msg").textContent="Failed: "+e.message}};
$("s-add").onclick=async()=>{const t=$("s-title").value.trim();if(!t){$("s-msg").textContent="Add a title.";return}
 try{let u={url:"",path:"",kind:""};const f=$("s-file").files[0];if(f){$("s-msg").textContent="Uploading…";u={...await upload(f,"sermons"),kind:f.type.startsWith("audio")?"audio":"video"}}
  await ins("sermons",{title:t,preacher:$("s-by").value,date:$("s-date").value,link:$("s-link").value,notes:$("s-notes").value,...u});
  $("s-msg").textContent="Posted ✓";["s-title","s-by","s-date","s-link","s-notes","s-file"].forEach(i=>$(i).value="");load()}catch(e){$("s-msg").textContent="Failed: "+e.message}};
$("e-add").onclick=async()=>{const t=$("e-title").value.trim();if(!t){$("e-msg").textContent="Add an event name.";return}
 try{await ins("events",{title:t,date:$("e-date").value||null,time:$("e-time").value,place:$("e-place").value,descr:$("e-desc").value});
  $("e-msg").textContent="Added ✓";["e-title","e-date","e-time","e-place","e-desc"].forEach(i=>$(i).value="");load()}catch(e){$("e-msg").textContent="Failed: "+e.message}};
$("m-add").onclick=async()=>{const n=$("m-name").value.trim();if(!n){$("m-msg").textContent="Add a name.";return}
 try{let u={url:"",path:""};const f=$("m-photo").files[0];if(f){$("m-msg").textContent="Uploading photo…";u=await upload(f,"ministers")}
  await ins("ministers",{name:n,title:$("m-title").value,bio:$("m-bio").value,...u});
  $("m-msg").textContent="Added ✓";["m-name","m-title","m-bio","m-photo"].forEach(i=>$(i).value="");load()}catch(e){$("m-msg").textContent="Failed: "+e.message}};
$("p-go").onclick=async()=>{const r=$("p-req").value.trim();if(!r){$("p-msg").textContent="Please write your request.";return}
 try{await ins("prayers",{name:$("p-name").value.trim()||"Anonymous",request:r});$("p-msg").textContent="Your request has been received. We are praying with you. 🙏";$("p-req").value=$("p-name").value=""}catch(e){$("p-msg").textContent="Could not send: "+e.message}};
$("d-go").onclick=async()=>{const n=$("d-name").value.trim(),a=parseFloat($("d-amt").value);if(!n||!(a>0)){$("d-msg").textContent="Please enter your name and amount.";return}
 try{await ins("donations",{name:n,amount:a,purpose:$("d-for").value,note:$("d-note").value});$("d-msg").textContent="Thank you, "+n+"! God bless you. 🙏";$("d-name").value=$("d-amt").value=$("d-note").value=""}catch(e){$("d-msg").textContent="Could not record: "+e.message}};
function setAdmin(s){admin=!!s;$("out").style.display=admin?"block":"none";
 $("bar").textContent=admin?(document.body.classList.contains("edit")?"✓ Done":"✎ Admin"):"🔒 Admin";if(!admin)document.body.classList.remove("edit");render();if(admin)loadAdmin()}
$("bar").onclick=()=>{if(!admin){$("login").style.display="grid";return}document.body.classList.toggle("edit");setAdmin(true);fill()};
$("out").onclick=()=>sb.auth.signOut();
$("l-x").onclick=()=>$("login").style.display="none";
$("l-go").onclick=async()=>{const{error}=await sb.auth.signInWithPassword({email:$("l-email").value.trim(),password:$("l-pass").value});
 if(error){$("l-msg").textContent=error.message;return}$("login").style.display="none";$("l-pass").value="";document.body.classList.add("edit");setAdmin(true);fill()};
sb.auth.onAuthStateChange((_e,s)=>setAdmin(s));
view();render();fill();load().catch(()=>{});
