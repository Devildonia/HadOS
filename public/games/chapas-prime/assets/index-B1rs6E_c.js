(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Xe={halfWidth:27.2,halfLength:45.5,goalHalfWidth:9,goalDepth:4,wallRestitution:.55},Lt={fixedDt:1/120,maxFrameDt:.1,capLinearRetain:.02,ballLinearRetain:.45,restitutionCap:.35,restitutionBall:.62,sleepEps:.02,gravity:26},et={radius:1.62,height:.76,baseMass:1},ut={radius:.92,mass:.35,groundY:.92,trailSpeed:14},dn={blitzSeconds:90,goalToWin:3,goalFreezeSeconds:2,actionCooldown:.35},In={driveSpeed:21,steerK:.3,holdSeconds:1.3,autoSwitchNear:9,autoSwitchMargin:6},da={easy:{speed:1,reaction:1,lead:1,press:1,shootRange:1,accuracy:0,shootBias:.6,keeper:1},normal:{speed:1.06,reaction:.72,lead:1.25,press:1.3,shootRange:1.12,accuracy:.06,shootBias:.72,keeper:1.15},hard:{speed:1.13,reaction:.5,lead:1.5,press:1.55,shootRange:1.25,accuracy:.12,shootBias:.82,keeper:1.3}},js={attack:{name:"ATAQUE",support:1.35,depth:.4,speed:1.06},balanced:{name:"EQUILIBRIO",support:1,depth:.55,speed:1},defensive:{name:"DEFENSA",support:.7,depth:.72,speed:.97}},ft={chaseSpeed:18,supportSpeed:15.5,defendSpeed:16.5,steerK:.2,arriveRadius:8,sepRadius:4.4,sepStrength:10,leadTime:.3,supportAhead:16,supportLane:12,markSpread:9,carrierCooldown:.65,shootRange:26,tackleRange:8},Bt={speed:17,reactK:5,blend:.3,leadTime:.18,predictWindow:.6,catchRadius:et.radius+ut.radius+1.6,catchSpeed:15,holdRed:.45,holdBlue:1.3,clearMag:30,clearLift:9,clearSpread:.3},fn={slideTime:.45,lunge:24,glide:.5,stealRadius:et.radius+ut.radius+1.3,poke:13,carrierSlow:.22},Gt={capture:et.radius+ut.radius+.6,hold:et.radius+ut.radius+1.7,offset:et.radius+ut.radius+.15,release:.42,glue:.55,kickEps:14},zi={assistCone:.5,lead:.2,receiveAccuracy:.85,trapWindow:1.6},jt={maxMs:650,shotThreshold:.5,passMin:.72,passMax:1.25,shootMin:.82,shootMax:1.38},q={ball:0,perSide:5,get count(){return 1+this.perSide*2},blueStart:1,redStart:6};class kc{accumulator=0;last=0;started=!1;timeScale=1;alpha=0;tick(e){if(!this.started)return this.started=!0,this.last=e,0;let t=(e-this.last)/1e3;this.last=e,t>Lt.maxFrameDt&&(t=Lt.maxFrameDt),this.accumulator+=t*this.timeScale;let n=0;for(;this.accumulator>=Lt.fixedDt;)this.accumulator-=Lt.fixedDt,n++;return this.alpha=this.accumulator/Lt.fixedDt,n}}class Gc{map=new Map;on(e,t){const n=this.map.get(e)??[];n.push(t),this.map.set(e,n)}emit(e,t){const n=this.map.get(e);if(n)for(let s=0;s<n.length;s++){const r=n[s];r&&r(t)}}clear(){this.map.clear()}}class Fi{state;seed;constructor(e){this.seed=e>>>0,this.state=(this.seed||2654435769)>>>0}get internalState(){return this.state}set internalState(e){this.state=e>>>0}next(){let e=(this.state+=1831565813)>>>0;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}range(e,t){return e+(t-e)*this.next()}signed(e){return(this.next()*2-1)*e}int(e){return Math.floor(this.next()*e)%e}}function vs(){return(Date.now()^Date.now()>>>11^19088743)>>>0}const Sr={tagline:"BUTTON FOOTBALL · WORLD CUP EDITION",credit:"© HaDeS 2026",play:"▶  PLAY",lang:"LANGUAGE","coin.toss":"COIN TOSS","coin.wins":"{name} KICKOFF!","role.def":"DEF","role.mid":"MID","role.att":"ATT","role.gk.short":"GK","role.def.short":"DF","role.mid.short":"MC","role.att.short":"FW","controls.button":"CONTROLS","controls.title":"CONTROLS",mode:"MODE","mode.exhibition":"EXHIBITION","mode.tournament":"TOURNAMENT","mode.league":"MASTER LEAGUE","tournament.resume_prompt":"A saved tournament bracket is available.","tournament.fresh_prompt":"Start a new tournament bracket.","tournament.resume_saved":"CONTINUE SAVED TOURNAMENT","tournament.new":"START NEW TOURNAMENT","tournament.new_warning":"Starting a new tournament will overwrite the saved bracket.","tournament.new_confirm":"CONFIRM OVERWRITE","tournament.new_cancel":"CANCEL","team.pick":"YOUR TEAM",tactic:"TACTIC","tactic.attack":"ATTACK","tactic.balanced":"BALANCED","tactic.defensive":"DEFENSIVE","hint.touch":"JOYSTICK TO MOVE · ↺ SWITCH CAP","hint.desktop":"WASD MOVE · HOLD J PASS/SHOOT · K LOB · Q SWITCH · ESC PAUSE","stat.power":"POWER","stat.accuracy":"ACCURACY","stat.steal":"TACKLE","stat.power.short":"POW","stat.accuracy.short":"ACC","stat.steal.short":"TKL","act.pass":"PASS","act.tackle":"TACKLE","act.clear":"CLEAR","act.lob":"LOB","pause.eyebrow":"IN PLAY","pause.title":"PAUSED","pause.resume":"RESUME","pause.menu":"BACK TO MENU","fatal.eyebrow":"FATAL ERROR","fatal.title":"Something went wrong","fatal.sub":"Please reload the page to continue.","fatal.reload":"RELOAD PAGE","end.win":"VICTORY!","end.lose":"DEFEAT","end.draw":"DRAW","end.share":"SHARE GOLAZO","end.again":"PLAY AGAIN","end.change":"CHANGE TEAM / TACTIC","goal.you":"GOAL!","goal.rival":"THEY SCORE","cup.eyebrow":"CUP · KNOCKOUT","cup.results":"ROUND RESULTS","cup.your_match":"YOUR MATCH","cup.play":"PLAY MATCH","cup.next":"NEXT MATCH","cup.champion":"CHAMPION!","cup.eliminated":"ELIMINATED","cup.eliminated_sub":"End of the road: {round}","cup.back":"BACK TO MENU","round.r32":"ROUND OF 32","round.r16":"ROUND OF 16","round.r8":"QUARTER-FINALS","round.r4":"SEMI-FINALS","round.r2":"FINAL","league.eyebrow":"MASTER LEAGUE","league.matchday":"MATCHDAY {n} / {total}","league.results":"MATCHDAY RESULTS","league.standings":"STANDINGS","league.your_match":"YOUR MATCH","league.play":"PLAY MATCH","league.next":"NEXT MATCH","league.final_table":"FINAL STANDINGS","league.champion":"LEAGUE CHAMPION!","league.season":"SEASON OVER","league.back":"BACK TO MENU","league.resume_prompt":"A saved master league is available.","league.fresh_prompt":"Start a new master league season.","league.resume_saved":"CONTINUE SAVED SEASON","league.new":"START NEW LEAGUE","league.new_warning":"Starting a new league will overwrite the saved season.","league.new_confirm":"CONFIRM OVERWRITE","league.new_cancel":"CANCEL","table.team":"TEAM","table.played":"P","table.gd":"GD","table.pts":"PTS",vs:"VS","rpg.earned":"+{n} POINTS THIS MATCH","rpg.title":"UPGRADE YOUR TEAM","rpg.available":"Available points: {n}","rpg.cap":"Cap {n} · {class}","rpg.continue":"CONTINUE","replay.again":"REPLAY","replay.close":"CLOSE","replay.tag_last":"LAST-SECOND WINNER","replay.tag_distance":"FROM DISTANCE","replay.tag_strike":"WHAT A STRIKE","replay.speed":"{n} km/h","replay.distance":"{n} m",difficulty:"DIFFICULTY","diff.easy":"EASY","diff.normal":"NORMAL","diff.hard":"HARD","team.esp":"Spain","team.bra":"Brazil","team.ger":"Germany","team.jpn":"Japan","team.arg":"Argentina","team.fra":"France","team.ita":"Italy","team.eng":"England","team.por":"Portugal","team.ned":"Netherlands","team.bel":"Belgium","team.uru":"Uruguay","team.cro":"Croatia","team.mex":"Mexico","team.usa":"USA","team.kor":"Korea","team.sui":"Switzerland","team.sen":"Senegal","team.mar":"Morocco","team.col":"Colombia","team.den":"Denmark","team.pol":"Poland","team.swe":"Sweden","team.nor":"Norway","team.gha":"Ghana","team.nga":"Nigeria","team.egy":"Egypt","team.aus":"Australia","team.can":"Canada","team.ecu":"Ecuador","team.sco":"Scotland","team.tur":"Turkey","replay.skip":"Tap or press J to skip"},Hc={BASE_URL:"./"},Wl=[["en","English"],["es","Español"],["es-LA","Español (LatAm)"],["ca","Català"],["gl","Galego"],["pt-BR","Português (Brasil)"],["pt","Português"],["fr","Français"],["de","Deutsch"],["it","Italiano"],["nl","Nederlands"],["pl","Polski"],["ru","Русский"],["ja","日本語"],["ko","한국어"],["zh","中文"],["ar","العربية"],["bg","Български"],["cs","Čeština"],["da","Dansk"],["el","Ελληνικά"],["fi","Suomi"],["hi","हिन्दी"],["hr","Hrvatski"],["hu","Magyar"],["id","Bahasa Indonesia"],["ms","Bahasa Melayu"],["no","Norsk"],["ro","Română"],["sk","Slovenčina"],["sq","Shqip"],["sv","Svenska"],["th","ไทย"],["tr","Türkçe"],["uk","Українська"],["vi","Tiếng Việt"]],Xl="chapas-prime/lang";let Zs={},fa="en";function zt(){return Hc?.BASE_URL??"./"}function Vc(){try{const i=localStorage.getItem(Xl);if(i&&Wl.some(([e])=>e===i))return i}catch{}return"en"}function Wc(){return fa}function pa(i){typeof document>"u"||(document.documentElement.lang=i,document.documentElement.dir=i==="ar"?"rtl":"ltr")}async function Xc(i){const e=await fetch(`${zt()}locales/${i}.json`);if(!e.ok)throw new Error(`locale ${i}: ${e.status}`);return await e.json()}async function Ka(i){if(fa=i,pa(i),i==="en"){Zs={...Sr};return}try{Zs={...Sr,...await Xc(i)}}catch{Zs={...Sr},fa="en",pa("en")}}function qc(i){try{localStorage.setItem(Xl,i)}catch{}pa(i),location.reload()}function K(i,e){let t=Zs[i]??i;if(e)for(const n of Object.keys(e))t=t.split(`{${n}}`).join(String(e[n]));return t}const Se={feltDeep:2387516,feltMid:3120468,lineChalk:16185584,woodRim:8015660,skyTop:1718826,skyBottom:463373,bgInner:1455402,bgOuter:331787,teamBlue:3108336,teamRed:14826305,teamRedDark:9183011,capRim:16052194,capUnder:2762272,classSniper:16765774,classTank:16747069,classPlaymaker:5759176,ballWhite:16185074,selectRing:16771496,trailHot:16769162,shadowInk:398349,uiText:15660012,uiGold:16765774,uiMuted:9085074,lightKey:16773848,lightRim:12574975,white:16777215};function Ke(i,e=1){const t=i>>16&255,n=i>>8&255,s=i&255;return e>=1?`rgb(${t},${n},${s})`:`rgba(${t},${n},${s},${e})`}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Aa="160",Yc=0,ja=1,$c=2,ql=1,Kc=2,Mn=3,Xn=0,Ht=1,yn=2,kn=0,ki=1,Za=2,Ja=3,Qa=4,jc=5,ni=100,Zc=101,Jc=102,eo=103,to=104,Qc=200,eh=201,th=202,nh=203,ma=204,ga=205,ih=206,sh=207,rh=208,ah=209,oh=210,lh=211,ch=212,hh=213,uh=214,dh=0,fh=1,ph=2,Qs=3,mh=4,gh=5,_h=6,vh=7,Yl=0,xh=1,Sh=2,Gn=0,Mh=1,yh=2,Eh=3,$l=4,bh=5,Th=6,Kl=300,Hi=301,Vi=302,_a=303,va=304,ur=306,er=1e3,cn=1001,xa=1002,Ft=1003,no=1004,Mr=1005,Zt=1006,wh=1007,cs=1008,Hn=1009,Ah=1010,Rh=1011,Ra=1012,jl=1013,Nn=1014,Fn=1015,hs=1016,Zl=1017,Jl=1018,si=1020,Ch=1021,hn=1023,Lh=1024,Ph=1025,ri=1026,Wi=1027,Dh=1028,Ql=1029,Uh=1030,ec=1031,tc=1033,yr=33776,Er=33777,br=33778,Tr=33779,io=35840,so=35841,ro=35842,ao=35843,nc=36196,oo=37492,lo=37496,co=37808,ho=37809,uo=37810,fo=37811,po=37812,mo=37813,go=37814,_o=37815,vo=37816,xo=37817,So=37818,Mo=37819,yo=37820,Eo=37821,wr=36492,bo=36494,To=36495,Ih=36283,wo=36284,Ao=36285,Ro=36286,ic=3e3,ai=3001,Nh=3200,Fh=3201,sc=0,Oh=1,en="",lt="srgb",Tn="srgb-linear",Ca="display-p3",dr="display-p3-linear",tr="linear",at="srgb",nr="rec709",ir="p3",di=7680,Co=519,Bh=512,zh=513,kh=514,rc=515,Gh=516,Hh=517,Vh=518,Wh=519,Sa=35044,Lo="300 es",Ma=1035,bn=2e3,sr=2001;class Yi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Rt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ar=Math.PI/180,ya=180/Math.PI;function Vn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Rt[i&255]+Rt[i>>8&255]+Rt[i>>16&255]+Rt[i>>24&255]+"-"+Rt[e&255]+Rt[e>>8&255]+"-"+Rt[e>>16&15|64]+Rt[e>>24&255]+"-"+Rt[t&63|128]+Rt[t>>8&255]+"-"+Rt[t>>16&255]+Rt[t>>24&255]+Rt[n&255]+Rt[n>>8&255]+Rt[n>>16&255]+Rt[n>>24&255]).toLowerCase()}function kt(i,e,t){return Math.max(e,Math.min(t,i))}function Xh(i,e){return(i%e+e)%e}function Rr(i,e,t){return(1-t)*i+t*e}function Po(i){return(i&i-1)===0&&i!==0}function Ea(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function En(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function tt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Oe{constructor(e=0,t=0){Oe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(kt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class We{constructor(e,t,n,s,r,a,o,l,c){We.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],m=n[5],g=n[8],_=s[0],p=s[3],d=s[6],y=s[1],S=s[4],b=s[7],R=s[2],w=s[5],A=s[8];return r[0]=a*_+o*y+l*R,r[3]=a*p+o*S+l*w,r[6]=a*d+o*b+l*A,r[1]=c*_+h*y+u*R,r[4]=c*p+h*S+u*w,r[7]=c*d+h*b+u*A,r[2]=f*_+m*y+g*R,r[5]=f*p+m*S+g*w,r[8]=f*d+m*b+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,f=o*l-h*r,m=c*r-a*l,g=t*u+n*f+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=u*_,e[1]=(s*c-h*n)*_,e[2]=(o*n-s*a)*_,e[3]=f*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=m*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Cr.makeScale(e,t)),this}rotate(e){return this.premultiply(Cr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Cr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Cr=new We;function ac(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function us(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function qh(){const i=us("canvas");return i.style.display="block",i}const Do={};function os(i){i in Do||(Do[i]=!0,console.warn(i))}const Uo=new We().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Io=new We().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),xs={[Tn]:{transfer:tr,primaries:nr,toReference:i=>i,fromReference:i=>i},[lt]:{transfer:at,primaries:nr,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[dr]:{transfer:tr,primaries:ir,toReference:i=>i.applyMatrix3(Io),fromReference:i=>i.applyMatrix3(Uo)},[Ca]:{transfer:at,primaries:ir,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Io),fromReference:i=>i.applyMatrix3(Uo).convertLinearToSRGB()}},Yh=new Set([Tn,dr]),Qe={enabled:!0,_workingColorSpace:Tn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Yh.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=xs[e].toReference,s=xs[t].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return xs[i].primaries},getTransfer:function(i){return i===en?tr:xs[i].transfer}};function Gi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Lr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let fi;class oc{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{fi===void 0&&(fi=us("canvas")),fi.width=e.width,fi.height=e.height;const n=fi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=fi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=us("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Gi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Gi(t[n]/255)*255):t[n]=Gi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let $h=0;class lc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:$h++}),this.uuid=Vn(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Pr(s[a].image)):r.push(Pr(s[a]))}else r=Pr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Pr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?oc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Kh=0;class Ot extends Yi{constructor(e=Ot.DEFAULT_IMAGE,t=Ot.DEFAULT_MAPPING,n=cn,s=cn,r=Zt,a=cs,o=hn,l=Hn,c=Ot.DEFAULT_ANISOTROPY,h=en){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Kh++}),this.uuid=Vn(),this.name="",this.source=new lc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Oe(0,0),this.repeat=new Oe(1,1),this.center=new Oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(os("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===ai?lt:en),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Kl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case er:e.x=e.x-Math.floor(e.x);break;case cn:e.x=e.x<0?0:1;break;case xa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case er:e.y=e.y-Math.floor(e.y);break;case cn:e.y=e.y<0?0:1;break;case xa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return os("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===lt?ai:ic}set encoding(e){os("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===ai?lt:en}}Ot.DEFAULT_IMAGE=null;Ot.DEFAULT_MAPPING=Kl;Ot.DEFAULT_ANISOTROPY=1;class Tt{constructor(e=0,t=0,n=0,s=1){Tt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],m=l[5],g=l[9],_=l[2],p=l[6],d=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const S=(c+1)/2,b=(m+1)/2,R=(d+1)/2,w=(h+f)/4,A=(u+_)/4,k=(g+p)/4;return S>b&&S>R?S<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(S),s=w/n,r=A/n):b>R?b<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),n=w/s,r=k/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=A/r,s=k/r),this.set(n,s,r,t),this}let y=Math.sqrt((p-g)*(p-g)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(y)<.001&&(y=1),this.x=(p-g)/y,this.y=(u-_)/y,this.z=(f-h)/y,this.w=Math.acos((c+m+d-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class jh extends Yi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Tt(0,0,e,t),this.scissorTest=!1,this.viewport=new Tt(0,0,e,t);const s={width:e,height:t,depth:1};n.encoding!==void 0&&(os("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===ai?lt:en),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Zt,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Ot(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new lc(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class li extends jh{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class cc extends Ot{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ft,this.minFilter=Ft,this.wrapR=cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Zh extends Ot{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ft,this.minFilter=Ft,this.wrapR=cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class fs{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3];const f=r[a+0],m=r[a+1],g=r[a+2],_=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=f,e[t+1]=m,e[t+2]=g,e[t+3]=_;return}if(u!==_||l!==f||c!==m||h!==g){let p=1-o;const d=l*f+c*m+h*g+u*_,y=d>=0?1:-1,S=1-d*d;if(S>Number.EPSILON){const R=Math.sqrt(S),w=Math.atan2(R,d*y);p=Math.sin(p*w)/R,o=Math.sin(o*w)/R}const b=o*y;if(l=l*p+f*b,c=c*p+m*b,h=h*p+g*b,u=u*p+_*b,p===1-o){const R=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=R,c*=R,h*=R,u*=R}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],f=r[a+1],m=r[a+2],g=r[a+3];return e[t]=o*g+h*u+l*m-c*f,e[t+1]=l*g+h*f+c*u-o*m,e[t+2]=c*g+h*m+o*f-l*u,e[t+3]=h*g-o*u-l*f-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),f=l(n/2),m=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=f*h*u+c*m*g,this._y=c*m*u-f*h*g,this._z=c*h*g+f*m*u,this._w=c*h*u-f*m*g;break;case"YXZ":this._x=f*h*u+c*m*g,this._y=c*m*u-f*h*g,this._z=c*h*g-f*m*u,this._w=c*h*u+f*m*g;break;case"ZXY":this._x=f*h*u-c*m*g,this._y=c*m*u+f*h*g,this._z=c*h*g+f*m*u,this._w=c*h*u-f*m*g;break;case"ZYX":this._x=f*h*u-c*m*g,this._y=c*m*u+f*h*g,this._z=c*h*g-f*m*u,this._w=c*h*u+f*m*g;break;case"YZX":this._x=f*h*u+c*m*g,this._y=c*m*u+f*h*g,this._z=c*h*g-f*m*u,this._w=c*h*u-f*m*g;break;case"XZY":this._x=f*h*u-c*m*g,this._y=c*m*u-f*h*g,this._z=c*h*g+f*m*u,this._w=c*h*u+f*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+o+u;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(n>o&&n>u){const m=2*Math.sqrt(1+n-o-u);this._w=(h-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>u){const m=2*Math.sqrt(1+o-n-u);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+u-n-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(kt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*n+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(s),n*Math.sin(r),n*Math.cos(r),t*Math.sin(s))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(e=0,t=0,n=0){U.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(No.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(No.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Dr.copy(this).projectOnVector(e),this.sub(Dr)}reflect(e){return this.sub(Dr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(kt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Dr=new U,No=new fs;class ps{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(sn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(sn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=sn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,sn):sn.fromBufferAttribute(r,a),sn.applyMatrix4(e.matrixWorld),this.expandByPoint(sn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ss.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ss.copy(n.boundingBox)),Ss.applyMatrix4(e.matrixWorld),this.union(Ss)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,sn),sn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ji),Ms.subVectors(this.max,ji),pi.subVectors(e.a,ji),mi.subVectors(e.b,ji),gi.subVectors(e.c,ji),An.subVectors(mi,pi),Rn.subVectors(gi,mi),$n.subVectors(pi,gi);let t=[0,-An.z,An.y,0,-Rn.z,Rn.y,0,-$n.z,$n.y,An.z,0,-An.x,Rn.z,0,-Rn.x,$n.z,0,-$n.x,-An.y,An.x,0,-Rn.y,Rn.x,0,-$n.y,$n.x,0];return!Ur(t,pi,mi,gi,Ms)||(t=[1,0,0,0,1,0,0,0,1],!Ur(t,pi,mi,gi,Ms))?!1:(ys.crossVectors(An,Rn),t=[ys.x,ys.y,ys.z],Ur(t,pi,mi,gi,Ms))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,sn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(sn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(gn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),gn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),gn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),gn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),gn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),gn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),gn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),gn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(gn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const gn=[new U,new U,new U,new U,new U,new U,new U,new U],sn=new U,Ss=new ps,pi=new U,mi=new U,gi=new U,An=new U,Rn=new U,$n=new U,ji=new U,Ms=new U,ys=new U,Kn=new U;function Ur(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Kn.fromArray(i,r);const o=s.x*Math.abs(Kn.x)+s.y*Math.abs(Kn.y)+s.z*Math.abs(Kn.z),l=e.dot(Kn),c=t.dot(Kn),h=n.dot(Kn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Jh=new ps,Zi=new U,Ir=new U;class fr{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Jh.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Zi.subVectors(e,this.center);const t=Zi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Zi,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ir.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Zi.copy(e.center).add(Ir)),this.expandByPoint(Zi.copy(e.center).sub(Ir))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const _n=new U,Nr=new U,Es=new U,Cn=new U,Fr=new U,bs=new U,Or=new U;class hc{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,_n)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=_n.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(_n.copy(this.origin).addScaledVector(this.direction,t),_n.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Nr.copy(e).add(t).multiplyScalar(.5),Es.copy(t).sub(e).normalize(),Cn.copy(this.origin).sub(Nr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Es),o=Cn.dot(this.direction),l=-Cn.dot(Es),c=Cn.lengthSq(),h=Math.abs(1-a*a);let u,f,m,g;if(h>0)if(u=a*l-o,f=a*o-l,g=r*h,u>=0)if(f>=-g)if(f<=g){const _=1/h;u*=_,f*=_,m=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-l),r),m=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),m=f*(f+2*l)+c):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-l),r),m=-u*u+f*(f+2*l)+c);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Nr).addScaledVector(Es,f),m}intersectSphere(e,t){_n.subVectors(e.center,this.origin);const n=_n.dot(this.direction),s=_n.dot(_n)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,_n)!==null}intersectTriangle(e,t,n,s,r){Fr.subVectors(t,e),bs.subVectors(n,e),Or.crossVectors(Fr,bs);let a=this.direction.dot(Or),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Cn.subVectors(this.origin,e);const l=o*this.direction.dot(bs.crossVectors(Cn,bs));if(l<0)return null;const c=o*this.direction.dot(Fr.cross(Cn));if(c<0||l+c>a)return null;const h=-o*Cn.dot(Or);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class pt{constructor(e,t,n,s,r,a,o,l,c,h,u,f,m,g,_,p){pt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,u,f,m,g,_,p)}set(e,t,n,s,r,a,o,l,c,h,u,f,m,g,_,p){const d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=f,d[3]=m,d[7]=g,d[11]=_,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new pt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/_i.setFromMatrixColumn(e,0).length(),r=1/_i.setFromMatrixColumn(e,1).length(),a=1/_i.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=a*h,m=a*u,g=o*h,_=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=m+g*c,t[5]=f-_*c,t[9]=-o*l,t[2]=_-f*c,t[6]=g+m*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*h,m=l*u,g=c*h,_=c*u;t[0]=f+_*o,t[4]=g*o-m,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=m*o-g,t[6]=_+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*h,m=l*u,g=c*h,_=c*u;t[0]=f-_*o,t[4]=-a*u,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*h,t[9]=_-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*h,m=a*u,g=o*h,_=o*u;t[0]=l*h,t[4]=g*c-m,t[8]=f*c+_,t[1]=l*u,t[5]=_*c+f,t[9]=m*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,m=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=_-f*u,t[8]=g*u+m,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=m*u+g,t[10]=f-_*u}else if(e.order==="XZY"){const f=a*l,m=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+_,t[5]=a*h,t[9]=m*u-g,t[2]=g*u-m,t[6]=o*h,t[10]=_*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Qh,e,eu)}lookAt(e,t,n){const s=this.elements;return Wt.subVectors(e,t),Wt.lengthSq()===0&&(Wt.z=1),Wt.normalize(),Ln.crossVectors(n,Wt),Ln.lengthSq()===0&&(Math.abs(n.z)===1?Wt.x+=1e-4:Wt.z+=1e-4,Wt.normalize(),Ln.crossVectors(n,Wt)),Ln.normalize(),Ts.crossVectors(Wt,Ln),s[0]=Ln.x,s[4]=Ts.x,s[8]=Wt.x,s[1]=Ln.y,s[5]=Ts.y,s[9]=Wt.y,s[2]=Ln.z,s[6]=Ts.z,s[10]=Wt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],m=n[13],g=n[2],_=n[6],p=n[10],d=n[14],y=n[3],S=n[7],b=n[11],R=n[15],w=s[0],A=s[4],k=s[8],v=s[12],T=s[1],G=s[5],W=s[9],ee=s[13],L=s[2],I=s[6],H=s[10],Z=s[14],Y=s[3],j=s[7],Q=s[11],ie=s[15];return r[0]=a*w+o*T+l*L+c*Y,r[4]=a*A+o*G+l*I+c*j,r[8]=a*k+o*W+l*H+c*Q,r[12]=a*v+o*ee+l*Z+c*ie,r[1]=h*w+u*T+f*L+m*Y,r[5]=h*A+u*G+f*I+m*j,r[9]=h*k+u*W+f*H+m*Q,r[13]=h*v+u*ee+f*Z+m*ie,r[2]=g*w+_*T+p*L+d*Y,r[6]=g*A+_*G+p*I+d*j,r[10]=g*k+_*W+p*H+d*Q,r[14]=g*v+_*ee+p*Z+d*ie,r[3]=y*w+S*T+b*L+R*Y,r[7]=y*A+S*G+b*I+R*j,r[11]=y*k+S*W+b*H+R*Q,r[15]=y*v+S*ee+b*Z+R*ie,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],m=e[14],g=e[3],_=e[7],p=e[11],d=e[15];return g*(+r*l*u-s*c*u-r*o*f+n*c*f+s*o*m-n*l*m)+_*(+t*l*m-t*c*f+r*a*f-s*a*m+s*c*h-r*l*h)+p*(+t*c*u-t*o*m-r*a*u+n*a*m+r*o*h-n*c*h)+d*(-s*o*h-t*l*u+t*o*f+s*a*u-n*a*f+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],m=e[11],g=e[12],_=e[13],p=e[14],d=e[15],y=u*p*c-_*f*c+_*l*m-o*p*m-u*l*d+o*f*d,S=g*f*c-h*p*c-g*l*m+a*p*m+h*l*d-a*f*d,b=h*_*c-g*u*c+g*o*m-a*_*m-h*o*d+a*u*d,R=g*u*l-h*_*l-g*o*f+a*_*f+h*o*p-a*u*p,w=t*y+n*S+s*b+r*R;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return e[0]=y*A,e[1]=(_*f*r-u*p*r-_*s*m+n*p*m+u*s*d-n*f*d)*A,e[2]=(o*p*r-_*l*r+_*s*c-n*p*c-o*s*d+n*l*d)*A,e[3]=(u*l*r-o*f*r-u*s*c+n*f*c+o*s*m-n*l*m)*A,e[4]=S*A,e[5]=(h*p*r-g*f*r+g*s*m-t*p*m-h*s*d+t*f*d)*A,e[6]=(g*l*r-a*p*r-g*s*c+t*p*c+a*s*d-t*l*d)*A,e[7]=(a*f*r-h*l*r+h*s*c-t*f*c-a*s*m+t*l*m)*A,e[8]=b*A,e[9]=(g*u*r-h*_*r-g*n*m+t*_*m+h*n*d-t*u*d)*A,e[10]=(a*_*r-g*o*r+g*n*c-t*_*c-a*n*d+t*o*d)*A,e[11]=(h*o*r-a*u*r-h*n*c+t*u*c+a*n*m-t*o*m)*A,e[12]=R*A,e[13]=(h*_*s-g*u*s+g*n*f-t*_*f-h*n*p+t*u*p)*A,e[14]=(g*o*s-a*_*s-g*n*l+t*_*l+a*n*p-t*o*p)*A,e[15]=(a*u*s-h*o*s+h*n*l-t*u*l-a*n*f+t*o*f)*A,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,f=r*c,m=r*h,g=r*u,_=a*h,p=a*u,d=o*u,y=l*c,S=l*h,b=l*u,R=n.x,w=n.y,A=n.z;return s[0]=(1-(_+d))*R,s[1]=(m+b)*R,s[2]=(g-S)*R,s[3]=0,s[4]=(m-b)*w,s[5]=(1-(f+d))*w,s[6]=(p+y)*w,s[7]=0,s[8]=(g+S)*A,s[9]=(p-y)*A,s[10]=(1-(f+_))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=_i.set(s[0],s[1],s[2]).length();const a=_i.set(s[4],s[5],s[6]).length(),o=_i.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],rn.copy(this);const c=1/r,h=1/a,u=1/o;return rn.elements[0]*=c,rn.elements[1]*=c,rn.elements[2]*=c,rn.elements[4]*=h,rn.elements[5]*=h,rn.elements[6]*=h,rn.elements[8]*=u,rn.elements[9]*=u,rn.elements[10]*=u,t.setFromRotationMatrix(rn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=bn){const l=this.elements,c=2*r/(t-e),h=2*r/(n-s),u=(t+e)/(t-e),f=(n+s)/(n-s);let m,g;if(o===bn)m=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===sr)m=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=bn){const l=this.elements,c=1/(t-e),h=1/(n-s),u=1/(a-r),f=(t+e)*c,m=(n+s)*h;let g,_;if(o===bn)g=(a+r)*u,_=-2*u;else if(o===sr)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const _i=new U,rn=new pt,Qh=new U(0,0,0),eu=new U(1,1,1),Ln=new U,Ts=new U,Wt=new U,Fo=new pt,Oo=new fs;class pr{constructor(e=0,t=0,n=0,s=pr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(kt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-kt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(kt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-kt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(kt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-kt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Fo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Fo,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Oo.setFromEuler(this),this.setFromQuaternion(Oo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}pr.DEFAULT_ORDER="XYZ";class uc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let tu=0;const Bo=new U,vi=new fs,vn=new pt,ws=new U,Ji=new U,nu=new U,iu=new fs,zo=new U(1,0,0),ko=new U(0,1,0),Go=new U(0,0,1),su={type:"added"},ru={type:"removed"};class xt extends Yi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:tu++}),this.uuid=Vn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xt.DEFAULT_UP.clone();const e=new U,t=new pr,n=new fs,s=new U(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new pt},normalMatrix:{value:new We}}),this.matrix=new pt,this.matrixWorld=new pt,this.matrixAutoUpdate=xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new uc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return vi.setFromAxisAngle(e,t),this.quaternion.multiply(vi),this}rotateOnWorldAxis(e,t){return vi.setFromAxisAngle(e,t),this.quaternion.premultiply(vi),this}rotateX(e){return this.rotateOnAxis(zo,e)}rotateY(e){return this.rotateOnAxis(ko,e)}rotateZ(e){return this.rotateOnAxis(Go,e)}translateOnAxis(e,t){return Bo.copy(e).applyQuaternion(this.quaternion),this.position.add(Bo.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(zo,e)}translateY(e){return this.translateOnAxis(ko,e)}translateZ(e){return this.translateOnAxis(Go,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(vn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ws.copy(e):ws.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ji.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vn.lookAt(Ji,ws,this.up):vn.lookAt(ws,Ji,this.up),this.quaternion.setFromRotationMatrix(vn),s&&(vn.extractRotation(s.matrixWorld),vi.setFromRotationMatrix(vn),this.quaternion.premultiply(vi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(su)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ru)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),vn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),vn.multiply(e.parent.matrixWorld)),e.applyMatrix4(vn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ji,e,nu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ji,iu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++){const o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),f=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}xt.DEFAULT_UP=new U(0,1,0);xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const an=new U,xn=new U,Br=new U,Sn=new U,xi=new U,Si=new U,Ho=new U,zr=new U,kr=new U,Gr=new U;let As=!1;class Jt{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),an.subVectors(e,t),s.cross(an);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){an.subVectors(s,t),xn.subVectors(n,t),Br.subVectors(e,t);const a=an.dot(an),o=an.dot(xn),l=an.dot(Br),c=xn.dot(xn),h=xn.dot(Br),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,m=(c*l-o*h)*f,g=(a*h-o*l)*f;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Sn)===null?!1:Sn.x>=0&&Sn.y>=0&&Sn.x+Sn.y<=1}static getUV(e,t,n,s,r,a,o,l){return As===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),As=!0),this.getInterpolation(e,t,n,s,r,a,o,l)}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,Sn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Sn.x),l.addScaledVector(a,Sn.y),l.addScaledVector(o,Sn.z),l)}static isFrontFacing(e,t,n,s){return an.subVectors(n,t),xn.subVectors(e,t),an.cross(xn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return an.subVectors(this.c,this.b),xn.subVectors(this.a,this.b),an.cross(xn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Jt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Jt.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,s,r){return As===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),As=!0),Jt.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}getInterpolation(e,t,n,s,r){return Jt.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Jt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Jt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;xi.subVectors(s,n),Si.subVectors(r,n),zr.subVectors(e,n);const l=xi.dot(zr),c=Si.dot(zr);if(l<=0&&c<=0)return t.copy(n);kr.subVectors(e,s);const h=xi.dot(kr),u=Si.dot(kr);if(h>=0&&u<=h)return t.copy(s);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(xi,a);Gr.subVectors(e,r);const m=xi.dot(Gr),g=Si.dot(Gr);if(g>=0&&m<=g)return t.copy(r);const _=m*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Si,o);const p=h*g-m*u;if(p<=0&&u-h>=0&&m-g>=0)return Ho.subVectors(r,s),o=(u-h)/(u-h+(m-g)),t.copy(s).addScaledVector(Ho,o);const d=1/(p+_+f);return a=_*d,o=f*d,t.copy(n).addScaledVector(xi,a).addScaledVector(Si,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const dc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pn={h:0,s:0,l:0},Rs={h:0,s:0,l:0};function Hr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class $e{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=lt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=Qe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Qe.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=Qe.workingColorSpace){if(e=Xh(e,1),t=kt(t,0,1),n=kt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Hr(a,r,e+1/3),this.g=Hr(a,r,e),this.b=Hr(a,r,e-1/3)}return Qe.toWorkingColorSpace(this,s),this}setStyle(e,t=lt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=lt){const n=dc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Gi(e.r),this.g=Gi(e.g),this.b=Gi(e.b),this}copyLinearToSRGB(e){return this.r=Lr(e.r),this.g=Lr(e.g),this.b=Lr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=lt){return Qe.fromWorkingColorSpace(Ct.copy(this),e),Math.round(kt(Ct.r*255,0,255))*65536+Math.round(kt(Ct.g*255,0,255))*256+Math.round(kt(Ct.b*255,0,255))}getHexString(e=lt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Qe.workingColorSpace){Qe.fromWorkingColorSpace(Ct.copy(this),t);const n=Ct.r,s=Ct.g,r=Ct.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Qe.workingColorSpace){return Qe.fromWorkingColorSpace(Ct.copy(this),t),e.r=Ct.r,e.g=Ct.g,e.b=Ct.b,e}getStyle(e=lt){Qe.fromWorkingColorSpace(Ct.copy(this),e);const t=Ct.r,n=Ct.g,s=Ct.b;return e!==lt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Pn),this.setHSL(Pn.h+e,Pn.s+t,Pn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Pn),e.getHSL(Rs);const n=Rr(Pn.h,Rs.h,t),s=Rr(Pn.s,Rs.s,t),r=Rr(Pn.l,Rs.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ct=new $e;$e.NAMES=dc;let au=0;class ui extends Yi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:au++}),this.uuid=Vn(),this.name="",this.type="Material",this.blending=ki,this.side=Xn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ma,this.blendDst=ga,this.blendEquation=ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $e(0,0,0),this.blendAlpha=0,this.depthFunc=Qs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Co,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=di,this.stencilZFail=di,this.stencilZPass=di,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ki&&(n.blending=this.blending),this.side!==Xn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ma&&(n.blendSrc=this.blendSrc),this.blendDst!==ga&&(n.blendDst=this.blendDst),this.blendEquation!==ni&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Qs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Co&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==di&&(n.stencilFail=this.stencilFail),this.stencilZFail!==di&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==di&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class rr extends ui{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $e(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Yl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const mt=new U,Cs=new Oe;class nn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Sa,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Fn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Cs.fromBufferAttribute(this,t),Cs.applyMatrix3(e),this.setXY(t,Cs.x,Cs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.applyMatrix3(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.applyMatrix4(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.applyNormalMatrix(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.transformDirection(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=En(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=tt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=En(t,this.array)),t}setX(e,t){return this.normalized&&(t=tt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=En(t,this.array)),t}setY(e,t){return this.normalized&&(t=tt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=En(t,this.array)),t}setZ(e,t){return this.normalized&&(t=tt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=En(t,this.array)),t}setW(e,t){return this.normalized&&(t=tt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array),s=tt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array),s=tt(s,this.array),r=tt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Sa&&(e.usage=this.usage),e}}class fc extends nn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class pc extends nn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class wt extends nn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let ou=0;const $t=new pt,Vr=new xt,Mi=new U,Xt=new ps,Qi=new ps,bt=new U;class qt extends Yi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ou++}),this.uuid=Vn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ac(e)?pc:fc)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new We().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return $t.makeRotationFromQuaternion(e),this.applyMatrix4($t),this}rotateX(e){return $t.makeRotationX(e),this.applyMatrix4($t),this}rotateY(e){return $t.makeRotationY(e),this.applyMatrix4($t),this}rotateZ(e){return $t.makeRotationZ(e),this.applyMatrix4($t),this}translate(e,t,n){return $t.makeTranslation(e,t,n),this.applyMatrix4($t),this}scale(e,t,n){return $t.makeScale(e,t,n),this.applyMatrix4($t),this}lookAt(e){return Vr.lookAt(e),Vr.updateMatrix(),this.applyMatrix4(Vr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Mi).negate(),this.translate(Mi.x,Mi.y,Mi.z),this}setFromPoints(e){const t=[];for(let n=0,s=e.length;n<s;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new wt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ps);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Xt.setFromBufferAttribute(r),this.morphTargetsRelative?(bt.addVectors(this.boundingBox.min,Xt.min),this.boundingBox.expandByPoint(bt),bt.addVectors(this.boundingBox.max,Xt.max),this.boundingBox.expandByPoint(bt)):(this.boundingBox.expandByPoint(Xt.min),this.boundingBox.expandByPoint(Xt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new fr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new U,1/0);return}if(e){const n=this.boundingSphere.center;if(Xt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Qi.setFromBufferAttribute(o),this.morphTargetsRelative?(bt.addVectors(Xt.min,Qi.min),Xt.expandByPoint(bt),bt.addVectors(Xt.max,Qi.max),Xt.expandByPoint(bt)):(Xt.expandByPoint(Qi.min),Xt.expandByPoint(Qi.max))}Xt.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)bt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(bt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)bt.fromBufferAttribute(o,c),l&&(Mi.fromBufferAttribute(e,c),bt.add(Mi)),s=Math.max(s,n.distanceToSquared(bt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,s=t.position.array,r=t.normal.array,a=t.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new nn(new Float32Array(4*o),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let T=0;T<o;T++)c[T]=new U,h[T]=new U;const u=new U,f=new U,m=new U,g=new Oe,_=new Oe,p=new Oe,d=new U,y=new U;function S(T,G,W){u.fromArray(s,T*3),f.fromArray(s,G*3),m.fromArray(s,W*3),g.fromArray(a,T*2),_.fromArray(a,G*2),p.fromArray(a,W*2),f.sub(u),m.sub(u),_.sub(g),p.sub(g);const ee=1/(_.x*p.y-p.x*_.y);isFinite(ee)&&(d.copy(f).multiplyScalar(p.y).addScaledVector(m,-_.y).multiplyScalar(ee),y.copy(m).multiplyScalar(_.x).addScaledVector(f,-p.x).multiplyScalar(ee),c[T].add(d),c[G].add(d),c[W].add(d),h[T].add(y),h[G].add(y),h[W].add(y))}let b=this.groups;b.length===0&&(b=[{start:0,count:n.length}]);for(let T=0,G=b.length;T<G;++T){const W=b[T],ee=W.start,L=W.count;for(let I=ee,H=ee+L;I<H;I+=3)S(n[I+0],n[I+1],n[I+2])}const R=new U,w=new U,A=new U,k=new U;function v(T){A.fromArray(r,T*3),k.copy(A);const G=c[T];R.copy(G),R.sub(A.multiplyScalar(A.dot(G))).normalize(),w.crossVectors(k,G);const ee=w.dot(h[T])<0?-1:1;l[T*4]=R.x,l[T*4+1]=R.y,l[T*4+2]=R.z,l[T*4+3]=ee}for(let T=0,G=b.length;T<G;++T){const W=b[T],ee=W.start,L=W.count;for(let I=ee,H=ee+L;I<H;I+=3)v(n[I+0]),v(n[I+1]),v(n[I+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new nn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const s=new U,r=new U,a=new U,o=new U,l=new U,c=new U,h=new U,u=new U;if(e)for(let f=0,m=e.count;f<m;f+=3){const g=e.getX(f+0),_=e.getX(f+1),p=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,p),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=t.count;f<m;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)bt.fromBufferAttribute(e,t),bt.normalize(),e.setXYZ(t,bt.x,bt.y,bt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let m=0,g=0;for(let _=0,p=l.length;_<p;_++){o.isInterleavedBufferAttribute?m=l[_]*o.data.stride+o.offset:m=l[_]*h;for(let d=0;d<h;d++)f[g++]=c[m++]}return new nn(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new qt,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],m=e(f,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const m=c[u];h.push(m.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let f=0,m=u.length;f<m;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Vo=new pt,jn=new hc,Ls=new fr,Wo=new U,yi=new U,Ei=new U,bi=new U,Wr=new U,Ps=new U,Ds=new Oe,Us=new Oe,Is=new Oe,Xo=new U,qo=new U,Yo=new U,Ns=new U,Fs=new U;class vt extends xt{constructor(e=new qt,t=new rr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Ps.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(Wr.fromBufferAttribute(u,e),a?Ps.addScaledVector(Wr,h):Ps.addScaledVector(Wr.sub(t),h))}t.add(Ps)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ls.copy(n.boundingSphere),Ls.applyMatrix4(r),jn.copy(e.ray).recast(e.near),!(Ls.containsPoint(jn.origin)===!1&&(jn.intersectSphere(Ls,Wo)===null||jn.origin.distanceToSquared(Wo)>(e.far-e.near)**2))&&(Vo.copy(r).invert(),jn.copy(e.ray).applyMatrix4(Vo),!(n.boundingBox!==null&&jn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,jn)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const p=f[g],d=a[p.materialIndex],y=Math.max(p.start,m.start),S=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let b=y,R=S;b<R;b+=3){const w=o.getX(b),A=o.getX(b+1),k=o.getX(b+2);s=Os(this,d,e,n,c,h,u,w,A,k),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(o.count,m.start+m.count);for(let p=g,d=_;p<d;p+=3){const y=o.getX(p),S=o.getX(p+1),b=o.getX(p+2);s=Os(this,a,e,n,c,h,u,y,S,b),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const p=f[g],d=a[p.materialIndex],y=Math.max(p.start,m.start),S=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let b=y,R=S;b<R;b+=3){const w=b,A=b+1,k=b+2;s=Os(this,d,e,n,c,h,u,w,A,k),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let p=g,d=_;p<d;p+=3){const y=p,S=p+1,b=p+2;s=Os(this,a,e,n,c,h,u,y,S,b),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function lu(i,e,t,n,s,r,a,o){let l;if(e.side===Ht?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Xn,o),l===null)return null;Fs.copy(o),Fs.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Fs);return c<t.near||c>t.far?null:{distance:c,point:Fs.clone(),object:i}}function Os(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,yi),i.getVertexPosition(l,Ei),i.getVertexPosition(c,bi);const h=lu(i,e,t,n,yi,Ei,bi,Ns);if(h){s&&(Ds.fromBufferAttribute(s,o),Us.fromBufferAttribute(s,l),Is.fromBufferAttribute(s,c),h.uv=Jt.getInterpolation(Ns,yi,Ei,bi,Ds,Us,Is,new Oe)),r&&(Ds.fromBufferAttribute(r,o),Us.fromBufferAttribute(r,l),Is.fromBufferAttribute(r,c),h.uv1=Jt.getInterpolation(Ns,yi,Ei,bi,Ds,Us,Is,new Oe),h.uv2=h.uv1),a&&(Xo.fromBufferAttribute(a,o),qo.fromBufferAttribute(a,l),Yo.fromBufferAttribute(a,c),h.normal=Jt.getInterpolation(Ns,yi,Ei,bi,Xo,qo,Yo,new U),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new U,materialIndex:0};Jt.getNormal(yi,Ei,bi,u.normal),h.face=u}return h}class wn extends qt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,m=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new wt(c,3)),this.setAttribute("normal",new wt(h,3)),this.setAttribute("uv",new wt(u,2));function g(_,p,d,y,S,b,R,w,A,k,v){const T=b/A,G=R/k,W=b/2,ee=R/2,L=w/2,I=A+1,H=k+1;let Z=0,Y=0;const j=new U;for(let Q=0;Q<H;Q++){const ie=Q*G-ee;for(let re=0;re<I;re++){const X=re*T-W;j[_]=X*y,j[p]=ie*S,j[d]=L,c.push(j.x,j.y,j.z),j[_]=0,j[p]=0,j[d]=w>0?1:-1,h.push(j.x,j.y,j.z),u.push(re/A),u.push(1-Q/k),Z+=1}}for(let Q=0;Q<k;Q++)for(let ie=0;ie<A;ie++){const re=f+ie+I*Q,X=f+ie+I*(Q+1),J=f+(ie+1)+I*(Q+1),le=f+(ie+1)+I*Q;l.push(re,X,le),l.push(X,J,le),Y+=6}o.addGroup(m,Y,v),m+=Y,f+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Xi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function It(i){const e={};for(let t=0;t<i.length;t++){const n=Xi(i[t]);for(const s in n)e[s]=n[s]}return e}function cu(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function mc(i){return i.getRenderTarget()===null?i.outputColorSpace:Qe.workingColorSpace}const hu={clone:Xi,merge:It};var uu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,du=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ci extends ui{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=uu,this.fragmentShader=du,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Xi(e.uniforms),this.uniformsGroups=cu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class gc extends xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pt,this.projectionMatrix=new pt,this.projectionMatrixInverse=new pt,this.coordinateSystem=bn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class ln extends gc{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ya*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ar*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ya*2*Math.atan(Math.tan(Ar*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ar*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ti=-90,wi=1;class fu extends xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ln(Ti,wi,e,t);s.layers=this.layers,this.add(s);const r=new ln(Ti,wi,e,t);r.layers=this.layers,this.add(r);const a=new ln(Ti,wi,e,t);a.layers=this.layers,this.add(a);const o=new ln(Ti,wi,e,t);o.layers=this.layers,this.add(o);const l=new ln(Ti,wi,e,t);l.layers=this.layers,this.add(l);const c=new ln(Ti,wi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===bn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===sr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,f,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class _c extends Ot{constructor(e,t,n,s,r,a,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Hi,super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class pu extends li{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];t.encoding!==void 0&&(os("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===ai?lt:en),this.texture=new _c(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Zt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new wn(5,5,5),r=new ci({name:"CubemapFromEquirect",uniforms:Xi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ht,blending:kn});r.uniforms.tEquirect.value=t;const a=new vt(s,r),o=t.minFilter;return t.minFilter===cs&&(t.minFilter=Zt),new fu(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}const Xr=new U,mu=new U,gu=new We;class Qn{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Xr.subVectors(n,t).cross(mu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Xr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||gu.getNormalMatrix(e),s=this.coplanarPoint(Xr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Zn=new fr,Bs=new U;class La{constructor(e=new Qn,t=new Qn,n=new Qn,s=new Qn,r=new Qn,a=new Qn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=bn){const n=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],h=s[5],u=s[6],f=s[7],m=s[8],g=s[9],_=s[10],p=s[11],d=s[12],y=s[13],S=s[14],b=s[15];if(n[0].setComponents(l-r,f-c,p-m,b-d).normalize(),n[1].setComponents(l+r,f+c,p+m,b+d).normalize(),n[2].setComponents(l+a,f+h,p+g,b+y).normalize(),n[3].setComponents(l-a,f-h,p-g,b-y).normalize(),n[4].setComponents(l-o,f-u,p-_,b-S).normalize(),t===bn)n[5].setComponents(l+o,f+u,p+_,b+S).normalize();else if(t===sr)n[5].setComponents(o,u,_,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Zn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Zn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Zn)}intersectsSprite(e){return Zn.center.set(0,0,0),Zn.radius=.7071067811865476,Zn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Zn)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Bs.x=s.normal.x>0?e.max.x:e.min.x,Bs.y=s.normal.y>0?e.max.y:e.min.y,Bs.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Bs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function vc(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function _u(i,e){const t=e.isWebGL2,n=new WeakMap;function s(c,h){const u=c.array,f=c.usage,m=u.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,u,f),c.onUploadCallback();let _;if(u instanceof Float32Array)_=i.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)_=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=i.SHORT;else if(u instanceof Uint32Array)_=i.UNSIGNED_INT;else if(u instanceof Int32Array)_=i.INT;else if(u instanceof Int8Array)_=i.BYTE;else if(u instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:m}}function r(c,h,u){const f=h.array,m=h._updateRange,g=h.updateRanges;if(i.bindBuffer(u,c),m.count===-1&&g.length===0&&i.bufferSubData(u,0,f),g.length!==0){for(let _=0,p=g.length;_<p;_++){const d=g[_];t?i.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f,d.start,d.count):i.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f.subarray(d.start,d.start+d.count))}h.clearUpdateRanges()}m.count!==-1&&(t?i.bufferSubData(u,m.offset*f.BYTES_PER_ELEMENT,f,m.offset,m.count):i.bufferSubData(u,m.offset*f.BYTES_PER_ELEMENT,f.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(i.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const f=n.get(c);(!f||f.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);if(u===void 0)n.set(c,s(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,c,h),u.version=c.version}}return{get:a,remove:o,update:l}}class qi extends qt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=e/o,f=t/l,m=[],g=[],_=[],p=[];for(let d=0;d<h;d++){const y=d*f-a;for(let S=0;S<c;S++){const b=S*u-r;g.push(b,-y,0),_.push(0,0,1),p.push(S/o),p.push(1-d/l)}}for(let d=0;d<l;d++)for(let y=0;y<o;y++){const S=y+c*d,b=y+c*(d+1),R=y+1+c*(d+1),w=y+1+c*d;m.push(S,b,w),m.push(b,R,w)}this.setIndex(m),this.setAttribute("position",new wt(g,3)),this.setAttribute("normal",new wt(_,3)),this.setAttribute("uv",new wt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qi(e.width,e.height,e.widthSegments,e.heightSegments)}}var vu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,xu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Su=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Mu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,yu=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Eu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,bu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Tu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,wu=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Au=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Ru=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Cu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Lu=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Pu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Du=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Uu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,Iu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Nu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Fu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ou=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Bu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,zu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,ku=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Gu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Hu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Vu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Wu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Xu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Yu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$u="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ku=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,ju=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Zu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ju=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Qu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ed=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,td=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,nd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,id=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,sd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,rd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ad=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,od=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ld=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,cd=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,hd=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,ud=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,dd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,fd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,pd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,md=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,gd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,_d=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,vd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,xd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Sd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Md=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,yd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ed=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,bd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Td=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ad=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Rd=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Cd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ld=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Pd=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Dd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Ud=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Id=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Nd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Fd=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Od=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,kd=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Gd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Hd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Vd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Wd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Xd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,qd=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Yd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,$d=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Kd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Zd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Jd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Qd=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,ef=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,tf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,nf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,sf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,rf=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,af=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,of=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,lf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,cf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,hf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,uf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,df=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ff=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,pf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,mf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,gf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,_f=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const vf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,xf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Mf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ef=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Tf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,wf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Af=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Rf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Cf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lf=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Pf=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Df=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Uf=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,If=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Nf=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ff=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Of=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Bf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,zf=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,kf=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gf=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Vf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xf=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qf=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Yf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$f=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Kf=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,jf=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Zf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ze={alphahash_fragment:vu,alphahash_pars_fragment:xu,alphamap_fragment:Su,alphamap_pars_fragment:Mu,alphatest_fragment:yu,alphatest_pars_fragment:Eu,aomap_fragment:bu,aomap_pars_fragment:Tu,batching_pars_vertex:wu,batching_vertex:Au,begin_vertex:Ru,beginnormal_vertex:Cu,bsdfs:Lu,iridescence_fragment:Pu,bumpmap_pars_fragment:Du,clipping_planes_fragment:Uu,clipping_planes_pars_fragment:Iu,clipping_planes_pars_vertex:Nu,clipping_planes_vertex:Fu,color_fragment:Ou,color_pars_fragment:Bu,color_pars_vertex:zu,color_vertex:ku,common:Gu,cube_uv_reflection_fragment:Hu,defaultnormal_vertex:Vu,displacementmap_pars_vertex:Wu,displacementmap_vertex:Xu,emissivemap_fragment:qu,emissivemap_pars_fragment:Yu,colorspace_fragment:$u,colorspace_pars_fragment:Ku,envmap_fragment:ju,envmap_common_pars_fragment:Zu,envmap_pars_fragment:Ju,envmap_pars_vertex:Qu,envmap_physical_pars_fragment:ud,envmap_vertex:ed,fog_vertex:td,fog_pars_vertex:nd,fog_fragment:id,fog_pars_fragment:sd,gradientmap_pars_fragment:rd,lightmap_fragment:ad,lightmap_pars_fragment:od,lights_lambert_fragment:ld,lights_lambert_pars_fragment:cd,lights_pars_begin:hd,lights_toon_fragment:dd,lights_toon_pars_fragment:fd,lights_phong_fragment:pd,lights_phong_pars_fragment:md,lights_physical_fragment:gd,lights_physical_pars_fragment:_d,lights_fragment_begin:vd,lights_fragment_maps:xd,lights_fragment_end:Sd,logdepthbuf_fragment:Md,logdepthbuf_pars_fragment:yd,logdepthbuf_pars_vertex:Ed,logdepthbuf_vertex:bd,map_fragment:Td,map_pars_fragment:wd,map_particle_fragment:Ad,map_particle_pars_fragment:Rd,metalnessmap_fragment:Cd,metalnessmap_pars_fragment:Ld,morphcolor_vertex:Pd,morphnormal_vertex:Dd,morphtarget_pars_vertex:Ud,morphtarget_vertex:Id,normal_fragment_begin:Nd,normal_fragment_maps:Fd,normal_pars_fragment:Od,normal_pars_vertex:Bd,normal_vertex:zd,normalmap_pars_fragment:kd,clearcoat_normal_fragment_begin:Gd,clearcoat_normal_fragment_maps:Hd,clearcoat_pars_fragment:Vd,iridescence_pars_fragment:Wd,opaque_fragment:Xd,packing:qd,premultiplied_alpha_fragment:Yd,project_vertex:$d,dithering_fragment:Kd,dithering_pars_fragment:jd,roughnessmap_fragment:Zd,roughnessmap_pars_fragment:Jd,shadowmap_pars_fragment:Qd,shadowmap_pars_vertex:ef,shadowmap_vertex:tf,shadowmask_pars_fragment:nf,skinbase_vertex:sf,skinning_pars_vertex:rf,skinning_vertex:af,skinnormal_vertex:of,specularmap_fragment:lf,specularmap_pars_fragment:cf,tonemapping_fragment:hf,tonemapping_pars_fragment:uf,transmission_fragment:df,transmission_pars_fragment:ff,uv_pars_fragment:pf,uv_pars_vertex:mf,uv_vertex:gf,worldpos_vertex:_f,background_vert:vf,background_frag:xf,backgroundCube_vert:Sf,backgroundCube_frag:Mf,cube_vert:yf,cube_frag:Ef,depth_vert:bf,depth_frag:Tf,distanceRGBA_vert:wf,distanceRGBA_frag:Af,equirect_vert:Rf,equirect_frag:Cf,linedashed_vert:Lf,linedashed_frag:Pf,meshbasic_vert:Df,meshbasic_frag:Uf,meshlambert_vert:If,meshlambert_frag:Nf,meshmatcap_vert:Ff,meshmatcap_frag:Of,meshnormal_vert:Bf,meshnormal_frag:zf,meshphong_vert:kf,meshphong_frag:Gf,meshphysical_vert:Hf,meshphysical_frag:Vf,meshtoon_vert:Wf,meshtoon_frag:Xf,points_vert:qf,points_frag:Yf,shadow_vert:$f,shadow_frag:Kf,sprite_vert:jf,sprite_frag:Zf},oe={common:{diffuse:{value:new $e(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new Oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $e(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new $e(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new $e(16777215)},opacity:{value:1},center:{value:new Oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},pn={basic:{uniforms:It([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:ze.meshbasic_vert,fragmentShader:ze.meshbasic_frag},lambert:{uniforms:It([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new $e(0)}}]),vertexShader:ze.meshlambert_vert,fragmentShader:ze.meshlambert_frag},phong:{uniforms:It([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new $e(0)},specular:{value:new $e(1118481)},shininess:{value:30}}]),vertexShader:ze.meshphong_vert,fragmentShader:ze.meshphong_frag},standard:{uniforms:It([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new $e(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag},toon:{uniforms:It([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new $e(0)}}]),vertexShader:ze.meshtoon_vert,fragmentShader:ze.meshtoon_frag},matcap:{uniforms:It([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:ze.meshmatcap_vert,fragmentShader:ze.meshmatcap_frag},points:{uniforms:It([oe.points,oe.fog]),vertexShader:ze.points_vert,fragmentShader:ze.points_frag},dashed:{uniforms:It([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ze.linedashed_vert,fragmentShader:ze.linedashed_frag},depth:{uniforms:It([oe.common,oe.displacementmap]),vertexShader:ze.depth_vert,fragmentShader:ze.depth_frag},normal:{uniforms:It([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:ze.meshnormal_vert,fragmentShader:ze.meshnormal_frag},sprite:{uniforms:It([oe.sprite,oe.fog]),vertexShader:ze.sprite_vert,fragmentShader:ze.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ze.background_vert,fragmentShader:ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:ze.backgroundCube_vert,fragmentShader:ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ze.cube_vert,fragmentShader:ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ze.equirect_vert,fragmentShader:ze.equirect_frag},distanceRGBA:{uniforms:It([oe.common,oe.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ze.distanceRGBA_vert,fragmentShader:ze.distanceRGBA_frag},shadow:{uniforms:It([oe.lights,oe.fog,{color:{value:new $e(0)},opacity:{value:1}}]),vertexShader:ze.shadow_vert,fragmentShader:ze.shadow_frag}};pn.physical={uniforms:It([pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new Oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new $e(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new Oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new $e(0)},specularColor:{value:new $e(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new Oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag};const zs={r:0,b:0,g:0};function Jf(i,e,t,n,s,r,a){const o=new $e(0);let l=r===!0?0:1,c,h,u=null,f=0,m=null;function g(p,d){let y=!1,S=d.isScene===!0?d.background:null;S&&S.isTexture&&(S=(d.backgroundBlurriness>0?t:e).get(S)),S===null?_(o,l):S&&S.isColor&&(_(S,1),y=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),S&&(S.isCubeTexture||S.mapping===ur)?(h===void 0&&(h=new vt(new wn(1,1,1),new ci({name:"BackgroundCubeMaterial",uniforms:Xi(pn.backgroundCube.uniforms),vertexShader:pn.backgroundCube.vertexShader,fragmentShader:pn.backgroundCube.fragmentShader,side:Ht,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=S,h.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,h.material.toneMapped=Qe.getTransfer(S.colorSpace)!==at,(u!==S||f!==S.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,u=S,f=S.version,m=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new vt(new qi(2,2),new ci({name:"BackgroundMaterial",uniforms:Xi(pn.background.uniforms),vertexShader:pn.background.vertexShader,fragmentShader:pn.background.fragmentShader,side:Xn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,c.material.toneMapped=Qe.getTransfer(S.colorSpace)!==at,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(u!==S||f!==S.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,u=S,f=S.version,m=i.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function _(p,d){p.getRGB(zs,mc(i)),n.buffers.color.setClear(zs.r,zs.g,zs.b,d,a)}return{getClearColor:function(){return o},setClearColor:function(p,d=1){o.set(p),l=d,_(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,_(o,l)},render:g}}function Qf(i,e,t,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},l=p(null);let c=l,h=!1;function u(L,I,H,Z,Y){let j=!1;if(a){const Q=_(Z,H,I);c!==Q&&(c=Q,m(c.object)),j=d(L,Z,H,Y),j&&y(L,Z,H,Y)}else{const Q=I.wireframe===!0;(c.geometry!==Z.id||c.program!==H.id||c.wireframe!==Q)&&(c.geometry=Z.id,c.program=H.id,c.wireframe=Q,j=!0)}Y!==null&&t.update(Y,i.ELEMENT_ARRAY_BUFFER),(j||h)&&(h=!1,k(L,I,H,Z),Y!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(Y).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function m(L){return n.isWebGL2?i.bindVertexArray(L):r.bindVertexArrayOES(L)}function g(L){return n.isWebGL2?i.deleteVertexArray(L):r.deleteVertexArrayOES(L)}function _(L,I,H){const Z=H.wireframe===!0;let Y=o[L.id];Y===void 0&&(Y={},o[L.id]=Y);let j=Y[I.id];j===void 0&&(j={},Y[I.id]=j);let Q=j[Z];return Q===void 0&&(Q=p(f()),j[Z]=Q),Q}function p(L){const I=[],H=[],Z=[];for(let Y=0;Y<s;Y++)I[Y]=0,H[Y]=0,Z[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:H,attributeDivisors:Z,object:L,attributes:{},index:null}}function d(L,I,H,Z){const Y=c.attributes,j=I.attributes;let Q=0;const ie=H.getAttributes();for(const re in ie)if(ie[re].location>=0){const J=Y[re];let le=j[re];if(le===void 0&&(re==="instanceMatrix"&&L.instanceMatrix&&(le=L.instanceMatrix),re==="instanceColor"&&L.instanceColor&&(le=L.instanceColor)),J===void 0||J.attribute!==le||le&&J.data!==le.data)return!0;Q++}return c.attributesNum!==Q||c.index!==Z}function y(L,I,H,Z){const Y={},j=I.attributes;let Q=0;const ie=H.getAttributes();for(const re in ie)if(ie[re].location>=0){let J=j[re];J===void 0&&(re==="instanceMatrix"&&L.instanceMatrix&&(J=L.instanceMatrix),re==="instanceColor"&&L.instanceColor&&(J=L.instanceColor));const le={};le.attribute=J,J&&J.data&&(le.data=J.data),Y[re]=le,Q++}c.attributes=Y,c.attributesNum=Q,c.index=Z}function S(){const L=c.newAttributes;for(let I=0,H=L.length;I<H;I++)L[I]=0}function b(L){R(L,0)}function R(L,I){const H=c.newAttributes,Z=c.enabledAttributes,Y=c.attributeDivisors;H[L]=1,Z[L]===0&&(i.enableVertexAttribArray(L),Z[L]=1),Y[L]!==I&&((n.isWebGL2?i:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](L,I),Y[L]=I)}function w(){const L=c.newAttributes,I=c.enabledAttributes;for(let H=0,Z=I.length;H<Z;H++)I[H]!==L[H]&&(i.disableVertexAttribArray(H),I[H]=0)}function A(L,I,H,Z,Y,j,Q){Q===!0?i.vertexAttribIPointer(L,I,H,Y,j):i.vertexAttribPointer(L,I,H,Z,Y,j)}function k(L,I,H,Z){if(n.isWebGL2===!1&&(L.isInstancedMesh||Z.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;S();const Y=Z.attributes,j=H.getAttributes(),Q=I.defaultAttributeValues;for(const ie in j){const re=j[ie];if(re.location>=0){let X=Y[ie];if(X===void 0&&(ie==="instanceMatrix"&&L.instanceMatrix&&(X=L.instanceMatrix),ie==="instanceColor"&&L.instanceColor&&(X=L.instanceColor)),X!==void 0){const J=X.normalized,le=X.itemSize,_e=t.get(X);if(_e===void 0)continue;const ge=_e.buffer,Le=_e.type,De=_e.bytesPerElement,be=n.isWebGL2===!0&&(Le===i.INT||Le===i.UNSIGNED_INT||X.gpuType===jl);if(X.isInterleavedBufferAttribute){const Ue=X.data,N=Ue.stride,pe=X.offset;if(Ue.isInstancedInterleavedBuffer){for(let xe=0;xe<re.locationSize;xe++)R(re.location+xe,Ue.meshPerAttribute);L.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=Ue.meshPerAttribute*Ue.count)}else for(let xe=0;xe<re.locationSize;xe++)b(re.location+xe);i.bindBuffer(i.ARRAY_BUFFER,ge);for(let xe=0;xe<re.locationSize;xe++)A(re.location+xe,le/re.locationSize,Le,J,N*De,(pe+le/re.locationSize*xe)*De,be)}else{if(X.isInstancedBufferAttribute){for(let Ue=0;Ue<re.locationSize;Ue++)R(re.location+Ue,X.meshPerAttribute);L.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let Ue=0;Ue<re.locationSize;Ue++)b(re.location+Ue);i.bindBuffer(i.ARRAY_BUFFER,ge);for(let Ue=0;Ue<re.locationSize;Ue++)A(re.location+Ue,le/re.locationSize,Le,J,le*De,le/re.locationSize*Ue*De,be)}}else if(Q!==void 0){const J=Q[ie];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(re.location,J);break;case 3:i.vertexAttrib3fv(re.location,J);break;case 4:i.vertexAttrib4fv(re.location,J);break;default:i.vertexAttrib1fv(re.location,J)}}}}w()}function v(){W();for(const L in o){const I=o[L];for(const H in I){const Z=I[H];for(const Y in Z)g(Z[Y].object),delete Z[Y];delete I[H]}delete o[L]}}function T(L){if(o[L.id]===void 0)return;const I=o[L.id];for(const H in I){const Z=I[H];for(const Y in Z)g(Z[Y].object),delete Z[Y];delete I[H]}delete o[L.id]}function G(L){for(const I in o){const H=o[I];if(H[L.id]===void 0)continue;const Z=H[L.id];for(const Y in Z)g(Z[Y].object),delete Z[Y];delete H[L.id]}}function W(){ee(),h=!0,c!==l&&(c=l,m(c.object))}function ee(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:W,resetDefaultState:ee,dispose:v,releaseStatesOfGeometry:T,releaseStatesOfProgram:G,initAttributes:S,enableAttribute:b,disableUnusedAttributes:w}}function ep(i,e,t,n){const s=n.isWebGL2;let r;function a(h){r=h}function o(h,u){i.drawArrays(r,h,u),t.update(u,r,1)}function l(h,u,f){if(f===0)return;let m,g;if(s)m=i,g="drawArraysInstanced";else if(m=e.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[g](r,h,u,f),t.update(u,r,f)}function c(h,u,f){if(f===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<f;g++)this.render(h[g],u[g]);else{m.multiDrawArraysWEBGL(r,h,0,u,0,f);let g=0;for(let _=0;_<f;_++)g+=u[_];t.update(g,r,1)}}this.setMode=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=c}function tp(i,e,t){let n;function s(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");n=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let o=t.precision!==void 0?t.precision:"highp";const l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=a||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),d=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),S=f>0,b=a||e.has("OES_texture_float"),R=S&&b,w=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:m,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:p,maxVaryings:d,maxFragmentUniforms:y,vertexTextures:S,floatFragmentTextures:b,floatVertexTextures:R,maxSamples:w}}function np(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Qn,o=new We,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const m=u.length!==0||f||n!==0||s;return s=f,n=u.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,m){const g=u.clippingPlanes,_=u.clipIntersection,p=u.clipShadows,d=i.get(u);if(!s||g===null||g.length===0||r&&!p)r?h(null):c();else{const y=r?0:n,S=y*4;let b=d.clippingState||null;l.value=b,b=h(g,f,S,m);for(let R=0;R!==S;++R)b[R]=t[R];d.clippingState=b,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,m,g){const _=u!==null?u.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const d=m+_*4,y=f.matrixWorldInverse;o.getNormalMatrix(y),(p===null||p.length<d)&&(p=new Float32Array(d));for(let S=0,b=m;S!==_;++S,b+=4)a.copy(u[S]).applyMatrix4(y,o),a.normal.toArray(p,b),p[b+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}function ip(i){let e=new WeakMap;function t(a,o){return o===_a?a.mapping=Hi:o===va&&(a.mapping=Vi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===_a||o===va)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new pu(l.height/2);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class Pa extends gc{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Oi=4,$o=[.125,.215,.35,.446,.526,.582],ii=20,qr=new Pa,Ko=new $e;let Yr=null,$r=0,Kr=0;const ei=(1+Math.sqrt(5))/2,Ai=1/ei,jo=[new U(1,1,1),new U(-1,1,1),new U(1,1,-1),new U(-1,1,-1),new U(0,ei,Ai),new U(0,ei,-Ai),new U(Ai,0,ei),new U(-Ai,0,ei),new U(ei,Ai,0),new U(-ei,Ai,0)];class Zo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Yr=this._renderer.getRenderTarget(),$r=this._renderer.getActiveCubeFace(),Kr=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=el(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Qo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Yr,$r,Kr),e.scissorTest=!1,ks(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Hi||e.mapping===Vi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Yr=this._renderer.getRenderTarget(),$r=this._renderer.getActiveCubeFace(),Kr=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Zt,minFilter:Zt,generateMipmaps:!1,type:hs,format:hn,colorSpace:Tn,depthBuffer:!1},s=Jo(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Jo(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=sp(r)),this._blurMaterial=rp(r,e,t)}return s}_compileMaterial(e){const t=new vt(this._lodPlanes[0],e);this._renderer.compile(t,qr)}_sceneToCubeUV(e,t,n,s){const o=new ln(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(Ko),h.toneMapping=Gn,h.autoClear=!1;const m=new rr({name:"PMREM.Background",side:Ht,depthWrite:!1,depthTest:!1}),g=new vt(new wn,m);let _=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,_=!0):(m.color.copy(Ko),_=!0);for(let d=0;d<6;d++){const y=d%3;y===0?(o.up.set(0,l[d],0),o.lookAt(c[d],0,0)):y===1?(o.up.set(0,0,l[d]),o.lookAt(0,c[d],0)):(o.up.set(0,l[d],0),o.lookAt(0,0,c[d]));const S=this._cubeSize;ks(s,y*S,d>2?S:0,S,S),h.setRenderTarget(s),_&&h.render(g,o),h.render(e,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Hi||e.mapping===Vi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=el()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Qo());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new vt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;ks(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,qr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=jo[(s-1)%jo.length];this._blur(e,s-1,s,r,a)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new vt(this._lodPlanes[s],c),f=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*ii-1),_=r/g,p=isFinite(r)?1+Math.floor(h*_):ii;p>ii&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ii}`);const d=[];let y=0;for(let A=0;A<ii;++A){const k=A/_,v=Math.exp(-k*k/2);d.push(v),A===0?y+=v:A<p&&(y+=2*v)}for(let A=0;A<d.length;A++)d[A]=d[A]/y;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:S}=this;f.dTheta.value=g,f.mipInt.value=S-n;const b=this._sizeLods[s],R=3*b*(s>S-Oi?s-S+Oi:0),w=4*(this._cubeSize-b);ks(t,R,w,3*b,2*b),l.setRenderTarget(t),l.render(u,qr)}}function sp(i){const e=[],t=[],n=[];let s=i;const r=i-Oi+1+$o.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>i-Oi?l=$o[a-i+Oi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],m=6,g=6,_=3,p=2,d=1,y=new Float32Array(_*g*m),S=new Float32Array(p*g*m),b=new Float32Array(d*g*m);for(let w=0;w<m;w++){const A=w%3*2/3-1,k=w>2?0:-1,v=[A,k,0,A+2/3,k,0,A+2/3,k+1,0,A,k,0,A+2/3,k+1,0,A,k+1,0];y.set(v,_*g*w),S.set(f,p*g*w);const T=[w,w,w,w,w,w];b.set(T,d*g*w)}const R=new qt;R.setAttribute("position",new nn(y,_)),R.setAttribute("uv",new nn(S,p)),R.setAttribute("faceIndex",new nn(b,d)),e.push(R),s>Oi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Jo(i,e,t){const n=new li(i,e,t);return n.texture.mapping=ur,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ks(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function rp(i,e,t){const n=new Float32Array(ii),s=new U(0,1,0);return new ci({name:"SphericalGaussianBlur",defines:{n:ii,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Da(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:kn,depthTest:!1,depthWrite:!1})}function Qo(){return new ci({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Da(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:kn,depthTest:!1,depthWrite:!1})}function el(){return new ci({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Da(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:kn,depthTest:!1,depthWrite:!1})}function Da(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function ap(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===_a||l===va,h=l===Hi||l===Vi;if(c||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let u=e.get(o);return t===null&&(t=new Zo(i)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),e.set(o,u),u.texture}else{if(e.has(o))return e.get(o).texture;{const u=o.image;if(c&&u&&u.height>0||h&&u&&s(u)){t===null&&(t=new Zo(i));const f=c?t.fromEquirectangular(o):t.fromCubemap(o);return e.set(o,f),o.addEventListener("dispose",r),f.texture}else return null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function op(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const s=t(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function lp(i,e,t,n){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);for(const g in f.morphAttributes){const _=f.morphAttributes[g];for(let p=0,d=_.length;p<d;p++)e.remove(_[p])}f.removeEventListener("dispose",a),delete s[f.id];const m=r.get(f);m&&(e.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function l(u){const f=u.attributes;for(const g in f)e.update(f[g],i.ARRAY_BUFFER);const m=u.morphAttributes;for(const g in m){const _=m[g];for(let p=0,d=_.length;p<d;p++)e.update(_[p],i.ARRAY_BUFFER)}}function c(u){const f=[],m=u.index,g=u.attributes.position;let _=0;if(m!==null){const y=m.array;_=m.version;for(let S=0,b=y.length;S<b;S+=3){const R=y[S+0],w=y[S+1],A=y[S+2];f.push(R,w,w,A,A,R)}}else if(g!==void 0){const y=g.array;_=g.version;for(let S=0,b=y.length/3-1;S<b;S+=3){const R=S+0,w=S+1,A=S+2;f.push(R,w,w,A,A,R)}}else return;const p=new(ac(f)?pc:fc)(f,1);p.version=_;const d=r.get(u);d&&e.remove(d),r.set(u,p)}function h(u){const f=r.get(u);if(f){const m=u.index;m!==null&&f.version<m.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function cp(i,e,t,n){const s=n.isWebGL2;let r;function a(m){r=m}let o,l;function c(m){o=m.type,l=m.bytesPerElement}function h(m,g){i.drawElements(r,g,o,m*l),t.update(g,r,1)}function u(m,g,_){if(_===0)return;let p,d;if(s)p=i,d="drawElementsInstanced";else if(p=e.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[d](r,g,o,m*l,_),t.update(g,r,_)}function f(m,g,_){if(_===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let d=0;d<_;d++)this.render(m[d]/l,g[d]);else{p.multiDrawElementsWEBGL(r,g,0,o,m,0,_);let d=0;for(let y=0;y<_;y++)d+=g[y];t.update(d,r,1)}}this.setMode=a,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=f}function hp(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function up(i,e){return i[0]-e[0]}function dp(i,e){return Math.abs(e[1])-Math.abs(i[1])}function fp(i,e,t){const n={},s=new Float32Array(8),r=new WeakMap,a=new Tt,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,h,u){const f=c.morphTargetInfluences;if(e.isWebGL2===!0){const g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,_=g!==void 0?g.length:0;let p=r.get(h);if(p===void 0||p.count!==_){let I=function(){ee.dispose(),r.delete(h),h.removeEventListener("dispose",I)};var m=I;p!==void 0&&p.texture.dispose();const S=h.morphAttributes.position!==void 0,b=h.morphAttributes.normal!==void 0,R=h.morphAttributes.color!==void 0,w=h.morphAttributes.position||[],A=h.morphAttributes.normal||[],k=h.morphAttributes.color||[];let v=0;S===!0&&(v=1),b===!0&&(v=2),R===!0&&(v=3);let T=h.attributes.position.count*v,G=1;T>e.maxTextureSize&&(G=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const W=new Float32Array(T*G*4*_),ee=new cc(W,T,G,_);ee.type=Fn,ee.needsUpdate=!0;const L=v*4;for(let H=0;H<_;H++){const Z=w[H],Y=A[H],j=k[H],Q=T*G*4*H;for(let ie=0;ie<Z.count;ie++){const re=ie*L;S===!0&&(a.fromBufferAttribute(Z,ie),W[Q+re+0]=a.x,W[Q+re+1]=a.y,W[Q+re+2]=a.z,W[Q+re+3]=0),b===!0&&(a.fromBufferAttribute(Y,ie),W[Q+re+4]=a.x,W[Q+re+5]=a.y,W[Q+re+6]=a.z,W[Q+re+7]=0),R===!0&&(a.fromBufferAttribute(j,ie),W[Q+re+8]=a.x,W[Q+re+9]=a.y,W[Q+re+10]=a.z,W[Q+re+11]=j.itemSize===4?a.w:1)}}p={count:_,texture:ee,size:new Oe(T,G)},r.set(h,p),h.addEventListener("dispose",I)}let d=0;for(let S=0;S<f.length;S++)d+=f[S];const y=h.morphTargetsRelative?1:1-d;u.getUniforms().setValue(i,"morphTargetBaseInfluence",y),u.getUniforms().setValue(i,"morphTargetInfluences",f),u.getUniforms().setValue(i,"morphTargetsTexture",p.texture,t),u.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}else{const g=f===void 0?0:f.length;let _=n[h.id];if(_===void 0||_.length!==g){_=[];for(let b=0;b<g;b++)_[b]=[b,0];n[h.id]=_}for(let b=0;b<g;b++){const R=_[b];R[0]=b,R[1]=f[b]}_.sort(dp);for(let b=0;b<8;b++)b<g&&_[b][1]?(o[b][0]=_[b][0],o[b][1]=_[b][1]):(o[b][0]=Number.MAX_SAFE_INTEGER,o[b][1]=0);o.sort(up);const p=h.morphAttributes.position,d=h.morphAttributes.normal;let y=0;for(let b=0;b<8;b++){const R=o[b],w=R[0],A=R[1];w!==Number.MAX_SAFE_INTEGER&&A?(p&&h.getAttribute("morphTarget"+b)!==p[w]&&h.setAttribute("morphTarget"+b,p[w]),d&&h.getAttribute("morphNormal"+b)!==d[w]&&h.setAttribute("morphNormal"+b,d[w]),s[b]=A,y+=A):(p&&h.hasAttribute("morphTarget"+b)===!0&&h.deleteAttribute("morphTarget"+b),d&&h.hasAttribute("morphNormal"+b)===!0&&h.deleteAttribute("morphNormal"+b),s[b]=0)}const S=h.morphTargetsRelative?1:1-y;u.getUniforms().setValue(i,"morphTargetBaseInfluence",S),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function pp(i,e,t,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}class xc extends Ot{constructor(e,t,n,s,r,a,o,l,c,h){if(h=h!==void 0?h:ri,h!==ri&&h!==Wi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ri&&(n=Nn),n===void 0&&h===Wi&&(n=si),super(null,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Ft,this.minFilter=l!==void 0?l:Ft,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Sc=new Ot,Mc=new xc(1,1);Mc.compareFunction=rc;const yc=new cc,Ec=new Zh,bc=new _c,tl=[],nl=[],il=new Float32Array(16),sl=new Float32Array(9),rl=new Float32Array(4);function $i(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=tl[s];if(r===void 0&&(r=new Float32Array(s),tl[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function St(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Mt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function mr(i,e){let t=nl[e];t===void 0&&(t=new Int32Array(e),nl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function mp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function gp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;i.uniform2fv(this.addr,e),Mt(t,e)}}function _p(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(St(t,e))return;i.uniform3fv(this.addr,e),Mt(t,e)}}function vp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;i.uniform4fv(this.addr,e),Mt(t,e)}}function xp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(St(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Mt(t,e)}else{if(St(t,n))return;rl.set(n),i.uniformMatrix2fv(this.addr,!1,rl),Mt(t,n)}}function Sp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(St(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Mt(t,e)}else{if(St(t,n))return;sl.set(n),i.uniformMatrix3fv(this.addr,!1,sl),Mt(t,n)}}function Mp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(St(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Mt(t,e)}else{if(St(t,n))return;il.set(n),i.uniformMatrix4fv(this.addr,!1,il),Mt(t,n)}}function yp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Ep(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;i.uniform2iv(this.addr,e),Mt(t,e)}}function bp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(St(t,e))return;i.uniform3iv(this.addr,e),Mt(t,e)}}function Tp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;i.uniform4iv(this.addr,e),Mt(t,e)}}function wp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Ap(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;i.uniform2uiv(this.addr,e),Mt(t,e)}}function Rp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(St(t,e))return;i.uniform3uiv(this.addr,e),Mt(t,e)}}function Cp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;i.uniform4uiv(this.addr,e),Mt(t,e)}}function Lp(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?Mc:Sc;t.setTexture2D(e||r,s)}function Pp(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Ec,s)}function Dp(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||bc,s)}function Up(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||yc,s)}function Ip(i){switch(i){case 5126:return mp;case 35664:return gp;case 35665:return _p;case 35666:return vp;case 35674:return xp;case 35675:return Sp;case 35676:return Mp;case 5124:case 35670:return yp;case 35667:case 35671:return Ep;case 35668:case 35672:return bp;case 35669:case 35673:return Tp;case 5125:return wp;case 36294:return Ap;case 36295:return Rp;case 36296:return Cp;case 35678:case 36198:case 36298:case 36306:case 35682:return Lp;case 35679:case 36299:case 36307:return Pp;case 35680:case 36300:case 36308:case 36293:return Dp;case 36289:case 36303:case 36311:case 36292:return Up}}function Np(i,e){i.uniform1fv(this.addr,e)}function Fp(i,e){const t=$i(e,this.size,2);i.uniform2fv(this.addr,t)}function Op(i,e){const t=$i(e,this.size,3);i.uniform3fv(this.addr,t)}function Bp(i,e){const t=$i(e,this.size,4);i.uniform4fv(this.addr,t)}function zp(i,e){const t=$i(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function kp(i,e){const t=$i(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Gp(i,e){const t=$i(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Hp(i,e){i.uniform1iv(this.addr,e)}function Vp(i,e){i.uniform2iv(this.addr,e)}function Wp(i,e){i.uniform3iv(this.addr,e)}function Xp(i,e){i.uniform4iv(this.addr,e)}function qp(i,e){i.uniform1uiv(this.addr,e)}function Yp(i,e){i.uniform2uiv(this.addr,e)}function $p(i,e){i.uniform3uiv(this.addr,e)}function Kp(i,e){i.uniform4uiv(this.addr,e)}function jp(i,e,t){const n=this.cache,s=e.length,r=mr(t,s);St(n,r)||(i.uniform1iv(this.addr,r),Mt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Sc,r[a])}function Zp(i,e,t){const n=this.cache,s=e.length,r=mr(t,s);St(n,r)||(i.uniform1iv(this.addr,r),Mt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Ec,r[a])}function Jp(i,e,t){const n=this.cache,s=e.length,r=mr(t,s);St(n,r)||(i.uniform1iv(this.addr,r),Mt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||bc,r[a])}function Qp(i,e,t){const n=this.cache,s=e.length,r=mr(t,s);St(n,r)||(i.uniform1iv(this.addr,r),Mt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||yc,r[a])}function em(i){switch(i){case 5126:return Np;case 35664:return Fp;case 35665:return Op;case 35666:return Bp;case 35674:return zp;case 35675:return kp;case 35676:return Gp;case 5124:case 35670:return Hp;case 35667:case 35671:return Vp;case 35668:case 35672:return Wp;case 35669:case 35673:return Xp;case 5125:return qp;case 36294:return Yp;case 36295:return $p;case 36296:return Kp;case 35678:case 36198:case 36298:case 36306:case 35682:return jp;case 35679:case 36299:case 36307:return Zp;case 35680:case 36300:case 36308:case 36293:return Jp;case 36289:case 36303:case 36311:case 36292:return Qp}}class tm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Ip(t.type)}}class nm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=em(t.type)}}class im{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const jr=/(\w+)(\])?(\[|\.)?/g;function al(i,e){i.seq.push(e),i.map[e.id]=e}function sm(i,e,t){const n=i.name,s=n.length;for(jr.lastIndex=0;;){const r=jr.exec(n),a=jr.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){al(t,c===void 0?new tm(o,i,e):new nm(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new im(o),al(t,u)),t=u}}}class Js{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);sm(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function ol(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const rm=37297;let am=0;function om(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function lm(i){const e=Qe.getPrimaries(Qe.workingColorSpace),t=Qe.getPrimaries(i);let n;switch(e===t?n="":e===ir&&t===nr?n="LinearDisplayP3ToLinearSRGB":e===nr&&t===ir&&(n="LinearSRGBToLinearDisplayP3"),i){case Tn:case dr:return[n,"LinearTransferOETF"];case lt:case Ca:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function ll(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+om(i.getShaderSource(e),a)}else return s}function cm(i,e){const t=lm(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function hm(i,e){let t;switch(e){case Mh:t="Linear";break;case yh:t="Reinhard";break;case Eh:t="OptimizedCineon";break;case $l:t="ACESFilmic";break;case Th:t="AgX";break;case bh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function um(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Bi).join(`
`)}function dm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Bi).join(`
`)}function fm(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function pm(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Bi(i){return i!==""}function cl(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function hl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const mm=/^[ \t]*#include +<([\w\d./]+)>/gm;function ba(i){return i.replace(mm,_m)}const gm=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function _m(i,e){let t=ze[e];if(t===void 0){const n=gm.get(e);if(n!==void 0)t=ze[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ba(t)}const vm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ul(i){return i.replace(vm,xm)}function xm(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function dl(i){let e="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Sm(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===ql?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Kc?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Mn&&(e="SHADOWMAP_TYPE_VSM"),e}function Mm(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Hi:case Vi:e="ENVMAP_TYPE_CUBE";break;case ur:e="ENVMAP_TYPE_CUBE_UV";break}return e}function ym(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Vi:e="ENVMAP_MODE_REFRACTION";break}return e}function Em(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Yl:e="ENVMAP_BLENDING_MULTIPLY";break;case xh:e="ENVMAP_BLENDING_MIX";break;case Sh:e="ENVMAP_BLENDING_ADD";break}return e}function bm(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Tm(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Sm(t),c=Mm(t),h=ym(t),u=Em(t),f=bm(t),m=t.isWebGL2?"":um(t),g=dm(t),_=fm(r),p=s.createProgram();let d,y,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Bi).join(`
`),d.length>0&&(d+=`
`),y=[m,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Bi).join(`
`),y.length>0&&(y+=`
`)):(d=[dl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Bi).join(`
`),y=[m,dl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Gn?"#define TONE_MAPPING":"",t.toneMapping!==Gn?ze.tonemapping_pars_fragment:"",t.toneMapping!==Gn?hm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ze.colorspace_pars_fragment,cm("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Bi).join(`
`)),a=ba(a),a=cl(a,t),a=hl(a,t),o=ba(o),o=cl(o,t),o=hl(o,t),a=ul(a),o=ul(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,d=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,y=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===Lo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Lo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const b=S+d+a,R=S+y+o,w=ol(s,s.VERTEX_SHADER,b),A=ol(s,s.FRAGMENT_SHADER,R);s.attachShader(p,w),s.attachShader(p,A),t.index0AttributeName!==void 0?s.bindAttribLocation(p,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function k(W){if(i.debug.checkShaderErrors){const ee=s.getProgramInfoLog(p).trim(),L=s.getShaderInfoLog(w).trim(),I=s.getShaderInfoLog(A).trim();let H=!0,Z=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,w,A);else{const Y=ll(s,w,"vertex"),j=ll(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Program Info Log: `+ee+`
`+Y+`
`+j)}else ee!==""?console.warn("THREE.WebGLProgram: Program Info Log:",ee):(L===""||I==="")&&(Z=!1);Z&&(W.diagnostics={runnable:H,programLog:ee,vertexShader:{log:L,prefix:d},fragmentShader:{log:I,prefix:y}})}s.deleteShader(w),s.deleteShader(A),v=new Js(s,p),T=pm(s,p)}let v;this.getUniforms=function(){return v===void 0&&k(this),v};let T;this.getAttributes=function(){return T===void 0&&k(this),T};let G=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return G===!1&&(G=s.getProgramParameter(p,rm)),G},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=am++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=w,this.fragmentShader=A,this}let wm=0;class Am{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Rm(e),t.set(e,n)),n}}class Rm{constructor(e){this.id=wm++,this.code=e,this.usedTimes=0}}function Cm(i,e,t,n,s,r,a){const o=new uc,l=new Am,c=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,f=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(v){return v===0?"uv":`uv${v}`}function p(v,T,G,W,ee){const L=W.fog,I=ee.geometry,H=v.isMeshStandardMaterial?W.environment:null,Z=(v.isMeshStandardMaterial?t:e).get(v.envMap||H),Y=Z&&Z.mapping===ur?Z.image.height:null,j=g[v.type];v.precision!==null&&(m=s.getMaxPrecision(v.precision),m!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",m,"instead."));const Q=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,ie=Q!==void 0?Q.length:0;let re=0;I.morphAttributes.position!==void 0&&(re=1),I.morphAttributes.normal!==void 0&&(re=2),I.morphAttributes.color!==void 0&&(re=3);let X,J,le,_e;if(j){const Pt=pn[j];X=Pt.vertexShader,J=Pt.fragmentShader}else X=v.vertexShader,J=v.fragmentShader,l.update(v),le=l.getVertexShaderID(v),_e=l.getFragmentShaderID(v);const ge=i.getRenderTarget(),Le=ee.isInstancedMesh===!0,De=ee.isBatchedMesh===!0,be=!!v.map,Ue=!!v.matcap,N=!!Z,pe=!!v.aoMap,xe=!!v.lightMap,Ae=!!v.bumpMap,me=!!v.normalMap,nt=!!v.displacementMap,Ne=!!v.emissiveMap,E=!!v.metalnessMap,x=!!v.roughnessMap,F=v.anisotropy>0,P=v.clearcoat>0,z=v.iridescence>0,$=v.sheen>0,ne=v.transmission>0,se=F&&!!v.anisotropyMap,ce=P&&!!v.clearcoatMap,we=P&&!!v.clearcoatNormalMap,ke=P&&!!v.clearcoatRoughnessMap,te=z&&!!v.iridescenceMap,Je=z&&!!v.iridescenceThicknessMap,qe=$&&!!v.sheenColorMap,Pe=$&&!!v.sheenRoughnessMap,Me=!!v.specularMap,fe=!!v.specularColorMap,Be=!!v.specularIntensityMap,Ze=ne&&!!v.transmissionMap,ct=ne&&!!v.thicknessMap,He=!!v.gradientMap,ae=!!v.alphaMap,C=v.alphaTest>0,he=!!v.alphaHash,ue=!!v.extensions,Re=!!I.attributes.uv1,ye=!!I.attributes.uv2,it=!!I.attributes.uv3;let st=Gn;return v.toneMapped&&(ge===null||ge.isXRRenderTarget===!0)&&(st=i.toneMapping),{isWebGL2:h,shaderID:j,shaderType:v.type,shaderName:v.name,vertexShader:X,fragmentShader:J,defines:v.defines,customVertexShaderID:le,customFragmentShaderID:_e,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:m,batching:De,instancing:Le,instancingColor:Le&&ee.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:ge===null?i.outputColorSpace:ge.isXRRenderTarget===!0?ge.texture.colorSpace:Tn,map:be,matcap:Ue,envMap:N,envMapMode:N&&Z.mapping,envMapCubeUVHeight:Y,aoMap:pe,lightMap:xe,bumpMap:Ae,normalMap:me,displacementMap:f&&nt,emissiveMap:Ne,normalMapObjectSpace:me&&v.normalMapType===Oh,normalMapTangentSpace:me&&v.normalMapType===sc,metalnessMap:E,roughnessMap:x,anisotropy:F,anisotropyMap:se,clearcoat:P,clearcoatMap:ce,clearcoatNormalMap:we,clearcoatRoughnessMap:ke,iridescence:z,iridescenceMap:te,iridescenceThicknessMap:Je,sheen:$,sheenColorMap:qe,sheenRoughnessMap:Pe,specularMap:Me,specularColorMap:fe,specularIntensityMap:Be,transmission:ne,transmissionMap:Ze,thicknessMap:ct,gradientMap:He,opaque:v.transparent===!1&&v.blending===ki,alphaMap:ae,alphaTest:C,alphaHash:he,combine:v.combine,mapUv:be&&_(v.map.channel),aoMapUv:pe&&_(v.aoMap.channel),lightMapUv:xe&&_(v.lightMap.channel),bumpMapUv:Ae&&_(v.bumpMap.channel),normalMapUv:me&&_(v.normalMap.channel),displacementMapUv:nt&&_(v.displacementMap.channel),emissiveMapUv:Ne&&_(v.emissiveMap.channel),metalnessMapUv:E&&_(v.metalnessMap.channel),roughnessMapUv:x&&_(v.roughnessMap.channel),anisotropyMapUv:se&&_(v.anisotropyMap.channel),clearcoatMapUv:ce&&_(v.clearcoatMap.channel),clearcoatNormalMapUv:we&&_(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ke&&_(v.clearcoatRoughnessMap.channel),iridescenceMapUv:te&&_(v.iridescenceMap.channel),iridescenceThicknessMapUv:Je&&_(v.iridescenceThicknessMap.channel),sheenColorMapUv:qe&&_(v.sheenColorMap.channel),sheenRoughnessMapUv:Pe&&_(v.sheenRoughnessMap.channel),specularMapUv:Me&&_(v.specularMap.channel),specularColorMapUv:fe&&_(v.specularColorMap.channel),specularIntensityMapUv:Be&&_(v.specularIntensityMap.channel),transmissionMapUv:Ze&&_(v.transmissionMap.channel),thicknessMapUv:ct&&_(v.thicknessMap.channel),alphaMapUv:ae&&_(v.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(me||F),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,vertexUv1s:Re,vertexUv2s:ye,vertexUv3s:it,pointsUvs:ee.isPoints===!0&&!!I.attributes.uv&&(be||ae),fog:!!L,useFog:v.fog===!0,fogExp2:L&&L.isFogExp2,flatShading:v.flatShading===!0,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:ee.isSkinnedMesh===!0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:ie,morphTextureStride:re,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&G.length>0,shadowMapType:i.shadowMap.type,toneMapping:st,useLegacyLights:i._useLegacyLights,decodeVideoTexture:be&&v.map.isVideoTexture===!0&&Qe.getTransfer(v.map.colorSpace)===at,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===yn,flipSided:v.side===Ht,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionDerivatives:ue&&v.extensions.derivatives===!0,extensionFragDepth:ue&&v.extensions.fragDepth===!0,extensionDrawBuffers:ue&&v.extensions.drawBuffers===!0,extensionShaderTextureLOD:ue&&v.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ue&&v.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()}}function d(v){const T=[];if(v.shaderID?T.push(v.shaderID):(T.push(v.customVertexShaderID),T.push(v.customFragmentShaderID)),v.defines!==void 0)for(const G in v.defines)T.push(G),T.push(v.defines[G]);return v.isRawShaderMaterial===!1&&(y(T,v),S(T,v),T.push(i.outputColorSpace)),T.push(v.customProgramCacheKey),T.join()}function y(v,T){v.push(T.precision),v.push(T.outputColorSpace),v.push(T.envMapMode),v.push(T.envMapCubeUVHeight),v.push(T.mapUv),v.push(T.alphaMapUv),v.push(T.lightMapUv),v.push(T.aoMapUv),v.push(T.bumpMapUv),v.push(T.normalMapUv),v.push(T.displacementMapUv),v.push(T.emissiveMapUv),v.push(T.metalnessMapUv),v.push(T.roughnessMapUv),v.push(T.anisotropyMapUv),v.push(T.clearcoatMapUv),v.push(T.clearcoatNormalMapUv),v.push(T.clearcoatRoughnessMapUv),v.push(T.iridescenceMapUv),v.push(T.iridescenceThicknessMapUv),v.push(T.sheenColorMapUv),v.push(T.sheenRoughnessMapUv),v.push(T.specularMapUv),v.push(T.specularColorMapUv),v.push(T.specularIntensityMapUv),v.push(T.transmissionMapUv),v.push(T.thicknessMapUv),v.push(T.combine),v.push(T.fogExp2),v.push(T.sizeAttenuation),v.push(T.morphTargetsCount),v.push(T.morphAttributeCount),v.push(T.numDirLights),v.push(T.numPointLights),v.push(T.numSpotLights),v.push(T.numSpotLightMaps),v.push(T.numHemiLights),v.push(T.numRectAreaLights),v.push(T.numDirLightShadows),v.push(T.numPointLightShadows),v.push(T.numSpotLightShadows),v.push(T.numSpotLightShadowsWithMaps),v.push(T.numLightProbes),v.push(T.shadowMapType),v.push(T.toneMapping),v.push(T.numClippingPlanes),v.push(T.numClipIntersection),v.push(T.depthPacking)}function S(v,T){o.disableAll(),T.isWebGL2&&o.enable(0),T.supportsVertexTextures&&o.enable(1),T.instancing&&o.enable(2),T.instancingColor&&o.enable(3),T.matcap&&o.enable(4),T.envMap&&o.enable(5),T.normalMapObjectSpace&&o.enable(6),T.normalMapTangentSpace&&o.enable(7),T.clearcoat&&o.enable(8),T.iridescence&&o.enable(9),T.alphaTest&&o.enable(10),T.vertexColors&&o.enable(11),T.vertexAlphas&&o.enable(12),T.vertexUv1s&&o.enable(13),T.vertexUv2s&&o.enable(14),T.vertexUv3s&&o.enable(15),T.vertexTangents&&o.enable(16),T.anisotropy&&o.enable(17),T.alphaHash&&o.enable(18),T.batching&&o.enable(19),v.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.skinning&&o.enable(4),T.morphTargets&&o.enable(5),T.morphNormals&&o.enable(6),T.morphColors&&o.enable(7),T.premultipliedAlpha&&o.enable(8),T.shadowMapEnabled&&o.enable(9),T.useLegacyLights&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),v.push(o.mask)}function b(v){const T=g[v.type];let G;if(T){const W=pn[T];G=hu.clone(W.uniforms)}else G=v.uniforms;return G}function R(v,T){let G;for(let W=0,ee=c.length;W<ee;W++){const L=c[W];if(L.cacheKey===T){G=L,++G.usedTimes;break}}return G===void 0&&(G=new Tm(i,T,v,r),c.push(G)),G}function w(v){if(--v.usedTimes===0){const T=c.indexOf(v);c[T]=c[c.length-1],c.pop(),v.destroy()}}function A(v){l.remove(v)}function k(){l.dispose()}return{getParameters:p,getProgramCacheKey:d,getUniforms:b,acquireProgram:R,releaseProgram:w,releaseShaderCache:A,programs:c,dispose:k}}function Lm(){let i=new WeakMap;function e(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function t(r){i.delete(r)}function n(r,a,o){i.get(r)[a]=o}function s(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:s}}function Pm(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function fl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function pl(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,f,m,g,_,p){let d=i[e];return d===void 0?(d={id:u.id,object:u,geometry:f,material:m,groupOrder:g,renderOrder:u.renderOrder,z:_,group:p},i[e]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=m,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=_,d.group=p),e++,d}function o(u,f,m,g,_,p){const d=a(u,f,m,g,_,p);m.transmission>0?n.push(d):m.transparent===!0?s.push(d):t.push(d)}function l(u,f,m,g,_,p){const d=a(u,f,m,g,_,p);m.transmission>0?n.unshift(d):m.transparent===!0?s.unshift(d):t.unshift(d)}function c(u,f){t.length>1&&t.sort(u||Pm),n.length>1&&n.sort(f||fl),s.length>1&&s.sort(f||fl)}function h(){for(let u=e,f=i.length;u<f;u++){const m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function Dm(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new pl,i.set(n,[a])):s>=r.length?(a=new pl,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Um(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new U,color:new $e};break;case"SpotLight":t={position:new U,direction:new U,color:new $e,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new U,color:new $e,distance:0,decay:0};break;case"HemisphereLight":t={direction:new U,skyColor:new $e,groundColor:new $e};break;case"RectAreaLight":t={color:new $e,position:new U,halfWidth:new U,halfHeight:new U};break}return i[e.id]=t,t}}}function Im(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Nm=0;function Fm(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Om(i,e){const t=new Um,n=Im(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new U);const r=new U,a=new pt,o=new pt;function l(h,u){let f=0,m=0,g=0;for(let W=0;W<9;W++)s.probe[W].set(0,0,0);let _=0,p=0,d=0,y=0,S=0,b=0,R=0,w=0,A=0,k=0,v=0;h.sort(Fm);const T=u===!0?Math.PI:1;for(let W=0,ee=h.length;W<ee;W++){const L=h[W],I=L.color,H=L.intensity,Z=L.distance,Y=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)f+=I.r*H*T,m+=I.g*H*T,g+=I.b*H*T;else if(L.isLightProbe){for(let j=0;j<9;j++)s.probe[j].addScaledVector(L.sh.coefficients[j],H);v++}else if(L.isDirectionalLight){const j=t.get(L);if(j.color.copy(L.color).multiplyScalar(L.intensity*T),L.castShadow){const Q=L.shadow,ie=n.get(L);ie.shadowBias=Q.bias,ie.shadowNormalBias=Q.normalBias,ie.shadowRadius=Q.radius,ie.shadowMapSize=Q.mapSize,s.directionalShadow[_]=ie,s.directionalShadowMap[_]=Y,s.directionalShadowMatrix[_]=L.shadow.matrix,b++}s.directional[_]=j,_++}else if(L.isSpotLight){const j=t.get(L);j.position.setFromMatrixPosition(L.matrixWorld),j.color.copy(I).multiplyScalar(H*T),j.distance=Z,j.coneCos=Math.cos(L.angle),j.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),j.decay=L.decay,s.spot[d]=j;const Q=L.shadow;if(L.map&&(s.spotLightMap[A]=L.map,A++,Q.updateMatrices(L),L.castShadow&&k++),s.spotLightMatrix[d]=Q.matrix,L.castShadow){const ie=n.get(L);ie.shadowBias=Q.bias,ie.shadowNormalBias=Q.normalBias,ie.shadowRadius=Q.radius,ie.shadowMapSize=Q.mapSize,s.spotShadow[d]=ie,s.spotShadowMap[d]=Y,w++}d++}else if(L.isRectAreaLight){const j=t.get(L);j.color.copy(I).multiplyScalar(H),j.halfWidth.set(L.width*.5,0,0),j.halfHeight.set(0,L.height*.5,0),s.rectArea[y]=j,y++}else if(L.isPointLight){const j=t.get(L);if(j.color.copy(L.color).multiplyScalar(L.intensity*T),j.distance=L.distance,j.decay=L.decay,L.castShadow){const Q=L.shadow,ie=n.get(L);ie.shadowBias=Q.bias,ie.shadowNormalBias=Q.normalBias,ie.shadowRadius=Q.radius,ie.shadowMapSize=Q.mapSize,ie.shadowCameraNear=Q.camera.near,ie.shadowCameraFar=Q.camera.far,s.pointShadow[p]=ie,s.pointShadowMap[p]=Y,s.pointShadowMatrix[p]=L.shadow.matrix,R++}s.point[p]=j,p++}else if(L.isHemisphereLight){const j=t.get(L);j.skyColor.copy(L.color).multiplyScalar(H*T),j.groundColor.copy(L.groundColor).multiplyScalar(H*T),s.hemi[S]=j,S++}}y>0&&(e.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=oe.LTC_FLOAT_1,s.rectAreaLTC2=oe.LTC_FLOAT_2):(s.rectAreaLTC1=oe.LTC_HALF_1,s.rectAreaLTC2=oe.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=oe.LTC_FLOAT_1,s.rectAreaLTC2=oe.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=oe.LTC_HALF_1,s.rectAreaLTC2=oe.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=m,s.ambient[2]=g;const G=s.hash;(G.directionalLength!==_||G.pointLength!==p||G.spotLength!==d||G.rectAreaLength!==y||G.hemiLength!==S||G.numDirectionalShadows!==b||G.numPointShadows!==R||G.numSpotShadows!==w||G.numSpotMaps!==A||G.numLightProbes!==v)&&(s.directional.length=_,s.spot.length=d,s.rectArea.length=y,s.point.length=p,s.hemi.length=S,s.directionalShadow.length=b,s.directionalShadowMap.length=b,s.pointShadow.length=R,s.pointShadowMap.length=R,s.spotShadow.length=w,s.spotShadowMap.length=w,s.directionalShadowMatrix.length=b,s.pointShadowMatrix.length=R,s.spotLightMatrix.length=w+A-k,s.spotLightMap.length=A,s.numSpotLightShadowsWithMaps=k,s.numLightProbes=v,G.directionalLength=_,G.pointLength=p,G.spotLength=d,G.rectAreaLength=y,G.hemiLength=S,G.numDirectionalShadows=b,G.numPointShadows=R,G.numSpotShadows=w,G.numSpotMaps=A,G.numLightProbes=v,s.version=Nm++)}function c(h,u){let f=0,m=0,g=0,_=0,p=0;const d=u.matrixWorldInverse;for(let y=0,S=h.length;y<S;y++){const b=h[y];if(b.isDirectionalLight){const R=s.directional[f];R.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(d),f++}else if(b.isSpotLight){const R=s.spot[g];R.position.setFromMatrixPosition(b.matrixWorld),R.position.applyMatrix4(d),R.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(d),g++}else if(b.isRectAreaLight){const R=s.rectArea[_];R.position.setFromMatrixPosition(b.matrixWorld),R.position.applyMatrix4(d),o.identity(),a.copy(b.matrixWorld),a.premultiply(d),o.extractRotation(a),R.halfWidth.set(b.width*.5,0,0),R.halfHeight.set(0,b.height*.5,0),R.halfWidth.applyMatrix4(o),R.halfHeight.applyMatrix4(o),_++}else if(b.isPointLight){const R=s.point[m];R.position.setFromMatrixPosition(b.matrixWorld),R.position.applyMatrix4(d),m++}else if(b.isHemisphereLight){const R=s.hemi[p];R.direction.setFromMatrixPosition(b.matrixWorld),R.direction.transformDirection(d),p++}}}return{setup:l,setupView:c,state:s}}function ml(i,e){const t=new Om(i,e),n=[],s=[];function r(){n.length=0,s.length=0}function a(u){n.push(u)}function o(u){s.push(u)}function l(u){t.setup(n,u)}function c(u){t.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:t},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function Bm(i,e){let t=new WeakMap;function n(r,a=0){const o=t.get(r);let l;return o===void 0?(l=new ml(i,e),t.set(r,[l])):a>=o.length?(l=new ml(i,e),o.push(l)):l=o[a],l}function s(){t=new WeakMap}return{get:n,dispose:s}}class zm extends ui{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Nh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class km extends ui{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Gm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Hm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Vm(i,e,t){let n=new La;const s=new Oe,r=new Oe,a=new Tt,o=new zm({depthPacking:Fh}),l=new km,c={},h=t.maxTextureSize,u={[Xn]:Ht,[Ht]:Xn,[yn]:yn},f=new ci({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Oe},radius:{value:4}},vertexShader:Gm,fragmentShader:Hm}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const g=new qt;g.setAttribute("position",new nn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new vt(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ql;let d=this.type;this.render=function(w,A,k){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const v=i.getRenderTarget(),T=i.getActiveCubeFace(),G=i.getActiveMipmapLevel(),W=i.state;W.setBlending(kn),W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const ee=d!==Mn&&this.type===Mn,L=d===Mn&&this.type!==Mn;for(let I=0,H=w.length;I<H;I++){const Z=w[I],Y=Z.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);const j=Y.getFrameExtents();if(s.multiply(j),r.copy(Y.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/j.x),s.x=r.x*j.x,Y.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/j.y),s.y=r.y*j.y,Y.mapSize.y=r.y)),Y.map===null||ee===!0||L===!0){const ie=this.type!==Mn?{minFilter:Ft,magFilter:Ft}:{};Y.map!==null&&Y.map.dispose(),Y.map=new li(s.x,s.y,ie),Y.map.texture.name=Z.name+".shadowMap",Y.camera.updateProjectionMatrix()}i.setRenderTarget(Y.map),i.clear();const Q=Y.getViewportCount();for(let ie=0;ie<Q;ie++){const re=Y.getViewport(ie);a.set(r.x*re.x,r.y*re.y,r.x*re.z,r.y*re.w),W.viewport(a),Y.updateMatrices(Z,ie),n=Y.getFrustum(),b(A,k,Y.camera,Z,this.type)}Y.isPointLightShadow!==!0&&this.type===Mn&&y(Y,k),Y.needsUpdate=!1}d=this.type,p.needsUpdate=!1,i.setRenderTarget(v,T,G)};function y(w,A){const k=e.update(_);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new li(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(A,null,k,f,_,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(A,null,k,m,_,null)}function S(w,A,k,v){let T=null;const G=k.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(G!==void 0)T=G;else if(T=k.isPointLight===!0?l:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const W=T.uuid,ee=A.uuid;let L=c[W];L===void 0&&(L={},c[W]=L);let I=L[ee];I===void 0&&(I=T.clone(),L[ee]=I,A.addEventListener("dispose",R)),T=I}if(T.visible=A.visible,T.wireframe=A.wireframe,v===Mn?T.side=A.shadowSide!==null?A.shadowSide:A.side:T.side=A.shadowSide!==null?A.shadowSide:u[A.side],T.alphaMap=A.alphaMap,T.alphaTest=A.alphaTest,T.map=A.map,T.clipShadows=A.clipShadows,T.clippingPlanes=A.clippingPlanes,T.clipIntersection=A.clipIntersection,T.displacementMap=A.displacementMap,T.displacementScale=A.displacementScale,T.displacementBias=A.displacementBias,T.wireframeLinewidth=A.wireframeLinewidth,T.linewidth=A.linewidth,k.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const W=i.properties.get(T);W.light=k}return T}function b(w,A,k,v,T){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&T===Mn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,w.matrixWorld);const ee=e.update(w),L=w.material;if(Array.isArray(L)){const I=ee.groups;for(let H=0,Z=I.length;H<Z;H++){const Y=I[H],j=L[Y.materialIndex];if(j&&j.visible){const Q=S(w,j,v,T);w.onBeforeShadow(i,w,A,k,ee,Q,Y),i.renderBufferDirect(k,null,ee,Q,w,Y),w.onAfterShadow(i,w,A,k,ee,Q,Y)}}}else if(L.visible){const I=S(w,L,v,T);w.onBeforeShadow(i,w,A,k,ee,I,null),i.renderBufferDirect(k,null,ee,I,w,null),w.onAfterShadow(i,w,A,k,ee,I,null)}}const W=w.children;for(let ee=0,L=W.length;ee<L;ee++)b(W[ee],A,k,v,T)}function R(w){w.target.removeEventListener("dispose",R);for(const k in c){const v=c[k],T=w.target.uuid;T in v&&(v[T].dispose(),delete v[T])}}}function Wm(i,e,t){const n=t.isWebGL2;function s(){let C=!1;const he=new Tt;let ue=null;const Re=new Tt(0,0,0,0);return{setMask:function(ye){ue!==ye&&!C&&(i.colorMask(ye,ye,ye,ye),ue=ye)},setLocked:function(ye){C=ye},setClear:function(ye,it,st,yt,Pt){Pt===!0&&(ye*=yt,it*=yt,st*=yt),he.set(ye,it,st,yt),Re.equals(he)===!1&&(i.clearColor(ye,it,st,yt),Re.copy(he))},reset:function(){C=!1,ue=null,Re.set(-1,0,0,0)}}}function r(){let C=!1,he=null,ue=null,Re=null;return{setTest:function(ye){ye?De(i.DEPTH_TEST):be(i.DEPTH_TEST)},setMask:function(ye){he!==ye&&!C&&(i.depthMask(ye),he=ye)},setFunc:function(ye){if(ue!==ye){switch(ye){case dh:i.depthFunc(i.NEVER);break;case fh:i.depthFunc(i.ALWAYS);break;case ph:i.depthFunc(i.LESS);break;case Qs:i.depthFunc(i.LEQUAL);break;case mh:i.depthFunc(i.EQUAL);break;case gh:i.depthFunc(i.GEQUAL);break;case _h:i.depthFunc(i.GREATER);break;case vh:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ue=ye}},setLocked:function(ye){C=ye},setClear:function(ye){Re!==ye&&(i.clearDepth(ye),Re=ye)},reset:function(){C=!1,he=null,ue=null,Re=null}}}function a(){let C=!1,he=null,ue=null,Re=null,ye=null,it=null,st=null,yt=null,Pt=null;return{setTest:function(rt){C||(rt?De(i.STENCIL_TEST):be(i.STENCIL_TEST))},setMask:function(rt){he!==rt&&!C&&(i.stencilMask(rt),he=rt)},setFunc:function(rt,Dt,un){(ue!==rt||Re!==Dt||ye!==un)&&(i.stencilFunc(rt,Dt,un),ue=rt,Re=Dt,ye=un)},setOp:function(rt,Dt,un){(it!==rt||st!==Dt||yt!==un)&&(i.stencilOp(rt,Dt,un),it=rt,st=Dt,yt=un)},setLocked:function(rt){C=rt},setClear:function(rt){Pt!==rt&&(i.clearStencil(rt),Pt=rt)},reset:function(){C=!1,he=null,ue=null,Re=null,ye=null,it=null,st=null,yt=null,Pt=null}}}const o=new s,l=new r,c=new a,h=new WeakMap,u=new WeakMap;let f={},m={},g=new WeakMap,_=[],p=null,d=!1,y=null,S=null,b=null,R=null,w=null,A=null,k=null,v=new $e(0,0,0),T=0,G=!1,W=null,ee=null,L=null,I=null,H=null;const Z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,j=0;const Q=i.getParameter(i.VERSION);Q.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(Q)[1]),Y=j>=1):Q.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),Y=j>=2);let ie=null,re={};const X=i.getParameter(i.SCISSOR_BOX),J=i.getParameter(i.VIEWPORT),le=new Tt().fromArray(X),_e=new Tt().fromArray(J);function ge(C,he,ue,Re){const ye=new Uint8Array(4),it=i.createTexture();i.bindTexture(C,it),i.texParameteri(C,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(C,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let st=0;st<ue;st++)n&&(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)?i.texImage3D(he,0,i.RGBA,1,1,Re,0,i.RGBA,i.UNSIGNED_BYTE,ye):i.texImage2D(he+st,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ye);return it}const Le={};Le[i.TEXTURE_2D]=ge(i.TEXTURE_2D,i.TEXTURE_2D,1),Le[i.TEXTURE_CUBE_MAP]=ge(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Le[i.TEXTURE_2D_ARRAY]=ge(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Le[i.TEXTURE_3D]=ge(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),De(i.DEPTH_TEST),l.setFunc(Qs),Ne(!1),E(ja),De(i.CULL_FACE),me(kn);function De(C){f[C]!==!0&&(i.enable(C),f[C]=!0)}function be(C){f[C]!==!1&&(i.disable(C),f[C]=!1)}function Ue(C,he){return m[C]!==he?(i.bindFramebuffer(C,he),m[C]=he,n&&(C===i.DRAW_FRAMEBUFFER&&(m[i.FRAMEBUFFER]=he),C===i.FRAMEBUFFER&&(m[i.DRAW_FRAMEBUFFER]=he)),!0):!1}function N(C,he){let ue=_,Re=!1;if(C)if(ue=g.get(he),ue===void 0&&(ue=[],g.set(he,ue)),C.isWebGLMultipleRenderTargets){const ye=C.texture;if(ue.length!==ye.length||ue[0]!==i.COLOR_ATTACHMENT0){for(let it=0,st=ye.length;it<st;it++)ue[it]=i.COLOR_ATTACHMENT0+it;ue.length=ye.length,Re=!0}}else ue[0]!==i.COLOR_ATTACHMENT0&&(ue[0]=i.COLOR_ATTACHMENT0,Re=!0);else ue[0]!==i.BACK&&(ue[0]=i.BACK,Re=!0);Re&&(t.isWebGL2?i.drawBuffers(ue):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(ue))}function pe(C){return p!==C?(i.useProgram(C),p=C,!0):!1}const xe={[ni]:i.FUNC_ADD,[Zc]:i.FUNC_SUBTRACT,[Jc]:i.FUNC_REVERSE_SUBTRACT};if(n)xe[eo]=i.MIN,xe[to]=i.MAX;else{const C=e.get("EXT_blend_minmax");C!==null&&(xe[eo]=C.MIN_EXT,xe[to]=C.MAX_EXT)}const Ae={[Qc]:i.ZERO,[eh]:i.ONE,[th]:i.SRC_COLOR,[ma]:i.SRC_ALPHA,[oh]:i.SRC_ALPHA_SATURATE,[rh]:i.DST_COLOR,[ih]:i.DST_ALPHA,[nh]:i.ONE_MINUS_SRC_COLOR,[ga]:i.ONE_MINUS_SRC_ALPHA,[ah]:i.ONE_MINUS_DST_COLOR,[sh]:i.ONE_MINUS_DST_ALPHA,[lh]:i.CONSTANT_COLOR,[ch]:i.ONE_MINUS_CONSTANT_COLOR,[hh]:i.CONSTANT_ALPHA,[uh]:i.ONE_MINUS_CONSTANT_ALPHA};function me(C,he,ue,Re,ye,it,st,yt,Pt,rt){if(C===kn){d===!0&&(be(i.BLEND),d=!1);return}if(d===!1&&(De(i.BLEND),d=!0),C!==jc){if(C!==y||rt!==G){if((S!==ni||w!==ni)&&(i.blendEquation(i.FUNC_ADD),S=ni,w=ni),rt)switch(C){case ki:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Za:i.blendFunc(i.ONE,i.ONE);break;case Ja:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Qa:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}else switch(C){case ki:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Za:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Ja:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Qa:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}b=null,R=null,A=null,k=null,v.set(0,0,0),T=0,y=C,G=rt}return}ye=ye||he,it=it||ue,st=st||Re,(he!==S||ye!==w)&&(i.blendEquationSeparate(xe[he],xe[ye]),S=he,w=ye),(ue!==b||Re!==R||it!==A||st!==k)&&(i.blendFuncSeparate(Ae[ue],Ae[Re],Ae[it],Ae[st]),b=ue,R=Re,A=it,k=st),(yt.equals(v)===!1||Pt!==T)&&(i.blendColor(yt.r,yt.g,yt.b,Pt),v.copy(yt),T=Pt),y=C,G=!1}function nt(C,he){C.side===yn?be(i.CULL_FACE):De(i.CULL_FACE);let ue=C.side===Ht;he&&(ue=!ue),Ne(ue),C.blending===ki&&C.transparent===!1?me(kn):me(C.blending,C.blendEquation,C.blendSrc,C.blendDst,C.blendEquationAlpha,C.blendSrcAlpha,C.blendDstAlpha,C.blendColor,C.blendAlpha,C.premultipliedAlpha),l.setFunc(C.depthFunc),l.setTest(C.depthTest),l.setMask(C.depthWrite),o.setMask(C.colorWrite);const Re=C.stencilWrite;c.setTest(Re),Re&&(c.setMask(C.stencilWriteMask),c.setFunc(C.stencilFunc,C.stencilRef,C.stencilFuncMask),c.setOp(C.stencilFail,C.stencilZFail,C.stencilZPass)),F(C.polygonOffset,C.polygonOffsetFactor,C.polygonOffsetUnits),C.alphaToCoverage===!0?De(i.SAMPLE_ALPHA_TO_COVERAGE):be(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ne(C){W!==C&&(C?i.frontFace(i.CW):i.frontFace(i.CCW),W=C)}function E(C){C!==Yc?(De(i.CULL_FACE),C!==ee&&(C===ja?i.cullFace(i.BACK):C===$c?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):be(i.CULL_FACE),ee=C}function x(C){C!==L&&(Y&&i.lineWidth(C),L=C)}function F(C,he,ue){C?(De(i.POLYGON_OFFSET_FILL),(I!==he||H!==ue)&&(i.polygonOffset(he,ue),I=he,H=ue)):be(i.POLYGON_OFFSET_FILL)}function P(C){C?De(i.SCISSOR_TEST):be(i.SCISSOR_TEST)}function z(C){C===void 0&&(C=i.TEXTURE0+Z-1),ie!==C&&(i.activeTexture(C),ie=C)}function $(C,he,ue){ue===void 0&&(ie===null?ue=i.TEXTURE0+Z-1:ue=ie);let Re=re[ue];Re===void 0&&(Re={type:void 0,texture:void 0},re[ue]=Re),(Re.type!==C||Re.texture!==he)&&(ie!==ue&&(i.activeTexture(ue),ie=ue),i.bindTexture(C,he||Le[C]),Re.type=C,Re.texture=he)}function ne(){const C=re[ie];C!==void 0&&C.type!==void 0&&(i.bindTexture(C.type,null),C.type=void 0,C.texture=void 0)}function se(){try{i.compressedTexImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ce(){try{i.compressedTexImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function we(){try{i.texSubImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ke(){try{i.texSubImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function te(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Je(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function qe(){try{i.texStorage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Pe(){try{i.texStorage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Me(){try{i.texImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function fe(){try{i.texImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Be(C){le.equals(C)===!1&&(i.scissor(C.x,C.y,C.z,C.w),le.copy(C))}function Ze(C){_e.equals(C)===!1&&(i.viewport(C.x,C.y,C.z,C.w),_e.copy(C))}function ct(C,he){let ue=u.get(he);ue===void 0&&(ue=new WeakMap,u.set(he,ue));let Re=ue.get(C);Re===void 0&&(Re=i.getUniformBlockIndex(he,C.name),ue.set(C,Re))}function He(C,he){const Re=u.get(he).get(C);h.get(he)!==Re&&(i.uniformBlockBinding(he,Re,C.__bindingPointIndex),h.set(he,Re))}function ae(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},ie=null,re={},m={},g=new WeakMap,_=[],p=null,d=!1,y=null,S=null,b=null,R=null,w=null,A=null,k=null,v=new $e(0,0,0),T=0,G=!1,W=null,ee=null,L=null,I=null,H=null,le.set(0,0,i.canvas.width,i.canvas.height),_e.set(0,0,i.canvas.width,i.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:De,disable:be,bindFramebuffer:Ue,drawBuffers:N,useProgram:pe,setBlending:me,setMaterial:nt,setFlipSided:Ne,setCullFace:E,setLineWidth:x,setPolygonOffset:F,setScissorTest:P,activeTexture:z,bindTexture:$,unbindTexture:ne,compressedTexImage2D:se,compressedTexImage3D:ce,texImage2D:Me,texImage3D:fe,updateUBOMapping:ct,uniformBlockBinding:He,texStorage2D:qe,texStorage3D:Pe,texSubImage2D:we,texSubImage3D:ke,compressedTexSubImage2D:te,compressedTexSubImage3D:Je,scissor:Be,viewport:Ze,reset:ae}}function Xm(i,e,t,n,s,r,a){const o=s.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(E,x){return m?new OffscreenCanvas(E,x):us("canvas")}function _(E,x,F,P){let z=1;if((E.width>P||E.height>P)&&(z=P/Math.max(E.width,E.height)),z<1||x===!0)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap){const $=x?Ea:Math.floor,ne=$(z*E.width),se=$(z*E.height);u===void 0&&(u=g(ne,se));const ce=F?g(ne,se):u;return ce.width=ne,ce.height=se,ce.getContext("2d").drawImage(E,0,0,ne,se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+E.width+"x"+E.height+") to ("+ne+"x"+se+")."),ce}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+E.width+"x"+E.height+")."),E;return E}function p(E){return Po(E.width)&&Po(E.height)}function d(E){return o?!1:E.wrapS!==cn||E.wrapT!==cn||E.minFilter!==Ft&&E.minFilter!==Zt}function y(E,x){return E.generateMipmaps&&x&&E.minFilter!==Ft&&E.minFilter!==Zt}function S(E){i.generateMipmap(E)}function b(E,x,F,P,z=!1){if(o===!1)return x;if(E!==null){if(i[E]!==void 0)return i[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let $=x;if(x===i.RED&&(F===i.FLOAT&&($=i.R32F),F===i.HALF_FLOAT&&($=i.R16F),F===i.UNSIGNED_BYTE&&($=i.R8)),x===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&($=i.R8UI),F===i.UNSIGNED_SHORT&&($=i.R16UI),F===i.UNSIGNED_INT&&($=i.R32UI),F===i.BYTE&&($=i.R8I),F===i.SHORT&&($=i.R16I),F===i.INT&&($=i.R32I)),x===i.RG&&(F===i.FLOAT&&($=i.RG32F),F===i.HALF_FLOAT&&($=i.RG16F),F===i.UNSIGNED_BYTE&&($=i.RG8)),x===i.RGBA){const ne=z?tr:Qe.getTransfer(P);F===i.FLOAT&&($=i.RGBA32F),F===i.HALF_FLOAT&&($=i.RGBA16F),F===i.UNSIGNED_BYTE&&($=ne===at?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function R(E,x,F){return y(E,F)===!0||E.isFramebufferTexture&&E.minFilter!==Ft&&E.minFilter!==Zt?Math.log2(Math.max(x.width,x.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?x.mipmaps.length:1}function w(E){return E===Ft||E===no||E===Mr?i.NEAREST:i.LINEAR}function A(E){const x=E.target;x.removeEventListener("dispose",A),v(x),x.isVideoTexture&&h.delete(x)}function k(E){const x=E.target;x.removeEventListener("dispose",k),G(x)}function v(E){const x=n.get(E);if(x.__webglInit===void 0)return;const F=E.source,P=f.get(F);if(P){const z=P[x.__cacheKey];z.usedTimes--,z.usedTimes===0&&T(E),Object.keys(P).length===0&&f.delete(F)}n.remove(E)}function T(E){const x=n.get(E);i.deleteTexture(x.__webglTexture);const F=E.source,P=f.get(F);delete P[x.__cacheKey],a.memory.textures--}function G(E){const x=E.texture,F=n.get(E),P=n.get(x);if(P.__webglTexture!==void 0&&(i.deleteTexture(P.__webglTexture),a.memory.textures--),E.depthTexture&&E.depthTexture.dispose(),E.isWebGLCubeRenderTarget)for(let z=0;z<6;z++){if(Array.isArray(F.__webglFramebuffer[z]))for(let $=0;$<F.__webglFramebuffer[z].length;$++)i.deleteFramebuffer(F.__webglFramebuffer[z][$]);else i.deleteFramebuffer(F.__webglFramebuffer[z]);F.__webglDepthbuffer&&i.deleteRenderbuffer(F.__webglDepthbuffer[z])}else{if(Array.isArray(F.__webglFramebuffer))for(let z=0;z<F.__webglFramebuffer.length;z++)i.deleteFramebuffer(F.__webglFramebuffer[z]);else i.deleteFramebuffer(F.__webglFramebuffer);if(F.__webglDepthbuffer&&i.deleteRenderbuffer(F.__webglDepthbuffer),F.__webglMultisampledFramebuffer&&i.deleteFramebuffer(F.__webglMultisampledFramebuffer),F.__webglColorRenderbuffer)for(let z=0;z<F.__webglColorRenderbuffer.length;z++)F.__webglColorRenderbuffer[z]&&i.deleteRenderbuffer(F.__webglColorRenderbuffer[z]);F.__webglDepthRenderbuffer&&i.deleteRenderbuffer(F.__webglDepthRenderbuffer)}if(E.isWebGLMultipleRenderTargets)for(let z=0,$=x.length;z<$;z++){const ne=n.get(x[z]);ne.__webglTexture&&(i.deleteTexture(ne.__webglTexture),a.memory.textures--),n.remove(x[z])}n.remove(x),n.remove(E)}let W=0;function ee(){W=0}function L(){const E=W;return E>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),W+=1,E}function I(E){const x=[];return x.push(E.wrapS),x.push(E.wrapT),x.push(E.wrapR||0),x.push(E.magFilter),x.push(E.minFilter),x.push(E.anisotropy),x.push(E.internalFormat),x.push(E.format),x.push(E.type),x.push(E.generateMipmaps),x.push(E.premultiplyAlpha),x.push(E.flipY),x.push(E.unpackAlignment),x.push(E.colorSpace),x.join()}function H(E,x){const F=n.get(E);if(E.isVideoTexture&&nt(E),E.isRenderTargetTexture===!1&&E.version>0&&F.__version!==E.version){const P=E.image;if(P===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(P.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{le(F,E,x);return}}t.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+x)}function Z(E,x){const F=n.get(E);if(E.version>0&&F.__version!==E.version){le(F,E,x);return}t.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+x)}function Y(E,x){const F=n.get(E);if(E.version>0&&F.__version!==E.version){le(F,E,x);return}t.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+x)}function j(E,x){const F=n.get(E);if(E.version>0&&F.__version!==E.version){_e(F,E,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+x)}const Q={[er]:i.REPEAT,[cn]:i.CLAMP_TO_EDGE,[xa]:i.MIRRORED_REPEAT},ie={[Ft]:i.NEAREST,[no]:i.NEAREST_MIPMAP_NEAREST,[Mr]:i.NEAREST_MIPMAP_LINEAR,[Zt]:i.LINEAR,[wh]:i.LINEAR_MIPMAP_NEAREST,[cs]:i.LINEAR_MIPMAP_LINEAR},re={[Bh]:i.NEVER,[Wh]:i.ALWAYS,[zh]:i.LESS,[rc]:i.LEQUAL,[kh]:i.EQUAL,[Vh]:i.GEQUAL,[Gh]:i.GREATER,[Hh]:i.NOTEQUAL};function X(E,x,F){if(F?(i.texParameteri(E,i.TEXTURE_WRAP_S,Q[x.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,Q[x.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,Q[x.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,ie[x.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,ie[x.minFilter])):(i.texParameteri(E,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(E,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(x.wrapS!==cn||x.wrapT!==cn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(E,i.TEXTURE_MAG_FILTER,w(x.magFilter)),i.texParameteri(E,i.TEXTURE_MIN_FILTER,w(x.minFilter)),x.minFilter!==Ft&&x.minFilter!==Zt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),x.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,re[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");if(x.magFilter===Ft||x.minFilter!==Mr&&x.minFilter!==cs||x.type===Fn&&e.has("OES_texture_float_linear")===!1||o===!1&&x.type===hs&&e.has("OES_texture_half_float_linear")===!1)return;(x.anisotropy>1||n.get(x).__currentAnisotropy)&&(i.texParameterf(E,P.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy)}}function J(E,x){let F=!1;E.__webglInit===void 0&&(E.__webglInit=!0,x.addEventListener("dispose",A));const P=x.source;let z=f.get(P);z===void 0&&(z={},f.set(P,z));const $=I(x);if($!==E.__cacheKey){z[$]===void 0&&(z[$]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,F=!0),z[$].usedTimes++;const ne=z[E.__cacheKey];ne!==void 0&&(z[E.__cacheKey].usedTimes--,ne.usedTimes===0&&T(x)),E.__cacheKey=$,E.__webglTexture=z[$].texture}return F}function le(E,x,F){let P=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(P=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(P=i.TEXTURE_3D);const z=J(E,x),$=x.source;t.bindTexture(P,E.__webglTexture,i.TEXTURE0+F);const ne=n.get($);if($.version!==ne.__version||z===!0){t.activeTexture(i.TEXTURE0+F);const se=Qe.getPrimaries(Qe.workingColorSpace),ce=x.colorSpace===en?null:Qe.getPrimaries(x.colorSpace),we=x.colorSpace===en||se===ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,we);const ke=d(x)&&p(x.image)===!1;let te=_(x.image,ke,!1,s.maxTextureSize);te=Ne(x,te);const Je=p(te)||o,qe=r.convert(x.format,x.colorSpace);let Pe=r.convert(x.type),Me=b(x.internalFormat,qe,Pe,x.colorSpace,x.isVideoTexture);X(P,x,Je);let fe;const Be=x.mipmaps,Ze=o&&x.isVideoTexture!==!0&&Me!==nc,ct=ne.__version===void 0||z===!0,He=R(x,te,Je);if(x.isDepthTexture)Me=i.DEPTH_COMPONENT,o?x.type===Fn?Me=i.DEPTH_COMPONENT32F:x.type===Nn?Me=i.DEPTH_COMPONENT24:x.type===si?Me=i.DEPTH24_STENCIL8:Me=i.DEPTH_COMPONENT16:x.type===Fn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),x.format===ri&&Me===i.DEPTH_COMPONENT&&x.type!==Ra&&x.type!==Nn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),x.type=Nn,Pe=r.convert(x.type)),x.format===Wi&&Me===i.DEPTH_COMPONENT&&(Me=i.DEPTH_STENCIL,x.type!==si&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),x.type=si,Pe=r.convert(x.type))),ct&&(Ze?t.texStorage2D(i.TEXTURE_2D,1,Me,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,Me,te.width,te.height,0,qe,Pe,null));else if(x.isDataTexture)if(Be.length>0&&Je){Ze&&ct&&t.texStorage2D(i.TEXTURE_2D,He,Me,Be[0].width,Be[0].height);for(let ae=0,C=Be.length;ae<C;ae++)fe=Be[ae],Ze?t.texSubImage2D(i.TEXTURE_2D,ae,0,0,fe.width,fe.height,qe,Pe,fe.data):t.texImage2D(i.TEXTURE_2D,ae,Me,fe.width,fe.height,0,qe,Pe,fe.data);x.generateMipmaps=!1}else Ze?(ct&&t.texStorage2D(i.TEXTURE_2D,He,Me,te.width,te.height),t.texSubImage2D(i.TEXTURE_2D,0,0,0,te.width,te.height,qe,Pe,te.data)):t.texImage2D(i.TEXTURE_2D,0,Me,te.width,te.height,0,qe,Pe,te.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Ze&&ct&&t.texStorage3D(i.TEXTURE_2D_ARRAY,He,Me,Be[0].width,Be[0].height,te.depth);for(let ae=0,C=Be.length;ae<C;ae++)fe=Be[ae],x.format!==hn?qe!==null?Ze?t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,0,fe.width,fe.height,te.depth,qe,fe.data,0,0):t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ae,Me,fe.width,fe.height,te.depth,0,fe.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ze?t.texSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,0,fe.width,fe.height,te.depth,qe,Pe,fe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ae,Me,fe.width,fe.height,te.depth,0,qe,Pe,fe.data)}else{Ze&&ct&&t.texStorage2D(i.TEXTURE_2D,He,Me,Be[0].width,Be[0].height);for(let ae=0,C=Be.length;ae<C;ae++)fe=Be[ae],x.format!==hn?qe!==null?Ze?t.compressedTexSubImage2D(i.TEXTURE_2D,ae,0,0,fe.width,fe.height,qe,fe.data):t.compressedTexImage2D(i.TEXTURE_2D,ae,Me,fe.width,fe.height,0,fe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ze?t.texSubImage2D(i.TEXTURE_2D,ae,0,0,fe.width,fe.height,qe,Pe,fe.data):t.texImage2D(i.TEXTURE_2D,ae,Me,fe.width,fe.height,0,qe,Pe,fe.data)}else if(x.isDataArrayTexture)Ze?(ct&&t.texStorage3D(i.TEXTURE_2D_ARRAY,He,Me,te.width,te.height,te.depth),t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,qe,Pe,te.data)):t.texImage3D(i.TEXTURE_2D_ARRAY,0,Me,te.width,te.height,te.depth,0,qe,Pe,te.data);else if(x.isData3DTexture)Ze?(ct&&t.texStorage3D(i.TEXTURE_3D,He,Me,te.width,te.height,te.depth),t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,qe,Pe,te.data)):t.texImage3D(i.TEXTURE_3D,0,Me,te.width,te.height,te.depth,0,qe,Pe,te.data);else if(x.isFramebufferTexture){if(ct)if(Ze)t.texStorage2D(i.TEXTURE_2D,He,Me,te.width,te.height);else{let ae=te.width,C=te.height;for(let he=0;he<He;he++)t.texImage2D(i.TEXTURE_2D,he,Me,ae,C,0,qe,Pe,null),ae>>=1,C>>=1}}else if(Be.length>0&&Je){Ze&&ct&&t.texStorage2D(i.TEXTURE_2D,He,Me,Be[0].width,Be[0].height);for(let ae=0,C=Be.length;ae<C;ae++)fe=Be[ae],Ze?t.texSubImage2D(i.TEXTURE_2D,ae,0,0,qe,Pe,fe):t.texImage2D(i.TEXTURE_2D,ae,Me,qe,Pe,fe);x.generateMipmaps=!1}else Ze?(ct&&t.texStorage2D(i.TEXTURE_2D,He,Me,te.width,te.height),t.texSubImage2D(i.TEXTURE_2D,0,0,0,qe,Pe,te)):t.texImage2D(i.TEXTURE_2D,0,Me,qe,Pe,te);y(x,Je)&&S(P),ne.__version=$.version,x.onUpdate&&x.onUpdate(x)}E.__version=x.version}function _e(E,x,F){if(x.image.length!==6)return;const P=J(E,x),z=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+F);const $=n.get(z);if(z.version!==$.__version||P===!0){t.activeTexture(i.TEXTURE0+F);const ne=Qe.getPrimaries(Qe.workingColorSpace),se=x.colorSpace===en?null:Qe.getPrimaries(x.colorSpace),ce=x.colorSpace===en||ne===se?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ce);const we=x.isCompressedTexture||x.image[0].isCompressedTexture,ke=x.image[0]&&x.image[0].isDataTexture,te=[];for(let ae=0;ae<6;ae++)!we&&!ke?te[ae]=_(x.image[ae],!1,!0,s.maxCubemapSize):te[ae]=ke?x.image[ae].image:x.image[ae],te[ae]=Ne(x,te[ae]);const Je=te[0],qe=p(Je)||o,Pe=r.convert(x.format,x.colorSpace),Me=r.convert(x.type),fe=b(x.internalFormat,Pe,Me,x.colorSpace),Be=o&&x.isVideoTexture!==!0,Ze=$.__version===void 0||P===!0;let ct=R(x,Je,qe);X(i.TEXTURE_CUBE_MAP,x,qe);let He;if(we){Be&&Ze&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ct,fe,Je.width,Je.height);for(let ae=0;ae<6;ae++){He=te[ae].mipmaps;for(let C=0;C<He.length;C++){const he=He[C];x.format!==hn?Pe!==null?Be?t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,C,0,0,he.width,he.height,Pe,he.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,C,fe,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Be?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,C,0,0,he.width,he.height,Pe,Me,he.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,C,fe,he.width,he.height,0,Pe,Me,he.data)}}}else{He=x.mipmaps,Be&&Ze&&(He.length>0&&ct++,t.texStorage2D(i.TEXTURE_CUBE_MAP,ct,fe,te[0].width,te[0].height));for(let ae=0;ae<6;ae++)if(ke){Be?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,0,0,te[ae].width,te[ae].height,Pe,Me,te[ae].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,fe,te[ae].width,te[ae].height,0,Pe,Me,te[ae].data);for(let C=0;C<He.length;C++){const ue=He[C].image[ae].image;Be?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,C+1,0,0,ue.width,ue.height,Pe,Me,ue.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,C+1,fe,ue.width,ue.height,0,Pe,Me,ue.data)}}else{Be?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,0,0,Pe,Me,te[ae]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,fe,Pe,Me,te[ae]);for(let C=0;C<He.length;C++){const he=He[C];Be?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,C+1,0,0,Pe,Me,he.image[ae]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,C+1,fe,Pe,Me,he.image[ae])}}}y(x,qe)&&S(i.TEXTURE_CUBE_MAP),$.__version=z.version,x.onUpdate&&x.onUpdate(x)}E.__version=x.version}function ge(E,x,F,P,z,$){const ne=r.convert(F.format,F.colorSpace),se=r.convert(F.type),ce=b(F.internalFormat,ne,se,F.colorSpace);if(!n.get(x).__hasExternalTextures){const ke=Math.max(1,x.width>>$),te=Math.max(1,x.height>>$);z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY?t.texImage3D(z,$,ce,ke,te,x.depth,0,ne,se,null):t.texImage2D(z,$,ce,ke,te,0,ne,se,null)}t.bindFramebuffer(i.FRAMEBUFFER,E),me(x)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,P,z,n.get(F).__webglTexture,0,Ae(x)):(z===i.TEXTURE_2D||z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,P,z,n.get(F).__webglTexture,$),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Le(E,x,F){if(i.bindRenderbuffer(i.RENDERBUFFER,E),x.depthBuffer&&!x.stencilBuffer){let P=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(F||me(x)){const z=x.depthTexture;z&&z.isDepthTexture&&(z.type===Fn?P=i.DEPTH_COMPONENT32F:z.type===Nn&&(P=i.DEPTH_COMPONENT24));const $=Ae(x);me(x)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,$,P,x.width,x.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,$,P,x.width,x.height)}else i.renderbufferStorage(i.RENDERBUFFER,P,x.width,x.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,E)}else if(x.depthBuffer&&x.stencilBuffer){const P=Ae(x);F&&me(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,P,i.DEPTH24_STENCIL8,x.width,x.height):me(x)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,P,i.DEPTH24_STENCIL8,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,E)}else{const P=x.isWebGLMultipleRenderTargets===!0?x.texture:[x.texture];for(let z=0;z<P.length;z++){const $=P[z],ne=r.convert($.format,$.colorSpace),se=r.convert($.type),ce=b($.internalFormat,ne,se,$.colorSpace),we=Ae(x);F&&me(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,we,ce,x.width,x.height):me(x)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,we,ce,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,ce,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function De(E,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,E),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(x.depthTexture).__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),H(x.depthTexture,0);const P=n.get(x.depthTexture).__webglTexture,z=Ae(x);if(x.depthTexture.format===ri)me(x)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,P,0,z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,P,0);else if(x.depthTexture.format===Wi)me(x)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,P,0,z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,P,0);else throw new Error("Unknown depthTexture format")}function be(E){const x=n.get(E),F=E.isWebGLCubeRenderTarget===!0;if(E.depthTexture&&!x.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");De(x.__webglFramebuffer,E)}else if(F){x.__webglDepthbuffer=[];for(let P=0;P<6;P++)t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[P]),x.__webglDepthbuffer[P]=i.createRenderbuffer(),Le(x.__webglDepthbuffer[P],E,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer=i.createRenderbuffer(),Le(x.__webglDepthbuffer,E,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ue(E,x,F){const P=n.get(E);x!==void 0&&ge(P.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&be(E)}function N(E){const x=E.texture,F=n.get(E),P=n.get(x);E.addEventListener("dispose",k),E.isWebGLMultipleRenderTargets!==!0&&(P.__webglTexture===void 0&&(P.__webglTexture=i.createTexture()),P.__version=x.version,a.memory.textures++);const z=E.isWebGLCubeRenderTarget===!0,$=E.isWebGLMultipleRenderTargets===!0,ne=p(E)||o;if(z){F.__webglFramebuffer=[];for(let se=0;se<6;se++)if(o&&x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer[se]=[];for(let ce=0;ce<x.mipmaps.length;ce++)F.__webglFramebuffer[se][ce]=i.createFramebuffer()}else F.__webglFramebuffer[se]=i.createFramebuffer()}else{if(o&&x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer=[];for(let se=0;se<x.mipmaps.length;se++)F.__webglFramebuffer[se]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if($)if(s.drawBuffers){const se=E.texture;for(let ce=0,we=se.length;ce<we;ce++){const ke=n.get(se[ce]);ke.__webglTexture===void 0&&(ke.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&E.samples>0&&me(E)===!1){const se=$?x:[x];F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let ce=0;ce<se.length;ce++){const we=se[ce];F.__webglColorRenderbuffer[ce]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[ce]);const ke=r.convert(we.format,we.colorSpace),te=r.convert(we.type),Je=b(we.internalFormat,ke,te,we.colorSpace,E.isXRRenderTarget===!0),qe=Ae(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,qe,Je,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,F.__webglColorRenderbuffer[ce])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),Le(F.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(z){t.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture),X(i.TEXTURE_CUBE_MAP,x,ne);for(let se=0;se<6;se++)if(o&&x.mipmaps&&x.mipmaps.length>0)for(let ce=0;ce<x.mipmaps.length;ce++)ge(F.__webglFramebuffer[se][ce],E,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+se,ce);else ge(F.__webglFramebuffer[se],E,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0);y(x,ne)&&S(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if($){const se=E.texture;for(let ce=0,we=se.length;ce<we;ce++){const ke=se[ce],te=n.get(ke);t.bindTexture(i.TEXTURE_2D,te.__webglTexture),X(i.TEXTURE_2D,ke,ne),ge(F.__webglFramebuffer,E,ke,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,0),y(ke,ne)&&S(i.TEXTURE_2D)}t.unbindTexture()}else{let se=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(o?se=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(se,P.__webglTexture),X(se,x,ne),o&&x.mipmaps&&x.mipmaps.length>0)for(let ce=0;ce<x.mipmaps.length;ce++)ge(F.__webglFramebuffer[ce],E,x,i.COLOR_ATTACHMENT0,se,ce);else ge(F.__webglFramebuffer,E,x,i.COLOR_ATTACHMENT0,se,0);y(x,ne)&&S(se),t.unbindTexture()}E.depthBuffer&&be(E)}function pe(E){const x=p(E)||o,F=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let P=0,z=F.length;P<z;P++){const $=F[P];if(y($,x)){const ne=E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,se=n.get($).__webglTexture;t.bindTexture(ne,se),S(ne),t.unbindTexture()}}}function xe(E){if(o&&E.samples>0&&me(E)===!1){const x=E.isWebGLMultipleRenderTargets?E.texture:[E.texture],F=E.width,P=E.height;let z=i.COLOR_BUFFER_BIT;const $=[],ne=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=n.get(E),ce=E.isWebGLMultipleRenderTargets===!0;if(ce)for(let we=0;we<x.length;we++)t.bindFramebuffer(i.FRAMEBUFFER,se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,se.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglFramebuffer);for(let we=0;we<x.length;we++){$.push(i.COLOR_ATTACHMENT0+we),E.depthBuffer&&$.push(ne);const ke=se.__ignoreDepthValues!==void 0?se.__ignoreDepthValues:!1;if(ke===!1&&(E.depthBuffer&&(z|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&(z|=i.STENCIL_BUFFER_BIT)),ce&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,se.__webglColorRenderbuffer[we]),ke===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[ne]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[ne])),ce){const te=n.get(x[we]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,te,0)}i.blitFramebuffer(0,0,F,P,0,0,F,P,z,i.NEAREST),c&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,$)}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ce)for(let we=0;we<x.length;we++){t.bindFramebuffer(i.FRAMEBUFFER,se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,se.__webglColorRenderbuffer[we]);const ke=n.get(x[we]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,ke,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglMultisampledFramebuffer)}}function Ae(E){return Math.min(s.maxSamples,E.samples)}function me(E){const x=n.get(E);return o&&E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function nt(E){const x=a.render.frame;h.get(E)!==x&&(h.set(E,x),E.update())}function Ne(E,x){const F=E.colorSpace,P=E.format,z=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||E.format===Ma||F!==Tn&&F!==en&&(Qe.getTransfer(F)===at?o===!1?e.has("EXT_sRGB")===!0&&P===hn?(E.format=Ma,E.minFilter=Zt,E.generateMipmaps=!1):x=oc.sRGBToLinear(x):(P!==hn||z!==Hn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),x}this.allocateTextureUnit=L,this.resetTextureUnits=ee,this.setTexture2D=H,this.setTexture2DArray=Z,this.setTexture3D=Y,this.setTextureCube=j,this.rebindTextures=Ue,this.setupRenderTarget=N,this.updateRenderTargetMipmap=pe,this.updateMultisampleRenderTarget=xe,this.setupDepthRenderbuffer=be,this.setupFrameBufferTexture=ge,this.useMultisampledRTT=me}function qm(i,e,t){const n=t.isWebGL2;function s(r,a=en){let o;const l=Qe.getTransfer(a);if(r===Hn)return i.UNSIGNED_BYTE;if(r===Zl)return i.UNSIGNED_SHORT_4_4_4_4;if(r===Jl)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Ah)return i.BYTE;if(r===Rh)return i.SHORT;if(r===Ra)return i.UNSIGNED_SHORT;if(r===jl)return i.INT;if(r===Nn)return i.UNSIGNED_INT;if(r===Fn)return i.FLOAT;if(r===hs)return n?i.HALF_FLOAT:(o=e.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===Ch)return i.ALPHA;if(r===hn)return i.RGBA;if(r===Lh)return i.LUMINANCE;if(r===Ph)return i.LUMINANCE_ALPHA;if(r===ri)return i.DEPTH_COMPONENT;if(r===Wi)return i.DEPTH_STENCIL;if(r===Ma)return o=e.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===Dh)return i.RED;if(r===Ql)return i.RED_INTEGER;if(r===Uh)return i.RG;if(r===ec)return i.RG_INTEGER;if(r===tc)return i.RGBA_INTEGER;if(r===yr||r===Er||r===br||r===Tr)if(l===at)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===yr)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Er)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===br)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Tr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===yr)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Er)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===br)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Tr)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===io||r===so||r===ro||r===ao)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===io)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===so)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===ro)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===ao)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===nc)return o=e.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===oo||r===lo)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(r===oo)return l===at?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===lo)return l===at?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===co||r===ho||r===uo||r===fo||r===po||r===mo||r===go||r===_o||r===vo||r===xo||r===So||r===Mo||r===yo||r===Eo)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(r===co)return l===at?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===ho)return l===at?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===uo)return l===at?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===fo)return l===at?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===po)return l===at?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===mo)return l===at?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===go)return l===at?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===_o)return l===at?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===vo)return l===at?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===xo)return l===at?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===So)return l===at?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Mo)return l===at?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===yo)return l===at?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Eo)return l===at?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===wr||r===bo||r===To)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(r===wr)return l===at?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===bo)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===To)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Ih||r===wo||r===Ao||r===Ro)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(r===wr)return o.COMPRESSED_RED_RGTC1_EXT;if(r===wo)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Ao)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Ro)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===si?n?i.UNSIGNED_INT_24_8:(o=e.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class Ym extends ln{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class On extends xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const $m={type:"move"};class Zr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new On,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new On,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new On,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,n),d=this._getHandJoint(c,_);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),m=.02,g=.005;c.inputState.pinching&&f>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent($m)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new On;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Km extends Yi{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,m=null,g=null;const _=t.getContextAttributes();let p=null,d=null;const y=[],S=[],b=new Oe;let R=null;const w=new ln;w.layers.enable(1),w.viewport=new Tt;const A=new ln;A.layers.enable(2),A.viewport=new Tt;const k=[w,A],v=new Ym;v.layers.enable(1),v.layers.enable(2);let T=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let J=y[X];return J===void 0&&(J=new Zr,y[X]=J),J.getTargetRaySpace()},this.getControllerGrip=function(X){let J=y[X];return J===void 0&&(J=new Zr,y[X]=J),J.getGripSpace()},this.getHand=function(X){let J=y[X];return J===void 0&&(J=new Zr,y[X]=J),J.getHandSpace()};function W(X){const J=S.indexOf(X.inputSource);if(J===-1)return;const le=y[J];le!==void 0&&(le.update(X.inputSource,X.frame,c||a),le.dispatchEvent({type:X.type,data:X.inputSource}))}function ee(){s.removeEventListener("select",W),s.removeEventListener("selectstart",W),s.removeEventListener("selectend",W),s.removeEventListener("squeeze",W),s.removeEventListener("squeezestart",W),s.removeEventListener("squeezeend",W),s.removeEventListener("end",ee),s.removeEventListener("inputsourceschange",L);for(let X=0;X<y.length;X++){const J=S[X];J!==null&&(S[X]=null,y[X].disconnect(J))}T=null,G=null,e.setRenderTarget(p),m=null,f=null,u=null,s=null,d=null,re.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",W),s.addEventListener("selectstart",W),s.addEventListener("selectend",W),s.addEventListener("squeeze",W),s.addEventListener("squeezestart",W),s.addEventListener("squeezeend",W),s.addEventListener("end",ee),s.addEventListener("inputsourceschange",L),_.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(b),s.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const J={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,J),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),d=new li(m.framebufferWidth,m.framebufferHeight,{format:hn,type:Hn,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil})}else{let J=null,le=null,_e=null;_.depth&&(_e=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,J=_.stencil?Wi:ri,le=_.stencil?si:Nn);const ge={colorFormat:t.RGBA8,depthFormat:_e,scaleFactor:r};u=new XRWebGLBinding(s,t),f=u.createProjectionLayer(ge),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),d=new li(f.textureWidth,f.textureHeight,{format:hn,type:Hn,depthTexture:new xc(f.textureWidth,f.textureHeight,le,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0});const Le=e.properties.get(d);Le.__ignoreDepthValues=f.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),re.setContext(s),re.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function L(X){for(let J=0;J<X.removed.length;J++){const le=X.removed[J],_e=S.indexOf(le);_e>=0&&(S[_e]=null,y[_e].disconnect(le))}for(let J=0;J<X.added.length;J++){const le=X.added[J];let _e=S.indexOf(le);if(_e===-1){for(let Le=0;Le<y.length;Le++)if(Le>=S.length){S.push(le),_e=Le;break}else if(S[Le]===null){S[Le]=le,_e=Le;break}if(_e===-1)break}const ge=y[_e];ge&&ge.connect(le)}}const I=new U,H=new U;function Z(X,J,le){I.setFromMatrixPosition(J.matrixWorld),H.setFromMatrixPosition(le.matrixWorld);const _e=I.distanceTo(H),ge=J.projectionMatrix.elements,Le=le.projectionMatrix.elements,De=ge[14]/(ge[10]-1),be=ge[14]/(ge[10]+1),Ue=(ge[9]+1)/ge[5],N=(ge[9]-1)/ge[5],pe=(ge[8]-1)/ge[0],xe=(Le[8]+1)/Le[0],Ae=De*pe,me=De*xe,nt=_e/(-pe+xe),Ne=nt*-pe;J.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Ne),X.translateZ(nt),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const E=De+nt,x=be+nt,F=Ae-Ne,P=me+(_e-Ne),z=Ue*be/x*E,$=N*be/x*E;X.projectionMatrix.makePerspective(F,P,z,$,E,x),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}function Y(X,J){J===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(J.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;v.near=A.near=w.near=X.near,v.far=A.far=w.far=X.far,(T!==v.near||G!==v.far)&&(s.updateRenderState({depthNear:v.near,depthFar:v.far}),T=v.near,G=v.far);const J=X.parent,le=v.cameras;Y(v,J);for(let _e=0;_e<le.length;_e++)Y(le[_e],J);le.length===2?Z(v,w,A):v.projectionMatrix.copy(w.projectionMatrix),j(X,v,J)};function j(X,J,le){le===null?X.matrix.copy(J.matrixWorld):(X.matrix.copy(le.matrixWorld),X.matrix.invert(),X.matrix.multiply(J.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(J.projectionMatrix),X.projectionMatrixInverse.copy(J.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=ya*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(X){l=X,f!==null&&(f.fixedFoveation=X),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=X)};let Q=null;function ie(X,J){if(h=J.getViewerPose(c||a),g=J,h!==null){const le=h.views;m!==null&&(e.setRenderTargetFramebuffer(d,m.framebuffer),e.setRenderTarget(d));let _e=!1;le.length!==v.cameras.length&&(v.cameras.length=0,_e=!0);for(let ge=0;ge<le.length;ge++){const Le=le[ge];let De=null;if(m!==null)De=m.getViewport(Le);else{const Ue=u.getViewSubImage(f,Le);De=Ue.viewport,ge===0&&(e.setRenderTargetTextures(d,Ue.colorTexture,f.ignoreDepthValues?void 0:Ue.depthStencilTexture),e.setRenderTarget(d))}let be=k[ge];be===void 0&&(be=new ln,be.layers.enable(ge),be.viewport=new Tt,k[ge]=be),be.matrix.fromArray(Le.transform.matrix),be.matrix.decompose(be.position,be.quaternion,be.scale),be.projectionMatrix.fromArray(Le.projectionMatrix),be.projectionMatrixInverse.copy(be.projectionMatrix).invert(),be.viewport.set(De.x,De.y,De.width,De.height),ge===0&&(v.matrix.copy(be.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),_e===!0&&v.cameras.push(be)}}for(let le=0;le<y.length;le++){const _e=S[le],ge=y[le];_e!==null&&ge!==void 0&&ge.update(_e,J,c||a)}Q&&Q(X,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),g=null}const re=new vc;re.setAnimationLoop(ie),this.setAnimationLoop=function(X){Q=X},this.dispose=function(){}}}function jm(i,e){function t(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function n(p,d){d.color.getRGB(p.fogColor.value,mc(i)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function s(p,d,y,S,b){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(p,d):d.isMeshToonMaterial?(r(p,d),u(p,d)):d.isMeshPhongMaterial?(r(p,d),h(p,d)):d.isMeshStandardMaterial?(r(p,d),f(p,d),d.isMeshPhysicalMaterial&&m(p,d,b)):d.isMeshMatcapMaterial?(r(p,d),g(p,d)):d.isMeshDepthMaterial?r(p,d):d.isMeshDistanceMaterial?(r(p,d),_(p,d)):d.isMeshNormalMaterial?r(p,d):d.isLineBasicMaterial?(a(p,d),d.isLineDashedMaterial&&o(p,d)):d.isPointsMaterial?l(p,d,y,S):d.isSpriteMaterial?c(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,t(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===Ht&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,t(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===Ht&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,t(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,t(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);const y=e.get(d).envMap;if(y&&(p.envMap.value=y,p.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap){p.lightMap.value=d.lightMap;const S=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=d.lightMapIntensity*S,t(d.lightMap,p.lightMapTransform)}d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,p.aoMapTransform))}function a(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform))}function o(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function l(p,d,y,S){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*y,p.scale.value=S*.5,d.map&&(p.map.value=d.map,t(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function c(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function h(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function u(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function f(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,p.roughnessMapTransform)),e.get(d).envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function m(p,d,y){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ht&&p.clearcoatNormalScale.value.negate())),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,d){d.matcap&&(p.matcap.value=d.matcap)}function _(p,d){const y=e.get(d).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Zm(i,e,t,n){let s={},r={},a=[];const o=t.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(y,S){const b=S.program;n.uniformBlockBinding(y,b)}function c(y,S){let b=s[y.id];b===void 0&&(g(y),b=h(y),s[y.id]=b,y.addEventListener("dispose",p));const R=S.program;n.updateUBOMapping(y,R);const w=e.render.frame;r[y.id]!==w&&(f(y),r[y.id]=w)}function h(y){const S=u();y.__bindingPointIndex=S;const b=i.createBuffer(),R=y.__size,w=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,R,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,b),b}function u(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){const S=s[y.id],b=y.uniforms,R=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let w=0,A=b.length;w<A;w++){const k=Array.isArray(b[w])?b[w]:[b[w]];for(let v=0,T=k.length;v<T;v++){const G=k[v];if(m(G,w,v,R)===!0){const W=G.__offset,ee=Array.isArray(G.value)?G.value:[G.value];let L=0;for(let I=0;I<ee.length;I++){const H=ee[I],Z=_(H);typeof H=="number"||typeof H=="boolean"?(G.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,W+L,G.__data)):H.isMatrix3?(G.__data[0]=H.elements[0],G.__data[1]=H.elements[1],G.__data[2]=H.elements[2],G.__data[3]=0,G.__data[4]=H.elements[3],G.__data[5]=H.elements[4],G.__data[6]=H.elements[5],G.__data[7]=0,G.__data[8]=H.elements[6],G.__data[9]=H.elements[7],G.__data[10]=H.elements[8],G.__data[11]=0):(H.toArray(G.__data,L),L+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,W,G.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(y,S,b,R){const w=y.value,A=S+"_"+b;if(R[A]===void 0)return typeof w=="number"||typeof w=="boolean"?R[A]=w:R[A]=w.clone(),!0;{const k=R[A];if(typeof w=="number"||typeof w=="boolean"){if(k!==w)return R[A]=w,!0}else if(k.equals(w)===!1)return k.copy(w),!0}return!1}function g(y){const S=y.uniforms;let b=0;const R=16;for(let A=0,k=S.length;A<k;A++){const v=Array.isArray(S[A])?S[A]:[S[A]];for(let T=0,G=v.length;T<G;T++){const W=v[T],ee=Array.isArray(W.value)?W.value:[W.value];for(let L=0,I=ee.length;L<I;L++){const H=ee[L],Z=_(H),Y=b%R;Y!==0&&R-Y<Z.boundary&&(b+=R-Y),W.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=b,b+=Z.storage}}}const w=b%R;return w>0&&(b+=R-w),y.__size=b,y.__cache={},this}function _(y){const S={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(S.boundary=4,S.storage=4):y.isVector2?(S.boundary=8,S.storage=8):y.isVector3||y.isColor?(S.boundary=16,S.storage=12):y.isVector4?(S.boundary=16,S.storage=16):y.isMatrix3?(S.boundary=48,S.storage=48):y.isMatrix4?(S.boundary=64,S.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),S}function p(y){const S=y.target;S.removeEventListener("dispose",p);const b=a.indexOf(S.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function d(){for(const y in s)i.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:d}}class Tc{constructor(e={}){const{canvas:t=qh(),context:n=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=a;const m=new Uint32Array(4),g=new Int32Array(4);let _=null,p=null;const d=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=lt,this._useLegacyLights=!1,this.toneMapping=Gn,this.toneMappingExposure=1;const S=this;let b=!1,R=0,w=0,A=null,k=-1,v=null;const T=new Tt,G=new Tt;let W=null;const ee=new $e(0);let L=0,I=t.width,H=t.height,Z=1,Y=null,j=null;const Q=new Tt(0,0,I,H),ie=new Tt(0,0,I,H);let re=!1;const X=new La;let J=!1,le=!1,_e=null;const ge=new pt,Le=new Oe,De=new U,be={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Ue(){return A===null?Z:1}let N=n;function pe(M,D){for(let B=0;B<M.length;B++){const V=M[B],O=t.getContext(V,D);if(O!==null)return O}return null}try{const M={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Aa}`),t.addEventListener("webglcontextlost",ae,!1),t.addEventListener("webglcontextrestored",C,!1),t.addEventListener("webglcontextcreationerror",he,!1),N===null){const D=["webgl2","webgl","experimental-webgl"];if(S.isWebGL1Renderer===!0&&D.shift(),N=pe(D,M),N===null)throw pe(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&N instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),N.getShaderPrecisionFormat===void 0&&(N.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let xe,Ae,me,nt,Ne,E,x,F,P,z,$,ne,se,ce,we,ke,te,Je,qe,Pe,Me,fe,Be,Ze;function ct(){xe=new op(N),Ae=new tp(N,xe,e),xe.init(Ae),fe=new qm(N,xe,Ae),me=new Wm(N,xe,Ae),nt=new hp(N),Ne=new Lm,E=new Xm(N,xe,me,Ne,Ae,fe,nt),x=new ip(S),F=new ap(S),P=new _u(N,Ae),Be=new Qf(N,xe,P,Ae),z=new lp(N,P,nt,Be),$=new pp(N,z,P,nt),qe=new fp(N,Ae,E),ke=new np(Ne),ne=new Cm(S,x,F,xe,Ae,Be,ke),se=new jm(S,Ne),ce=new Dm,we=new Bm(xe,Ae),Je=new Jf(S,x,F,me,$,f,l),te=new Vm(S,$,Ae),Ze=new Zm(N,nt,Ae,me),Pe=new ep(N,xe,nt,Ae),Me=new cp(N,xe,nt,Ae),nt.programs=ne.programs,S.capabilities=Ae,S.extensions=xe,S.properties=Ne,S.renderLists=ce,S.shadowMap=te,S.state=me,S.info=nt}ct();const He=new Km(S,N);this.xr=He,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const M=xe.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=xe.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return Z},this.setPixelRatio=function(M){M!==void 0&&(Z=M,this.setSize(I,H,!1))},this.getSize=function(M){return M.set(I,H)},this.setSize=function(M,D,B=!0){if(He.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}I=M,H=D,t.width=Math.floor(M*Z),t.height=Math.floor(D*Z),B===!0&&(t.style.width=M+"px",t.style.height=D+"px"),this.setViewport(0,0,M,D)},this.getDrawingBufferSize=function(M){return M.set(I*Z,H*Z).floor()},this.setDrawingBufferSize=function(M,D,B){I=M,H=D,Z=B,t.width=Math.floor(M*B),t.height=Math.floor(D*B),this.setViewport(0,0,M,D)},this.getCurrentViewport=function(M){return M.copy(T)},this.getViewport=function(M){return M.copy(Q)},this.setViewport=function(M,D,B,V){M.isVector4?Q.set(M.x,M.y,M.z,M.w):Q.set(M,D,B,V),me.viewport(T.copy(Q).multiplyScalar(Z).floor())},this.getScissor=function(M){return M.copy(ie)},this.setScissor=function(M,D,B,V){M.isVector4?ie.set(M.x,M.y,M.z,M.w):ie.set(M,D,B,V),me.scissor(G.copy(ie).multiplyScalar(Z).floor())},this.getScissorTest=function(){return re},this.setScissorTest=function(M){me.setScissorTest(re=M)},this.setOpaqueSort=function(M){Y=M},this.setTransparentSort=function(M){j=M},this.getClearColor=function(M){return M.copy(Je.getClearColor())},this.setClearColor=function(){Je.setClearColor.apply(Je,arguments)},this.getClearAlpha=function(){return Je.getClearAlpha()},this.setClearAlpha=function(){Je.setClearAlpha.apply(Je,arguments)},this.clear=function(M=!0,D=!0,B=!0){let V=0;if(M){let O=!1;if(A!==null){const de=A.texture.format;O=de===tc||de===ec||de===Ql}if(O){const de=A.texture.type,ve=de===Hn||de===Nn||de===Ra||de===si||de===Zl||de===Jl,Te=Je.getClearColor(),Ce=Je.getClearAlpha(),Ge=Te.r,Ie=Te.g,Fe=Te.b;ve?(m[0]=Ge,m[1]=Ie,m[2]=Fe,m[3]=Ce,N.clearBufferuiv(N.COLOR,0,m)):(g[0]=Ge,g[1]=Ie,g[2]=Fe,g[3]=Ce,N.clearBufferiv(N.COLOR,0,g))}else V|=N.COLOR_BUFFER_BIT}D&&(V|=N.DEPTH_BUFFER_BIT),B&&(V|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ae,!1),t.removeEventListener("webglcontextrestored",C,!1),t.removeEventListener("webglcontextcreationerror",he,!1),ce.dispose(),we.dispose(),Ne.dispose(),x.dispose(),F.dispose(),$.dispose(),Be.dispose(),Ze.dispose(),ne.dispose(),He.dispose(),He.removeEventListener("sessionstart",Pt),He.removeEventListener("sessionend",rt),_e&&(_e.dispose(),_e=null),Dt.stop()};function ae(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function C(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const M=nt.autoReset,D=te.enabled,B=te.autoUpdate,V=te.needsUpdate,O=te.type;ct(),nt.autoReset=M,te.enabled=D,te.autoUpdate=B,te.needsUpdate=V,te.type=O}function he(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function ue(M){const D=M.target;D.removeEventListener("dispose",ue),Re(D)}function Re(M){ye(M),Ne.remove(M)}function ye(M){const D=Ne.get(M).programs;D!==void 0&&(D.forEach(function(B){ne.releaseProgram(B)}),M.isShaderMaterial&&ne.releaseShaderCache(M))}this.renderBufferDirect=function(M,D,B,V,O,de){D===null&&(D=be);const ve=O.isMesh&&O.matrixWorld.determinant()<0,Te=Fc(M,D,B,V,O);me.setMaterial(V,ve);let Ce=B.index,Ge=1;if(V.wireframe===!0){if(Ce=z.getWireframeAttribute(B),Ce===void 0)return;Ge=2}const Ie=B.drawRange,Fe=B.attributes.position;let dt=Ie.start*Ge,Vt=(Ie.start+Ie.count)*Ge;de!==null&&(dt=Math.max(dt,de.start*Ge),Vt=Math.min(Vt,(de.start+de.count)*Ge)),Ce!==null?(dt=Math.max(dt,0),Vt=Math.min(Vt,Ce.count)):Fe!=null&&(dt=Math.max(dt,0),Vt=Math.min(Vt,Fe.count));const Et=Vt-dt;if(Et<0||Et===1/0)return;Be.setup(O,V,Te,B,Ce);let mn,ot=Pe;if(Ce!==null&&(mn=P.get(Ce),ot=Me,ot.setIndex(mn)),O.isMesh)V.wireframe===!0?(me.setLineWidth(V.wireframeLinewidth*Ue()),ot.setMode(N.LINES)):ot.setMode(N.TRIANGLES);else if(O.isLine){let Ve=V.linewidth;Ve===void 0&&(Ve=1),me.setLineWidth(Ve*Ue()),O.isLineSegments?ot.setMode(N.LINES):O.isLineLoop?ot.setMode(N.LINE_LOOP):ot.setMode(N.LINE_STRIP)}else O.isPoints?ot.setMode(N.POINTS):O.isSprite&&ot.setMode(N.TRIANGLES);if(O.isBatchedMesh)ot.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else if(O.isInstancedMesh)ot.renderInstances(dt,Et,O.count);else if(B.isInstancedBufferGeometry){const Ve=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,gr=Math.min(B.instanceCount,Ve);ot.renderInstances(dt,Et,gr)}else ot.render(dt,Et)};function it(M,D,B){M.transparent===!0&&M.side===yn&&M.forceSinglePass===!1?(M.side=Ht,M.needsUpdate=!0,_s(M,D,B),M.side=Xn,M.needsUpdate=!0,_s(M,D,B),M.side=yn):_s(M,D,B)}this.compile=function(M,D,B=null){B===null&&(B=M),p=we.get(B),p.init(),y.push(p),B.traverseVisible(function(O){O.isLight&&O.layers.test(D.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),M!==B&&M.traverseVisible(function(O){O.isLight&&O.layers.test(D.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),p.setupLights(S._useLegacyLights);const V=new Set;return M.traverse(function(O){const de=O.material;if(de)if(Array.isArray(de))for(let ve=0;ve<de.length;ve++){const Te=de[ve];it(Te,B,O),V.add(Te)}else it(de,B,O),V.add(de)}),y.pop(),p=null,V},this.compileAsync=function(M,D,B=null){const V=this.compile(M,D,B);return new Promise(O=>{function de(){if(V.forEach(function(ve){Ne.get(ve).currentProgram.isReady()&&V.delete(ve)}),V.size===0){O(M);return}setTimeout(de,10)}xe.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let st=null;function yt(M){st&&st(M)}function Pt(){Dt.stop()}function rt(){Dt.start()}const Dt=new vc;Dt.setAnimationLoop(yt),typeof self<"u"&&Dt.setContext(self),this.setAnimationLoop=function(M){st=M,He.setAnimationLoop(M),M===null?Dt.stop():Dt.start()},He.addEventListener("sessionstart",Pt),He.addEventListener("sessionend",rt),this.render=function(M,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),He.enabled===!0&&He.isPresenting===!0&&(He.cameraAutoUpdate===!0&&He.updateCamera(D),D=He.getCamera()),M.isScene===!0&&M.onBeforeRender(S,M,D,A),p=we.get(M,y.length),p.init(),y.push(p),ge.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),X.setFromProjectionMatrix(ge),le=this.localClippingEnabled,J=ke.init(this.clippingPlanes,le),_=ce.get(M,d.length),_.init(),d.push(_),un(M,D,0,S.sortObjects),_.finish(),S.sortObjects===!0&&_.sort(Y,j),this.info.render.frame++,J===!0&&ke.beginShadows();const B=p.state.shadowsArray;if(te.render(B,M,D),J===!0&&ke.endShadows(),this.info.autoReset===!0&&this.info.reset(),Je.render(_,M),p.setupLights(S._useLegacyLights),D.isArrayCamera){const V=D.cameras;for(let O=0,de=V.length;O<de;O++){const ve=V[O];Va(_,M,ve,ve.viewport)}}else Va(_,M,D);A!==null&&(E.updateMultisampleRenderTarget(A),E.updateRenderTargetMipmap(A)),M.isScene===!0&&M.onAfterRender(S,M,D),Be.resetDefaultState(),k=-1,v=null,y.pop(),y.length>0?p=y[y.length-1]:p=null,d.pop(),d.length>0?_=d[d.length-1]:_=null};function un(M,D,B,V){if(M.visible===!1)return;if(M.layers.test(D.layers)){if(M.isGroup)B=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(D);else if(M.isLight)p.pushLight(M),M.castShadow&&p.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||X.intersectsSprite(M)){V&&De.setFromMatrixPosition(M.matrixWorld).applyMatrix4(ge);const ve=$.update(M),Te=M.material;Te.visible&&_.push(M,ve,Te,B,De.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||X.intersectsObject(M))){const ve=$.update(M),Te=M.material;if(V&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),De.copy(M.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),De.copy(ve.boundingSphere.center)),De.applyMatrix4(M.matrixWorld).applyMatrix4(ge)),Array.isArray(Te)){const Ce=ve.groups;for(let Ge=0,Ie=Ce.length;Ge<Ie;Ge++){const Fe=Ce[Ge],dt=Te[Fe.materialIndex];dt&&dt.visible&&_.push(M,ve,dt,B,De.z,Fe)}}else Te.visible&&_.push(M,ve,Te,B,De.z,null)}}const de=M.children;for(let ve=0,Te=de.length;ve<Te;ve++)un(de[ve],D,B,V)}function Va(M,D,B,V){const O=M.opaque,de=M.transmissive,ve=M.transparent;p.setupLightsView(B),J===!0&&ke.setGlobalState(S.clippingPlanes,B),de.length>0&&Nc(O,de,D,B),V&&me.viewport(T.copy(V)),O.length>0&&gs(O,D,B),de.length>0&&gs(de,D,B),ve.length>0&&gs(ve,D,B),me.buffers.depth.setTest(!0),me.buffers.depth.setMask(!0),me.buffers.color.setMask(!0),me.setPolygonOffset(!1)}function Nc(M,D,B,V){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;const de=Ae.isWebGL2;_e===null&&(_e=new li(1,1,{generateMipmaps:!0,type:xe.has("EXT_color_buffer_half_float")?hs:Hn,minFilter:cs,samples:de?4:0})),S.getDrawingBufferSize(Le),de?_e.setSize(Le.x,Le.y):_e.setSize(Ea(Le.x),Ea(Le.y));const ve=S.getRenderTarget();S.setRenderTarget(_e),S.getClearColor(ee),L=S.getClearAlpha(),L<1&&S.setClearColor(16777215,.5),S.clear();const Te=S.toneMapping;S.toneMapping=Gn,gs(M,B,V),E.updateMultisampleRenderTarget(_e),E.updateRenderTargetMipmap(_e);let Ce=!1;for(let Ge=0,Ie=D.length;Ge<Ie;Ge++){const Fe=D[Ge],dt=Fe.object,Vt=Fe.geometry,Et=Fe.material,mn=Fe.group;if(Et.side===yn&&dt.layers.test(V.layers)){const ot=Et.side;Et.side=Ht,Et.needsUpdate=!0,Wa(dt,B,V,Vt,Et,mn),Et.side=ot,Et.needsUpdate=!0,Ce=!0}}Ce===!0&&(E.updateMultisampleRenderTarget(_e),E.updateRenderTargetMipmap(_e)),S.setRenderTarget(ve),S.setClearColor(ee,L),S.toneMapping=Te}function gs(M,D,B){const V=D.isScene===!0?D.overrideMaterial:null;for(let O=0,de=M.length;O<de;O++){const ve=M[O],Te=ve.object,Ce=ve.geometry,Ge=V===null?ve.material:V,Ie=ve.group;Te.layers.test(B.layers)&&Wa(Te,D,B,Ce,Ge,Ie)}}function Wa(M,D,B,V,O,de){M.onBeforeRender(S,D,B,V,O,de),M.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),O.onBeforeRender(S,D,B,V,M,de),O.transparent===!0&&O.side===yn&&O.forceSinglePass===!1?(O.side=Ht,O.needsUpdate=!0,S.renderBufferDirect(B,D,V,O,M,de),O.side=Xn,O.needsUpdate=!0,S.renderBufferDirect(B,D,V,O,M,de),O.side=yn):S.renderBufferDirect(B,D,V,O,M,de),M.onAfterRender(S,D,B,V,O,de)}function _s(M,D,B){D.isScene!==!0&&(D=be);const V=Ne.get(M),O=p.state.lights,de=p.state.shadowsArray,ve=O.state.version,Te=ne.getParameters(M,O.state,de,D,B),Ce=ne.getProgramCacheKey(Te);let Ge=V.programs;V.environment=M.isMeshStandardMaterial?D.environment:null,V.fog=D.fog,V.envMap=(M.isMeshStandardMaterial?F:x).get(M.envMap||V.environment),Ge===void 0&&(M.addEventListener("dispose",ue),Ge=new Map,V.programs=Ge);let Ie=Ge.get(Ce);if(Ie!==void 0){if(V.currentProgram===Ie&&V.lightsStateVersion===ve)return qa(M,Te),Ie}else Te.uniforms=ne.getUniforms(M),M.onBuild(B,Te,S),M.onBeforeCompile(Te,S),Ie=ne.acquireProgram(Te,Ce),Ge.set(Ce,Ie),V.uniforms=Te.uniforms;const Fe=V.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Fe.clippingPlanes=ke.uniform),qa(M,Te),V.needsLights=Bc(M),V.lightsStateVersion=ve,V.needsLights&&(Fe.ambientLightColor.value=O.state.ambient,Fe.lightProbe.value=O.state.probe,Fe.directionalLights.value=O.state.directional,Fe.directionalLightShadows.value=O.state.directionalShadow,Fe.spotLights.value=O.state.spot,Fe.spotLightShadows.value=O.state.spotShadow,Fe.rectAreaLights.value=O.state.rectArea,Fe.ltc_1.value=O.state.rectAreaLTC1,Fe.ltc_2.value=O.state.rectAreaLTC2,Fe.pointLights.value=O.state.point,Fe.pointLightShadows.value=O.state.pointShadow,Fe.hemisphereLights.value=O.state.hemi,Fe.directionalShadowMap.value=O.state.directionalShadowMap,Fe.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Fe.spotShadowMap.value=O.state.spotShadowMap,Fe.spotLightMatrix.value=O.state.spotLightMatrix,Fe.spotLightMap.value=O.state.spotLightMap,Fe.pointShadowMap.value=O.state.pointShadowMap,Fe.pointShadowMatrix.value=O.state.pointShadowMatrix),V.currentProgram=Ie,V.uniformsList=null,Ie}function Xa(M){if(M.uniformsList===null){const D=M.currentProgram.getUniforms();M.uniformsList=Js.seqWithValue(D.seq,M.uniforms)}return M.uniformsList}function qa(M,D){const B=Ne.get(M);B.outputColorSpace=D.outputColorSpace,B.batching=D.batching,B.instancing=D.instancing,B.instancingColor=D.instancingColor,B.skinning=D.skinning,B.morphTargets=D.morphTargets,B.morphNormals=D.morphNormals,B.morphColors=D.morphColors,B.morphTargetsCount=D.morphTargetsCount,B.numClippingPlanes=D.numClippingPlanes,B.numIntersection=D.numClipIntersection,B.vertexAlphas=D.vertexAlphas,B.vertexTangents=D.vertexTangents,B.toneMapping=D.toneMapping}function Fc(M,D,B,V,O){D.isScene!==!0&&(D=be),E.resetTextureUnits();const de=D.fog,ve=V.isMeshStandardMaterial?D.environment:null,Te=A===null?S.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Tn,Ce=(V.isMeshStandardMaterial?F:x).get(V.envMap||ve),Ge=V.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Ie=!!B.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Fe=!!B.morphAttributes.position,dt=!!B.morphAttributes.normal,Vt=!!B.morphAttributes.color;let Et=Gn;V.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Et=S.toneMapping);const mn=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,ot=mn!==void 0?mn.length:0,Ve=Ne.get(V),gr=p.state.lights;if(J===!0&&(le===!0||M!==v)){const Yt=M===v&&V.id===k;ke.setState(V,M,Yt)}let ht=!1;V.version===Ve.__version?(Ve.needsLights&&Ve.lightsStateVersion!==gr.state.version||Ve.outputColorSpace!==Te||O.isBatchedMesh&&Ve.batching===!1||!O.isBatchedMesh&&Ve.batching===!0||O.isInstancedMesh&&Ve.instancing===!1||!O.isInstancedMesh&&Ve.instancing===!0||O.isSkinnedMesh&&Ve.skinning===!1||!O.isSkinnedMesh&&Ve.skinning===!0||O.isInstancedMesh&&Ve.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Ve.instancingColor===!1&&O.instanceColor!==null||Ve.envMap!==Ce||V.fog===!0&&Ve.fog!==de||Ve.numClippingPlanes!==void 0&&(Ve.numClippingPlanes!==ke.numPlanes||Ve.numIntersection!==ke.numIntersection)||Ve.vertexAlphas!==Ge||Ve.vertexTangents!==Ie||Ve.morphTargets!==Fe||Ve.morphNormals!==dt||Ve.morphColors!==Vt||Ve.toneMapping!==Et||Ae.isWebGL2===!0&&Ve.morphTargetsCount!==ot)&&(ht=!0):(ht=!0,Ve.__version=V.version);let qn=Ve.currentProgram;ht===!0&&(qn=_s(V,D,O));let Ya=!1,Ki=!1,_r=!1;const At=qn.getUniforms(),Yn=Ve.uniforms;if(me.useProgram(qn.program)&&(Ya=!0,Ki=!0,_r=!0),V.id!==k&&(k=V.id,Ki=!0),Ya||v!==M){At.setValue(N,"projectionMatrix",M.projectionMatrix),At.setValue(N,"viewMatrix",M.matrixWorldInverse);const Yt=At.map.cameraPosition;Yt!==void 0&&Yt.setValue(N,De.setFromMatrixPosition(M.matrixWorld)),Ae.logarithmicDepthBuffer&&At.setValue(N,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&At.setValue(N,"isOrthographic",M.isOrthographicCamera===!0),v!==M&&(v=M,Ki=!0,_r=!0)}if(O.isSkinnedMesh){At.setOptional(N,O,"bindMatrix"),At.setOptional(N,O,"bindMatrixInverse");const Yt=O.skeleton;Yt&&(Ae.floatVertexTextures?(Yt.boneTexture===null&&Yt.computeBoneTexture(),At.setValue(N,"boneTexture",Yt.boneTexture,E)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}O.isBatchedMesh&&(At.setOptional(N,O,"batchingTexture"),At.setValue(N,"batchingTexture",O._matricesTexture,E));const vr=B.morphAttributes;if((vr.position!==void 0||vr.normal!==void 0||vr.color!==void 0&&Ae.isWebGL2===!0)&&qe.update(O,B,qn),(Ki||Ve.receiveShadow!==O.receiveShadow)&&(Ve.receiveShadow=O.receiveShadow,At.setValue(N,"receiveShadow",O.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(Yn.envMap.value=Ce,Yn.flipEnvMap.value=Ce.isCubeTexture&&Ce.isRenderTargetTexture===!1?-1:1),Ki&&(At.setValue(N,"toneMappingExposure",S.toneMappingExposure),Ve.needsLights&&Oc(Yn,_r),de&&V.fog===!0&&se.refreshFogUniforms(Yn,de),se.refreshMaterialUniforms(Yn,V,Z,H,_e),Js.upload(N,Xa(Ve),Yn,E)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Js.upload(N,Xa(Ve),Yn,E),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&At.setValue(N,"center",O.center),At.setValue(N,"modelViewMatrix",O.modelViewMatrix),At.setValue(N,"normalMatrix",O.normalMatrix),At.setValue(N,"modelMatrix",O.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const Yt=V.uniformsGroups;for(let xr=0,zc=Yt.length;xr<zc;xr++)if(Ae.isWebGL2){const $a=Yt[xr];Ze.update($a,qn),Ze.bind($a,qn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return qn}function Oc(M,D){M.ambientLightColor.needsUpdate=D,M.lightProbe.needsUpdate=D,M.directionalLights.needsUpdate=D,M.directionalLightShadows.needsUpdate=D,M.pointLights.needsUpdate=D,M.pointLightShadows.needsUpdate=D,M.spotLights.needsUpdate=D,M.spotLightShadows.needsUpdate=D,M.rectAreaLights.needsUpdate=D,M.hemisphereLights.needsUpdate=D}function Bc(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(M,D,B){Ne.get(M.texture).__webglTexture=D,Ne.get(M.depthTexture).__webglTexture=B;const V=Ne.get(M);V.__hasExternalTextures=!0,V.__hasExternalTextures&&(V.__autoAllocateDepthBuffer=B===void 0,V.__autoAllocateDepthBuffer||xe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(M,D){const B=Ne.get(M);B.__webglFramebuffer=D,B.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(M,D=0,B=0){A=M,R=D,w=B;let V=!0,O=null,de=!1,ve=!1;if(M){const Ce=Ne.get(M);Ce.__useDefaultFramebuffer!==void 0?(me.bindFramebuffer(N.FRAMEBUFFER,null),V=!1):Ce.__webglFramebuffer===void 0?E.setupRenderTarget(M):Ce.__hasExternalTextures&&E.rebindTextures(M,Ne.get(M.texture).__webglTexture,Ne.get(M.depthTexture).__webglTexture);const Ge=M.texture;(Ge.isData3DTexture||Ge.isDataArrayTexture||Ge.isCompressedArrayTexture)&&(ve=!0);const Ie=Ne.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ie[D])?O=Ie[D][B]:O=Ie[D],de=!0):Ae.isWebGL2&&M.samples>0&&E.useMultisampledRTT(M)===!1?O=Ne.get(M).__webglMultisampledFramebuffer:Array.isArray(Ie)?O=Ie[B]:O=Ie,T.copy(M.viewport),G.copy(M.scissor),W=M.scissorTest}else T.copy(Q).multiplyScalar(Z).floor(),G.copy(ie).multiplyScalar(Z).floor(),W=re;if(me.bindFramebuffer(N.FRAMEBUFFER,O)&&Ae.drawBuffers&&V&&me.drawBuffers(M,O),me.viewport(T),me.scissor(G),me.setScissorTest(W),de){const Ce=Ne.get(M.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+D,Ce.__webglTexture,B)}else if(ve){const Ce=Ne.get(M.texture),Ge=D||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ce.__webglTexture,B||0,Ge)}k=-1},this.readRenderTargetPixels=function(M,D,B,V,O,de,ve){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=Ne.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ve!==void 0&&(Te=Te[ve]),Te){me.bindFramebuffer(N.FRAMEBUFFER,Te);try{const Ce=M.texture,Ge=Ce.format,Ie=Ce.type;if(Ge!==hn&&fe.convert(Ge)!==N.getParameter(N.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Fe=Ie===hs&&(xe.has("EXT_color_buffer_half_float")||Ae.isWebGL2&&xe.has("EXT_color_buffer_float"));if(Ie!==Hn&&fe.convert(Ie)!==N.getParameter(N.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ie===Fn&&(Ae.isWebGL2||xe.has("OES_texture_float")||xe.has("WEBGL_color_buffer_float")))&&!Fe){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=M.width-V&&B>=0&&B<=M.height-O&&N.readPixels(D,B,V,O,fe.convert(Ge),fe.convert(Ie),de)}finally{const Ce=A!==null?Ne.get(A).__webglFramebuffer:null;me.bindFramebuffer(N.FRAMEBUFFER,Ce)}}},this.copyFramebufferToTexture=function(M,D,B=0){const V=Math.pow(2,-B),O=Math.floor(D.image.width*V),de=Math.floor(D.image.height*V);E.setTexture2D(D,0),N.copyTexSubImage2D(N.TEXTURE_2D,B,0,0,M.x,M.y,O,de),me.unbindTexture()},this.copyTextureToTexture=function(M,D,B,V=0){const O=D.image.width,de=D.image.height,ve=fe.convert(B.format),Te=fe.convert(B.type);E.setTexture2D(B,0),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,B.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,B.unpackAlignment),D.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,V,M.x,M.y,O,de,ve,Te,D.image.data):D.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,V,M.x,M.y,D.mipmaps[0].width,D.mipmaps[0].height,ve,D.mipmaps[0].data):N.texSubImage2D(N.TEXTURE_2D,V,M.x,M.y,ve,Te,D.image),V===0&&B.generateMipmaps&&N.generateMipmap(N.TEXTURE_2D),me.unbindTexture()},this.copyTextureToTexture3D=function(M,D,B,V,O=0){if(S.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const de=M.max.x-M.min.x+1,ve=M.max.y-M.min.y+1,Te=M.max.z-M.min.z+1,Ce=fe.convert(V.format),Ge=fe.convert(V.type);let Ie;if(V.isData3DTexture)E.setTexture3D(V,0),Ie=N.TEXTURE_3D;else if(V.isDataArrayTexture||V.isCompressedArrayTexture)E.setTexture2DArray(V,0),Ie=N.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,V.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,V.unpackAlignment);const Fe=N.getParameter(N.UNPACK_ROW_LENGTH),dt=N.getParameter(N.UNPACK_IMAGE_HEIGHT),Vt=N.getParameter(N.UNPACK_SKIP_PIXELS),Et=N.getParameter(N.UNPACK_SKIP_ROWS),mn=N.getParameter(N.UNPACK_SKIP_IMAGES),ot=B.isCompressedTexture?B.mipmaps[O]:B.image;N.pixelStorei(N.UNPACK_ROW_LENGTH,ot.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ot.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,M.min.x),N.pixelStorei(N.UNPACK_SKIP_ROWS,M.min.y),N.pixelStorei(N.UNPACK_SKIP_IMAGES,M.min.z),B.isDataTexture||B.isData3DTexture?N.texSubImage3D(Ie,O,D.x,D.y,D.z,de,ve,Te,Ce,Ge,ot.data):B.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),N.compressedTexSubImage3D(Ie,O,D.x,D.y,D.z,de,ve,Te,Ce,ot.data)):N.texSubImage3D(Ie,O,D.x,D.y,D.z,de,ve,Te,Ce,Ge,ot),N.pixelStorei(N.UNPACK_ROW_LENGTH,Fe),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,dt),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Vt),N.pixelStorei(N.UNPACK_SKIP_ROWS,Et),N.pixelStorei(N.UNPACK_SKIP_IMAGES,mn),O===0&&V.generateMipmaps&&N.generateMipmap(Ie),me.unbindTexture()},this.initTexture=function(M){M.isCubeTexture?E.setTextureCube(M,0):M.isData3DTexture?E.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?E.setTexture2DArray(M,0):E.setTexture2D(M,0),me.unbindTexture()},this.resetState=function(){R=0,w=0,A=null,me.reset(),Be.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Ca?"display-p3":"srgb",t.unpackColorSpace=Qe.workingColorSpace===dr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===lt?ai:ic}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===ai?lt:Tn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class Jm extends Tc{}Jm.prototype.isWebGL1Renderer=!0;class Qm extends xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class eg{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Sa,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=Vn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Vn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Vn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ut=new U;class ar{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix4(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyNormalMatrix(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.transformDirection(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}setX(e,t){return this.normalized&&(t=tt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=En(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=En(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=En(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=En(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array),s=tt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array),s=tt(s,this.array),r=tt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new nn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ar(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ua extends ui{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new $e(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Ri;const es=new U,Ci=new U,Li=new U,Pi=new Oe,ts=new Oe,wc=new pt,Gs=new U,ns=new U,Hs=new U,gl=new Oe,Jr=new Oe,_l=new Oe;class Ac extends xt{constructor(e=new Ua){if(super(),this.isSprite=!0,this.type="Sprite",Ri===void 0){Ri=new qt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new eg(t,5);Ri.setIndex([0,1,2,0,2,3]),Ri.setAttribute("position",new ar(n,3,0,!1)),Ri.setAttribute("uv",new ar(n,2,3,!1))}this.geometry=Ri,this.material=e,this.center=new Oe(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ci.setFromMatrixScale(this.matrixWorld),wc.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Li.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ci.multiplyScalar(-Li.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Vs(Gs.set(-.5,-.5,0),Li,a,Ci,s,r),Vs(ns.set(.5,-.5,0),Li,a,Ci,s,r),Vs(Hs.set(.5,.5,0),Li,a,Ci,s,r),gl.set(0,0),Jr.set(1,0),_l.set(1,1);let o=e.ray.intersectTriangle(Gs,ns,Hs,!1,es);if(o===null&&(Vs(ns.set(-.5,.5,0),Li,a,Ci,s,r),Jr.set(0,1),o=e.ray.intersectTriangle(Gs,Hs,ns,!1,es),o===null))return;const l=e.ray.origin.distanceTo(es);l<e.near||l>e.far||t.push({distance:l,point:es.clone(),uv:Jt.getInterpolation(es,Gs,ns,Hs,gl,Jr,_l,new Oe),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Vs(i,e,t,n,s,r){Pi.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(ts.x=r*Pi.x-s*Pi.y,ts.y=s*Pi.x+r*Pi.y):ts.copy(Pi),i.copy(e),i.x+=ts.x,i.y+=ts.y,i.applyMatrix4(wc)}class Rc extends ui{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new $e(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const vl=new U,xl=new U,Sl=new pt,Qr=new hc,Ws=new fr;class tg extends xt{constructor(e=new qt,t=new Rc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)vl.fromBufferAttribute(t,s-1),xl.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=vl.distanceTo(xl);e.setAttribute("lineDistance",new wt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ws.copy(n.boundingSphere),Ws.applyMatrix4(s),Ws.radius+=r,e.ray.intersectsSphere(Ws)===!1)return;Sl.copy(s).invert(),Qr.copy(e.ray).applyMatrix4(Sl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=new U,h=new U,u=new U,f=new U,m=this.isLineSegments?2:1,g=n.index,p=n.attributes.position;if(g!==null){const d=Math.max(0,a.start),y=Math.min(g.count,a.start+a.count);for(let S=d,b=y-1;S<b;S+=m){const R=g.getX(S),w=g.getX(S+1);if(c.fromBufferAttribute(p,R),h.fromBufferAttribute(p,w),Qr.distanceSqToSegment(c,h,f,u)>l)continue;f.applyMatrix4(this.matrixWorld);const k=e.ray.origin.distanceTo(f);k<e.near||k>e.far||t.push({distance:k,point:u.clone().applyMatrix4(this.matrixWorld),index:S,face:null,faceIndex:null,object:this})}}else{const d=Math.max(0,a.start),y=Math.min(p.count,a.start+a.count);for(let S=d,b=y-1;S<b;S+=m){if(c.fromBufferAttribute(p,S),h.fromBufferAttribute(p,S+1),Qr.distanceSqToSegment(c,h,f,u)>l)continue;f.applyMatrix4(this.matrixWorld);const w=e.ray.origin.distanceTo(f);w<e.near||w>e.far||t.push({distance:w,point:u.clone().applyMatrix4(this.matrixWorld),index:S,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}class Ia extends Ot{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Na extends qt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new U,h=new Oe;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){const m=n+u/t*s;c.x=e*Math.cos(m),c.y=e*Math.sin(m),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[f]/e+1)/2,h.y=(a[f+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new wt(a,3)),this.setAttribute("normal",new wt(o,3)),this.setAttribute("uv",new wt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Na(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Fa extends qt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],f=[],m=[];let g=0;const _=[],p=n/2;let d=0;y(),a===!1&&(e>0&&S(!0),t>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new wt(u,3)),this.setAttribute("normal",new wt(f,3)),this.setAttribute("uv",new wt(m,2));function y(){const b=new U,R=new U;let w=0;const A=(t-e)/n;for(let k=0;k<=r;k++){const v=[],T=k/r,G=T*(t-e)+e;for(let W=0;W<=s;W++){const ee=W/s,L=ee*l+o,I=Math.sin(L),H=Math.cos(L);R.x=G*I,R.y=-T*n+p,R.z=G*H,u.push(R.x,R.y,R.z),b.set(I,A,H).normalize(),f.push(b.x,b.y,b.z),m.push(ee,1-T),v.push(g++)}_.push(v)}for(let k=0;k<s;k++)for(let v=0;v<r;v++){const T=_[v][k],G=_[v+1][k],W=_[v+1][k+1],ee=_[v][k+1];h.push(T,G,ee),h.push(G,W,ee),w+=6}c.addGroup(d,w,0),d+=w}function S(b){const R=g,w=new Oe,A=new U;let k=0;const v=b===!0?e:t,T=b===!0?1:-1;for(let W=1;W<=s;W++)u.push(0,p*T,0),f.push(0,T,0),m.push(.5,.5),g++;const G=g;for(let W=0;W<=s;W++){const L=W/s*l+o,I=Math.cos(L),H=Math.sin(L);A.x=v*H,A.y=p*T,A.z=v*I,u.push(A.x,A.y,A.z),f.push(0,T,0),w.x=I*.5+.5,w.y=H*.5*T+.5,m.push(w.x,w.y),g++}for(let W=0;W<s;W++){const ee=R+W,L=G+W;b===!0?h.push(L,L+1,ee):h.push(L+1,L,ee),k+=3}c.addGroup(d,k,b===!0?1:2),d+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fa(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class or extends qt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],l=[],c=[],h=[];let u=e;const f=(t-e)/s,m=new U,g=new Oe;for(let _=0;_<=s;_++){for(let p=0;p<=n;p++){const d=r+p/n*a;m.x=u*Math.cos(d),m.y=u*Math.sin(d),l.push(m.x,m.y,m.z),c.push(0,0,1),g.x=(m.x/t+1)/2,g.y=(m.y/t+1)/2,h.push(g.x,g.y)}u+=f}for(let _=0;_<s;_++){const p=_*(n+1);for(let d=0;d<n;d++){const y=d+p,S=y,b=y+n+1,R=y+n+2,w=y+1;o.push(S,b,w),o.push(b,R,w)}}this.setIndex(o),this.setAttribute("position",new wt(l,3)),this.setAttribute("normal",new wt(c,3)),this.setAttribute("uv",new wt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new or(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Wn extends ui{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new $e(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $e(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=sc,this.normalScale=new Oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}const Ml={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class ng{constructor(e,t,n){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){const m=c[u],g=c[u+1];if(m.global&&(m.lastIndex=0),m.test(h))return g}return null}}}const ig=new ng;class Oa{constructor(e){this.manager=e!==void 0?e:ig,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Oa.DEFAULT_MATERIAL_NAME="__DEFAULT";class sg extends Oa{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Ml.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;const o=us("img");function l(){h(),Ml.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(u){h(),s&&s(u),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(e),o.src=e,o}}class Ba extends Oa{constructor(e){super(e)}load(e,t,n,s){const r=new Ot,a=new sg(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}}class za extends xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new $e(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}class rg extends za{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new $e(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const ea=new pt,yl=new U,El=new U;class ag{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Oe(512,512),this.map=null,this.mapPass=null,this.matrix=new pt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new La,this._frameExtents=new Oe(1,1),this._viewportCount=1,this._viewports=[new Tt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;yl.setFromMatrixPosition(e.matrixWorld),t.position.copy(yl),El.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(El),t.updateMatrixWorld(),ea.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ea),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ea)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class og extends ag{constructor(){super(new Pa(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class bl extends za{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.shadow=new og}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class lg extends za{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Aa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Aa);const ka=new Map;for(const i of["esp","bra","ger","jpn","arg","fra","sui","can","col","ecu","sen","por","mex"])ka.set(i,{pattern:"detail",cols:[]});const cg=[["ita","vert","#009246","#ffffff","#ce2b37"],["eng","cross","#ffffff","#ce1124"],["ned","horiz","#ae1c28","#ffffff","#21468b"],["bel","vert","#2d2926","#f3d02f","#c8102e"],["uru","detail","#ffffff","#0038a8","#fcd116"],["cro","horiz","#ff0000","#ffffff","#171796"],["usa","detail","#b22234","#ffffff","#3c3b6e"],["kor","detail","#ffffff","#cd2e3a","#0047a0"],["mar","detail","#c1272d","#006233"],["den","nordic","#c60c30","#ffffff"],["pol","halfH","#ffffff","#dc143c"],["swe","nordic","#006aa7","#fecc00"],["nor","nordic","#ba0c2f","#ffffff","#00205b"],["gha","horiz","#ce1126","#fcd116","#006b3f"],["nga","vert","#008751","#ffffff","#008751"],["egy","horiz","#ce1126","#ffffff","#111111"],["aus","detail","#00008b","#ffffff","#e4002b"],["sco","saltire","#0065bf","#ffffff"],["tur","detail","#e30a17","#ffffff"]];for(const[i,e,...t]of cg)ka.set(i,{pattern:e,cols:t});function Dn(i,e,t,n,s){i.fillStyle=s,i.beginPath();for(let r=0;r<10;r++){const a=r%2===0?n:n*.42,o=-Math.PI/2+r*Math.PI/5,l=e+Math.cos(o)*a,c=t+Math.sin(o)*a;r===0?i.moveTo(l,c):i.lineTo(l,c)}i.closePath(),i.fill()}function is(i,e,t,n,s,r,a){i.strokeStyle=r,i.lineWidth=a,i.beginPath(),i.moveTo(e,t),i.lineTo(n,s),i.stroke()}function Tl(i,e,t,n){const s=(r,a,o,l,c)=>{i.fillStyle=r,i.fillRect(a,o,l,c)};switch(e){case"esp":s("#aa151b",0,0,t,n),s("#f1bf00",0,n*.25,t,n*.5);break;case"bra":s("#009b3a",0,0,t,n),i.fillStyle="#ffdf00",i.beginPath(),i.moveTo(t/2,14),i.lineTo(t-14,n/2),i.lineTo(t/2,n-14),i.lineTo(14,n/2),i.closePath(),i.fill(),i.fillStyle="#002776",i.beginPath(),i.arc(t/2,n/2,17,0,Math.PI*2),i.fill();break;case"ger":s("#000000",0,0,t,n/3),s("#dd0000",0,n/3,t,n/3),s("#ffce00",0,2*n/3,t,n/3);break;case"jpn":s("#ffffff",0,0,t,n),i.fillStyle="#bc002d",i.beginPath(),i.arc(t/2,n/2,30,0,Math.PI*2),i.fill();break;case"arg":s("#74acdf",0,0,t,n),s("#ffffff",0,n/3,t,n/3),i.fillStyle="#f6b40e",i.beginPath(),i.arc(t/2,n/2,12,0,Math.PI*2),i.fill();break;case"fra":s("#0055a4",0,0,t/3,n),s("#ffffff",t/3,0,t/3,n),s("#ef4135",2*t/3,0,t/3,n);break;case"sui":s("#d52b1e",0,0,t,n),i.fillStyle="#ffffff",i.fillRect(t*.22,n*.4,t*.56,n*.2),i.fillRect(t*.4,n*.22,t*.2,n*.56);break;case"can":s("#ff0000",0,0,t,n),s("#ffffff",t*.25,0,t*.5,n),i.fillStyle="#ff0000",i.beginPath();{const c=t/2,h=n/2;i.moveTo(c,h-26),i.lineTo(c+6,h-14),i.lineTo(c+18,h-18),i.lineTo(c+12,h-4),i.lineTo(c+24,h-2),i.lineTo(c+14,h+8),i.lineTo(c+18,h+16),i.lineTo(c+4,h+12),i.lineTo(c+2,h+24),i.lineTo(c-2,h+24),i.lineTo(c-4,h+12),i.lineTo(c-18,h+16),i.lineTo(c-14,h+8),i.lineTo(c-24,h-2),i.lineTo(c-12,h-4),i.lineTo(c-18,h-18),i.lineTo(c-6,h-14)}i.closePath(),i.fill();break;case"col":s("#fcd116",0,0,t,n*.5),s("#003893",0,n*.5,t,n*.25),s("#ce1126",0,n*.25*3,t,n*.25);break;case"ecu":s("#ffdd00",0,0,t,n*.5),s("#034ea2",0,n*.5,t,n*.25),s("#ed1c24",0,n*.25*3,t,n*.25),i.fillStyle="#8b5a2b",i.beginPath(),i.ellipse(t/2,n*.5,10,13,0,0,Math.PI*2),i.fill(),i.fillStyle="#034ea2",i.beginPath(),i.ellipse(t/2,n*.5,7,10,0,0,Math.PI*2),i.fill();break;case"sen":s("#00853f",0,0,t/3,n),s("#fdef42",t/3,0,t/3,n),s("#e31b23",2*t/3,0,t/3,n),Dn(i,t/2,n/2,12,"#00853f");break;case"por":s("#006600",0,0,t*.4,n),s("#ff0000",t*.4,0,t*.6,n);const r=t*.4,a=n*.5;i.fillStyle="#ffdf00",i.beginPath(),i.arc(r,a,13,0,Math.PI*2),i.fill(),i.fillStyle="#ff0000",i.beginPath(),i.arc(r,a,9,0,Math.PI*2),i.fill(),i.fillStyle="#ffffff",i.beginPath(),i.arc(r,a,6,0,Math.PI*2),i.fill(),i.fillStyle="#002776",i.fillRect(r-1.5,a-3.5,3,7),i.fillRect(r-3.5,a-1.5,7,3);break;case"mex":s("#006847",0,0,t/3,n),s("#ffffff",t/3,0,t/3,n),s("#ce1126",2*t/3,0,t/3,n);const o=t/2,l=n/2;i.fillStyle="#00853f",i.fillRect(o-8,l+6,16,6),i.fillRect(o-3,l,6,8),i.fillStyle="#664422",i.beginPath(),i.arc(o,l-6,6,0,Math.PI*2),i.fill(),i.beginPath(),i.arc(o-3,l-11,4,0,Math.PI*2),i.fill(),i.beginPath(),i.moveTo(o,l-6),i.lineTo(o+8,l-12),i.lineTo(o+6,l-2),i.closePath(),i.fill(),i.strokeStyle="#fdef42",i.lineWidth=2.5,i.beginPath(),i.moveTo(o-3,l-12),i.bezierCurveTo(o-8,l-16,o+3,l-20,o-1,l-11),i.stroke();break;case"tur":s("#e30a17",0,0,t,n),i.fillStyle="#ffffff",i.beginPath(),i.arc(t*.42,n/2,27,0,Math.PI*2),i.fill(),i.fillStyle="#e30a17",i.beginPath(),i.arc(t*.49,n/2,21,0,Math.PI*2),i.fill(),Dn(i,t*.64,n/2,13,"#ffffff");break;case"kor":s("#ffffff",0,0,t,n);{const c=t/2,h=n/2,u=26;i.fillStyle="#cd2e3a",i.beginPath(),i.arc(c,h,u,0,Math.PI*2),i.fill(),i.fillStyle="#0047a0",i.beginPath(),i.arc(c,h,u,0,Math.PI),i.fill(),i.fillStyle="#cd2e3a",i.beginPath(),i.arc(c+u/2,h,u/2,0,Math.PI*2),i.fill(),i.fillStyle="#0047a0",i.beginPath(),i.arc(c-u/2,h,u/2,0,Math.PI*2),i.fill(),i.fillStyle="#111111";for(const[f,m]of[[.22,.24],[.78,.24],[.22,.76],[.78,.76]])for(let g=-1;g<=1;g++)i.fillRect(t*f-9,n*m+g*5-1.5,18,3)}break;case"mar":s("#c1272d",0,0,t,n),Dn(i,t/2,n/2,34,"#006233");break;case"aus":s("#00008b",0,0,t,n);{const c=t*.5,h=n*.42;is(i,0,0,c,h,"#ffffff",9),is(i,c,0,0,h,"#ffffff",9),is(i,0,0,c,h,"#e4002b",4),is(i,c,0,0,h,"#e4002b",4),i.fillStyle="#ffffff",i.fillRect(c/2-7,0,14,h),i.fillRect(0,h/2-7,c,14),i.fillStyle="#e4002b",i.fillRect(c/2-4,0,8,h),i.fillRect(0,h/2-4,c,8),Dn(i,c/2,h+16,11,"#ffffff"),Dn(i,t*.74,n*.34,7,"#ffffff"),Dn(i,t*.86,n*.52,6,"#ffffff"),Dn(i,t*.72,n*.66,7,"#ffffff"),Dn(i,t*.88,n*.74,5,"#ffffff")}break;case"usa":s("#b22234",0,0,t,n),i.fillStyle="#ffffff";for(let c=1;c<13;c+=2)i.fillRect(0,c*n/13,t,n/13);i.fillStyle="#3c3b6e",i.fillRect(0,0,t*.42,n*7/13),i.fillStyle="#ffffff";for(let c=0;c<4;c++)for(let h=0;h<5;h++)i.beginPath(),i.arc(t*.05+h*t*.084,n*.06+c*n*.12,2.4,0,Math.PI*2),i.fill();break;case"uru":s("#ffffff",0,0,t,n),i.fillStyle="#0038a8";for(let c=1;c<9;c+=2)i.fillRect(0,c*n/9,t,n/9);i.fillStyle="#ffffff",i.fillRect(0,0,t*.42,n*5/9),i.fillStyle="#fcd116";{const c=t*.21,h=n*.28;for(let u=0;u<8;u++){const f=u*Math.PI/4;is(i,c,h,c+Math.cos(f)*16,h+Math.sin(f)*16,"#fcd116",3)}i.beginPath(),i.arc(c,h,8,0,Math.PI*2),i.fill()}break;default:s("#444444",0,0,t,n)}}function hg(i,e,t,n){const s=e.cols,r=(a,o,l,c,h)=>{i.fillStyle=a,i.fillRect(o,l,c,h)};switch(e.pattern){case"vert":r(s[0]??"#888",0,0,t/3,n),r(s[1]??"#ccc",t/3,0,t/3,n),r(s[2]??"#888",2*t/3,0,t/3,n);break;case"horiz":r(s[0]??"#888",0,0,t,n/3),r(s[1]??"#ccc",0,n/3,t,n/3),r(s[2]??"#888",0,2*n/3,t,n/3);break;case"halfV":r(s[0]??"#888",0,0,t/2,n),r(s[1]??"#ccc",t/2,0,t/2,n);break;case"halfH":r(s[0]??"#888",0,0,t,n/2),r(s[1]??"#ccc",0,n/2,t,n/2);break;case"cross":r(s[0]??"#888",0,0,t,n),i.fillStyle=s[1]??"#fff",i.fillRect(0,n*.4,t,n*.2),i.fillRect(t*.36,0,t*.18,n);break;case"saltire":r(s[0]??"#888",0,0,t,n),i.strokeStyle=s[1]??"#fff",i.lineWidth=n*.18,i.beginPath(),i.moveTo(0,0),i.lineTo(t,n),i.moveTo(t,0),i.lineTo(0,n),i.stroke();break;case"nordic":r(s[0]??"#888",0,0,t,n);{const a=t*.3,o=t*.16,l=n*.4,c=n*.2;if(i.fillStyle=s[1]??"#fff",i.fillRect(a,0,o,n),i.fillRect(0,l,t,c),s[2]){i.fillStyle=s[2];const h=o*.45,u=c*.45;i.fillRect(a+(o-h)/2,0,h,n),i.fillRect(0,l+(c-u)/2,t,u)}}break;default:r("#444",0,0,t,n)}}function Cc(i){const e=document.createElement("canvas");e.width=128,e.height=128;const t=e.getContext("2d");if(!t)return e;const n=ka.get(i);return!n||n.cols.length===0&&n.pattern==="detail"||n.pattern==="detail"?Tl(t,i,128,128):hg(t,n,128,128),t.strokeStyle="rgba(0,0,0,0.25)",t.lineWidth=8,t.strokeRect(0,0,128,128),e}const wl=new Map;function ug(i){const e=wl.get(i);if(e)return e;const t=new Ia(Cc(i));return t.colorSpace=lt,t.anisotropy=4,t.userData.sharedByCache=!0,wl.set(i,t),t}function hi(i){return Cc(i)}const dg=[{id:"esp",name:"España",color:Se.teamRed,colorDark:Se.teamRedDark,base:{power:1.08,accuracy:.88,tackle:.75,mass:.99}},{id:"bra",name:"Brasil",color:16765952,colorDark:12096768,base:{power:1.11,accuracy:.83,tackle:.74,mass:.97}},{id:"ger",name:"Alemania",color:1118481,colorDark:0,base:{power:1.02,accuracy:.85,tackle:.79,mass:1.03}},{id:"jpn",name:"Japón",color:3108336,colorDark:1785756,base:{power:.96,accuracy:.9,tackle:.68,mass:.94}},{id:"arg",name:"Argentina",color:7124196,colorDark:4161456,base:{power:1.12,accuracy:.87,tackle:.76,mass:1}},{id:"fra",name:"Francia",color:3100624,colorDark:1781644,base:{power:1.1,accuracy:.87,tackle:.78,mass:1.02}}],fg=[{id:"ita",name:"Italia",pattern:"vert",colors:["#009246","#ffffff","#ce2b37"],base:{power:.98,accuracy:.84,tackle:.79,mass:1.02}},{id:"eng",name:"Inglaterra",pattern:"cross",colors:["#ffffff","#ce1124"],base:{power:1.06,accuracy:.84,tackle:.77,mass:1.02}},{id:"por",name:"Portugal",pattern:"halfV",colors:["#006600","#ff0000"],base:{power:1.05,accuracy:.85,tackle:.76,mass:.99}},{id:"ned",name:"Países Bajos",pattern:"horiz",colors:["#ae1c28","#ffffff","#21468b"],base:{power:1.03,accuracy:.84,tackle:.77,mass:1.01}},{id:"bel",name:"Bélgica",pattern:"vert",colors:["#2d2926","#f3d02f","#c8102e"],base:{power:.99,accuracy:.83,tackle:.75,mass:1}},{id:"uru",name:"Uruguay",pattern:"detail",colors:["#ffffff","#0038a8","#fcd116"],base:{power:1,accuracy:.8,tackle:.78,mass:1.01}},{id:"cro",name:"Croacia",pattern:"horiz",colors:["#ff0000","#ffffff","#171796"],base:{power:.99,accuracy:.82,tackle:.8,mass:1.03}},{id:"mex",name:"México",pattern:"vert",colors:["#006847","#ffffff","#ce1126"],base:{power:.97,accuracy:.79,tackle:.75,mass:.98}},{id:"usa",name:"EE. UU.",pattern:"detail",colors:["#b22234","#ffffff","#3c3b6e"],base:{power:.98,accuracy:.8,tackle:.74,mass:.98}},{id:"kor",name:"Corea",pattern:"detail",colors:["#ffffff","#cd2e3a","#0047a0"],base:{power:.97,accuracy:.85,tackle:.7,mass:.95}},{id:"sui",name:"Suiza",pattern:"cross",colors:["#d52b1e","#ffffff"],base:{power:.98,accuracy:.86,tackle:.8,mass:1.01}},{id:"sen",name:"Senegal",pattern:"vert",colors:["#00853f","#fdef42","#e31b23"],base:{power:.98,accuracy:.8,tackle:.81,mass:.99}},{id:"mar",name:"Marruecos",pattern:"detail",colors:["#c1272d","#006233"],base:{power:1,accuracy:.81,tackle:.83,mass:.99}},{id:"col",name:"Colombia",pattern:"horiz",colors:["#fcd116","#003893","#ce1126"],base:{power:1,accuracy:.82,tackle:.77,mass:.99}},{id:"den",name:"Dinamarca",pattern:"nordic",colors:["#c60c30","#ffffff"],base:{power:.98,accuracy:.85,tackle:.8,mass:1.01}},{id:"pol",name:"Polonia",pattern:"halfH",colors:["#ffffff","#dc143c"],base:{power:.95,accuracy:.79,tackle:.77,mass:1.02}},{id:"swe",name:"Suecia",pattern:"nordic",colors:["#006aa7","#fecc00"],base:{power:.94,accuracy:.8,tackle:.78,mass:1.03}},{id:"nor",name:"Noruega",pattern:"nordic",colors:["#ba0c2f","#ffffff","#00205b"],base:{power:.97,accuracy:.82,tackle:.79,mass:1.03}},{id:"gha",name:"Ghana",pattern:"horiz",colors:["#ce1126","#fcd116","#006b3f"],base:{power:.96,accuracy:.77,tackle:.75,mass:.97}},{id:"nga",name:"Nigeria",pattern:"vert",colors:["#008751","#ffffff","#008751"],base:{power:.98,accuracy:.79,tackle:.76,mass:.98}},{id:"egy",name:"Egipto",pattern:"horiz",colors:["#ce1126","#ffffff","#111111"],base:{power:.95,accuracy:.76,tackle:.74,mass:.98}},{id:"aus",name:"Australia",pattern:"detail",colors:["#00008b","#ffffff","#e4002b"],base:{power:.95,accuracy:.79,tackle:.75,mass:.97}},{id:"can",name:"Canadá",pattern:"vert",colors:["#ff0000","#ffffff","#ff0000"],base:{power:.96,accuracy:.79,tackle:.74,mass:.96}},{id:"ecu",name:"Ecuador",pattern:"horiz",colors:["#ffdd00","#034ea2","#ed1c24"],base:{power:.97,accuracy:.8,tackle:.75,mass:.98}},{id:"sco",name:"Escocia",pattern:"saltire",colors:["#0065bf","#ffffff"],base:{power:.95,accuracy:.79,tackle:.76,mass:1}},{id:"tur",name:"Turquía",pattern:"detail",colors:["#e30a17","#ffffff"],base:{power:.97,accuracy:.82,tackle:.75,mass:.99}}];function Al(i){return parseInt(i.slice(1),16)>>>0}function pg(i,e=.55){const t=Math.floor((i>>16&255)*e),n=Math.floor((i>>8&255)*e),s=Math.floor((i&255)*e);return t<<16|n<<8|s}function mg(i){return(i>>16&255)+(i>>8&255)+(i&255)}function gg(i){for(const e of i){const t=Al(e),n=mg(t);if(n<690&&n>90)return t}return i[0]?Al(i[0]):Se.teamRed}const _g=fg.map(({id:i,name:e,pattern:t,colors:n,base:s})=>{const r=gg(n);return{id:i,name:e,color:r,colorDark:pg(r),base:s}}),oi=[...dg,..._g];function Qt(i){return oi.find(t=>t.id===i)??oi[0]}function tn(i){const e=`team.${i}`,t=K(e);return t===e?Qt(i).name:t}function lr(i){return i.base.power+i.base.accuracy+i.base.tackle}function cr(i,e){switch(e){case"sniper":return{power:i.power*1.15,accuracy:Math.min(1,i.accuracy*1.12),tackle:i.tackle*.85,mass:i.mass*.82};case"tank":return{power:i.power*1.08,accuracy:i.accuracy*.86,tackle:Math.min(1,i.tackle*1.25),mass:i.mass*1.5};case"playmaker":return{power:i.power*.95,accuracy:Math.min(1,i.accuracy*1.06),tackle:i.tackle,mass:i.mass}}}const ds=["tank","sniper","playmaker","tank","sniper"];class Rl{constructor(e,t,n){if(this.rng=t,n){this.playerId=n.playerId,this.alive=n.alive.slice(),this.pairs=n.pairs.map(r=>[r[0],r[1]]),this.lastResults=n.lastResults.map(r=>({...r})),this.eliminated=n.eliminated,this.champion=n.champion,this.rng.internalState=n.rngState;return}this.playerId=e;const s=oi.map(r=>r.id);this.shuffle(s),this.alive=s.slice(0,32),this.alive.includes(e)||(this.alive[0]=e),this.pairs=this.makePairs(this.alive)}playerId;alive;pairs;lastResults=[];eliminated=!1;champion=!1;serialize(){return{playerId:this.playerId,rngState:this.rng.internalState,alive:this.alive.slice(),pairs:this.pairs.map(e=>[e[0],e[1]]),lastResults:this.lastResults.map(e=>({...e})),eliminated:this.eliminated,champion:this.champion}}shuffle(e){for(let t=e.length-1;t>0;t--){const n=this.rng.int(t+1),s=e[t];e[t]=e[n],e[n]=s}}makePairs(e){const t=[];for(let n=0;n+1<e.length;n+=2)t.push([e[n],e[n+1]]);return t}roundKey(){return`r${this.alive.length}`}aliveCount(){return this.alive.length}opponent(){for(const[e,t]of this.pairs){if(e===this.playerId)return t;if(t===this.playerId)return e}return this.alive.find(e=>e!==this.playerId)??this.playerId}resolveRound(e,t,n){const s=[],r=[];for(const[a,o]of this.pairs)if(a===this.playerId||o===this.playerId){const l=a===this.playerId,c=e?this.playerId:l?o:a;s.push({a,b:o,ga:l?t:n,gb:l?n:t,winner:c}),r.push(c)}else{const l=this.simTie(a,o);s.push(l),r.push(l.winner)}if(this.lastResults=s,!e){this.eliminated=!0;return}if(this.alive=r,this.alive.length===1){this.champion=!0;return}this.pairs=this.makePairs(this.alive)}simTie(e,t){const n=lr(Qt(e)),s=lr(Qt(t)),r=n/(n+s),a=this.rng.next()<r*.7+.15,o=1+this.rng.int(3),l=this.rng.int(o);return{a:e,b:t,ga:a?o:l,gb:a?l:o,winner:a?e:t}}}const Lc=8,Xs=Lc-1;class Cl{constructor(e,t,n){if(this.rng=t,n){this.playerId=n.playerId,this.teams=n.teams.slice(),this.schedule=n.schedule.map(r=>r.map(a=>[a[0],a[1]]));for(const r of n.table)this.table.set(r.id,{...r});this.matchday=n.matchday,this.lastResults=n.lastResults.map(r=>({...r})),this.done=n.done,this.rng.internalState=n.rngState;return}this.playerId=e;const s=oi.map(r=>r.id).filter(r=>r!==e);for(let r=s.length-1;r>0;r--){const a=this.rng.int(r+1),o=s[r];s[r]=s[a],s[a]=o}this.teams=[e,...s.slice(0,Lc-1)];for(const r of this.teams)this.table.set(r,{id:r,pts:0,gf:0,ga:0,gd:0,played:0});this.schedule=this.buildSchedule(this.teams)}playerId;teams;schedule;table=new Map;matchday=0;lastResults=[];done=!1;serialize(){return{playerId:this.playerId,rngState:this.rng.internalState,teams:this.teams.slice(),schedule:this.schedule.map(e=>e.map(t=>[t[0],t[1]])),table:[...this.table.values()].map(e=>({...e})),matchday:this.matchday,lastResults:this.lastResults.map(e=>({...e})),done:this.done}}buildSchedule(e){const t=e.slice(),n=t.length,s=[];for(let r=0;r<n-1;r++){const a=[];for(let l=0;l<n/2;l++)a.push([t[l],t[n-1-l]]);s.push(a);const o=t.slice(1);o.unshift(o.pop()),t.splice(0,t.length,t[0],...o)}return s}total(){return Xs}matchdayName(){return`JORNADA ${Math.min(this.matchday+1,Xs)} / ${Xs}`}playerOpponent(){const e=this.schedule[this.matchday];if(e)for(const[t,n]of e){if(t===this.playerId)return n;if(n===this.playerId)return t}return this.teams[1]??this.playerId}recordMatchday(e,t){const n=this.schedule[this.matchday]??[],s=[];for(const[r,a]of n){let o,l;if(r===this.playerId||a===this.playerId){const c=r===this.playerId;o=c?e:t,l=c?t:e}else[o,l]=this.simScore(r,a);this.applyResult(r,a,o,l),s.push({a:r,b:a,ga:o,gb:l,winner:o>l?r:l>o?a:"draw"})}this.lastResults=s,this.matchday++,this.matchday>=Xs&&(this.done=!0)}simScore(e,t){const n=lr(Qt(e)),s=lr(Qt(t)),r=n/(n+s),a=o=>{let l=0;for(let c=0;c<4;c++)this.rng.next()<o*.55&&l++;return l};return[a(r),a(1-r)]}applyResult(e,t,n,s){const r=this.table.get(e),a=this.table.get(t);r.gf+=n,r.ga+=s,r.gd=r.gf-r.ga,r.played++,a.gf+=s,a.ga+=n,a.gd=a.gf-a.ga,a.played++,n>s?r.pts+=3:s>n?a.pts+=3:(r.pts+=1,a.pts+=1)}standings(){return[...this.table.values()].sort((e,t)=>t.pts-e.pts||t.gd-e.gd||t.gf-e.gf)}champion(){return this.standings()[0]?.id??this.playerId}playerRank(){return this.standings().findIndex(e=>e.id===this.playerId)+1}}function vg(){const e=document.createElement("canvas");e.width=1024,e.height=1024;const t=e.getContext("2d");if(t){t.fillStyle=Ke(Se.bgOuter),t.fillRect(0,0,1024,1024);const s=t.createRadialGradient(1024*.5,1024*.42,60,1024*.5,1024*.52,1024*.72);s.addColorStop(0,Ke(Se.bgInner)),s.addColorStop(.55,"#0d231a"),s.addColorStop(1,Ke(Se.bgOuter)),t.fillStyle=s,t.fillRect(0,0,1024,1024);const r=t.createRadialGradient(1024*.5,1024*.1,0,1024*.5,1024*.1,1024*.5);r.addColorStop(0,"rgba(120, 200, 165, 0.16)"),r.addColorStop(1,"rgba(120, 200, 165, 0)"),t.fillStyle=r,t.fillRect(0,0,1024,1024);const a=t.createRadialGradient(1024*.5,1024*.94,0,1024*.5,1024*.94,1024*.5);a.addColorStop(0,"rgba(255, 206, 74, 0.06)"),a.addColorStop(1,"rgba(255, 206, 74, 0)"),t.fillStyle=a,t.fillRect(0,0,1024,1024);const o=t.createRadialGradient(1024*.5,1024*.5,1024*.32,1024*.5,1024*.5,1024*.74);o.addColorStop(0,"rgba(0, 0, 0, 0)"),o.addColorStop(1,"rgba(0, 0, 0, 0.5)"),t.fillStyle=o,t.fillRect(0,0,1024,1024)}const n=new Ia(e);return n.colorSpace=lt,n}class xg{renderer;scene=new Qm;camera;target=new U(0,0,0);bottomInset=0;fw=1;fh=1;vpX=0;vpY=0;vpW=1;vpH=1;onResize;constructor(e){this.renderer=new Tc({antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.renderer.outputColorSpace=lt,this.renderer.toneMapping=$l,this.renderer.toneMappingExposure=1.18,e.appendChild(this.renderer.domElement),this.scene.background=vg(),this.camera=new Pa(-1,1,1,-1,.1,500),this.camera.position.set(0,120,0),this.camera.up.set(0,0,1),this.camera.lookAt(this.target);const t=new rg(Se.skyTop,Se.feltDeep,1.35);this.scene.add(t),this.scene.add(new lg(Se.white,.35));const n=new bl(Se.lightKey,1.7);n.position.set(-26,80,-6),this.scene.add(n);const s=new bl(Se.lightRim,.6);s.position.set(40,44,70),this.scene.add(s),this.onResize=()=>this.resize(),window.addEventListener("resize",this.onResize),window.addEventListener("orientationchange",this.onResize),this.resize()}setBottomInset(e){this.bottomInset=Math.max(0,e),this.resize()}resize(){const e=window.innerWidth,t=window.innerHeight,n=Math.min(window.devicePixelRatio||1,2);this.renderer.setPixelRatio(n),this.renderer.setSize(e,t,!1);const s=Math.min(this.bottomInset,t*.42),r=Math.min(t*.075,70),a=Math.max(t-s-r,220);this.fw=e,this.fh=t,this.vpX=0,this.vpY=s,this.vpW=e,this.vpH=a;const o=e/a,l=Xe.halfWidth*2+5.5,c=Xe.halfLength*2+5.5,h=Math.max(c,l/o),u=h*o;this.camera.left=-u/2,this.camera.right=u/2,this.camera.top=h/2,this.camera.bottom=-h/2,this.camera.position.set(0,120,0),this.camera.up.set(0,0,1),this.camera.lookAt(this.target),this.camera.updateProjectionMatrix()}render(){const e=this.renderer;e.setScissorTest(!1),e.setViewport(0,0,this.fw,this.fh),e.setClearColor(Se.bgOuter,1),e.clear(),e.setViewport(this.vpX,this.vpY,this.vpW,this.vpH),e.setScissor(this.vpX,this.vpY,this.vpW,this.vpH),e.setScissorTest(!0),e.render(this.scene,this.camera)}dispose(){window.removeEventListener("resize",this.onResize),window.removeEventListener("orientationchange",this.onResize),this.renderer.dispose(),this.renderer.domElement.remove()}}function Ll(i){const e=new On,t=new Wn({color:Se.capRim,roughness:.6,metalness:.05}),n=new wn(.5,4,.5),s=i*Xe.halfLength;for(const c of[-1,1]){const h=new vt(n,t);h.position.set(c*Xe.goalHalfWidth,2,s),e.add(h)}const r=new vt(new wn(Xe.goalHalfWidth*2+.5,.5,.5),t);r.position.set(0,4,s),e.add(r);const a=new Wn({color:Se.lineChalk,roughness:1,transparent:!0,opacity:.14}),o=new vt(new qi(Xe.goalHalfWidth*2,4),a);o.position.set(0,2,s+i*Xe.goalDepth),o.rotation.y=Math.PI,e.add(o);const l=new vt(new qi(Xe.goalHalfWidth*2,Xe.goalDepth),a);return l.rotation.x=-Math.PI/2,l.position.set(0,.05,s+i*Xe.goalDepth/2),e.add(l),e}function Sg(){const i=new On,t=new Ba().load(`${zt()}images/stade.webp`);t.colorSpace=lt;const n=new vt(new qi(60,100),new Wn({map:t,roughness:.85,metalness:.02}));n.rotation.x=-Math.PI/2,i.add(n);const s=new Wn({color:Se.woodRim,roughness:.8}),r=new wn(66,1.2,3);for(const o of[-1,1]){const l=new vt(r,s);l.position.set(0,.2,o*51.5),i.add(l)}const a=new wn(3,1.2,106);for(const o of[-1,1]){const l=new vt(a,s);l.position.set(o*31.5,.2,0),i.add(l)}return i.add(Ll(1)),i.add(Ll(-1)),i}const Di=q.count,ms=new Ba().load(`${zt()}images/chapa.webp`);ms.colorSpace=lt;ms.wrapS=er;ms.repeat.set(8,1);ms.userData.sharedByCache=!0;function Mg(i,e,t=!1){const n=document.createElement("canvas");n.width=256,n.height=128;const s=n.getContext("2d");if(s){s.clearRect(0,0,256,128),s.fillStyle="rgba(8, 20, 14, 0.9)",s.strokeStyle=e,s.lineWidth=10,s.beginPath(),typeof s.roundRect=="function"?s.roundRect(12,12,232,104,28):s.rect(12,12,232,104),s.fill(),s.stroke(),s.fillStyle="#ffffff",s.font="900 80px ui-sans-serif, system-ui, sans-serif",s.textAlign="center",s.textBaseline="middle";const r=t?"★ "+i:i;s.fillText(r,128,64)}return n}function yg(i){return i==="tank"?Se.classTank:i==="playmaker"?Se.classPlaymaker:Se.classSniper}class Eg{root=new On;meshes=new Array(Di).fill(null);markers=new Array(Di).fill(null);labels=new Array(Di).fill(null);scaleX=new Float32Array(Di).fill(1);scaleY=new Float32Array(Di).fill(1);ring;constructor(e,t,n=[]){const s=new Fa(et.radius,et.radius,et.height,40,1,!1),r=new or(et.radius+.05,et.radius+.42,28);for(let a=q.blueStart;a<Di;a++){const o=a<q.redStart,l=o?e:t,c=o?a-q.blueStart:a-q.redStart,h=ds[c]??"sniper",u=new Wn({map:ms,color:o?Se.teamBlue:l.color,roughness:.32,metalness:.65}),f=new Wn({map:ug(l.id),roughness:.5}),m=new Wn({color:Se.capUnder,roughness:.8}),g=new vt(s,[u,f,m]);g.position.y=et.height/2,this.meshes[a]=g,this.root.add(g);const _=new vt(r,new rr({color:yg(h),transparent:!0,opacity:.85}));_.rotation.x=-Math.PI/2,_.position.y=.05,this.markers[a]=_,this.root.add(_);const p=o?a-q.blueStart:a-q.redStart;let d="role.gk.short";p===1||p===2?d="role.def.short":p===3?d="role.mid.short":p===4&&(d="role.att.short");let y=!1;if(o&&p>=1&&p<=4){const v=n[p-1];v&&v.pow+v.acc+v.tk>=8&&(y=!0)}const S=K(d).toUpperCase(),b=o?"#3b82f6":"#"+l.color.toString(16).padStart(6,"0"),R=Mg(S,b,y),w=new Ia(R),A=new Ua({map:w,depthWrite:!1,depthTest:!0}),k=new Ac(A);k.scale.set(3,1.5,1),k.position.y=.12,this.labels[a]=k,this.root.add(k)}this.ring=new vt(new or(et.radius+.5,et.radius+1.05,36),new rr({color:Se.selectRing,transparent:!0,opacity:.95})),this.ring.rotation.x=-Math.PI/2,this.ring.position.y=.08,this.ring.visible=!1,this.root.add(this.ring)}get object(){return this.root}pulse(e){this.scaleX[e]=.7,this.scaleY[e]=1.35}setSelected(e,t){this.ring.visible=!0,this.ring.position.set(e,.08,t)}hideSelected(){this.ring.visible=!1}updateCap(e,t,n,s){const r=this.meshes[e];if(!r)return;r.position.x=t,r.position.z=n;const a=this.markers[e];a&&a.position.set(t,.05,n);const o=this.labels[e];o&&o.position.set(t,.12,n+2.4);const l=Math.min(1,s*9);this.scaleX[e]+=(1-this.scaleX[e])*l,this.scaleY[e]+=(1-this.scaleY[e])*l,r.scale.set(this.scaleX[e],this.scaleY[e],this.scaleX[e]),r.position.y=et.height/2*this.scaleY[e]}dispose(){const e=new Set,t=new Set;this.root.traverse(n=>{const s=n;s.geometry&&e.add(s.geometry);const r=s.material;Array.isArray(r)?r.forEach(a=>t.add(a)):r&&t.add(r)}),e.forEach(n=>n.dispose()),t.forEach(n=>{const s=n.map;s&&!s.userData.sharedByCache&&s.dispose(),n.dispose()}),this.root.clear()}}const ta=18,na=["ball_01.webp","ball_02.webp","ball_03.webp","ball_04.webp","ball_05.webp"],Pl=new Map;function Dl(i){const e=Pl.get(i);if(e)return e;const n=new Ba().load(`${zt()}images/${i}`);return n.colorSpace=lt,Pl.set(i,n),n}class bg{root=new On;ball;shadow;trail;trailPos=new Float32Array(ta*3);trailMat;ballMat;primed=!1;constructor(){const e=Dl(na[0]);this.ballMat=new Ua({map:e,transparent:!0,depthWrite:!1,alphaTest:.02}),this.ball=new Ac(this.ballMat),this.ball.scale.set(ut.radius*2.15,ut.radius*2.15,1),this.root.add(this.ball);const t=new Wn({color:Se.shadowInk,transparent:!0,opacity:.45,depthWrite:!1});this.shadow=new vt(new Na(ut.radius*1.15,24),t),this.shadow.rotation.x=-Math.PI/2,this.shadow.position.y=.03,this.root.add(this.shadow);const n=new qt;n.setAttribute("position",new nn(this.trailPos,3)),this.trailMat=new Rc({color:Se.trailHot,transparent:!0,opacity:.85}),this.trail=new tg(n,this.trailMat),this.trail.visible=!1,this.trail.frustumCulled=!1,this.root.add(this.trail)}get object(){return this.root}setSkin(e){const t=Math.abs(e>>>0)%na.length,n=na[t],s=Dl(n);this.ballMat.map!==s&&(this.ballMat.map=s,this.ballMat.needsUpdate=!0)}update(e,t,n,s){this.ball.position.set(e,t,n);const a=1/(1+Math.max(0,t-ut.groundY)*.18);this.shadow.position.set(e,.03,n),this.shadow.scale.setScalar(a);const o=this.shadow.material;if(o.opacity=.12+.33*a,this.primed){this.trailPos.copyWithin(0,3);const c=(ta-1)*3;this.trailPos[c]=e,this.trailPos[c+1]=t,this.trailPos[c+2]=n}else{for(let c=0;c<ta;c++)this.trailPos[c*3]=e,this.trailPos[c*3+1]=t,this.trailPos[c*3+2]=n;this.primed=!0}this.trail.geometry.getAttribute("position").needsUpdate=!0;const l=s>ut.trailSpeed;this.trail.visible=l,this.trailMat.opacity=l?Math.min(.9,.3+s*.02):0}}function Ui(i,e){return-i*e}function Tg(i){return i>-9&&i<Xe.goalHalfWidth}const wg=Xe.goalHalfWidth;function Ag(i,e,t,n,s,r){return Tg(i)&&t<et.height+3?{goal:n>0?"blue":"red",post:!1}:{goal:null,post:Math.abs(Math.abs(i)-wg)<r+.4&&Math.abs(e-s)<r+.6}}function Rg(i,e,t,n,s){if(n&&(e===s||t===s))return;const r=i.px[e],a=i.pz[e],o=i.px[t],l=i.pz[t];let c=o-r,h=l-a;const u=i.radius[e]+i.radius[t],f=c*c+h*h;if(f>=u*u||f===0)return;const m=Math.sqrt(f),g=c/m,_=h/m,p=u-m,d=i.invMass[e],y=i.invMass[t],S=d+y||1,b=p/S;i.px[e]-=g*b*d,i.pz[e]-=_*b*d,i.px[t]+=g*b*y,i.pz[t]+=_*b*y;const R=i.vx[t]-i.vx[e],w=i.vz[t]-i.vz[e],A=R*g+w*_;if(A>0)return;const v=-(1+Math.min(i.restitution[e],i.restitution[t]))*A/S,T=v*g,G=v*_;i.vx[e]-=T*d,i.vz[e]-=G*d,i.vx[t]+=T*y,i.vz[t]+=G*y}function Cg(i,e){for(let t=0;t<i.slide.length;t++){if(t===q.ball||i.slide[t]<=0)continue;i.slide[t]-=e;const n=i.px[q.ball]-i.px[t],s=i.pz[q.ball]-i.pz[t];if(n*n+s*s<=fn.stealRadius*fn.stealRadius){let r=i.vx[t],a=i.vz[t],o=Math.hypot(r,a);o<1&&(r=n,a=s,o=Math.hypot(r,a)||1),i.vx[q.ball]*=fn.carrierSlow,i.vz[q.ball]*=fn.carrierSlow,i.vx[q.ball]+=r/o*fn.poke,i.vz[q.ball]+=a/o*fn.poke,i.slide[t]=0}i.slide[t]<0&&(i.slide[t]=0)}}const gt=q.count,Lg=[-1,1];class Pg{px=new Float32Array(gt);pz=new Float32Array(gt);vx=new Float32Array(gt);vz=new Float32Array(gt);ppx=new Float32Array(gt);ppz=new Float32Array(gt);py=0;ppy=0;vy=0;radius=new Float32Array(gt);invMass=new Float32Array(gt);retain=new Float32Array(gt);restitution=new Float32Array(gt);isGoalie=new Uint8Array(gt);goalieLineZ=new Float32Array(gt);slide=new Float32Array(gt);passTeam=null;passer=-1;passTimer=0;markPass(e,t,n){this.passTeam=e,this.passer=t,this.passTimer=n}clearPass(){this.passTeam=null,this.passer=-1,this.passTimer=0}lastGoal=null;lastEventSpeed=0;postHit=!1;constructor(){for(let e=0;e<gt;e++){const t=e===q.ball;this.radius[e]=t?ut.radius:et.radius,this.invMass[e]=t?1/ut.mass:1/et.baseMass,this.retain[e]=t?Lt.ballLinearRetain:Lt.capLinearRetain,this.restitution[e]=t?Lt.restitutionBall:Lt.restitutionCap}}setMass(e,t){this.invMass[e]=t>0?1/t:0}markGoalie(e,t){this.isGoalie[e]=1,this.goalieLineZ[e]=t}place(e,t,n){this.px[e]=t,this.pz[e]=n,this.ppx[e]=t,this.ppz[e]=n,this.vx[e]=0,this.vz[e]=0,e===q.ball&&(this.py=ut.groundY,this.ppy=ut.groundY,this.vy=0)}applyImpulse(e,t,n,s){const r=this.invMass[e];this.vx[e]+=t*r,this.vz[e]+=n*r,e===q.ball&&s!==0&&(this.vy+=s*r)}speed(e){const t=this.vx[e],n=this.vz[e];return Math.hypot(t,n)}step(e){this.lastGoal=null,this.postHit=!1,this.ppy=this.py;for(let t=0;t<gt;t++)this.ppx[t]=this.px[t],this.ppz[t]=this.pz[t];(this.py>ut.groundY||this.vy!==0)&&(this.vy-=Lt.gravity*e,this.py+=this.vy*e,this.py<=ut.groundY&&(this.py=ut.groundY,this.vy=-this.vy*.35,Math.abs(this.vy)<1.5&&(this.vy=0)));for(let t=0;t<gt;t++){const n=this.slide[t]>0,s=Math.pow(n?fn.glide:this.retain[t],e);this.vx[t]*=s,this.vz[t]*=s,!n&&this.speed(t)<Lt.sleepEps&&(this.vx[t]=0,this.vz[t]=0),this.px[t]+=this.vx[t]*e,this.pz[t]+=this.vz[t]*e}this.resolvePairs(),this.processSlides(e),this.resolveBounds(),this.constrainGoalies()}startSlide(e,t,n,s,r){const a=Math.hypot(t,n)||1;this.vx[e]+=t/a*s,this.vz[e]+=n/a*s,this.slide[e]=r}processSlides(e){Cg(this,e)}resolvePairs(){const e=this.py>et.height+ut.radius;for(let t=0;t<gt;t++)for(let n=t+1;n<gt;n++)Rg(this,t,n,e,q.ball)}resolveBounds(){for(let e=0;e<gt;e++){const t=this.radius[e],n=e===q.ball;if(this.px[e]-t<-27.2?(this.px[e]=-27.2+t,this.vx[e]=Ui(this.vx[e],n?Xe.wallRestitution:Lt.restitutionCap)):this.px[e]+t>Xe.halfWidth&&(this.px[e]=Xe.halfWidth-t,this.vx[e]=Ui(this.vx[e],n?Xe.wallRestitution:Lt.restitutionCap)),!n){this.pz[e]-t<-45.5?(this.pz[e]=-45.5+t,this.vz[e]=Ui(this.vz[e],Lt.restitutionCap)):this.pz[e]+t>Xe.halfLength&&(this.pz[e]=Xe.halfLength-t,this.vz[e]=Ui(this.vz[e],Lt.restitutionCap));continue}this.resolveBallBackWall()}}resolveBallBackWall(){const e=q.ball,t=this.radius[e],n=this.px[e],s=this.pz[e];for(const r of Lg){const a=r*Xe.halfLength;if(!(r>0?s+t>a:s-t<a))continue;const l=Ag(n,s,this.py,r,a,t);if(l.goal){this.lastEventSpeed=this.speed(e),this.lastGoal=l.goal;return}l.post&&(this.postHit=!0,this.lastEventSpeed=this.speed(e),this.vx[e]=Ui(this.vx[e],.7)),this.pz[e]=a-r*t,this.vz[e]=Ui(this.vz[e],Xe.wallRestitution)}}constrainGoalies(){for(let e=0;e<gt;e++){if(!this.isGoalie[e])continue;this.pz[e]=this.goalieLineZ[e],this.vz[e]=0;const t=Xe.goalHalfWidth+2;this.px[e]<-t?(this.px[e]=-t,this.vx[e]=0):this.px[e]>t&&(this.px[e]=t,this.vx[e]=0)}}ix(e,t){return this.ppx[e]+(this.px[e]-this.ppx[e])*t}iz(e,t){return this.ppz[e]+(this.pz[e]-this.ppz[e])*t}iy(e){return this.ppy+(this.py-this.ppy)*e}}const Dg=.42,Ug=.14,Bn={ix:0,iz:0,iy:0};function ia(i,e,t,n,s,r){const a=(1-s.accuracy)*Dg;let o=r.signed(a),l=t*s.power,c=!1;const h=(1-s.accuracy)*Ug;r.next()<h&&(c=!0,l*=.32,o+=r.signed(.5));const u=Math.cos(o),f=Math.sin(o),m=i*u-e*f,g=i*f+e*u;return Bn.ix=m*l,Bn.iz=g*l,Bn.iy=c?n*.4:n,{applied:!0,misKick:c,power:l}}const Ig=26,Ng=20,Fg=16,Og=40;function Pc(i){return i==="blue"?1:-1}function Bg(i,e,t){const n=e==="blue"?q.blueStart:q.redStart,s=n+q.perSide;let r=-1,a=1/0;const o=Pc(e);for(let l=n;l<s;l++){if(l===t||i.isGoalie[l])continue;const c=(i.pz[l]-i.pz[t])*o,h=i.px[l]-i.px[t],u=Math.hypot(h,i.pz[l]-i.pz[t])+(c<0?30:0);u<a&&(a=u,r=l)}return r}function zg(i,e,t,n,s){const r=Math.hypot(n,s);if(r<.1)return-1;const a=n/r,o=s/r,l=e==="blue"?q.blueStart:q.redStart,c=l+q.perSide;let h=-1,u=-1/0;for(let f=l;f<c;f++){if(f===t||i.isGoalie[f])continue;const m=i.px[f]-i.px[t],g=i.pz[f]-i.pz[t],_=Math.hypot(m,g)||1,p=m/_*a+g/_*o;if(p<zi.assistCone)continue;const d=p*2-_*.02;d>u&&(u=d,h=f)}return h}function kg(i){return{power:i.power,accuracy:Math.max(i.accuracy,zi.receiveAccuracy),tackle:i.tackle,mass:i.mass}}function Gg(i,e,t){const n=e==="blue"?q.redStart:q.blueStart,s=n+q.perSide;let r=-1,a=1/0;for(let o=n;o<s;o++){const l=i.px[o]-i.px[t],c=i.pz[o]-i.pz[t],h=l*l+c*c;h<a&&(a=h,r=o)}return r}function sa(i,e,t,n){const s=t-i.px[e],r=n-i.pz[e],a=Math.hypot(s,r)||1;return[s/a,r/a]}function ra(i,e,t){i.applyImpulse(e,Bn.ix,Bn.iz,0);const n=i.px[q.ball]-i.px[e],s=i.pz[q.ball]-i.pz[e],r=et.radius+ut.radius+1.2;n*n+s*s<=r*r&&i.applyImpulse(q.ball,Bn.ix*1.1,Bn.iz*1.1,t)}function ls(i,e,t,n,s,r,a=1,o=0,l=0){const c=Pc(n),h=c*Xe.halfLength;let u;switch(i){case"pass":{const f=Math.hypot(o,l)>.1,m=f?zg(e,n,t,o,l):-1,g=m>=0?m:f?-1:Bg(e,n,t);let _,p,d=s;if(g>=0)_=e.px[g]+e.vx[g]*zi.lead,p=e.pz[g]+e.vz[g]*zi.lead,d=kg(s);else if(f){const b=Math.hypot(o,l);_=e.px[t]+o/b*20,p=e.pz[t]+l/b*20}else _=e.px[t],p=e.pz[t]+c*20;const[y,S]=sa(e,t,_,p);return u=ia(y,S,Ig*a,0,d,r),ra(e,t,0),e.markPass(n,t,zi.trapWindow),u}case"lob":{const[f,m]=[0,c];return u=ia(f,m,Ng*a,Fg,s,r),ra(e,t,Bn.iy),e.clearPass(),u}case"shoot":{const f=n==="blue"?q.redStart:q.blueStart,g=(e.px[f]??0)>0?-9*.82:Xe.goalHalfWidth*.82,[_,p]=sa(e,t,g,h);return u=ia(_,p,Og*a,0,s,r),ra(e,t,0),e.clearPass(),u}case"tackle":{const f=Gg(e,n,t),m=Math.hypot(e.px[q.ball]-e.px[t],e.pz[q.ball]-e.pz[t]),g=m<12||f<0?e.px[q.ball]:e.px[f],_=m<12||f<0?e.pz[q.ball]:e.pz[f],[p,d]=sa(e,t,g,_);return e.startSlide(t,p,d,fn.lunge*(.7+s.tackle*.6),fn.slideTime),{applied:!0,misKick:!1,power:fn.lunge}}}}function hr(i,e){const t=i.px[q.ball],n=i.pz[q.ball];let s=-1,r=1/0;for(let a=e;a<e+q.perSide;a++){if(i.isGoalie[a])continue;const o=i.px[a]-t,l=i.pz[a]-n,c=o*o+l*l;c<r&&(r=c,s=a)}return s}function Hg(i,e,t){const n=i.px[q.ball],s=i.pz[q.ball];let r=-1,a=1/0;for(let o=e;o<e+q.perSide;o++){if(i.isGoalie[o]||o===t)continue;const l=i.px[o]-n,c=i.pz[o]-s,h=l*l+c*c;h<a&&(a=h,r=o)}return r}function Ul(i,e,t){const n=hr(i,e),s=hr(i,t);if(n<0)return!1;if(s<0)return!0;const r=i.px[q.ball],a=i.pz[q.ball],o=Math.hypot(i.px[n]-r,i.pz[n]-a),l=Math.hypot(i.px[s]-r,i.pz[s]-a);return o<=l+.5}const Il=[-1,1,-2,2],Nl=i=>{const e=Xe.halfWidth-et.radius-1;return i<-e?-e:i>e?e:i},Fl=i=>{const e=Xe.halfLength-et.radius-1;return i<-e?-e:i>e?e:i};class Ol{constructor(e,t,n="balanced",s="easy"){this.profile=t,this.start=e==="blue"?q.blueStart:q.redStart,this.oppStart=e==="blue"?q.redStart:q.blueStart,this.attack=e==="blue"?1:-1,this.tactic=js[n],this.d=da[s]}cooldown=0;start;oppStart;attack;tactic=js.balanced;d=da.easy;setTactic(e){this.tactic=js[e]}steer(e,t){const n=e.px[q.ball],s=e.pz[q.ball],r=e.vx[q.ball],a=e.vz[q.ball],o=hr(e,this.start),l=Ul(e,this.start,this.oppStart),c=-this.attack*Xe.halfLength,h=this.d.speed,u=!l&&this.d.press>1.1?Hg(e,this.start,o):-1,f=ft.leadTime*this.d.lead;for(let m=1;m<q.perSide;m++){const g=this.start+m;if(g===t)continue;const _=m-1,p=Il[_%Il.length]??0;let d,y,S;if(g===o)if(l){const b=(et.radius+ut.radius)*.7;d=n,y=s-this.attack*b,S=ft.chaseSpeed*this.tactic.speed*h}else d=n+r*f,y=s+a*f,S=ft.chaseSpeed*this.tactic.speed*h;else if(g===u)d=n+r*f*.5,y=s+a*f*.5+this.attack*-1.5,S=ft.defendSpeed*this.tactic.speed*h;else if(l)d=Nl(n+p*ft.supportLane),y=Fl(s+this.attack*ft.supportAhead*this.tactic.support),S=ft.supportSpeed*this.tactic.speed*h;else{const b=this.tactic.depth+_%2*.1,R=Math.min(.75,.4*this.d.press);d=Nl(n*R+p*(ft.markSpread/Math.sqrt(this.d.press))),y=Fl(s+(c-s)*b),S=ft.defendSpeed*this.tactic.speed*h}this.applySeparation(e,g,m),this.steerToward(e,g,d+this.sepX,y+this.sepZ,S)}}sepX=0;sepZ=0;applySeparation(e,t,n){this.sepX=0,this.sepZ=0;const s=e.px[t],r=e.pz[t];for(let a=0;a<q.perSide;a++){if(a===n)continue;const o=this.start+a,l=s-e.px[o],c=r-e.pz[o],h=Math.hypot(l,c);if(h>.001&&h<ft.sepRadius){const u=ft.sepStrength*(1-h/ft.sepRadius)/h;this.sepX+=l*u,this.sepZ+=c*u}}}steerToward(e,t,n,s,r){const a=n-e.px[t],o=s-e.pz[t],l=Math.hypot(a,o);if(l<.001)return;const c=l<ft.arriveRadius?r*(l/ft.arriveRadius):r,h=a/l*c,u=o/l*c;e.vx[t]+=(h-e.vx[t])*ft.steerK,e.vz[t]+=(u-e.vz[t])*ft.steerK}statsFor(e){const t=ds[e-this.start]??"sniper";return cr(this.profile.base,t)}act(e,t,n){if(this.cooldown-=n,this.cooldown>0)return;this.cooldown=(ft.carrierCooldown+t.range(0,.3))*this.d.reaction;const s=hr(e,this.start);if(s<0)return;const r=e.px[q.ball],a=e.pz[q.ball],o=Math.hypot(e.px[s]-r,e.pz[s]-a);if(Ul(e,this.start,this.oppStart)){if(o>et.radius+ut.radius+2)return;const c=this.boosted(this.statsFor(s)),h=this.attack*Xe.halfLength;if(Math.hypot(r,h-a)<ft.shootRange*this.d.shootRange)ls("shoot",e,s,this.teamOf(),c,t);else{const f=this.d.shootBias*.85;t.next()<f&&ls("pass",e,s,this.teamOf(),c,t)}}else if(o<ft.tackleRange&&o>et.radius+ut.radius+.1){const c=this.boosted(this.statsFor(s));ls("tackle",e,s,this.teamOf(),c,t),this.cooldown=(ft.carrierCooldown+t.range(0,.35))*this.d.reaction;return}}boosted(e){return this.d.accuracy<=0?e:{power:e.power,accuracy:Math.min(1,e.accuracy+this.d.accuracy),tackle:e.tackle,mass:e.mass}}teamOf(){return this.attack===1?"blue":"red"}reset(){this.cooldown=ft.carrierCooldown}}const Vg=[q.blueStart,q.redStart];function Wg(i,e=1){const t=i.px[q.ball],n=i.pz[q.ball],s=i.vx[q.ball],r=i.vz[q.ball];for(const a of Vg){const o=a===q.redStart?e:1,l=Bt.speed*o,c=Bt.reactK*o,u=i.goalieLineZ[a]-n;let f=t+s*Bt.leadTime;if(Math.sign(u)===Math.sign(r)&&Math.abs(r)>4){const p=Math.min(Bt.predictWindow,Math.max(0,u/r));f=t+s*p}const m=Xe.goalHalfWidth;f=f<-m?-m:f>m?m:f;const g=f-i.px[a],_=Math.max(-l,Math.min(l,g*c));i.vx[a]+=(_-i.vx[a])*Bt.blend}}function Xg(i,e,t){return i<=et.height+et.radius&&!e&&!t}function qg(i,e,t,n){const s=i-t,r=e-n;return s*s+r*r>Gt.kickEps*Gt.kickEps}function Yg(i,e,t,n,s){if(s)return!0;const r=i-t,a=e-n;return r*r+a*a>Gt.hold*Gt.hold}function $g(i){const{carrier:e,redStart:t,ballX:n,ballZ:s,carrierX:r,carrierZ:a,carrierVx:o,carrierVz:l}=i;let c=o,h=l,u=Math.hypot(c,h);u<1&&(c=0,h=e<t?1:-1,u=1);let f=r+c/u*Gt.offset,m=a+h/u*Gt.offset;const g=Xe.halfWidth-.5,_=Xe.halfLength-2;return f=f<-g?-g:f>g?g:f,m=m<-_?-_:m>_?_:m,{x:n+(f-n)*Gt.glue,z:s+(m-s)*Gt.glue,vx:o,vz:l}}function Kg(i){const e=i.team==="blue"?i.blueStart:i.redStart;let t=-1,n=Gt.capture*Gt.capture;for(let s=e;s<e+i.perSide;s++){if(s===i.passer||i.isGoalie[s])continue;const r=i.capXs[s]-i.ballX,a=i.capZs[s]-i.ballZ,o=r*r+a*a;o<=n&&(n=o,t=s)}return t}function jg(i){let e=-1,t=Gt.capture*Gt.capture;for(let n=i.blueStart;n<i.count;n++){if(i.isGoalie[n])continue;const s=i.capXs[n]-i.ballX,r=i.capZs[n]-i.ballZ,a=s*s+r*r;a<=t&&(t=a,e=n)}return e}function Zg(i,e,t,n){const s=n[0]??[0,0,0],r=n[n.length-1]??[0,0,0],a=Math.hypot(r[0]-s[0],r[2]-s[2]);return{team:i,speed:e,distance:a,lastSecond:t<10,trajectory:n}}const Jg=120;class Qg{constructor(e=Jg){this.max=e,this.data=new Float32Array(e*3)}data;len=0;head=0;record(e,t,n){const s=this.head*3;this.data[s]=e,this.data[s+1]=t,this.data[s+2]=n,this.head=(this.head+1)%this.max,this.len<this.max&&this.len++}clear(){this.len=0,this.head=0}build(){const e=[],t=(this.head-this.len+this.max)%this.max;for(let n=0;n<this.len;n++){const s=(t+n)%this.max*3;e.push([this.data[s],this.data[s+1],this.data[s+2]])}return e}}function e0(i){let e=-1,t=1/0;for(let l=i.blueStart;l<i.blueStart+i.perSide;l++){if(i.isGoalie[l])continue;const c=i.capXs[l]-i.ballX,h=i.capZs[l]-i.ballZ,u=c*c+h*h;u<t&&(t=u,e=l)}if(e<0)return i.selectedBlue;if(i.controlHold<=0)return e;const n=i.selectedBlue;if(n===e)return n;const s=i.capXs[n]-i.ballX,r=i.capZs[n]-i.ballZ,a=Math.hypot(s,r),o=Math.sqrt(t);return a>In.autoSwitchNear&&o<a-In.autoSwitchMargin?e:n}const t0=[[0,48],[-12,30],[12,30],[-8,14],[8,14]];class n0{constructor(e,t,n,s,r="balanced",a=[],o="easy"){this.blue=e,this.red=t,this.bus=n,this.blueUpgrades=a,this.rng=new Fi(s),this.blueAI=new Ol("blue",e,r),this.redAI=new Ol("red",t,"balanced",o),this.redKeeperMul=da[o].keeper,this.state={phase:"kickoff",timeLeft:dn.blitzSeconds,scoreBlue:0,scoreRed:0,seed:s,selectedBlue:q.blueStart+3},this.configureBodies(),this.kickoff(!1)}world=new Pg;state;rng;blueAI;redAI;blueStats=[];cooldown=0;freeze=0;redHold=0;blueHold=0;carrier=-1;carryRelease=0;driveX=0;driveZ=0;driveActive=!1;controlHold=0;kickoffTeam="blue";trajectory=new Qg;setKickoffTeam(e){this.kickoffTeam=e,this.kickoff(!1)}redKeeperMul;configureBodies(){for(let e=0;e<q.perSide;e++){const t=ds[e]??"sniper";let n=cr(this.blue.base,t);const s=e>=1?this.blueUpgrades[e-1]:void 0;s&&(n={power:n.power+s.pow*.045,accuracy:Math.min(1,n.accuracy+s.acc*.012),tackle:Math.min(1,n.tackle+s.tk*.022),mass:n.mass}),this.blueStats[q.blueStart+e]=n,this.world.setMass(q.blueStart+e,n.mass);const r=cr(this.red.base,t);this.world.setMass(q.redStart+e,r.mass)}this.world.markGoalie(q.blueStart,-45.5),this.world.markGoalie(q.redStart,Xe.halfLength)}kickoff(e){const t=this.world;for(let n=0;n<q.perSide;n++){const s=t0[n]??[0,0],r=s[0]??0,a=n===0?Xe.halfLength-1.5:s[1]??0;let o=r,l=-a;this.kickoffTeam==="blue"&&n===4&&(o=0,l=-1.8);let c=r,h=a;this.kickoffTeam==="red"&&n===4&&(c=0,h=1.8),t.place(q.blueStart+n,o,l),t.place(q.redStart+n,c,h)}t.place(q.ball,0,0),this.carrier=-1,this.carryRelease=0,this.world.clearPass(),this.redHold=0,this.blueHold=0,this.trajectory.clear(),this.cooldown=0,this.blueAI.reset(),this.redAI.reset(),this.state.phase="play",this.kickoffTeam==="blue"&&(this.state.selectedBlue=q.blueStart+4),e&&this.bus.emit("kickoff",void 0)}fixedStep(e){this.state.phase==="play"&&(this.cooldown=Math.max(0,this.cooldown-e),this.applySteering(),this.blueAI.steer(this.world,this.state.selectedBlue),this.redAI.steer(this.world,-1),Wg(this.world,this.redKeeperMul),this.world.step(e),this.redAI.act(this.world,this.rng,e),this.handleKeepers(e),this.updateCarry(e),this.trajectory.record(this.world.px[q.ball],this.world.py,this.world.pz[q.ball]),this.world.postHit&&this.bus.emit("hitPost",void 0),this.world.lastGoal&&this.onGoal(this.world.lastGoal),this.controlHold=Math.max(0,this.controlHold-e),this.updateSelection())}applySteering(){if(!this.driveActive)return;const e=this.state.selectedBlue;if(this.world.isGoalie[e])return;const t=this.driveX*In.driveSpeed,n=this.driveZ*In.driveSpeed;this.world.vx[e]+=(t-this.world.vx[e])*In.steerK,this.world.vz[e]+=(n-this.world.vz[e])*In.steerK,this.controlHold=In.holdSeconds}onGoal(e){e==="blue"?(this.state.scoreBlue++,this.kickoffTeam="red"):(this.state.scoreRed++,this.kickoffTeam="blue");const t=this.trajectory.build();this.bus.emit("goal",Zg(e,this.world.lastEventSpeed,this.state.timeLeft,t)),this.state.phase="goalFreeze",this.freeze=dn.goalFreezeSeconds}frameUpdate(e){this.state.phase==="play"?(this.state.timeLeft=Math.max(0,this.state.timeLeft-e),(this.state.scoreBlue>=dn.goalToWin||this.state.scoreRed>=dn.goalToWin||this.state.timeLeft<=0)&&this.endMatch()):this.state.phase==="goalFreeze"&&(this.freeze-=e,this.freeze<=0&&(this.state.scoreBlue>=dn.goalToWin||this.state.scoreRed>=dn.goalToWin?this.endMatch():this.kickoff(!0)))}endMatch(){if(this.state.phase==="ended")return;this.state.phase="ended";const e=this.state.scoreBlue===this.state.scoreRed?"draw":this.state.scoreBlue>this.state.scoreRed?"blue":"red";this.bus.emit("matchEnd",{winner:e})}updateSelection(){const e=this.world.px[q.ball],t=this.world.pz[q.ball];this.state.selectedBlue=e0({selectedBlue:this.state.selectedBlue,controlHold:this.controlHold,blueStart:q.blueStart,perSide:q.perSide,ballX:e,ballZ:t,capXs:this.world.px,capZs:this.world.pz,isGoalie:this.world.isGoalie})}canAct(){return this.state.phase==="play"&&this.cooldown<=0}playerAction(e){if(this.state.phase!=="play"||this.cooldown>0)return-1;const t=this.state.selectedBlue,n=this.blueStats[t];return n?(e!=="tackle"&&this.releaseCarry(),ls(e,this.world,t,"blue",n,this.rng,1,this.driveX,this.driveZ),this.cooldown=dn.actionCooldown,t):-1}playerKick(e){if(this.state.phase!=="play"||this.cooldown>0)return-1;const t=this.state.selectedBlue,n=this.blueStats[t];if(!n)return-1;this.releaseCarry();const s=Math.max(0,Math.min(1,e));let r,a;return s<jt.shotThreshold?(r="pass",a=jt.passMin+(jt.passMax-jt.passMin)*(s/jt.shotThreshold)):(r="shoot",a=jt.shootMin+(jt.shootMax-jt.shootMin)*((s-jt.shotThreshold)/(1-jt.shotThreshold))),ls(r,this.world,t,"blue",n,this.rng,a,this.driveX,this.driveZ),this.cooldown=dn.actionCooldown,t}releaseCarry(){this.carrier=-1,this.carryRelease=Gt.release}updateCarry(e){if(this.carryRelease>0&&(this.carryRelease=Math.max(0,this.carryRelease-e)),!Xg(this.world.py,this.gkHasBall(q.blueStart),this.gkHasBall(q.redStart))){this.carrier=-1;return}const t=q.ball,n=this.world.px[t],s=this.world.pz[t];if(this.world.passTimer>0){this.world.passTimer=Math.max(0,this.world.passTimer-e);const r=this.world.passTeam,a=zi.trapWindow-this.world.passTimer;if(r&&a>.12&&this.world.py<=et.height+et.radius){const o=Kg({team:r,passer:this.world.passer,ballX:n,ballZ:s,capXs:this.world.px,capZs:this.world.pz,isGoalie:this.world.isGoalie,blueStart:q.blueStart,redStart:q.redStart,perSide:q.perSide});o>=0&&(this.carrier=o,this.carryRelease=0,this.world.vx[t]=this.world.vx[o],this.world.vz[t]=this.world.vz[o],this.world.clearPass())}this.world.passTimer<=0&&this.world.clearPass()}if(this.carrier>=0&&this.carryRelease<=0&&qg(this.world.vx[t],this.world.vz[t],this.world.vx[this.carrier],this.world.vz[this.carrier])&&this.releaseCarry(),this.carryRelease<=0&&(this.carrier>=0&&Yg(this.world.px[this.carrier],this.world.pz[this.carrier],n,s,!!this.world.isGoalie[this.carrier])&&(this.carrier=-1),this.carrier<0&&(this.carrier=jg({ballX:n,ballZ:s,capXs:this.world.px,capZs:this.world.pz,isGoalie:this.world.isGoalie,blueStart:q.blueStart,count:q.count}))),this.carrier>=0&&this.carryRelease<=0&&!this.world.isGoalie[this.carrier]){const r=$g({carrier:this.carrier,redStart:q.redStart,ballX:n,ballZ:s,carrierX:this.world.px[this.carrier],carrierZ:this.world.pz[this.carrier],carrierVx:this.world.vx[this.carrier],carrierVz:this.world.vz[this.carrier]});this.world.px[t]=r.x,this.world.pz[t]=r.z,this.world.vx[t]=r.vx,this.world.vz[t]=r.vz}}setDrive(e,t,n){this.driveX=e,this.driveZ=t,this.driveActive=n}switchControlled(){if(this.state.phase!=="play")return;const e=q.blueStart+1,t=q.perSide-1,n=this.state.selectedBlue-e,s=e+((n<0?0:n)+1)%t;this.state.selectedBlue=s,this.controlHold=In.holdSeconds}bluePossession(){if(this.carrier>=0)return this.carrier>=q.blueStart&&this.carrier<q.redStart;const e=this.world.px[q.ball],t=this.world.pz[q.ball];let n=1/0,s=1/0;for(let r=0;r<q.perSide;r++){const a=q.blueStart+r,o=q.redStart+r;if(!this.world.isGoalie[a]){const l=(this.world.px[a]-e)**2+(this.world.pz[a]-t)**2;l<n&&(n=l)}if(!this.world.isGoalie[o]){const l=(this.world.px[o]-e)**2+(this.world.pz[o]-t)**2;l<s&&(s=l)}}return n<=s}gkHasBall(e){const t=this.world.px[q.ball]-this.world.px[e],n=this.world.pz[q.ball]-this.world.pz[e];return t*t+n*n<=Bt.catchRadius*Bt.catchRadius&&this.world.speed(q.ball)<Bt.catchSpeed}blueGkHasBall(){return this.state.phase==="play"&&this.gkHasBall(q.blueStart)}handleKeepers(e){this.gkHasBall(q.redStart)?(this.redHold+=e,this.redHold>=Bt.holdRed&&(this.clearBall(-1),this.redHold=0)):this.redHold=0,this.gkHasBall(q.blueStart)?(this.blueHold+=e,this.blueHold>=Bt.holdBlue&&(this.clearBall(1),this.blueHold=0)):this.blueHold=0}clearBall(e){this.carrier=-1,this.carryRelease=Gt.release;const t=this.rng.signed(Bt.clearSpread),n=Math.hypot(t,e)||1;this.world.vx[q.ball]*=.15,this.world.vz[q.ball]*=.15,this.world.applyImpulse(q.ball,t/n*Bt.clearMag,e/n*Bt.clearMag,Bt.clearLift)}playerClearance(){return this.state.phase!=="play"||this.cooldown>0||!this.gkHasBall(q.blueStart)?-1:(this.releaseCarry(),this.clearBall(1),this.blueHold=0,this.cooldown=dn.actionCooldown,q.blueStart)}desiredTimeScale(){return this.state.phase==="goalFreeze"||this.state.phase==="ended"?0:1}restart(e){this.rng=new Fi(e),this.state.phase="kickoff",this.state.timeLeft=dn.blitzSeconds,this.state.scoreBlue=0,this.state.scoreRed=0,this.state.seed=e,this.trajectory.clear(),this.kickoff(!0)}}const i0={KeyK:"lob"};class s0{constructor(e){this.cb=e,window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp)}dirX=0;dirZ=0;active=!1;up=!1;down=!1;left=!1;right=!1;jx=0;jy=0;jActive=!1;onKeyDown=e=>{if(this.setMoveKey(e.code,!0)){e.preventDefault();return}if(e.repeat)return;if(e.code==="Escape"){e.preventDefault(),this.cb.onPause();return}if(e.code==="KeyQ"||e.code==="Tab"){e.preventDefault(),this.cb.onSwitch();return}if(e.code==="KeyJ"||e.code==="Space"){e.preventDefault(),this.cb.onPrimaryDown();return}const t=i0[e.code];t&&(e.preventDefault(),this.cb.onAction(t))};onKeyUp=e=>{this.setMoveKey(e.code,!1)||(e.code==="KeyJ"||e.code==="Space")&&this.cb.onPrimaryUp()};setMoveKey(e,t){switch(e){case"KeyW":case"ArrowUp":return this.up=t,!0;case"KeyS":case"ArrowDown":return this.down=t,!0;case"KeyA":case"ArrowLeft":return this.left=t,!0;case"KeyD":case"ArrowRight":return this.right=t,!0;default:return!1}}setJoystick(e,t,n){this.jx=e,this.jy=t,this.jActive=n}update(){let e=0,t=0;this.up&&(t+=1),this.down&&(t-=1),this.left&&(e+=1),this.right&&(e-=1),this.jActive&&(e+=-this.jx,t+=-this.jy);const n=Math.hypot(e,t);n>.12?(this.dirX=e/n,this.dirZ=t/n,this.active=!0):(this.dirX=0,this.dirZ=0,this.active=!1)}dispose(){window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp)}}class r0{ctx=null;currentMode=null;menuBuffer=null;menuSource=null;menuLoading=null;matchBuffer=null;matchSource=null;matchLoading=null;musicGain=null;menuGain=null;matchGain=null;musicStarted=!1;start(e,t,n){this.musicStarted||(this.ctx=e,this.musicStarted=!0,this.musicGain=e.createGain(),this.musicGain.gain.value=1.05,this.musicGain.connect(t),this.menuGain=e.createGain(),this.menuGain.gain.value=1,this.menuGain.connect(this.musicGain),this.matchGain=e.createGain(),this.matchGain.gain.value=1e-4,this.matchGain.connect(this.musicGain))}resetMode(){this.currentMode=null}getMode(){return this.currentMode}async ensureMenuBed(){const e=this.ctx,t=this.menuGain;if(!(!e||!t||this.menuSource||this.menuBuffer)){if(this.menuLoading){await this.menuLoading;return}this.menuLoading=(async()=>{try{const n=await fetch(`${zt()}audio/menu.opus`);if(!n.ok){console.warn("[audio] Failed to load menu music:",n.status,n.statusText,`${zt()}audio/menu.opus`);return}const s=await n.arrayBuffer(),r=await e.decodeAudioData(s.slice(0));if(!this.ctx||!this.menuGain||this.menuSource||this.menuBuffer||this.currentMode!=="menu")return;this.menuBuffer=r;const a=e.createBufferSource();a.buffer=r,a.loop=!0,a.connect(this.menuGain),this.menuSource=a,a.start(e.currentTime)}catch{console.warn("[audio] Failed to decode or start menu music:",`${zt()}audio/menu.opus`)}finally{this.menuLoading=null}})(),await this.menuLoading}}async ensureMatchBed(){const e=this.ctx,t=this.matchGain;if(!(!e||!t||this.matchSource||this.matchBuffer)){if(this.matchLoading){await this.matchLoading;return}this.matchLoading=(async()=>{try{const n=await fetch(`${zt()}audio/gameplay.opus`);if(!n.ok){console.warn("[audio] Failed to load gameplay music:",n.status,n.statusText,`${zt()}audio/gameplay.opus`);return}const s=await n.arrayBuffer(),r=await e.decodeAudioData(s.slice(0));if(!this.ctx||!this.matchGain||this.matchSource||this.matchBuffer||this.currentMode!=="match")return;this.matchBuffer=r;const a=e.createBufferSource();a.buffer=r,a.loop=!0,a.connect(this.matchGain),this.matchSource=a,a.start(e.currentTime)}catch{console.warn("[audio] Failed to decode or start gameplay music:",`${zt()}audio/gameplay.opus`)}finally{this.matchLoading=null}})(),await this.matchLoading}}setMode(e){if(this.currentMode===e)return;if(this.currentMode=e,!this.ctx||!this.menuGain||!this.matchGain){e==="menu"&&this.ensureMenuBed(),e==="match"&&this.ensureMatchBed();return}e==="menu"&&this.ensureMenuBed(),e==="match"&&this.ensureMatchBed();const t=this.ctx.currentTime,n=1.2,s=e==="menu"?this.menuGain:this.matchGain,r=e==="menu"?this.matchGain:this.menuGain;s.gain.cancelScheduledValues(t),s.gain.setValueAtTime(Math.max(1e-4,s.gain.value),t),s.gain.linearRampToValueAtTime(1,t+n),r.gain.cancelScheduledValues(t),r.gain.setValueAtTime(Math.max(1e-4,r.gain.value),t),r.gain.linearRampToValueAtTime(1e-4,t+n)}}class a0{ctx=null;master=null;noise=null;music=new r0;goalBuffer=null;goalLoading=null;whistleBuffer=null;whistleLoading=null;pendingGoal=!1;pendingWhistle=!1;activeTransientSources=new Set;pausedByGame=!1;unlock(){if(this.ctx){this.ctx.state==="suspended"&&!this.pausedByGame&&this.ctx.resume(),this.music.resetMode(),this.music.ensureMenuBed();return}const e=window.AudioContext??window.webkitAudioContext;if(!e)return;const t=new e,n=t.createGain();n.gain.value=.5,n.connect(t.destination),this.ctx=t,this.master=n,this.noise=this.makeNoise(t),this.music.start(t,n,this.noise),this.music.resetMode(),this.ensureGoalSound(),this.ensureWhistleSound(),this.music.ensureMenuBed()}pause(){this.pausedByGame=!0,this.ctx&&this.ctx.state==="running"&&this.ctx.suspend()}resume(){this.pausedByGame=!1,this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}makeNoise(e){const t=e.sampleRate*.5,n=e.createBuffer(1,t,e.sampleRate),s=n.getChannelData(0);let r=22222;for(let a=0;a<t;a++)r=r*1103515245+12345&2147483647,s[a]=(r/1073741823-1)*.8;return n}now(){return this.ctx?this.ctx.currentTime:0}env(e,t,n,s,r){e.gain.setValueAtTime(1e-4,t),e.gain.exponentialRampToValueAtTime(Math.max(2e-4,n),t+s),e.gain.exponentialRampToValueAtTime(1e-4,t+s+r)}tone(e,t,n,s,r){const a=this.ctx,o=this.master;if(!a||!o)return;const l=a.createOscillator(),c=a.createGain();l.type=t,l.frequency.setValueAtTime(e,n),this.env(c,n,r,.005,s),l.connect(c).connect(o),this.trackTransientSource(l),l.start(n),l.stop(n+s+.05)}burst(e,t,n,s){const r=this.ctx,a=this.master;if(!r||!a||!this.noise)return;const o=r.createBufferSource();o.buffer=this.noise;const l=r.createBiquadFilter();l.type="lowpass",l.frequency.value=s;const c=r.createGain();this.env(c,e,n,.004,t),o.connect(l).connect(c).connect(a),this.trackTransientSource(o),o.start(e),o.stop(e+t+.05)}bandBurst(e,t,n,s){const r=this.ctx,a=this.master;if(!r||!a||!this.noise)return;const o=r.createBufferSource();o.buffer=this.noise;const l=r.createBiquadFilter();l.type="bandpass",l.frequency.value=s,l.Q.value=1.2;const c=r.createGain();this.env(c,e,n,.01,t),o.connect(l).connect(c).connect(a),this.trackTransientSource(o),o.start(e),o.stop(e+t+.05)}trackTransientSource(e){this.activeTransientSources.add(e),e.onended=()=>{this.activeTransientSources.delete(e)}}stopTransientSfx(){this.pendingGoal=!1,this.pendingWhistle=!1;for(const e of this.activeTransientSources)try{e.stop()}catch{}this.activeTransientSources.clear()}async loadSound(e){const t=this.ctx;if(!t)return null;const n=await fetch(`${zt()}audio/${e}`);if(!n.ok)return console.warn("[audio] Failed to load sound:",n.status,n.statusText,`${zt()}audio/${e}`),null;const s=await n.arrayBuffer();return await t.decodeAudioData(s.slice(0))}playBuffer(e,t){const n=this.ctx,s=this.master;if(!n||!s)return;const r=n.createBufferSource();r.buffer=e;const a=n.createGain();a.gain.value=t,r.connect(a).connect(s),this.trackTransientSource(r),r.start(this.now())}ensureGoalSound(){return this.goalBuffer?Promise.resolve():this.goalLoading?this.goalLoading:(this.goalLoading=(async()=>{try{const e=await this.loadSound("goal.opus");if(!e)return;this.goalBuffer=e,this.pendingGoal&&(this.pendingGoal=!1,this.playBuffer(e,.95))}catch{console.warn("[audio] Failed to decode goal sound:",`${zt()}audio/goal.opus`)}finally{this.goalLoading=null}})(),this.goalLoading)}ensureWhistleSound(){return this.whistleBuffer?Promise.resolve():this.whistleLoading?this.whistleLoading:(this.whistleLoading=(async()=>{try{const e=await this.loadSound("whistle.opus");if(!e)return;this.whistleBuffer=e,this.pendingWhistle&&(this.pendingWhistle=!1,this.playBuffer(e,.75))}catch{console.warn("[audio] Failed to decode whistle sound:",`${zt()}audio/whistle.opus`)}finally{this.whistleLoading=null}})(),this.whistleLoading)}thwack(e){const t=this.now(),n=Math.min(1,.3+e*.02);this.tone(140-e,"triangle",t,.09,.4*n),this.burst(t,.06,.5*n,1800)}post(){const e=this.now();this.tone(880,"square",e,.18,.3),this.tone(660,"square",e+.005,.16,.2)}whistle(){if(!(!this.ctx||!this.master)){if(this.whistleBuffer){this.playBuffer(this.whistleBuffer,.75);return}this.pendingWhistle=!0,this.ensureWhistleSound(),this.tone(2100,"sine",this.now(),.25,.25),this.tone(2100,"sine",this.now()+.28,.25,.25)}}goalRoar(){const e=this.now();this.burst(e,.9,.5,1200),this.tone(330,"sawtooth",e,.5,.2),this.tone(440,"sawtooth",e+.08,.5,.18)}playGoal(){if(!(!this.ctx||!this.master)){if(this.goalBuffer){this.playBuffer(this.goalBuffer,.95);return}this.pendingGoal=!0,this.ensureGoalSound(),this.goalRoar()}}crowdCheer(){const e=this.ctx,t=this.master;if(!e||!t||!this.noise)return;const n=this.now(),s=e.createBufferSource();s.buffer=this.noise,s.loop=!0;const r=e.createBiquadFilter();r.type="highpass",r.frequency.value=320;const a=e.createBiquadFilter();a.type="bandpass",a.frequency.setValueAtTime(650,n),a.frequency.exponentialRampToValueAtTime(1700,n+.6),a.Q.value=.6;const o=e.createGain();o.gain.setValueAtTime(1e-4,n),o.gain.exponentialRampToValueAtTime(.5,n+.2),o.gain.setValueAtTime(.5,n+.95),o.gain.exponentialRampToValueAtTime(.2,n+1.7),o.gain.exponentialRampToValueAtTime(1e-4,n+2.5),s.connect(r).connect(a).connect(o).connect(t),s.start(n),s.stop(n+2.6);let l=9241;for(let c=0;c<16;c++){l=l*1103515245+12345&2147483647;const h=l/2147483647;this.bandBurst(n+.04+h*1.2,.05+h*.05,.08+h*.07,700+h*2400)}this.tone(2200,"sine",n+.18,.18,.14),this.tone(2600,"sine",n+.52,.14,.11),this.tone(1950,"sine",n+.88,.16,.11)}uiTap(){this.tone(520,"sine",this.now(),.05,.18)}setMusicMode(e){this.music.setMode(e)}getMusicMode(){return this.music.getMode()}}const on=1080,ss=1350;class o0{canvas;constructor(){this.canvas=document.createElement("canvas"),this.canvas.width=on,this.canvas.height=ss}draw(e,t,n,s){const r=this.canvas.getContext("2d");if(!r)return;const a=r.createLinearGradient(0,0,0,ss);a.addColorStop(0,Ke(Se.feltDeep)),a.addColorStop(1,Ke(Se.skyBottom)),r.fillStyle=a,r.fillRect(0,0,on,ss),r.fillStyle=Ke(Se.uiGold),r.font="900 130px ui-sans-serif, system-ui, sans-serif",r.textAlign="center",r.fillText("GOAL",on/2,190),r.fillStyle=Ke(Se.uiText),r.font="700 44px ui-sans-serif, system-ui, sans-serif";const o=e.lastSecond?"LAST-SECOND WINNER":e.distance>55?"FROM DISTANCE":"WHAT A STRIKE";r.fillText(o,on/2,250);const l=120,c=330,h=on-240,u=620;r.fillStyle=Ke(Se.feltMid),this.roundRect(r,l,c,h,u,28),r.fill(),r.strokeStyle=Ke(Se.lineChalk,.6),r.lineWidth=4,r.strokeRect(l+24,c+24,h-48,u-48);const f=y=>l+24+(y+Xe.halfWidth)/(Xe.halfWidth*2)*(h-48),m=y=>c+24+(y+Xe.halfLength)/(Xe.halfLength*2)*(u-48),g=e.trajectory;if(g.length>1){r.lineCap="round",r.lineJoin="round",r.shadowColor=Ke(Se.trailHot,.9),r.shadowBlur=22,r.strokeStyle=Ke(Se.trailHot),r.lineWidth=12,r.beginPath();for(let S=0;S<g.length;S++){const b=g[S],R=f(b[0]),w=m(b[2]);S===0?r.moveTo(R,w):r.lineTo(R,w)}r.stroke(),r.shadowBlur=0;const y=g[g.length-1];r.fillStyle=Ke(Se.ballWhite),r.beginPath(),r.arc(f(y[0]),m(y[2]),14,0,Math.PI*2),r.fill()}const _=c+u+70,p=hi(n.id),d=hi(s.id);r.drawImage(p,on/2-360,_-60,120,120),r.drawImage(d,on/2+240,_-60,120,120),r.fillStyle=Ke(Se.uiText),r.font="900 120px ui-sans-serif, system-ui, sans-serif",r.fillText(`${t.scoreBlue} - ${t.scoreRed}`,on/2,_+40),r.font="600 38px ui-sans-serif, system-ui, sans-serif",r.fillText(`${tn(n.id)}   vs   ${tn(s.id)}`,on/2,_+100),r.fillStyle=Ke(Se.uiMuted),r.font="600 34px ui-sans-serif, system-ui, sans-serif",r.fillText(`SEED ${t.seed.toString(16).toUpperCase()}  ·  ${Math.round(e.speed)} km/h`,on/2,ss-110),r.fillStyle=Ke(Se.uiGold),r.font="800 46px ui-sans-serif, system-ui, sans-serif",r.fillText("#WorldCup  #ChapasPrime",on/2,ss-55)}roundRect(e,t,n,s,r,a){e.beginPath(),e.moveTo(t+a,n),e.arcTo(t+s,n,t+s,n+r,a),e.arcTo(t+s,n+r,t,n+r,a),e.arcTo(t,n+r,t,n,a),e.arcTo(t,n,t+s,n,a),e.closePath()}async share(e,t,n,s){this.draw(e,t,n,s);const r=await new Promise(o=>this.canvas.toBlob(o,"image/png"));let a="";if(r){const o=new File([r],"golazo.png",{type:"image/png"});a=URL.createObjectURL(r),setTimeout(()=>URL.revokeObjectURL(a),1e4);const l=navigator;if(l.canShare&&l.canShare({files:[o]}))try{return await navigator.share({files:[o],title:"GOLAZO",text:"My golazo on CHAPAS PRIME #WorldCup"}),a}catch{}const c=document.createElement("a");c.href=a,c.download="golazo.png",c.click()}return a}}function l0(i,e){const t=Xe.halfWidth,n=Xe.halfLength,s=e==="blue",r=[];for(const l of i){const c=l[0],h=l[2],u=s?(t-c)/(2*t):(c+t)/(2*t),f=s?(n-h)/(2*n):(n+h)/(2*n);r.push([u,f,l[1]])}const a=[0];let o=0;for(let l=1;l<r.length;l++){const c=r[l-1],h=r[l];o+=Math.hypot(h[0]-c[0],h[1]-c[1]),a.push(o)}return{mapped:r,cum:a,total:o||1}}const Bl=3.6,rs=.5,zl=2.5,aa=2.5;function oa(i){const e=i<0?0:i>1?1:i;return e*e*(3-2*e)}class c0{overlay;canvas;ctx;shareBtn;againBtn=null;closeBtn=null;hint=null;auto=!1;raf=0;t0=0;open=!1;onResize;ev=null;st=null;blue=null;red=null;flagB=null;flagR=null;mapped=[];cum=[];total=0;onShare=null;onClose=null;constructor(e){const t=document.createElement("div");t.className="cp-screen cp-screen--center cp-replay",t.style.display="none";const n=document.createElement("div");n.className="cp-replay__card",this.canvas=document.createElement("canvas"),this.canvas.className="cp-replay__canvas";const s=this.canvas.getContext("2d");if(!s)throw new Error("2d context unavailable");this.ctx=s;const r=document.createElement("div");r.className="cp-replay__btns",this.shareBtn=this.btn("cp-btn cp-cta",K("end.share"),()=>this.onShare?.()),this.againBtn=this.btn("cp-btn cp-btn--ghost",K("replay.again"),()=>this.restart()),this.closeBtn=this.btn("cp-btn cp-btn--ghost cp-btn--sm",K("replay.close"),()=>this.hide()),r.append(this.shareBtn,this.againBtn,this.closeBtn);const a=document.createElement("div");a.className="cp-replay__hint",a.style.display="none",this.hint=a,n.append(this.canvas,r,a),t.appendChild(n),e.appendChild(t),this.overlay=t,t.addEventListener("pointerdown",o=>{!this.open||!this.auto||o.target.closest("button")||this.hide()}),this.onResize=()=>{this.open&&this.size()},window.addEventListener("resize",this.onResize)}btn(e,t,n){const s=document.createElement("button");return s.className=e,s.textContent=t,s.addEventListener("click",n),s}show(e,t,n,s,r,a,o=!1){this.ev=e,this.st=t,this.blue=n,this.red=s,this.onShare=r,this.onClose=a??null,this.auto=o,this.hint&&(this.hint.textContent=K("replay.skip"),this.hint.style.display=o?"block":"none"),this.againBtn&&(this.againBtn.style.display=o?"none":""),this.closeBtn&&(this.closeBtn.style.display=o?"none":""),this.flagB=hi(n.id),this.flagR=hi(s.id),this.prepare(e),this.overlay.style.display="flex",this.open=!0,this.size(),this.restart()}skip(){this.open&&this.hide()}hide(){this.open=!1,this.overlay.style.display="none",this.raf&&cancelAnimationFrame(this.raf),this.raf=0;const e=this.onClose;this.onClose=null,e?.()}dispose(){window.removeEventListener("resize",this.onResize),this.hide()}restart(){this.raf&&cancelAnimationFrame(this.raf),this.t0=performance.now();const e=t=>{if(!this.open)return;const n=(t-this.t0)/1e3;if(this.auto&&n>=Bl){this.hide();return}this.draw(n),this.raf=requestAnimationFrame(e)};this.raf=requestAnimationFrame(e)}prepare(e){const t=l0(e.trajectory,e.team);this.mapped=t.mapped,this.cum=t.cum,this.total=t.total}size(){const e=window.innerWidth,t=window.innerHeight,n=Math.max(220,Math.min(e*.9,440,(t-150)*.66)),s=n*1.5,r=Math.min(window.devicePixelRatio||1,2);this.canvas.style.width=`${n}px`,this.canvas.style.height=`${s}px`,this.canvas.width=Math.round(n*r),this.canvas.height=Math.round(s*r),this.ctx.setTransform(r,0,0,r,0,0)}layout(e,t){const n=e*.06,s=n,r=t*.2,a=e-n*2,o=t*.6;return{px:s,pyTop:r,pw:a,ph:o,by:r+o+t*.06,mapPX:l=>s+10+l*(a-20),mapPY:l=>r+10+l*(o-20)}}at(e){const t=e*this.total,n=this.cum,s=this.mapped;if(s.length===0)return[.5,.5,0];if(s.length===1)return s[0];let r=1;for(;r<n.length&&n[r]<t;)r++;const a=r-1,o=s[a],l=s[Math.min(r,s.length-1)],c=n[Math.min(r,n.length-1)]-n[a]||1,h=(t-n[a])/c;return[o[0]+(l[0]-o[0])*h,o[1]+(l[1]-o[1])*h,o[2]+(l[2]-o[2])*h]}draw(e){const t=this.ev,n=this.st,s=this.blue,r=this.red;if(!t||!n||!s||!r)return;const a=this.ctx,o=parseFloat(this.canvas.style.width),l=parseFloat(this.canvas.style.height),c=e%Bl,h=this.layout(o,l),{px:u,pyTop:f,pw:m,ph:g,by:_,mapPX:p,mapPY:d}=h;this.drawBackdropAndPitch(a,o,l,u,f,m,g);const y=this.mapped;if(y.length>1){a.strokeStyle=Ke(Se.lineChalk,.18),a.lineWidth=3,a.lineCap="round",a.lineJoin="round",a.beginPath();for(let b=0;b<y.length;b++){const R=y[b],w=p(R[0]),A=d(R[1]);b===0?a.moveTo(w,A):a.lineTo(w,A)}a.stroke()}const S=oa((c-rs)/(zl-rs));if(y.length>1&&c>rs){const b=S,R=48;a.lineCap="round",a.lineJoin="round",a.shadowColor=Ke(Se.trailHot,.9),a.shadowBlur=16,a.strokeStyle=Ke(Se.trailHot),a.lineWidth=6,a.beginPath();for(let T=0;T<=R;T++){const G=T/R*b,W=this.at(G),ee=p(W[0]),L=d(W[1]);T===0?a.moveTo(ee,L):a.lineTo(ee,L)}a.stroke(),a.shadowBlur=0;const w=this.at(b),A=p(w[0]),k=d(w[1]),v=6+Math.min(6,w[2]*.5);a.fillStyle=Ke(Se.ballWhite),a.shadowColor=Ke(Se.white,.8),a.shadowBlur=14,a.beginPath(),a.arc(A,k,v,0,Math.PI*2),a.fill(),a.shadowBlur=0}if(c>=aa&&c<aa+.5){const b=1-(c-aa)/.5;a.fillStyle=Ke(Se.white,.35*b),this.roundRect(a,u,f,m,g,16),a.fill(),a.fillStyle=Ke(Se.uiGold),a.textAlign="center",a.font=`900 ${Math.round(o*.13)}px ui-sans-serif, system-ui, sans-serif`,a.globalAlpha=b,a.fillText(K("goal.you"),u+m/2,f+g/2+o*.04),a.globalAlpha=1}this.drawHeaderAndStats(a,t,n,o,l,_,c)}drawHeaderAndStats(e,t,n,s,r,a,o){const l=oa(o/.4);e.textAlign="center",e.fillStyle=Ke(Se.uiGold),e.font=`900 ${Math.round(s*.135*(.7+.3*l))}px ui-sans-serif, system-ui, sans-serif`,e.globalAlpha=l,e.fillText("GOAL",s/2,r*.13),e.globalAlpha=1,e.fillStyle=Ke(Se.uiText,.9),e.font=`700 ${Math.round(s*.04)}px ui-sans-serif, system-ui, sans-serif`;const c=t.lastSecond?K("replay.tag_last"):t.distance>55?K("replay.tag_distance"):K("replay.tag_strike");e.fillText(c,s/2,r*.165),this.flagB&&e.drawImage(this.flagB,s/2-s*.34,a-s*.05,s*.1,s*.067),this.flagR&&e.drawImage(this.flagR,s/2+s*.24,a-s*.05,s*.1,s*.067),e.fillStyle=Ke(Se.uiText),e.font=`900 ${Math.round(s*.1)}px ui-sans-serif, system-ui, sans-serif`,e.fillText(`${n.scoreBlue} - ${n.scoreRed}`,s/2,a+s*.03);const h=oa((o-rs)/(zl-rs)),u=Math.round(t.speed*h),f=Math.round(t.distance*h);e.fillStyle=Ke(Se.uiGold),e.font=`800 ${Math.round(s*.05)}px ui-sans-serif, system-ui, sans-serif`,e.fillText(`${K("replay.speed",{n:u})}   ·   ${K("replay.distance",{n:f})}`,s/2,a+s*.12),e.fillStyle=Ke(Se.uiMuted),e.font=`700 ${Math.round(s*.035)}px ui-sans-serif, system-ui, sans-serif`,e.fillText("#WorldCup  #ChapasPrime",s/2,r-r*.03)}drawBackdropAndPitch(e,t,n,s,r,a,o){const l=e.createLinearGradient(0,0,0,n);l.addColorStop(0,Ke(Se.skyTop)),l.addColorStop(1,Ke(Se.skyBottom)),e.fillStyle=l,e.fillRect(0,0,t,n);const c=e.createLinearGradient(0,r,0,r+o);c.addColorStop(0,Ke(Se.feltMid)),c.addColorStop(1,Ke(Se.feltDeep)),e.fillStyle=c,this.roundRect(e,s,r,a,o,16),e.fill(),e.strokeStyle=Ke(Se.lineChalk,.5),e.lineWidth=2,e.strokeRect(s+10,r+10,a-20,o-20),e.beginPath(),e.moveTo(s+10,r+o/2),e.lineTo(s+a-10,r+o/2),e.stroke(),e.beginPath(),e.arc(s+a/2,r+o/2,a*.12,0,Math.PI*2),e.stroke();const h=a*.3;e.strokeStyle=Ke(Se.uiGold,.95),e.lineWidth=4,e.beginPath(),e.moveTo(s+a/2-h/2,r+10),e.lineTo(s+a/2+h/2,r+10),e.stroke()}roundRect(e,t,n,s,r,a){e.beginPath(),e.moveTo(t+a,n),e.arcTo(t+s,n,t+s,n+r,a),e.arcTo(t+s,n+r,t,n+r,a),e.arcTo(t,n+r,t,n,a),e.arcTo(t,n,t+s,n,a),e.closePath()}}class h0{constructor(e,t){this.root=e,this.touch=t}showRound(e,t,n,s,r,a,o){const l=this.fullOverlay();l.appendChild(this.overlayHeading("🏆 "+K("cup.eyebrow"),e)),s&&(l.appendChild(je("div","cp-eyebrow",K("cup.results"))),l.appendChild(this.resultsGrid(s,r))),l.appendChild(je("div","cp-eyebrow",K("cup.your_match"))),l.appendChild(this.matchup(t,n)),l.appendChild(Un("cp-btn cp-cta",a,()=>{l.remove(),o()}))}showTrophy(e,t){const n=this.fullOverlay(!0);n.appendChild(this.overlayHeading("🏆 "+K("cup.eyebrow"),K("cup.champion"),!0)),n.appendChild(this.teamBadge(e)),n.appendChild(Un("cp-btn",K("cup.back"),()=>{n.remove(),t()}))}showEliminated(e,t,n,s){const r=this.fullOverlay();r.appendChild(this.overlayHeading(K("cup.eyebrow"),K("cup.eliminated"),!1,"var(--cp-red)")),r.appendChild(je("div","cp-sub",K("cup.eliminated_sub",{round:e}))),r.appendChild(je("div","cp-eyebrow",K("cup.results"))),r.appendChild(this.resultsGrid(t,n)),r.appendChild(Un("cp-btn cp-btn--ghost",K("cup.back"),()=>{r.remove(),s()}))}showLeagueRound(e,t,n,s,r,a,o,l,c){const h=this.fullOverlay();h.appendChild(this.overlayHeading("🏆 "+K("league.eyebrow"),e)),n&&(h.appendChild(je("div","cp-eyebrow",K("league.results"))),h.appendChild(this.resultsGrid(n,a))),h.appendChild(je("div","cp-eyebrow",K("league.standings"))),h.appendChild(this.standingsTable(t,a)),h.appendChild(je("div","cp-eyebrow",K("cup.your_match"))),h.appendChild(this.matchup(s,r)),h.appendChild(Un("cp-btn cp-cta",o,()=>{h.remove(),l()})),c&&h.appendChild(Un("cp-btn cp-secondary",K("league.back"),()=>{h.remove(),c()}))}showLeagueEnd(e,t,n){const s=this.fullOverlay(!0),r=e[0]?.id===t;s.appendChild(this.overlayHeading(r?"🏆 "+K("cup.eyebrow"):K("league.eyebrow"),K(r?"league.champion":"league.season"),!0)),s.appendChild(je("div","cp-eyebrow",K("league.final_table"))),s.appendChild(this.standingsTable(e,t)),s.appendChild(Un("cp-btn",K("cup.back"),()=>{s.remove(),n()}))}showAllocation(e,t,n,s,r,a){const o=this.fullOverlay(),l=e.map(R=>({pow:R.pow,acc:R.acc,tk:R.tk})),c=e.map(R=>({pow:R.pow,acc:R.acc,tk:R.tk}));let h=t;o.appendChild(this.overlayHeading(K("rpg.earned",{n}),K("rpg.title")));const u=je("div","cp-sub cp-overlay__counter");o.appendChild(u);const f=Kt("div");f.className="cp-overlay__list",o.appendChild(f);const m={sniper:"Sniper",tank:"Tank",playmaker:"Playmaker"},g=[],_=[],p=[],d=[],y=Qt(s),S=(R,w,A)=>{const k=Math.min(5,1+Math.floor((R+w+A)/2));return"★".repeat(k)+"☆".repeat(5-k)},b=()=>{u.textContent=K("rpg.available",{n:h});for(let R=0;R<l.length;R++){const w=l[R],A=ds[R+1]??"sniper",k=cr(y.base,A);g[R][0].textContent=`${k.power.toFixed(2)} (+${w.pow})`,g[R][1].textContent=`${k.accuracy.toFixed(2)} (+${w.acc})`,g[R][2].textContent=`${k.tackle.toFixed(2)} (+${w.tk})`,_[R].textContent=S(w.pow,w.acc,w.tk),p[R][0].disabled=w.pow<=c[R].pow,p[R][1].disabled=w.acc<=c[R].acc,p[R][2].disabled=w.tk<=c[R].tk,d[R][0].disabled=h<=0,d[R][1].disabled=h<=0,d[R][2].disabled=h<=0}};l.forEach((R,w)=>{const A=ds[w+1]??"sniper",k=w+1;let v="";k===1||k===2?v=K("role.def"):k===3?v=K("role.mid"):k===4&&(v=K("role.att"));const T=je("div","cp-card");T.classList.add("cp-overlay__card");const G=je("div","cp-overlay__row"),W=je("span","cp-overlay__cap-title",`${K("rpg.cap",{n:k,class:m[A]})} — ${v}`),ee=je("span","cp-overlay__stars","");_[w]=ee,G.append(W,ee),T.appendChild(G);const L=Kt("div");L.className="cp-overlay__stats";const I=[],H=[],Z=[];["pow","acc","tk"].forEach((Y,j)=>{const Q=K(Y==="pow"?"stat.power.short":Y==="acc"?"stat.accuracy.short":"stat.steal.short"),ie=Kt("div");ie.className="cp-overlay__stat";const re=je("span","cp-overlay__stat-label",Q),X=je("span","cp-overlay__stat-value cp-mono","0");I[j]=X;const J=Kt("button");J.textContent="-",J.className="cp-overlay__step cp-overlay__step--minus";const le=Kt("button");le.textContent="+",le.className="cp-overlay__step cp-overlay__step--plus",Dc(J,()=>{l[w][Y]<=c[w][Y]||(l[w][Y]-=1,h+=1,b())}),H[j]=J,Z[j]=le,ie.append(re,X,J,le),L.appendChild(ie)}),g[w]=I,p[w]=H,d[w]=Z,T.appendChild(L),f.appendChild(T)}),b(),o.appendChild(Un("cp-btn cp-cta",K("rpg.continue"),()=>{o.remove(),r(l,h)})),a&&o.appendChild(Un("cp-btn cp-secondary",K("cup.back"),()=>{o.remove(),a()}))}fullOverlay(e=!1){const t=je("div",`cp-screen cp-stagger${e?" cp-screen--center":""}`);this.root.appendChild(t);const n=je("div","cp-overlay-shell cp-card");return e&&n.classList.add("cp-overlay-shell--center"),t.appendChild(n),n}overlayHeading(e,t,n=!1,s){const r=je("div","cp-overlay-heading");n&&r.classList.add("cp-overlay-heading--trophy"),r.appendChild(je("div","cp-eyebrow",e));const a=je("div","cp-head",t);return s&&_t(a,{color:s}),r.appendChild(a),r}matchup(e,t){const n=Kt("div");return _t(n,{display:"flex",alignItems:"center",justifyContent:"center",gap:"14px"}),n.append(this.teamBadge(e),je("span","cp-eyebrow",K("vs")),this.teamBadge(t)),n}teamBadge(e){const t=Kt("div");_t(t,{display:"flex",alignItems:"center",gap:"9px"}),t.appendChild(la(e,42,29));const n=je("span","",tn(e));return _t(n,{font:"800 22px var(--cp-font)"}),t.appendChild(n),t}resultsGrid(e,t){const n=Kt("div");_t(n,{display:"grid",gridTemplateColumns:this.touch?"1fr":"1fr 1fr",gap:"6px 16px",maxWidth:"640px",width:"100%"});for(const s of e){const r=s.a===t||s.b===t,a=je("div",`cp-row${r?" cp-row--mine":""}`);_t(a,{font:"700 13px var(--cp-font)"});const o=s.winner!==s.a&&s.winner!==s.b;a.appendChild(this.teamTag(s.a,o||s.winner===s.a));const l=je("span","cp-mono",`${s.ga}-${s.gb}`);_t(l,{color:"var(--cp-gold)",minWidth:"34px",textAlign:"center",fontWeight:"800"}),a.appendChild(l),a.appendChild(this.teamTag(s.b,o||s.winner===s.b)),n.appendChild(a)}return n}teamTag(e,t){const n=Kt("span");_t(n,{display:"flex",alignItems:"center",gap:"5px",flex:"1",opacity:t?"1":"0.5"}),n.appendChild(la(e,18,13));const s=je("span","",tn(e));return _t(s,{fontWeight:t?"900":"600",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}),n.appendChild(s),n}standingsTable(e,t){const n="26px 1fr 30px 34px 40px",s=je("div","cp-card");_t(s,{display:"flex",flexDirection:"column",gap:"3px",width:"min(480px, 92vw)",padding:"10px"});const r=Kt("div");return _t(r,{display:"grid",gridTemplateColumns:n,gap:"6px",padding:"2px 8px",font:"800 11px var(--cp-font)",letterSpacing:"1px",color:"var(--cp-muted)"}),["#",K("table.team"),K("table.played"),K("table.gd"),K("table.pts")].forEach((a,o)=>{const l=je("span","",a);o>=2&&_t(l,{textAlign:"center"}),r.appendChild(l)}),s.appendChild(r),e.forEach((a,o)=>{const l=a.id===t,c=je("div",`cp-row${l?" cp-row--mine":""}`);_t(c,{display:"grid",gridTemplateColumns:n,gap:"6px",alignItems:"center"});const h=je("span","cp-mono",String(o+1));_t(h,{color:o<4?"var(--cp-gold)":"var(--cp-muted)",fontWeight:"800"}),c.appendChild(h);const u=Kt("span");_t(u,{display:"flex",alignItems:"center",gap:"6px",overflow:"hidden"});const f=la(a.id,20,14);_t(f,{flex:"0 0 auto"});const m=je("span","",tn(a.id));_t(m,{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",font:`${l?900:700} 13px var(--cp-font)`}),u.append(f,m),c.appendChild(u),[String(a.played),(a.gd>=0?"+":"")+a.gd,String(a.pts)].forEach((g,_)=>{const p=je("span","cp-mono",g);_t(p,{textAlign:"center",fontWeight:_===2?"900":"700",color:_===2?"var(--cp-gold)":"var(--cp-chalk)"}),c.appendChild(p)}),s.appendChild(c)}),s}}function Kt(i){return document.createElement(i)}function je(i,e,t){const n=document.createElement(i);return e&&(n.className=e),t!==void 0&&(n.textContent=t),n}function _t(i,e){Object.assign(i.style,e)}function Dc(i,e){i.addEventListener("pointerdown",t=>{t.preventDefault(),e()})}function Un(i,e,t){const n=Kt("button");return n.className=i,n.textContent=e,Dc(n,t),n}function la(i,e,t){const n=hi(i);return n.className="cp-flag",_t(n,{width:`${e}px`,height:`${t}px`}),n}const kl=[["lob","VASELINA","K","cp-action--teal"]],u0={pass:"cp-action--blue",tackle:"cp-action--wood",clear:"cp-action--gold"};class d0{constructor(e,t,n){this.touch=e,this.cb=t,this.element=qs("div","cp-control-band"),Ys(this.element,{position:"absolute",left:"0",right:"0",bottom:"0",height:`${n}px`,paddingBottom:"env(safe-area-inset-bottom, 0px)",pointerEvents:"none",display:"none"}),this.touch?this.buildTouchControls():this.buildDesktopControls()}element;primaryBtn=null;primaryLabel=null;chargeEl=null;primaryMode="pass";windowPointerMove=null;windowPointerUp=null;windowPointerCancel=null;setVisible(e){this.element.style.display=e?"block":"none"}setPrimaryMode(e){e!==this.primaryMode&&(this.primaryMode=e,!(!this.primaryBtn||!this.primaryLabel)&&(this.primaryBtn.className=`cp-action ${u0[e]}${this.touch?" cp-action--big":""}`,this.primaryBtn.style.position="relative",this.primaryBtn.style.overflow="hidden",this.primaryLabel.innerHTML=this.touch?K(`act.${e}`):`${K(`act.${e}`)}<span class="cp-action__key">J</span>`))}setCharge(e){if(!this.chargeEl)return;const t=Math.max(0,Math.min(1,e));this.chargeEl.style.height=`${t*100}%`,this.chargeEl.style.opacity=t>.001?"1":"0",this.chargeEl.classList.toggle("cp-charge--shot",t>=.5)}buildTouchControls(){const e=qs("div","cp-joy-base"),t=qs("div","cp-joy-knob");e.appendChild(t),this.element.appendChild(e);const n=56;let s=-1,r=0,a=0;const o=(u,f)=>{let m=u-r,g=f-a;const _=Math.hypot(m,g);_>n&&(m=m/_*n,g=g/_*n),t.style.transform=`translate(${m}px, ${g}px)`,this.cb.onJoystick(m/n,g/n,!0)},l=()=>{s=-1,t.style.transform="translate(0px, 0px)",this.cb.onJoystick(0,0,!1)};this.windowPointerMove=u=>{u.pointerId===s&&o(u.clientX,u.clientY)},this.windowPointerUp=u=>{u.pointerId===s&&l()},this.windowPointerCancel=u=>{u.pointerId===s&&l()},e.addEventListener("pointerdown",u=>{u.preventDefault(),s=u.pointerId;const f=e.getBoundingClientRect();r=f.left+f.width/2,a=f.top+f.height/2,o(u.clientX,u.clientY)}),window.addEventListener("pointermove",this.windowPointerMove),window.addEventListener("pointerup",this.windowPointerUp),window.addEventListener("pointercancel",this.windowPointerCancel);const c=Ni("div");Ys(c,{position:"absolute",right:"16px",bottom:"18px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",pointerEvents:"auto"}),c.appendChild(this.buildPrimary(!0));for(const[u,,,f]of kl)c.appendChild(Gl(`cp-action ${f} cp-action--big`,K(`act.${u}`),()=>this.cb.onAction(u)));this.element.appendChild(c);const h=Gl("cp-switch","↺",()=>this.cb.onSwitch());this.element.appendChild(h)}buildDesktopControls(){const e=Ni("div");Ys(e,{position:"absolute",left:"0",right:"0",bottom:"16px",display:"flex",justifyContent:"center",gap:"10px",pointerEvents:"auto"}),e.appendChild(this.buildPrimary(!1));for(const[t,,n,s]of kl){const r=Ni("button");r.className=`cp-action ${s}`,r.innerHTML=`${K(`act.${t}`)}<span class="cp-action__key">${n}</span>`,Uc(r,()=>this.cb.onAction(t)),e.appendChild(r)}this.element.appendChild(e)}buildPrimary(e){const t=Ni("button");t.className=`cp-action cp-action--blue${e?" cp-action--big":""}`,Ys(t,{position:"relative",overflow:"hidden"});const n=qs("div","cp-charge"),s=Ni("span");return s.className="cp-action__label",s.innerHTML=e?K("act.pass"):`${K("act.pass")}<span class="cp-action__key">J</span>`,t.append(n,s),t.addEventListener("pointerdown",r=>{r.preventDefault(),this.cb.onPrimaryDown()}),t.addEventListener("pointerup",r=>{r.preventDefault(),this.cb.onPrimaryUp()}),t.addEventListener("pointerleave",()=>this.cb.onPrimaryUp()),t.addEventListener("pointercancel",()=>this.cb.onPrimaryUp()),t.addEventListener("keydown",r=>{r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),this.cb.onPrimaryDown())}),t.addEventListener("keyup",r=>{r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),this.cb.onPrimaryUp())}),this.primaryBtn=t,this.primaryLabel=s,this.chargeEl=n,t}dispose(){this.windowPointerMove&&window.removeEventListener("pointermove",this.windowPointerMove),this.windowPointerUp&&window.removeEventListener("pointerup",this.windowPointerUp),this.windowPointerCancel&&window.removeEventListener("pointercancel",this.windowPointerCancel)}}function Ni(i){return document.createElement(i)}function qs(i,e,t){const n=document.createElement(i);return e&&(n.className=e),n}function Ys(i,e){Object.assign(i.style,e)}function Uc(i,e){i.addEventListener("pointerdown",t=>{t.preventDefault(),e()}),i.addEventListener("keydown",t=>{t.key!=="Enter"&&t.key!==" "||(t.preventDefault(),e())})}function Gl(i,e,t){const n=Ni("button");return n.className=i,n.textContent=e,Uc(n,t),n}class f0{constructor(e){this.cb=e,this.touch=typeof window.matchMedia=="function"&&window.matchMedia("(pointer: coarse)").matches||"ontouchstart"in window,this.onOutsidePointerDown=t=>{this.element.contains(t.target)||this.closeOverlays()},this.element=this.buildSetup(),document.addEventListener("pointerdown",this.onOutsidePointerDown)}element;touch;selTeam=oi[0]?.id??"esp";selTactic="balanced";selDifficulty="normal";selMode="exhibition";statsBox=null;teamChips=[];tacticChips=[];difficultyChips=[];modeChips=[];helpPanel=null;leaguePanel=null;leagueOverwriteArmed=!1;onOutsidePointerDown;buildSetup(){const e=Ee("div","cp-screen cp-screen--setup cp-setup cp-stagger");Nt(e,{gap:"18px"}),e.addEventListener("pointerdown",()=>this.cb.onMenuInteract(),{once:!0,capture:!0});const t=Ee("div","cp-setup__shell"),n=Ee("div","cp-setup__hero cp-card");n.appendChild(Ee("div","cp-setup__badge",K("tagline"))),n.appendChild(Ee("div","cp-title","CHAPAS PRIME")),n.appendChild(Ee("div","cp-setup__credit",K("credit")));const s=Ee("div","cp-setup__controls"),r=Ee("div","cp-setup__toolbar");r.appendChild(this.buildLangDropdown());const a=this.buildHelpButton();r.appendChild(a),s.appendChild(r),this.helpPanel=this.buildHelpPanel(),s.appendChild(this.helpPanel),s.appendChild(this.buildModeSection()),this.leaguePanel=this.buildLeaguePanel(),s.appendChild(this.leaguePanel),this.renderLeaguePanel();const o=Ee("div","cp-setup__section cp-setup__section--team");o.appendChild(Ee("div","cp-eyebrow",K("team.pick"))),o.appendChild(this.buildTeamCarousel()),s.appendChild(o),this.statsBox=Ee("div","cp-card cp-setup__section cp-setup__section--stats"),Nt(this.statsBox,{width:"100%",display:"flex",flexDirection:"column",gap:"9px",padding:"14px 16px"}),s.appendChild(this.statsBox),this.renderStats();const l=Ee("div","cp-setup__strategy-grid"),c=Ee("div","cp-setup__section cp-setup__section--tactic");c.appendChild(Ee("div","cp-eyebrow",K("tactic")));const h=ca();Object.keys(js).forEach(_=>{const p=ha(K(`tactic.${_}`),_===this.selTactic);ti(p,()=>{this.selTactic=_,this.leagueOverwriteArmed=!1,this.refreshChips()}),this.tacticChips.push({id:_,node:p}),h.appendChild(p)}),c.appendChild(h),l.appendChild(c);const u=Ee("div","cp-setup__section cp-setup__section--difficulty");u.appendChild(Ee("div","cp-eyebrow",K("difficulty")));const f=ca();["easy","normal","hard"].forEach(_=>{const p=ha(K(`diff.${_}`),_===this.selDifficulty);ti(p,()=>{this.selDifficulty=_,this.leagueOverwriteArmed=!1,this.refreshChips()}),this.difficultyChips.push({id:_,node:p}),f.appendChild(p)}),u.appendChild(f),l.appendChild(u),s.appendChild(l);const m=Ee("div","cp-setup__footer"),g=Jn("cp-btn cp-cta",K("play"),()=>this.cb.onStart(this.selTeam,this.selTactic,this.selMode,this.selDifficulty));return Nt(g,{width:"100%",maxWidth:"560px"}),m.appendChild(g),s.appendChild(m),t.append(n,s),e.appendChild(t),e}buildLangDropdown(){const e=[...Wl],t=Wc(),n=e.find(([u])=>u===t)??e[0],s=Ee("div","cp-lang-select"),r=Jn("cp-lang-select__trigger","",()=>{s.classList.toggle("cp-lang-select--open")}),a=Ee("span","cp-lang-select__code",n[0].toUpperCase()),o=Ee("span","cp-lang-select__label",n[1]),l=Ee("span","cp-lang-select__chevron","▼"),c=zn("span");Nt(c,{display:"flex",alignItems:"center"}),c.append(a,o),r.append(c,l),s.appendChild(r);const h=Ee("div","cp-lang-select__dropdown");return e.forEach(([u,f])=>{const m=zn("button");m.type="button",m.className=`cp-lang-select__option${u===t?" cp-lang-select__option--active":""}`;const g=Ee("span","cp-lang-select__code",u.toUpperCase()),_=Ee("span","cp-lang-select__label",f);m.append(g,_),ti(m,()=>{s.classList.remove("cp-lang-select--open"),qc(u)}),h.appendChild(m)}),s.appendChild(h),s.addEventListener("focusout",()=>{s.contains(document.activeElement)||s.classList.remove("cp-lang-select--open")}),s}refresh(){this.refreshChips()}toggleHelp(){this.helpPanel&&(this.helpPanel.style.display=this.helpPanel.style.display==="none"?"flex":"none")}buildHelpButton(){const e=Jn("cp-btn cp-btn--ghost cp-btn--sm cp-setup__help-btn",K("controls.button"),()=>this.toggleHelp());return e.setAttribute("aria-label",K("controls.button")),e}buildHelpPanel(){const e=Ee("div","cp-card cp-setup__help");return Nt(e,{display:"none"}),e.appendChild(Ee("div","cp-eyebrow",K("controls.title"))),e.appendChild(this.buildKeycapGroup()),e}buildKeycapGroup(){const e=Ee("div","cp-keycap-group");return K(this.touch?"hint.touch":"hint.desktop").split("·").map(s=>s.trim()).filter(Boolean).forEach(s=>{const r=s.split(" ");if(r.length<2)return;let a=r[0],o=r.slice(1).join(" ");["hold","mantén","manter","maintenir","halten","tieni"].includes(a.toLowerCase())&&r.length>=3&&(a=r[0]+" "+r[1],o=r.slice(2).join(" "));const c=Ee("div","cp-keycap-item"),h=zn("span");Nt(h,{display:"flex",gap:"4px",alignItems:"center"}),a.toUpperCase()==="WASD"?["W","A","S","D"].forEach(f=>{h.appendChild(Ee("span","cp-keycap",f))}):h.appendChild(Ee("span","cp-keycap",a));const u=Ee("span","cp-keycap-label",o);c.append(h,u),e.appendChild(c)}),e}buildModeSection(){const e=Ee("div","cp-setup__section cp-setup__section--mode");e.appendChild(Ee("div","cp-eyebrow",K("mode")));const t=ca(),n=["exhibition","tournament","league"];for(const s of n){const r=ha(K(`mode.${s}`),s===this.selMode);ti(r,()=>{this.selMode=s,this.leagueOverwriteArmed=!1,this.refreshChips()}),this.modeChips.push({id:s,node:r}),t.appendChild(r)}return e.appendChild(t),e}buildLeaguePanel(){return Ee("div","cp-card cp-league-panel cp-setup__section cp-setup__section--league")}closeOverlays(){this.element.querySelector(".cp-lang-select--open")?.classList.remove("cp-lang-select--open"),this.helpPanel&&(this.helpPanel.style.display="none"),this.leagueOverwriteArmed=!1,this.renderLeaguePanel()}refreshChips(){for(const e of this.teamChips)$s(e.node,e.id===this.selTeam);for(const e of this.tacticChips)$s(e.node,e.id===this.selTactic);for(const e of this.difficultyChips)$s(e.node,e.id===this.selDifficulty);for(const e of this.modeChips)$s(e.node,e.id===this.selMode);this.renderLeaguePanel()}renderLeaguePanel(){const e=this.leaguePanel;if(!e)return;const t=this.selMode==="tournament"?"tournament":this.selMode==="league"?"league":null;if(e.innerHTML="",!t){e.style.display="none",this.leagueOverwriteArmed=!1;return}if(e.style.display="flex",Nt(e,{flexDirection:"column",alignItems:"center",gap:"10px",padding:"16px 18px",textAlign:"center"}),e.appendChild(Ee("div","cp-eyebrow",K(t==="tournament"?"mode.tournament":"league.eyebrow"))),!this.getResumableLeague()){e.appendChild(Ee("div","cp-league-panel__text",K(t==="tournament"?"tournament.fresh_prompt":"league.fresh_prompt")));const l=Jn("cp-btn cp-cta",K(t==="tournament"?"tournament.new":"league.new"),()=>this.cb.onStart(this.selTeam,this.selTactic,this.selMode,this.selDifficulty,"new"));Nt(l,{width:"100%",maxWidth:"420px"}),e.appendChild(l);return}e.appendChild(Ee("div","cp-league-panel__text",K(t==="tournament"?"tournament.resume_prompt":"league.resume_prompt")));const s=Ee("div","cp-league-panel__actions");Nt(s,{display:"flex",flexWrap:"wrap",gap:"10px",justifyContent:"center",width:"100%"});const r=Jn("cp-btn cp-cta",K(t==="tournament"?"tournament.resume_saved":"league.resume_saved"),()=>this.cb.onStart(this.selTeam,this.selTactic,this.selMode,this.selDifficulty,"resume"));Nt(r,{flex:"1 1 220px",maxWidth:"320px"}),s.appendChild(r);const a=this.leagueOverwriteArmed?K(t==="tournament"?"tournament.new_confirm":"league.new_confirm"):K(t==="tournament"?"tournament.new":"league.new"),o=Jn("cp-btn cp-btn--ghost",a,()=>{if(this.leagueOverwriteArmed){this.cb.onStart(this.selTeam,this.selTactic,this.selMode,this.selDifficulty,"new");return}this.leagueOverwriteArmed=!0,this.renderLeaguePanel()});if(Nt(o,{flex:"1 1 220px",maxWidth:"320px"}),s.appendChild(o),e.appendChild(s),e.appendChild(Ee("div","cp-league-panel__warning",K(t==="tournament"?"tournament.new_warning":"league.new_warning"))),this.leagueOverwriteArmed){const l=Jn("cp-btn cp-btn--ghost cp-btn--sm",K(t==="tournament"?"tournament.new_cancel":"league.new_cancel"),()=>{this.leagueOverwriteArmed=!1,this.renderLeaguePanel()});e.appendChild(l)}}getResumableLeague(){const e=this.cb.getCareer();return this.selMode==="league"&&e?.mode==="league"&&e.league&&!e.league.done||this.selMode==="tournament"&&e?.mode==="tournament"&&e.tournament&&!e.tournament.champion&&!e.tournament.eliminated?e:null}dispose(){document.removeEventListener("pointerdown",this.onOutsidePointerDown)}renderStats(){const e=this.statsBox;if(!e)return;e.innerHTML="";const t=oi.find(n=>n.id===this.selTeam);t&&(e.appendChild(ua(K("stat.power"),(t.base.power-.7)/.7)),e.appendChild(ua(K("stat.accuracy"),t.base.accuracy)),e.appendChild(ua(K("stat.steal"),t.base.tackle)))}buildTeamCarousel(){const e=[...oi].sort((g,_)=>tn(g.id).localeCompare(tn(_.id)));let t=Math.max(0,e.findIndex(g=>g.id===this.selTeam));const n=Ee("div","cp-carousel"),s=Ee("button","cp-carousel__arrow","‹"),r=Ee("button","cp-carousel__arrow","›"),a=Ee("div","cp-carousel__card"),o=zn("div"),l=Ee("div","cp-carousel__name"),c=Ee("div","cp-carousel__count");a.append(o,l,c),n.append(s,a,r);const h=()=>{const g=e[t];this.selTeam=g.id,this.leagueOverwriteArmed=!1,o.innerHTML="";const _=hi(g.id);_.className="cp-carousel__flag",o.appendChild(_),l.textContent=tn(g.id),c.textContent=`${t+1} / ${e.length}`,this.renderStats()},u=g=>{t=(t+g+e.length)%e.length,h()};ti(s,()=>u(-1)),ti(r,()=>u(1));let f=!1,m=0;return a.addEventListener("pointerdown",g=>{f=!0,m=g.clientX}),a.addEventListener("pointerup",g=>{if(!f)return;f=!1;const _=g.clientX-m;_>40?u(-1):_<-40&&u(1)}),a.addEventListener("pointerleave",()=>{f=!1}),h(),n}}function zn(i){return document.createElement(i)}function Ee(i,e,t){const n=document.createElement(i);return e&&(n.className=e),t!==void 0&&(n.textContent=t),n}function Nt(i,e){Object.assign(i.style,e)}function ti(i,e){i.addEventListener("pointerdown",t=>{t.preventDefault(),e()}),i.addEventListener("keydown",t=>{t.key!=="Enter"&&t.key!==" "||(t.preventDefault(),e())})}function Jn(i,e,t){const n=zn("button");return n.className=i,n.textContent=e,ti(n,t),n}function ca(){const i=zn("div");return Nt(i,{display:"flex",flexWrap:"wrap",gap:"8px",justifyContent:"center"}),i}function ha(i,e,t){const n=zn("button");n.className=`cp-chip${e?" cp-chip--on":""}`;const s=Ee("span","",i);return n.appendChild(s),n}function $s(i,e){i.classList.toggle("cp-chip--on",e)}function ua(i,e){const t=Math.max(0,Math.min(1,e)),n=zn("div");Nt(n,{display:"flex",alignItems:"center",gap:"10px"});const s=Ee("span","",i);Nt(s,{width:"92px",font:"800 12px var(--cp-font)",letterSpacing:"1px",color:"var(--cp-chalk)"});const r=Ee("div","cp-bar-track"),a=Ee("div","cp-bar-fill");return Nt(a,{width:`${Math.round(t*100)}%`}),r.appendChild(a),n.append(s,r),n}const p0=()=>typeof window.matchMedia=="function"&&window.matchMedia("(pointer: coarse)").matches||"ontouchstart"in window;class m0{constructor(e,t){this.cb=t,this.touch=p0(),this.controlBandHeight=this.touch?196:96,this.root=Ta("div"),as(this.root,{position:"fixed",inset:"0",pointerEvents:"none",userSelect:"none",touchAction:"none"}),e.appendChild(this.root);const n=Ye("div","cp-hud"),s=Ye("div","cp-hud-panel");this.scoreBlue=Ye("span","cp-hud-score cp-hud-score--blue","0");const r=Ye("div","cp-hud-divider");this.timer=Ye("div","cp-hud-time","90");const a=Ye("div","cp-hud-divider");this.scoreRed=Ye("span","cp-hud-score cp-hud-score--red","0"),s.append(this.scoreBlue,r,this.timer,a,this.scoreRed),n.appendChild(s),this.root.appendChild(n),this.banner=Ye("div","cp-goal-toast");const o=Ye("div","cp-goal-toast__strip"),l=Ye("div","cp-goal-toast__title","GOAL");this.bannerSub=Ye("div","cp-goal-toast__subtitle",""),o.append(l,this.bannerSub),this.banner.appendChild(o),this.root.appendChild(this.banner),this.band=new d0(this.touch,{onAction:this.cb.onAction,onPrimaryDown:this.cb.onPrimaryDown,onPrimaryUp:this.cb.onPrimaryUp,onJoystick:this.cb.onJoystick,onSwitch:this.cb.onSwitch},this.controlBandHeight),this.root.appendChild(this.band.element);const c=Ta("button");c.className="cp-replay-prompt",c.textContent=`▶ ${K("replay.again")}`,c.style.display="none",this.replayBtn=c,this.root.appendChild(c),this.endPanel=this.buildEndPanel(),this.root.appendChild(this.endPanel),this.pauseOverlay=this.buildPause(),this.setup=new f0({onStart:this.cb.onStart,onMenuInteract:this.cb.onMenuInteract,getCareer:this.cb.getCareer}),this.root.appendChild(this.setup.element),this.tossOverlay=this.buildTossOverlay(),this.root.appendChild(this.tossOverlay),this.fatalOverlay=this.buildFatalOverlay(),this.root.appendChild(this.fatalOverlay),this.overlays=new h0(this.root,this.touch)}controlBandHeight;root;touch;scoreBlue;scoreRed;timer;banner;bannerSub;band;setup;overlays;endPanel;endTitle;replayBtn=null;pauseOverlay=null;lastScore="";lastDanger=!1;tossOverlay=null;coinNode=null;coinFrontFlag=null;coinBackFlag=null;tossResult=null;tossTimers=[];fatalOverlay=null;showPause(){this.pauseOverlay&&(this.pauseOverlay.style.display="flex")}hidePause(){this.pauseOverlay&&(this.pauseOverlay.style.display="none")}showEnd(e){this.endTitle.textContent=K(e==="blue"?"end.win":e==="red"?"end.lose":"end.draw"),as(this.endTitle,{color:e==="red"?"var(--cp-red)":"var(--cp-gold)"}),this.endPanel.style.display="flex"}hideEnd(){this.endPanel.style.display="none"}setScore(e,t){const n=`${e}:${t}`;if(n===this.lastScore)return;this.lastScore=n,this.scoreBlue.textContent=String(e),this.scoreRed.textContent=String(t);const s=this.scoreBlue.parentElement;s&&(s.classList.remove("cp-score-pop"),s.offsetWidth,s.classList.add("cp-score-pop"))}setTimer(e){this.timer.textContent=String(Math.ceil(Math.max(0,e)));const t=e<=10;t!==this.lastDanger&&(this.lastDanger=t,this.timer.classList.toggle("cp-hud-time--danger",t))}flashGoal(e,t){this.bannerSub.textContent=t.toUpperCase(),this.banner.classList.toggle("cp-goal-toast--rival",e==="red"),this.banner.classList.remove("cp-goal-toast--show"),this.banner.offsetWidth,this.banner.classList.add("cp-goal-toast--show")}showReplayPrompt(e){this.replayBtn&&(this.replayBtn.onclick=e,this.replayBtn.style.display="block",this.replayBtn.classList.remove("cp-replay-prompt--in"),this.replayBtn.offsetWidth,this.replayBtn.classList.add("cp-replay-prompt--in"))}hideReplayPrompt(){this.replayBtn&&(this.replayBtn.style.display="none")}setControlsVisible(e){this.band.setVisible(e)}setPrimaryMode(e){this.band.setPrimaryMode(e)}setCharge(e){this.band.setCharge(e)}hideSetup(){this.setup.element.style.display="none"}openSetup(){this.hidePause(),this.hideReplayPrompt(),this.hideCoinToss(),this.endPanel.style.display="none",this.setup.refresh(),this.setup.element.style.display="flex"}hideCoinToss(){for(const e of this.tossTimers)window.clearTimeout(e);this.tossTimers=[],this.tossOverlay&&this.tossOverlay.classList.remove("cp-toss-overlay--show")}showFatalError(){this.fatalOverlay&&(this.fatalOverlay.style.display="flex")}buildFatalOverlay(){const e=Ye("div","cp-screen cp-screen--center cp-fatal");as(e,{display:"none",gap:"16px",zIndex:"1000"});const t=Ye("div","cp-overlay-shell cp-overlay-shell--center cp-card cp-fatal__shell");return t.appendChild(Ye("div","cp-eyebrow",K("fatal.eyebrow"))),t.appendChild(Ye("div","cp-title",K("fatal.title"))),t.appendChild(Ye("div","cp-sub",K("fatal.sub"))),t.appendChild(Ii("cp-btn",K("fatal.reload"),()=>location.reload())),e.appendChild(t),e}dispose(){this.hideCoinToss(),this.setup.dispose(),this.band.dispose()}showRound(e,t,n,s,r,a,o){this.overlays.showRound(e,t,n,s,r,a,o)}showTrophy(e,t){this.overlays.showTrophy(e,t)}showEliminated(e,t,n,s){this.overlays.showEliminated(e,t,n,s)}showLeagueRound(e,t,n,s,r,a,o,l,c){this.overlays.showLeagueRound(e,t,n,s,r,a,o,l,c)}showLeagueEnd(e,t,n){this.overlays.showLeagueEnd(e,t,n)}showAllocation(e,t,n,s,r,a){this.overlays.showAllocation(e,t,n,s,r,a)}buildPause(){const e=Ii("cp-pausebtn","⏸",()=>this.cb.onPauseToggle());this.root.appendChild(e);const t=Ye("div","cp-screen cp-screen--center");as(t,{display:"none",gap:"16px"});const n=Ye("div","cp-overlay-shell cp-overlay-shell--center cp-card cp-pause__shell");return n.appendChild(Ye("div","cp-eyebrow",K("pause.eyebrow"))),n.appendChild(Ye("div","cp-title",K("pause.title"))),n.appendChild(Ii("cp-btn",K("pause.resume"),()=>this.cb.onPauseToggle())),n.appendChild(Ii("cp-btn cp-btn--ghost",K("cup.back"),()=>this.cb.onMenu())),t.appendChild(n),this.root.appendChild(t),t}buildEndPanel(){const e=Ye("div","cp-screen cp-screen--center");as(e,{display:"none",gap:"16px"});const t=Ye("div","cp-overlay-shell cp-overlay-shell--center cp-card cp-end__shell");return this.endTitle=Ye("div","cp-head"),t.append(Ye("div","cp-eyebrow",K("end.eyebrow")),this.endTitle,Ii("cp-btn cp-btn--ghost",K("end.again"),()=>{this.hideEnd(),this.cb.onRestart()}),Ii("cp-btn cp-btn--ghost cp-btn--sm",K("end.change"),()=>this.openSetup())),e.appendChild(t),e}buildTossOverlay(){const e=Ye("div","cp-toss-overlay"),t=Ye("div","cp-overlay-shell cp-overlay-shell--center cp-card cp-toss__shell"),n=Ye("div","cp-toss-title",K("coin.toss")),s=Ye("div","cp-coin-container"),r=Ye("div","cp-coin"),a=Ye("div","cp-coin-face cp-coin-face--front");this.coinFrontFlag=Ye("div","cp-coin-flag-holder"),a.appendChild(this.coinFrontFlag);const o=Ye("div","cp-coin-face cp-coin-face--back");return this.coinBackFlag=Ye("div","cp-coin-flag-holder"),o.appendChild(this.coinBackFlag),r.append(a,o),s.appendChild(r),this.coinNode=r,this.tossResult=Ye("div","cp-toss-result"),t.append(n,s,this.tossResult),e.appendChild(t),e}prepareCoinFace(e,t){if(!e)return;e.innerHTML="";const n=hi(t);n.className="cp-coin-flag",e.appendChild(n)}scheduleTossSequence(e,t,n){this.tossTimers.push(window.setTimeout(()=>{this.coinNode&&this.coinNode.classList.add(e==="blue"?"cp-coin--flipping-blue":"cp-coin--flipping-red")},150)),this.tossTimers.push(window.setTimeout(()=>{this.tossResult&&(this.tossResult.textContent=K("coin.wins",{name:t.toUpperCase()}),this.tossResult.classList.add("cp-toss-result--show"))},3100)),this.tossTimers.push(window.setTimeout(()=>{this.tossOverlay&&this.tossOverlay.classList.remove("cp-toss-overlay--show"),this.tossTimers=[],n()},4800))}showCoinToss(e,t,n,s,r){if(!this.tossOverlay||!this.coinNode||!this.coinFrontFlag||!this.coinBackFlag||!this.tossResult){r();return}this.hideCoinToss(),this.prepareCoinFace(this.coinFrontFlag,e),this.prepareCoinFace(this.coinBackFlag,t),this.tossResult.textContent="",this.tossResult.classList.remove("cp-toss-result--show"),this.coinNode.className="cp-coin",this.tossOverlay.classList.add("cp-toss-overlay--show"),this.scheduleTossSequence(n,s,r)}}function Ta(i){return document.createElement(i)}function Ye(i,e,t){const n=document.createElement(i);return e&&(n.className=e),t!==void 0&&(n.textContent=t),n}function as(i,e){Object.assign(i.style,e)}function g0(i,e){i.addEventListener("pointerdown",t=>{t.preventDefault(),e()})}function Ii(i,e,t){const n=Ta("button");return n.className=i,n.textContent=e,g0(n,t),n}const Hl="chapas-prime/save",wa=3,Ga=4;function Ha(){return Array.from({length:Ga},()=>({pow:0,acc:0,tk:0}))}function Ks(){return{version:wa,bestSeed:0,wins:0,losses:0,blueTeamId:"esp",redTeamId:"bra",points:0,caps:Ha(),career:null}}function _0(i){if(!i||typeof i!="object")return null;const e=i,t=e.difficulty==="easy"||e.difficulty==="normal"||e.difficulty==="hard"?e.difficulty:"normal",n=e.tactic==="attack"||e.tactic==="balanced"||e.tactic==="defensive"?e.tactic:"balanced";if(e.mode==="tournament"&&e.tournament&&Array.isArray(e.tournament.alive)&&Array.isArray(e.tournament.pairs))return{mode:"tournament",tactic:n,difficulty:t,tournament:e.tournament};if(e.mode==="league"&&e.league&&Array.isArray(e.league.schedule)&&Array.isArray(e.league.table)){const s={mode:"league",tactic:n,difficulty:t,league:e.league},r=v0(e.pendingAllocation);return r&&(s.pendingAllocation=r),s}return null}function v0(i){if(!i||typeof i!="object")return null;const e=i;if(!Array.isArray(e.caps))return null;const t=typeof e.pointsLeft=="number"?Math.max(0,Math.floor(e.pointsLeft)):null,n=typeof e.earned=="number"?Math.max(0,Math.floor(e.earned)):null;return t===null||n===null?null:{caps:Ic(e.caps),pointsLeft:t,earned:n}}function Ic(i){const e=Ha();if(!Array.isArray(i))return e;for(let t=0;t<Ga;t++){const n=i[t];n&&(e[t]={pow:typeof n.pow=="number"?Math.max(0,Math.floor(n.pow)):0,acc:typeof n.acc=="number"?Math.max(0,Math.floor(n.acc)):0,tk:typeof n.tk=="number"?Math.max(0,Math.floor(n.tk)):0})}return e}class x0{data;constructor(){this.data=this.load()}load(){try{const e=localStorage.getItem(Hl);if(!e)return Ks();const t=JSON.parse(e);if(typeof t.version!="number"||t.version!==2&&t.version!==wa)return Ks();const n=Ks();return{version:wa,bestSeed:typeof t.bestSeed=="number"?t.bestSeed:n.bestSeed,wins:typeof t.wins=="number"?t.wins:n.wins,losses:typeof t.losses=="number"?t.losses:n.losses,blueTeamId:typeof t.blueTeamId=="string"?t.blueTeamId:n.blueTeamId,redTeamId:typeof t.redTeamId=="string"?t.redTeamId:n.redTeamId,points:typeof t.points=="number"?Math.max(0,Math.floor(t.points)):0,caps:Ic(t.caps),career:_0(t.career)}}catch{return Ks()}}persist(){try{localStorage.setItem(Hl,JSON.stringify(this.data))}catch(e){console.warn("[save] Persist failed; progress may not survive reloads",e)}}get(){return this.data}recordResult(e,t){e==="blue"?(this.data.wins++,this.data.bestSeed=t):e==="red"&&this.data.losses++,this.persist()}setTeams(e,t){this.data.blueTeamId=e,this.data.redTeamId=t,this.persist()}addPoints(e){this.data.points=Math.max(0,this.data.points+e),this.persist()}setRoster(e,t){this.data.caps=e.slice(0,Ga).map(n=>({pow:n.pow,acc:n.acc,tk:n.tk})),this.data.points=Math.max(0,Math.floor(t)),this.persist()}resetRoster(){this.data.points=0,this.data.caps=Ha(),this.persist()}setCareer(e){this.data.career=e,this.persist()}clearCareer(){this.data.career=null,this.persist()}}class S0{current="boot";get state(){return this.current}to(e){this.current=e}is(e){return this.current===e}}function M0(i,e){if(i.isHidden()){i.setLastFrame(e);return}if(i.isPaused()||i.isReplaying()){i.setControlsVisible(!1),i.setLastFrame(e),i.clock.timeScale=0,i.clock.tick(e),i.scene.render();return}const t=i.getMatch(),n=t.world;let s=(e-i.getLastFrame())/1e3;if(i.setLastFrame(e),s>.1&&(s=.1),i.app.is("match")){i.input.update(),t.setDrive(i.input.dirX,i.input.dirZ,i.input.active);const c=i.clock.tick(e);for(let h=0;h<c&&(t.fixedStep(Lt.fixedDt),t.state.phase==="play");h++);t.frameUpdate(s),i.clock.timeScale=t.desiredTimeScale()}else i.clock.timeScale=0,i.clock.tick(e);const r=i.clock.alpha,a=i.getCapViews();if(a){for(let c=q.blueStart;c<q.count;c++)a.updateCap(c,n.ix(c,r),n.iz(c,r),s);if(t.state.phase==="play"){const c=t.state.selectedBlue;a.setSelected(n.ix(c,r),n.iz(c,r))}else a.hideSelected()}i.ballView.update(n.ix(q.ball,r),n.iy(r),n.iz(q.ball,r),n.speed(q.ball)),i.ui.setScore(t.state.scoreBlue,t.state.scoreRed),i.ui.setTimer(t.state.timeLeft);const o=t.state.phase==="play"?t.blueGkHasBall()?"clear":t.bluePossession()?"pass":"tackle":"pass";i.ui.setPrimaryMode(o),i.getCharging()&&i.ui.setCharge(Math.min(1,(e-i.getChargeStart())/jt.maxMs)),i.setControlsVisible(i.app.is("match"));const l=i.app.is("match")?"match":"menu";i.getMusicMode()!==l&&i.audio.setMusicMode(l),i.scene.render()}function Vl(){const i=document.getElementById("app");if(!i)throw new Error("#app host not found");const e=new x0,t=new Gc,n=new S0,s=new a0,r=new o0,a=new c0(i),o=new xg(i);o.scene.add(Sg());const l=new bg;o.scene.add(l.object);let c=Qt(e.get().blueTeamId),h=Qt(e.get().redTeamId),u=null,f=vs(),m=c.id,g="balanced",_="normal",p="exhibition",d=null,y=null,S=!1,b=null;const R=()=>n.to("menu"),w=()=>n.to("match"),A=()=>n.to("result"),k=(P,z,$)=>(f=vs(),m=P,g=z,c=Qt(P),h=Qt($||(P==="bra"?"esp":"bra")),u&&(o.scene.remove(u.object),u.dispose()),u=new Eg(c,h,e.get().caps),o.scene.add(u.object),e.setTeams(c.id,h.id),b=null,l.setSkin(f),new n0(c,h,t,f,z,e.get().caps,_));let v=k(e.get().blueTeamId,"balanced");const T=P=>{if(S)return;const z=v.playerAction(P);z>=0&&u?(u.pulse(z),s.thwack(18)):s.uiTap()},G=()=>{S||v.switchControlled()};let W=!1,ee=0;const L=()=>{if(!S){if(Z){a.skip();return}if(v.blueGkHasBall()){const P=v.playerClearance();P>=0?(u?.pulse(P),s.thwack(22)):s.uiTap();return}if(!v.bluePossession()){T("tackle");return}if(!v.canAct()){s.uiTap();return}W=!0,ee=performance.now()}},I=()=>{if(S||!W)return;W=!1;const P=Math.min(1,(performance.now()-ee)/jt.maxMs),z=v.playerKick(P);z>=0?(u?.pulse(z),s.thwack(P>=.5?28:16)):s.uiTap(),pe.setCharge(0)};let H=!1,Z=!1,Y=0;const j=()=>{W&&(W=!1,pe.setCharge(0))},Q=(P=!1)=>{b&&(Z=!0,pe.hideReplayPrompt(),a.show(b,v.state,c,h,()=>{b&&r.share(b,v.state,c,h)},()=>{Z=!1,x=performance.now()},P))},ie=()=>{!n.is("match")||S||(j(),H=!H,H?(pe.showPause(),s.pause()):(pe.hidePause(),s.resume()))},re=()=>{H=!1,clearTimeout(Y),j(),S=!1,pe.hideReplayPrompt(),pe.hidePause(),pe.hideCoinToss(),pe.openSetup(),s.stopTransientSfx(),s.resume(),s.setMusicMode("menu"),R()},X=()=>{A();const P=v.state.scoreBlue,z=v.state.scoreRed,$=P>z?!0:P<z?!1:(v.state.seed&1)===0,ne=d;if(!ne)return;const se=K("round."+ne.roundKey());ne.resolveRound($,P,z),ne.champion?(e.clearCareer(),pe.showTrophy(m,()=>pe.openSetup())):ne.eliminated?(e.clearCareer(),pe.showEliminated(se,ne.lastResults,m,()=>pe.openSetup())):(e.setCareer({mode:"tournament",tactic:g,difficulty:_,tournament:ne.serialize()}),pe.showRound(K("round."+ne.roundKey()),m,ne.opponent(),ne.lastResults,m,K("cup.next"),()=>{Ue(m,g,ne.opponent())}))},J=()=>{A();const P=v.state.scoreBlue,z=v.state.scoreRed,$=P>z?5:P===z?3:1;e.addPoints($);const ne=y;ne&&(ne.recordMatchday(P,z),e.setCareer({mode:"league",tactic:g,difficulty:_,league:ne.serialize(),pendingAllocation:{caps:e.get().caps.map(se=>({pow:se.pow,acc:se.acc,tk:se.tk})),pointsLeft:e.get().points,earned:$}}),pe.showAllocation(e.get().caps,e.get().points,$,m,(se,ce)=>{e.setRoster(se,ce),ne.done?(e.clearCareer(),pe.showLeagueEnd(ne.standings(),m,()=>pe.openSetup())):(e.setCareer({mode:"league",tactic:g,difficulty:_,league:ne.serialize()}),pe.showLeagueRound(K("league.matchday",{n:Math.min(ne.matchday+1,ne.total()),total:ne.total()}),ne.standings(),ne.lastResults,m,ne.playerOpponent(),m,K("league.next"),()=>{Ue(m,g,ne.playerOpponent())}))},()=>{e.clearCareer(),y=null,p="exhibition",s.setMusicMode("menu"),pe.openSetup(),R()}))},le=()=>{const P=e.get().career;if(P?.mode!=="tournament"||!P.tournament||P.tournament.champion||P.tournament.eliminated)return!1;p="tournament",g=P.tactic,_=P.difficulty,m=P.tournament.playerId,d=new Rl(m,new Fi(P.tournament.rngState),P.tournament),A();const z=d.lastResults.length?d.lastResults:null;return pe.showRound(K("round."+d.roundKey()),m,d.opponent(),z,m,K("cup.play"),()=>{Ue(m,g,d.opponent())}),!0},_e=()=>{const P=e.get().career;if(P?.mode!=="league"||!P.league||P.league.done)return!1;if(p="league",g=P.tactic,_=P.difficulty,m=P.league.playerId,y=new Cl(m,new Fi(P.league.rngState),P.league),A(),P.pendingAllocation){const $=P.pendingAllocation;return pe.showAllocation($.caps,$.pointsLeft,$.earned,m,(ne,se)=>{e.setRoster(ne,se);const ce=y;ce&&(ce.done?(e.clearCareer(),pe.showLeagueEnd(ce.standings(),m,()=>pe.openSetup())):(e.setCareer({mode:"league",tactic:g,difficulty:_,league:ce.serialize()}),pe.showLeagueRound(K("league.matchday",{n:ce.matchday+1,total:ce.total()}),ce.standings(),ce.lastResults,m,ce.playerOpponent(),m,K("league.next"),()=>{Ue(m,g,ce.playerOpponent())})))},()=>{e.clearCareer(),y=null,p="exhibition",s.setMusicMode("menu"),pe.openSetup(),R()}),!0}const z=y.lastResults.length?y.lastResults:null;return pe.showLeagueRound(K("league.matchday",{n:y.matchday+1,total:y.total()}),y.standings(),z,m,y.playerOpponent(),m,K("league.play"),()=>{Ue(m,g,y.playerOpponent())},()=>{e.clearCareer(),y=null,p="exhibition",pe.openSetup()}),!0},ge=(P,z)=>{d&&pe.showRound(K("round."+d.roundKey()),P,d.opponent(),null,P,K("cup.play"),()=>Ue(P,z,d.opponent()))},Le=(P,z)=>{y&&pe.showLeagueRound(K("league.matchday",{n:y.matchday+1,total:y.total()}),y.standings(),null,P,y.playerOpponent(),P,K("league.play"),()=>Ue(P,z,y.playerOpponent()))},De=(P,z,$,ne,se)=>{if(s.unlock(),s.setMusicMode("match"),pe.hideSetup(),p=$,m=P,g=z,_=ne,$==="tournament"){if(se==="resume"&&le())return;e.clearCareer(),d=new Rl(P,new Fi(vs())),e.setCareer({mode:"tournament",tactic:z,difficulty:ne,tournament:d.serialize()}),A(),ge(P,z);return}if($==="league"){if(se==="resume"&&_e())return;e.clearCareer(),e.resetRoster(),y=new Cl(P,new Fi(vs())),e.setCareer({mode:"league",tactic:z,difficulty:ne,league:y.serialize()}),A(),Le(P,z);return}Ue(P,z)},be=()=>{t.on("goal",P=>{if(b=P,j(),pe.setScore(v.state.scoreBlue,v.state.scoreRed),!n.is("match"))return;s.playGoal(),s.crowdCheer();const z=P.team==="blue"?tn(c.id):tn(h.id);pe.flashGoal(P.team,z),clearTimeout(Y),Y=window.setTimeout(()=>{n.is("match")&&!H&&!Z&&b&&Q(!0)},950)}),t.on("hitPost",()=>s.post()),t.on("kickoff",()=>{s.whistle(),pe.hideReplayPrompt()}),t.on("matchEnd",P=>{if(j(),clearTimeout(Y),pe.hideReplayPrompt(),n.is("boot")){v=k(m,g);return}if(n.is("match")){if(e.recordResult(P.winner,v.state.seed),p==="tournament"&&d){X();return}if(p==="league"&&y){J();return}pe.showEnd(P.winner),A()}})},Ue=(P,z,$)=>{v=k(P,z,$);const ne=(v.state.seed^v.state.seed>>>16)>>>0&1?"red":"blue";v.setKickoffTeam(ne);const se=tn(ne==="blue"?c.id:h.id);H=!0,S=!0,w(),pe.showCoinToss(c.id,h.id,ne,se,()=>{S=!1,H=!1,s.whistle()})},N=new s0({onAction:T,onPrimaryDown:L,onPrimaryUp:I,onSwitch:G,onPause:ie}),pe=new m0(i,{onAction:T,onRestart:()=>{clearTimeout(Y),pe.hideReplayPrompt(),v=k(m,g),w()},onMenuInteract:()=>{s.unlock(),s.setMusicMode("menu")},onStart:(P,z,$,ne,se)=>De(P,z,$,ne,se),onJoystick:(P,z,$)=>N.setJoystick(P,z,$),onSwitch:G,onPrimaryDown:L,onPrimaryUp:I,onPauseToggle:ie,onMenu:re,getCareer:()=>e.get().career});o.setBottomInset(pe.controlBandHeight);const xe=()=>{o.setBottomInset(pe.controlBandHeight)};window.addEventListener("resize",xe),window.addEventListener("orientationchange",xe),window.addEventListener("pointerdown",()=>s.unlock(),{once:!0});let Ae=!1;document.addEventListener("visibilitychange",()=>{Ae=document.hidden,Ae||(x=performance.now())}),be();let me=!1,nt=!1;const Ne=P=>{P!==me&&(me=P,pe.setControlsVisible(P))},E=new kc;let x=performance.now();const F=P=>{if(!nt){try{M0({isHidden:()=>Ae,isPaused:()=>H,isReplaying:()=>Z,getMatch:()=>v,getCapViews:()=>u,getLastFrame:()=>x,setLastFrame:z=>{x=z},getCharging:()=>W,getChargeStart:()=>ee,setControlsVisible:Ne,getMusicMode:()=>s.getMusicMode(),scene:o,input:N,clock:E,app:n,audio:s,ballView:l,ui:pe},P)}catch(z){nt=!0,console.error("[fatal] render loop crashed",z),s.stopTransientSfx(),pe.showFatalError();return}requestAnimationFrame(F)}};requestAnimationFrame(F),window.addEventListener("beforeunload",()=>{window.removeEventListener("resize",xe),window.removeEventListener("orientationchange",xe),pe.dispose(),o.dispose(),a.dispose()},{once:!0})}Ka(Vc()).then(Vl).catch(i=>(console.error("[i18n] bootstrap failed, falling back to English",i),Ka("en").then(Vl)));
