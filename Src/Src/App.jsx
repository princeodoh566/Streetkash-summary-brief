import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ── GLOBAL STYLES ────────────────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --gold:#F5C842;--g2:#E8A820;--dark:#06080F;--text:#EFF3FF;
  --m:#3A4560;--m2:#68768F;--green:#0CFFAA;--or:#FF6535;
  --bl:#4DAAFF;--pu:#B06FFF;--pk:#FF5090;--card:#0D1220;
}
html,body{background:var(--dark);font-family:'Space Grotesk',sans-serif;color:var(--text);overflow-x:hidden}
.grain{position:fixed;inset:0;z-index:998;pointer-events:none;opacity:.025;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:180px}
.dotgrid{position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:radial-gradient(circle,rgba(255,255,255,.07) 1px,transparent 1px);
  background-size:28px 28px}
.aurora{position:fixed;inset:0;overflow:hidden;z-index:1;pointer-events:none}
.orb{position:absolute;border-radius:50%;filter:blur(100px)}
@keyframes d1{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(45px,-55px) scale(1.1)}80%{transform:translate(-35px,25px) scale(.95)}}
@keyframes d2{0%,100%{transform:translate(0,0)}35%{transform:translate(-55px,35px)}70%{transform:translate(30px,-45px)}}
@keyframes d3{0%,100%{transform:translate(0,0)}50%{transform:translate(35px,45px) scale(1.08)}}
.glass{background:rgba(255,255,255,.038);backdrop-filter:blur(28px) saturate(180%);-webkit-backdrop-filter:blur(28px) saturate(180%);border:1px solid rgba(255,255,255,.08);border-radius:20px;position:relative;overflow:hidden}
.glass::before{content:'';position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(180deg,rgba(255,255,255,.05) 0%,transparent 100%);pointer-events:none;border-radius:20px 20px 0 0}
@keyframes holo{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.holo{background:linear-gradient(90deg,#F5C842,#FF6535,#FF5090,#B06FFF,#4DAAFF,#0CFFAA,#F5C842);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:holo 5s linear infinite}
.holo-ring{position:absolute;inset:-2px;border-radius:inherit;background:linear-gradient(90deg,#F5C842,#FF6535,#FF5090,#B06FFF,#4DAAFF,#0CFFAA,#F5C842);background-size:300% 100%;animation:holo 3s linear infinite;z-index:0}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.82)}to{opacity:1;transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes ring{0%{transform:scale(1);opacity:.65}100%{transform:scale(2.4);opacity:0}}
@keyframes slideR{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
@keyframes countIn{from{opacity:0;transform:scale(.6) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes prog-shine{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}
@keyframes pop{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes fall{from{transform:translateY(-16px) rotate(0);opacity:1}to{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes glow-pulse{0%,100%{opacity:.5}50%{opacity:1}}
.au{animation:fadeUp .55s cubic-bezier(.16,1,.3,1) forwards;opacity:0}
.as{animation:scaleIn .5s cubic-bezier(.34,1.56,.64,1) forwards;opacity:0}
.btn{width:100%;padding:16px 28px;border:none;border-radius:16px;font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:700;cursor:pointer;position:relative;overflow:hidden;background:linear-gradient(135deg,#F5C842,#E8A820);color:#07090E;transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .25s;letter-spacing:.2px}
.btn::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.28),transparent);pointer-events:none}
.btn:hover:not(:disabled){transform:translateY(-3px) scale(1.015);box-shadow:0 16px 48px rgba(245,200,66,.5),0 4px 16px rgba(0,0,0,.3)}
.btn:active:not(:disabled){transform:scale(.98)}
.btn:disabled{opacity:.35;cursor:not-allowed;transform:none}
.btn-gr{background:linear-gradient(135deg,#0CFFAA,#07D088);color:#040C18}
.btn-gr:hover:not(:disabled){box-shadow:0 16px 48px rgba(12,255,170,.42)}
.btn-pu{background:linear-gradient(135deg,#B06FFF,#7B3FCC);color:#fff}
.btn-pu:hover:not(:disabled){box-shadow:0 16px 48px rgba(176,111,255,.42)}
.ghost{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);color:var(--m2);border-radius:12px;padding:9px 16px;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;backdrop-filter:blur(12px)}
.ghost:hover{border-color:rgba(245,200,66,.4);color:var(--gold);background:rgba(245,200,66,.06)}
.pt{height:5px;border-radius:99px;background:rgba(255,255,255,.06);overflow:hidden;position:relative}
.pf{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--gold),var(--or));transition:width .1s linear;position:relative;overflow:hidden}
.pf::after{content:'';position:absolute;top:0;bottom:0;width:35%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent);animation:prog-shine 1.4s linear infinite}
.tab{padding:8px 16px;border-radius:99px;border:none;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;transition:all .25s cubic-bezier(.16,1,.3,1)}
.ton{background:rgba(245,200,66,.11);color:var(--gold);border:1px solid rgba(245,200,66,.28)}
.toff{background:transparent;color:var(--m2);border:1px solid transparent}
.toff:hover{color:var(--text);background:rgba(255,255,255,.04)}
input,select{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;color:var(--text);font-family:'Space Grotesk',sans-serif;font-size:14px;padding:12px 16px;width:100%;outline:none;transition:border-color .2s}
input:focus,select:focus{border-color:rgba(245,200,66,.4)}
select option{background:#0D1220;color:var(--text)}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:99px}
`;

// ── DATA ─────────────────────────────────────────────────────────────────
const ADS = [
  {id:1,brand:"GTBank Nigeria",line:"Open an account in 5 minutes",c:"#FF6000",bg:"rgba(255,96,0,.07)",e:"🏦",tag:"Banking",views:1420,spent:142000},
  {id:2,brand:"Airtel Nigeria",line:"Unlimited data for all Nigerians",c:"#FF0000",bg:"rgba(255,0,0,.07)",e:"📶",tag:"Telecom",views:2100,spent:210000},
  {id:3,brand:"Dangote Sugar",line:"Made in Nigeria, for Nigeria",c:"#FF3C3C",bg:"rgba(255,60,60,.07)",e:"🏭",tag:"FMCG",views:980,spent:98000},
  {id:4,brand:"Konga.com",line:"Shop smarter, deliver faster",c:"#FF8C00",bg:"rgba(255,140,0,.07)",e:"📦",tag:"E-Commerce",views:1750,spent:175000},
];
const HIST = [
  {d:"Today, 8:42 AM",ad:"GTBank Nigeria",c:"#FF6000",e:"🏦"},
  {d:"Yesterday, 7:15 PM",ad:"Airtel Nigeria",c:"#FF0000",e:"📶"},
  {d:"Mar 5, 6:30 PM",ad:"Konga.com",c:"#FF8C00",e:"📦"},
  {d:"Mar 4, 9:00 AM",ad:"Dangote Sugar",c:"#FF3C3C",e:"🏭"},
  {d:"Mar 3, 5:45 PM",ad:"GTBank Nigeria",c:"#FF6000",e:"🏦"},
];
const POLES = [
  {id:"#007",loc:"Owerri Road Jct",users:340,status:"live",uptime:"99.2%"},
  {id:"#012",loc:"Umuahia Market",users:410,status:"live",uptime:"98.7%"},
  {id:"#003",loc:"Aba Road Bus Stop",users:290,status:"live",uptime:"97.1%"},
  {id:"#019",loc:"Abia State Univ Gate",users:520,status:"live",uptime:"99.8%"},
];
const ANALYTICS = [
  {day:"Mon",users:280,revenue:28000,data:560},
  {day:"Tue",users:310,revenue:31000,data:620},
  {day:"Wed",users:295,revenue:29500,data:590},
  {day:"Thu",users:340,revenue:34000,data:680},
  {day:"Fri",users:410,revenue:41000,data:820},
  {day:"Sat",users:390,revenue:39000,data:780},
  {day:"Sun",users:360,revenue:36000,data:720},
];

// ── SHARED COMPONENTS ────────────────────────────────────────────────────
function Aurora() {
  return (
    <div className="aurora">
      {[
        {w:520,h:520,t:"-8%",l:"-6%",bg:"radial-gradient(circle,rgba(245,200,66,.22) 0%,transparent 65%)",a:"d1 15s ease-in-out infinite"},
        {w:580,h:420,t:"32%",r:"-12%",bg:"radial-gradient(circle,rgba(176,111,255,.18) 0%,transparent 65%)",a:"d2 12s ease-in-out infinite"},
        {w:440,h:440,b:"-8%",l:"22%",bg:"radial-gradient(circle,rgba(12,255,170,.14) 0%,transparent 65%)",a:"d3 14s ease-in-out infinite"},
      ].map((o,i) => (
        <div key={i} className="orb" style={{width:o.w,height:o.h,top:o.t,left:o.l,right:o.r,bottom:o.b,background:o.bg,animation:o.a}}/>
      ))}
    </div>
  );
}
const Grain = () => <div className="grain"/>;
const DotGrid = () => <div className="dotgrid"/>;
function Spin({s=22,c="var(--gold)"}) {
  return <div style={{width:s,height:s,borderRadius:"50%",border:`2.5px solid rgba(255,255,255,.08)`,borderTopColor:c,animation:"spin .75s linear infinite",flexShrink:0}}/>;
}
function GlowDot({c="var(--green)"}) {
  return <span style={{width:7,height:7,borderRadius:"50%",background:c,display:"inline-block",boxShadow:`0 0 10px ${c}`,animation:"glow-pulse 2s ease-in-out infinite"}}/>;
}
function HoloBorder({children,r=22,innerBg="#0C1220"}) {
  return (
    <div style={{position:"relative",borderRadius:r}}>
      <div className="holo-ring" style={{borderRadius:r+2}}/>
      <div style={{position:"relative",zIndex:1,background:innerBg,borderRadius:r-1}}>
        {children}
      </div>
    </div>
  );
}
function Confetti() {
  const ps = useRef([...Array(36)].map((_,i) => ({
    x:Math.random()*100,dur:1.6+Math.random()*2.2,del:Math.random()*.9,
    c:["#F5C842","#FF6535","#FF5090","#B06FFF","#4DAAFF","#0CFFAA"][i%6],
    sz:3+Math.random()*7,sh:Math.random()>.5?"50%":"4px"
  })));
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:100,overflow:"hidden"}}>
      {ps.current.map((p,i) => (
        <div key={i} style={{position:"absolute",top:-20,left:`${p.x}%`,width:p.sz,height:p.sz,background:p.c,borderRadius:p.sh,animation:`fall ${p.dur}s ${p.del}s ease-in forwards`}}/>
      ))}
    </div>
  );
}
const CustomTooltip = ({active,payload,label}) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{background:"#0D1220",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,padding:"10px 14px"}}>
      <p style={{fontSize:11,color:"#68768F",marginBottom:5}}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{fontSize:12,color:p.color,fontWeight:600}}>{p.name}: {p.name==="Revenue"?"₦"+p.value.toLocaleString():p.value}</p>
      ))}
    </div>
  );
};

// ── MODE SELECTOR ────────────────────────────────────────────────────────
function ModeSelector({onSelect}) {
  return (
    <div style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 20px",zIndex:2}}>
      <style>{G}</style>
      <Aurora/><Grain/><DotGrid/>
      <div className="as" style={{textAlign:"center",marginBottom:52}}>
        <div style={{position:"relative",width:90,height:90,margin:"0 auto 22px"}}>
          <div style={{position:"absolute",inset:-16,borderRadius:"50%",border:"1px solid rgba(245,200,66,.22)",animation:"ring 2.8s ease-out infinite"}}/>
          <div style={{position:"absolute",inset:-8,borderRadius:"50%",border:"1px solid rgba(245,200,66,.12)",animation:"ring 2.8s .8s ease-out infinite"}}/>
          <div style={{width:90,height:90,borderRadius:"50%",background:"linear-gradient(135deg,#F5C842,#FF6535)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,boxShadow:"0 0 80px rgba(245,200,66,.5),inset 0 2px 6px rgba(255,255,255,.35)",animation:"float 3.8s ease-in-out infinite"}}>💡</div>
          <div style={{position:"absolute",bottom:-5,right:-5,width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#0CFFAA,#07D088)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,boxShadow:"0 0 14px rgba(12,255,170,.75)",border:"3px solid var(--dark)"}}>📶</div>
        </div>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:42,letterSpacing:"-1.5px",lineHeight:1}}><span className="holo">StreetKash</span></h1>
        <p style={{fontSize:11,color:"var(--m2)",marginTop:8,letterSpacing:"3px",textTransform:"uppercase"}}>Choose your experience</p>
      </div>
      <div style={{width:"100%",maxWidth:400,display:"flex",flexDirection:"column",gap:14}}>
        {[
          {mode:"user",icon:"👤",title:"I'm a User",desc:"Connect to free WiFi, watch ads, earn ₦20 + 2GB daily",c:"var(--gold)",bg:"rgba(245,200,66,.08)",border:"rgba(245,200,66,.2)"},
          {mode:"brand",icon:"🏢",title:"I'm a Brand",desc:"Run hyperlocal ads on StreetKash poles. Pay per 100% view.",c:"var(--pu)",bg:"rgba(176,111,255,.08)",border:"rgba(176,111,255,.2)"},
          {mode:"admin",icon:"⚙️",title:"Operator Dashboard",desc:"Monitor all poles, revenue, uptime and network health",c:"var(--green)",bg:"rgba(12,255,170,.08)",border:"rgba(12,255,170,.2)"},
        ].map(({mode,icon,title,desc,c,bg,border}) => (
          <div key={mode} className="glass" style={{padding:"26px",cursor:"pointer",transition:"transform .2s,border-color .2s"}}
            onClick={() => onSelect(mode)}
            onMouseEnter={e => {e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor=border;}}
            onMouseLeave={e => {e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor="rgba(255,255,255,.08)";}}>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <div style={{width:54,height:54,borderRadius:16,background:bg,border:`1px solid ${border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{icon}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,marginBottom:5}}>{title}</div>
                <div style={{fontSize:12,color:"var(--m2)",lineHeight:1.6}}>{desc}</div>
              </div>
              <span style={{fontSize:20,color:c}}>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CONNECT SCREEN ───────────────────────────────────────────────────────
function ConnectScreen({onConnect,onBack}) {
  const [ph,setPh] = useState("idle");
  const [phone,setPhone] = useState("");
  useEffect(() => {
    if (ph==="conn") {const t=setTimeout(() => onConnect(),2900);return () => clearTimeout(t);}
  },[ph]);
  return (
    <div style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 20px",zIndex:2}}>
      <Aurora/><Grain/><DotGrid/>
      <div style={{position:"absolute",top:20,left:20}}><button className="ghost" onClick={onBack}>← Back</button></div>
      <div className="as" style={{marginBottom:36,textAlign:"center"}}>
        <div style={{position:"relative",width:84,height:84,margin:"0 auto 18px"}}>
          <div style={{position:"absolute",inset:-14,borderRadius:"50%",border:"1px solid rgba(245,200,66,.22)",animation:"ring 2.8s ease-out infinite"}}/>
          <div style={{width:84,height:84,borderRadius:"50%",background:"linear-gradient(135deg,#F5C842,#FF6535)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,boxShadow:"0 0 60px rgba(245,200,66,.5)",animation:"float 3.8s ease-in-out infinite"}}>💡</div>
          <div style={{position:"absolute",bottom:-4,right:-4,width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#0CFFAA,#07D088)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,boxShadow:"0 0 14px rgba(12,255,170,.75)",border:"3px solid var(--dark)"}}>📶</div>
        </div>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:34,letterSpacing:"-1px"}}><span className="holo">StreetKash</span></h1>
        <p style={{fontSize:10,color:"var(--m2)",marginTop:6,letterSpacing:"3px",textTransform:"uppercase"}}>Free WiFi · Solar Powered</p>
      </div>
      <div className="glass au" style={{width:"100%",maxWidth:380,padding:"24px",marginBottom:16,animationDelay:".15s"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <div style={{width:46,height:46,borderRadius:13,background:"rgba(12,255,170,.06)",border:"1px solid rgba(12,255,170,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📡</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,marginBottom:3}}>StreetKash-Free</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}><GlowDot c="var(--green)"/><span style={{fontSize:11,color:"var(--green)",fontWeight:500}}>Live · Umuahia Pole #007</span></div>
          </div>
        </div>
        <div style={{marginBottom:18}}>
          <label style={{fontSize:11,color:"var(--m2)",display:"block",marginBottom:8,letterSpacing:1}}>YOUR PHONE NUMBER</label>
          <input placeholder="080XXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} maxLength={11}/>
          <p style={{fontSize:10,color:"var(--m2)",marginTop:6}}>Used to send your daily ₦20 reward</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18}}>
          {[["₦20","Daily Cash","var(--gold)"],["500MB","Fast Data","var(--bl)"],["1.5GB","Bonus Data","var(--green)"]].map(([v,l,c]) => (
            <div key={l} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:12,padding:"11px 6px",textAlign:"center"}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,color:c}}>{v}</div>
              <div style={{fontSize:10,color:"var(--m2)",marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
        {ph==="idle" && <button className="btn" onClick={() => setPh("conn")} disabled={phone.length<10}>Connect & Earn →</button>}
        {ph==="conn" && (
          <div style={{background:"rgba(245,200,66,.05)",border:"1px solid rgba(245,200,66,.14)",borderRadius:14,padding:"16px",textAlign:"center"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:6}}><Spin/><span style={{fontWeight:600,fontSize:14}}>Connecting to pole...</span></div>
            <div style={{fontSize:11,color:"var(--m2)"}}>Verifying your device identity</div>
          </div>
        )}
      </div>
      <p className="au" style={{animationDelay:".3s",fontSize:11,color:"var(--m)",textAlign:"center",maxWidth:300,lineHeight:1.85}}>Watch one 10-second ad to claim your daily reward. Free. Every day.</p>
    </div>
  );
}

// ── AD SCREEN ────────────────────────────────────────────────────────────
function AdScreen({onComplete}) {
  const [prog,setProg] = useState(0);
  const [started,setStarted] = useState(false);
  const [done,setDone] = useState(false);
  const [ad] = useState(() => ADS[Math.floor(Math.random()*ADS.length)]);
  const iv = useRef(null);
  const start = () => {
    setStarted(true);
    iv.current = setInterval(() => setProg(p => {
      if (p>=100){clearInterval(iv.current);setDone(true);return 100;}
      return p+1;
    }),100);
  };
  useEffect(() => () => clearInterval(iv.current),[]);
  const sec = Math.cei
