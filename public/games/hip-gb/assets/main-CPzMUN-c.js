(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Ed="modulepreload",Td=function(n,e){return new URL(n,e).href},Dc={},Hl=function(e,t,i){let s=Promise.resolve();if(t&&t.length>0){let c=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const a=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),l=o?.nonce||o?.getAttribute("nonce");s=c(t.map(h=>{if(h=Td(h,i),h in Dc)return;Dc[h]=!0;const u=h.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(i)for(let g=a.length-1;g>=0;g--){const _=a[g];if(_.href===h&&(!u||_.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${d}`))return;const f=document.createElement("link");if(f.rel=u?"stylesheet":Ed,u||(f.as="script"),f.crossOrigin="",f.href=h,l&&f.setAttribute("nonce",l),document.head.appendChild(f),u)return new Promise((g,_)=>{f.addEventListener("load",g),f.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return e().catch(r)})};const Gl="183",ms={ROTATE:0,DOLLY:1,PAN:2},cs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Ad=0,Lc=1,wd=2,ha=1,Rd=2,Ks=3,Ii=0,jt=1,Ai=2,Pi=0,gs=1,Fo=2,Ic=3,Uc=4,Cd=5,Rn=100,Pd=101,Dd=102,Ld=103,Id=104,Ud=200,Nd=201,Od=202,Fd=203,Bo=204,ko=205,Bd=206,kd=207,Hd=208,Gd=209,zd=210,Vd=211,Wd=212,Xd=213,qd=214,Ho=0,Go=1,zo=2,bs=3,Vo=4,Wo=5,Xo=6,qo=7,bu=0,jd=1,Yd=2,Di=0,zl=1,Vl=2,Wl=3,Ca=4,Xl=5,ql=6,jl=7,Nc="attached",Kd="detached",xu=300,On=301,xs=302,Ha=303,Ga=304,Pa=306,Ss=1e3,wi=1001,ba=1002,vt=1003,Su=1004,Zs=1005,ft=1006,ua=1007,ji=1008,$t=1009,Mu=1010,yu=1011,ar=1012,Yl=1013,Ui=1014,si=1015,Gt=1016,Kl=1017,Zl=1018,or=1020,Eu=35902,Tu=35899,Au=1021,wu=1022,qt=1023,Qi=1026,Dn=1027,Ql=1028,Jl=1029,Ms=1030,$l=1031,ec=1033,da=33776,fa=33777,pa=33778,ma=33779,jo=35840,Yo=35841,Ko=35842,Zo=35843,Qo=36196,Jo=37492,$o=37496,el=37488,tl=37489,il=37490,nl=37491,sl=37808,rl=37809,al=37810,ol=37811,ll=37812,cl=37813,hl=37814,ul=37815,dl=37816,fl=37817,pl=37818,ml=37819,gl=37820,_l=37821,vl=36492,bl=36494,xl=36495,Sl=36283,Ml=36284,yl=36285,El=36286,lr=2300,cr=2301,za=2302,Oc=2303,Fc=2400,Bc=2401,kc=2402,Zd=2500,Qd=0,Ru=1,Tl=2,Jd=3200,Cu=0,$d=1,hn="",Dt="srgb",Vt="srgb-linear",xa="linear",Ze="srgb",Wn=7680,Hc=519,ef=512,tf=513,nf=514,tc=515,sf=516,rf=517,ic=518,af=519,Al=35044,Gc="300 es",Ri=2e3,hr=2001;function of(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function lf(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function ur(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function cf(){const n=ur("canvas");return n.style.display="block",n}const zc={};function Sa(...n){const e="THREE."+n.shift();console.log(e,...n)}function Pu(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ee(...n){n=Pu(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Pe(...n){n=Pu(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Ma(...n){const e=n.join(" ");e in zc||(zc[e]=!0,Ee(...n))}function hf(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const uf={[Ho]:Go,[zo]:Xo,[Vo]:qo,[bs]:Wo,[Go]:Ho,[Xo]:zo,[qo]:Vo,[Wo]:bs};class Hn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Ot=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Vc=1234567;const er=Math.PI/180,ys=180/Math.PI;function pi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ot[n&255]+Ot[n>>8&255]+Ot[n>>16&255]+Ot[n>>24&255]+"-"+Ot[e&255]+Ot[e>>8&255]+"-"+Ot[e>>16&15|64]+Ot[e>>24&255]+"-"+Ot[t&63|128]+Ot[t>>8&255]+"-"+Ot[t>>16&255]+Ot[t>>24&255]+Ot[i&255]+Ot[i>>8&255]+Ot[i>>16&255]+Ot[i>>24&255]).toLowerCase()}function ze(n,e,t){return Math.max(e,Math.min(t,n))}function nc(n,e){return(n%e+e)%e}function df(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function ff(n,e,t){return n!==e?(t-n)/(e-n):0}function tr(n,e,t){return(1-t)*n+t*e}function pf(n,e,t,i){return tr(n,e,1-Math.exp(-t*i))}function mf(n,e=1){return e-Math.abs(nc(n,e*2)-e)}function gf(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function _f(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function vf(n,e){return n+Math.floor(Math.random()*(e-n+1))}function bf(n,e){return n+Math.random()*(e-n)}function xf(n){return n*(.5-Math.random())}function Sf(n){n!==void 0&&(Vc=n);let e=Vc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Mf(n){return n*er}function yf(n){return n*ys}function Ef(n){return(n&n-1)===0&&n!==0}function Tf(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Af(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function wf(n,e,t,i,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+i)/2),h=a((e+i)/2),u=r((e-i)/2),d=a((e-i)/2),f=r((i-e)/2),g=a((i-e)/2);switch(s){case"XYX":n.set(o*h,l*u,l*d,o*c);break;case"YZY":n.set(l*d,o*h,l*u,o*c);break;case"ZXZ":n.set(l*u,l*d,o*h,o*c);break;case"XZX":n.set(o*h,l*g,l*f,o*c);break;case"YXY":n.set(l*f,o*h,l*g,o*c);break;case"ZYZ":n.set(l*g,l*f,o*h,o*c);break;default:Ee("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function hi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function et(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Du={DEG2RAD:er,RAD2DEG:ys,generateUUID:pi,clamp:ze,euclideanModulo:nc,mapLinear:df,inverseLerp:ff,lerp:tr,damp:pf,pingpong:mf,smoothstep:gf,smootherstep:_f,randInt:vf,randFloat:bf,randFloatSpread:xf,seededRandom:Sf,degToRad:Mf,radToDeg:yf,isPowerOfTwo:Ef,ceilPowerOfTwo:Tf,floorPowerOfTwo:Af,setQuaternionFromProperEuler:wf,normalize:et,denormalize:hi};class Me{constructor(e=0,t=0){Me.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class mi{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3],d=r[a+0],f=r[a+1],g=r[a+2],_=r[a+3];if(u!==_||l!==d||c!==f||h!==g){let m=l*d+c*f+h*g+u*_;m<0&&(d=-d,f=-f,g=-g,_=-_,m=-m);let p=1-o;if(m<.9995){const b=Math.acos(m),M=Math.sin(b);p=Math.sin(p*b)/M,o=Math.sin(o*b)/M,l=l*p+d*o,c=c*p+f*o,h=h*p+g*o,u=u*p+_*o}else{l=l*p+d*o,c=c*p+f*o,h=h*p+g*o,u=u*p+_*o;const b=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=b,c*=b,h*=b,u*=b}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+h*u+l*f-c*d,e[t+1]=l*g+h*d+c*u-o*f,e[t+2]=c*g+h*f+o*d-l*u,e[t+3]=h*g-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),u=o(r/2),d=l(i/2),f=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:Ee("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=i+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(i>o&&i>u){const f=2*Math.sqrt(1+i-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-i-u);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-i-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ze(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-s*o,this._w=a*h-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(e=0,t=0,i=0){L.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Wc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Wc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),h=2*(o*t-r*s),u=2*(r*i-a*t);return this.x=t+l*c+a*u-o*h,this.y=i+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Va.copy(this).projectOnVector(e),this.sub(Va)}reflect(e){return this.sub(Va.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Va=new L,Wc=new mi;class Ne{constructor(e,t,i,s,r,a,o,l,c){Ne.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],f=i[5],g=i[8],_=s[0],m=s[3],p=s[6],b=s[1],M=s[4],y=s[7],A=s[2],w=s[5],C=s[8];return r[0]=a*_+o*b+l*A,r[3]=a*m+o*M+l*w,r[6]=a*p+o*y+l*C,r[1]=c*_+h*b+u*A,r[4]=c*m+h*M+u*w,r[7]=c*p+h*y+u*C,r[2]=d*_+f*b+g*A,r[5]=d*m+f*M+g*w,r[8]=d*p+f*y+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*r*h+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,g=t*u+i*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=u*_,e[1]=(s*c-h*i)*_,e[2]=(o*i-s*a)*_,e[3]=d*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=f*_,e[7]=(i*l-c*t)*_,e[8]=(a*t-i*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Wa.makeScale(e,t)),this}rotate(e){return this.premultiply(Wa.makeRotation(-e)),this}translate(e,t){return this.premultiply(Wa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Wa=new Ne,Xc=new Ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),qc=new Ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Rf(){const n={enabled:!0,workingColorSpace:Vt,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Ze&&(s.r=Zi(s.r),s.g=Zi(s.g),s.b=Zi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Ze&&(s.r=_s(s.r),s.g=_s(s.g),s.b=_s(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===hn?xa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ma("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ma("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Vt]:{primaries:e,whitePoint:i,transfer:xa,toXYZ:Xc,fromXYZ:qc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Dt},outputColorSpaceConfig:{drawingBufferColorSpace:Dt}},[Dt]:{primaries:e,whitePoint:i,transfer:Ze,toXYZ:Xc,fromXYZ:qc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Dt}}}),n}const We=Rf();function Zi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function _s(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Xn;class Cf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Xn===void 0&&(Xn=ur("canvas")),Xn.width=e.width,Xn.height=e.height;const s=Xn.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Xn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ur("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Zi(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Zi(t[i]/255)*255):t[i]=Zi(t[i]);return{data:t,width:e.width,height:e.height}}else return Ee("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Pf=0;class sc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Pf++}),this.uuid=pi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Xa(s[a].image)):r.push(Xa(s[a]))}else r=Xa(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function Xa(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Cf.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ee("Texture: Unable to serialize Texture."),{})}let Df=0;const qa=new L;class bt extends Hn{constructor(e=bt.DEFAULT_IMAGE,t=bt.DEFAULT_MAPPING,i=wi,s=wi,r=ft,a=ji,o=qt,l=$t,c=bt.DEFAULT_ANISOTROPY,h=hn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Df++}),this.uuid=pi(),this.name="",this.source=new sc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Me(0,0),this.repeat=new Me(1,1),this.center=new Me(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(qa).x}get height(){return this.source.getSize(qa).y}get depth(){return this.source.getSize(qa).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ee(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ee(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==xu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ss:e.x=e.x-Math.floor(e.x);break;case wi:e.x=e.x<0?0:1;break;case ba:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ss:e.y=e.y-Math.floor(e.y);break;case wi:e.y=e.y<0?0:1;break;case ba:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}bt.DEFAULT_IMAGE=null;bt.DEFAULT_MAPPING=xu;bt.DEFAULT_ANISOTROPY=1;class ht{constructor(e=0,t=0,i=0,s=1){ht.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const M=(c+1)/2,y=(f+1)/2,A=(p+1)/2,w=(h+d)/4,C=(u+_)/4,x=(g+m)/4;return M>y&&M>A?M<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(M),s=w/i,r=C/i):y>A?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=w/s,r=x/s):A<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),i=C/r,s=x/r),this.set(i,s,r,t),this}let b=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(u-_)/b,this.z=(d-h)/b,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this.w=ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this.w=ze(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Lf extends Hn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ft,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new ht(0,0,e,t),this.scissorTest=!1,this.viewport=new ht(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:i.depth},r=new bt(s),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:ft,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new sc(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Lt extends Lf{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Lu extends bt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=vt,this.minFilter=vt,this.wrapR=wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class If extends bt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=vt,this.minFilter=vt,this.wrapR=wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Be{constructor(e,t,i,s,r,a,o,l,c,h,u,d,f,g,_,m){Be.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,h,u,d,f,g,_,m)}set(e,t,i,s,r,a,o,l,c,h,u,d,f,g,_,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Be().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,s=1/qn.setFromMatrixColumn(e,0).length(),r=1/qn.setFromMatrixColumn(e,1).length(),a=1/qn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,f=a*u,g=o*h,_=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+g*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=g+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,g=c*h,_=c*u;t[0]=d+_*o,t[4]=g*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-g,t[6]=_+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,g=c*h,_=c*u;t[0]=d-_*o,t[4]=-a*u,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*h,t[9]=_-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,f=a*u,g=o*h,_=o*u;t[0]=l*h,t[4]=g*c-f,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=_-d*u,t[8]=g*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+g,t[10]=d-_*u}else if(e.order==="XZY"){const d=a*l,f=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=a*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=o*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Uf,e,Nf)}lookAt(e,t,i){const s=this.elements;return Kt.subVectors(e,t),Kt.lengthSq()===0&&(Kt.z=1),Kt.normalize(),en.crossVectors(i,Kt),en.lengthSq()===0&&(Math.abs(i.z)===1?Kt.x+=1e-4:Kt.z+=1e-4,Kt.normalize(),en.crossVectors(i,Kt)),en.normalize(),Tr.crossVectors(Kt,en),s[0]=en.x,s[4]=Tr.x,s[8]=Kt.x,s[1]=en.y,s[5]=Tr.y,s[9]=Kt.y,s[2]=en.z,s[6]=Tr.z,s[10]=Kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],f=i[13],g=i[2],_=i[6],m=i[10],p=i[14],b=i[3],M=i[7],y=i[11],A=i[15],w=s[0],C=s[4],x=s[8],E=s[12],W=s[1],R=s[5],k=s[9],B=s[13],z=s[2],H=s[6],N=s[10],O=s[14],$=s[3],Z=s[7],ce=s[11],pe=s[15];return r[0]=a*w+o*W+l*z+c*$,r[4]=a*C+o*R+l*H+c*Z,r[8]=a*x+o*k+l*N+c*ce,r[12]=a*E+o*B+l*O+c*pe,r[1]=h*w+u*W+d*z+f*$,r[5]=h*C+u*R+d*H+f*Z,r[9]=h*x+u*k+d*N+f*ce,r[13]=h*E+u*B+d*O+f*pe,r[2]=g*w+_*W+m*z+p*$,r[6]=g*C+_*R+m*H+p*Z,r[10]=g*x+_*k+m*N+p*ce,r[14]=g*E+_*B+m*O+p*pe,r[3]=b*w+M*W+y*z+A*$,r[7]=b*C+M*R+y*H+A*Z,r[11]=b*x+M*k+y*N+A*ce,r[15]=b*E+M*B+y*O+A*pe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],_=e[7],m=e[11],p=e[15],b=l*f-c*d,M=o*f-c*u,y=o*d-l*u,A=a*f-c*h,w=a*d-l*h,C=a*u-o*h;return t*(_*b-m*M+p*y)-i*(g*b-m*A+p*w)+s*(g*M-_*A+p*C)-r*(g*y-_*w+m*C)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],_=e[13],m=e[14],p=e[15],b=t*o-i*a,M=t*l-s*a,y=t*c-r*a,A=i*l-s*o,w=i*c-r*o,C=s*c-r*l,x=h*_-u*g,E=h*m-d*g,W=h*p-f*g,R=u*m-d*_,k=u*p-f*_,B=d*p-f*m,z=b*B-M*k+y*R+A*W-w*E+C*x;if(z===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const H=1/z;return e[0]=(o*B-l*k+c*R)*H,e[1]=(s*k-i*B-r*R)*H,e[2]=(_*C-m*w+p*A)*H,e[3]=(d*w-u*C-f*A)*H,e[4]=(l*W-a*B-c*E)*H,e[5]=(t*B-s*W+r*E)*H,e[6]=(m*y-g*C-p*M)*H,e[7]=(h*C-d*y+f*M)*H,e[8]=(a*k-o*W+c*x)*H,e[9]=(i*W-t*k-r*x)*H,e[10]=(g*w-_*y+p*b)*H,e[11]=(u*y-h*w-f*b)*H,e[12]=(o*E-a*R-l*x)*H,e[13]=(t*R-i*E+s*x)*H,e[14]=(_*M-g*A-m*b)*H,e[15]=(h*A-u*M+d*b)*H,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,g=r*u,_=a*h,m=a*u,p=o*u,b=l*c,M=l*h,y=l*u,A=i.x,w=i.y,C=i.z;return s[0]=(1-(_+p))*A,s[1]=(f+y)*A,s[2]=(g-M)*A,s[3]=0,s[4]=(f-y)*w,s[5]=(1-(d+p))*w,s[6]=(m+b)*w,s[7]=0,s[8]=(g+M)*C,s[9]=(m-b)*C,s[10]=(1-(d+_))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinant();if(r===0)return i.set(1,1,1),t.identity(),this;let a=qn.set(s[0],s[1],s[2]).length();const o=qn.set(s[4],s[5],s[6]).length(),l=qn.set(s[8],s[9],s[10]).length();r<0&&(a=-a),ai.copy(this);const c=1/a,h=1/o,u=1/l;return ai.elements[0]*=c,ai.elements[1]*=c,ai.elements[2]*=c,ai.elements[4]*=h,ai.elements[5]*=h,ai.elements[6]*=h,ai.elements[8]*=u,ai.elements[9]*=u,ai.elements[10]*=u,t.setFromRotationMatrix(ai),i.x=a,i.y=o,i.z=l,this}makePerspective(e,t,i,s,r,a,o=Ri,l=!1){const c=this.elements,h=2*r/(t-e),u=2*r/(i-s),d=(t+e)/(t-e),f=(i+s)/(i-s);let g,_;if(l)g=r/(a-r),_=a*r/(a-r);else if(o===Ri)g=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===hr)g=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=Ri,l=!1){const c=this.elements,h=2/(t-e),u=2/(i-s),d=-(t+e)/(t-e),f=-(i+s)/(i-s);let g,_;if(l)g=1/(a-r),_=a/(a-r);else if(o===Ri)g=-2/(a-r),_=-(a+r)/(a-r);else if(o===hr)g=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const qn=new L,ai=new Be,Uf=new L(0,0,0),Nf=new L(1,1,1),en=new L,Tr=new L,Kt=new L,jc=new Be,Yc=new mi;class Ni{constructor(e=0,t=0,i=0,s=Ni.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ze(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ze(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ee("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return jc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(jc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Yc.setFromEuler(this),this.setFromQuaternion(Yc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ni.DEFAULT_ORDER="XYZ";class Iu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Of=0;const Kc=new L,jn=new mi,Hi=new Be,Ar=new L,Fs=new L,Ff=new L,Bf=new mi,Zc=new L(1,0,0),Qc=new L(0,1,0),Jc=new L(0,0,1),$c={type:"added"},kf={type:"removed"},Yn={type:"childadded",child:null},ja={type:"childremoved",child:null};class pt extends Hn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Of++}),this.uuid=pi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=pt.DEFAULT_UP.clone();const e=new L,t=new Ni,i=new mi,s=new L(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Be},normalMatrix:{value:new Ne}}),this.matrix=new Be,this.matrixWorld=new Be,this.matrixAutoUpdate=pt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Iu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return jn.setFromAxisAngle(e,t),this.quaternion.multiply(jn),this}rotateOnWorldAxis(e,t){return jn.setFromAxisAngle(e,t),this.quaternion.premultiply(jn),this}rotateX(e){return this.rotateOnAxis(Zc,e)}rotateY(e){return this.rotateOnAxis(Qc,e)}rotateZ(e){return this.rotateOnAxis(Jc,e)}translateOnAxis(e,t){return Kc.copy(e).applyQuaternion(this.quaternion),this.position.add(Kc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Zc,e)}translateY(e){return this.translateOnAxis(Qc,e)}translateZ(e){return this.translateOnAxis(Jc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Hi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ar.copy(e):Ar.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Fs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hi.lookAt(Fs,Ar,this.up):Hi.lookAt(Ar,Fs,this.up),this.quaternion.setFromRotationMatrix(Hi),s&&(Hi.extractRotation(s.matrixWorld),jn.setFromRotationMatrix(Hi),this.quaternion.premultiply(jn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Pe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent($c),Yn.child=e,this.dispatchEvent(Yn),Yn.child=null):Pe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(kf),ja.child=e,this.dispatchEvent(ja),ja.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Hi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Hi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Hi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent($c),Yn.child=e,this.dispatchEvent(Yn),Yn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fs,e,Ff),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fs,Bf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),e.pivot!==null&&(this.pivot=e.pivot.clone()),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}pt.DEFAULT_UP=new L(0,1,0);pt.DEFAULT_MATRIX_AUTO_UPDATE=!0;pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Ln extends pt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Hf={type:"move"};class Ya{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ln,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ln,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ln,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,i),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Hf)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Ln;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Uu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},tn={h:0,s:0,l:0},wr={h:0,s:0,l:0};function Ka(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Re{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Dt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,We.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=We.workingColorSpace){return this.r=e,this.g=t,this.b=i,We.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=We.workingColorSpace){if(e=nc(e,1),t=ze(t,0,1),i=ze(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=Ka(a,r,e+1/3),this.g=Ka(a,r,e),this.b=Ka(a,r,e-1/3)}return We.colorSpaceToWorking(this,s),this}setStyle(e,t=Dt){function i(r){r!==void 0&&parseFloat(r)<1&&Ee("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ee("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ee("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Dt){const i=Uu[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ee("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zi(e.r),this.g=Zi(e.g),this.b=Zi(e.b),this}copyLinearToSRGB(e){return this.r=_s(e.r),this.g=_s(e.g),this.b=_s(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Dt){return We.workingToColorSpace(Ft.copy(this),e),Math.round(ze(Ft.r*255,0,255))*65536+Math.round(ze(Ft.g*255,0,255))*256+Math.round(ze(Ft.b*255,0,255))}getHexString(e=Dt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=We.workingColorSpace){We.workingToColorSpace(Ft.copy(this),t);const i=Ft.r,s=Ft.g,r=Ft.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=We.workingColorSpace){return We.workingToColorSpace(Ft.copy(this),t),e.r=Ft.r,e.g=Ft.g,e.b=Ft.b,e}getStyle(e=Dt){We.workingToColorSpace(Ft.copy(this),e);const t=Ft.r,i=Ft.g,s=Ft.b;return e!==Dt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(tn),this.setHSL(tn.h+e,tn.s+t,tn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(tn),e.getHSL(wr);const i=tr(tn.h,wr.h,t),s=tr(tn.s,wr.s,t),r=tr(tn.l,wr.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ft=new Re;Re.NAMES=Uu;class Nu extends pt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ni,this.environmentIntensity=1,this.environmentRotation=new Ni,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const oi=new L,Gi=new L,Za=new L,zi=new L,Kn=new L,Zn=new L,eh=new L,Qa=new L,Ja=new L,$a=new L,eo=new ht,to=new ht,io=new ht;class ui{constructor(e=new L,t=new L,i=new L){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),oi.subVectors(e,t),s.cross(oi);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){oi.subVectors(s,t),Gi.subVectors(i,t),Za.subVectors(e,t);const a=oi.dot(oi),o=oi.dot(Gi),l=oi.dot(Za),c=Gi.dot(Gi),h=Gi.dot(Za),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,zi)===null?!1:zi.x>=0&&zi.y>=0&&zi.x+zi.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,zi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,zi.x),l.addScaledVector(a,zi.y),l.addScaledVector(o,zi.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return eo.setScalar(0),to.setScalar(0),io.setScalar(0),eo.fromBufferAttribute(e,t),to.fromBufferAttribute(e,i),io.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(eo,r.x),a.addScaledVector(to,r.y),a.addScaledVector(io,r.z),a}static isFrontFacing(e,t,i,s){return oi.subVectors(i,t),Gi.subVectors(e,t),oi.cross(Gi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return oi.subVectors(this.c,this.b),Gi.subVectors(this.a,this.b),oi.cross(Gi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ui.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return ui.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return ui.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return ui.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ui.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;Kn.subVectors(s,i),Zn.subVectors(r,i),Qa.subVectors(e,i);const l=Kn.dot(Qa),c=Zn.dot(Qa);if(l<=0&&c<=0)return t.copy(i);Ja.subVectors(e,s);const h=Kn.dot(Ja),u=Zn.dot(Ja);if(h>=0&&u<=h)return t.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector(Kn,a);$a.subVectors(e,r);const f=Kn.dot($a),g=Zn.dot($a);if(g>=0&&f<=g)return t.copy(r);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(Zn,o);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return eh.subVectors(r,s),o=(u-h)/(u-h+(f-g)),t.copy(s).addScaledVector(eh,o);const p=1/(m+_+d);return a=_*p,o=d*p,t.copy(i).addScaledVector(Kn,a).addScaledVector(Zn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Oi{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(li.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(li.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=li.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,li):li.fromBufferAttribute(r,a),li.applyMatrix4(e.matrixWorld),this.expandByPoint(li);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Rr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Rr.copy(i.boundingBox)),Rr.applyMatrix4(e.matrixWorld),this.union(Rr)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,li),li.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Bs),Cr.subVectors(this.max,Bs),Qn.subVectors(e.a,Bs),Jn.subVectors(e.b,Bs),$n.subVectors(e.c,Bs),nn.subVectors(Jn,Qn),sn.subVectors($n,Jn),xn.subVectors(Qn,$n);let t=[0,-nn.z,nn.y,0,-sn.z,sn.y,0,-xn.z,xn.y,nn.z,0,-nn.x,sn.z,0,-sn.x,xn.z,0,-xn.x,-nn.y,nn.x,0,-sn.y,sn.x,0,-xn.y,xn.x,0];return!no(t,Qn,Jn,$n,Cr)||(t=[1,0,0,0,1,0,0,0,1],!no(t,Qn,Jn,$n,Cr))?!1:(Pr.crossVectors(nn,sn),t=[Pr.x,Pr.y,Pr.z],no(t,Qn,Jn,$n,Cr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,li).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(li).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Vi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Vi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Vi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Vi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Vi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Vi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Vi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Vi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Vi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Vi=[new L,new L,new L,new L,new L,new L,new L,new L],li=new L,Rr=new Oi,Qn=new L,Jn=new L,$n=new L,nn=new L,sn=new L,xn=new L,Bs=new L,Cr=new L,Pr=new L,Sn=new L;function no(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Sn.fromArray(n,r);const o=s.x*Math.abs(Sn.x)+s.y*Math.abs(Sn.y)+s.z*Math.abs(Sn.z),l=e.dot(Sn),c=t.dot(Sn),h=i.dot(Sn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Mt=new L,Dr=new Me;let Gf=0;class zt{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Gf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Al,this.updateRanges=[],this.gpuType=si,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Dr.fromBufferAttribute(this,t),Dr.applyMatrix3(e),this.setXY(t,Dr.x,Dr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix3(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix4(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyNormalMatrix(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.transformDirection(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=hi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=et(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=hi(t,this.array)),t}setX(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=hi(t,this.array)),t}setY(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=hi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=hi(t,this.array)),t}setW(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),i=et(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),i=et(i,this.array),s=et(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),i=et(i,this.array),s=et(s,this.array),r=et(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Al&&(e.usage=this.usage),e}}class Ou extends zt{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Fu extends zt{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ei extends zt{constructor(e,t,i){super(new Float32Array(e),t,i)}}const zf=new Oi,ks=new L,so=new L;class Fi{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):zf.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ks.subVectors(e,this.center);const t=ks.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(ks,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(so.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ks.copy(e.center).add(so)),this.expandByPoint(ks.copy(e.center).sub(so))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Vf=0;const ii=new Be,ro=new pt,es=new L,Zt=new Oi,Hs=new Oi,Pt=new L;class ti extends Hn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Vf++}),this.uuid=pi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(of(e)?Fu:Ou)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Ne().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ii.makeRotationFromQuaternion(e),this.applyMatrix4(ii),this}rotateX(e){return ii.makeRotationX(e),this.applyMatrix4(ii),this}rotateY(e){return ii.makeRotationY(e),this.applyMatrix4(ii),this}rotateZ(e){return ii.makeRotationZ(e),this.applyMatrix4(ii),this}translate(e,t,i){return ii.makeTranslation(e,t,i),this.applyMatrix4(ii),this}scale(e,t,i){return ii.makeScale(e,t,i),this.applyMatrix4(ii),this}lookAt(e){return ro.lookAt(e),ro.updateMatrix(),this.applyMatrix4(ro.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(es).negate(),this.translate(es.x,es.y,es.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ei(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ee("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Oi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Pe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];Zt.setFromBufferAttribute(r),this.morphTargetsRelative?(Pt.addVectors(this.boundingBox.min,Zt.min),this.boundingBox.expandByPoint(Pt),Pt.addVectors(this.boundingBox.max,Zt.max),this.boundingBox.expandByPoint(Pt)):(this.boundingBox.expandByPoint(Zt.min),this.boundingBox.expandByPoint(Zt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Pe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Pe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const i=this.boundingSphere.center;if(Zt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Hs.setFromBufferAttribute(o),this.morphTargetsRelative?(Pt.addVectors(Zt.min,Hs.min),Zt.expandByPoint(Pt),Pt.addVectors(Zt.max,Hs.max),Zt.expandByPoint(Pt)):(Zt.expandByPoint(Hs.min),Zt.expandByPoint(Hs.max))}Zt.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)Pt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Pt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Pt.fromBufferAttribute(o,c),l&&(es.fromBufferAttribute(e,c),Pt.add(es)),s=Math.max(s,i.distanceToSquared(Pt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Pe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Pe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new zt(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let x=0;x<i.count;x++)o[x]=new L,l[x]=new L;const c=new L,h=new L,u=new L,d=new Me,f=new Me,g=new Me,_=new L,m=new L;function p(x,E,W){c.fromBufferAttribute(i,x),h.fromBufferAttribute(i,E),u.fromBufferAttribute(i,W),d.fromBufferAttribute(r,x),f.fromBufferAttribute(r,E),g.fromBufferAttribute(r,W),h.sub(c),u.sub(c),f.sub(d),g.sub(d);const R=1/(f.x*g.y-g.x*f.y);isFinite(R)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(R),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(R),o[x].add(_),o[E].add(_),o[W].add(_),l[x].add(m),l[E].add(m),l[W].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let x=0,E=b.length;x<E;++x){const W=b[x],R=W.start,k=W.count;for(let B=R,z=R+k;B<z;B+=3)p(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const M=new L,y=new L,A=new L,w=new L;function C(x){A.fromBufferAttribute(s,x),w.copy(A);const E=o[x];M.copy(E),M.sub(A.multiplyScalar(A.dot(E))).normalize(),y.crossVectors(w,E);const R=y.dot(l[x])<0?-1:1;a.setXYZW(x,M.x,M.y,M.z,R)}for(let x=0,E=b.length;x<E;++x){const W=b[x],R=W.start,k=W.count;for(let B=R,z=R+k;B<z;B+=3)C(e.getX(B+0)),C(e.getX(B+1)),C(e.getX(B+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new zt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new L,r=new L,a=new L,o=new L,l=new L,c=new L,h=new L,u=new L;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Pt.fromBufferAttribute(e,t),Pt.normalize(),e.setXYZ(t,Pt.x,Pt.y,Pt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new zt(d,h,u)}if(this.index===null)return Ee("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new ti,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,i);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Wf{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Al,this.updateRanges=[],this.version=0,this.uuid=pi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=pi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=pi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Bt=new L;class rc{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Bt.fromBufferAttribute(this,t),Bt.applyMatrix4(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Bt.fromBufferAttribute(this,t),Bt.applyNormalMatrix(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Bt.fromBufferAttribute(this,t),Bt.transformDirection(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=hi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=et(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=hi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=hi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=hi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=hi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),i=et(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),i=et(i,this.array),s=et(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),i=et(i,this.array),s=et(s,this.array),r=et(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Sa("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new zt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new rc(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Sa("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let Xf=0;class Li extends Hn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Xf++}),this.uuid=pi(),this.name="",this.type="Material",this.blending=gs,this.side=Ii,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Bo,this.blendDst=ko,this.blendEquation=Rn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Re(0,0,0),this.blendAlpha=0,this.depthFunc=bs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Hc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Wn,this.stencilZFail=Wn,this.stencilZPass=Wn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ee(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ee(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==gs&&(i.blending=this.blending),this.side!==Ii&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Bo&&(i.blendSrc=this.blendSrc),this.blendDst!==ko&&(i.blendDst=this.blendDst),this.blendEquation!==Rn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==bs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Hc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Wn&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Wn&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Wn&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Wi=new L,ao=new L,Lr=new L,rn=new L,oo=new L,Ir=new L,lo=new L;class xr{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Wi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Wi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Wi.copy(this.origin).addScaledVector(this.direction,t),Wi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){ao.copy(e).add(t).multiplyScalar(.5),Lr.copy(t).sub(e).normalize(),rn.copy(this.origin).sub(ao);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Lr),o=rn.dot(this.direction),l=-rn.dot(Lr),c=rn.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ao).addScaledVector(Lr,d),f}intersectSphere(e,t){Wi.subVectors(e.center,this.origin);const i=Wi.dot(this.direction),s=Wi.dot(Wi)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Wi)!==null}intersectTriangle(e,t,i,s,r){oo.subVectors(t,e),Ir.subVectors(i,e),lo.crossVectors(oo,Ir);let a=this.direction.dot(lo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;rn.subVectors(this.origin,e);const l=o*this.direction.dot(Ir.crossVectors(rn,Ir));if(l<0)return null;const c=o*this.direction.dot(oo.cross(rn));if(c<0||l+c>a)return null;const h=-o*rn.dot(lo);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ci extends Li{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Re(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ni,this.combine=bu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const th=new Be,Mn=new xr,Ur=new Fi,ih=new L,Nr=new L,Or=new L,Fr=new L,co=new L,Br=new L,nh=new L,kr=new L;class Wt extends pt{constructor(e=new ti,t=new Ci){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Br.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(co.fromBufferAttribute(u,e),a?Br.addScaledVector(co,h):Br.addScaledVector(co.sub(t),h))}t.add(Br)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ur.copy(i.boundingSphere),Ur.applyMatrix4(r),Mn.copy(e.ray).recast(e.near),!(Ur.containsPoint(Mn.origin)===!1&&(Mn.intersectSphere(Ur,ih)===null||Mn.origin.distanceToSquared(ih)>(e.far-e.near)**2))&&(th.copy(r).invert(),Mn.copy(e.ray).applyMatrix4(th),!(i.boundingBox!==null&&Mn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Mn)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=a[m.materialIndex],b=Math.max(m.start,f.start),M=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let y=b,A=M;y<A;y+=3){const w=o.getX(y),C=o.getX(y+1),x=o.getX(y+2);s=Hr(this,p,e,i,c,h,u,w,C,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const b=o.getX(m),M=o.getX(m+1),y=o.getX(m+2);s=Hr(this,a,e,i,c,h,u,b,M,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=a[m.materialIndex],b=Math.max(m.start,f.start),M=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let y=b,A=M;y<A;y+=3){const w=y,C=y+1,x=y+2;s=Hr(this,p,e,i,c,h,u,w,C,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const b=m,M=m+1,y=m+2;s=Hr(this,a,e,i,c,h,u,b,M,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function qf(n,e,t,i,s,r,a,o){let l;if(e.side===jt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===Ii,o),l===null)return null;kr.copy(o),kr.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(kr);return c<t.near||c>t.far?null:{distance:c,point:kr.clone(),object:n}}function Hr(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,Nr),n.getVertexPosition(l,Or),n.getVertexPosition(c,Fr);const h=qf(n,e,t,i,Nr,Or,Fr,nh);if(h){const u=new L;ui.getBarycoord(nh,Nr,Or,Fr,u),s&&(h.uv=ui.getInterpolatedAttribute(s,o,l,c,u,new Me)),r&&(h.uv1=ui.getInterpolatedAttribute(r,o,l,c,u,new Me)),a&&(h.normal=ui.getInterpolatedAttribute(a,o,l,c,u,new L),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new L,materialIndex:0};ui.getNormal(Nr,Or,Fr,d.normal),h.face=d,h.barycoord=u}return h}const sh=new L,rh=new ht,ah=new ht,jf=new L,oh=new Be,Gr=new L,ho=new Fi,lh=new Be,uo=new xr;class Yf extends Wt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Nc,this.bindMatrix=new Be,this.bindMatrixInverse=new Be,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Oi),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Gr),this.boundingBox.expandByPoint(Gr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Fi),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Gr),this.boundingSphere.expandByPoint(Gr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ho.copy(this.boundingSphere),ho.applyMatrix4(s),e.ray.intersectsSphere(ho)!==!1&&(lh.copy(s).invert(),uo.copy(e.ray).applyMatrix4(lh),!(this.boundingBox!==null&&uo.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,uo)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new ht,t=this.geometry.attributes.skinWeight;for(let i=0,s=t.count;i<s;i++){e.fromBufferAttribute(t,i);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Nc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Kd?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ee("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const i=this.skeleton,s=this.geometry;rh.fromBufferAttribute(s.attributes.skinIndex,e),ah.fromBufferAttribute(s.attributes.skinWeight,e),sh.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const a=ah.getComponent(r);if(a!==0){const o=rh.getComponent(r);oh.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),t.addScaledVector(jf.copy(sh).applyMatrix4(oh),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Bu extends pt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class ac extends bt{constructor(e=null,t=1,i=1,s,r,a,o,l,c=vt,h=vt,u,d){super(null,a,o,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const ch=new Be,Kf=new Be;class oc{constructor(e=[],t=[]){this.uuid=pi(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ee("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new Be)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const i=new Be;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const e=this.bones,t=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:Kf;ch.multiplyMatrices(o,t[r]),ch.toArray(i,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new oc(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const i=new ac(t,e,e,qt,si);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,s=e.bones.length;i<s;i++){const r=e.bones[i];let a=t[r];a===void 0&&(Ee("Skeleton: No bone found with UUID:",r),a=new Bu),this.bones.push(a),this.boneInverses.push(new Be().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,i=this.boneInverses;for(let s=0,r=t.length;s<r;s++){const a=t[s];e.bones.push(a.uuid);const o=i[s];e.boneInverses.push(o.toArray())}return e}}class wl extends zt{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ts=new Be,hh=new Be,zr=[],uh=new Oi,Zf=new Be,Gs=new Wt,zs=new Fi;class Qf extends Wt{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new wl(new Float32Array(i*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Zf)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Oi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,ts),uh.copy(e.boundingBox).applyMatrix4(ts),this.boundingBox.union(uh)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Fi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,ts),zs.copy(e.boundingSphere).applyMatrix4(ts),this.boundingSphere.union(zs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=e.previousInstanceMatrix.clone()),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,a=e*r+1;for(let o=0;o<i.length;o++)i[o]=s[a+o]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(Gs.geometry=this.geometry,Gs.material=this.material,Gs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),zs.copy(this.boundingSphere),zs.applyMatrix4(i),e.ray.intersectsSphere(zs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ts),hh.multiplyMatrices(i,ts),Gs.matrixWorld=hh,Gs.raycast(e,zr);for(let a=0,o=zr.length;a<o;a++){const l=zr[a];l.instanceId=r,l.object=this,t.push(l)}zr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new wl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new ac(new Float32Array(s*this.count),s,this.count,Ql,si));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;r[l]=o,r.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const fo=new L,Jf=new L,$f=new Ne;class cn{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=fo.subVectors(i,t).cross(Jf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(fo),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||$f.getNormalMatrix(e),s=this.coplanarPoint(fo).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const yn=new Fi,ep=new Me(.5,.5),Vr=new L;class lc{constructor(e=new cn,t=new cn,i=new cn,s=new cn,r=new cn,a=new cn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ri,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],_=r[9],m=r[10],p=r[11],b=r[12],M=r[13],y=r[14],A=r[15];if(s[0].setComponents(c-a,f-h,p-g,A-b).normalize(),s[1].setComponents(c+a,f+h,p+g,A+b).normalize(),s[2].setComponents(c+o,f+u,p+_,A+M).normalize(),s[3].setComponents(c-o,f-u,p-_,A-M).normalize(),i)s[4].setComponents(l,d,m,y).normalize(),s[5].setComponents(c-l,f-d,p-m,A-y).normalize();else if(s[4].setComponents(c-l,f-d,p-m,A-y).normalize(),t===Ri)s[5].setComponents(c+l,f+d,p+m,A+y).normalize();else if(t===hr)s[5].setComponents(l,d,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),yn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),yn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(yn)}intersectsSprite(e){yn.center.set(0,0,0);const t=ep.distanceTo(e.center);return yn.radius=.7071067811865476+t,yn.applyMatrix4(e.matrixWorld),this.intersectsSphere(yn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(Vr.x=s.normal.x>0?e.max.x:e.min.x,Vr.y=s.normal.y>0?e.max.y:e.min.y,Vr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Vr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ku extends Li{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Re(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ya=new L,Ea=new L,dh=new Be,Vs=new xr,Wr=new Fi,po=new L,fh=new L;class cc extends pt{constructor(e=new ti,t=new ku){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)ya.fromBufferAttribute(t,s-1),Ea.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=ya.distanceTo(Ea);e.setAttribute("lineDistance",new ei(i,1))}else Ee("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Wr.copy(i.boundingSphere),Wr.applyMatrix4(s),Wr.radius+=r,e.ray.intersectsSphere(Wr)===!1)return;dh.copy(s).invert(),Vs.copy(e.ray).applyMatrix4(dh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=f,m=g-1;_<m;_+=c){const p=h.getX(_),b=h.getX(_+1),M=Xr(this,e,Vs,l,p,b,_);M&&t.push(M)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(f),p=Xr(this,e,Vs,l,_,m,g-1);p&&t.push(p)}}else{const f=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let _=f,m=g-1;_<m;_+=c){const p=Xr(this,e,Vs,l,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){const _=Xr(this,e,Vs,l,g-1,f,g-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Xr(n,e,t,i,s,r,a){const o=n.geometry.attributes.position;if(ya.fromBufferAttribute(o,s),Ea.fromBufferAttribute(o,r),t.distanceSqToSegment(ya,Ea,po,fh)>i)return;po.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(po);if(!(c<e.near||c>e.far))return{distance:c,point:fh.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const ph=new L,mh=new L;class tp extends cc{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)ph.fromBufferAttribute(t,s),mh.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+ph.distanceTo(mh);e.setAttribute("lineDistance",new ei(i,1))}else Ee("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class ip extends cc{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Hu extends Li{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Re(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const gh=new Be,Rl=new xr,qr=new Fi,jr=new L;class np extends pt{constructor(e=new ti,t=new Hu){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),qr.copy(i.boundingSphere),qr.applyMatrix4(s),qr.radius+=r,e.ray.intersectsSphere(qr)===!1)return;gh.copy(s).invert(),Rl.copy(e.ray).applyMatrix4(gh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,u=i.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let g=d,_=f;g<_;g++){const m=c.getX(g);jr.fromBufferAttribute(u,m),_h(jr,m,l,s,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let g=d,_=f;g<_;g++)jr.fromBufferAttribute(u,g),_h(jr,g,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function _h(n,e,t,i,s,r,a){const o=Rl.distanceSqToPoint(n);if(o<t){const l=new L;Rl.closestPointToPoint(n,l),l.applyMatrix4(i);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Gu extends bt{constructor(e=[],t=On,i,s,r,a,o,l,c,h){super(e,t,i,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class sp extends bt{constructor(e,t,i,s,r,a,o,l,c){super(e,t,i,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class dr extends bt{constructor(e,t,i=Ui,s,r,a,o=vt,l=vt,c,h=Qi,u=1){if(h!==Qi&&h!==Dn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,s,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new sc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class rp extends dr{constructor(e,t=Ui,i=On,s,r,a=vt,o=vt,l,c=Qi){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,i,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class zu extends bt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Sr extends ti{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,i,t,e,a,r,0),g("z","y","x",1,-1,i,t,-e,a,r,1),g("x","z","y",1,1,e,i,t,s,a,2),g("x","z","y",1,-1,e,i,-t,s,a,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new ei(c,3)),this.setAttribute("normal",new ei(h,3)),this.setAttribute("uv",new ei(u,2));function g(_,m,p,b,M,y,A,w,C,x,E){const W=y/C,R=A/x,k=y/2,B=A/2,z=w/2,H=C+1,N=x+1;let O=0,$=0;const Z=new L;for(let ce=0;ce<N;ce++){const pe=ce*R-B;for(let ue=0;ue<H;ue++){const Oe=ue*W-k;Z[_]=Oe*b,Z[m]=pe*M,Z[p]=z,c.push(Z.x,Z.y,Z.z),Z[_]=0,Z[m]=0,Z[p]=w>0?1:-1,h.push(Z.x,Z.y,Z.z),u.push(ue/C),u.push(1-ce/x),O+=1}}for(let ce=0;ce<x;ce++)for(let pe=0;pe<C;pe++){const ue=d+pe+H*ce,Oe=d+pe+H*(ce+1),dt=d+(pe+1)+H*(ce+1),ct=d+(pe+1)+H*ce;l.push(ue,Oe,ct),l.push(Oe,dt,ct),$+=6}o.addGroup(f,$,E),f+=$,d+=O}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Sr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Mr extends ti{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,u=e/o,d=t/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const b=p*d-a;for(let M=0;M<c;M++){const y=M*u-r;g.push(y,-b,0),_.push(0,0,1),m.push(M/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<o;b++){const M=b+c*p,y=b+c*(p+1),A=b+1+c*(p+1),w=b+1+c*p;f.push(M,y,w),f.push(y,A,w)}this.setIndex(f),this.setAttribute("position",new ei(g,3)),this.setAttribute("normal",new ei(_,3)),this.setAttribute("uv",new ei(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mr(e.width,e.height,e.widthSegments,e.heightSegments)}}function Es(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Ee("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function kt(n){const e={};for(let t=0;t<n.length;t++){const i=Es(n[t]);for(const s in i)e[s]=i[s]}return e}function ap(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Vu(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:We.workingColorSpace}const fn={clone:Es,merge:kt};var op=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,lp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Et extends Li{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=op,this.fragmentShader=lp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Es(e.uniforms),this.uniformsGroups=ap(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Wu extends Et{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class hc extends Li{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Re(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Re(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Cu,this.normalScale=new Me(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ni,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class gi extends hc{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Me(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ze(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Re(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Re(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Re(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class cp extends Li{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Jd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class hp extends Li{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function Yr(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function up(n){function e(s,r){return n[s]-n[r]}const t=n.length,i=new Array(t);for(let s=0;s!==t;++s)i[s]=s;return i.sort(e),i}function vh(n,e,t){const i=n.length,s=new n.constructor(i);for(let r=0,a=0;a!==i;++r){const o=t[r]*e;for(let l=0;l!==e;++l)s[a++]=n[o+l]}return s}function Xu(n,e,t,i){let s=1,r=n[0];for(;r!==void 0&&r[i]===void 0;)r=n[s++];if(r===void 0)return;let a=r[i];if(a!==void 0)if(Array.isArray(a))do a=r[i],a!==void 0&&(e.push(r.time),t.push(...a)),r=n[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[i],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=n[s++];while(r!==void 0);else do a=r[i],a!==void 0&&(e.push(r.time),t.push(a)),r=n[s++];while(r!==void 0)}class Ds{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let i=this._cachedIndex,s=t[i],r=t[i-1];i:{e:{let a;t:{n:if(!(e<s)){for(let o=i+2;;){if(s===void 0){if(e<r)break n;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=t[++i],e<s)break e}a=t.length;break t}if(!(e>=r)){const o=t[1];e<o&&(i=2,r=o);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=t[--i-1],e>=r)break e}a=i,i=0;break t}break i}for(;i<a;){const o=i+a>>>1;e<t[o]?a=o:i=o+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=i[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class dp extends Ds{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Fc,endingEnd:Fc}}intervalChanged_(e,t,i){const s=this.parameterPositions;let r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Bc:r=e,o=2*t-i;break;case kc:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Bc:a=e,l=2*i-t;break;case kc:a=1,l=i+s[1]-s[0];break;default:a=e-1,l=t}const c=(i-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(i-t)/(s-t),_=g*g,m=_*g,p=-d*m+2*d*_-d*g,b=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,M=(-1-f)*m+(1.5+f)*_+.5*g,y=f*m-f*_;for(let A=0;A!==o;++A)r[A]=p*a[h+A]+b*a[c+A]+M*a[l+A]+y*a[u+A];return r}}class fp extends Ds{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(i-t)/(s-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}}class pp extends Ds{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class mp extends Ds{interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.settings||this.DefaultSettings_,u=h.inTangents,d=h.outTangents;if(!u||!d){const _=(i-t)/(s-t),m=1-_;for(let p=0;p!==o;++p)r[p]=a[c+p]*m+a[l+p]*_;return r}const f=o*2,g=e-1;for(let _=0;_!==o;++_){const m=a[c+_],p=a[l+_],b=g*f+_*2,M=d[b],y=d[b+1],A=e*f+_*2,w=u[A],C=u[A+1];let x=(i-t)/(s-t),E,W,R,k,B;for(let z=0;z<8;z++){E=x*x,W=E*x,R=1-x,k=R*R,B=k*R;const N=B*t+3*k*x*M+3*R*E*w+W*s-i;if(Math.abs(N)<1e-10)break;const O=3*k*(M-t)+6*R*x*(w-M)+3*E*(s-w);if(Math.abs(O)<1e-10)break;x=x-N/O,x=Math.max(0,Math.min(1,x))}r[_]=B*m+3*k*x*y+3*R*E*C+W*p}return r}}class _i{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Yr(t,this.TimeBufferType),this.values=Yr(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Yr(e.times,Array),values:Yr(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new pp(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new fp(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new dp(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new mp(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.settings=this.settings),t}setInterpolation(e){let t;switch(e){case lr:t=this.InterpolantFactoryMethodDiscrete;break;case cr:t=this.InterpolantFactoryMethodLinear;break;case za:t=this.InterpolantFactoryMethodSmooth;break;case Oc:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Ee("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return lr;case this.InterpolantFactoryMethodLinear:return cr;case this.InterpolantFactoryMethodSmooth:return za;case this.InterpolantFactoryMethodBezier:return Oc}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){const i=this.times,s=i.length;let r=0,a=s-1;for(;r!==s&&i[r]<e;)++r;for(;a!==-1&&i[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Pe("KeyframeTrack: Invalid value size in track.",this),e=!1);const i=this.times,s=this.values,r=i.length;r===0&&(Pe("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=i[o];if(typeof l=="number"&&isNaN(l)){Pe("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Pe("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&lf(s))for(let o=0,l=s.length;o!==l;++o){const c=s[o];if(isNaN(c)){Pe("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===za,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{const u=o*i,d=u-i,f=u+i;for(let g=0;g!==i;++g){const _=t[u+g];if(_!==t[d+g]||_!==t[f+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const u=o*i,d=a*i;for(let f=0;f!==i;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}}_i.prototype.ValueTypeName="";_i.prototype.TimeBufferType=Float32Array;_i.prototype.ValueBufferType=Float32Array;_i.prototype.DefaultInterpolation=cr;class Ls extends _i{constructor(e,t,i){super(e,t,i)}}Ls.prototype.ValueTypeName="bool";Ls.prototype.ValueBufferType=Array;Ls.prototype.DefaultInterpolation=lr;Ls.prototype.InterpolantFactoryMethodLinear=void 0;Ls.prototype.InterpolantFactoryMethodSmooth=void 0;class qu extends _i{constructor(e,t,i,s){super(e,t,i,s)}}qu.prototype.ValueTypeName="color";class Ts extends _i{constructor(e,t,i,s){super(e,t,i,s)}}Ts.prototype.ValueTypeName="number";class gp extends Ds{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(s-t);let c=e*o;for(let h=c+o;c!==h;c+=4)mi.slerpFlat(r,0,a,c-o,a,c,l);return r}}class As extends _i{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new gp(this.times,this.values,this.getValueSize(),e)}}As.prototype.ValueTypeName="quaternion";As.prototype.InterpolantFactoryMethodSmooth=void 0;class Is extends _i{constructor(e,t,i){super(e,t,i)}}Is.prototype.ValueTypeName="string";Is.prototype.ValueBufferType=Array;Is.prototype.DefaultInterpolation=lr;Is.prototype.InterpolantFactoryMethodLinear=void 0;Is.prototype.InterpolantFactoryMethodSmooth=void 0;class ws extends _i{constructor(e,t,i,s){super(e,t,i,s)}}ws.prototype.ValueTypeName="vector";class _p{constructor(e="",t=-1,i=[],s=Zd){this.name=e,this.tracks=i,this.duration=t,this.blendMode=s,this.uuid=pi(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],i=e.tracks,s=1/(e.fps||1);for(let a=0,o=i.length;a!==o;++a)t.push(bp(i[a]).scale(s));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],i=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=i.length;r!==a;++r)t.push(_i.toJSON(i[r]));return s}static CreateFromMorphTargetSequence(e,t,i,s){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=up(l);l=vh(l,1,h),c=vh(c,1,h),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new Ts(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/i))}return new this(e,-1,a)}static findByName(e,t){let i=e;if(!Array.isArray(e)){const s=e;i=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<i.length;s++)if(i[s].name===t)return i[s];return null}static CreateClipsFromMorphTargetSequences(e,t,i){const s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(r);if(h&&h.length>1){const u=h[1];let d=s[u];d||(s[u]=d=[]),d.push(c)}}const a=[];for(const o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,i));return a}static parseAnimation(e,t){if(Ee("AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return Pe("AnimationClip: No animation in JSONLoader data."),null;const i=function(u,d,f,g,_){if(f.length!==0){const m=[],p=[];Xu(f,m,p,g),m.length!==0&&_.push(new u(d,m,p))}},s=[],r=e.name||"default",a=e.fps||30,o=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let u=0;u<c.length;u++){const d=c[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let g;for(g=0;g<d.length;g++)if(d[g].morphTargets)for(let _=0;_<d[g].morphTargets.length;_++)f[d[g].morphTargets[_]]=-1;for(const _ in f){const m=[],p=[];for(let b=0;b!==d[g].morphTargets.length;++b){const M=d[g];m.push(M.time),p.push(M.morphTarget===_?1:0)}s.push(new Ts(".morphTargetInfluence["+_+"]",m,p))}l=f.length*a}else{const f=".bones["+t[u].name+"]";i(ws,f+".position",d,"pos",s),i(As,f+".quaternion",d,"rot",s),i(ws,f+".scale",d,"scl",s)}}return s.length===0?null:new this(r,l,s,o)}resetDuration(){const e=this.tracks;let t=0;for(let i=0,s=e.length;i!==s;++i){const r=this.tracks[i];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let i=0;i<this.tracks.length;i++)e.push(this.tracks[i].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function vp(n){switch(n.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ts;case"vector":case"vector2":case"vector3":case"vector4":return ws;case"color":return qu;case"quaternion":return As;case"bool":case"boolean":return Ls;case"string":return Is}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+n)}function bp(n){if(n.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=vp(n.type);if(n.times===void 0){const t=[],i=[];Xu(n.keys,t,i,"value"),n.times=t,n.values=i}return e.parse!==void 0?e.parse(n):new e(n.name,n.times,n.values,n.interpolation)}const Yi={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(bh(n)||(this.files[n]=e))},get:function(n){if(this.enabled!==!1&&!bh(n))return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};function bh(n){try{const e=n.slice(n.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class xp{constructor(e,t,i){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){const f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const Sp=new xp;class Us{constructor(e){this.manager=e!==void 0?e:Sp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Us.DEFAULT_MATERIAL_NAME="__DEFAULT";const Xi={};class Mp extends Error{constructor(e,t){super(e),this.response=t}}class ju extends Us{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=Yi.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(Xi[e]!==void 0){Xi[e].push({onLoad:t,onProgress:i,onError:s});return}Xi[e]=[],Xi[e].push({onLoad:t,onProgress:i,onError:s});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Ee("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=Xi[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,g=f!==0;let _=0;const m=new ReadableStream({start(p){b();function b(){u.read().then(({done:M,value:y})=>{if(M)p.close();else{_+=y.byteLength;const A=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:f});for(let w=0,C=h.length;w<C;w++){const x=h[w];x.onProgress&&x.onProgress(A)}p.enqueue(y),b()}},M=>{p.error(M)})}}});return new Response(m)}else throw new Mp(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(g=>f.decode(g))}}}).then(c=>{Yi.add(`file:${e}`,c);const h=Xi[e];delete Xi[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{const h=Xi[e];if(h===void 0)throw this.manager.itemError(e),c;delete Xi[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const is=new WeakMap;class yp extends Us{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Yi.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=is.get(a);u===void 0&&(u=[],is.set(a,u)),u.push({onLoad:t,onError:s})}return a}const o=ur("img");function l(){h(),t&&t(this);const u=is.get(this)||[];for(let d=0;d<u.length;d++){const f=u[d];f.onLoad&&f.onLoad(this)}is.delete(this),r.manager.itemEnd(e)}function c(u){h(),s&&s(u),Yi.remove(`image:${e}`);const d=is.get(this)||[];for(let f=0;f<d.length;f++){const g=d[f];g.onError&&g.onError(u)}is.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Yi.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class Ep extends Us{constructor(e){super(e)}load(e,t,i,s){const r=new bt,a=new yp(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},i,s),r}}class Da extends pt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Re(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const mo=new Be,xh=new L,Sh=new L;class uc{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Me(512,512),this.mapType=$t,this.map=null,this.mapPass=null,this.matrix=new Be,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new lc,this._frameExtents=new Me(1,1),this._viewportCount=1,this._viewports=[new ht(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;xh.setFromMatrixPosition(e.matrixWorld),t.position.copy(xh),Sh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Sh),t.updateMatrixWorld(),mo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(mo,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===hr||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(mo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Kr=new L,Zr=new mi,bi=new L;class Yu extends pt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Be,this.projectionMatrix=new Be,this.projectionMatrixInverse=new Be,this.coordinateSystem=Ri,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Kr,Zr,bi),bi.x===1&&bi.y===1&&bi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Kr,Zr,bi.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(Kr,Zr,bi),bi.x===1&&bi.y===1&&bi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Kr,Zr,bi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const an=new L,Mh=new Me,yh=new Me;class Ht extends Yu{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ys*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(er*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ys*2*Math.atan(Math.tan(er*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){an.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(an.x,an.y).multiplyScalar(-e/an.z),an.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(an.x,an.y).multiplyScalar(-e/an.z)}getViewSize(e,t){return this.getViewBounds(e,Mh,yh),t.subVectors(yh,Mh)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(er*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Tp extends uc{constructor(){super(new Ht(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,i=ys*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(i!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=i,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Ap extends Da{constructor(e,t,i=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.target=new pt,this.distance=i,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Tp}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class wp extends uc{constructor(){super(new Ht(90,1,.5,500)),this.isPointLightShadow=!0}}class Ku extends Da{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new wp}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Ns extends Yu{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Rp extends uc{constructor(){super(new Ns(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Cl extends Da{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.target=new pt,this.shadow=new Rp}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class Cp extends Da{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class ir{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const go=new WeakMap;class Pp extends Us{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ee("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ee("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Yi.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{if(go.has(a)===!0)s&&s(go.get(a)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(c),r.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Yi.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),go.set(l,c),Yi.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Yi.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const ns=-90,ss=1;class Dp extends pt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ht(ns,ss,e,t);s.layers=this.layers,this.add(s);const r=new Ht(ns,ss,e,t);r.layers=this.layers,this.add(r);const a=new Ht(ns,ss,e,t);a.layers=this.layers,this.add(a);const o=new Ht(ns,ss,e,t);o.layers=this.layers,this.add(o);const l=new Ht(ns,ss,e,t);l.layers=this.layers,this.add(l);const c=new Ht(ns,ss,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Ri)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===hr)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Lp extends Ht{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}let Ip=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Up.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Up(){this._document.hidden===!1&&this.reset()}const dc="\\[\\]\\.:\\/",Np=new RegExp("["+dc+"]","g"),fc="[^"+dc+"]",Op="[^"+dc.replace("\\.","")+"]",Fp=/((?:WC+[\/:])*)/.source.replace("WC",fc),Bp=/(WCOD+)?/.source.replace("WCOD",Op),kp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",fc),Hp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",fc),Gp=new RegExp("^"+Fp+Bp+kp+Hp+"$"),zp=["material","materials","bones","map"];class Vp{constructor(e,t,i){const s=i||tt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){const i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}}class tt{constructor(e,t,i){this.path=t,this.parsedPath=i||tt.parseTrackName(t),this.node=tt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new tt.Composite(e,t,i):new tt(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Np,"")}static parseTrackName(e){const t=Gp.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=i.nodeName.substring(s+1);zp.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){const i=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=i(o.children);if(l)return l}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,i=t.objectName,s=t.propertyName;let r=t.propertyIndex;if(e||(e=tt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ee("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){Pe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Pe("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Pe("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Pe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Pe("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){Pe("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){Pe("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[s];if(a===void 0){const c=t.nodeName;Pe("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Pe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Pe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}tt.Composite=Vp;tt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};tt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};tt.prototype.GetterByBindingType=[tt.prototype._getValue_direct,tt.prototype._getValue_array,tt.prototype._getValue_arrayElement,tt.prototype._getValue_toArray];tt.prototype.SetterByBindingTypeAndVersioning=[[tt.prototype._setValue_direct,tt.prototype._setValue_direct_setNeedsUpdate,tt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[tt.prototype._setValue_array,tt.prototype._setValue_array_setNeedsUpdate,tt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[tt.prototype._setValue_arrayElement,tt.prototype._setValue_arrayElement_setNeedsUpdate,tt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[tt.prototype._setValue_fromArray,tt.prototype._setValue_fromArray_setNeedsUpdate,tt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Eh{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ze(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(ze(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Wp extends Hn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Ee("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Th(n,e,t,i){const s=Xp(i);switch(t){case Au:return n*e;case Ql:return n*e/s.components*s.byteLength;case Jl:return n*e/s.components*s.byteLength;case Ms:return n*e*2/s.components*s.byteLength;case $l:return n*e*2/s.components*s.byteLength;case wu:return n*e*3/s.components*s.byteLength;case qt:return n*e*4/s.components*s.byteLength;case ec:return n*e*4/s.components*s.byteLength;case da:case fa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case pa:case ma:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Yo:case Zo:return Math.max(n,16)*Math.max(e,8)/4;case jo:case Ko:return Math.max(n,8)*Math.max(e,8)/2;case Qo:case Jo:case el:case tl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case $o:case il:case nl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case sl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case rl:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case al:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case ol:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case ll:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case cl:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case hl:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case ul:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case dl:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case fl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case pl:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case ml:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case gl:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case _l:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case vl:case bl:case xl:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Sl:case Ml:return Math.ceil(n/4)*Math.ceil(e/4)*8;case yl:case El:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Xp(n){switch(n){case $t:case Mu:return{byteLength:1,components:1};case ar:case yu:case Gt:return{byteLength:2,components:1};case Kl:case Zl:return{byteLength:2,components:4};case Ui:case Yl:case si:return{byteLength:4,components:1};case Eu:case Tu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Gl}}));typeof window<"u"&&(window.__THREE__?Ee("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Gl);function Zu(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function qp(n){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const h=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const _=u[f];n.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var jp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Yp=`#ifdef USE_ALPHAHASH
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
#endif`,Kp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Zp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Qp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Jp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$p=`#ifdef USE_AOMAP
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
#endif`,em=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,tm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
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
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,im=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,nm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,sm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,rm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,am=`#ifdef USE_IRIDESCENCE
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
#endif`,om=`#ifdef USE_BUMPMAP
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
#endif`,lm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
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
	#endif
#endif`,cm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,hm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,um=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,dm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,fm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,pm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,mm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,gm=`#define PI 3.141592653589793
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
} // validated`,_m=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,vm=`vec3 transformedNormal = objectNormal;
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
#endif`,bm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,xm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Sm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Mm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ym="gl_FragColor = linearToOutputTexel( gl_FragColor );",Em=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Tm=`#ifdef USE_ENVMAP
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
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Am=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,wm=`#ifdef USE_ENVMAP
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
#endif`,Rm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Cm=`#ifdef USE_ENVMAP
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
#endif`,Pm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Dm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Lm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Im=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Um=`#ifdef USE_GRADIENTMAP
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
}`,Nm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Om=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Fm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Bm=`uniform bool receiveShadow;
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
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
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
#endif`,km=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
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
#endif`,Hm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Gm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,zm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Vm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Wm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
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
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
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
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
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
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
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
#endif`,Xm=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
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
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
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
		return v;
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
	vec3 f0 = material.specularColorBlended;
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
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
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
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
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
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
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
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
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
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,qm=`
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
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
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
#endif`,jm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
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
#endif`,Ym=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Km=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Zm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Jm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,$m=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,eg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,tg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,ig=`#if defined( USE_POINTS_UV )
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
#endif`,ng=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,sg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,rg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ag=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,og=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,cg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ug=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,dg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,mg=`#ifdef USE_NORMALMAP
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
#endif`,gg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,_g=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,vg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,bg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,xg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Sg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Mg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,yg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Eg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Tg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ag=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,wg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Rg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Cg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
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
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Pg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Dg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Lg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ig=`#ifdef USE_SKINNING
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
#endif`,Ug=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ng=`#ifdef USE_SKINNING
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
#endif`,Og=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Fg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Bg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,kg=`#ifndef saturate
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
vec3 CineonToneMapping( vec3 color ) {
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
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Hg=`#ifdef USE_TRANSMISSION
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
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Gg=`#ifdef USE_TRANSMISSION
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
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,zg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Vg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Wg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Xg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const qg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,jg=`uniform sampler2D t2D;
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
}`,Yg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Qg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jg=`#include <common>
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
	#include <morphinstance_vertex>
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
}`,$g=`#if DEPTH_PACKING == 3200
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
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,e_=`#define DISTANCE
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
	#include <morphinstance_vertex>
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
}`,t_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,i_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,n_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,s_=`uniform float scale;
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
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,r_=`uniform vec3 diffuse;
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
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,a_=`#include <common>
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
	#include <morphinstance_vertex>
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
}`,o_=`uniform vec3 diffuse;
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
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
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
}`,l_=`#define LAMBERT
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
	#include <morphinstance_vertex>
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
}`,c_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
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
}`,h_=`#define MATCAP
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
	#include <morphinstance_vertex>
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
}`,u_=`#define MATCAP
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
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
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
}`,d_=`#define NORMAL
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
	#include <morphinstance_vertex>
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
}`,f_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,p_=`#define PHONG
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
	#include <morphinstance_vertex>
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
}`,m_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
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
}`,g_=`#define STANDARD
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
	#include <morphinstance_vertex>
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
}`,__=`#define STANDARD
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
#ifdef USE_DISPERSION
	uniform float dispersion;
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
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
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
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
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
}`,v_=`#define TOON
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
	#include <morphinstance_vertex>
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
}`,b_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
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
}`,x_=`uniform float size;
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
	#include <morphinstance_vertex>
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
}`,S_=`uniform vec3 diffuse;
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
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
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
}`,M_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
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
}`,y_=`uniform vec3 color;
uniform float opacity;
#include <common>
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
	#include <premultiplied_alpha_fragment>
}`,E_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
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
}`,T_=`uniform vec3 diffuse;
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
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
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
}`,Fe={alphahash_fragment:jp,alphahash_pars_fragment:Yp,alphamap_fragment:Kp,alphamap_pars_fragment:Zp,alphatest_fragment:Qp,alphatest_pars_fragment:Jp,aomap_fragment:$p,aomap_pars_fragment:em,batching_pars_vertex:tm,batching_vertex:im,begin_vertex:nm,beginnormal_vertex:sm,bsdfs:rm,iridescence_fragment:am,bumpmap_pars_fragment:om,clipping_planes_fragment:lm,clipping_planes_pars_fragment:cm,clipping_planes_pars_vertex:hm,clipping_planes_vertex:um,color_fragment:dm,color_pars_fragment:fm,color_pars_vertex:pm,color_vertex:mm,common:gm,cube_uv_reflection_fragment:_m,defaultnormal_vertex:vm,displacementmap_pars_vertex:bm,displacementmap_vertex:xm,emissivemap_fragment:Sm,emissivemap_pars_fragment:Mm,colorspace_fragment:ym,colorspace_pars_fragment:Em,envmap_fragment:Tm,envmap_common_pars_fragment:Am,envmap_pars_fragment:wm,envmap_pars_vertex:Rm,envmap_physical_pars_fragment:km,envmap_vertex:Cm,fog_vertex:Pm,fog_pars_vertex:Dm,fog_fragment:Lm,fog_pars_fragment:Im,gradientmap_pars_fragment:Um,lightmap_pars_fragment:Nm,lights_lambert_fragment:Om,lights_lambert_pars_fragment:Fm,lights_pars_begin:Bm,lights_toon_fragment:Hm,lights_toon_pars_fragment:Gm,lights_phong_fragment:zm,lights_phong_pars_fragment:Vm,lights_physical_fragment:Wm,lights_physical_pars_fragment:Xm,lights_fragment_begin:qm,lights_fragment_maps:jm,lights_fragment_end:Ym,logdepthbuf_fragment:Km,logdepthbuf_pars_fragment:Zm,logdepthbuf_pars_vertex:Qm,logdepthbuf_vertex:Jm,map_fragment:$m,map_pars_fragment:eg,map_particle_fragment:tg,map_particle_pars_fragment:ig,metalnessmap_fragment:ng,metalnessmap_pars_fragment:sg,morphinstance_vertex:rg,morphcolor_vertex:ag,morphnormal_vertex:og,morphtarget_pars_vertex:lg,morphtarget_vertex:cg,normal_fragment_begin:hg,normal_fragment_maps:ug,normal_pars_fragment:dg,normal_pars_vertex:fg,normal_vertex:pg,normalmap_pars_fragment:mg,clearcoat_normal_fragment_begin:gg,clearcoat_normal_fragment_maps:_g,clearcoat_pars_fragment:vg,iridescence_pars_fragment:bg,opaque_fragment:xg,packing:Sg,premultiplied_alpha_fragment:Mg,project_vertex:yg,dithering_fragment:Eg,dithering_pars_fragment:Tg,roughnessmap_fragment:Ag,roughnessmap_pars_fragment:wg,shadowmap_pars_fragment:Rg,shadowmap_pars_vertex:Cg,shadowmap_vertex:Pg,shadowmask_pars_fragment:Dg,skinbase_vertex:Lg,skinning_pars_vertex:Ig,skinning_vertex:Ug,skinnormal_vertex:Ng,specularmap_fragment:Og,specularmap_pars_fragment:Fg,tonemapping_fragment:Bg,tonemapping_pars_fragment:kg,transmission_fragment:Hg,transmission_pars_fragment:Gg,uv_pars_fragment:zg,uv_pars_vertex:Vg,uv_vertex:Wg,worldpos_vertex:Xg,background_vert:qg,background_frag:jg,backgroundCube_vert:Yg,backgroundCube_frag:Kg,cube_vert:Zg,cube_frag:Qg,depth_vert:Jg,depth_frag:$g,distance_vert:e_,distance_frag:t_,equirect_vert:i_,equirect_frag:n_,linedashed_vert:s_,linedashed_frag:r_,meshbasic_vert:a_,meshbasic_frag:o_,meshlambert_vert:l_,meshlambert_frag:c_,meshmatcap_vert:h_,meshmatcap_frag:u_,meshnormal_vert:d_,meshnormal_frag:f_,meshphong_vert:p_,meshphong_frag:m_,meshphysical_vert:g_,meshphysical_frag:__,meshtoon_vert:v_,meshtoon_frag:b_,points_vert:x_,points_frag:S_,shadow_vert:M_,shadow_frag:y_,sprite_vert:E_,sprite_frag:T_},ae={common:{diffuse:{value:new Re(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ne}},envmap:{envMap:{value:null},envMapRotation:{value:new Ne},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ne},normalScale:{value:new Me(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Re(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Re(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0},uvTransform:{value:new Ne}},sprite:{diffuse:{value:new Re(16777215)},opacity:{value:1},center:{value:new Me(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}}},Ei={basic:{uniforms:kt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.fog]),vertexShader:Fe.meshbasic_vert,fragmentShader:Fe.meshbasic_frag},lambert:{uniforms:kt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new Re(0)},envMapIntensity:{value:1}}]),vertexShader:Fe.meshlambert_vert,fragmentShader:Fe.meshlambert_frag},phong:{uniforms:kt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new Re(0)},specular:{value:new Re(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Fe.meshphong_vert,fragmentShader:Fe.meshphong_frag},standard:{uniforms:kt([ae.common,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.roughnessmap,ae.metalnessmap,ae.fog,ae.lights,{emissive:{value:new Re(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag},toon:{uniforms:kt([ae.common,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.gradientmap,ae.fog,ae.lights,{emissive:{value:new Re(0)}}]),vertexShader:Fe.meshtoon_vert,fragmentShader:Fe.meshtoon_frag},matcap:{uniforms:kt([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,{matcap:{value:null}}]),vertexShader:Fe.meshmatcap_vert,fragmentShader:Fe.meshmatcap_frag},points:{uniforms:kt([ae.points,ae.fog]),vertexShader:Fe.points_vert,fragmentShader:Fe.points_frag},dashed:{uniforms:kt([ae.common,ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Fe.linedashed_vert,fragmentShader:Fe.linedashed_frag},depth:{uniforms:kt([ae.common,ae.displacementmap]),vertexShader:Fe.depth_vert,fragmentShader:Fe.depth_frag},normal:{uniforms:kt([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,{opacity:{value:1}}]),vertexShader:Fe.meshnormal_vert,fragmentShader:Fe.meshnormal_frag},sprite:{uniforms:kt([ae.sprite,ae.fog]),vertexShader:Fe.sprite_vert,fragmentShader:Fe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Fe.background_vert,fragmentShader:Fe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ne}},vertexShader:Fe.backgroundCube_vert,fragmentShader:Fe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Fe.cube_vert,fragmentShader:Fe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Fe.equirect_vert,fragmentShader:Fe.equirect_frag},distance:{uniforms:kt([ae.common,ae.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Fe.distance_vert,fragmentShader:Fe.distance_frag},shadow:{uniforms:kt([ae.lights,ae.fog,{color:{value:new Re(0)},opacity:{value:1}}]),vertexShader:Fe.shadow_vert,fragmentShader:Fe.shadow_frag}};Ei.physical={uniforms:kt([Ei.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ne},clearcoatNormalScale:{value:new Me(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ne},sheen:{value:0},sheenColor:{value:new Re(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ne},transmissionSamplerSize:{value:new Me},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ne},attenuationDistance:{value:0},attenuationColor:{value:new Re(0)},specularColor:{value:new Re(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ne},anisotropyVector:{value:new Me},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ne}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag};const Qr={r:0,b:0,g:0},En=new Ni,A_=new Be;function w_(n,e,t,i,s,r){const a=new Re(0);let o=s===!0?0:1,l,c,h=null,u=0,d=null;function f(b){let M=b.isScene===!0?b.background:null;if(M&&M.isTexture){const y=b.backgroundBlurriness>0;M=e.get(M,y)}return M}function g(b){let M=!1;const y=f(b);y===null?m(a,o):y&&y.isColor&&(m(y,1),M=!0);const A=n.xr.getEnvironmentBlendMode();A==="additive"?t.buffers.color.setClear(0,0,0,1,r):A==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||M)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function _(b,M){const y=f(M);y&&(y.isCubeTexture||y.mapping===Pa)?(c===void 0&&(c=new Wt(new Sr(1,1,1),new Et({name:"BackgroundCubeMaterial",uniforms:Es(Ei.backgroundCube.uniforms),vertexShader:Ei.backgroundCube.vertexShader,fragmentShader:Ei.backgroundCube.fragmentShader,side:jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,w,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),En.copy(M.backgroundRotation),En.x*=-1,En.y*=-1,En.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(En.y*=-1,En.z*=-1),c.material.uniforms.envMap.value=y,c.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(A_.makeRotationFromEuler(En)),c.material.toneMapped=We.getTransfer(y.colorSpace)!==Ze,(h!==y||u!==y.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,h=y,u=y.version,d=n.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Wt(new Mr(2,2),new Et({name:"BackgroundMaterial",uniforms:Es(Ei.background.uniforms),vertexShader:Ei.background.vertexShader,fragmentShader:Ei.background.fragmentShader,side:Ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=We.getTransfer(y.colorSpace)!==Ze,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||u!==y.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,h=y,u=y.version,d=n.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function m(b,M){b.getRGB(Qr,Vu(n)),t.buffers.color.setClear(Qr.r,Qr.g,Qr.b,M,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,M=1){a.set(b),o=M,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,m(a,o)},render:g,addToRenderList:_,dispose:p}}function R_(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let r=s,a=!1;function o(R,k,B,z,H){let N=!1;const O=u(R,z,B,k);r!==O&&(r=O,c(r.object)),N=f(R,z,B,H),N&&g(R,z,B,H),H!==null&&e.update(H,n.ELEMENT_ARRAY_BUFFER),(N||a)&&(a=!1,y(R,k,B,z),H!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return n.createVertexArray()}function c(R){return n.bindVertexArray(R)}function h(R){return n.deleteVertexArray(R)}function u(R,k,B,z){const H=z.wireframe===!0;let N=i[k.id];N===void 0&&(N={},i[k.id]=N);const O=R.isInstancedMesh===!0?R.id:0;let $=N[O];$===void 0&&($={},N[O]=$);let Z=$[B.id];Z===void 0&&(Z={},$[B.id]=Z);let ce=Z[H];return ce===void 0&&(ce=d(l()),Z[H]=ce),ce}function d(R){const k=[],B=[],z=[];for(let H=0;H<t;H++)k[H]=0,B[H]=0,z[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:k,enabledAttributes:B,attributeDivisors:z,object:R,attributes:{},index:null}}function f(R,k,B,z){const H=r.attributes,N=k.attributes;let O=0;const $=B.getAttributes();for(const Z in $)if($[Z].location>=0){const pe=H[Z];let ue=N[Z];if(ue===void 0&&(Z==="instanceMatrix"&&R.instanceMatrix&&(ue=R.instanceMatrix),Z==="instanceColor"&&R.instanceColor&&(ue=R.instanceColor)),pe===void 0||pe.attribute!==ue||ue&&pe.data!==ue.data)return!0;O++}return r.attributesNum!==O||r.index!==z}function g(R,k,B,z){const H={},N=k.attributes;let O=0;const $=B.getAttributes();for(const Z in $)if($[Z].location>=0){let pe=N[Z];pe===void 0&&(Z==="instanceMatrix"&&R.instanceMatrix&&(pe=R.instanceMatrix),Z==="instanceColor"&&R.instanceColor&&(pe=R.instanceColor));const ue={};ue.attribute=pe,pe&&pe.data&&(ue.data=pe.data),H[Z]=ue,O++}r.attributes=H,r.attributesNum=O,r.index=z}function _(){const R=r.newAttributes;for(let k=0,B=R.length;k<B;k++)R[k]=0}function m(R){p(R,0)}function p(R,k){const B=r.newAttributes,z=r.enabledAttributes,H=r.attributeDivisors;B[R]=1,z[R]===0&&(n.enableVertexAttribArray(R),z[R]=1),H[R]!==k&&(n.vertexAttribDivisor(R,k),H[R]=k)}function b(){const R=r.newAttributes,k=r.enabledAttributes;for(let B=0,z=k.length;B<z;B++)k[B]!==R[B]&&(n.disableVertexAttribArray(B),k[B]=0)}function M(R,k,B,z,H,N,O){O===!0?n.vertexAttribIPointer(R,k,B,H,N):n.vertexAttribPointer(R,k,B,z,H,N)}function y(R,k,B,z){_();const H=z.attributes,N=B.getAttributes(),O=k.defaultAttributeValues;for(const $ in N){const Z=N[$];if(Z.location>=0){let ce=H[$];if(ce===void 0&&($==="instanceMatrix"&&R.instanceMatrix&&(ce=R.instanceMatrix),$==="instanceColor"&&R.instanceColor&&(ce=R.instanceColor)),ce!==void 0){const pe=ce.normalized,ue=ce.itemSize,Oe=e.get(ce);if(Oe===void 0)continue;const dt=Oe.buffer,ct=Oe.type,Y=Oe.bytesPerElement,ie=ct===n.INT||ct===n.UNSIGNED_INT||ce.gpuType===Yl;if(ce.isInterleavedBufferAttribute){const re=ce.data,Ue=re.stride,we=ce.offset;if(re.isInstancedInterleavedBuffer){for(let De=0;De<Z.locationSize;De++)p(Z.location+De,re.meshPerAttribute);R.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let De=0;De<Z.locationSize;De++)m(Z.location+De);n.bindBuffer(n.ARRAY_BUFFER,dt);for(let De=0;De<Z.locationSize;De++)M(Z.location+De,ue/Z.locationSize,ct,pe,Ue*Y,(we+ue/Z.locationSize*De)*Y,ie)}else{if(ce.isInstancedBufferAttribute){for(let re=0;re<Z.locationSize;re++)p(Z.location+re,ce.meshPerAttribute);R.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let re=0;re<Z.locationSize;re++)m(Z.location+re);n.bindBuffer(n.ARRAY_BUFFER,dt);for(let re=0;re<Z.locationSize;re++)M(Z.location+re,ue/Z.locationSize,ct,pe,ue*Y,ue/Z.locationSize*re*Y,ie)}}else if(O!==void 0){const pe=O[$];if(pe!==void 0)switch(pe.length){case 2:n.vertexAttrib2fv(Z.location,pe);break;case 3:n.vertexAttrib3fv(Z.location,pe);break;case 4:n.vertexAttrib4fv(Z.location,pe);break;default:n.vertexAttrib1fv(Z.location,pe)}}}}b()}function A(){E();for(const R in i){const k=i[R];for(const B in k){const z=k[B];for(const H in z){const N=z[H];for(const O in N)h(N[O].object),delete N[O];delete z[H]}}delete i[R]}}function w(R){if(i[R.id]===void 0)return;const k=i[R.id];for(const B in k){const z=k[B];for(const H in z){const N=z[H];for(const O in N)h(N[O].object),delete N[O];delete z[H]}}delete i[R.id]}function C(R){for(const k in i){const B=i[k];for(const z in B){const H=B[z];if(H[R.id]===void 0)continue;const N=H[R.id];for(const O in N)h(N[O].object),delete N[O];delete H[R.id]}}}function x(R){for(const k in i){const B=i[k],z=R.isInstancedMesh===!0?R.id:0,H=B[z];if(H!==void 0){for(const N in H){const O=H[N];for(const $ in O)h(O[$].object),delete O[$];delete H[N]}delete B[z],Object.keys(B).length===0&&delete i[k]}}}function E(){W(),a=!0,r!==s&&(r=s,c(r.object))}function W(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:W,dispose:A,releaseStatesOfGeometry:w,releaseStatesOfObject:x,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:b}}function C_(n,e,t){let i;function s(c){i=c}function r(c,h){n.drawArrays(i,c,h),t.update(h,i,1)}function a(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),t.update(h,i,u))}function o(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];t.update(f,i,1)}function l(c,h,u,d){if(u===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)a(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];t.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function P_(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==qt&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const x=C===Gt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==$t&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==si&&!x)}function l(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Ee("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),b=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),M=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),A=n.getParameter(n.MAX_SAMPLES),w=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:b,maxVaryings:M,maxFragmentUniforms:y,maxSamples:A,samples:w}}function D_(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new cn,o=new Ne,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const b=r?0:i,M=b*4;let y=p.clippingState||null;l.value=y,y=h(g,d,M,f);for(let A=0;A!==M;++A)y[A]=t[A];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=f+_*4,b=d.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,y=f;M!==_;++M,y+=4)a.copy(u[M]).applyMatrix4(b,o),a.normal.toArray(m,y),m[y+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}const dn=4,Ah=[.125,.215,.35,.446,.526,.582],Cn=20,L_=256,Ws=new Ns,wh=new Re;let _o=null,vo=0,bo=0,xo=!1;const I_=new L;class Rh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=I_}=r;_o=this._renderer.getRenderTarget(),vo=this._renderer.getActiveCubeFace(),bo=this._renderer.getActiveMipmapLevel(),xo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Dh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ph(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(_o,vo,bo),this._renderer.xr.enabled=xo,e.scissorTest=!1,rs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===On||e.mapping===xs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_o=this._renderer.getRenderTarget(),vo=this._renderer.getActiveCubeFace(),bo=this._renderer.getActiveMipmapLevel(),xo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ft,minFilter:ft,generateMipmaps:!1,type:Gt,format:qt,colorSpace:Vt,depthBuffer:!1},s=Ch(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ch(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=U_(r)),this._blurMaterial=O_(r,e,t),this._ggxMaterial=N_(r,e,t)}return s}_compileMaterial(e){const t=new Wt(new ti,e);this._renderer.compile(t,Ws)}_sceneToCubeUV(e,t,i,s,r){const l=new Ht(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(wh),u.toneMapping=Di,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Wt(new Sr,new Ci({name:"PMREM.Background",side:jt,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let p=!1;const b=e.background;b?b.isColor&&(m.color.copy(b),e.background=null,p=!0):(m.color.copy(wh),p=!0);for(let M=0;M<6;M++){const y=M%3;y===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[M],r.y,r.z)):y===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[M]));const A=this._cubeSize;rs(s,y*A,M>2?A:0,A,A),u.setRenderTarget(s),p&&u.render(_,l),u.render(e,l)}u.toneMapping=f,u.autoClear=d,e.background=b}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===On||e.mapping===xs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Dh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ph());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;rs(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Ws)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=0+c*1.25,f=u*d,{_lodMax:g}=this,_=this._sizeLods[i],m=3*_*(i>g-dn?i-g+dn:0),p=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=g-t,rs(r,m,p,3*_,2*_),s.setRenderTarget(r),s.render(o,Ws),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-i,rs(e,m,p,3*_,2*_),s.setRenderTarget(e),s.render(o,Ws)}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Pe("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[s];u.material=c;const d=c.uniforms,f=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Cn-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Cn;m>Cn&&Ee(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Cn}`);const p=[];let b=0;for(let C=0;C<Cn;++C){const x=C/_,E=Math.exp(-x*x/2);p.push(E),C===0?b+=E:C<m&&(b+=2*E)}for(let C=0;C<p.length;C++)p[C]=p[C]/b;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:M}=this;d.dTheta.value=g,d.mipInt.value=M-i;const y=this._sizeLods[s],A=3*y*(s>M-dn?s-M+dn:0),w=4*(this._cubeSize-y);rs(t,A,w,3*y,2*y),l.setRenderTarget(t),l.render(u,Ws)}}function U_(n){const e=[],t=[],i=[];let s=n;const r=n-dn+1+Ah.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>n-dn?l=Ah[a-n+dn-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,b=new Float32Array(_*g*f),M=new Float32Array(m*g*f),y=new Float32Array(p*g*f);for(let w=0;w<f;w++){const C=w%3*2/3-1,x=w>2?0:-1,E=[C,x,0,C+2/3,x,0,C+2/3,x+1,0,C,x,0,C+2/3,x+1,0,C,x+1,0];b.set(E,_*g*w),M.set(d,m*g*w);const W=[w,w,w,w,w,w];y.set(W,p*g*w)}const A=new ti;A.setAttribute("position",new zt(b,_)),A.setAttribute("uv",new zt(M,m)),A.setAttribute("faceIndex",new zt(y,p)),i.push(new Wt(A,null)),s>dn&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function Ch(n,e,t){const i=new Lt(n,e,t);return i.texture.mapping=Pa,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function rs(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function N_(n,e,t){return new Et({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:L_,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:La(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Pi,depthTest:!1,depthWrite:!1})}function O_(n,e,t){const i=new Float32Array(Cn),s=new L(0,1,0);return new Et({name:"SphericalGaussianBlur",defines:{n:Cn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:La(),fragmentShader:`

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
		`,blending:Pi,depthTest:!1,depthWrite:!1})}function Ph(){return new Et({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:La(),fragmentShader:`

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
		`,blending:Pi,depthTest:!1,depthWrite:!1})}function Dh(){return new Et({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:La(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pi,depthTest:!1,depthWrite:!1})}function La(){return`

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
	`}class Qu extends Lt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Gu(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Sr(5,5,5),r=new Et({name:"CubemapFromEquirect",uniforms:Es(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:jt,blending:Pi});r.uniforms.tEquirect.value=t;const a=new Wt(s,r),o=t.minFilter;return t.minFilter===ji&&(t.minFilter=ft),new Dp(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}function F_(n){let e=new WeakMap,t=new WeakMap,i=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===Ha||f===Ga)if(e.has(d)){const g=e.get(d).texture;return o(g,d.mapping)}else{const g=d.image;if(g&&g.height>0){const _=new Qu(g.height);return _.fromEquirectangularTexture(n,d),e.set(d,_),d.addEventListener("dispose",c),o(_.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,g=f===Ha||f===Ga,_=f===On||f===xs;if(g||_){let m=t.get(d);const p=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return i===null&&(i=new Rh(n)),m=g?i.fromEquirectangular(d,m):i.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{const b=d.image;return g&&b&&b.height>0||_&&b&&l(b)?(i===null&&(i=new Rh(n)),m=g?i.fromEquirectangular(d):i.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function o(d,f){return f===Ha?d.mapping=On:f===Ga&&(d.mapping=xs),d}function l(d){let f=0;const g=6;for(let _=0;_<g;_++)d[_]!==void 0&&f++;return f===g}function c(d){const f=d.target;f.removeEventListener("dispose",c);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:u}}function B_(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Ma("WebGLRenderer: "+i+" extension not supported."),s}}}function k_(n,e,t,i){const s={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete s[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)e.update(d[f],n.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(g===void 0)return;if(f!==null){const b=f.array;_=f.version;for(let M=0,y=b.length;M<y;M+=3){const A=b[M+0],w=b[M+1],C=b[M+2];d.push(A,w,w,C,C,A)}}else{const b=g.array;_=g.version;for(let M=0,y=b.length/3-1;M<y;M+=3){const A=M+0,w=M+1,C=M+2;d.push(A,w,w,C,C,A)}}const m=new(g.count>=65535?Fu:Ou)(d,1);m.version=_;const p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function H_(n,e,t){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,f){n.drawElements(i,f,r,d*a),t.update(f,i,1)}function c(d,f,g){g!==0&&(n.drawElementsInstanced(i,f,r,d*a,g),t.update(f,i,g))}function h(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,i,1)}function u(d,f,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/a,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,r,d,0,_,0,g);let p=0;for(let b=0;b<g;b++)p+=f[b]*_[b];t.update(p,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function G_(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:Pe("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function z_(n,e,t){const i=new WeakMap,s=new ht;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==u){let E=function(){C.dispose(),i.delete(o),o.removeEventListener("dispose",E)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let M=0;f===!0&&(M=1),g===!0&&(M=2),_===!0&&(M=3);let y=o.attributes.position.count*M,A=1;y>e.maxTextureSize&&(A=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const w=new Float32Array(y*A*4*u),C=new Lu(w,y,A,u);C.type=si,C.needsUpdate=!0;const x=M*4;for(let W=0;W<u;W++){const R=m[W],k=p[W],B=b[W],z=y*A*4*W;for(let H=0;H<R.count;H++){const N=H*x;f===!0&&(s.fromBufferAttribute(R,H),w[z+N+0]=s.x,w[z+N+1]=s.y,w[z+N+2]=s.z,w[z+N+3]=0),g===!0&&(s.fromBufferAttribute(k,H),w[z+N+4]=s.x,w[z+N+5]=s.y,w[z+N+6]=s.z,w[z+N+7]=0),_===!0&&(s.fromBufferAttribute(B,H),w[z+N+8]=s.x,w[z+N+9]=s.y,w[z+N+10]=s.z,w[z+N+11]=B.itemSize===4?s.w:1)}}d={count:u,texture:C,size:new Me(y,A)},i.set(o,d),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];const g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function V_(n,e,t,i,s){let r=new WeakMap;function a(c){const h=s.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const W_={[zl]:"LINEAR_TONE_MAPPING",[Vl]:"REINHARD_TONE_MAPPING",[Wl]:"CINEON_TONE_MAPPING",[Ca]:"ACES_FILMIC_TONE_MAPPING",[ql]:"AGX_TONE_MAPPING",[jl]:"NEUTRAL_TONE_MAPPING",[Xl]:"CUSTOM_TONE_MAPPING"};function X_(n,e,t,i,s){const r=new Lt(e,t,{type:n,depthBuffer:i,stencilBuffer:s}),a=new Lt(e,t,{type:Gt,depthBuffer:!1,stencilBuffer:!1}),o=new ti;o.setAttribute("position",new ei([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new ei([0,2,0,0,2,0],2));const l=new Wu({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new Wt(o,l),h=new Ns(-1,1,1,-1,0,1);let u=null,d=null,f=!1,g,_=null,m=[],p=!1;this.setSize=function(b,M){r.setSize(b,M),a.setSize(b,M);for(let y=0;y<m.length;y++){const A=m[y];A.setSize&&A.setSize(b,M)}},this.setEffects=function(b){m=b,p=m.length>0&&m[0].isRenderPass===!0;const M=r.width,y=r.height;for(let A=0;A<m.length;A++){const w=m[A];w.setSize&&w.setSize(M,y)}},this.begin=function(b,M){if(f||b.toneMapping===Di&&m.length===0)return!1;if(_=M,M!==null){const y=M.width,A=M.height;(r.width!==y||r.height!==A)&&this.setSize(y,A)}return p===!1&&b.setRenderTarget(r),g=b.toneMapping,b.toneMapping=Di,!0},this.hasRenderPass=function(){return p},this.end=function(b,M){b.toneMapping=g,f=!0;let y=r,A=a;for(let w=0;w<m.length;w++){const C=m[w];if(C.enabled!==!1&&(C.render(b,A,y,M),C.needsSwap!==!1)){const x=y;y=A,A=x}}if(u!==b.outputColorSpace||d!==b.toneMapping){u=b.outputColorSpace,d=b.toneMapping,l.defines={},We.getTransfer(u)===Ze&&(l.defines.SRGB_TRANSFER="");const w=W_[d];w&&(l.defines[w]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=y.texture,b.setRenderTarget(_),b.render(c,h),_=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){r.dispose(),a.dispose(),o.dispose(),l.dispose()}}const Ju=new bt,Pl=new dr(1,1),$u=new Lu,ed=new If,td=new Gu,Lh=[],Ih=[],Uh=new Float32Array(16),Nh=new Float32Array(9),Oh=new Float32Array(4);function Os(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=Lh[s];if(r===void 0&&(r=new Float32Array(s),Lh[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function At(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function wt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Ia(n,e){let t=Ih[e];t===void 0&&(t=new Int32Array(e),Ih[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function q_(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function j_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;n.uniform2fv(this.addr,e),wt(t,e)}}function Y_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(At(t,e))return;n.uniform3fv(this.addr,e),wt(t,e)}}function K_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;n.uniform4fv(this.addr,e),wt(t,e)}}function Z_(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(At(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),wt(t,e)}else{if(At(t,i))return;Oh.set(i),n.uniformMatrix2fv(this.addr,!1,Oh),wt(t,i)}}function Q_(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(At(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),wt(t,e)}else{if(At(t,i))return;Nh.set(i),n.uniformMatrix3fv(this.addr,!1,Nh),wt(t,i)}}function J_(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(At(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),wt(t,e)}else{if(At(t,i))return;Uh.set(i),n.uniformMatrix4fv(this.addr,!1,Uh),wt(t,i)}}function $_(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function e0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;n.uniform2iv(this.addr,e),wt(t,e)}}function t0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;n.uniform3iv(this.addr,e),wt(t,e)}}function i0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;n.uniform4iv(this.addr,e),wt(t,e)}}function n0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function s0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;n.uniform2uiv(this.addr,e),wt(t,e)}}function r0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;n.uniform3uiv(this.addr,e),wt(t,e)}}function a0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;n.uniform4uiv(this.addr,e),wt(t,e)}}function o0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Pl.compareFunction=t.isReversedDepthBuffer()?ic:tc,r=Pl):r=Ju,t.setTexture2D(e||r,s)}function l0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||ed,s)}function c0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||td,s)}function h0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||$u,s)}function u0(n){switch(n){case 5126:return q_;case 35664:return j_;case 35665:return Y_;case 35666:return K_;case 35674:return Z_;case 35675:return Q_;case 35676:return J_;case 5124:case 35670:return $_;case 35667:case 35671:return e0;case 35668:case 35672:return t0;case 35669:case 35673:return i0;case 5125:return n0;case 36294:return s0;case 36295:return r0;case 36296:return a0;case 35678:case 36198:case 36298:case 36306:case 35682:return o0;case 35679:case 36299:case 36307:return l0;case 35680:case 36300:case 36308:case 36293:return c0;case 36289:case 36303:case 36311:case 36292:return h0}}function d0(n,e){n.uniform1fv(this.addr,e)}function f0(n,e){const t=Os(e,this.size,2);n.uniform2fv(this.addr,t)}function p0(n,e){const t=Os(e,this.size,3);n.uniform3fv(this.addr,t)}function m0(n,e){const t=Os(e,this.size,4);n.uniform4fv(this.addr,t)}function g0(n,e){const t=Os(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function _0(n,e){const t=Os(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function v0(n,e){const t=Os(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function b0(n,e){n.uniform1iv(this.addr,e)}function x0(n,e){n.uniform2iv(this.addr,e)}function S0(n,e){n.uniform3iv(this.addr,e)}function M0(n,e){n.uniform4iv(this.addr,e)}function y0(n,e){n.uniform1uiv(this.addr,e)}function E0(n,e){n.uniform2uiv(this.addr,e)}function T0(n,e){n.uniform3uiv(this.addr,e)}function A0(n,e){n.uniform4uiv(this.addr,e)}function w0(n,e,t){const i=this.cache,s=e.length,r=Ia(t,s);At(i,r)||(n.uniform1iv(this.addr,r),wt(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=Pl:a=Ju;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function R0(n,e,t){const i=this.cache,s=e.length,r=Ia(t,s);At(i,r)||(n.uniform1iv(this.addr,r),wt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||ed,r[a])}function C0(n,e,t){const i=this.cache,s=e.length,r=Ia(t,s);At(i,r)||(n.uniform1iv(this.addr,r),wt(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||td,r[a])}function P0(n,e,t){const i=this.cache,s=e.length,r=Ia(t,s);At(i,r)||(n.uniform1iv(this.addr,r),wt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||$u,r[a])}function D0(n){switch(n){case 5126:return d0;case 35664:return f0;case 35665:return p0;case 35666:return m0;case 35674:return g0;case 35675:return _0;case 35676:return v0;case 5124:case 35670:return b0;case 35667:case 35671:return x0;case 35668:case 35672:return S0;case 35669:case 35673:return M0;case 5125:return y0;case 36294:return E0;case 36295:return T0;case 36296:return A0;case 35678:case 36198:case 36298:case 36306:case 35682:return w0;case 35679:case 36299:case 36307:return R0;case 35680:case 36300:case 36308:case 36293:return C0;case 36289:case 36303:case 36311:case 36292:return P0}}class L0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=u0(t.type)}}class I0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=D0(t.type)}}class U0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const So=/(\w+)(\])?(\[|\.)?/g;function Fh(n,e){n.seq.push(e),n.map[e.id]=e}function N0(n,e,t){const i=n.name,s=i.length;for(So.lastIndex=0;;){const r=So.exec(i),a=So.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Fh(t,c===void 0?new L0(o,n,e):new I0(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new U0(o),Fh(t,u)),t=u}}}class ga{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);N0(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function Bh(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const O0=37297;let F0=0;function B0(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const kh=new Ne;function k0(n){We._getMatrix(kh,We.workingColorSpace,n);const e=`mat3( ${kh.elements.map(t=>t.toFixed(4))} )`;switch(We.getTransfer(n)){case xa:return[e,"LinearTransferOETF"];case Ze:return[e,"sRGBTransferOETF"];default:return Ee("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Hh(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+B0(n.getShaderSource(e),o)}else return r}function H0(n,e){const t=k0(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const G0={[zl]:"Linear",[Vl]:"Reinhard",[Wl]:"Cineon",[Ca]:"ACESFilmic",[ql]:"AgX",[jl]:"Neutral",[Xl]:"Custom"};function z0(n,e){const t=G0[e];return t===void 0?(Ee("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Jr=new L;function V0(){We.getLuminanceCoefficients(Jr);const n=Jr.x.toFixed(4),e=Jr.y.toFixed(4),t=Jr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function W0(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qs).join(`
`)}function X0(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function q0(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Qs(n){return n!==""}function Gh(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function zh(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const j0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Dl(n){return n.replace(j0,K0)}const Y0=new Map;function K0(n,e){let t=Fe[e];if(t===void 0){const i=Y0.get(e);if(i!==void 0)t=Fe[i],Ee('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Dl(t)}const Z0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vh(n){return n.replace(Z0,Q0)}function Q0(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Wh(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const J0={[ha]:"SHADOWMAP_TYPE_PCF",[Ks]:"SHADOWMAP_TYPE_VSM"};function $0(n){return J0[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const ev={[On]:"ENVMAP_TYPE_CUBE",[xs]:"ENVMAP_TYPE_CUBE",[Pa]:"ENVMAP_TYPE_CUBE_UV"};function tv(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":ev[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const iv={[xs]:"ENVMAP_MODE_REFRACTION"};function nv(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":iv[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const sv={[bu]:"ENVMAP_BLENDING_MULTIPLY",[jd]:"ENVMAP_BLENDING_MIX",[Yd]:"ENVMAP_BLENDING_ADD"};function rv(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":sv[n.combine]||"ENVMAP_BLENDING_NONE"}function av(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function ov(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=$0(t),c=tv(t),h=nv(t),u=rv(t),d=av(t),f=W0(t),g=X0(r),_=s.createProgram();let m,p,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Qs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Qs).join(`
`),p.length>0&&(p+=`
`)):(m=[Wh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qs).join(`
`),p=[Wh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Di?"#define TONE_MAPPING":"",t.toneMapping!==Di?Fe.tonemapping_pars_fragment:"",t.toneMapping!==Di?z0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Fe.colorspace_pars_fragment,H0("linearToOutputTexel",t.outputColorSpace),V0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Qs).join(`
`)),a=Dl(a),a=Gh(a,t),a=zh(a,t),o=Dl(o),o=Gh(o,t),o=zh(o,t),a=Vh(a),o=Vh(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Gc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Gc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const M=b+m+a,y=b+p+o,A=Bh(s,s.VERTEX_SHADER,M),w=Bh(s,s.FRAGMENT_SHADER,y);s.attachShader(_,A),s.attachShader(_,w),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(R){if(n.debug.checkShaderErrors){const k=s.getProgramInfoLog(_)||"",B=s.getShaderInfoLog(A)||"",z=s.getShaderInfoLog(w)||"",H=k.trim(),N=B.trim(),O=z.trim();let $=!0,Z=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if($=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,A,w);else{const ce=Hh(s,A,"vertex"),pe=Hh(s,w,"fragment");Pe("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+H+`
`+ce+`
`+pe)}else H!==""?Ee("WebGLProgram: Program Info Log:",H):(N===""||O==="")&&(Z=!1);Z&&(R.diagnostics={runnable:$,programLog:H,vertexShader:{log:N,prefix:m},fragmentShader:{log:O,prefix:p}})}s.deleteShader(A),s.deleteShader(w),x=new ga(s,_),E=q0(s,_)}let x;this.getUniforms=function(){return x===void 0&&C(this),x};let E;this.getAttributes=function(){return E===void 0&&C(this),E};let W=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return W===!1&&(W=s.getProgramParameter(_,O0)),W},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=F0++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=A,this.fragmentShader=w,this}let lv=0;class cv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new hv(e),t.set(e,i)),i}}class hv{constructor(e){this.id=lv++,this.code=e,this.usedTimes=0}}function uv(n,e,t,i,s,r){const a=new Iu,o=new cv,l=new Set,c=[],h=new Map,u=i.logarithmicDepthBuffer;let d=i.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return l.add(x),x===0?"uv":`uv${x}`}function _(x,E,W,R,k){const B=R.fog,z=k.geometry,H=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?R.environment:null,N=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,O=e.get(x.envMap||H,N),$=O&&O.mapping===Pa?O.image.height:null,Z=f[x.type];x.precision!==null&&(d=i.getMaxPrecision(x.precision),d!==x.precision&&Ee("WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));const ce=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,pe=ce!==void 0?ce.length:0;let ue=0;z.morphAttributes.position!==void 0&&(ue=1),z.morphAttributes.normal!==void 0&&(ue=2),z.morphAttributes.color!==void 0&&(ue=3);let Oe,dt,ct,Y;if(Z){const Je=Ei[Z];Oe=Je.vertexShader,dt=Je.fragmentShader}else Oe=x.vertexShader,dt=x.fragmentShader,o.update(x),ct=o.getVertexShaderID(x),Y=o.getFragmentShaderID(x);const ie=n.getRenderTarget(),re=n.state.buffers.depth.getReversed(),Ue=k.isInstancedMesh===!0,we=k.isBatchedMesh===!0,De=!!x.map,Rt=!!x.matcap,qe=!!O,Qe=!!x.aoMap,rt=!!x.lightMap,ke=!!x.bumpMap,gt=!!x.normalMap,P=!!x.displacementMap,St=!!x.emissiveMap,Ke=!!x.metalnessMap,ot=!!x.roughnessMap,xe=x.anisotropy>0,T=x.clearcoat>0,v=x.dispersion>0,I=x.iridescence>0,j=x.sheen>0,K=x.transmission>0,q=xe&&!!x.anisotropyMap,me=T&&!!x.clearcoatMap,ne=T&&!!x.clearcoatNormalMap,Ae=T&&!!x.clearcoatRoughnessMap,Ce=I&&!!x.iridescenceMap,Q=I&&!!x.iridescenceThicknessMap,ee=j&&!!x.sheenColorMap,ge=j&&!!x.sheenRoughnessMap,ve=!!x.specularMap,he=!!x.specularColorMap,He=!!x.specularIntensityMap,D=K&&!!x.transmissionMap,se=K&&!!x.thicknessMap,te=!!x.gradientMap,fe=!!x.alphaMap,J=x.alphaTest>0,X=!!x.alphaHash,_e=!!x.extensions;let Le=Di;x.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(Le=n.toneMapping);const lt={shaderID:Z,shaderType:x.type,shaderName:x.name,vertexShader:Oe,fragmentShader:dt,defines:x.defines,customVertexShaderID:ct,customFragmentShaderID:Y,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:we,batchingColor:we&&k._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&k.instanceColor!==null,instancingMorph:Ue&&k.morphTexture!==null,outputColorSpace:ie===null?n.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:Vt,alphaToCoverage:!!x.alphaToCoverage,map:De,matcap:Rt,envMap:qe,envMapMode:qe&&O.mapping,envMapCubeUVHeight:$,aoMap:Qe,lightMap:rt,bumpMap:ke,normalMap:gt,displacementMap:P,emissiveMap:St,normalMapObjectSpace:gt&&x.normalMapType===$d,normalMapTangentSpace:gt&&x.normalMapType===Cu,metalnessMap:Ke,roughnessMap:ot,anisotropy:xe,anisotropyMap:q,clearcoat:T,clearcoatMap:me,clearcoatNormalMap:ne,clearcoatRoughnessMap:Ae,dispersion:v,iridescence:I,iridescenceMap:Ce,iridescenceThicknessMap:Q,sheen:j,sheenColorMap:ee,sheenRoughnessMap:ge,specularMap:ve,specularColorMap:he,specularIntensityMap:He,transmission:K,transmissionMap:D,thicknessMap:se,gradientMap:te,opaque:x.transparent===!1&&x.blending===gs&&x.alphaToCoverage===!1,alphaMap:fe,alphaTest:J,alphaHash:X,combine:x.combine,mapUv:De&&g(x.map.channel),aoMapUv:Qe&&g(x.aoMap.channel),lightMapUv:rt&&g(x.lightMap.channel),bumpMapUv:ke&&g(x.bumpMap.channel),normalMapUv:gt&&g(x.normalMap.channel),displacementMapUv:P&&g(x.displacementMap.channel),emissiveMapUv:St&&g(x.emissiveMap.channel),metalnessMapUv:Ke&&g(x.metalnessMap.channel),roughnessMapUv:ot&&g(x.roughnessMap.channel),anisotropyMapUv:q&&g(x.anisotropyMap.channel),clearcoatMapUv:me&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:ne&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ae&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:ee&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:ge&&g(x.sheenRoughnessMap.channel),specularMapUv:ve&&g(x.specularMap.channel),specularColorMapUv:he&&g(x.specularColorMap.channel),specularIntensityMapUv:He&&g(x.specularIntensityMap.channel),transmissionMapUv:D&&g(x.transmissionMap.channel),thicknessMapUv:se&&g(x.thicknessMap.channel),alphaMapUv:fe&&g(x.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(gt||xe),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!z.attributes.uv&&(De||fe),fog:!!B,useFog:x.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||z.attributes.normal===void 0&&gt===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:re,skinning:k.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:pe,morphTextureStride:ue,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&W.length>0,shadowMapType:n.shadowMap.type,toneMapping:Le,decodeVideoTexture:De&&x.map.isVideoTexture===!0&&We.getTransfer(x.map.colorSpace)===Ze,decodeVideoTextureEmissive:St&&x.emissiveMap.isVideoTexture===!0&&We.getTransfer(x.emissiveMap.colorSpace)===Ze,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Ai,flipSided:x.side===jt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:_e&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(_e&&x.extensions.multiDraw===!0||we)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return lt.vertexUv1s=l.has(1),lt.vertexUv2s=l.has(2),lt.vertexUv3s=l.has(3),l.clear(),lt}function m(x){const E=[];if(x.shaderID?E.push(x.shaderID):(E.push(x.customVertexShaderID),E.push(x.customFragmentShaderID)),x.defines!==void 0)for(const W in x.defines)E.push(W),E.push(x.defines[W]);return x.isRawShaderMaterial===!1&&(p(E,x),b(E,x),E.push(n.outputColorSpace)),E.push(x.customProgramCacheKey),E.join()}function p(x,E){x.push(E.precision),x.push(E.outputColorSpace),x.push(E.envMapMode),x.push(E.envMapCubeUVHeight),x.push(E.mapUv),x.push(E.alphaMapUv),x.push(E.lightMapUv),x.push(E.aoMapUv),x.push(E.bumpMapUv),x.push(E.normalMapUv),x.push(E.displacementMapUv),x.push(E.emissiveMapUv),x.push(E.metalnessMapUv),x.push(E.roughnessMapUv),x.push(E.anisotropyMapUv),x.push(E.clearcoatMapUv),x.push(E.clearcoatNormalMapUv),x.push(E.clearcoatRoughnessMapUv),x.push(E.iridescenceMapUv),x.push(E.iridescenceThicknessMapUv),x.push(E.sheenColorMapUv),x.push(E.sheenRoughnessMapUv),x.push(E.specularMapUv),x.push(E.specularColorMapUv),x.push(E.specularIntensityMapUv),x.push(E.transmissionMapUv),x.push(E.thicknessMapUv),x.push(E.combine),x.push(E.fogExp2),x.push(E.sizeAttenuation),x.push(E.morphTargetsCount),x.push(E.morphAttributeCount),x.push(E.numDirLights),x.push(E.numPointLights),x.push(E.numSpotLights),x.push(E.numSpotLightMaps),x.push(E.numHemiLights),x.push(E.numRectAreaLights),x.push(E.numDirLightShadows),x.push(E.numPointLightShadows),x.push(E.numSpotLightShadows),x.push(E.numSpotLightShadowsWithMaps),x.push(E.numLightProbes),x.push(E.shadowMapType),x.push(E.toneMapping),x.push(E.numClippingPlanes),x.push(E.numClipIntersection),x.push(E.depthPacking)}function b(x,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),x.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),x.push(a.mask)}function M(x){const E=f[x.type];let W;if(E){const R=Ei[E];W=fn.clone(R.uniforms)}else W=x.uniforms;return W}function y(x,E){let W=h.get(E);return W!==void 0?++W.usedTimes:(W=new ov(n,E,x,s),c.push(W),h.set(E,W)),W}function A(x){if(--x.usedTimes===0){const E=c.indexOf(x);c[E]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function w(x){o.remove(x)}function C(){o.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:M,acquireProgram:y,releaseProgram:A,releaseShaderCache:w,programs:c,dispose:C}}function dv(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function fv(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Xh(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function qh(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,g,_,m,p){let b=n[e];return b===void 0?(b={id:d.id,object:d,geometry:f,material:g,materialVariant:a(d),groupOrder:_,renderOrder:d.renderOrder,z:m,group:p},n[e]=b):(b.id=d.id,b.object=d,b.geometry=f,b.material=g,b.materialVariant=a(d),b.groupOrder=_,b.renderOrder=d.renderOrder,b.z=m,b.group=p),e++,b}function l(d,f,g,_,m,p){const b=o(d,f,g,_,m,p);g.transmission>0?i.push(b):g.transparent===!0?s.push(b):t.push(b)}function c(d,f,g,_,m,p){const b=o(d,f,g,_,m,p);g.transmission>0?i.unshift(b):g.transparent===!0?s.unshift(b):t.unshift(b)}function h(d,f){t.length>1&&t.sort(d||fv),i.length>1&&i.sort(f||Xh),s.length>1&&s.sort(f||Xh)}function u(){for(let d=e,f=n.length;d<f;d++){const g=n[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function pv(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new qh,n.set(i,[a])):s>=r.length?(a=new qh,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function mv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new Re};break;case"SpotLight":t={position:new L,direction:new L,color:new Re,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new Re,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new Re,groundColor:new Re};break;case"RectAreaLight":t={color:new Re,position:new L,halfWidth:new L,halfHeight:new L};break}return n[e.id]=t,t}}}function gv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let _v=0;function vv(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function bv(n){const e=new mv,t=gv(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new L);const s=new L,r=new Be,a=new Be;function o(c){let h=0,u=0,d=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,b=0,M=0,y=0,A=0,w=0,C=0;c.sort(vv);for(let E=0,W=c.length;E<W;E++){const R=c[E],k=R.color,B=R.intensity,z=R.distance;let H=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===Ms?H=R.shadow.map.texture:H=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)h+=k.r*B,u+=k.g*B,d+=k.b*B;else if(R.isLightProbe){for(let N=0;N<9;N++)i.probe[N].addScaledVector(R.sh.coefficients[N],B);C++}else if(R.isDirectionalLight){const N=e.get(R);if(N.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const O=R.shadow,$=t.get(R);$.shadowIntensity=O.intensity,$.shadowBias=O.bias,$.shadowNormalBias=O.normalBias,$.shadowRadius=O.radius,$.shadowMapSize=O.mapSize,i.directionalShadow[f]=$,i.directionalShadowMap[f]=H,i.directionalShadowMatrix[f]=R.shadow.matrix,b++}i.directional[f]=N,f++}else if(R.isSpotLight){const N=e.get(R);N.position.setFromMatrixPosition(R.matrixWorld),N.color.copy(k).multiplyScalar(B),N.distance=z,N.coneCos=Math.cos(R.angle),N.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),N.decay=R.decay,i.spot[_]=N;const O=R.shadow;if(R.map&&(i.spotLightMap[A]=R.map,A++,O.updateMatrices(R),R.castShadow&&w++),i.spotLightMatrix[_]=O.matrix,R.castShadow){const $=t.get(R);$.shadowIntensity=O.intensity,$.shadowBias=O.bias,$.shadowNormalBias=O.normalBias,$.shadowRadius=O.radius,$.shadowMapSize=O.mapSize,i.spotShadow[_]=$,i.spotShadowMap[_]=H,y++}_++}else if(R.isRectAreaLight){const N=e.get(R);N.color.copy(k).multiplyScalar(B),N.halfWidth.set(R.width*.5,0,0),N.halfHeight.set(0,R.height*.5,0),i.rectArea[m]=N,m++}else if(R.isPointLight){const N=e.get(R);if(N.color.copy(R.color).multiplyScalar(R.intensity),N.distance=R.distance,N.decay=R.decay,R.castShadow){const O=R.shadow,$=t.get(R);$.shadowIntensity=O.intensity,$.shadowBias=O.bias,$.shadowNormalBias=O.normalBias,$.shadowRadius=O.radius,$.shadowMapSize=O.mapSize,$.shadowCameraNear=O.camera.near,$.shadowCameraFar=O.camera.far,i.pointShadow[g]=$,i.pointShadowMap[g]=H,i.pointShadowMatrix[g]=R.shadow.matrix,M++}i.point[g]=N,g++}else if(R.isHemisphereLight){const N=e.get(R);N.skyColor.copy(R.color).multiplyScalar(B),N.groundColor.copy(R.groundColor).multiplyScalar(B),i.hemi[p]=N,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ae.LTC_FLOAT_1,i.rectAreaLTC2=ae.LTC_FLOAT_2):(i.rectAreaLTC1=ae.LTC_HALF_1,i.rectAreaLTC2=ae.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const x=i.hash;(x.directionalLength!==f||x.pointLength!==g||x.spotLength!==_||x.rectAreaLength!==m||x.hemiLength!==p||x.numDirectionalShadows!==b||x.numPointShadows!==M||x.numSpotShadows!==y||x.numSpotMaps!==A||x.numLightProbes!==C)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=y+A-w,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=C,x.directionalLength=f,x.pointLength=g,x.spotLength=_,x.rectAreaLength=m,x.hemiLength=p,x.numDirectionalShadows=b,x.numPointShadows=M,x.numSpotShadows=y,x.numSpotMaps=A,x.numLightProbes=C,i.version=_v++)}function l(c,h){let u=0,d=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,b=c.length;p<b;p++){const M=c[p];if(M.isDirectionalLight){const y=i.directional[u];y.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(M.isSpotLight){const y=i.spot[f];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),f++}else if(M.isRectAreaLight){const y=i.rectArea[g];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),a.identity(),r.copy(M.matrixWorld),r.premultiply(m),a.extractRotation(r),y.halfWidth.set(M.width*.5,0,0),y.halfHeight.set(0,M.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),g++}else if(M.isPointLight){const y=i.point[d];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),d++}else if(M.isHemisphereLight){const y=i.hemi[_];y.direction.setFromMatrixPosition(M.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:i}}function jh(n){const e=new bv(n),t=[],i=[];function s(h){c.camera=h,t.length=0,i.length=0}function r(h){t.push(h)}function a(h){i.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function xv(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new jh(n),e.set(s,[o])):r>=a.length?(o=new jh(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const Sv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Mv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,yv=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],Ev=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],Yh=new Be,Xs=new L,Mo=new L;function Tv(n,e,t){let i=new lc;const s=new Me,r=new Me,a=new ht,o=new cp,l=new hp,c={},h=t.maxTextureSize,u={[Ii]:jt,[jt]:Ii,[Ai]:Ai},d=new Et({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Me},radius:{value:4}},vertexShader:Sv,fragmentShader:Mv}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new ti;g.setAttribute("position",new zt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Wt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ha;let p=this.type;this.render=function(w,C,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;this.type===Rd&&(Ee("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=ha);const E=n.getRenderTarget(),W=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),k=n.state;k.setBlending(Pi),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const B=p!==this.type;B&&C.traverse(function(z){z.material&&(Array.isArray(z.material)?z.material.forEach(H=>H.needsUpdate=!0):z.material.needsUpdate=!0)});for(let z=0,H=w.length;z<H;z++){const N=w[z],O=N.shadow;if(O===void 0){Ee("WebGLShadowMap:",N,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;s.copy(O.mapSize);const $=O.getFrameExtents();s.multiply($),r.copy(O.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/$.x),s.x=r.x*$.x,O.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/$.y),s.y=r.y*$.y,O.mapSize.y=r.y));const Z=n.state.buffers.depth.getReversed();if(O.camera._reversedDepth=Z,O.map===null||B===!0){if(O.map!==null&&(O.map.depthTexture!==null&&(O.map.depthTexture.dispose(),O.map.depthTexture=null),O.map.dispose()),this.type===Ks){if(N.isPointLight){Ee("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}O.map=new Lt(s.x,s.y,{format:Ms,type:Gt,minFilter:ft,magFilter:ft,generateMipmaps:!1}),O.map.texture.name=N.name+".shadowMap",O.map.depthTexture=new dr(s.x,s.y,si),O.map.depthTexture.name=N.name+".shadowMapDepth",O.map.depthTexture.format=Qi,O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=vt,O.map.depthTexture.magFilter=vt}else N.isPointLight?(O.map=new Qu(s.x),O.map.depthTexture=new rp(s.x,Ui)):(O.map=new Lt(s.x,s.y),O.map.depthTexture=new dr(s.x,s.y,Ui)),O.map.depthTexture.name=N.name+".shadowMap",O.map.depthTexture.format=Qi,this.type===ha?(O.map.depthTexture.compareFunction=Z?ic:tc,O.map.depthTexture.minFilter=ft,O.map.depthTexture.magFilter=ft):(O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=vt,O.map.depthTexture.magFilter=vt);O.camera.updateProjectionMatrix()}const ce=O.map.isWebGLCubeRenderTarget?6:1;for(let pe=0;pe<ce;pe++){if(O.map.isWebGLCubeRenderTarget)n.setRenderTarget(O.map,pe),n.clear();else{pe===0&&(n.setRenderTarget(O.map),n.clear());const ue=O.getViewport(pe);a.set(r.x*ue.x,r.y*ue.y,r.x*ue.z,r.y*ue.w),k.viewport(a)}if(N.isPointLight){const ue=O.camera,Oe=O.matrix,dt=N.distance||ue.far;dt!==ue.far&&(ue.far=dt,ue.updateProjectionMatrix()),Xs.setFromMatrixPosition(N.matrixWorld),ue.position.copy(Xs),Mo.copy(ue.position),Mo.add(yv[pe]),ue.up.copy(Ev[pe]),ue.lookAt(Mo),ue.updateMatrixWorld(),Oe.makeTranslation(-Xs.x,-Xs.y,-Xs.z),Yh.multiplyMatrices(ue.projectionMatrix,ue.matrixWorldInverse),O._frustum.setFromProjectionMatrix(Yh,ue.coordinateSystem,ue.reversedDepth)}else O.updateMatrices(N);i=O.getFrustum(),y(C,x,O.camera,N,this.type)}O.isPointLightShadow!==!0&&this.type===Ks&&b(O,x),O.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(E,W,R)};function b(w,C){const x=e.update(_);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Lt(s.x,s.y,{format:Ms,type:Gt})),d.uniforms.shadow_pass.value=w.map.depthTexture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(C,null,x,d,_,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(C,null,x,f,_,null)}function M(w,C,x,E){let W=null;const R=x.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(R!==void 0)W=R;else if(W=x.isPointLight===!0?l:o,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const k=W.uuid,B=C.uuid;let z=c[k];z===void 0&&(z={},c[k]=z);let H=z[B];H===void 0&&(H=W.clone(),z[B]=H,C.addEventListener("dispose",A)),W=H}if(W.visible=C.visible,W.wireframe=C.wireframe,E===Ks?W.side=C.shadowSide!==null?C.shadowSide:C.side:W.side=C.shadowSide!==null?C.shadowSide:u[C.side],W.alphaMap=C.alphaMap,W.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,W.map=C.map,W.clipShadows=C.clipShadows,W.clippingPlanes=C.clippingPlanes,W.clipIntersection=C.clipIntersection,W.displacementMap=C.displacementMap,W.displacementScale=C.displacementScale,W.displacementBias=C.displacementBias,W.wireframeLinewidth=C.wireframeLinewidth,W.linewidth=C.linewidth,x.isPointLight===!0&&W.isMeshDistanceMaterial===!0){const k=n.properties.get(W);k.light=x}return W}function y(w,C,x,E,W){if(w.visible===!1)return;if(w.layers.test(C.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&W===Ks)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,w.matrixWorld);const B=e.update(w),z=w.material;if(Array.isArray(z)){const H=B.groups;for(let N=0,O=H.length;N<O;N++){const $=H[N],Z=z[$.materialIndex];if(Z&&Z.visible){const ce=M(w,Z,E,W);w.onBeforeShadow(n,w,C,x,B,ce,$),n.renderBufferDirect(x,null,B,ce,w,$),w.onAfterShadow(n,w,C,x,B,ce,$)}}}else if(z.visible){const H=M(w,z,E,W);w.onBeforeShadow(n,w,C,x,B,H,null),n.renderBufferDirect(x,null,B,H,w,null),w.onAfterShadow(n,w,C,x,B,H,null)}}const k=w.children;for(let B=0,z=k.length;B<z;B++)y(k[B],C,x,E,W)}function A(w){w.target.removeEventListener("dispose",A);for(const x in c){const E=c[x],W=w.target.uuid;W in E&&(E[W].dispose(),delete E[W])}}}function Av(n,e){function t(){let D=!1;const se=new ht;let te=null;const fe=new ht(0,0,0,0);return{setMask:function(J){te!==J&&!D&&(n.colorMask(J,J,J,J),te=J)},setLocked:function(J){D=J},setClear:function(J,X,_e,Le,lt){lt===!0&&(J*=Le,X*=Le,_e*=Le),se.set(J,X,_e,Le),fe.equals(se)===!1&&(n.clearColor(J,X,_e,Le),fe.copy(se))},reset:function(){D=!1,te=null,fe.set(-1,0,0,0)}}}function i(){let D=!1,se=!1,te=null,fe=null,J=null;return{setReversed:function(X){if(se!==X){const _e=e.get("EXT_clip_control");X?_e.clipControlEXT(_e.LOWER_LEFT_EXT,_e.ZERO_TO_ONE_EXT):_e.clipControlEXT(_e.LOWER_LEFT_EXT,_e.NEGATIVE_ONE_TO_ONE_EXT),se=X;const Le=J;J=null,this.setClear(Le)}},getReversed:function(){return se},setTest:function(X){X?ie(n.DEPTH_TEST):re(n.DEPTH_TEST)},setMask:function(X){te!==X&&!D&&(n.depthMask(X),te=X)},setFunc:function(X){if(se&&(X=uf[X]),fe!==X){switch(X){case Ho:n.depthFunc(n.NEVER);break;case Go:n.depthFunc(n.ALWAYS);break;case zo:n.depthFunc(n.LESS);break;case bs:n.depthFunc(n.LEQUAL);break;case Vo:n.depthFunc(n.EQUAL);break;case Wo:n.depthFunc(n.GEQUAL);break;case Xo:n.depthFunc(n.GREATER);break;case qo:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}fe=X}},setLocked:function(X){D=X},setClear:function(X){J!==X&&(J=X,se&&(X=1-X),n.clearDepth(X))},reset:function(){D=!1,te=null,fe=null,J=null,se=!1}}}function s(){let D=!1,se=null,te=null,fe=null,J=null,X=null,_e=null,Le=null,lt=null;return{setTest:function(Je){D||(Je?ie(n.STENCIL_TEST):re(n.STENCIL_TEST))},setMask:function(Je){se!==Je&&!D&&(n.stencilMask(Je),se=Je)},setFunc:function(Je,Bi,ki){(te!==Je||fe!==Bi||J!==ki)&&(n.stencilFunc(Je,Bi,ki),te=Je,fe=Bi,J=ki)},setOp:function(Je,Bi,ki){(X!==Je||_e!==Bi||Le!==ki)&&(n.stencilOp(Je,Bi,ki),X=Je,_e=Bi,Le=ki)},setLocked:function(Je){D=Je},setClear:function(Je){lt!==Je&&(n.clearStencil(Je),lt=Je)},reset:function(){D=!1,se=null,te=null,fe=null,J=null,X=null,_e=null,Le=null,lt=null}}}const r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,b=null,M=null,y=null,A=null,w=null,C=new Re(0,0,0),x=0,E=!1,W=null,R=null,k=null,B=null,z=null;const H=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let N=!1,O=0;const $=n.getParameter(n.VERSION);$.indexOf("WebGL")!==-1?(O=parseFloat(/^WebGL (\d)/.exec($)[1]),N=O>=1):$.indexOf("OpenGL ES")!==-1&&(O=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),N=O>=2);let Z=null,ce={};const pe=n.getParameter(n.SCISSOR_BOX),ue=n.getParameter(n.VIEWPORT),Oe=new ht().fromArray(pe),dt=new ht().fromArray(ue);function ct(D,se,te,fe){const J=new Uint8Array(4),X=n.createTexture();n.bindTexture(D,X),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let _e=0;_e<te;_e++)D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY?n.texImage3D(se,0,n.RGBA,1,1,fe,0,n.RGBA,n.UNSIGNED_BYTE,J):n.texImage2D(se+_e,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,J);return X}const Y={};Y[n.TEXTURE_2D]=ct(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=ct(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=ct(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=ct(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ie(n.DEPTH_TEST),a.setFunc(bs),ke(!1),gt(Lc),ie(n.CULL_FACE),Qe(Pi);function ie(D){h[D]!==!0&&(n.enable(D),h[D]=!0)}function re(D){h[D]!==!1&&(n.disable(D),h[D]=!1)}function Ue(D,se){return u[D]!==se?(n.bindFramebuffer(D,se),u[D]=se,D===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=se),D===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=se),!0):!1}function we(D,se){let te=f,fe=!1;if(D){te=d.get(se),te===void 0&&(te=[],d.set(se,te));const J=D.textures;if(te.length!==J.length||te[0]!==n.COLOR_ATTACHMENT0){for(let X=0,_e=J.length;X<_e;X++)te[X]=n.COLOR_ATTACHMENT0+X;te.length=J.length,fe=!0}}else te[0]!==n.BACK&&(te[0]=n.BACK,fe=!0);fe&&n.drawBuffers(te)}function De(D){return g!==D?(n.useProgram(D),g=D,!0):!1}const Rt={[Rn]:n.FUNC_ADD,[Pd]:n.FUNC_SUBTRACT,[Dd]:n.FUNC_REVERSE_SUBTRACT};Rt[Ld]=n.MIN,Rt[Id]=n.MAX;const qe={[Ud]:n.ZERO,[Nd]:n.ONE,[Od]:n.SRC_COLOR,[Bo]:n.SRC_ALPHA,[zd]:n.SRC_ALPHA_SATURATE,[Hd]:n.DST_COLOR,[Bd]:n.DST_ALPHA,[Fd]:n.ONE_MINUS_SRC_COLOR,[ko]:n.ONE_MINUS_SRC_ALPHA,[Gd]:n.ONE_MINUS_DST_COLOR,[kd]:n.ONE_MINUS_DST_ALPHA,[Vd]:n.CONSTANT_COLOR,[Wd]:n.ONE_MINUS_CONSTANT_COLOR,[Xd]:n.CONSTANT_ALPHA,[qd]:n.ONE_MINUS_CONSTANT_ALPHA};function Qe(D,se,te,fe,J,X,_e,Le,lt,Je){if(D===Pi){_===!0&&(re(n.BLEND),_=!1);return}if(_===!1&&(ie(n.BLEND),_=!0),D!==Cd){if(D!==m||Je!==E){if((p!==Rn||y!==Rn)&&(n.blendEquation(n.FUNC_ADD),p=Rn,y=Rn),Je)switch(D){case gs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Fo:n.blendFunc(n.ONE,n.ONE);break;case Ic:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Uc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Pe("WebGLState: Invalid blending: ",D);break}else switch(D){case gs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Fo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Ic:Pe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Uc:Pe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Pe("WebGLState: Invalid blending: ",D);break}b=null,M=null,A=null,w=null,C.set(0,0,0),x=0,m=D,E=Je}return}J=J||se,X=X||te,_e=_e||fe,(se!==p||J!==y)&&(n.blendEquationSeparate(Rt[se],Rt[J]),p=se,y=J),(te!==b||fe!==M||X!==A||_e!==w)&&(n.blendFuncSeparate(qe[te],qe[fe],qe[X],qe[_e]),b=te,M=fe,A=X,w=_e),(Le.equals(C)===!1||lt!==x)&&(n.blendColor(Le.r,Le.g,Le.b,lt),C.copy(Le),x=lt),m=D,E=!1}function rt(D,se){D.side===Ai?re(n.CULL_FACE):ie(n.CULL_FACE);let te=D.side===jt;se&&(te=!te),ke(te),D.blending===gs&&D.transparent===!1?Qe(Pi):Qe(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);const fe=D.stencilWrite;o.setTest(fe),fe&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),St(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ie(n.SAMPLE_ALPHA_TO_COVERAGE):re(n.SAMPLE_ALPHA_TO_COVERAGE)}function ke(D){W!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),W=D)}function gt(D){D!==Ad?(ie(n.CULL_FACE),D!==R&&(D===Lc?n.cullFace(n.BACK):D===wd?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):re(n.CULL_FACE),R=D}function P(D){D!==k&&(N&&n.lineWidth(D),k=D)}function St(D,se,te){D?(ie(n.POLYGON_OFFSET_FILL),(B!==se||z!==te)&&(B=se,z=te,a.getReversed()&&(se=-se),n.polygonOffset(se,te))):re(n.POLYGON_OFFSET_FILL)}function Ke(D){D?ie(n.SCISSOR_TEST):re(n.SCISSOR_TEST)}function ot(D){D===void 0&&(D=n.TEXTURE0+H-1),Z!==D&&(n.activeTexture(D),Z=D)}function xe(D,se,te){te===void 0&&(Z===null?te=n.TEXTURE0+H-1:te=Z);let fe=ce[te];fe===void 0&&(fe={type:void 0,texture:void 0},ce[te]=fe),(fe.type!==D||fe.texture!==se)&&(Z!==te&&(n.activeTexture(te),Z=te),n.bindTexture(D,se||Y[D]),fe.type=D,fe.texture=se)}function T(){const D=ce[Z];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function v(){try{n.compressedTexImage2D(...arguments)}catch(D){Pe("WebGLState:",D)}}function I(){try{n.compressedTexImage3D(...arguments)}catch(D){Pe("WebGLState:",D)}}function j(){try{n.texSubImage2D(...arguments)}catch(D){Pe("WebGLState:",D)}}function K(){try{n.texSubImage3D(...arguments)}catch(D){Pe("WebGLState:",D)}}function q(){try{n.compressedTexSubImage2D(...arguments)}catch(D){Pe("WebGLState:",D)}}function me(){try{n.compressedTexSubImage3D(...arguments)}catch(D){Pe("WebGLState:",D)}}function ne(){try{n.texStorage2D(...arguments)}catch(D){Pe("WebGLState:",D)}}function Ae(){try{n.texStorage3D(...arguments)}catch(D){Pe("WebGLState:",D)}}function Ce(){try{n.texImage2D(...arguments)}catch(D){Pe("WebGLState:",D)}}function Q(){try{n.texImage3D(...arguments)}catch(D){Pe("WebGLState:",D)}}function ee(D){Oe.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),Oe.copy(D))}function ge(D){dt.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),dt.copy(D))}function ve(D,se){let te=c.get(se);te===void 0&&(te=new WeakMap,c.set(se,te));let fe=te.get(D);fe===void 0&&(fe=n.getUniformBlockIndex(se,D.name),te.set(D,fe))}function he(D,se){const fe=c.get(se).get(D);l.get(se)!==fe&&(n.uniformBlockBinding(se,fe,D.__bindingPointIndex),l.set(se,fe))}function He(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},Z=null,ce={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,b=null,M=null,y=null,A=null,w=null,C=new Re(0,0,0),x=0,E=!1,W=null,R=null,k=null,B=null,z=null,Oe.set(0,0,n.canvas.width,n.canvas.height),dt.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ie,disable:re,bindFramebuffer:Ue,drawBuffers:we,useProgram:De,setBlending:Qe,setMaterial:rt,setFlipSided:ke,setCullFace:gt,setLineWidth:P,setPolygonOffset:St,setScissorTest:Ke,activeTexture:ot,bindTexture:xe,unbindTexture:T,compressedTexImage2D:v,compressedTexImage3D:I,texImage2D:Ce,texImage3D:Q,updateUBOMapping:ve,uniformBlockBinding:he,texStorage2D:ne,texStorage3D:Ae,texSubImage2D:j,texSubImage3D:K,compressedTexSubImage2D:q,compressedTexSubImage3D:me,scissor:ee,viewport:ge,reset:He}}function wv(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Me,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,v){return f?new OffscreenCanvas(T,v):ur("canvas")}function _(T,v,I){let j=1;const K=xe(T);if((K.width>I||K.height>I)&&(j=I/Math.max(K.width,K.height)),j<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const q=Math.floor(j*K.width),me=Math.floor(j*K.height);u===void 0&&(u=g(q,me));const ne=v?g(q,me):u;return ne.width=q,ne.height=me,ne.getContext("2d").drawImage(T,0,0,q,me),Ee("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+q+"x"+me+")."),ne}else return"data"in T&&Ee("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),T;return T}function m(T){return T.generateMipmaps}function p(T){n.generateMipmap(T)}function b(T){return T.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?n.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(T,v,I,j,K=!1){if(T!==null){if(n[T]!==void 0)return n[T];Ee("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let q=v;if(v===n.RED&&(I===n.FLOAT&&(q=n.R32F),I===n.HALF_FLOAT&&(q=n.R16F),I===n.UNSIGNED_BYTE&&(q=n.R8)),v===n.RED_INTEGER&&(I===n.UNSIGNED_BYTE&&(q=n.R8UI),I===n.UNSIGNED_SHORT&&(q=n.R16UI),I===n.UNSIGNED_INT&&(q=n.R32UI),I===n.BYTE&&(q=n.R8I),I===n.SHORT&&(q=n.R16I),I===n.INT&&(q=n.R32I)),v===n.RG&&(I===n.FLOAT&&(q=n.RG32F),I===n.HALF_FLOAT&&(q=n.RG16F),I===n.UNSIGNED_BYTE&&(q=n.RG8)),v===n.RG_INTEGER&&(I===n.UNSIGNED_BYTE&&(q=n.RG8UI),I===n.UNSIGNED_SHORT&&(q=n.RG16UI),I===n.UNSIGNED_INT&&(q=n.RG32UI),I===n.BYTE&&(q=n.RG8I),I===n.SHORT&&(q=n.RG16I),I===n.INT&&(q=n.RG32I)),v===n.RGB_INTEGER&&(I===n.UNSIGNED_BYTE&&(q=n.RGB8UI),I===n.UNSIGNED_SHORT&&(q=n.RGB16UI),I===n.UNSIGNED_INT&&(q=n.RGB32UI),I===n.BYTE&&(q=n.RGB8I),I===n.SHORT&&(q=n.RGB16I),I===n.INT&&(q=n.RGB32I)),v===n.RGBA_INTEGER&&(I===n.UNSIGNED_BYTE&&(q=n.RGBA8UI),I===n.UNSIGNED_SHORT&&(q=n.RGBA16UI),I===n.UNSIGNED_INT&&(q=n.RGBA32UI),I===n.BYTE&&(q=n.RGBA8I),I===n.SHORT&&(q=n.RGBA16I),I===n.INT&&(q=n.RGBA32I)),v===n.RGB&&(I===n.UNSIGNED_INT_5_9_9_9_REV&&(q=n.RGB9_E5),I===n.UNSIGNED_INT_10F_11F_11F_REV&&(q=n.R11F_G11F_B10F)),v===n.RGBA){const me=K?xa:We.getTransfer(j);I===n.FLOAT&&(q=n.RGBA32F),I===n.HALF_FLOAT&&(q=n.RGBA16F),I===n.UNSIGNED_BYTE&&(q=me===Ze?n.SRGB8_ALPHA8:n.RGBA8),I===n.UNSIGNED_SHORT_4_4_4_4&&(q=n.RGBA4),I===n.UNSIGNED_SHORT_5_5_5_1&&(q=n.RGB5_A1)}return(q===n.R16F||q===n.R32F||q===n.RG16F||q===n.RG32F||q===n.RGBA16F||q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function y(T,v){let I;return T?v===null||v===Ui||v===or?I=n.DEPTH24_STENCIL8:v===si?I=n.DEPTH32F_STENCIL8:v===ar&&(I=n.DEPTH24_STENCIL8,Ee("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Ui||v===or?I=n.DEPTH_COMPONENT24:v===si?I=n.DEPTH_COMPONENT32F:v===ar&&(I=n.DEPTH_COMPONENT16),I}function A(T,v){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==vt&&T.minFilter!==ft?Math.log2(Math.max(v.width,v.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?v.mipmaps.length:1}function w(T){const v=T.target;v.removeEventListener("dispose",w),x(v),v.isVideoTexture&&h.delete(v)}function C(T){const v=T.target;v.removeEventListener("dispose",C),W(v)}function x(T){const v=i.get(T);if(v.__webglInit===void 0)return;const I=T.source,j=d.get(I);if(j){const K=j[v.__cacheKey];K.usedTimes--,K.usedTimes===0&&E(T),Object.keys(j).length===0&&d.delete(I)}i.remove(T)}function E(T){const v=i.get(T);n.deleteTexture(v.__webglTexture);const I=T.source,j=d.get(I);delete j[v.__cacheKey],a.memory.textures--}function W(T){const v=i.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),i.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(v.__webglFramebuffer[j]))for(let K=0;K<v.__webglFramebuffer[j].length;K++)n.deleteFramebuffer(v.__webglFramebuffer[j][K]);else n.deleteFramebuffer(v.__webglFramebuffer[j]);v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer[j])}else{if(Array.isArray(v.__webglFramebuffer))for(let j=0;j<v.__webglFramebuffer.length;j++)n.deleteFramebuffer(v.__webglFramebuffer[j]);else n.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&n.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let j=0;j<v.__webglColorRenderbuffer.length;j++)v.__webglColorRenderbuffer[j]&&n.deleteRenderbuffer(v.__webglColorRenderbuffer[j]);v.__webglDepthRenderbuffer&&n.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const I=T.textures;for(let j=0,K=I.length;j<K;j++){const q=i.get(I[j]);q.__webglTexture&&(n.deleteTexture(q.__webglTexture),a.memory.textures--),i.remove(I[j])}i.remove(T)}let R=0;function k(){R=0}function B(){const T=R;return T>=s.maxTextures&&Ee("WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),R+=1,T}function z(T){const v=[];return v.push(T.wrapS),v.push(T.wrapT),v.push(T.wrapR||0),v.push(T.magFilter),v.push(T.minFilter),v.push(T.anisotropy),v.push(T.internalFormat),v.push(T.format),v.push(T.type),v.push(T.generateMipmaps),v.push(T.premultiplyAlpha),v.push(T.flipY),v.push(T.unpackAlignment),v.push(T.colorSpace),v.join()}function H(T,v){const I=i.get(T);if(T.isVideoTexture&&Ke(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&I.__version!==T.version){const j=T.image;if(j===null)Ee("WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)Ee("WebGLRenderer: Texture marked for update but image is incomplete");else{Y(I,T,v);return}}else T.isExternalTexture&&(I.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,I.__webglTexture,n.TEXTURE0+v)}function N(T,v){const I=i.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&I.__version!==T.version){Y(I,T,v);return}else T.isExternalTexture&&(I.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,I.__webglTexture,n.TEXTURE0+v)}function O(T,v){const I=i.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&I.__version!==T.version){Y(I,T,v);return}t.bindTexture(n.TEXTURE_3D,I.__webglTexture,n.TEXTURE0+v)}function $(T,v){const I=i.get(T);if(T.isCubeDepthTexture!==!0&&T.version>0&&I.__version!==T.version){ie(I,T,v);return}t.bindTexture(n.TEXTURE_CUBE_MAP,I.__webglTexture,n.TEXTURE0+v)}const Z={[Ss]:n.REPEAT,[wi]:n.CLAMP_TO_EDGE,[ba]:n.MIRRORED_REPEAT},ce={[vt]:n.NEAREST,[Su]:n.NEAREST_MIPMAP_NEAREST,[Zs]:n.NEAREST_MIPMAP_LINEAR,[ft]:n.LINEAR,[ua]:n.LINEAR_MIPMAP_NEAREST,[ji]:n.LINEAR_MIPMAP_LINEAR},pe={[ef]:n.NEVER,[af]:n.ALWAYS,[tf]:n.LESS,[tc]:n.LEQUAL,[nf]:n.EQUAL,[ic]:n.GEQUAL,[sf]:n.GREATER,[rf]:n.NOTEQUAL};function ue(T,v){if(v.type===si&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===ft||v.magFilter===ua||v.magFilter===Zs||v.magFilter===ji||v.minFilter===ft||v.minFilter===ua||v.minFilter===Zs||v.minFilter===ji)&&Ee("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(T,n.TEXTURE_WRAP_S,Z[v.wrapS]),n.texParameteri(T,n.TEXTURE_WRAP_T,Z[v.wrapT]),(T===n.TEXTURE_3D||T===n.TEXTURE_2D_ARRAY)&&n.texParameteri(T,n.TEXTURE_WRAP_R,Z[v.wrapR]),n.texParameteri(T,n.TEXTURE_MAG_FILTER,ce[v.magFilter]),n.texParameteri(T,n.TEXTURE_MIN_FILTER,ce[v.minFilter]),v.compareFunction&&(n.texParameteri(T,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(T,n.TEXTURE_COMPARE_FUNC,pe[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===vt||v.minFilter!==Zs&&v.minFilter!==ji||v.type===si&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){const I=e.get("EXT_texture_filter_anisotropic");n.texParameterf(T,I.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function Oe(T,v){let I=!1;T.__webglInit===void 0&&(T.__webglInit=!0,v.addEventListener("dispose",w));const j=v.source;let K=d.get(j);K===void 0&&(K={},d.set(j,K));const q=z(v);if(q!==T.__cacheKey){K[q]===void 0&&(K[q]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,I=!0),K[q].usedTimes++;const me=K[T.__cacheKey];me!==void 0&&(K[T.__cacheKey].usedTimes--,me.usedTimes===0&&E(v)),T.__cacheKey=q,T.__webglTexture=K[q].texture}return I}function dt(T,v,I){return Math.floor(Math.floor(T/I)/v)}function ct(T,v,I,j){const q=T.updateRanges;if(q.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,v.width,v.height,I,j,v.data);else{q.sort((Q,ee)=>Q.start-ee.start);let me=0;for(let Q=1;Q<q.length;Q++){const ee=q[me],ge=q[Q],ve=ee.start+ee.count,he=dt(ge.start,v.width,4),He=dt(ee.start,v.width,4);ge.start<=ve+1&&he===He&&dt(ge.start+ge.count-1,v.width,4)===he?ee.count=Math.max(ee.count,ge.start+ge.count-ee.start):(++me,q[me]=ge)}q.length=me+1;const ne=n.getParameter(n.UNPACK_ROW_LENGTH),Ae=n.getParameter(n.UNPACK_SKIP_PIXELS),Ce=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,v.width);for(let Q=0,ee=q.length;Q<ee;Q++){const ge=q[Q],ve=Math.floor(ge.start/4),he=Math.ceil(ge.count/4),He=ve%v.width,D=Math.floor(ve/v.width),se=he,te=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,He),n.pixelStorei(n.UNPACK_SKIP_ROWS,D),t.texSubImage2D(n.TEXTURE_2D,0,He,D,se,te,I,j,v.data)}T.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,ne),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ae),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ce)}}function Y(T,v,I){let j=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(j=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&(j=n.TEXTURE_3D);const K=Oe(T,v),q=v.source;t.bindTexture(j,T.__webglTexture,n.TEXTURE0+I);const me=i.get(q);if(q.version!==me.__version||K===!0){t.activeTexture(n.TEXTURE0+I);const ne=We.getPrimaries(We.workingColorSpace),Ae=v.colorSpace===hn?null:We.getPrimaries(v.colorSpace),Ce=v.colorSpace===hn||ne===Ae?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);let Q=_(v.image,!1,s.maxTextureSize);Q=ot(v,Q);const ee=r.convert(v.format,v.colorSpace),ge=r.convert(v.type);let ve=M(v.internalFormat,ee,ge,v.colorSpace,v.isVideoTexture);ue(j,v);let he;const He=v.mipmaps,D=v.isVideoTexture!==!0,se=me.__version===void 0||K===!0,te=q.dataReady,fe=A(v,Q);if(v.isDepthTexture)ve=y(v.format===Dn,v.type),se&&(D?t.texStorage2D(n.TEXTURE_2D,1,ve,Q.width,Q.height):t.texImage2D(n.TEXTURE_2D,0,ve,Q.width,Q.height,0,ee,ge,null));else if(v.isDataTexture)if(He.length>0){D&&se&&t.texStorage2D(n.TEXTURE_2D,fe,ve,He[0].width,He[0].height);for(let J=0,X=He.length;J<X;J++)he=He[J],D?te&&t.texSubImage2D(n.TEXTURE_2D,J,0,0,he.width,he.height,ee,ge,he.data):t.texImage2D(n.TEXTURE_2D,J,ve,he.width,he.height,0,ee,ge,he.data);v.generateMipmaps=!1}else D?(se&&t.texStorage2D(n.TEXTURE_2D,fe,ve,Q.width,Q.height),te&&ct(v,Q,ee,ge)):t.texImage2D(n.TEXTURE_2D,0,ve,Q.width,Q.height,0,ee,ge,Q.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){D&&se&&t.texStorage3D(n.TEXTURE_2D_ARRAY,fe,ve,He[0].width,He[0].height,Q.depth);for(let J=0,X=He.length;J<X;J++)if(he=He[J],v.format!==qt)if(ee!==null)if(D){if(te)if(v.layerUpdates.size>0){const _e=Th(he.width,he.height,v.format,v.type);for(const Le of v.layerUpdates){const lt=he.data.subarray(Le*_e/he.data.BYTES_PER_ELEMENT,(Le+1)*_e/he.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,Le,he.width,he.height,1,ee,lt)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,0,he.width,he.height,Q.depth,ee,he.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,J,ve,he.width,he.height,Q.depth,0,he.data,0,0);else Ee("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?te&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,0,he.width,he.height,Q.depth,ee,ge,he.data):t.texImage3D(n.TEXTURE_2D_ARRAY,J,ve,he.width,he.height,Q.depth,0,ee,ge,he.data)}else{D&&se&&t.texStorage2D(n.TEXTURE_2D,fe,ve,He[0].width,He[0].height);for(let J=0,X=He.length;J<X;J++)he=He[J],v.format!==qt?ee!==null?D?te&&t.compressedTexSubImage2D(n.TEXTURE_2D,J,0,0,he.width,he.height,ee,he.data):t.compressedTexImage2D(n.TEXTURE_2D,J,ve,he.width,he.height,0,he.data):Ee("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?te&&t.texSubImage2D(n.TEXTURE_2D,J,0,0,he.width,he.height,ee,ge,he.data):t.texImage2D(n.TEXTURE_2D,J,ve,he.width,he.height,0,ee,ge,he.data)}else if(v.isDataArrayTexture)if(D){if(se&&t.texStorage3D(n.TEXTURE_2D_ARRAY,fe,ve,Q.width,Q.height,Q.depth),te)if(v.layerUpdates.size>0){const J=Th(Q.width,Q.height,v.format,v.type);for(const X of v.layerUpdates){const _e=Q.data.subarray(X*J/Q.data.BYTES_PER_ELEMENT,(X+1)*J/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,X,Q.width,Q.height,1,ee,ge,_e)}v.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,ee,ge,Q.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ve,Q.width,Q.height,Q.depth,0,ee,ge,Q.data);else if(v.isData3DTexture)D?(se&&t.texStorage3D(n.TEXTURE_3D,fe,ve,Q.width,Q.height,Q.depth),te&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,ee,ge,Q.data)):t.texImage3D(n.TEXTURE_3D,0,ve,Q.width,Q.height,Q.depth,0,ee,ge,Q.data);else if(v.isFramebufferTexture){if(se)if(D)t.texStorage2D(n.TEXTURE_2D,fe,ve,Q.width,Q.height);else{let J=Q.width,X=Q.height;for(let _e=0;_e<fe;_e++)t.texImage2D(n.TEXTURE_2D,_e,ve,J,X,0,ee,ge,null),J>>=1,X>>=1}}else if(He.length>0){if(D&&se){const J=xe(He[0]);t.texStorage2D(n.TEXTURE_2D,fe,ve,J.width,J.height)}for(let J=0,X=He.length;J<X;J++)he=He[J],D?te&&t.texSubImage2D(n.TEXTURE_2D,J,0,0,ee,ge,he):t.texImage2D(n.TEXTURE_2D,J,ve,ee,ge,he);v.generateMipmaps=!1}else if(D){if(se){const J=xe(Q);t.texStorage2D(n.TEXTURE_2D,fe,ve,J.width,J.height)}te&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ee,ge,Q)}else t.texImage2D(n.TEXTURE_2D,0,ve,ee,ge,Q);m(v)&&p(j),me.__version=q.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function ie(T,v,I){if(v.image.length!==6)return;const j=Oe(T,v),K=v.source;t.bindTexture(n.TEXTURE_CUBE_MAP,T.__webglTexture,n.TEXTURE0+I);const q=i.get(K);if(K.version!==q.__version||j===!0){t.activeTexture(n.TEXTURE0+I);const me=We.getPrimaries(We.workingColorSpace),ne=v.colorSpace===hn?null:We.getPrimaries(v.colorSpace),Ae=v.colorSpace===hn||me===ne?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);const Ce=v.isCompressedTexture||v.image[0].isCompressedTexture,Q=v.image[0]&&v.image[0].isDataTexture,ee=[];for(let X=0;X<6;X++)!Ce&&!Q?ee[X]=_(v.image[X],!0,s.maxCubemapSize):ee[X]=Q?v.image[X].image:v.image[X],ee[X]=ot(v,ee[X]);const ge=ee[0],ve=r.convert(v.format,v.colorSpace),he=r.convert(v.type),He=M(v.internalFormat,ve,he,v.colorSpace),D=v.isVideoTexture!==!0,se=q.__version===void 0||j===!0,te=K.dataReady;let fe=A(v,ge);ue(n.TEXTURE_CUBE_MAP,v);let J;if(Ce){D&&se&&t.texStorage2D(n.TEXTURE_CUBE_MAP,fe,He,ge.width,ge.height);for(let X=0;X<6;X++){J=ee[X].mipmaps;for(let _e=0;_e<J.length;_e++){const Le=J[_e];v.format!==qt?ve!==null?D?te&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,_e,0,0,Le.width,Le.height,ve,Le.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,_e,He,Le.width,Le.height,0,Le.data):Ee("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,_e,0,0,Le.width,Le.height,ve,he,Le.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,_e,He,Le.width,Le.height,0,ve,he,Le.data)}}}else{if(J=v.mipmaps,D&&se){J.length>0&&fe++;const X=xe(ee[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,fe,He,X.width,X.height)}for(let X=0;X<6;X++)if(Q){D?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,0,0,ee[X].width,ee[X].height,ve,he,ee[X].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,He,ee[X].width,ee[X].height,0,ve,he,ee[X].data);for(let _e=0;_e<J.length;_e++){const lt=J[_e].image[X].image;D?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,_e+1,0,0,lt.width,lt.height,ve,he,lt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,_e+1,He,lt.width,lt.height,0,ve,he,lt.data)}}else{D?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,0,0,ve,he,ee[X]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,He,ve,he,ee[X]);for(let _e=0;_e<J.length;_e++){const Le=J[_e];D?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,_e+1,0,0,ve,he,Le.image[X]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,_e+1,He,ve,he,Le.image[X])}}}m(v)&&p(n.TEXTURE_CUBE_MAP),q.__version=K.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function re(T,v,I,j,K,q){const me=r.convert(I.format,I.colorSpace),ne=r.convert(I.type),Ae=M(I.internalFormat,me,ne,I.colorSpace),Ce=i.get(v),Q=i.get(I);if(Q.__renderTarget=v,!Ce.__hasExternalTextures){const ee=Math.max(1,v.width>>q),ge=Math.max(1,v.height>>q);K===n.TEXTURE_3D||K===n.TEXTURE_2D_ARRAY?t.texImage3D(K,q,Ae,ee,ge,v.depth,0,me,ne,null):t.texImage2D(K,q,Ae,ee,ge,0,me,ne,null)}t.bindFramebuffer(n.FRAMEBUFFER,T),St(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,K,Q.__webglTexture,0,P(v)):(K===n.TEXTURE_2D||K>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,j,K,Q.__webglTexture,q),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ue(T,v,I){if(n.bindRenderbuffer(n.RENDERBUFFER,T),v.depthBuffer){const j=v.depthTexture,K=j&&j.isDepthTexture?j.type:null,q=y(v.stencilBuffer,K),me=v.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;St(v)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,P(v),q,v.width,v.height):I?n.renderbufferStorageMultisample(n.RENDERBUFFER,P(v),q,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,q,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,me,n.RENDERBUFFER,T)}else{const j=v.textures;for(let K=0;K<j.length;K++){const q=j[K],me=r.convert(q.format,q.colorSpace),ne=r.convert(q.type),Ae=M(q.internalFormat,me,ne,q.colorSpace);St(v)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,P(v),Ae,v.width,v.height):I?n.renderbufferStorageMultisample(n.RENDERBUFFER,P(v),Ae,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,Ae,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function we(T,v,I){const j=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,T),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=i.get(v.depthTexture);if(K.__renderTarget=v,(!K.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),j){if(K.__webglInit===void 0&&(K.__webglInit=!0,v.depthTexture.addEventListener("dispose",w)),K.__webglTexture===void 0){K.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,K.__webglTexture),ue(n.TEXTURE_CUBE_MAP,v.depthTexture);const Ce=r.convert(v.depthTexture.format),Q=r.convert(v.depthTexture.type);let ee;v.depthTexture.format===Qi?ee=n.DEPTH_COMPONENT24:v.depthTexture.format===Dn&&(ee=n.DEPTH24_STENCIL8);for(let ge=0;ge<6;ge++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,ee,v.width,v.height,0,Ce,Q,null)}}else H(v.depthTexture,0);const q=K.__webglTexture,me=P(v),ne=j?n.TEXTURE_CUBE_MAP_POSITIVE_X+I:n.TEXTURE_2D,Ae=v.depthTexture.format===Dn?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(v.depthTexture.format===Qi)St(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Ae,ne,q,0,me):n.framebufferTexture2D(n.FRAMEBUFFER,Ae,ne,q,0);else if(v.depthTexture.format===Dn)St(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Ae,ne,q,0,me):n.framebufferTexture2D(n.FRAMEBUFFER,Ae,ne,q,0);else throw new Error("Unknown depthTexture format")}function De(T){const v=i.get(T),I=T.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==T.depthTexture){const j=T.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),j){const K=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,j.removeEventListener("dispose",K)};j.addEventListener("dispose",K),v.__depthDisposeCallback=K}v.__boundDepthTexture=j}if(T.depthTexture&&!v.__autoAllocateDepthBuffer)if(I)for(let j=0;j<6;j++)we(v.__webglFramebuffer[j],T,j);else{const j=T.texture.mipmaps;j&&j.length>0?we(v.__webglFramebuffer[0],T,0):we(v.__webglFramebuffer,T,0)}else if(I){v.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[j]),v.__webglDepthbuffer[j]===void 0)v.__webglDepthbuffer[j]=n.createRenderbuffer(),Ue(v.__webglDepthbuffer[j],T,!1);else{const K=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,q=v.__webglDepthbuffer[j];n.bindRenderbuffer(n.RENDERBUFFER,q),n.framebufferRenderbuffer(n.FRAMEBUFFER,K,n.RENDERBUFFER,q)}}else{const j=T.texture.mipmaps;if(j&&j.length>0?t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=n.createRenderbuffer(),Ue(v.__webglDepthbuffer,T,!1);else{const K=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,q=v.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,q),n.framebufferRenderbuffer(n.FRAMEBUFFER,K,n.RENDERBUFFER,q)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Rt(T,v,I){const j=i.get(T);v!==void 0&&re(j.__webglFramebuffer,T,T.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),I!==void 0&&De(T)}function qe(T){const v=T.texture,I=i.get(T),j=i.get(v);T.addEventListener("dispose",C);const K=T.textures,q=T.isWebGLCubeRenderTarget===!0,me=K.length>1;if(me||(j.__webglTexture===void 0&&(j.__webglTexture=n.createTexture()),j.__version=v.version,a.memory.textures++),q){I.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(v.mipmaps&&v.mipmaps.length>0){I.__webglFramebuffer[ne]=[];for(let Ae=0;Ae<v.mipmaps.length;Ae++)I.__webglFramebuffer[ne][Ae]=n.createFramebuffer()}else I.__webglFramebuffer[ne]=n.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){I.__webglFramebuffer=[];for(let ne=0;ne<v.mipmaps.length;ne++)I.__webglFramebuffer[ne]=n.createFramebuffer()}else I.__webglFramebuffer=n.createFramebuffer();if(me)for(let ne=0,Ae=K.length;ne<Ae;ne++){const Ce=i.get(K[ne]);Ce.__webglTexture===void 0&&(Ce.__webglTexture=n.createTexture(),a.memory.textures++)}if(T.samples>0&&St(T)===!1){I.__webglMultisampledFramebuffer=n.createFramebuffer(),I.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,I.__webglMultisampledFramebuffer);for(let ne=0;ne<K.length;ne++){const Ae=K[ne];I.__webglColorRenderbuffer[ne]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,I.__webglColorRenderbuffer[ne]);const Ce=r.convert(Ae.format,Ae.colorSpace),Q=r.convert(Ae.type),ee=M(Ae.internalFormat,Ce,Q,Ae.colorSpace,T.isXRRenderTarget===!0),ge=P(T);n.renderbufferStorageMultisample(n.RENDERBUFFER,ge,ee,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ne,n.RENDERBUFFER,I.__webglColorRenderbuffer[ne])}n.bindRenderbuffer(n.RENDERBUFFER,null),T.depthBuffer&&(I.__webglDepthRenderbuffer=n.createRenderbuffer(),Ue(I.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(q){t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture),ue(n.TEXTURE_CUBE_MAP,v);for(let ne=0;ne<6;ne++)if(v.mipmaps&&v.mipmaps.length>0)for(let Ae=0;Ae<v.mipmaps.length;Ae++)re(I.__webglFramebuffer[ne][Ae],T,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ae);else re(I.__webglFramebuffer[ne],T,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);m(v)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(me){for(let ne=0,Ae=K.length;ne<Ae;ne++){const Ce=K[ne],Q=i.get(Ce);let ee=n.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ee=T.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ee,Q.__webglTexture),ue(ee,Ce),re(I.__webglFramebuffer,T,Ce,n.COLOR_ATTACHMENT0+ne,ee,0),m(Ce)&&p(ee)}t.unbindTexture()}else{let ne=n.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ne=T.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ne,j.__webglTexture),ue(ne,v),v.mipmaps&&v.mipmaps.length>0)for(let Ae=0;Ae<v.mipmaps.length;Ae++)re(I.__webglFramebuffer[Ae],T,v,n.COLOR_ATTACHMENT0,ne,Ae);else re(I.__webglFramebuffer,T,v,n.COLOR_ATTACHMENT0,ne,0);m(v)&&p(ne),t.unbindTexture()}T.depthBuffer&&De(T)}function Qe(T){const v=T.textures;for(let I=0,j=v.length;I<j;I++){const K=v[I];if(m(K)){const q=b(T),me=i.get(K).__webglTexture;t.bindTexture(q,me),p(q),t.unbindTexture()}}}const rt=[],ke=[];function gt(T){if(T.samples>0){if(St(T)===!1){const v=T.textures,I=T.width,j=T.height;let K=n.COLOR_BUFFER_BIT;const q=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,me=i.get(T),ne=v.length>1;if(ne)for(let Ce=0;Ce<v.length;Ce++)t.bindFramebuffer(n.FRAMEBUFFER,me.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,me.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,me.__webglMultisampledFramebuffer);const Ae=T.texture.mipmaps;Ae&&Ae.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,me.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,me.__webglFramebuffer);for(let Ce=0;Ce<v.length;Ce++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(K|=n.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(K|=n.STENCIL_BUFFER_BIT)),ne){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,me.__webglColorRenderbuffer[Ce]);const Q=i.get(v[Ce]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Q,0)}n.blitFramebuffer(0,0,I,j,0,0,I,j,K,n.NEAREST),l===!0&&(rt.length=0,ke.length=0,rt.push(n.COLOR_ATTACHMENT0+Ce),T.depthBuffer&&T.resolveDepthBuffer===!1&&(rt.push(q),ke.push(q),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ke)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,rt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ne)for(let Ce=0;Ce<v.length;Ce++){t.bindFramebuffer(n.FRAMEBUFFER,me.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,me.__webglColorRenderbuffer[Ce]);const Q=i.get(v[Ce]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,me.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,Q,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,me.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const v=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[v])}}}function P(T){return Math.min(s.maxSamples,T.samples)}function St(T){const v=i.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Ke(T){const v=a.render.frame;h.get(T)!==v&&(h.set(T,v),T.update())}function ot(T,v){const I=T.colorSpace,j=T.format,K=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||I!==Vt&&I!==hn&&(We.getTransfer(I)===Ze?(j!==qt||K!==$t)&&Ee("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Pe("WebGLTextures: Unsupported texture color space:",I)),v}function xe(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=k,this.setTexture2D=H,this.setTexture2DArray=N,this.setTexture3D=O,this.setTextureCube=$,this.rebindTextures=Rt,this.setupRenderTarget=qe,this.updateRenderTargetMipmap=Qe,this.updateMultisampleRenderTarget=gt,this.setupDepthRenderbuffer=De,this.setupFrameBufferTexture=re,this.useMultisampledRTT=St,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Rv(n,e){function t(i,s=hn){let r;const a=We.getTransfer(s);if(i===$t)return n.UNSIGNED_BYTE;if(i===Kl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Zl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Eu)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Tu)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Mu)return n.BYTE;if(i===yu)return n.SHORT;if(i===ar)return n.UNSIGNED_SHORT;if(i===Yl)return n.INT;if(i===Ui)return n.UNSIGNED_INT;if(i===si)return n.FLOAT;if(i===Gt)return n.HALF_FLOAT;if(i===Au)return n.ALPHA;if(i===wu)return n.RGB;if(i===qt)return n.RGBA;if(i===Qi)return n.DEPTH_COMPONENT;if(i===Dn)return n.DEPTH_STENCIL;if(i===Ql)return n.RED;if(i===Jl)return n.RED_INTEGER;if(i===Ms)return n.RG;if(i===$l)return n.RG_INTEGER;if(i===ec)return n.RGBA_INTEGER;if(i===da||i===fa||i===pa||i===ma)if(a===Ze)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===da)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===fa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===pa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ma)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===da)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===fa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===pa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ma)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===jo||i===Yo||i===Ko||i===Zo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===jo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Yo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ko)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Zo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Qo||i===Jo||i===$o||i===el||i===tl||i===il||i===nl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Qo||i===Jo)return a===Ze?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===$o)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===el)return r.COMPRESSED_R11_EAC;if(i===tl)return r.COMPRESSED_SIGNED_R11_EAC;if(i===il)return r.COMPRESSED_RG11_EAC;if(i===nl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===sl||i===rl||i===al||i===ol||i===ll||i===cl||i===hl||i===ul||i===dl||i===fl||i===pl||i===ml||i===gl||i===_l)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===sl)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===rl)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===al)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ol)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ll)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===cl)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===hl)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ul)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===dl)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===fl)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===pl)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ml)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===gl)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===_l)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===vl||i===bl||i===xl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===vl)return a===Ze?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===bl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===xl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Sl||i===Ml||i===yl||i===El)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Sl)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Ml)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===yl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===El)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===or?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const Cv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Pv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Dv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new zu(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Et({vertexShader:Cv,fragmentShader:Pv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Wt(new Mr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Lv extends Hn{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const _=typeof XRWebGLBinding<"u",m=new Dv,p={},b=t.getContextAttributes();let M=null,y=null;const A=[],w=[],C=new Me;let x=null;const E=new Ht;E.viewport=new ht;const W=new Ht;W.viewport=new ht;const R=[E,W],k=new Lp;let B=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ie=A[Y];return ie===void 0&&(ie=new Ya,A[Y]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(Y){let ie=A[Y];return ie===void 0&&(ie=new Ya,A[Y]=ie),ie.getGripSpace()},this.getHand=function(Y){let ie=A[Y];return ie===void 0&&(ie=new Ya,A[Y]=ie),ie.getHandSpace()};function H(Y){const ie=w.indexOf(Y.inputSource);if(ie===-1)return;const re=A[ie];re!==void 0&&(re.update(Y.inputSource,Y.frame,c||a),re.dispatchEvent({type:Y.type,data:Y.inputSource}))}function N(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",N),s.removeEventListener("inputsourceschange",O);for(let Y=0;Y<A.length;Y++){const ie=w[Y];ie!==null&&(w[Y]=null,A[Y].disconnect(ie))}B=null,z=null,m.reset();for(const Y in p)delete p[Y];e.setRenderTarget(M),f=null,d=null,u=null,s=null,y=null,ct.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,i.isPresenting===!0&&Ee("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,i.isPresenting===!0&&Ee("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",N),s.addEventListener("inputsourceschange",O),b.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let re=null,Ue=null,we=null;b.depth&&(we=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=b.stencil?Dn:Qi,Ue=b.stencil?or:Ui);const De={colorFormat:t.RGBA8,depthFormat:we,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(De),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Lt(d.textureWidth,d.textureHeight,{format:qt,type:$t,depthTexture:new dr(d.textureWidth,d.textureHeight,Ue,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const re={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,re),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Lt(f.framebufferWidth,f.framebufferHeight,{format:qt,type:$t,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),ct.setContext(s),ct.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function O(Y){for(let ie=0;ie<Y.removed.length;ie++){const re=Y.removed[ie],Ue=w.indexOf(re);Ue>=0&&(w[Ue]=null,A[Ue].disconnect(re))}for(let ie=0;ie<Y.added.length;ie++){const re=Y.added[ie];let Ue=w.indexOf(re);if(Ue===-1){for(let De=0;De<A.length;De++)if(De>=w.length){w.push(re),Ue=De;break}else if(w[De]===null){w[De]=re,Ue=De;break}if(Ue===-1)break}const we=A[Ue];we&&we.connect(re)}}const $=new L,Z=new L;function ce(Y,ie,re){$.setFromMatrixPosition(ie.matrixWorld),Z.setFromMatrixPosition(re.matrixWorld);const Ue=$.distanceTo(Z),we=ie.projectionMatrix.elements,De=re.projectionMatrix.elements,Rt=we[14]/(we[10]-1),qe=we[14]/(we[10]+1),Qe=(we[9]+1)/we[5],rt=(we[9]-1)/we[5],ke=(we[8]-1)/we[0],gt=(De[8]+1)/De[0],P=Rt*ke,St=Rt*gt,Ke=Ue/(-ke+gt),ot=Ke*-ke;if(ie.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(ot),Y.translateZ(Ke),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),we[10]===-1)Y.projectionMatrix.copy(ie.projectionMatrix),Y.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{const xe=Rt+Ke,T=qe+Ke,v=P-ot,I=St+(Ue-ot),j=Qe*qe/T*xe,K=rt*qe/T*xe;Y.projectionMatrix.makePerspective(v,I,j,K,xe,T),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function pe(Y,ie){ie===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ie.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let ie=Y.near,re=Y.far;m.texture!==null&&(m.depthNear>0&&(ie=m.depthNear),m.depthFar>0&&(re=m.depthFar)),k.near=W.near=E.near=ie,k.far=W.far=E.far=re,(B!==k.near||z!==k.far)&&(s.updateRenderState({depthNear:k.near,depthFar:k.far}),B=k.near,z=k.far),k.layers.mask=Y.layers.mask|6,E.layers.mask=k.layers.mask&-5,W.layers.mask=k.layers.mask&-3;const Ue=Y.parent,we=k.cameras;pe(k,Ue);for(let De=0;De<we.length;De++)pe(we[De],Ue);we.length===2?ce(k,E,W):k.projectionMatrix.copy(E.projectionMatrix),ue(Y,k,Ue)};function ue(Y,ie,re){re===null?Y.matrix.copy(ie.matrixWorld):(Y.matrix.copy(re.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ie.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ie.projectionMatrix),Y.projectionMatrixInverse.copy(ie.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=ys*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(k)},this.getCameraTexture=function(Y){return p[Y]};let Oe=null;function dt(Y,ie){if(h=ie.getViewerPose(c||a),g=ie,h!==null){const re=h.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let Ue=!1;re.length!==k.cameras.length&&(k.cameras.length=0,Ue=!0);for(let qe=0;qe<re.length;qe++){const Qe=re[qe];let rt=null;if(f!==null)rt=f.getViewport(Qe);else{const gt=u.getViewSubImage(d,Qe);rt=gt.viewport,qe===0&&(e.setRenderTargetTextures(y,gt.colorTexture,gt.depthStencilTexture),e.setRenderTarget(y))}let ke=R[qe];ke===void 0&&(ke=new Ht,ke.layers.enable(qe),ke.viewport=new ht,R[qe]=ke),ke.matrix.fromArray(Qe.transform.matrix),ke.matrix.decompose(ke.position,ke.quaternion,ke.scale),ke.projectionMatrix.fromArray(Qe.projectionMatrix),ke.projectionMatrixInverse.copy(ke.projectionMatrix).invert(),ke.viewport.set(rt.x,rt.y,rt.width,rt.height),qe===0&&(k.matrix.copy(ke.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),Ue===!0&&k.cameras.push(ke)}const we=s.enabledFeatures;if(we&&we.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=i.getBinding();const qe=u.getDepthInformation(re[0]);qe&&qe.isValid&&qe.texture&&m.init(qe,s.renderState)}if(we&&we.includes("camera-access")&&_){e.state.unbindTexture(),u=i.getBinding();for(let qe=0;qe<re.length;qe++){const Qe=re[qe].camera;if(Qe){let rt=p[Qe];rt||(rt=new zu,p[Qe]=rt);const ke=u.getCameraImage(Qe);rt.sourceTexture=ke}}}}for(let re=0;re<A.length;re++){const Ue=w[re],we=A[re];Ue!==null&&we!==void 0&&we.update(Ue,ie,c||a)}Oe&&Oe(Y,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),g=null}const ct=new Zu;ct.setAnimationLoop(dt),this.setAnimationLoop=function(Y){Oe=Y},this.dispose=function(){}}}const Tn=new Ni,Iv=new Be;function Uv(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Vu(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,b,M,y){p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,b,M):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===jt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===jt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const b=e.get(p),M=b.envMap,y=b.envMapRotation;M&&(m.envMap.value=M,Tn.copy(y),Tn.x*=-1,Tn.y*=-1,Tn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Tn.y*=-1,Tn.z*=-1),m.envMapRotation.value.setFromMatrix4(Iv.makeRotationFromEuler(Tn)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,b,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=M*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===jt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const b=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Nv(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,M){const y=M.program;i.uniformBlockBinding(b,y)}function c(b,M){let y=s[b.id];y===void 0&&(g(b),y=h(b),s[b.id]=y,b.addEventListener("dispose",m));const A=M.program;i.updateUBOMapping(b,A);const w=e.render.frame;r[b.id]!==w&&(d(b),r[b.id]=w)}function h(b){const M=u();b.__bindingPointIndex=M;const y=n.createBuffer(),A=b.__size,w=b.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,A,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,M,y),y}function u(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return Pe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){const M=s[b.id],y=b.uniforms,A=b.__cache;n.bindBuffer(n.UNIFORM_BUFFER,M);for(let w=0,C=y.length;w<C;w++){const x=Array.isArray(y[w])?y[w]:[y[w]];for(let E=0,W=x.length;E<W;E++){const R=x[E];if(f(R,w,E,A)===!0){const k=R.__offset,B=Array.isArray(R.value)?R.value:[R.value];let z=0;for(let H=0;H<B.length;H++){const N=B[H],O=_(N);typeof N=="number"||typeof N=="boolean"?(R.__data[0]=N,n.bufferSubData(n.UNIFORM_BUFFER,k+z,R.__data)):N.isMatrix3?(R.__data[0]=N.elements[0],R.__data[1]=N.elements[1],R.__data[2]=N.elements[2],R.__data[3]=0,R.__data[4]=N.elements[3],R.__data[5]=N.elements[4],R.__data[6]=N.elements[5],R.__data[7]=0,R.__data[8]=N.elements[6],R.__data[9]=N.elements[7],R.__data[10]=N.elements[8],R.__data[11]=0):(N.toArray(R.__data,z),z+=O.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,k,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(b,M,y,A){const w=b.value,C=M+"_"+y;if(A[C]===void 0)return typeof w=="number"||typeof w=="boolean"?A[C]=w:A[C]=w.clone(),!0;{const x=A[C];if(typeof w=="number"||typeof w=="boolean"){if(x!==w)return A[C]=w,!0}else if(x.equals(w)===!1)return x.copy(w),!0}return!1}function g(b){const M=b.uniforms;let y=0;const A=16;for(let C=0,x=M.length;C<x;C++){const E=Array.isArray(M[C])?M[C]:[M[C]];for(let W=0,R=E.length;W<R;W++){const k=E[W],B=Array.isArray(k.value)?k.value:[k.value];for(let z=0,H=B.length;z<H;z++){const N=B[z],O=_(N),$=y%A,Z=$%O.boundary,ce=$+Z;y+=Z,ce!==0&&A-ce<O.storage&&(y+=A-ce),k.__data=new Float32Array(O.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=y,y+=O.storage}}}const w=y%A;return w>0&&(y+=A-w),b.__size=y,b.__cache={},this}function _(b){const M={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(M.boundary=4,M.storage=4):b.isVector2?(M.boundary=8,M.storage=8):b.isVector3||b.isColor?(M.boundary=16,M.storage=12):b.isVector4?(M.boundary=16,M.storage=16):b.isMatrix3?(M.boundary=48,M.storage=48):b.isMatrix4?(M.boundary=64,M.storage=64):b.isTexture?Ee("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Ee("WebGLRenderer: Unsupported uniform value type.",b),M}function m(b){const M=b.target;M.removeEventListener("dispose",m);const y=a.indexOf(M.__bindingPointIndex);a.splice(y,1),n.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function p(){for(const b in s)n.deleteBuffer(s[b]);a=[],s={},r={}}return{bind:l,update:c,dispose:p}}const Ov=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let xi=null;function Fv(){return xi===null&&(xi=new ac(Ov,16,16,Ms,Gt),xi.name="DFG_LUT",xi.minFilter=ft,xi.magFilter=ft,xi.wrapS=wi,xi.wrapT=wi,xi.generateMipmaps=!1,xi.needsUpdate=!0),xi}class Bv{constructor(e={}){const{canvas:t=cf(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=$t}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=a;const _=f,m=new Set([ec,$l,Jl]),p=new Set([$t,Ui,ar,or,Kl,Zl]),b=new Uint32Array(4),M=new Int32Array(4);let y=null,A=null;const w=[],C=[];let x=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Di,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const E=this;let W=!1;this._outputColorSpace=Dt;let R=0,k=0,B=null,z=-1,H=null;const N=new ht,O=new ht;let $=null;const Z=new Re(0);let ce=0,pe=t.width,ue=t.height,Oe=1,dt=null,ct=null;const Y=new ht(0,0,pe,ue),ie=new ht(0,0,pe,ue);let re=!1;const Ue=new lc;let we=!1,De=!1;const Rt=new Be,qe=new L,Qe=new ht,rt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ke=!1;function gt(){return B===null?Oe:1}let P=i;function St(S,U){return t.getContext(S,U)}try{const S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Gl}`),t.addEventListener("webglcontextlost",_e,!1),t.addEventListener("webglcontextrestored",Le,!1),t.addEventListener("webglcontextcreationerror",lt,!1),P===null){const U="webgl2";if(P=St(U,S),P===null)throw St(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw Pe("WebGLRenderer: "+S.message),S}let Ke,ot,xe,T,v,I,j,K,q,me,ne,Ae,Ce,Q,ee,ge,ve,he,He,D,se,te,fe;function J(){Ke=new B_(P),Ke.init(),se=new Rv(P,Ke),ot=new P_(P,Ke,e,se),xe=new Av(P,Ke),ot.reversedDepthBuffer&&d&&xe.buffers.depth.setReversed(!0),T=new G_(P),v=new dv,I=new wv(P,Ke,xe,v,ot,se,T),j=new F_(E),K=new qp(P),te=new R_(P,K),q=new k_(P,K,T,te),me=new V_(P,q,K,te,T),he=new z_(P,ot,I),ee=new D_(v),ne=new uv(E,j,Ke,ot,te,ee),Ae=new Uv(E,v),Ce=new pv,Q=new xv(Ke),ve=new w_(E,j,xe,me,g,l),ge=new Tv(E,me,ot),fe=new Nv(P,T,ot,xe),He=new C_(P,Ke,T),D=new H_(P,Ke,T),T.programs=ne.programs,E.capabilities=ot,E.extensions=Ke,E.properties=v,E.renderLists=Ce,E.shadowMap=ge,E.state=xe,E.info=T}J(),_!==$t&&(x=new X_(_,t.width,t.height,s,r));const X=new Lv(E,P);this.xr=X,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const S=Ke.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Ke.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return Oe},this.setPixelRatio=function(S){S!==void 0&&(Oe=S,this.setSize(pe,ue,!1))},this.getSize=function(S){return S.set(pe,ue)},this.setSize=function(S,U,V=!0){if(X.isPresenting){Ee("WebGLRenderer: Can't change size while VR device is presenting.");return}pe=S,ue=U,t.width=Math.floor(S*Oe),t.height=Math.floor(U*Oe),V===!0&&(t.style.width=S+"px",t.style.height=U+"px"),x!==null&&x.setSize(t.width,t.height),this.setViewport(0,0,S,U)},this.getDrawingBufferSize=function(S){return S.set(pe*Oe,ue*Oe).floor()},this.setDrawingBufferSize=function(S,U,V){pe=S,ue=U,Oe=V,t.width=Math.floor(S*V),t.height=Math.floor(U*V),this.setViewport(0,0,S,U)},this.setEffects=function(S){if(_===$t){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let U=0;U<S.length;U++)if(S[U].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}x.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(N)},this.getViewport=function(S){return S.copy(Y)},this.setViewport=function(S,U,V,G){S.isVector4?Y.set(S.x,S.y,S.z,S.w):Y.set(S,U,V,G),xe.viewport(N.copy(Y).multiplyScalar(Oe).round())},this.getScissor=function(S){return S.copy(ie)},this.setScissor=function(S,U,V,G){S.isVector4?ie.set(S.x,S.y,S.z,S.w):ie.set(S,U,V,G),xe.scissor(O.copy(ie).multiplyScalar(Oe).round())},this.getScissorTest=function(){return re},this.setScissorTest=function(S){xe.setScissorTest(re=S)},this.setOpaqueSort=function(S){dt=S},this.setTransparentSort=function(S){ct=S},this.getClearColor=function(S){return S.copy(ve.getClearColor())},this.setClearColor=function(){ve.setClearColor(...arguments)},this.getClearAlpha=function(){return ve.getClearAlpha()},this.setClearAlpha=function(){ve.setClearAlpha(...arguments)},this.clear=function(S=!0,U=!0,V=!0){let G=0;if(S){let F=!1;if(B!==null){const oe=B.texture.format;F=m.has(oe)}if(F){const oe=B.texture.type,de=p.has(oe),le=ve.getClearColor(),be=ve.getClearAlpha(),ye=le.r,Ie=le.g,Ge=le.b;de?(b[0]=ye,b[1]=Ie,b[2]=Ge,b[3]=be,P.clearBufferuiv(P.COLOR,0,b)):(M[0]=ye,M[1]=Ie,M[2]=Ge,M[3]=be,P.clearBufferiv(P.COLOR,0,M))}else G|=P.COLOR_BUFFER_BIT}U&&(G|=P.DEPTH_BUFFER_BIT),V&&(G|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&P.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",_e,!1),t.removeEventListener("webglcontextrestored",Le,!1),t.removeEventListener("webglcontextcreationerror",lt,!1),ve.dispose(),Ce.dispose(),Q.dispose(),v.dispose(),j.dispose(),me.dispose(),te.dispose(),fe.dispose(),ne.dispose(),X.dispose(),X.removeEventListener("sessionstart",yc),X.removeEventListener("sessionend",Ec),vn.stop()};function _e(S){S.preventDefault(),Sa("WebGLRenderer: Context Lost."),W=!0}function Le(){Sa("WebGLRenderer: Context Restored."),W=!1;const S=T.autoReset,U=ge.enabled,V=ge.autoUpdate,G=ge.needsUpdate,F=ge.type;J(),T.autoReset=S,ge.enabled=U,ge.autoUpdate=V,ge.needsUpdate=G,ge.type=F}function lt(S){Pe("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function Je(S){const U=S.target;U.removeEventListener("dispose",Je),Bi(U)}function Bi(S){ki(S),v.remove(S)}function ki(S){const U=v.get(S).programs;U!==void 0&&(U.forEach(function(V){ne.releaseProgram(V)}),S.isShaderMaterial&&ne.releaseShaderCache(S))}this.renderBufferDirect=function(S,U,V,G,F,oe){U===null&&(U=rt);const de=F.isMesh&&F.matrixWorld.determinant()<0,le=vd(S,U,V,G,F);xe.setMaterial(G,de);let be=V.index,ye=1;if(G.wireframe===!0){if(be=q.getWireframeAttribute(V),be===void 0)return;ye=2}const Ie=V.drawRange,Ge=V.attributes.position;let Te=Ie.start*ye,it=(Ie.start+Ie.count)*ye;oe!==null&&(Te=Math.max(Te,oe.start*ye),it=Math.min(it,(oe.start+oe.count)*ye)),be!==null?(Te=Math.max(Te,0),it=Math.min(it,be.count)):Ge!=null&&(Te=Math.max(Te,0),it=Math.min(it,Ge.count));const _t=it-Te;if(_t<0||_t===1/0)return;te.setup(F,G,le,V,be);let mt,nt=He;if(be!==null&&(mt=K.get(be),nt=D,nt.setIndex(mt)),F.isMesh)G.wireframe===!0?(xe.setLineWidth(G.wireframeLinewidth*gt()),nt.setMode(P.LINES)):nt.setMode(P.TRIANGLES);else if(F.isLine){let Nt=G.linewidth;Nt===void 0&&(Nt=1),xe.setLineWidth(Nt*gt()),F.isLineSegments?nt.setMode(P.LINES):F.isLineLoop?nt.setMode(P.LINE_LOOP):nt.setMode(P.LINE_STRIP)}else F.isPoints?nt.setMode(P.POINTS):F.isSprite&&nt.setMode(P.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)Ma("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),nt.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(Ke.get("WEBGL_multi_draw"))nt.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const Nt=F._multiDrawStarts,Se=F._multiDrawCounts,Yt=F._multiDrawCount,Ye=be?K.get(be).bytesPerElement:1,ri=v.get(G).currentProgram.getUniforms();for(let vi=0;vi<Yt;vi++)ri.setValue(P,"_gl_DrawID",vi),nt.render(Nt[vi]/Ye,Se[vi])}else if(F.isInstancedMesh)nt.renderInstances(Te,_t,F.count);else if(V.isInstancedBufferGeometry){const Nt=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Se=Math.min(V.instanceCount,Nt);nt.renderInstances(Te,_t,Se)}else nt.render(Te,_t)};function Mc(S,U,V){S.transparent===!0&&S.side===Ai&&S.forceSinglePass===!1?(S.side=jt,S.needsUpdate=!0,Er(S,U,V),S.side=Ii,S.needsUpdate=!0,Er(S,U,V),S.side=Ai):Er(S,U,V)}this.compile=function(S,U,V=null){V===null&&(V=S),A=Q.get(V),A.init(U),C.push(A),V.traverseVisible(function(F){F.isLight&&F.layers.test(U.layers)&&(A.pushLight(F),F.castShadow&&A.pushShadow(F))}),S!==V&&S.traverseVisible(function(F){F.isLight&&F.layers.test(U.layers)&&(A.pushLight(F),F.castShadow&&A.pushShadow(F))}),A.setupLights();const G=new Set;return S.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const oe=F.material;if(oe)if(Array.isArray(oe))for(let de=0;de<oe.length;de++){const le=oe[de];Mc(le,V,F),G.add(le)}else Mc(oe,V,F),G.add(oe)}),A=C.pop(),G},this.compileAsync=function(S,U,V=null){const G=this.compile(S,U,V);return new Promise(F=>{function oe(){if(G.forEach(function(de){v.get(de).currentProgram.isReady()&&G.delete(de)}),G.size===0){F(S);return}setTimeout(oe,10)}Ke.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let Ba=null;function _d(S){Ba&&Ba(S)}function yc(){vn.stop()}function Ec(){vn.start()}const vn=new Zu;vn.setAnimationLoop(_d),typeof self<"u"&&vn.setContext(self),this.setAnimationLoop=function(S){Ba=S,X.setAnimationLoop(S),S===null?vn.stop():vn.start()},X.addEventListener("sessionstart",yc),X.addEventListener("sessionend",Ec),this.render=function(S,U){if(U!==void 0&&U.isCamera!==!0){Pe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(W===!0)return;const V=X.enabled===!0&&X.isPresenting===!0,G=x!==null&&(B===null||V)&&x.begin(E,B);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(x===null||x.isCompositing()===!1)&&(X.cameraAutoUpdate===!0&&X.updateCamera(U),U=X.getCamera()),S.isScene===!0&&S.onBeforeRender(E,S,U,B),A=Q.get(S,C.length),A.init(U),C.push(A),Rt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Ue.setFromProjectionMatrix(Rt,Ri,U.reversedDepth),De=this.localClippingEnabled,we=ee.init(this.clippingPlanes,De),y=Ce.get(S,w.length),y.init(),w.push(y),X.enabled===!0&&X.isPresenting===!0){const de=E.xr.getDepthSensingMesh();de!==null&&ka(de,U,-1/0,E.sortObjects)}ka(S,U,0,E.sortObjects),y.finish(),E.sortObjects===!0&&y.sort(dt,ct),ke=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,ke&&ve.addToRenderList(y,S),this.info.render.frame++,we===!0&&ee.beginShadows();const F=A.state.shadowsArray;if(ge.render(F,S,U),we===!0&&ee.endShadows(),this.info.autoReset===!0&&this.info.reset(),(G&&x.hasRenderPass())===!1){const de=y.opaque,le=y.transmissive;if(A.setupLights(),U.isArrayCamera){const be=U.cameras;if(le.length>0)for(let ye=0,Ie=be.length;ye<Ie;ye++){const Ge=be[ye];Ac(de,le,S,Ge)}ke&&ve.render(S);for(let ye=0,Ie=be.length;ye<Ie;ye++){const Ge=be[ye];Tc(y,S,Ge,Ge.viewport)}}else le.length>0&&Ac(de,le,S,U),ke&&ve.render(S),Tc(y,S,U)}B!==null&&k===0&&(I.updateMultisampleRenderTarget(B),I.updateRenderTargetMipmap(B)),G&&x.end(E),S.isScene===!0&&S.onAfterRender(E,S,U),te.resetDefaultState(),z=-1,H=null,C.pop(),C.length>0?(A=C[C.length-1],we===!0&&ee.setGlobalState(E.clippingPlanes,A.state.camera)):A=null,w.pop(),w.length>0?y=w[w.length-1]:y=null};function ka(S,U,V,G){if(S.visible===!1)return;if(S.layers.test(U.layers)){if(S.isGroup)V=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(U);else if(S.isLight)A.pushLight(S),S.castShadow&&A.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||Ue.intersectsSprite(S)){G&&Qe.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Rt);const de=me.update(S),le=S.material;le.visible&&y.push(S,de,le,V,Qe.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||Ue.intersectsObject(S))){const de=me.update(S),le=S.material;if(G&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Qe.copy(S.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),Qe.copy(de.boundingSphere.center)),Qe.applyMatrix4(S.matrixWorld).applyMatrix4(Rt)),Array.isArray(le)){const be=de.groups;for(let ye=0,Ie=be.length;ye<Ie;ye++){const Ge=be[ye],Te=le[Ge.materialIndex];Te&&Te.visible&&y.push(S,de,Te,V,Qe.z,Ge)}}else le.visible&&y.push(S,de,le,V,Qe.z,null)}}const oe=S.children;for(let de=0,le=oe.length;de<le;de++)ka(oe[de],U,V,G)}function Tc(S,U,V,G){const{opaque:F,transmissive:oe,transparent:de}=S;A.setupLightsView(V),we===!0&&ee.setGlobalState(E.clippingPlanes,V),G&&xe.viewport(N.copy(G)),F.length>0&&yr(F,U,V),oe.length>0&&yr(oe,U,V),de.length>0&&yr(de,U,V),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function Ac(S,U,V,G){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[G.id]===void 0){const Te=Ke.has("EXT_color_buffer_half_float")||Ke.has("EXT_color_buffer_float");A.state.transmissionRenderTarget[G.id]=new Lt(1,1,{generateMipmaps:!0,type:Te?Gt:$t,minFilter:ji,samples:ot.samples,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:We.workingColorSpace})}const oe=A.state.transmissionRenderTarget[G.id],de=G.viewport||N;oe.setSize(de.z*E.transmissionResolutionScale,de.w*E.transmissionResolutionScale);const le=E.getRenderTarget(),be=E.getActiveCubeFace(),ye=E.getActiveMipmapLevel();E.setRenderTarget(oe),E.getClearColor(Z),ce=E.getClearAlpha(),ce<1&&E.setClearColor(16777215,.5),E.clear(),ke&&ve.render(V);const Ie=E.toneMapping;E.toneMapping=Di;const Ge=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),A.setupLightsView(G),we===!0&&ee.setGlobalState(E.clippingPlanes,G),yr(S,V,G),I.updateMultisampleRenderTarget(oe),I.updateRenderTargetMipmap(oe),Ke.has("WEBGL_multisampled_render_to_texture")===!1){let Te=!1;for(let it=0,_t=U.length;it<_t;it++){const mt=U[it],{object:nt,geometry:Nt,material:Se,group:Yt}=mt;if(Se.side===Ai&&nt.layers.test(G.layers)){const Ye=Se.side;Se.side=jt,Se.needsUpdate=!0,wc(nt,V,G,Nt,Se,Yt),Se.side=Ye,Se.needsUpdate=!0,Te=!0}}Te===!0&&(I.updateMultisampleRenderTarget(oe),I.updateRenderTargetMipmap(oe))}E.setRenderTarget(le,be,ye),E.setClearColor(Z,ce),Ge!==void 0&&(G.viewport=Ge),E.toneMapping=Ie}function yr(S,U,V){const G=U.isScene===!0?U.overrideMaterial:null;for(let F=0,oe=S.length;F<oe;F++){const de=S[F],{object:le,geometry:be,group:ye}=de;let Ie=de.material;Ie.allowOverride===!0&&G!==null&&(Ie=G),le.layers.test(V.layers)&&wc(le,U,V,be,Ie,ye)}}function wc(S,U,V,G,F,oe){S.onBeforeRender(E,U,V,G,F,oe),S.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),F.onBeforeRender(E,U,V,G,S,oe),F.transparent===!0&&F.side===Ai&&F.forceSinglePass===!1?(F.side=jt,F.needsUpdate=!0,E.renderBufferDirect(V,U,G,F,S,oe),F.side=Ii,F.needsUpdate=!0,E.renderBufferDirect(V,U,G,F,S,oe),F.side=Ai):E.renderBufferDirect(V,U,G,F,S,oe),S.onAfterRender(E,U,V,G,F,oe)}function Er(S,U,V){U.isScene!==!0&&(U=rt);const G=v.get(S),F=A.state.lights,oe=A.state.shadowsArray,de=F.state.version,le=ne.getParameters(S,F.state,oe,U,V),be=ne.getProgramCacheKey(le);let ye=G.programs;G.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?U.environment:null,G.fog=U.fog;const Ie=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;G.envMap=j.get(S.envMap||G.environment,Ie),G.envMapRotation=G.environment!==null&&S.envMap===null?U.environmentRotation:S.envMapRotation,ye===void 0&&(S.addEventListener("dispose",Je),ye=new Map,G.programs=ye);let Ge=ye.get(be);if(Ge!==void 0){if(G.currentProgram===Ge&&G.lightsStateVersion===de)return Cc(S,le),Ge}else le.uniforms=ne.getUniforms(S),S.onBeforeCompile(le,E),Ge=ne.acquireProgram(le,be),ye.set(be,Ge),G.uniforms=le.uniforms;const Te=G.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Te.clippingPlanes=ee.uniform),Cc(S,le),G.needsLights=xd(S),G.lightsStateVersion=de,G.needsLights&&(Te.ambientLightColor.value=F.state.ambient,Te.lightProbe.value=F.state.probe,Te.directionalLights.value=F.state.directional,Te.directionalLightShadows.value=F.state.directionalShadow,Te.spotLights.value=F.state.spot,Te.spotLightShadows.value=F.state.spotShadow,Te.rectAreaLights.value=F.state.rectArea,Te.ltc_1.value=F.state.rectAreaLTC1,Te.ltc_2.value=F.state.rectAreaLTC2,Te.pointLights.value=F.state.point,Te.pointLightShadows.value=F.state.pointShadow,Te.hemisphereLights.value=F.state.hemi,Te.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Te.spotLightMatrix.value=F.state.spotLightMatrix,Te.spotLightMap.value=F.state.spotLightMap,Te.pointShadowMatrix.value=F.state.pointShadowMatrix),G.currentProgram=Ge,G.uniformsList=null,Ge}function Rc(S){if(S.uniformsList===null){const U=S.currentProgram.getUniforms();S.uniformsList=ga.seqWithValue(U.seq,S.uniforms)}return S.uniformsList}function Cc(S,U){const V=v.get(S);V.outputColorSpace=U.outputColorSpace,V.batching=U.batching,V.batchingColor=U.batchingColor,V.instancing=U.instancing,V.instancingColor=U.instancingColor,V.instancingMorph=U.instancingMorph,V.skinning=U.skinning,V.morphTargets=U.morphTargets,V.morphNormals=U.morphNormals,V.morphColors=U.morphColors,V.morphTargetsCount=U.morphTargetsCount,V.numClippingPlanes=U.numClippingPlanes,V.numIntersection=U.numClipIntersection,V.vertexAlphas=U.vertexAlphas,V.vertexTangents=U.vertexTangents,V.toneMapping=U.toneMapping}function vd(S,U,V,G,F){U.isScene!==!0&&(U=rt),I.resetTextureUnits();const oe=U.fog,de=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?U.environment:null,le=B===null?E.outputColorSpace:B.isXRRenderTarget===!0?B.texture.colorSpace:Vt,be=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,ye=j.get(G.envMap||de,be),Ie=G.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Ge=!!V.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Te=!!V.morphAttributes.position,it=!!V.morphAttributes.normal,_t=!!V.morphAttributes.color;let mt=Di;G.toneMapped&&(B===null||B.isXRRenderTarget===!0)&&(mt=E.toneMapping);const nt=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Nt=nt!==void 0?nt.length:0,Se=v.get(G),Yt=A.state.lights;if(we===!0&&(De===!0||S!==H)){const Ct=S===H&&G.id===z;ee.setState(G,S,Ct)}let Ye=!1;G.version===Se.__version?(Se.needsLights&&Se.lightsStateVersion!==Yt.state.version||Se.outputColorSpace!==le||F.isBatchedMesh&&Se.batching===!1||!F.isBatchedMesh&&Se.batching===!0||F.isBatchedMesh&&Se.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&Se.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&Se.instancing===!1||!F.isInstancedMesh&&Se.instancing===!0||F.isSkinnedMesh&&Se.skinning===!1||!F.isSkinnedMesh&&Se.skinning===!0||F.isInstancedMesh&&Se.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Se.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&Se.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&Se.instancingMorph===!1&&F.morphTexture!==null||Se.envMap!==ye||G.fog===!0&&Se.fog!==oe||Se.numClippingPlanes!==void 0&&(Se.numClippingPlanes!==ee.numPlanes||Se.numIntersection!==ee.numIntersection)||Se.vertexAlphas!==Ie||Se.vertexTangents!==Ge||Se.morphTargets!==Te||Se.morphNormals!==it||Se.morphColors!==_t||Se.toneMapping!==mt||Se.morphTargetsCount!==Nt)&&(Ye=!0):(Ye=!0,Se.__version=G.version);let ri=Se.currentProgram;Ye===!0&&(ri=Er(G,U,F));let vi=!1,bn=!1,zn=!1;const at=ri.getUniforms(),It=Se.uniforms;if(xe.useProgram(ri.program)&&(vi=!0,bn=!0,zn=!0),G.id!==z&&(z=G.id,bn=!0),vi||H!==S){xe.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),at.setValue(P,"projectionMatrix",S.projectionMatrix),at.setValue(P,"viewMatrix",S.matrixWorldInverse);const $i=at.map.cameraPosition;$i!==void 0&&$i.setValue(P,qe.setFromMatrixPosition(S.matrixWorld)),ot.logarithmicDepthBuffer&&at.setValue(P,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&at.setValue(P,"isOrthographic",S.isOrthographicCamera===!0),H!==S&&(H=S,bn=!0,zn=!0)}if(Se.needsLights&&(Yt.state.directionalShadowMap.length>0&&at.setValue(P,"directionalShadowMap",Yt.state.directionalShadowMap,I),Yt.state.spotShadowMap.length>0&&at.setValue(P,"spotShadowMap",Yt.state.spotShadowMap,I),Yt.state.pointShadowMap.length>0&&at.setValue(P,"pointShadowMap",Yt.state.pointShadowMap,I)),F.isSkinnedMesh){at.setOptional(P,F,"bindMatrix"),at.setOptional(P,F,"bindMatrixInverse");const Ct=F.skeleton;Ct&&(Ct.boneTexture===null&&Ct.computeBoneTexture(),at.setValue(P,"boneTexture",Ct.boneTexture,I))}F.isBatchedMesh&&(at.setOptional(P,F,"batchingTexture"),at.setValue(P,"batchingTexture",F._matricesTexture,I),at.setOptional(P,F,"batchingIdTexture"),at.setValue(P,"batchingIdTexture",F._indirectTexture,I),at.setOptional(P,F,"batchingColorTexture"),F._colorsTexture!==null&&at.setValue(P,"batchingColorTexture",F._colorsTexture,I));const Ji=V.morphAttributes;if((Ji.position!==void 0||Ji.normal!==void 0||Ji.color!==void 0)&&he.update(F,V,ri),(bn||Se.receiveShadow!==F.receiveShadow)&&(Se.receiveShadow=F.receiveShadow,at.setValue(P,"receiveShadow",F.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&U.environment!==null&&(It.envMapIntensity.value=U.environmentIntensity),It.dfgLUT!==void 0&&(It.dfgLUT.value=Fv()),bn&&(at.setValue(P,"toneMappingExposure",E.toneMappingExposure),Se.needsLights&&bd(It,zn),oe&&G.fog===!0&&Ae.refreshFogUniforms(It,oe),Ae.refreshMaterialUniforms(It,G,Oe,ue,A.state.transmissionRenderTarget[S.id]),ga.upload(P,Rc(Se),It,I)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(ga.upload(P,Rc(Se),It,I),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&at.setValue(P,"center",F.center),at.setValue(P,"modelViewMatrix",F.modelViewMatrix),at.setValue(P,"normalMatrix",F.normalMatrix),at.setValue(P,"modelMatrix",F.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Ct=G.uniformsGroups;for(let $i=0,Vn=Ct.length;$i<Vn;$i++){const Pc=Ct[$i];fe.update(Pc,ri),fe.bind(Pc,ri)}}return ri}function bd(S,U){S.ambientLightColor.needsUpdate=U,S.lightProbe.needsUpdate=U,S.directionalLights.needsUpdate=U,S.directionalLightShadows.needsUpdate=U,S.pointLights.needsUpdate=U,S.pointLightShadows.needsUpdate=U,S.spotLights.needsUpdate=U,S.spotLightShadows.needsUpdate=U,S.rectAreaLights.needsUpdate=U,S.hemisphereLights.needsUpdate=U}function xd(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return B},this.setRenderTargetTextures=function(S,U,V){const G=v.get(S);G.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),v.get(S.texture).__webglTexture=U,v.get(S.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:V,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,U){const V=v.get(S);V.__webglFramebuffer=U,V.__useDefaultFramebuffer=U===void 0};const Sd=P.createFramebuffer();this.setRenderTarget=function(S,U=0,V=0){B=S,R=U,k=V;let G=null,F=!1,oe=!1;if(S){const le=v.get(S);if(le.__useDefaultFramebuffer!==void 0){xe.bindFramebuffer(P.FRAMEBUFFER,le.__webglFramebuffer),N.copy(S.viewport),O.copy(S.scissor),$=S.scissorTest,xe.viewport(N),xe.scissor(O),xe.setScissorTest($),z=-1;return}else if(le.__webglFramebuffer===void 0)I.setupRenderTarget(S);else if(le.__hasExternalTextures)I.rebindTextures(S,v.get(S.texture).__webglTexture,v.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const Ie=S.depthTexture;if(le.__boundDepthTexture!==Ie){if(Ie!==null&&v.has(Ie)&&(S.width!==Ie.image.width||S.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");I.setupDepthRenderbuffer(S)}}const be=S.texture;(be.isData3DTexture||be.isDataArrayTexture||be.isCompressedArrayTexture)&&(oe=!0);const ye=v.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(ye[U])?G=ye[U][V]:G=ye[U],F=!0):S.samples>0&&I.useMultisampledRTT(S)===!1?G=v.get(S).__webglMultisampledFramebuffer:Array.isArray(ye)?G=ye[V]:G=ye,N.copy(S.viewport),O.copy(S.scissor),$=S.scissorTest}else N.copy(Y).multiplyScalar(Oe).floor(),O.copy(ie).multiplyScalar(Oe).floor(),$=re;if(V!==0&&(G=Sd),xe.bindFramebuffer(P.FRAMEBUFFER,G)&&xe.drawBuffers(S,G),xe.viewport(N),xe.scissor(O),xe.setScissorTest($),F){const le=v.get(S.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+U,le.__webglTexture,V)}else if(oe){const le=U;for(let be=0;be<S.textures.length;be++){const ye=v.get(S.textures[be]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+be,ye.__webglTexture,V,le)}}else if(S!==null&&V!==0){const le=v.get(S.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,le.__webglTexture,V)}z=-1},this.readRenderTargetPixels=function(S,U,V,G,F,oe,de,le=0){if(!(S&&S.isWebGLRenderTarget)){Pe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=v.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&de!==void 0&&(be=be[de]),be){xe.bindFramebuffer(P.FRAMEBUFFER,be);try{const ye=S.textures[le],Ie=ye.format,Ge=ye.type;if(S.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+le),!ot.textureFormatReadable(Ie)){Pe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ot.textureTypeReadable(Ge)){Pe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=S.width-G&&V>=0&&V<=S.height-F&&P.readPixels(U,V,G,F,se.convert(Ie),se.convert(Ge),oe)}finally{const ye=B!==null?v.get(B).__webglFramebuffer:null;xe.bindFramebuffer(P.FRAMEBUFFER,ye)}}},this.readRenderTargetPixelsAsync=async function(S,U,V,G,F,oe,de,le=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=v.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&de!==void 0&&(be=be[de]),be)if(U>=0&&U<=S.width-G&&V>=0&&V<=S.height-F){xe.bindFramebuffer(P.FRAMEBUFFER,be);const ye=S.textures[le],Ie=ye.format,Ge=ye.type;if(S.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+le),!ot.textureFormatReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ot.textureTypeReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Te=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Te),P.bufferData(P.PIXEL_PACK_BUFFER,oe.byteLength,P.STREAM_READ),P.readPixels(U,V,G,F,se.convert(Ie),se.convert(Ge),0);const it=B!==null?v.get(B).__webglFramebuffer:null;xe.bindFramebuffer(P.FRAMEBUFFER,it);const _t=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await hf(P,_t,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Te),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,oe),P.deleteBuffer(Te),P.deleteSync(_t),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,U=null,V=0){const G=Math.pow(2,-V),F=Math.floor(S.image.width*G),oe=Math.floor(S.image.height*G),de=U!==null?U.x:0,le=U!==null?U.y:0;I.setTexture2D(S,0),P.copyTexSubImage2D(P.TEXTURE_2D,V,0,0,de,le,F,oe),xe.unbindTexture()};const Md=P.createFramebuffer(),yd=P.createFramebuffer();this.copyTextureToTexture=function(S,U,V=null,G=null,F=0,oe=0){let de,le,be,ye,Ie,Ge,Te,it,_t;const mt=S.isCompressedTexture?S.mipmaps[oe]:S.image;if(V!==null)de=V.max.x-V.min.x,le=V.max.y-V.min.y,be=V.isBox3?V.max.z-V.min.z:1,ye=V.min.x,Ie=V.min.y,Ge=V.isBox3?V.min.z:0;else{const It=Math.pow(2,-F);de=Math.floor(mt.width*It),le=Math.floor(mt.height*It),S.isDataArrayTexture?be=mt.depth:S.isData3DTexture?be=Math.floor(mt.depth*It):be=1,ye=0,Ie=0,Ge=0}G!==null?(Te=G.x,it=G.y,_t=G.z):(Te=0,it=0,_t=0);const nt=se.convert(U.format),Nt=se.convert(U.type);let Se;U.isData3DTexture?(I.setTexture3D(U,0),Se=P.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(I.setTexture2DArray(U,0),Se=P.TEXTURE_2D_ARRAY):(I.setTexture2D(U,0),Se=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,U.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,U.unpackAlignment);const Yt=P.getParameter(P.UNPACK_ROW_LENGTH),Ye=P.getParameter(P.UNPACK_IMAGE_HEIGHT),ri=P.getParameter(P.UNPACK_SKIP_PIXELS),vi=P.getParameter(P.UNPACK_SKIP_ROWS),bn=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,mt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,mt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,ye),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ie),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ge);const zn=S.isDataArrayTexture||S.isData3DTexture,at=U.isDataArrayTexture||U.isData3DTexture;if(S.isDepthTexture){const It=v.get(S),Ji=v.get(U),Ct=v.get(It.__renderTarget),$i=v.get(Ji.__renderTarget);xe.bindFramebuffer(P.READ_FRAMEBUFFER,Ct.__webglFramebuffer),xe.bindFramebuffer(P.DRAW_FRAMEBUFFER,$i.__webglFramebuffer);for(let Vn=0;Vn<be;Vn++)zn&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,v.get(S).__webglTexture,F,Ge+Vn),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,v.get(U).__webglTexture,oe,_t+Vn)),P.blitFramebuffer(ye,Ie,de,le,Te,it,de,le,P.DEPTH_BUFFER_BIT,P.NEAREST);xe.bindFramebuffer(P.READ_FRAMEBUFFER,null),xe.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(F!==0||S.isRenderTargetTexture||v.has(S)){const It=v.get(S),Ji=v.get(U);xe.bindFramebuffer(P.READ_FRAMEBUFFER,Md),xe.bindFramebuffer(P.DRAW_FRAMEBUFFER,yd);for(let Ct=0;Ct<be;Ct++)zn?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,It.__webglTexture,F,Ge+Ct):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,It.__webglTexture,F),at?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ji.__webglTexture,oe,_t+Ct):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Ji.__webglTexture,oe),F!==0?P.blitFramebuffer(ye,Ie,de,le,Te,it,de,le,P.COLOR_BUFFER_BIT,P.NEAREST):at?P.copyTexSubImage3D(Se,oe,Te,it,_t+Ct,ye,Ie,de,le):P.copyTexSubImage2D(Se,oe,Te,it,ye,Ie,de,le);xe.bindFramebuffer(P.READ_FRAMEBUFFER,null),xe.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else at?S.isDataTexture||S.isData3DTexture?P.texSubImage3D(Se,oe,Te,it,_t,de,le,be,nt,Nt,mt.data):U.isCompressedArrayTexture?P.compressedTexSubImage3D(Se,oe,Te,it,_t,de,le,be,nt,mt.data):P.texSubImage3D(Se,oe,Te,it,_t,de,le,be,nt,Nt,mt):S.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,oe,Te,it,de,le,nt,Nt,mt.data):S.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,oe,Te,it,mt.width,mt.height,nt,mt.data):P.texSubImage2D(P.TEXTURE_2D,oe,Te,it,de,le,nt,Nt,mt);P.pixelStorei(P.UNPACK_ROW_LENGTH,Yt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Ye),P.pixelStorei(P.UNPACK_SKIP_PIXELS,ri),P.pixelStorei(P.UNPACK_SKIP_ROWS,vi),P.pixelStorei(P.UNPACK_SKIP_IMAGES,bn),oe===0&&U.generateMipmaps&&P.generateMipmap(Se),xe.unbindTexture()},this.initRenderTarget=function(S){v.get(S).__webglFramebuffer===void 0&&I.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?I.setTextureCube(S,0):S.isData3DTexture?I.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?I.setTexture2DArray(S,0):I.setTexture2D(S,0),xe.unbindTexture()},this.resetState=function(){R=0,k=0,B=null,xe.reset(),te.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ri}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=We._getDrawingBufferColorSpace(e),t.unpackColorSpace=We._getUnpackColorSpace()}}const Kh={type:"change"},pc={type:"start"},id={type:"end"},$r=new xr,Zh=new cn,kv=Math.cos(70*Du.DEG2RAD),Tt=new L,Xt=2*Math.PI,st={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},yo=1e-6;class Hv extends Wp{constructor(e,t=null){super(e,t),this.state=st.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ms.ROTATE,MIDDLE:ms.DOLLY,RIGHT:ms.PAN},this.touches={ONE:cs.ROTATE,TWO:cs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new mi,this._lastTargetPosition=new L,this._quat=new mi().setFromUnitVectors(e.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Eh,this._sphericalDelta=new Eh,this._scale=1,this._panOffset=new L,this._rotateStart=new Me,this._rotateEnd=new Me,this._rotateDelta=new Me,this._panStart=new Me,this._panEnd=new Me,this._panDelta=new Me,this._dollyStart=new Me,this._dollyEnd=new Me,this._dollyDelta=new Me,this._dollyDirection=new L,this._mouse=new Me,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=zv.bind(this),this._onPointerDown=Gv.bind(this),this._onPointerUp=Vv.bind(this),this._onContextMenu=Zv.bind(this),this._onMouseWheel=qv.bind(this),this._onKeyDown=jv.bind(this),this._onTouchStart=Yv.bind(this),this._onTouchMove=Kv.bind(this),this._onMouseDown=Wv.bind(this),this._onMouseMove=Xv.bind(this),this._interceptControlDown=Qv.bind(this),this._interceptControlUp=Jv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Kh),this.update(),this.state=st.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;Tt.copy(t).sub(this.target),Tt.applyQuaternion(this._quat),this._spherical.setFromVector3(Tt),this.autoRotate&&this.state===st.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Xt:i>Math.PI&&(i-=Xt),s<-Math.PI?s+=Xt:s>Math.PI&&(s-=Xt),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Tt.setFromSpherical(this._spherical),Tt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Tt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Tt.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new L(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new L(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Tt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):($r.origin.copy(this.object.position),$r.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot($r.direction))<kv?this.object.lookAt(this.target):(Zh.setFromNormalAndCoplanarPoint(this.object.up,this.target),$r.intersectPlane(Zh,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>yo||8*(1-this._lastQuaternion.dot(this.object.quaternion))>yo||this._lastTargetPosition.distanceToSquared(this.target)>yo?(this.dispatchEvent(Kh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Xt/60*this.autoRotateSpeed*e:Xt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Tt.setFromMatrixColumn(t,0),Tt.multiplyScalar(-e),this._panOffset.add(Tt)}_panUp(e,t){this.screenSpacePanning===!0?Tt.setFromMatrixColumn(t,1):(Tt.setFromMatrixColumn(t,0),Tt.crossVectors(this.object.up,Tt)),Tt.multiplyScalar(e),this._panOffset.add(Tt)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Tt.copy(s).sub(this.target);let r=Tt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Xt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Xt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Xt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Xt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Xt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Xt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Xt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Xt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Me,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function Gv(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function zv(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function Vv(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(id),this.state=st.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Wv(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ms.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=st.DOLLY;break;case ms.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=st.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=st.ROTATE}break;case ms.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=st.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=st.PAN}break;default:this.state=st.NONE}this.state!==st.NONE&&this.dispatchEvent(pc)}function Xv(n){switch(this.state){case st.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case st.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case st.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function qv(n){this.enabled===!1||this.enableZoom===!1||this.state!==st.NONE||(n.preventDefault(),this.dispatchEvent(pc),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(id))}function jv(n){this.enabled!==!1&&this._handleKeyDown(n)}function Yv(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case cs.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=st.TOUCH_ROTATE;break;case cs.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=st.TOUCH_PAN;break;default:this.state=st.NONE}break;case 2:switch(this.touches.TWO){case cs.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=st.TOUCH_DOLLY_PAN;break;case cs.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=st.TOUCH_DOLLY_ROTATE;break;default:this.state=st.NONE}break;default:this.state=st.NONE}this.state!==st.NONE&&this.dispatchEvent(pc)}function Kv(n){switch(this._trackPointer(n),this.state){case st.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case st.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case st.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case st.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=st.NONE}}function Zv(n){this.enabled!==!1&&n.preventDefault()}function Qv(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Jv(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const _a={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Gn{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const $v=new Ns(-1,1,1,-1,0,1);class eb extends ti{constructor(){super(),this.setAttribute("position",new ei([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ei([0,2,0,0,2,0],2))}}const tb=new eb;class Ua{constructor(e){this._mesh=new Wt(tb,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,$v)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class ib extends Gn{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Et?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=fn.clone(e.uniforms),this.material=new Et({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Ua(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Qh extends Gn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class nb extends Gn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class sb{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new Me);this._width=i.width,this._height=i.height,t=new Lt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Gt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ib(_a),this.copyPass.material.blending=Pi,this.timer=new Ip}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),a.needsSwap){if(i){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Qh!==void 0&&(a instanceof Qh?i=!0:a instanceof nb&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Me);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class rb extends Gn{constructor(e,t,i=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Re}render(e,t,i){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const ab={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Re(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Rs extends Gn{constructor(e,t=1,i,s){super(),this.strength=t,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new Me(e.x,e.y):new Me(256,256),this.clearColor=new Re(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Lt(r,a,{type:Gt}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const u=new Lt(r,a,{type:Gt});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const d=new Lt(r,a,{type:Gt});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),a=Math.round(a/2)}const o=ab;this.highPassUniforms=fn.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Et({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new Me(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=fn.clone(_a.uniforms),this.blendMaterial=new Et({uniforms:this.copyUniforms,vertexShader:_a.vertexShader,fragmentShader:_a.fragmentShader,premultipliedAlpha:!0,blending:Fo,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Re,this._oldClearAlpha=1,this._basic=new Ci,this._fsQuad=new Ua(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Me(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=Rs.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Rs.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],i=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(i*i))/i);return new Et({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Me(.5,.5)},direction:{value:new Me(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new Et({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}Rs.BlurDirectionX=new Me(1,0);Rs.BlurDirectionY=new Me(0,1);const ea={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class ob extends Gn{constructor(){super(),this.isOutputPass=!0,this.uniforms=fn.clone(ea.uniforms),this.material=new Wu({name:ea.name,uniforms:this.uniforms,vertexShader:ea.vertexShader,fragmentShader:ea.fragmentShader}),this._fsQuad=new Ua(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},We.getTransfer(this._outputColorSpace)===Ze&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===zl?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Vl?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Wl?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ca?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ql?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===jl?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Xl&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const ta={defines:{SMAA_THRESHOLD:"0.1"},uniforms:{tDiffuse:{value:null},resolution:{value:new Me(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		void SMAAEdgeDetectionVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0,  1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4(  1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 2 ] = texcoord.xyxy + resolution.xyxy * vec4( -2.0, 0.0, 0.0,  2.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAAEdgeDetectionVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		vec4 SMAAColorEdgeDetectionPS( vec2 texcoord, vec4 offset[3], sampler2D colorTex ) {
			vec2 threshold = vec2( SMAA_THRESHOLD, SMAA_THRESHOLD );

			// Calculate color deltas:
			vec4 delta;
			vec3 C = texture2D( colorTex, texcoord ).rgb;

			vec3 Cleft = texture2D( colorTex, offset[0].xy ).rgb;
			vec3 t = abs( C - Cleft );
			delta.x = max( max( t.r, t.g ), t.b );

			vec3 Ctop = texture2D( colorTex, offset[0].zw ).rgb;
			t = abs( C - Ctop );
			delta.y = max( max( t.r, t.g ), t.b );

			// We do the usual threshold:
			vec2 edges = step( threshold, delta.xy );

			// Then discard if there is no edge:
			if ( dot( edges, vec2( 1.0, 1.0 ) ) == 0.0 )
				discard;

			// Calculate right and bottom deltas:
			vec3 Cright = texture2D( colorTex, offset[1].xy ).rgb;
			t = abs( C - Cright );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Cbottom  = texture2D( colorTex, offset[1].zw ).rgb;
			t = abs( C - Cbottom );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the maximum delta in the direct neighborhood:
			float maxDelta = max( max( max( delta.x, delta.y ), delta.z ), delta.w );

			// Calculate left-left and top-top deltas:
			vec3 Cleftleft  = texture2D( colorTex, offset[2].xy ).rgb;
			t = abs( C - Cleftleft );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Ctoptop = texture2D( colorTex, offset[2].zw ).rgb;
			t = abs( C - Ctoptop );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the final maximum delta:
			maxDelta = max( max( maxDelta, delta.z ), delta.w );

			// Local contrast adaptation in action:
			edges.xy *= step( 0.5 * maxDelta, delta.xy );

			return vec4( edges, 0.0, 0.0 );
		}

		void main() {

			gl_FragColor = SMAAColorEdgeDetectionPS( vUv, vOffset, tDiffuse );

		}`},ia={defines:{SMAA_MAX_SEARCH_STEPS:"8",SMAA_AREATEX_MAX_DISTANCE:"16",SMAA_AREATEX_PIXEL_SIZE:"( 1.0 / vec2( 160.0, 560.0 ) )",SMAA_AREATEX_SUBTEX_SIZE:"( 1.0 / 7.0 )"},uniforms:{tDiffuse:{value:null},tArea:{value:null},tSearch:{value:null},resolution:{value:new Me(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];
		varying vec2 vPixcoord;

		void SMAABlendingWeightCalculationVS( vec2 texcoord ) {
			vPixcoord = texcoord / resolution;

			// We will use these offsets for the searches later on (see @PSEUDO_GATHER4):
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.25, 0.125, 1.25, 0.125 ); // WebGL port note: Changed sign in Y and W components
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.125, 0.25, -0.125, -1.25 ); // WebGL port note: Changed sign in Y and W components

			// And these for the searches, they indicate the ends of the loops:
			vOffset[ 2 ] = vec4( vOffset[ 0 ].xz, vOffset[ 1 ].yw ) + vec4( -2.0, 2.0, -2.0, 2.0 ) * resolution.xxyy * float( SMAA_MAX_SEARCH_STEPS );

		}

		void main() {

			vUv = uv;

			SMAABlendingWeightCalculationVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * resolution, 0.0 )

		uniform sampler2D tDiffuse;
		uniform sampler2D tArea;
		uniform sampler2D tSearch;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[3];
		varying vec2 vPixcoord;

		#if __VERSION__ == 100
		vec2 round( vec2 x ) {
			return sign( x ) * floor( abs( x ) + 0.5 );
		}
		#endif

		float SMAASearchLength( sampler2D searchTex, vec2 e, float bias, float scale ) {
			// Not required if searchTex accesses are set to point:
			// float2 SEARCH_TEX_PIXEL_SIZE = 1.0 / float2(66.0, 33.0);
			// e = float2(bias, 0.0) + 0.5 * SEARCH_TEX_PIXEL_SIZE +
			//     e * float2(scale, 1.0) * float2(64.0, 32.0) * SEARCH_TEX_PIXEL_SIZE;
			e.r = bias + e.r * scale;
			return 255.0 * texture2D( searchTex, e, 0.0 ).r;
		}

		float SMAASearchXLeft( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			/**
				* @PSEUDO_GATHER4
				* This texcoord has been offset by (-0.25, -0.125) in the vertex shader to
				* sample between edge, thus fetching four edges in a row.
				* Sampling with different offsets in each direction allows to disambiguate
				* which edges are active from the four fetched ones.
				*/
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x > end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			// We correct the previous (-0.25, -0.125) offset we applied:
			texcoord.x += 0.25 * resolution.x;

			// The searches are bias by 1, so adjust the coords accordingly:
			texcoord.x += resolution.x;

			// Disambiguate the length added by the last step:
			texcoord.x += 2.0 * resolution.x; // Undo last step
			texcoord.x -= resolution.x * SMAASearchLength(searchTex, e, 0.0, 0.5);

			return texcoord.x;
		}

		float SMAASearchXRight( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x < end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			texcoord.x -= 0.25 * resolution.x;
			texcoord.x -= resolution.x;
			texcoord.x -= 2.0 * resolution.x;
			texcoord.x += resolution.x * SMAASearchLength( searchTex, e, 0.5, 0.5 );

			return texcoord.x;
		}

		float SMAASearchYUp( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y > end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y -= 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y; // WebGL port note: Changed sign
			texcoord.y -= 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y * SMAASearchLength( searchTex, e.gr, 0.0, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		float SMAASearchYDown( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y < end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y += 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y; // WebGL port note: Changed sign
			texcoord.y += 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y * SMAASearchLength( searchTex, e.gr, 0.5, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		vec2 SMAAArea( sampler2D areaTex, vec2 dist, float e1, float e2, float offset ) {
			// Rounding prevents precision errors of bilinear filtering:
			vec2 texcoord = float( SMAA_AREATEX_MAX_DISTANCE ) * round( 4.0 * vec2( e1, e2 ) ) + dist;

			// We do a scale and bias for mapping to texel space:
			texcoord = SMAA_AREATEX_PIXEL_SIZE * texcoord + ( 0.5 * SMAA_AREATEX_PIXEL_SIZE );

			// Move to proper place, according to the subpixel offset:
			texcoord.y += SMAA_AREATEX_SUBTEX_SIZE * offset;

			return texture2D( areaTex, texcoord, 0.0 ).rg;
		}

		vec4 SMAABlendingWeightCalculationPS( vec2 texcoord, vec2 pixcoord, vec4 offset[ 3 ], sampler2D edgesTex, sampler2D areaTex, sampler2D searchTex, ivec4 subsampleIndices ) {
			vec4 weights = vec4( 0.0, 0.0, 0.0, 0.0 );

			vec2 e = texture2D( edgesTex, texcoord ).rg;

			if ( e.g > 0.0 ) { // Edge at north
				vec2 d;

				// Find the distance to the left:
				vec2 coords;
				coords.x = SMAASearchXLeft( edgesTex, searchTex, offset[ 0 ].xy, offset[ 2 ].x );
				coords.y = offset[ 1 ].y; // offset[1].y = texcoord.y - 0.25 * resolution.y (@CROSSING_OFFSET)
				d.x = coords.x;

				// Now fetch the left crossing edges, two at a time using bilinear
				// filtering. Sampling at -0.25 (see @CROSSING_OFFSET) enables to
				// discern what value each edge has:
				float e1 = texture2D( edgesTex, coords, 0.0 ).r;

				// Find the distance to the right:
				coords.x = SMAASearchXRight( edgesTex, searchTex, offset[ 0 ].zw, offset[ 2 ].y );
				d.y = coords.x;

				// We want the distances to be in pixel units (doing this here allow to
				// better interleave arithmetic and memory accesses):
				d = d / resolution.x - pixcoord.x;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the right crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 1, 0 ) ).r;

				// Ok, we know how this pattern looks like, now it is time for getting
				// the actual area:
				weights.rg = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.y ) );
			}

			if ( e.r > 0.0 ) { // Edge at west
				vec2 d;

				// Find the distance to the top:
				vec2 coords;

				coords.y = SMAASearchYUp( edgesTex, searchTex, offset[ 1 ].xy, offset[ 2 ].z );
				coords.x = offset[ 0 ].x; // offset[1].x = texcoord.x - 0.25 * resolution.x;
				d.x = coords.y;

				// Fetch the top crossing edges:
				float e1 = texture2D( edgesTex, coords, 0.0 ).g;

				// Find the distance to the bottom:
				coords.y = SMAASearchYDown( edgesTex, searchTex, offset[ 1 ].zw, offset[ 2 ].w );
				d.y = coords.y;

				// We want the distances to be in pixel units:
				d = d / resolution.y - pixcoord.y;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the bottom crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 0, 1 ) ).g;

				// Get the area for this direction:
				weights.ba = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.x ) );
			}

			return weights;
		}

		void main() {

			gl_FragColor = SMAABlendingWeightCalculationPS( vUv, vPixcoord, vOffset, tDiffuse, tArea, tSearch, ivec4( 0.0 ) );

		}`},Eo={uniforms:{tDiffuse:{value:null},tColor:{value:null},resolution:{value:new Me(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		void SMAANeighborhoodBlendingVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0, 1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( 1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAANeighborhoodBlendingVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform sampler2D tColor;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		vec4 SMAANeighborhoodBlendingPS( vec2 texcoord, vec4 offset[ 2 ], sampler2D colorTex, sampler2D blendTex ) {
			// Fetch the blending weights for current pixel:
			vec4 a;
			a.xz = texture2D( blendTex, texcoord ).xz;
			a.y = texture2D( blendTex, offset[ 1 ].zw ).g;
			a.w = texture2D( blendTex, offset[ 1 ].xy ).a;

			// Is there any blending weight with a value greater than 0.0?
			if ( dot(a, vec4( 1.0, 1.0, 1.0, 1.0 )) < 1e-5 ) {
				return texture2D( colorTex, texcoord, 0.0 );
			} else {
				// Up to 4 lines can be crossing a pixel (one through each edge). We
				// favor blending by choosing the line with the maximum weight for each
				// direction:
				vec2 offset;
				offset.x = a.a > a.b ? a.a : -a.b; // left vs. right
				offset.y = a.g > a.r ? -a.g : a.r; // top vs. bottom // WebGL port note: Changed signs

				// Then we go in the direction that has the maximum weight:
				if ( abs( offset.x ) > abs( offset.y )) { // horizontal vs. vertical
					offset.y = 0.0;
				} else {
					offset.x = 0.0;
				}

				// Fetch the opposite color and lerp by hand:
				vec4 C = texture2D( colorTex, texcoord, 0.0 );
				texcoord += sign( offset ) * resolution;
				vec4 Cop = texture2D( colorTex, texcoord, 0.0 );
				float s = abs( offset.x ) > abs( offset.y ) ? abs( offset.x ) : abs( offset.y );

				// WebGL port note: Added gamma correction
				C.xyz = pow(C.xyz, vec3(2.2));
				Cop.xyz = pow(Cop.xyz, vec3(2.2));
				vec4 mixed = mix(C, Cop, s);
				mixed.xyz = pow(mixed.xyz, vec3(1.0 / 2.2));

				return mixed;
			}
		}

		void main() {

			gl_FragColor = SMAANeighborhoodBlendingPS( vUv, vOffset, tColor, tDiffuse );

		}`};class lb extends Gn{constructor(){super(),this._edgesRT=new Lt(1,1,{depthBuffer:!1,type:Gt}),this._edgesRT.texture.name="SMAAPass.edges",this._weightsRT=new Lt(1,1,{depthBuffer:!1,type:Gt}),this._weightsRT.texture.name="SMAAPass.weights";const e=this,t=new Image;t.src=this._getAreaTexture(),t.onload=function(){e._areaTexture.needsUpdate=!0},this._areaTexture=new bt,this._areaTexture.name="SMAAPass.area",this._areaTexture.image=t,this._areaTexture.minFilter=ft,this._areaTexture.generateMipmaps=!1,this._areaTexture.flipY=!1;const i=new Image;i.src=this._getSearchTexture(),i.onload=function(){e._searchTexture.needsUpdate=!0},this._searchTexture=new bt,this._searchTexture.name="SMAAPass.search",this._searchTexture.image=i,this._searchTexture.magFilter=vt,this._searchTexture.minFilter=vt,this._searchTexture.generateMipmaps=!1,this._searchTexture.flipY=!1,this._uniformsEdges=fn.clone(ta.uniforms),this._materialEdges=new Et({defines:Object.assign({},ta.defines),uniforms:this._uniformsEdges,vertexShader:ta.vertexShader,fragmentShader:ta.fragmentShader}),this._uniformsWeights=fn.clone(ia.uniforms),this._uniformsWeights.tDiffuse.value=this._edgesRT.texture,this._uniformsWeights.tArea.value=this._areaTexture,this._uniformsWeights.tSearch.value=this._searchTexture,this._materialWeights=new Et({defines:Object.assign({},ia.defines),uniforms:this._uniformsWeights,vertexShader:ia.vertexShader,fragmentShader:ia.fragmentShader}),this._uniformsBlend=fn.clone(Eo.uniforms),this._uniformsBlend.tDiffuse.value=this._weightsRT.texture,this._materialBlend=new Et({uniforms:this._uniformsBlend,vertexShader:Eo.vertexShader,fragmentShader:Eo.fragmentShader}),this._fsQuad=new Ua(null)}render(e,t,i){this._uniformsEdges.tDiffuse.value=i.texture,this._fsQuad.material=this._materialEdges,e.setRenderTarget(this._edgesRT),this.clear&&e.clear(),this._fsQuad.render(e),this._fsQuad.material=this._materialWeights,e.setRenderTarget(this._weightsRT),this.clear&&e.clear(),this._fsQuad.render(e),this._uniformsBlend.tColor.value=i.texture,this._fsQuad.material=this._materialBlend,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(),this._fsQuad.render(e))}setSize(e,t){this._edgesRT.setSize(e,t),this._weightsRT.setSize(e,t),this._materialEdges.uniforms.resolution.value.set(1/e,1/t),this._materialWeights.uniforms.resolution.value.set(1/e,1/t),this._materialBlend.uniforms.resolution.value.set(1/e,1/t)}dispose(){this._edgesRT.dispose(),this._weightsRT.dispose(),this._areaTexture.dispose(),this._searchTexture.dispose(),this._materialEdges.dispose(),this._materialWeights.dispose(),this._materialBlend.dispose(),this._fsQuad.dispose()}_getAreaTexture(){return"data:image/png;base64,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"}_getSearchTexture(){return"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAhCAAAAABIXyLAAAAAOElEQVRIx2NgGAWjYBSMglEwEICREYRgFBZBqDCSLA2MGPUIVQETE9iNUAqLR5gIeoQKRgwXjwAAGn4AtaFeYLEAAAAASUVORK5CYII="}}let Qt,ln,di,Mi,Pn,nd="1x";const cb={"1x":{distanceMul:1,fovMul:1,targetY:0},"2x":{distanceMul:.72,fovMul:.9,targetY:.02},"4x":{distanceMul:.5,fovMul:.78,targetY:.05}};function hb(n){Qt=new Bv({antialias:!1,powerPreference:"high-performance"}),Qt.setSize(n.clientWidth,n.clientHeight),Qt.setPixelRatio(Math.min(window.devicePixelRatio,2)),Qt.outputColorSpace=Dt,Qt.toneMapping=Ca,Qt.toneMappingExposure=1,n.appendChild(Qt.domElement),ln=new Nu,ln.background=new Re(131589),di=new Ht(38,n.clientWidth/n.clientHeight,.001,50),di.position.set(0,.02,.52),ln.add(new Cp(16777215,.2));const e=new Cl(16775408,2);e.position.set(2,4,3),e.castShadow=!0,ln.add(e);const t=new Cl(8952319,1.2);t.position.set(-2,1,-2),ln.add(t);const i=new Ku(16777215,1,5);i.position.set(0,.5,1),ln.add(i),Pn=new sb(Qt),Pn.addPass(new rb(ln,di));const s=new Rs(new Me(n.clientWidth,n.clientHeight),.15,.4,.85);Pn.addPass(s);const r=new lb;Pn.addPass(r),Pn.addPass(new ob),Qt.domElement.style.pointerEvents="none",Mi=new Hv(di,n),Mi.enableDamping=!0,Mi.dampingFactor=.05,Mi.minDistance=.12,Mi.maxDistance=2,Mi.target.set(0,0,0),Mi.update(),mc();let a=null;new ResizeObserver(()=>{a&&clearTimeout(a),a=setTimeout(()=>db(n),100)}).observe(n)}function ub(){Pn.render()}function na(n){nd=n,mc()}function mc(){const n=di.aspect;let e,t;n<1?(e=Math.min(.52*(1/Math.sqrt(n)),1.2),t=38+(1-n)*12):(e=.52,t=38);const i=cb[nd];di.position.z=Math.max(.12,e*i.distanceMul),di.fov=Math.max(15,t*i.fovMul),Mi.target.set(0,i.targetY,0),di.updateProjectionMatrix(),Mi.update()}function db(n){const e=n.clientWidth,t=n.clientHeight;di.aspect=e/t,di.updateProjectionMatrix(),Qt.setSize(e,t),Pn.setSize(e,t),mc()}const fb=-2.5,pb=.3,Cs={},Js={},Ta={};function $s(n,e){Cs[n]=e,Js[n]=e.position.clone(),Ta[n]=e.position.clone()}function hs(n,e){if(!Cs[n]||!Js[n])return;const t=Cs[n];e?(t.position.copy(Js[n]),t.translateZ(fb),Ta[n].copy(t.position),t.position.copy(Js[n])):Ta[n].copy(Js[n])}function mb(){for(const n in Cs)Cs[n].position.lerp(Ta[n],pb)}function gb(){return Cs}const _b={DPAD:"touch-dpad",A:"touch-a",B:"touch-b",START:"touch-start",SELECT:"touch-select"},Ll={};let Jh=!1;function vb(){if(!Jh){Jh=!0;for(const[n,e]of Object.entries(_b)){const t=document.getElementById(e);t&&(Ll[n]=t)}}}function bb(){vb();const n=gb(),e=Qt.domElement.clientWidth/2,t=Qt.domElement.clientHeight/2,i=new L;for(const s in Ll){const r=n[s],a=Ll[s];if(!r||!a)continue;const o=r;o.geometry?(o.geometry.computeBoundingBox(),o.geometry.boundingBox?.getCenter(i),o.localToWorld(i)):r.getWorldPosition(i),i.project(di),a.style.left=`${i.x*e+e}px`,a.style.top=`${-i.y*t+t}px`}}function $h(n,e){if(e===Qd)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),n;if(e===Tl||e===Ru){let t=n.getIndex();if(t===null){const a=[],o=n.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);n.setIndex(a),t=n.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),n}const i=t.count-2,s=[];if(e===Tl)for(let a=1;a<=i;a++)s.push(t.getX(0)),s.push(t.getX(a)),s.push(t.getX(a+1));else for(let a=0;a<i;a++)a%2===0?(s.push(t.getX(a)),s.push(t.getX(a+1)),s.push(t.getX(a+2))):(s.push(t.getX(a+2)),s.push(t.getX(a+1)),s.push(t.getX(a)));s.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=n.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),n}function xb(n){const e=new Map,t=new Map,i=n.clone();return sd(n,i,function(s,r){e.set(r,s),t.set(s,r)}),i.traverse(function(s){if(!s.isSkinnedMesh)return;const r=s,a=e.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),i}function sd(n,e,t){t(n,e);for(let i=0;i<n.children.length;i++)sd(n.children[i],e.children[i],t)}class Sb extends Us{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Ab(t)}),this.register(function(t){return new wb(t)}),this.register(function(t){return new Ob(t)}),this.register(function(t){return new Fb(t)}),this.register(function(t){return new Bb(t)}),this.register(function(t){return new Cb(t)}),this.register(function(t){return new Pb(t)}),this.register(function(t){return new Db(t)}),this.register(function(t){return new Lb(t)}),this.register(function(t){return new Tb(t)}),this.register(function(t){return new Ib(t)}),this.register(function(t){return new Rb(t)}),this.register(function(t){return new Nb(t)}),this.register(function(t){return new Ub(t)}),this.register(function(t){return new yb(t)}),this.register(function(t){return new eu(t,Ve.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new eu(t,Ve.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new kb(t)})}load(e,t,i,s){const r=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=ir.extractUrlBase(e);a=ir.resolveURL(c,this.path)}else a=ir.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new ju(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},i,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,i,s){let r;const a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===rd){try{a[Ve.KHR_BINARY_GLTF]=new Hb(e)}catch(u){s&&s(u);return}r=JSON.parse(a[Ve.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new $b(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){const u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case Ve.KHR_MATERIALS_UNLIT:a[u]=new Eb;break;case Ve.KHR_DRACO_MESH_COMPRESSION:a[u]=new Gb(r,this.dracoLoader);break;case Ve.KHR_TEXTURE_TRANSFORM:a[u]=new zb;break;case Ve.KHR_MESH_QUANTIZATION:a[u]=new Vb;break;default:d.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(i,s)}parseAsync(e,t){const i=this;return new Promise(function(s,r){i.parse(e,t,s,r)})}}function Mb(){let n={};return{get:function(e){return n[e]},add:function(e,t){n[e]=t},remove:function(e){delete n[e]},removeAll:function(){n={}}}}function xt(n,e,t){const i=n.json.materials[e];return i.extensions&&i.extensions[t]?i.extensions[t]:null}const Ve={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class yb{constructor(e){this.parser=e,this.name=Ve.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let i=0,s=t.length;i<s;i++){const r=t[i];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,i="light:"+e;let s=t.cache.get(i);if(s)return s;const r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let c;const h=new Re(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],Vt);const u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Cl(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Ku(h),c.distance=u;break;case"spot":c=new Ap(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Si(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(i,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,i=this.parser,r=i.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return i._getNodeRef(t.cache,o,l)})}}class Eb{constructor(){this.name=Ve.KHR_MATERIALS_UNLIT}getMaterialType(){return Ci}extendParams(e,t,i){const s=[];e.color=new Re(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Vt),e.opacity=a[3]}r.baseColorTexture!==void 0&&s.push(i.assignTexture(e,"map",r.baseColorTexture,Dt))}return Promise.all(s)}}class Tb{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const i=xt(this.parser,e,this.name);return i===null||i.emissiveStrength!==void 0&&(t.emissiveIntensity=i.emissiveStrength),Promise.resolve()}}class Ab{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return xt(this.parser,e,this.name)!==null?gi:null}extendMaterialParams(e,t){const i=xt(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];if(i.clearcoatFactor!==void 0&&(t.clearcoat=i.clearcoatFactor),i.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",i.clearcoatTexture)),i.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=i.clearcoatRoughnessFactor),i.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",i.clearcoatRoughnessTexture)),i.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",i.clearcoatNormalTexture)),i.clearcoatNormalTexture.scale!==void 0)){const r=i.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Me(r,r)}return Promise.all(s)}}class wb{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_DISPERSION}getMaterialType(e){return xt(this.parser,e,this.name)!==null?gi:null}extendMaterialParams(e,t){const i=xt(this.parser,e,this.name);return i===null||(t.dispersion=i.dispersion!==void 0?i.dispersion:0),Promise.resolve()}}class Rb{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return xt(this.parser,e,this.name)!==null?gi:null}extendMaterialParams(e,t){const i=xt(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];return i.iridescenceFactor!==void 0&&(t.iridescence=i.iridescenceFactor),i.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",i.iridescenceTexture)),i.iridescenceIor!==void 0&&(t.iridescenceIOR=i.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),i.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=i.iridescenceThicknessMinimum),i.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=i.iridescenceThicknessMaximum),i.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",i.iridescenceThicknessTexture)),Promise.all(s)}}class Cb{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_SHEEN}getMaterialType(e){return xt(this.parser,e,this.name)!==null?gi:null}extendMaterialParams(e,t){const i=xt(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];if(t.sheenColor=new Re(0,0,0),t.sheenRoughness=0,t.sheen=1,i.sheenColorFactor!==void 0){const r=i.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],Vt)}return i.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=i.sheenRoughnessFactor),i.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",i.sheenColorTexture,Dt)),i.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",i.sheenRoughnessTexture)),Promise.all(s)}}class Pb{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return xt(this.parser,e,this.name)!==null?gi:null}extendMaterialParams(e,t){const i=xt(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];return i.transmissionFactor!==void 0&&(t.transmission=i.transmissionFactor),i.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",i.transmissionTexture)),Promise.all(s)}}class Db{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_VOLUME}getMaterialType(e){return xt(this.parser,e,this.name)!==null?gi:null}extendMaterialParams(e,t){const i=xt(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];t.thickness=i.thicknessFactor!==void 0?i.thicknessFactor:0,i.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",i.thicknessTexture)),t.attenuationDistance=i.attenuationDistance||1/0;const r=i.attenuationColor||[1,1,1];return t.attenuationColor=new Re().setRGB(r[0],r[1],r[2],Vt),Promise.all(s)}}class Lb{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_IOR}getMaterialType(e){return xt(this.parser,e,this.name)!==null?gi:null}extendMaterialParams(e,t){const i=xt(this.parser,e,this.name);return i===null||(t.ior=i.ior!==void 0?i.ior:1.5),Promise.resolve()}}class Ib{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_SPECULAR}getMaterialType(e){return xt(this.parser,e,this.name)!==null?gi:null}extendMaterialParams(e,t){const i=xt(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];t.specularIntensity=i.specularFactor!==void 0?i.specularFactor:1,i.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",i.specularTexture));const r=i.specularColorFactor||[1,1,1];return t.specularColor=new Re().setRGB(r[0],r[1],r[2],Vt),i.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",i.specularColorTexture,Dt)),Promise.all(s)}}class Ub{constructor(e){this.parser=e,this.name=Ve.EXT_MATERIALS_BUMP}getMaterialType(e){return xt(this.parser,e,this.name)!==null?gi:null}extendMaterialParams(e,t){const i=xt(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];return t.bumpScale=i.bumpFactor!==void 0?i.bumpFactor:1,i.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",i.bumpTexture)),Promise.all(s)}}class Nb{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return xt(this.parser,e,this.name)!==null?gi:null}extendMaterialParams(e,t){const i=xt(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];return i.anisotropyStrength!==void 0&&(t.anisotropy=i.anisotropyStrength),i.anisotropyRotation!==void 0&&(t.anisotropyRotation=i.anisotropyRotation),i.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",i.anisotropyTexture)),Promise.all(s)}}class Ob{constructor(e){this.parser=e,this.name=Ve.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,i=t.json,s=i.textures[e];if(!s.extensions||!s.extensions[this.name])return null;const r=s.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(i.extensionsRequired&&i.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}}class Fb{constructor(e){this.parser=e,this.name=Ve.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,i=this.parser,s=i.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=s.images[a.source];let l=i.textureLoader;if(o.uri){const c=i.options.manager.getHandler(o.uri);c!==null&&(l=c)}return i.loadTextureImage(e,a.source,l)}}class Bb{constructor(e){this.parser=e,this.name=Ve.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,i=this.parser,s=i.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=s.images[a.source];let l=i.textureLoader;if(o.uri){const c=i.options.manager.getHandler(o.uri);c!==null&&(l=c)}return i.loadTextureImage(e,a.source,l)}}class eu{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,i=t.bufferViews[e];if(i.extensions&&i.extensions[this.name]){const s=i.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){const l=s.byteOffset||0,c=s.byteLength||0,h=s.count,u=s.byteStride,d=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,d,s.mode,s.filter).then(function(f){return f.buffer}):a.ready.then(function(){const f=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(f),h,u,d,s.mode,s.filter),f})})}else return null}}class kb{constructor(e){this.name=Ve.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,i=t.nodes[e];if(!i.extensions||!i.extensions[this.name]||i.mesh===void 0)return null;const s=t.meshes[i.mesh];for(const c of s.primitives)if(c.mode!==ni.TRIANGLES&&c.mode!==ni.TRIANGLE_STRIP&&c.mode!==ni.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=i.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const h=c.pop(),u=h.isGroup?h.children:[h],d=c[0].count,f=[];for(const g of u){const _=new Be,m=new L,p=new mi,b=new L(1,1,1),M=new Qf(g.geometry,g.material,d);for(let y=0;y<d;y++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,y),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,y),l.SCALE&&b.fromBufferAttribute(l.SCALE,y),M.setMatrixAt(y,_.compose(m,p,b));for(const y in l)if(y==="_COLOR_0"){const A=l[y];M.instanceColor=new wl(A.array,A.itemSize,A.normalized)}else y!=="TRANSLATION"&&y!=="ROTATION"&&y!=="SCALE"&&g.geometry.setAttribute(y,l[y]);pt.prototype.copy.call(M,g),this.parser.assignFinalMaterial(M),f.push(M)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const rd="glTF",qs=12,tu={JSON:1313821514,BIN:5130562};class Hb{constructor(e){this.name=Ve.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,qs),i=new TextDecoder;if(this.header={magic:i.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==rd)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const s=this.header.length-qs,r=new DataView(e,qs);let a=0;for(;a<s;){const o=r.getUint32(a,!0);a+=4;const l=r.getUint32(a,!0);if(a+=4,l===tu.JSON){const c=new Uint8Array(e,qs+a,o);this.content=i.decode(c)}else if(l===tu.BIN){const c=qs+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class Gb{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ve.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const i=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const h in a){const u=Il[h]||h.toLowerCase();o[u]=a[h]}for(const h in e.attributes){const u=Il[h]||h.toLowerCase();if(a[h]!==void 0){const d=i.accessors[e.attributes[h]],f=vs[d.componentType];c[u]=f.name,l[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){s.decodeDracoFile(h,function(f){for(const g in f.attributes){const _=f.attributes[g],m=l[g];m!==void 0&&(_.normalized=m)}u(f)},o,c,Vt,d)})})}}class zb{constructor(){this.name=Ve.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class Vb{constructor(){this.name=Ve.KHR_MESH_QUANTIZATION}}class ad extends Ds{constructor(e,t,i,s){super(e,t,i,s)}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let a=0;a!==s;a++)t[a]=i[r+a];return t}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=s-t,u=(i-t)/h,d=u*u,f=d*u,g=e*c,_=g-c,m=-2*f+3*d,p=f-d,b=1-m,M=p-d+u;for(let y=0;y!==o;y++){const A=a[_+y+o],w=a[_+y+l]*h,C=a[g+y+o],x=a[g+y]*h;r[y]=b*A+M*w+m*C+p*x}return r}}const Wb=new mi;class Xb extends ad{interpolate_(e,t,i,s){const r=super.interpolate_(e,t,i,s);return Wb.fromArray(r).normalize().toArray(r),r}}const ni={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},vs={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},iu={9728:vt,9729:ft,9984:Su,9985:ua,9986:Zs,9987:ji},nu={33071:wi,33648:ba,10497:Ss},To={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Il={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},on={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},qb={CUBICSPLINE:void 0,LINEAR:cr,STEP:lr},Ao={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function jb(n){return n.DefaultMaterial===void 0&&(n.DefaultMaterial=new hc({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Ii})),n.DefaultMaterial}function An(n,e,t){for(const i in t.extensions)n[i]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[i]=t.extensions[i])}function Si(n,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(n.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Yb(n,e,t){let i=!1,s=!1,r=!1;for(let c=0,h=e.length;c<h;c++){const u=e[c];if(u.POSITION!==void 0&&(i=!0),u.NORMAL!==void 0&&(s=!0),u.COLOR_0!==void 0&&(r=!0),i&&s&&r)break}if(!i&&!s&&!r)return Promise.resolve(n);const a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){const u=e[c];if(i){const d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):n.attributes.position;a.push(d)}if(s){const d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):n.attributes.normal;o.push(d)}if(r){const d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):n.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const h=c[0],u=c[1],d=c[2];return i&&(n.morphAttributes.position=h),s&&(n.morphAttributes.normal=u),r&&(n.morphAttributes.color=d),n.morphTargetsRelative=!0,n})}function Kb(n,e){if(n.updateMorphTargets(),e.weights!==void 0)for(let t=0,i=e.weights.length;t<i;t++)n.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(n.morphTargetInfluences.length===t.length){n.morphTargetDictionary={};for(let i=0,s=t.length;i<s;i++)n.morphTargetDictionary[t[i]]=i}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Zb(n){let e;const t=n.extensions&&n.extensions[Ve.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+wo(t.attributes):e=n.indices+":"+wo(n.attributes)+":"+n.mode,n.targets!==void 0)for(let i=0,s=n.targets.length;i<s;i++)e+=":"+wo(n.targets[i]);return e}function wo(n){let e="";const t=Object.keys(n).sort();for(let i=0,s=t.length;i<s;i++)e+=t[i]+":"+n[t[i]]+";";return e}function Ul(n){switch(n){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Qb(n){return n.search(/\.jpe?g($|\?)/i)>0||n.search(/^data\:image\/jpeg/)===0?"image/jpeg":n.search(/\.webp($|\?)/i)>0||n.search(/^data\:image\/webp/)===0?"image/webp":n.search(/\.ktx2($|\?)/i)>0||n.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const Jb=new Be;class $b{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Mb,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let i=!1,s=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const o=navigator.userAgent;i=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);s=i&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||i&&s<17||r&&a<98?this.textureLoader=new Ep(this.options.manager):this.textureLoader=new Pp(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new ju(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const i=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([i.getDependencies("scene"),i.getDependencies("animation"),i.getDependencies("camera")])}).then(function(a){const o={scene:a[0][s.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:s.asset,parser:i,userData:{}};return An(r,o,s),Si(o,s),Promise.all(i._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],i=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){const a=t[s].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let s=0,r=e.length;s<r;s++){const a=e[s];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(i[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,i){if(e.refs[t]<=1)return i;const s=i.clone(),r=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,h]of a.children.entries())r(h,o.children[c])};return r(i,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let i=0;i<t.length;i++){const s=e(t[i]);if(s)return s}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const i=[];for(let s=0;s<t.length;s++){const r=e(t[s]);r&&i.push(r)}return i}getDependency(e,t){const i=e+":"+t;let s=this.cache.get(i);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(i,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){const i=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,a){return i.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],i=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ve.KHR_BINARY_GLTF].body);const s=this.options;return new Promise(function(r,a){i.load(ir.resolveURL(t.uri,s.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(i){const s=t.byteLength||0,r=t.byteOffset||0;return i.slice(r,r+s)})}loadAccessor(e){const t=this,i=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){const a=To[s.type],o=vs[s.componentType],l=s.normalized===!0,c=new o(s.count*a);return Promise.resolve(new zt(c,a,l))}const r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(a){const o=a[0],l=To[s.type],c=vs[s.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,d=s.byteOffset||0,f=s.bufferView!==void 0?i.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0;let _,m;if(f&&f!==u){const p=Math.floor(d/f),b="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count;let M=t.cache.get(b);M||(_=new c(o,p*f,s.count*f/h),M=new Wf(_,f/h),t.cache.add(b,M)),m=new rc(M,l,d%f/h,g)}else o===null?_=new c(s.count*l):_=new c(o,d,s.count*l),m=new zt(_,l,g);if(s.sparse!==void 0){const p=To.SCALAR,b=vs[s.sparse.indices.componentType],M=s.sparse.indices.byteOffset||0,y=s.sparse.values.byteOffset||0,A=new b(a[1],M,s.sparse.count*p),w=new c(a[2],y,s.sparse.count*l);o!==null&&(m=new zt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let C=0,x=A.length;C<x;C++){const E=A[C];if(m.setX(E,w[C*l]),l>=2&&m.setY(E,w[C*l+1]),l>=3&&m.setZ(E,w[C*l+2]),l>=4&&m.setW(E,w[C*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,i=this.options,r=t.textures[e].source,a=t.images[r];let o=this.textureLoader;if(a.uri){const l=i.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,i){const s=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,i).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const d=(r.samplers||{})[a.sampler]||{};return h.magFilter=iu[d.magFilter]||ft,h.minFilter=iu[d.minFilter]||ji,h.wrapS=nu[d.wrapS]||Ss,h.wrapT=nu[d.wrapT]||Ss,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==vt&&h.minFilter!==ft,s.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const i=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const a=s.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=i.getDependency("bufferView",a.bufferView).then(function(u){c=!0;const d=new Blob([u],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(l).then(function(u){return new Promise(function(d,f){let g=d;t.isImageBitmapLoader===!0&&(g=function(_){const m=new bt(_);m.needsUpdate=!0,d(m)}),t.load(ir.resolveURL(u,r.path),g,void 0,f)})}).then(function(u){return c===!0&&o.revokeObjectURL(l),Si(u,a),u.userData.mimeType=a.mimeType||Qb(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,i,s){const r=this;return this.getDependency("texture",i.index).then(function(a){if(!a)return null;if(i.texCoord!==void 0&&i.texCoord>0&&(a=a.clone(),a.channel=i.texCoord),r.extensions[Ve.KHR_TEXTURE_TRANSFORM]){const o=i.extensions!==void 0?i.extensions[Ve.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=r.associations.get(a);a=r.extensions[Ve.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return s!==void 0&&(a.colorSpace=s),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let i=e.material;const s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+i.uuid;let l=this.cache.get(o);l||(l=new Hu,Li.prototype.copy.call(l,i),l.color.copy(i.color),l.map=i.map,l.sizeAttenuation=!1,this.cache.add(o,l)),i=l}else if(e.isLine){const o="LineBasicMaterial:"+i.uuid;let l=this.cache.get(o);l||(l=new ku,Li.prototype.copy.call(l,i),l.color.copy(i.color),l.map=i.map,this.cache.add(o,l)),i=l}if(s||r||a){let o="ClonedMaterial:"+i.uuid+":";s&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=i.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(i))),i=l}e.material=i}getMaterialType(){return hc}loadMaterial(e){const t=this,i=this.json,s=this.extensions,r=i.materials[e];let a;const o={},l=r.extensions||{},c=[];if(l[Ve.KHR_MATERIALS_UNLIT]){const u=s[Ve.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,r,t))}else{const u=r.pbrMetallicRoughness||{};if(o.color=new Re(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){const d=u.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],Vt),o.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,Dt)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Ai);const h=r.alphaMode||Ao.OPAQUE;if(h===Ao.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Ao.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==Ci&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new Me(1,1),r.normalTexture.scale!==void 0)){const u=r.normalTexture.scale;o.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&a!==Ci&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==Ci){const u=r.emissiveFactor;o.emissive=new Re().setRGB(u[0],u[1],u[2],Vt)}return r.emissiveTexture!==void 0&&a!==Ci&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,Dt)),Promise.all(c).then(function(){const u=new a(o);return r.name&&(u.name=r.name),Si(u,r),t.associations.set(u,{materials:e}),r.extensions&&An(s,u,r),u})}createUniqueName(e){const t=tt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,i=this.extensions,s=this.primitiveCache;function r(o){return i[Ve.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return su(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],h=Zb(c),u=s[h];if(u)a.push(u.promise);else{let d;c.extensions&&c.extensions[Ve.KHR_DRACO_MESH_COMPRESSION]?d=r(c):d=su(new ti,c,t),s[h]={primitive:c,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){const t=this,i=this.json,s=this.extensions,r=i.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const h=a[l].material===void 0?jb(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){const c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let f=0,g=h.length;f<g;f++){const _=h[f],m=a[f];let p;const b=c[f];if(m.mode===ni.TRIANGLES||m.mode===ni.TRIANGLE_STRIP||m.mode===ni.TRIANGLE_FAN||m.mode===void 0)p=r.isSkinnedMesh===!0?new Yf(_,b):new Wt(_,b),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),m.mode===ni.TRIANGLE_STRIP?p.geometry=$h(p.geometry,Ru):m.mode===ni.TRIANGLE_FAN&&(p.geometry=$h(p.geometry,Tl));else if(m.mode===ni.LINES)p=new tp(_,b);else if(m.mode===ni.LINE_STRIP)p=new cc(_,b);else if(m.mode===ni.LINE_LOOP)p=new ip(_,b);else if(m.mode===ni.POINTS)p=new np(_,b);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&Kb(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),Si(p,r),m.extensions&&An(s,p,m),t.assignFinalMaterial(p),u.push(p)}for(let f=0,g=u.length;f<g;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&An(s,u[0],r),u[0];const d=new Ln;r.extensions&&An(s,d,r),t.associations.set(d,{meshes:e});for(let f=0,g=u.length;f<g;f++)d.add(u[f]);return d})}loadCamera(e){let t;const i=this.json.cameras[e],s=i[i.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return i.type==="perspective"?t=new Ht(Du.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):i.type==="orthographic"&&(t=new Ns(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),i.name&&(t.name=this.createUniqueName(i.name)),Si(t,i),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],i=[];for(let s=0,r=t.joints.length;s<r;s++)i.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?i.push(this.getDependency("accessor",t.inverseBindMatrices)):i.push(null),Promise.all(i).then(function(s){const r=s.pop(),a=s,o=[],l=[];for(let c=0,h=a.length;c<h;c++){const u=a[c];if(u){o.push(u);const d=new Be;r!==null&&d.fromArray(r.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new oc(o,l)})}loadAnimation(e){const t=this.json,i=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,d=s.channels.length;u<d;u++){const f=s.channels[u],g=s.samplers[f.sampler],_=f.target,m=_.node,p=s.parameters!==void 0?s.parameters[g.input]:g.input,b=s.parameters!==void 0?s.parameters[g.output]:g.output;_.node!==void 0&&(a.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",b)),c.push(g),h.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){const d=u[0],f=u[1],g=u[2],_=u[3],m=u[4],p=[];for(let M=0,y=d.length;M<y;M++){const A=d[M],w=f[M],C=g[M],x=_[M],E=m[M];if(A===void 0)continue;A.updateMatrix&&A.updateMatrix();const W=i._createAnimationTracks(A,w,C,x,E);if(W)for(let R=0;R<W.length;R++)p.push(W[R])}const b=new _p(r,void 0,p);return Si(b,s),b})}createNodeMesh(e){const t=this.json,i=this,s=t.nodes[e];return s.mesh===void 0?null:i.getDependency("mesh",s.mesh).then(function(r){const a=i._getNodeRef(i.meshCache,s.mesh,r);return s.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=s.weights.length;l<c;l++)o.morphTargetInfluences[l]=s.weights[l]}),a})}loadNode(e){const t=this.json,i=this,s=t.nodes[e],r=i._loadNodeShallow(e),a=[],o=s.children||[];for(let c=0,h=o.length;c<h;c++)a.push(i.getDependency("node",o[c]));const l=s.skin===void 0?Promise.resolve(null):i.getDependency("skin",s.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){const h=c[0],u=c[1],d=c[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,Jb)});for(let f=0,g=u.length;f<g;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){const f=h.userData.pivot,g=u[0];h.pivot=new L().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],g.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,i=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],a=r.name?s.createUniqueName(r.name):"",o=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(r.isBone===!0?h=new Bu:c.length>1?h=new Ln:c.length===1?h=c[0]:h=new pt,h!==c[0])for(let u=0,d=c.length;u<d;u++)h.add(c[u]);if(r.name&&(h.userData.name=r.name,h.name=a),Si(h,r),r.extensions&&An(i,h,r),r.matrix!==void 0){const u=new Be;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!s.associations.has(h))s.associations.set(h,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){const u=s.associations.get(h);s.associations.set(h,{...u})}return s.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,i=this.json.scenes[e],s=this,r=new Ln;i.name&&(r.name=s.createUniqueName(i.name)),Si(r,i),i.extensions&&An(t,r,i);const a=i.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(s.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++){const d=l[h];d.parent!==null?r.add(xb(d)):r.add(d)}const c=h=>{const u=new Map;for(const[d,f]of s.associations)(d instanceof Li||d instanceof bt)&&u.set(d,f);return h.traverse(d=>{const f=s.associations.get(d);f!=null&&u.set(d,f)}),u};return s.associations=c(r),r})}_createAnimationTracks(e,t,i,s,r){const a=[],o=e.name?e.name:e.uuid,l=[];on[r.path]===on.weights?e.traverse(function(d){d.morphTargetInfluences&&l.push(d.name?d.name:d.uuid)}):l.push(o);let c;switch(on[r.path]){case on.weights:c=Ts;break;case on.rotation:c=As;break;case on.translation:case on.scale:c=ws;break;default:i.itemSize===1?c=Ts:c=ws;break}const h=s.interpolation!==void 0?qb[s.interpolation]:cr,u=this._getArrayFromAccessor(i);for(let d=0,f=l.length;d<f;d++){const g=new c(l[d]+"."+on[r.path],t.array,u,h);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),a.push(g)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const i=Ul(t.constructor),s=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)s[r]=t[r]*i;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(i){const s=this instanceof As?Xb:ad;return new s(this.times,this.values,this.getValueSize()/3,i)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function ex(n,e,t){const i=e.attributes,s=new Oi;if(i.POSITION!==void 0){const o=t.json.accessors[i.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(s.set(new L(l[0],l[1],l[2]),new L(c[0],c[1],c[2])),o.normalized){const h=Ul(vs[o.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const o=new L,l=new L;for(let c=0,h=r.length;c<h;c++){const u=r[c];if(u.POSITION!==void 0){const d=t.json.accessors[u.POSITION],f=d.min,g=d.max;if(f!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),d.normalized){const _=Ul(vs[d.componentType]);l.multiplyScalar(_)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}n.boundingBox=s;const a=new Fi;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,n.boundingSphere=a}function su(n,e,t){const i=e.attributes,s=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){n.setAttribute(o,l)})}for(const a in i){const o=Il[a]||a.toLowerCase();o in n.attributes||s.push(r(i[a],o))}if(e.indices!==void 0&&!n.index){const a=t.getDependency("accessor",e.indices).then(function(o){n.setIndex(o)});s.push(a)}return We.workingColorSpace!==Vt&&"COLOR_0"in i&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${We.workingColorSpace}" not supported.`),Si(n,e),ex(n,e,t),Promise.all(s).then(function(){return e.targets!==void 0?Yb(n,e.targets,t):n})}const tx="./assets/models/gb.glb",js="screen_low_External_0",ix=.22;let Ro=null;function nx(n){new Sb().load(tx,e=>sx(e,n),e=>{e.total&&console.log(`[Model] GLB ${Math.round(e.loaded/e.total*100)}%`)},n.onError)}function sx(n,e){const t=n.scene,i=new Oi().setFromObject(t),s=new L;i.getSize(s),t.scale.setScalar(ix/Math.max(s.x,s.y,s.z)),i.setFromObject(t);const r=new L;i.getCenter(r),t.position.sub(r),ln.add(t),t.updateWorldMatrix(!0,!0);let a=null;t.traverse(o=>{if(!o.isMesh)return;const l=o;switch(l.name){case js:a=l;break;case"a_low_External_0":$s("A",l);break;case"b_low_External_0":$s("B",l);break;case"select_low_External_0":$s("SELECT",l),ax(l);break;case"movement_low_External_0":case"movementknobs_low_External_0":$s("DPAD",l);break}l.name!==js&&rx(l)}),a?(console.log(`[Model] ✓ Found "${js}" — ready for texture.`),Ro=new Ci({color:8978380,side:Ii,depthWrite:!0}),a.material=Ro,e.onScreenReady(Ro)):(console.error(`[Model] ✗ "${js}" not found in GLB.`),e.onError(new Error(`Mesh "${js}" not found`)))}function rx(n){if(!n.material)return;const e=Array.isArray(n.material)?n.material[0]:n.material,t=new gi({color:e.color,map:e.map,roughness:.45,metalness:.05,reflectivity:.5,clearcoat:.12,clearcoatRoughness:.2,sheen:.5,sheenRoughness:.8,sheenColor:new Re(16777215)});n.material=t,t.needsUpdate=!0}function ax(n){const e=n.parent;if(!e)return;n.updateWorldMatrix(!0,!0),n.geometry.computeBoundingBox();const t=new L;n.geometry.boundingBox.getSize(t);const i=n.clone();i.name="start_anchor",i.visible=!1,i.position.copy(n.position),i.position.x+=t.x*2.5,e.add(i),$s("START",i)}const od="HIP-ROMTEST.gb",ox=32768;function lx(){const n=new Uint8Array(ox);n[323]=0,n[327]=0,n[328]=0,n[329]=0;const e=[];let t=256;const i=new Map,s=[],r=[],a=(...f)=>{for(const g of f)e.push(g&255),t++},o=f=>{i.set(f,t)},l=f=>{a(24,0),s.push({pos:e.length-1,label:f})},c=f=>{a(32,0),s.push({pos:e.length-1,label:f})},h=f=>{a(17,0,0),r.push({pos:e.length-2,label:f})},u=f=>{a(195,0,0),r.push({pos:e.length-2,label:f})};a(62,79,234,1,255,62,129,234,2,255,62,75,234,1,255,62,129,234,2,255,6,3,14,5,22,8,30,13,38,21,46,34,64,62,0,234,64,255,33,0,128),h("tile_data"),a(1,224,0),o("copy_tiles_loop"),a(26,34,19,11,120,177),c("copy_tiles_loop"),a(33,6,153),h("map_data"),a(1,7,0),o("copy_map_loop"),a(26,34,19,11,120,177),c("copy_map_loop"),a(33,196,153),h("footer_data"),a(1,12,0),o("copy_footer_loop"),a(26,34,19,11,120,177),c("copy_footer_loop"),a(62,228,234,71,255,62,145,234,64,255,6,4),o("blink_loop"),a(62,228,234,71,255,14,32),o("delay_a_outer"),a(22,255),o("delay_a_inner"),a(21),c("delay_a_inner"),a(13),c("delay_a_outer"),a(62,27,234,71,255,14,32),o("delay_b_outer"),a(22,255),o("delay_b_inner"),a(21),c("delay_b_inner"),a(13),c("delay_b_outer"),a(5),c("blink_loop"),a(62,228,234,71,255),u("idle"),o("tile_data");const d=[[0,0,0,0,0,0,0,0],[129,129,129,255,129,129,129,0],[255,24,24,24,24,24,255,0],[254,129,129,254,128,128,128,0],[126,129,128,159,129,129,126,0],[254,129,129,254,129,129,254,0],[255,128,128,254,128,128,255,0],[60,66,153,161,161,153,66,60],[126,129,129,255,129,129,129,0],[254,129,129,129,129,129,254,0],[255,128,128,252,3,3,254,0],[60,66,2,60,64,64,126,0],[126,129,131,133,137,145,126,0],[126,128,128,252,130,130,124,0]];for(const f of d)for(const g of f)a(g,g);o("map_data"),a(1,2,3,0,4,5,6),o("footer_data"),a(7,0,1,8,9,6,10,0,11,12,11,13),o("idle"),l("idle");for(const f of r){const g=i.get(f.label);if(g==null)throw new Error(`Missing label: ${f.label}`);const _=g&255,m=g>>8&255;e[f.pos]=_,e[f.pos+1]=m}for(const f of s){const g=i.get(f.label);if(g==null)throw new Error(`Missing label: ${f.label}`);const _=256+f.pos+1,m=g-_;if(m<-128||m>127)throw new Error(`JR out of range to ${f.label}: ${m}`);e[f.pos]=m&255}return n.set(e,256),n}const yt={Right:0,Left:1,Up:2,Down:3,A:4,B:5,Select:6,Start:7};class ru{rom;constructor(e){this.rom=e}read(e){return this.rom[e]}write(e,t){}getRAM(){return null}setRAM(e){}saveState(){return{type:"MBC0"}}loadState(e){}}class cx{rom;ram;romBankLow5=1;bankHigh2=0;ramEnabled=!1;mode=0;constructor(e,t){this.rom=e,this.ram=new Uint8Array(t)}read(e){if(e>=0&&e<=16383){const i=(this.mode===0?0:this.bankHigh2<<5)*16384+e;return this.rom[i%this.rom.length]}if(e>=16384&&e<=32767){let t=this.bankHigh2<<5|this.romBankLow5;(t&31)===0&&(t+=1);const i=t*16384+(e-16384);return this.rom[i%this.rom.length]}if(e>=40960&&e<=49151){if(!this.ramEnabled||this.ram.length===0)return 255;const i=(this.mode===0?0:this.bankHigh2)*8192+(e-40960);return this.ram[i%this.ram.length]}return 255}write(e,t){if(e>=0&&e<=8191)this.ramEnabled=(t&15)===10;else if(e>=8192&&e<=16383){let i=t&31;i===0&&(i=1),this.romBankLow5=i}else if(e>=16384&&e<=24575)this.bankHigh2=t&3;else if(e>=24576&&e<=32767)this.mode=t&1;else if(e>=40960&&e<=49151&&this.ramEnabled&&this.ram.length>0){const s=(this.mode===0?0:this.bankHigh2)*8192+(e-40960);this.ram[s%this.ram.length]=t}}getRAM(){return this.ram}setRAM(e){e.length===this.ram.length&&this.ram.set(e)}saveState(){return{type:"MBC1",ram:Array.from(this.ram),romBank:this.bankHigh2<<5|this.romBankLow5,ramBank:this.mode===0?0:this.bankHigh2,ramEnabled:this.ramEnabled,mode:this.mode}}loadState(e){this.ram.set(e.ram);const t=e.romBank||1;this.romBankLow5=t&31,this.romBankLow5===0&&(this.romBankLow5=1),this.bankHigh2=t>>5&3,this.ramEnabled=e.ramEnabled,this.mode=e.mode}}class hx{rom;ram;romBank=1;ramBank=0;ramEnabled=!1;rtcSeconds=0;rtcMinutes=0;rtcHours=0;rtcDaysLow=0;rtcDaysHigh=0;latchedRtc=[0,0,0,0,0];rtcLatchState=255;constructor(e,t){this.rom=e,this.ram=new Uint8Array(t)}read(e){if(e>=0&&e<=16383)return this.rom[e];if(e>=16384&&e<=32767){const t=this.romBank*16384+(e-16384);return this.rom[t%this.rom.length]}if(e>=40960&&e<=49151){if(!this.ramEnabled)return 255;if(this.ramBank<=3){if(this.ram.length===0)return 255;const t=this.ramBank*8192+(e-40960);return this.ram[t%this.ram.length]}else if(this.ramBank>=8&&this.ramBank<=12)return this.latchedRtc[this.ramBank-8]}return 255}write(e,t){if(e>=0&&e<=8191)this.ramEnabled=(t&15)===10;else if(e>=8192&&e<=16383)this.romBank=t&127,this.romBank===0&&(this.romBank=1);else if(e>=16384&&e<=24575)this.ramBank=t;else if(e>=24576&&e<=32767)this.rtcLatchState===0&&t===1&&(this.latchedRtc[0]=this.rtcSeconds,this.latchedRtc[1]=this.rtcMinutes,this.latchedRtc[2]=this.rtcHours,this.latchedRtc[3]=this.rtcDaysLow,this.latchedRtc[4]=this.rtcDaysHigh),this.rtcLatchState=t;else if(e>=40960&&e<=49151&&this.ramEnabled){if(this.ramBank<=3){if(this.ram.length>0){const i=this.ramBank*8192+(e-40960);this.ram[i%this.ram.length]=t}}else if(this.ramBank>=8&&this.ramBank<=12)switch(this.ramBank){case 8:this.rtcSeconds=t;break;case 9:this.rtcMinutes=t;break;case 10:this.rtcHours=t;break;case 11:this.rtcDaysLow=t;break;case 12:this.rtcDaysHigh=t;break}}}rtcCycles=0;tickRTC(e){if(!(this.rtcDaysHigh&64))for(this.rtcCycles+=e;this.rtcCycles>=128;)this.rtcCycles-=128,this.incrementRTC()}incrementRTC(){if(this.internalRTCValue++,this.internalRTCValue>=32768&&(this.internalRTCValue=0,this.rtcSeconds++,this.rtcSeconds>=60&&(this.rtcSeconds=0,this.rtcMinutes++,this.rtcMinutes>=60&&(this.rtcMinutes=0,this.rtcHours++,this.rtcHours>=24)))){this.rtcHours=0;let e=this.rtcDaysLow|(this.rtcDaysHigh&1)<<8;e++,e>=512&&(e=0,this.rtcDaysHigh|=128),this.rtcDaysLow=e&255,this.rtcDaysHigh=this.rtcDaysHigh&254|e>>8&1}}internalRTCValue=0;getRAM(){return this.ram}setRAM(e){e.length===this.ram.length&&this.ram.set(e)}saveState(){return{type:"MBC3",ram:Array.from(this.ram),romBank:this.romBank,ramBank:this.ramBank,ramEnabled:this.ramEnabled,rtcSeconds:this.rtcSeconds,rtcMinutes:this.rtcMinutes,rtcHours:this.rtcHours,rtcDaysLow:this.rtcDaysLow,rtcDaysHigh:this.rtcDaysHigh,latchedRtc:[...this.latchedRtc],rtcLatchState:this.rtcLatchState,rtcCycles:this.rtcCycles,internalRTCValue:this.internalRTCValue}}loadState(e){this.ram.set(e.ram),this.romBank=e.romBank,this.ramBank=e.ramBank,this.ramEnabled=e.ramEnabled,this.rtcSeconds=e.rtcSeconds,this.rtcMinutes=e.rtcMinutes,this.rtcHours=e.rtcHours,this.rtcDaysLow=e.rtcDaysLow,this.rtcDaysHigh=e.rtcDaysHigh,this.latchedRtc=[...e.latchedRtc],this.rtcLatchState=e.rtcLatchState,this.rtcCycles=e.rtcCycles||0,this.internalRTCValue=e.internalRTCValue||0}}class ux{rom;ram;romBank=1;ramBank=0;ramEnabled=!1;constructor(e,t){this.rom=e,this.ram=new Uint8Array(t)}read(e){if(e>=0&&e<=16383)return this.rom[e];if(e>=16384&&e<=32767){const t=this.romBank*16384+(e-16384);return this.rom[t%this.rom.length]}if(e>=40960&&e<=49151){if(!this.ramEnabled||this.ram.length===0)return 255;const t=this.ramBank*8192+(e-40960);return this.ram[t%this.ram.length]}return 255}write(e,t){if(e>=0&&e<=8191)this.ramEnabled=(t&15)===10;else if(e>=8192&&e<=12287)this.romBank=this.romBank&256|t;else if(e>=12288&&e<=16383)this.romBank=this.romBank&255|(t&1)<<8;else if(e>=16384&&e<=24575)this.ramBank=t&15;else if(e>=40960&&e<=49151&&this.ramEnabled&&this.ram.length>0){const i=this.ramBank*8192+(e-40960);this.ram[i%this.ram.length]=t}}getRAM(){return this.ram}setRAM(e){e.length===this.ram.length&&this.ram.set(e)}saveState(){return{type:"MBC5",ram:Array.from(this.ram),romBank:this.romBank,ramBank:this.ramBank,ramEnabled:this.ramEnabled}}loadState(e){this.ram.set(e.ram),this.romBank=e.romBank,this.ramBank=e.ramBank,this.ramEnabled=e.ramEnabled}}class dx{rom;ram;romBank=1;ramBank=0;ramEnabled=!1;mode=0;constructor(e,t){this.rom=e,this.ram=new Uint8Array(t)}read(e){if(e>=0&&e<=16383)return this.rom[e];if(e>=16384&&e<=32767){const t=this.romBank*16384+(e-16384);return this.rom[t%this.rom.length]}if(e>=40960&&e<=49151){if(this.mode===1)return 193;if(!this.ramEnabled||this.ram.length===0)return 255;const t=this.ramBank*8192+(e-40960);return this.ram[t%this.ram.length]}return 255}write(e,t){if(e>=0&&e<=8191)t===14?this.mode=1:(this.mode=0,this.ramEnabled=(t&15)===10);else if(e>=8192&&e<=16383)this.romBank=t&63,this.romBank===0&&(this.romBank=1);else if(e>=16384&&e<=24575)this.ramBank=t&3;else if(e>=40960&&e<=49151&&this.mode===0&&this.ramEnabled&&this.ram.length>0){const i=this.ramBank*8192+(e-40960);this.ram[i%this.ram.length]=t}}getRAM(){return this.ram}setRAM(e){e.length===this.ram.length&&this.ram.set(e)}saveState(){return{type:"HuC1",ram:Array.from(this.ram),romBank:this.romBank,ramBank:this.ramBank,ramEnabled:this.ramEnabled,mode:this.mode}}loadState(e){this.ram.set(e.ram),this.romBank=e.romBank,this.ramBank=e.ramBank,this.ramEnabled=e.ramEnabled,this.mode=e.mode}}class fx{rom;ram;romBank=1;ramEnabled1=!1;ramEnabled2=!1;accX=33232;accY=33232;latchedX=33232;latchedY=33232;latchStep=0;constructor(e){this.rom=e,this.ram=new Uint8Array(256)}read(e){if(e>=0&&e<=16383)return this.rom[e];if(e>=16384&&e<=32767){const t=this.romBank*16384+(e-16384);return this.rom[t%this.rom.length]}if(e>=40960&&e<=45055){if(!this.ramEnabled1||!this.ramEnabled2)return 255;switch(e>>4&15){case 2:return this.latchedX&255;case 3:return this.latchedX>>8&255;case 4:return this.latchedY&255;case 5:return this.latchedY>>8&255;case 6:return 0;case 7:return 255;case 8:return 1;default:return 255}}return 255}write(e,t){if(e>=0&&e<=8191)this.ramEnabled1=(t&15)===10;else if(e>=8192&&e<=16383)this.romBank=t&127,this.romBank===0&&(this.romBank=1);else if(e>=16384&&e<=24575)this.ramEnabled2=(t&15)===10;else if(e>=40960&&e<=45055){const i=e>>4&15;i===0?t===85&&(this.latchStep=1):i===1&&t===170&&this.latchStep===1&&(this.latchedX=this.accX,this.latchedY=this.accY,this.latchStep=0)}}getRAM(){return this.ram}setRAM(e){this.ram.set(e)}saveState(){return{type:"MBC7",romBank:this.romBank,ramEnabled1:this.ramEnabled1,ramEnabled2:this.ramEnabled2,accX:this.accX,accY:this.accY,latchedX:this.latchedX,latchedY:this.latchedY}}loadState(e){this.romBank=e.romBank,this.ramEnabled1=e.ramEnabled1,this.ramEnabled2=e.ramEnabled2,this.accX=e.accX,this.accY=e.accY,this.latchedX=e.latchedX,this.latchedY=e.latchedY}setAccelerometer(e,t){this.accX=e,this.accY=t}}class px{rom;ram;romBank=1;ramBank=0;ramEnabled=!1;baseBank=0;isLocked=!1;constructor(e,t){this.rom=e,this.ram=new Uint8Array(t)}read(e){if(e>=0&&e<=16383)return this.rom[(this.baseBank&31)*16384+e];if(e>=16384&&e<=32767){const i=((this.baseBank&31)+this.romBank)*16384+(e-16384);return this.rom[i%this.rom.length]}if(e>=40960&&e<=49151){if(!this.ramEnabled||this.ram.length===0)return 255;const t=this.ramBank*8192+(e-40960);return this.ram[t%this.ram.length]}return 255}write(e,t){if(this.isLocked){e>=0&&e<=8191?this.ramEnabled=(t&10)===10:e>=8192&&e<=16383?(this.romBank=t&63,this.romBank===0&&(this.romBank=1)):e>=16384&&e<=24575&&(this.ramBank=t&3);return}e>=0&&e<=8191?this.ramEnabled=(t&10)===10:e>=8192&&e<=16383?this.baseBank=t&31:e>=16384&&e<=24575?this.romBank=t:e>=24576&&e<=32767&&t&64&&(this.isLocked=!0)}getRAM(){return this.ram}setRAM(e){this.ram.set(e)}saveState(){return{type:"MMM01",romBank:this.romBank,ramBank:this.ramBank,ramEnabled:this.ramEnabled,baseBank:this.baseBank,isLocked:this.isLocked}}loadState(e){this.romBank=e.romBank,this.ramBank=e.ramBank,this.ramEnabled=e.ramEnabled,this.baseBank=e.baseBank,this.isLocked=e.isLocked}}class mx{rom;ram;romBank=1;ramBank=0;ramEnabled=!1;selectMode=255;rtcSemaphore=1;constructor(e,t){this.rom=e,this.ram=new Uint8Array(t)}read(e){if(e>=0&&e<=16383)return this.rom[e];if(e>=16384&&e<=32767){const t=this.romBank*16384+(e-16384);return this.rom[t%this.rom.length]}if(e>=40960&&e<=49151)switch(this.selectMode){case 0:case 10:if(!this.ramEnabled||this.ram.length===0)return 255;const t=this.ramBank*8192+(e-40960);return this.ram[t%this.ram.length];case 12:return 1;case 13:return this.rtcSemaphore|254;case 14:return 1;default:return 255}return 255}write(e,t){if(e>=0&&e<=8191)this.selectMode=t&15,this.ramEnabled=this.selectMode===10;else if(e>=8192&&e<=16383)this.romBank=t||1;else if(e>=16384&&e<=24575)this.ramBank=t&15;else if(e>=40960&&e<=49151)if(this.selectMode===0||this.selectMode===10){if(this.ramEnabled&&this.ram.length>0){const i=this.ramBank*8192+(e-40960);this.ram[i%this.ram.length]=t}}else this.selectMode===13&&(this.rtcSemaphore=t&1)}getRAM(){return this.ram}setRAM(e){this.ram.set(e)}saveState(){return{type:"HuC3",romBank:this.romBank,ramBank:this.ramBank,ramEnabled:this.ramEnabled,selectMode:this.selectMode,rtcSemaphore:this.rtcSemaphore}}loadState(e){this.romBank=e.romBank,this.ramBank=e.ramBank,this.ramEnabled=e.ramEnabled,this.selectMode=e.selectMode,this.rtcSemaphore=e.rtcSemaphore}}class gx{rom;ram;romBank=0;index=0;registers=new Uint8Array(16);constructor(e,t){this.rom=e,this.ram=new Uint8Array(t||8192)}read(e){if(e>=0&&e<=16383)return this.rom[e];if(e>=16384&&e<=32767){const t=this.romBank*16384+(e-16384);return this.rom[t%this.rom.length]}if(e>=40960&&e<=45055){if(e===40961)return this.index;if(e===40960)return this.registers[this.index]&15}return 255}write(e,t){e>=0&&e<=8191?this.romBank=t&63:e>=40960&&e<=45055&&(e===40961?this.index=t&15:e===40960&&(this.registers[this.index]=t&15,this.handleInternalWrite()))}handleInternalWrite(){this.index===5&&(this.romBank=this.registers[4]<<4|this.registers[5])}getRAM(){return this.ram}setRAM(e){this.ram.set(e)}saveState(){return{type:"TAMA5",romBank:this.romBank,index:this.index,registers:Array.from(this.registers)}}loadState(e){this.romBank=e.romBank,this.index=e.index,this.registers.set(e.registers)}}class _x{rom;ram=new Uint8Array(512);romBank=1;ramEnabled=!1;constructor(e){this.rom=e}read(e){if(e>=0&&e<=16383)return this.rom[e];if(e>=16384&&e<=32767){const i=this.romBank*16384+(e-16384);return this.rom[i%this.rom.length]}return e>=40960&&e<=49151&&this.ramEnabled?this.ram[e&511]&15|240:255}write(e,t){e>=0&&e<=16383?e>>8&1?(this.romBank=t&15,this.romBank===0&&(this.romBank=1)):this.ramEnabled=(t&15)===10:e>=40960&&e<=49151&&this.ramEnabled&&(this.ram[e&511]=t&15)}getRAM(){return this.ram}setRAM(e){e.length===this.ram.length&&this.ram.set(e)}saveState(){return{type:"MBC2",ram:Array.from(this.ram),romBank:this.romBank,ramEnabled:this.ramEnabled}}loadState(e){this.ram.set(e.ram),this.romBank=e.romBank,this.ramEnabled=e.ramEnabled}}class vx{hram=new Uint8Array(127);_ie=0;mbc=null;bootROM=null;bootROMEnabled=!1;isCGB=!1;vram=new Uint8Array(16384);vramBank=0;wram=new Uint8Array(32768);wramBank=1;oam=new Uint8Array(160);apu=null;ppu=null;timer=null;serial=null;cpu=null;get joypad(){return this.ioRegisters[0]}set joypad(e){this.ioRegisters[0]=e}buttons=15;arrows=15;get interruptFlag(){return this.ioRegisters[15]}set interruptFlag(e){this.ioRegisters[15]=e}get ie(){return this._ie}set ie(e){this._ie=e}serialCallback=null;ioRegisters=new Uint8Array(128);dmaActive=!1;ppuAccumulator=0;apuAccumulator=0;dmaSource=0;dmaCurrentOffset=0;dmaTcycleCounter=0;hdmaSource=0;hdmaDest=0;hdmaRemaining=0;hdmaActive=!1;isDoubleSpeed=!1;cyclesTicked=0;constructor(){this.initIO()}initIO(){this.ioRegisters[5]=0,this.ioRegisters[6]=0,this.ioRegisters[7]=0,this.ioRegisters[16]=128,this.ioRegisters[17]=191,this.ioRegisters[18]=243,this.ioRegisters[20]=191,this.ioRegisters[22]=63,this.ioRegisters[23]=0,this.ioRegisters[25]=191,this.ioRegisters[26]=127,this.ioRegisters[27]=255,this.ioRegisters[28]=159,this.ioRegisters[30]=191,this.ioRegisters[32]=255,this.ioRegisters[33]=0,this.ioRegisters[34]=0,this.ioRegisters[35]=191,this.ioRegisters[36]=119,this.ioRegisters[37]=243,this.ioRegisters[38]=241,this.ioRegisters[64]=145,this.ioRegisters[66]=0,this.ioRegisters[67]=0,this.ioRegisters[69]=0,this.ioRegisters[71]=252,this.ioRegisters[72]=255,this.ioRegisters[73]=255}loadROM(e){const t=e[323];this.isCGB=t===128||t===192,this.vramBank=0,this.wramBank=1,this.isDoubleSpeed=!1,this.hdmaActive=!1,this.dmaActive=!1,this.isCGB&&(this.ioRegisters[77]=126,this.ioRegisters[79]=254,this.ioRegisters[112]=249,this.ioRegisters[85]=255),this.vram.fill(0),this.wram.fill(0);const i=e[327],s=e[329];let r=0;switch(s){case 1:r=2048;break;case 2:r=8192;break;case 3:r=32768;break;case 4:r=131072;break;case 5:r=65536;break}i===0?this.mbc=new ru(e):i>=1&&i<=3?this.mbc=new cx(e,r):i===5||i===6?this.mbc=new _x(e):i>=11&&i<=13?this.mbc=new px(e,r):i>=15&&i<=19?this.mbc=new hx(e,r):i>=25&&i<=30?this.mbc=new ux(e,r):i===34?this.mbc=new fx(e):i===253?this.mbc=new gx(e,r):i===254||i===252?this.mbc=new mx(e,r):i===255?this.mbc=new dx(e,r):this.mbc=new ru(e)}loadBootROM(e){this.bootROM=e,this.bootROMEnabled=!0}setBootROMEnabled(e){this.bootROMEnabled=e}getMBC(){return this.mbc}isDMAActive(){return this.dmaActive}getSRAM(){return this.mbc?this.mbc.getRAM():null}setSRAM(e){this.mbc&&this.mbc.setRAM(e)}saveState(){return{hram:Array.from(this.hram),ie:this.ie,interruptFlag:this.interruptFlag,isCGB:this.isCGB,vram:Array.from(this.vram),vramBank:this.vramBank,wram:Array.from(this.wram),wramBank:this.wramBank,ioRegisters:Array.from(this.ioRegisters),dmaActive:this.dmaActive,dmaSource:this.dmaSource,dmaCurrentOffset:this.dmaCurrentOffset,dmaTcycleCounter:this.dmaTcycleCounter,hdmaActive:this.hdmaActive,hdmaSource:this.hdmaSource,hdmaDest:this.hdmaDest,hdmaRemaining:this.hdmaRemaining,isDoubleSpeed:this.isDoubleSpeed,cyclesTicked:this.cyclesTicked,bootROMEnabled:this.bootROMEnabled,serial:this.serial?this.serial.saveState():null}}loadState(e){this.hram.set(e.hram),this._ie=e.ie,this.interruptFlag=e.interruptFlag,this.vram.set(e.vram),this.vramBank=e.vramBank||0,this.wram.set(e.wram),this.wramBank=e.wramBank||1,this.ioRegisters.set(e.ioRegisters),this.dmaActive=e.dmaActive,this.dmaSource=e.dmaSource,this.dmaCurrentOffset=e.dmaCurrentOffset,this.dmaTcycleCounter=e.dmaTcycleCounter,this.hdmaActive=e.hdmaActive||!1,this.hdmaSource=e.hdmaSource||0,this.hdmaDest=e.hdmaDest||0,this.hdmaRemaining=e.hdmaRemaining||0,this.isDoubleSpeed=e.isDoubleSpeed||!1,this.bootROMEnabled=e.bootROMEnabled||!1,this.serial&&e.serial&&this.serial.loadState(e.serial)}read(e){if(this.dmaActive&&(e<65408||e===65535)&&e!==65350)return 255;this.tick(2);const t=this.readInternal(e);return this.tick(2),t}write(e,t){this.dmaActive&&(e<65408||e===65535)&&e!==65350||(this.tick(2),this.writeInternal(e,t),this.tick(2))}syncPPUForAccess(e){if(!this.ppu||this.cyclesTicked===0)return;e>=65344&&e<=65355&&this.ppu.midScanlineJIT()}readInternal(e){if(this.syncPPUForAccess(e),this.bootROMEnabled&&this.bootROM){if(e<=255)return this.bootROM[e];if(this.isCGB&&e>=512&&e<=2303)return this.bootROM[e]}const t=this.ioRegisters[65],i=(this.ioRegisters[64]&128)!==0,s=i&&this.ppu&&this.ppu.sbAccessMode!==void 0?this.ppu.sbAccessMode:t&3;return e<32768||e>=40960&&e<=49151?this.mbc?this.mbc.read(e):255:e>=32768&&e<=40959?i&&s===3?255:this.vram[this.vramBank*8192+(e-32768)]:e>=49152&&e<=53247?this.wram[e-49152]:e>=53248&&e<=57343?this.wram[this.wramBank*4096+(e-53248)]:e>=65024&&e<=65183?i&&s>=2?255:this.oam[e-65024]:e>=65280&&e<=65407?this.readIO(e):e>=65408&&e<=65534?this.hram[e-65408]:e===65535?this.ie:255}writeInternal(e,t){this.syncPPUForAccess(e);const i=this.ioRegisters[65],s=(this.ioRegisters[64]&128)!==0,r=s&&this.ppu&&this.ppu.sbAccessMode!==void 0?this.ppu.sbAccessMode:i&3;e<32768||e>=40960&&e<=49151?this.mbc&&this.mbc.write(e,t):e>=32768&&e<=40959?(!s||r!==3)&&(this.vram[this.vramBank*8192+(e-32768)]=t):e>=49152&&e<=53247?this.wram[e-49152]=t:e>=53248&&e<=57343?this.wram[this.wramBank*4096+(e-53248)]=t:e>=65024&&e<=65183?!this.dmaActive&&(!s||r<2)&&(this.oam[e-65024]=t):e>=65280&&e<=65407?this.writeIO(e,t):e>=65408&&e<=65534?this.hram[e-65408]=t:e===65535&&(this.ie=t)}writeDirect(e,t){e>=65280&&e<=65407?(this.ioRegisters[e-65280]=t,e===65295&&(this.interruptFlag=t&31)):e>=65408&&e<=65534?this.hram[e-65408]=t:e===65535&&(this.ie=t)}readIOQuiet(e){return e===65535?this.ie:e===65345?this.ioRegisters[65]|128:this.readIO(e&65535)}readOAMQuiet(e){return this.dmaActive?255:this.oam[e-65024]}readVRAM(e,t){return this.vram[e*8192+(t-32768)]}readWRAM(e,t){return t>=49152&&t<=53247?this.wram[t-49152]:this.wram[e*4096+(t-53248)]}readDirect(e){return this.readInternal(e)}readIORegisterRaw(e){return e>=65280&&e<=65407?this.ioRegisters[e-65280]:255}resetTickedCycles(){this.cyclesTicked=0}tick(e){if(this.cyclesTicked+=e,this.dmaActive)for(let t=0;t<e;t++)this.dmaTcycleCounter++,this.dmaTcycleCounter>=4&&(this.dmaTcycleCounter=0,this.dmaCurrentOffset<160&&(this.oam[this.dmaCurrentOffset]=this.readDirect(this.dmaSource+this.dmaCurrentOffset),this.dmaCurrentOffset++,this.dmaCurrentOffset===160&&(this.dmaActive=!1)));if(this.isDoubleSpeed)for(this.ppuAccumulator+=e,this.apuAccumulator+=e;this.ppuAccumulator>=2;)this.ppu&&this.ppu.update(1),this.timer&&this.timer.update(1),this.apu&&this.apu.update(1),this.serial&&this.serial.update(1),this.mbc&&this.mbc.tickRTC&&this.mbc.tickRTC(1),this.ppuAccumulator-=2;else this.ppu&&this.ppu.update(e),this.timer&&this.timer.update(e),this.apu&&this.apu.update(e),this.serial&&this.serial.update(e),this.mbc&&this.mbc.tickRTC&&this.mbc.tickRTC(e)}switchSpeed(){const e=this.ioRegisters[77];e&1&&(this.isDoubleSpeed=!this.isDoubleSpeed,this.ioRegisters[77]=(this.isDoubleSpeed?128:0)|e&126,this.timer&&this.timer.resetDiv())}readIO(e){if(e>=65296&&e<=65327)return this.apu?this.apu.read(e):255;if(e>=65328&&e<=65343)return this.ioRegisters[e-65280];switch(e){case 65280:{const t=this.ioRegisters[0]&48;let i=15;return t&16||(i&=this.arrows),t&32||(i&=this.buttons),192|t|i}case 65281:return this.ioRegisters[1];case 65282:return this.ioRegisters[2]|(this.isCGB?124:126);case 65284:return this.timer.internalCounter>>8;case 65285:return this.timer?this.timer.readTIMA():this.ioRegisters[5];case 65286:return this.ioRegisters[6];case 65287:return this.ioRegisters[7]|248;case 65295:return this.interruptFlag|224;case 65344:return this.ioRegisters[64];case 65345:{const t=this.ioRegisters[65];if(this.ppu&&typeof this.ppu.getStatReadMode=="function"){const i=this.ppu.getStatReadMode();return t&-4|i&3|128}return t|128}case 65346:return this.ioRegisters[66];case 65347:return this.ioRegisters[67];case 65348:return this.ioRegisters[68];case 65349:return this.ioRegisters[69];case 65350:return this.ioRegisters[70];case 65351:return this.ioRegisters[71];case 65352:return this.ioRegisters[72];case 65353:return this.ioRegisters[73];case 65354:return this.ioRegisters[74];case 65355:return this.ioRegisters[75];case 65357:return this.isCGB?this.ioRegisters[77]|126:255;case 65359:return this.isCGB?this.ioRegisters[79]|254:255;case 65360:return(this.bootROMEnabled?0:1)|254;case 65361:case 65362:case 65363:case 65364:return this.isCGB?this.ioRegisters[e-65280]:255;case 65365:return this.isCGB?this.ioRegisters[85]:255;case 65384:case 65385:case 65386:case 65387:return this.isCGB&&this.ppu?this.ppu.readPalette(e):255;case 65392:return this.isCGB?this.ioRegisters[112]|248:255;default:return 255}}writeIO(e,t){if(e>=65344&&e<=65355){if(e===65345){const i=this.ioRegisters[65];this.ioRegisters[65]=t&120|i&7,this.ppu&&this.ppu.onStatWrite()}else if(e===65349)this.ioRegisters[69]=t,this.ioRegisters[64]&128&&this.ppu&&(typeof this.ppu.onLYCWrite=="function"?this.ppu.onLYCWrite():this.ppu.updateLYCFlag(this.ioRegisters[68]));else if(e===65350)this.ioRegisters[70]=t,this.dmaActive=!0,this.dmaSource=t<<8,this.dmaCurrentOffset=0,this.dmaTcycleCounter=0;else if(e!==65348){const i=this.ioRegisters[64];if(this.ppu&&this.ppu.midScanlineJIT(),this.ioRegisters[e-65280]=t,e===65344&&this.ppu){const s=(i&128)!==0,r=(t&128)!==0;!s&&r?(this.ioRegisters[68]=0,this.ioRegisters[65]=this.ioRegisters[65]&-4|0,this.ppu.onLcdEnable(),typeof this.ppu.onLYCWrite!="function"&&this.ppu.updateLYCFlag(0)):s&&!r&&(this.ioRegisters[68]=0,this.ioRegisters[65]=this.ioRegisters[65]&-4|0),this.ppu.update(0)}}return}if(e>=65296&&e<=65327){this.apu&&(this.apu.audioJIT(),this.apu.write(e,t)),this.ioRegisters[e-65280]=t;return}if(e>=65328&&e<=65343){this.apu&&(this.apu.audioJIT(),this.apu.writeWave(e,t)),this.ioRegisters[e-65280]=t;return}if(this.isCGB){if(e>=65384&&e<=65387){this.ppu&&(this.ppu.midScanlineJIT(),this.ppu.writePalette(e,t));return}if(e===65359){this.vramBank=t&1,this.ioRegisters[79]=t&1;return}if(e===65392){const i=this.hdmaSource>=53248&&this.hdmaSource<=57343;(!this.hdmaActive||!i)&&(this.ioRegisters[112]=t&7,this.wramBank=(t&7)===0?1:t&7);return}if(e===65365){this.hdmaActive&&(t&128)===0?this.hdmaActive=!1:(t&128)===0?this.performGDMA(t):(this.hdmaSource=this.ioRegisters[81]<<8|this.ioRegisters[82]&240,this.hdmaDest=32768|(this.ioRegisters[83]&31)<<8|this.ioRegisters[84]&240,this.hdmaRemaining=(t&127)+1,this.hdmaActive=!0,this.ioRegisters[85]=t&127);return}}switch(e){case 65280:this.ioRegisters[0]=t&48;break;case 65281:this.ioRegisters[1]=t,this.serial&&this.serial.write(e,t);break;case 65282:this.ioRegisters[2]=t,this.serial&&this.serial.write(e,t);break;case 65284:case 65285:case 65286:case 65287:this.timer?this.timer.write(e,t):this.ioRegisters[e-65280]=t;break;case 65295:this.interruptFlag=t&31,this.ioRegisters[15]=t&31;break;case 65535:this.ie=t;break;case 65360:this.bootROMEnabled=!1;break;default:this.ioRegisters[e-65280]=t;break}}performGDMA(e){let t=this.ioRegisters[81]<<8|this.ioRegisters[82]&240,i=32768|(this.ioRegisters[83]&31)<<8|this.ioRegisters[84]&240;const s=((e&127)+1)*16;for(let r=0;r<s;r++)this.writeInternal(i,this.readDirect(t)),t=t+1&65535,i++;this.ioRegisters[85]=255}notifyHBlank(){if(this.isCGB&&this.hdmaActive){for(let e=0;e<16;e++){const t=32768|this.hdmaDest&8191;this.writeInternal(t,this.readDirect(this.hdmaSource)),this.hdmaSource=this.hdmaSource+1&65535,this.hdmaDest++}this.hdmaRemaining--,this.hdmaRemaining===0?(this.hdmaActive=!1,this.ioRegisters[85]=255):this.ioRegisters[85]=this.hdmaRemaining-1&127}}handleInput(e,t){switch(t&&(this.interruptFlag|=16),e){case 0:t?this.arrows&=-2:this.arrows|=1;break;case 1:t?this.arrows&=-3:this.arrows|=2;break;case 2:t?this.arrows&=-5:this.arrows|=4;break;case 3:t?this.arrows&=-9:this.arrows|=8;break;case 4:t?this.buttons&=-2:this.buttons|=1;break;case 5:t?this.buttons&=-3:this.buttons|=2;break;case 6:t?this.buttons&=-5:this.buttons|=4;break;case 7:t?this.buttons&=-9:this.buttons|=8;break}}}class bx{level=1;setLevel(e){this.level=e}debug(e,...t){this.level<=0&&console.debug(`[DEBUG] ${e}`,...t)}info(e,...t){this.level<=1&&console.info(`[INFO] ${e}`,...t)}warn(e,...t){this.level<=2&&console.warn(`[WARN] ${e}`,...t)}error(e,...t){this.level<=3&&console.error(`[ERROR] ${e}`,...t)}}const Ut=new bx;var au={};class xx{a=0;b=0;c=0;d=0;e=0;h=0;l=0;f=0;pc=256;sp=65534;ime=!1;imePending=!1;imeScheduled=!1;halted=!1;haltBug=!1;justHalted=!1;stopped=!1;speedSwitchDelay=0;speedSwitchFreeze=0;speedSwitchHaltCountdown=0;cycleCoreMode;bus;constructor(e){this.bus=e;const t=typeof process<"u"&&au?au:void 0;this.cycleCoreMode=t?.HIP_CPU_CYCLE_CORE==="1",this.resetDMG()}cpuRead(e){return this.bus.read(e)}cpuWrite(e,t){this.bus.write(e,t)}cpuIdle(e){this.bus.tick(e)}wakeUp(){this.stopped=!1}reset(){this.a=0,this.f=0,this.b=0,this.c=0,this.d=0,this.e=0,this.h=0,this.l=0,this.pc=0,this.sp=0,this.ime=!1,this.imePending=!1,this.imeScheduled=!1,this.halted=!1,this.haltBug=!1,this.justHalted=!1,this.stopped=!1,this.speedSwitchDelay=0,this.speedSwitchFreeze=0,this.speedSwitchHaltCountdown=0}resetDMG(){this.a=1,this.f=176,this.b=0,this.c=19,this.d=0,this.e=216,this.h=1,this.l=77,this.pc=256,this.sp=65534}initCGB(){this.a=17,this.f=128,this.b=0,this.c=0,this.d=255,this.e=86,this.h=0,this.l=13,this.pc=256,this.sp=65534,Ut.info("Initialized for CGB Mode")}saveState(){return{a:this.a,b:this.b,c:this.c,d:this.d,e:this.e,f:this.f,h:this.h,l:this.l,pc:this.pc,sp:this.sp,ime:this.ime,imePending:this.imePending,imeScheduled:this.imeScheduled,halted:this.halted}}loadState(e){this.a=e.a,this.b=e.b,this.c=e.c,this.d=e.d,this.e=e.e,this.f=e.f,this.h=e.h,this.l=e.l,this.pc=e.pc,this.sp=e.sp,this.ime=e.ime,this.imePending=e.imePending,this.imeScheduled=e.imeScheduled,this.halted=e.halted,this.justHalted=!1,this.speedSwitchFreeze=0,this.speedSwitchHaltCountdown=0}get af(){return this.a<<8|this.f}set af(e){this.a=e>>8&255,this.f=e&240}get bc(){return this.b<<8|this.c}set bc(e){this.b=e>>8&255,this.c=e&255}get de(){return this.d<<8|this.e}set de(e){this.d=e>>8&255,this.e=e&255}get hl(){return this.h<<8|this.l}set hl(e){this.h=e>>8&255,this.l=e&255}get zero(){return(this.f&128)!==0}set zero(e){e?this.f|=128:this.f&=-129,this.f&=240}get subtract(){return(this.f&64)!==0}set subtract(e){e?this.f|=64:this.f&=-65,this.f&=240}get halfCarry(){return(this.f&32)!==0}set halfCarry(e){e?this.f|=32:this.f&=-33,this.f&=240}get carry(){return(this.f&16)!==0}set carry(e){e?this.f|=16:this.f&=-17,this.f&=240}step(){if(this.cycleCoreMode)return this.stepCycleCore();if(this.speedSwitchDelay>0){const r=Math.min(this.speedSwitchDelay,4);return this.speedSwitchDelay-=r,this.bus.tick(r),r}if(this.stopped)return this.bus.tick(4),4;if(this.bus.resetTickedCycles(),this.halted){const r=this.bus.readIOQuiet(65535),a=this.bus.readIOQuiet(65295);if((r&a&31)!==0)this.halted=!1;else return this.cpuIdle(4),4}const e=this.handleInterrupts();if(e>0)return e;this.pc;const t=this.readNextByte(),i=this.executeOpcode(t),s=i-this.bus.cyclesTicked;return s>0&&this.bus.tick(s),this.imePending&&(this.ime=!0,this.imePending=!1),this.imeScheduled&&(this.imePending=!0,this.imeScheduled=!1),i}getInterruptQueue(){const e=this.bus.readIOQuiet(65535),t=this.bus.readIOQuiet(65295);return e&t&31}stepCycleCore(){if(this.speedSwitchFreeze>0){const l=Math.min(this.speedSwitchFreeze,4);return this.speedSwitchFreeze-=l,this.cpuIdle(l),l}if(this.speedSwitchHaltCountdown>0){this.halted=!0;const l=Math.min(this.speedSwitchHaltCountdown,4);return this.speedSwitchHaltCountdown-=l,this.cpuIdle(l),this.speedSwitchHaltCountdown<=0&&(this.speedSwitchHaltCountdown=0,this.halted=!1),l}if(this.speedSwitchDelay>0){const l=Math.min(this.speedSwitchDelay,4);return this.speedSwitchDelay-=l,this.cpuIdle(l),l}if(this.stopped)return this.cpuIdle(4),4;this.bus.resetTickedCycles();let e=this.getInterruptQueue();const t=this.ime;if(this.imeScheduled&&(this.ime=!this.ime,this.imeScheduled=!1,this.imePending=!1),this.halted){if(e===0){const l=!this.bus.isCGB&&!this.justHalted?2:4;return this.cpuIdle(l),this.justHalted=!1,this.bus.cyclesTicked}if(this.halted=!1,this.justHalted=!1,t)return this.handleInterruptsCycleCore(),this.bus.cyclesTicked}if(this.justHalted=!1,t&&e)return this.handleInterruptsCycleCore(),this.bus.cyclesTicked;const i=this.bus.cyclesTicked,s=this.readNextByte(),r=this.executeOpcode(s),a=this.bus.cyclesTicked-i,o=r-a;return o>0&&this.cpuIdle(o),this.bus.cyclesTicked}executeStopCycleCore(){this.readNextByte();const e=this.bus.readIOQuiet(65357);return this.bus.isCGB&&(e&1)!==0?(this.bus.switchSpeed(),this.speedSwitchFreeze=8,this.speedSwitchHaltCountdown=65536,this.halted=!0,this.justHalted=!0,this.stopped=!1,4):(this.stopped=!0,this.halted=!1,this.justHalted=!1,this.bus.timer&&this.bus.timer.resetDiv(),4)}handleInterruptsCycleCore(){if(this.getInterruptQueue()===0)return 0;this.halted=!1,this.ime=!1,this.cpuRead(this.pc),this.cpuIdle(4),this.sp=this.sp-1&65535,this.cpuWrite(this.sp,this.pc>>8&255);const t=this.getInterruptQueue();this.sp=this.sp-1&65535,this.cpuWrite(this.sp,this.pc&255);let i=64,s=0;return t===0?(i=0,s=-1):t&1?(i=64,s=0):t&2?(i=72,s=1):t&4?(i=80,s=2):t&8?(i=88,s=3):t&16&&(i=96,s=4),s!==-1&&this.bus.writeDirect(65295,this.bus.readDirect(65295)&~(1<<s)),this.cpuIdle(4),this.pc=i,20}handleInterrupts(){if(!this.ime&&!this.halted)return 0;const e=this.bus.readIOQuiet(65535),t=this.bus.readIOQuiet(65295);if((e&t&31)===0||(this.halted=!1,!this.ime))return 0;this.ime=!1,this.cpuIdle(8),this.sp=this.sp-1&65535,this.cpuWrite(this.sp,this.pc>>8&255);const s=this.bus.readDirect(65535),r=this.bus.readDirect(65295),a=s&r&31;this.sp=this.sp-1&65535,this.cpuWrite(this.sp,this.pc&255);let o=64,l=0;return a===0?(o=0,l=-1):a&1?(o=64,l=0):a&2?(o=72,l=1):a&4?(o=80,l=2):a&8?(o=88,l=3):a&16&&(o=96,l=4),l!==-1&&this.bus.writeDirect(65295,this.bus.readDirect(65295)&~(1<<l)),this.cpuIdle(4),this.pc=o,20}push(e){this.sp=this.sp-1&65535,this.cpuWrite(this.sp,e>>8&255),this.sp=this.sp-1&65535,this.cpuWrite(this.sp,e&255)}pop(){const e=this.cpuRead(this.sp);this.sp=this.sp+1&65535;const t=this.cpuRead(this.sp);return this.sp=this.sp+1&65535,t<<8|e}rst(e){this.push(this.pc),this.pc=e}readNextByte(){const e=this.cpuRead(this.pc);return this.haltBug?this.haltBug=!1:this.pc=this.pc+1&65535,e}readNextByteSigned(){const e=this.readNextByte();return e>127?e-256:e}readNextWord(){const e=this.readNextByte();return this.readNextByte()<<8|e}jrCondition(e){const t=this.readNextByteSigned();return e?(this.pc=this.pc+t&65535,12):8}addHL(e){const t=this.hl+e;this.subtract=!1,this.halfCarry=(this.hl&4095)+(e&4095)>4095,this.carry=t>65535,this.hl=t&65535}executeOpcode(e){switch(e){case 0:return 4;case 16:return this.cycleCoreMode?this.executeStopCycleCore():(this.bus.isCGB&&this.bus.readIOQuiet(65357)&1?(this.bus.switchSpeed(),this.speedSwitchDelay=65536):(this.stopped=!0,this.bus.timer&&this.bus.timer.resetDiv()),this.readNextByte(),4);case 7:return this.a=this.rlc(this.a),this.zero=!1,4;case 15:return this.a=this.rrc(this.a),this.zero=!1,4;case 23:return this.a=this.rl(this.a),this.zero=!1,4;case 31:return this.a=this.rr(this.a),this.zero=!1,4;case 39:return this.daa(),4;case 47:return this.a=~this.a&255,this.subtract=!0,this.halfCarry=!0,4;case 55:return this.subtract=!1,this.halfCarry=!1,this.carry=!0,4;case 63:return this.subtract=!1,this.halfCarry=!1,this.carry=!this.carry,4;case 1:return this.bc=this.readNextWord(),12;case 17:return this.de=this.readNextWord(),12;case 33:return this.hl=this.readNextWord(),12;case 49:return this.sp=this.readNextWord(),12;case 8:{const t=this.readNextWord();return this.bus.write(t,this.sp&255),this.bus.write(t+1,this.sp>>8&255),20}case 2:return this.bus.write(this.bc,this.a),8;case 18:return this.bus.write(this.de,this.a),8;case 34:return this.bus.write(this.hl,this.a),this.hl=this.hl+1&65535,8;case 50:return this.bus.write(this.hl,this.a),this.hl=this.hl-1&65535,8;case 10:return this.a=this.bus.read(this.bc),8;case 26:return this.a=this.bus.read(this.de),8;case 42:return this.a=this.bus.read(this.hl),this.hl=this.hl+1&65535,8;case 58:return this.a=this.bus.read(this.hl),this.hl=this.hl-1&65535,8;case 9:return this.addHL(this.bc),8;case 25:return this.addHL(this.de),8;case 41:return this.addHL(this.hl),8;case 57:return this.addHL(this.sp),8;case 3:return this.bc=this.bc+1&65535,8;case 19:return this.de=this.de+1&65535,8;case 35:return this.hl=this.hl+1&65535,8;case 51:return this.sp=this.sp+1&65535,8;case 11:return this.bc=this.bc-1&65535,8;case 27:return this.de=this.de-1&65535,8;case 43:return this.hl=this.hl-1&65535,8;case 59:return this.sp=this.sp-1&65535,8;case 232:{const t=this.readNextByteSigned();return this.zero=!1,this.subtract=!1,this.halfCarry=(this.sp&15)+(t&15)>15,this.carry=(this.sp&255)+(t&255)>255,this.sp=this.sp+t&65535,16}case 249:return this.sp=this.hl,8;case 195:return this.pc=this.readNextWord(),16;case 24:{const t=this.readNextByteSigned();return this.pc=this.pc+t&65535,12}case 32:return this.jrCondition(!this.zero);case 40:return this.jrCondition(this.zero);case 48:return this.jrCondition(!this.carry);case 56:return this.jrCondition(this.carry);case 194:{const t=this.readNextWord();return this.zero?12:(this.pc=t,16)}case 202:{const t=this.readNextWord();return this.zero?(this.pc=t,16):12}case 210:{const t=this.readNextWord();return this.carry?12:(this.pc=t,16)}case 218:{const t=this.readNextWord();return this.carry?(this.pc=t,16):12}case 233:return this.pc=this.hl,4;case 197:return this.push(this.bc),16;case 213:return this.push(this.de),16;case 229:return this.push(this.hl),16;case 245:return this.push(this.af),16;case 193:return this.bc=this.pop(),12;case 209:return this.de=this.pop(),12;case 225:return this.hl=this.pop(),12;case 241:return this.af=this.pop(),12;case 205:{const t=this.readNextWord();return this.push(this.pc),this.pc=t,24}case 196:{const t=this.readNextWord();return this.zero?12:(this.push(this.pc),this.pc=t,24)}case 204:{const t=this.readNextWord();return this.zero?(this.push(this.pc),this.pc=t,24):12}case 212:{const t=this.readNextWord();return this.carry?12:(this.push(this.pc),this.pc=t,24)}case 220:{const t=this.readNextWord();return this.carry?(this.push(this.pc),this.pc=t,24):12}case 201:return this.pc=this.pop(),16;case 192:return this.zero?8:(this.pc=this.pop(),20);case 200:return this.zero?(this.pc=this.pop(),20):8;case 208:return this.carry?8:(this.pc=this.pop(),20);case 216:return this.carry?(this.pc=this.pop(),20):8;case 217:return this.pc=this.pop(),this.ime=!0,16;case 199:return this.rst(0),16;case 207:return this.rst(8),16;case 215:return this.rst(16),16;case 223:return this.rst(24),16;case 231:return this.rst(32),16;case 239:return this.rst(40),16;case 247:return this.rst(48),16;case 255:return this.rst(56),16;case 243:return this.ime=!1,this.imePending=!1,this.imeScheduled=!1,4;case 251:return this.cycleCoreMode?!this.ime&&!this.imeScheduled&&(this.imeScheduled=!0):this.imeScheduled=!0,4;case 6:return this.b=this.readNextByte(),8;case 14:return this.c=this.readNextByte(),8;case 22:return this.d=this.readNextByte(),8;case 30:return this.e=this.readNextByte(),8;case 38:return this.h=this.readNextByte(),8;case 46:return this.l=this.readNextByte(),8;case 62:return this.a=this.readNextByte(),8;case 54:return this.bus.write(this.hl,this.readNextByte()),12;case 127:return 4;case 120:return this.a=this.b,4;case 121:return this.a=this.c,4;case 122:return this.a=this.d,4;case 123:return this.a=this.e,4;case 124:return this.a=this.h,4;case 125:return this.a=this.l,4;case 126:return this.a=this.bus.read(this.hl),8;case 64:return 4;case 65:return this.b=this.c,4;case 66:return this.b=this.d,4;case 67:return this.b=this.e,4;case 68:return this.b=this.h,4;case 69:return this.b=this.l,4;case 70:return this.b=this.bus.read(this.hl),8;case 71:return this.b=this.a,4;case 72:return this.c=this.b,4;case 73:return 4;case 74:return this.c=this.d,4;case 75:return this.c=this.e,4;case 76:return this.c=this.h,4;case 77:return this.c=this.l,4;case 78:return this.c=this.bus.read(this.hl),8;case 79:return this.c=this.a,4;case 80:return this.d=this.b,4;case 81:return this.d=this.c,4;case 82:return 4;case 83:return this.d=this.e,4;case 84:return this.d=this.h,4;case 85:return this.d=this.l,4;case 86:return this.d=this.bus.read(this.hl),8;case 87:return this.d=this.a,4;case 88:return this.e=this.b,4;case 89:return this.e=this.c,4;case 90:return this.e=this.d,4;case 91:return 4;case 92:return this.e=this.h,4;case 93:return this.e=this.l,4;case 94:return this.e=this.bus.read(this.hl),8;case 95:return this.e=this.a,4;case 96:return this.h=this.b,4;case 97:return this.h=this.c,4;case 98:return this.h=this.d,4;case 99:return this.h=this.e,4;case 100:return 4;case 101:return this.h=this.l,4;case 102:return this.h=this.bus.read(this.hl),8;case 103:return this.h=this.a,4;case 104:return this.l=this.b,4;case 105:return this.l=this.c,4;case 106:return this.l=this.d,4;case 107:return this.l=this.e,4;case 108:return this.l=this.h,4;case 109:return 4;case 110:return this.l=this.bus.read(this.hl),8;case 111:return this.l=this.a,4;case 112:return this.bus.write(this.hl,this.b),8;case 113:return this.bus.write(this.hl,this.c),8;case 114:return this.bus.write(this.hl,this.d),8;case 115:return this.bus.write(this.hl,this.e),8;case 116:return this.bus.write(this.hl,this.h),8;case 117:return this.bus.write(this.hl,this.l),8;case 119:return this.bus.write(this.hl,this.a),8;case 118:{const t=this.bus.readIOQuiet(65535),i=this.bus.readIOQuiet(65295);return!this.ime&&(t&i&31)!==0?this.haltBug=!0:this.halted=!0,this.justHalted=!0,4}case 60:return this.a=this.inc8(this.a),4;case 4:return this.b=this.inc8(this.b),4;case 12:return this.c=this.inc8(this.c),4;case 20:return this.d=this.inc8(this.d),4;case 28:return this.e=this.inc8(this.e),4;case 36:return this.h=this.inc8(this.h),4;case 44:return this.l=this.inc8(this.l),4;case 52:return this.bus.write(this.hl,this.inc8(this.bus.read(this.hl))),12;case 61:return this.a=this.dec8(this.a),4;case 5:return this.b=this.dec8(this.b),4;case 13:return this.c=this.dec8(this.c),4;case 21:return this.d=this.dec8(this.d),4;case 29:return this.e=this.dec8(this.e),4;case 37:return this.h=this.dec8(this.h),4;case 45:return this.l=this.dec8(this.l),4;case 53:return this.bus.write(this.hl,this.dec8(this.bus.read(this.hl))),12;case 135:return this.add8(this.a),4;case 128:return this.add8(this.b),4;case 129:return this.add8(this.c),4;case 130:return this.add8(this.d),4;case 131:return this.add8(this.e),4;case 132:return this.add8(this.h),4;case 133:return this.add8(this.l),4;case 134:return this.add8(this.bus.read(this.hl)),8;case 143:return this.adc8(this.a),4;case 136:return this.adc8(this.b),4;case 137:return this.adc8(this.c),4;case 138:return this.adc8(this.d),4;case 139:return this.adc8(this.e),4;case 140:return this.adc8(this.h),4;case 141:return this.adc8(this.l),4;case 142:return this.adc8(this.bus.read(this.hl)),8;case 151:return this.sub8(this.a),4;case 144:return this.sub8(this.b),4;case 145:return this.sub8(this.c),4;case 146:return this.sub8(this.d),4;case 147:return this.sub8(this.e),4;case 148:return this.sub8(this.h),4;case 149:return this.sub8(this.l),4;case 150:return this.sub8(this.bus.read(this.hl)),8;case 159:return this.sbc8(this.a),4;case 152:return this.sbc8(this.b),4;case 153:return this.sbc8(this.c),4;case 154:return this.sbc8(this.d),4;case 155:return this.sbc8(this.e),4;case 156:return this.sbc8(this.h),4;case 157:return this.sbc8(this.l),4;case 158:return this.sbc8(this.bus.read(this.hl)),8;case 167:return this.and8(this.a),4;case 160:return this.and8(this.b),4;case 161:return this.and8(this.c),4;case 162:return this.and8(this.d),4;case 163:return this.and8(this.e),4;case 164:return this.and8(this.h),4;case 165:return this.and8(this.l),4;case 166:return this.and8(this.bus.read(this.hl)),8;case 175:return this.xor8(this.a),4;case 168:return this.xor8(this.b),4;case 169:return this.xor8(this.c),4;case 170:return this.xor8(this.d),4;case 171:return this.xor8(this.e),4;case 172:return this.xor8(this.h),4;case 173:return this.xor8(this.l),4;case 174:return this.xor8(this.bus.read(this.hl)),8;case 183:return this.or8(this.a),4;case 176:return this.or8(this.b),4;case 177:return this.or8(this.c),4;case 178:return this.or8(this.d),4;case 179:return this.or8(this.e),4;case 180:return this.or8(this.h),4;case 181:return this.or8(this.l),4;case 182:return this.or8(this.bus.read(this.hl)),8;case 191:return this.cp8(this.a),4;case 184:return this.cp8(this.b),4;case 185:return this.cp8(this.c),4;case 186:return this.cp8(this.d),4;case 187:return this.cp8(this.e),4;case 188:return this.cp8(this.h),4;case 189:return this.cp8(this.l),4;case 190:return this.cp8(this.bus.read(this.hl)),8;case 248:{const t=this.readNextByteSigned();return this.zero=!1,this.subtract=!1,this.halfCarry=(this.sp&15)+(t&15)>15,this.carry=(this.sp&255)+(t&255)>255,this.hl=this.sp+t&65535,12}case 198:return this.add8(this.readNextByte()),8;case 206:return this.adc8(this.readNextByte()),8;case 214:return this.sub8(this.readNextByte()),8;case 222:return this.sbc8(this.readNextByte()),8;case 230:return this.and8(this.readNextByte()),8;case 238:return this.xor8(this.readNextByte()),8;case 246:return this.or8(this.readNextByte()),8;case 254:return this.cp8(this.readNextByte()),8;case 224:return this.bus.write(65280+this.readNextByte(),this.a),12;case 226:return this.bus.write(65280+this.c,this.a),8;case 234:return this.bus.write(this.readNextWord(),this.a),16;case 240:return this.a=this.bus.read(65280+this.readNextByte()),12;case 242:return this.a=this.bus.read(65280+this.c),8;case 250:return this.a=this.bus.read(this.readNextWord()),16;case 203:return this.executeCBOpcode(this.readNextByte());default:return console.warn(`Unknown opcode: 0x${e.toString(16)}`),4}}executeCBOpcode(e){const t=e&7;if(e>=0&&e<=7)return this.setReg(t,this.rlc(this.getReg(t))),t===6?16:8;if(e>=8&&e<=15)return this.setReg(t,this.rrc(this.getReg(t))),t===6?16:8;if(e>=16&&e<=23)return this.setReg(t,this.rl(this.getReg(t))),t===6?16:8;if(e>=24&&e<=31)return this.setReg(t,this.rr(this.getReg(t))),t===6?16:8;if(e>=32&&e<=39)return this.setReg(t,this.sla(this.getReg(t))),t===6?16:8;if(e>=40&&e<=47)return this.setReg(t,this.sra(this.getReg(t))),t===6?16:8;if(e>=48&&e<=55)return this.setReg(t,this.swap(this.getReg(t))),t===6?16:8;if(e>=56&&e<=63)return this.setReg(t,this.srl(this.getReg(t))),t===6?16:8;if(e>=64&&e<=127){const i=e>>3&7;return this.bit(i,this.getReg(t)),t===6?12:8}if(e>=128&&e<=191){const i=e>>3&7;return this.setReg(t,this.getReg(t)&~(1<<i)),t===6?16:8}if(e>=192&&e<=255){const i=e>>3&7;return this.setReg(t,this.getReg(t)|1<<i),t===6?16:8}return console.warn(`CB opcode 0x${e.toString(16)} not yet implemented`),8}getReg(e){switch(e){case 0:return this.b;case 1:return this.c;case 2:return this.d;case 3:return this.e;case 4:return this.h;case 5:return this.l;case 6:return this.bus.read(this.hl);case 7:return this.a;default:return 0}}setReg(e,t){switch(e){case 0:this.b=t;break;case 1:this.c=t;break;case 2:this.d=t;break;case 3:this.e=t;break;case 4:this.h=t;break;case 5:this.l=t;break;case 6:this.bus.write(this.hl,t);break;case 7:this.a=t;break}}bit(e,t){this.zero=(t&1<<e)===0,this.subtract=!1,this.halfCarry=!0}srl(e){this.carry=(e&1)!==0;const t=e>>1&255;return this.zero=t===0,this.subtract=!1,this.halfCarry=!1,t}rlc(e){this.carry=(e&128)!==0;const t=(e<<1|(this.carry?1:0))&255;return this.zero=t===0,this.subtract=!1,this.halfCarry=!1,t}rrc(e){this.carry=(e&1)!==0;const t=(e>>1|(this.carry?128:0))&255;return this.zero=t===0,this.subtract=!1,this.halfCarry=!1,t}rl(e){const t=this.carry?1:0;this.carry=(e&128)!==0;const i=(e<<1|t)&255;return this.zero=i===0,this.subtract=!1,this.halfCarry=!1,i}rr(e){const t=this.carry?128:0;this.carry=(e&1)!==0;const i=(e>>1|t)&255;return this.zero=i===0,this.subtract=!1,this.halfCarry=!1,i}sla(e){this.carry=(e&128)!==0;const t=e<<1&255;return this.zero=t===0,this.subtract=!1,this.halfCarry=!1,t}sra(e){this.carry=(e&1)!==0;const t=e&128|e>>1;return this.zero=t===0,this.subtract=!1,this.halfCarry=!1,t}swap(e){const t=(e&15)<<4|e>>4;return this.zero=t===0,this.subtract=!1,this.halfCarry=!1,this.carry=!1,t}inc8(e){const t=e+1&255;return this.zero=t===0,this.subtract=!1,this.halfCarry=(e&15)===15,t}dec8(e){const t=e-1&255;return this.zero=t===0,this.subtract=!0,this.halfCarry=(e&15)===0,t}add8(e){const t=this.a+e;this.zero=(t&255)===0,this.subtract=!1,this.halfCarry=(this.a&15)+(e&15)>15,this.carry=t>255,this.a=t&255}adc8(e){const t=this.carry?1:0,i=this.a+e+t;this.zero=(i&255)===0,this.subtract=!1,this.halfCarry=(this.a&15)+(e&15)+t>15,this.carry=i>255,this.a=i&255}sub8(e){const t=this.a-e;this.zero=(t&255)===0,this.subtract=!0,this.halfCarry=(this.a&15)<(e&15),this.carry=this.a<e,this.a=t&255}sbc8(e){const t=this.carry?1:0,i=this.a-e-t;this.zero=(i&255)===0,this.subtract=!0,this.halfCarry=(this.a&15)<(e&15)+t,this.carry=this.a<e+t,this.a=i&255}and8(e){this.a&=e,this.zero=this.a===0,this.subtract=!1,this.halfCarry=!0,this.carry=!1}xor8(e){this.a^=e,this.zero=this.a===0,this.subtract=!1,this.halfCarry=!1,this.carry=!1}or8(e){this.a|=e,this.zero=this.a===0,this.subtract=!1,this.halfCarry=!1,this.carry=!1}cp8(e){const t=this.a;this.sub8(e),this.a=t}daa(){let e=0;(this.halfCarry||!this.subtract&&(this.a&15)>9)&&(e=6),(this.carry||!this.subtract&&this.a>153)&&(e|=96,this.carry=!0),this.a=this.a+(this.subtract?-e:e)&255,this.zero=this.a===0,this.halfCarry=!1}}class Sx{bus;cycles=0;frameBuffer=new Uint8ClampedArray(23040*4);scanlineColors=new Uint8Array(160);windowLineCounter=0;windowTriggeredOnLine=!1;lastRenderedX=0;mode3Duration=172;spritesOnLine=[];statIRQLine=!1;lcdStartup=!0;lcdEnableDelayMode3=!1;bgPaletteRAM=new Uint8Array(64);objPaletteRAM=new Uint8Array(64);bgPaletteIndex=0;bgPaletteAutoInc=!1;objPaletteIndex=0;objPaletteAutoInc=!1;dmgPalette=[[224,248,208],[136,192,112],[52,104,86],[8,24,32]];cgbColorProfile="accurate";constructor(e){this.bus=e,this.bgPaletteRAM.fill(255),this.objPaletteRAM.fill(255)}saveState(){return{cycles:this.cycles,windowLineCounter:this.windowLineCounter,windowTriggeredOnLine:this.windowTriggeredOnLine,bgPaletteRAM:Array.from(this.bgPaletteRAM),objPaletteRAM:Array.from(this.objPaletteRAM),bgPaletteIndex:this.bgPaletteIndex,bgPaletteAutoInc:this.bgPaletteAutoInc,objPaletteIndex:this.objPaletteIndex,objPaletteAutoInc:this.objPaletteAutoInc,lastRenderedX:this.lastRenderedX,mode3Duration:this.mode3Duration,spritesOnLine:this.spritesOnLine,statIRQLine:this.statIRQLine}}loadState(e){this.cycles=e.cycles,this.windowLineCounter=e.windowLineCounter,this.bgPaletteRAM.set(e.bgPaletteRAM),this.objPaletteRAM.set(e.objPaletteRAM),this.bgPaletteIndex=e.bgPaletteIndex,this.bgPaletteAutoInc=e.bgPaletteAutoInc,this.objPaletteIndex=e.objPaletteIndex,this.objPaletteAutoInc=e.objPaletteAutoInc,this.lastRenderedX=e.lastRenderedX||0,this.mode3Duration=e.mode3Duration||172,this.spritesOnLine=e.spritesOnLine||[],this.statIRQLine=!!e.statIRQLine}readPalette(e){switch(e){case 65384:return this.bgPaletteIndex|(this.bgPaletteAutoInc?128:0)|64;case 65385:return this.bgPaletteRAM[this.bgPaletteIndex];case 65386:return this.objPaletteIndex|(this.objPaletteAutoInc?128:0)|64;case 65387:return this.objPaletteRAM[this.objPaletteIndex];default:return 255}}writePalette(e,t){switch(e){case 65384:this.bgPaletteIndex=t&63,this.bgPaletteAutoInc=(t&128)!==0;break;case 65385:this.bgPaletteRAM[this.bgPaletteIndex]=t,this.bgPaletteAutoInc&&(this.bgPaletteIndex=this.bgPaletteIndex+1&63);break;case 65386:this.objPaletteIndex=t&63,this.objPaletteAutoInc=(t&128)!==0;break;case 65387:this.objPaletteRAM[this.objPaletteIndex]=t,this.objPaletteAutoInc&&(this.objPaletteIndex=this.objPaletteIndex+1&63);break}}setDMGPalette(e){this.dmgPalette=e}setCGBColorProfile(e){this.cgbColorProfile=e}clamp8(e){return Math.max(0,Math.min(255,Math.round(e)))}applyCGBProfile(e,t,i){const s=(r,a,o,l)=>{const c=(r+a+o)/3;return[this.clamp8(c+(r-c)*l),this.clamp8(c+(a-c)*l),this.clamp8(c+(o-c)*l)]};switch(this.cgbColorProfile){case"vivid":{const[r,a,o]=s(e,t,i,1.18);return[this.clamp8((r-128)*1.08+128),this.clamp8((a-128)*1.08+128),this.clamp8((o-128)*1.08+128)]}case"lcd":{const[r,a,o]=s(e,t,i,.9);return[this.clamp8((r-128)*.95+134),this.clamp8((a-128)*.95+134),this.clamp8((o-128)*.95+134)]}case"warm":return[this.clamp8(e*1.08),this.clamp8(t*1.02),this.clamp8(i*.9)];case"cool":return[this.clamp8(e*.92),this.clamp8(t*1),this.clamp8(i*1.08)];default:return[e,t,i]}}update(e){if(!(this.bus.readIOQuiet(65344)&128)){this.cycles=0,this.windowLineCounter=0,this.windowTriggeredOnLine=!1,this.bus.writeDirect(65348,0);let i=this.bus.readIOQuiet(65345);i&=-4,this.bus.writeDirect(65345,i),this.lcdStartup=!0,this.lcdEnableDelayMode3=!1;return}for(let i=0;i<e;i++){let r=this.bus.readIOQuiet(65345)&3,a=this.bus.readIOQuiet(65348);const o=this.cycles;if(a<144){const l=this.lcdEnableDelayMode3&&a===0?82:80,c=l+Math.max(172,this.mode3Duration);o<l?this.lcdEnableDelayMode3&&a===0?r!==0&&(this.setMode(0),r=0):r!==2&&(this.setMode(2),r=2):o<c?(r!==3&&(this.setMode(3),r=3,this.lastRenderedX=0,this.calculateMode3Duration(a)),this.midScanlineJIT()):r!==0&&(this.midScanlineJIT(),this.setMode(0),r=0)}else r!==1&&(this.setMode(1),r=1);this.cycles++,this.cycles>=456&&(this.cycles=0,this.windowTriggeredOnLine&&(this.windowLineCounter++,this.windowTriggeredOnLine=!1),a++,a>153&&(a=0,this.windowLineCounter=0),this.bus.writeDirect(65348,a),a!==0&&(this.lcdStartup=!1,this.lcdEnableDelayMode3=!1),this.updateLYCFlag(a),a<144&&!(this.lcdStartup&&a===0)?this.setMode(2):a>=144&&(this.setMode(1),a===144&&this.requestInterrupt(0))),this.updateStatIRQ()}}setMode(e){this.bus.readIOQuiet(65345)&3;let t=this.bus.readIOQuiet(65345);t=t&-4|e&3,this.bus.writeDirect(65345,t),this.updateStatIRQ(),e===0&&this.bus.notifyHBlank()}onLcdEnable(){this.cycles=0,this.lcdStartup=!0,this.lcdEnableDelayMode3=!0,this.windowLineCounter=0,this.windowTriggeredOnLine=!1,this.lastRenderedX=0}updateLYCFlag(e){const t=this.bus.readIOQuiet(65349);let i=this.bus.readIOQuiet(65345);e===t?i|=4:i&=-5,this.bus.writeDirect(65345,i),this.updateStatIRQ()}updateStatIRQ(){if(!(this.bus.readIOQuiet(65344)&128))return;const t=this.bus.readIOQuiet(65345),i=t&3,s=(t&4)!==0,r=t&64&&s,a=t&32&&i===2,o=t&16&&i===1,l=t&8&&i===0,c=!!(r||a||o||l);!this.statIRQLine&&c&&this.requestInterrupt(1),this.statIRQLine=c}onStatWrite(){this.updateStatIRQ()}requestInterrupt(e){const t=this.bus.readIOQuiet(65295);this.bus.writeDirect(65295,t|1<<e)}midScanlineJIT(){if(!(this.bus.readIOQuiet(65344)&128))return;const t=this.bus.readIOQuiet(65348),s=this.bus.readIOQuiet(65345)&3;if(t>=144||s!==3||this.cycles<80)return;let r=Math.floor((this.cycles-80)*(160/this.mode3Duration));r>160&&(r=160),!(r<=this.lastRenderedX)&&(this.renderLineRange(t,this.lastRenderedX,r),this.lastRenderedX=r)}calculateMode3Duration(e){const t=this.bus.readIOQuiet(65347),i=this.bus.readIOQuiet(65344);let s=172;const r=t%8;if(r>=1&&r<=4?s+=4:r>=5&&(s+=8),this.spritesOnLine=[],i&2){const o=(i&4)!==0?16:8;for(let l=0;l<40;l++){const c=65024+l*4,h=this.bus.readOAMQuiet(c)-16;if(e>=h&&e<h+o){const u=this.bus.readOAMQuiet(c+1)-8;if(this.spritesOnLine.push({x:u,y:h,tileId:this.bus.readOAMQuiet(c+2),attr:this.bus.readOAMQuiet(c+3),index:l}),this.spritesOnLine.length>=10)break}}}this.mode3Duration=s}renderLineRange(e,t,i){const s=this.bus.readIOQuiet(65344),r=this.bus.isCGB;if((s&1)!==0||r)this.renderBackgroundRange(e,s,t,i),s&32&&this.renderWindowRange(e,s,t,i);else for(let o=t;o<i;o++)this.setPixel(o,e,0);i===160&&s&2&&this.renderSprites(e,s)}renderBackgroundRange(e,t,i,s){const r=this.bus.readIOQuiet(65346),a=this.bus.readIOQuiet(65347),o=this.bus.readIOQuiet(65351),l=t&8?39936:38912,c=t&16?32768:34816,h=(t&16)!==0,u=e+r&255,d=u>>3&31,f=u&7;for(let g=i;g<s;g++){const _=g+a&255,m=_>>3&31,p=_&7,b=l+d*32+m;let M=this.bus.readVRAM(0,b),y=0,A=0,w=!1,C=!1,x=!1;if(this.bus.isCGB){const N=this.bus.readVRAM(1,b);y=N&7,A=N>>3&1,w=(N&32)!==0,C=(N&64)!==0,x=(t&1)!==0&&(N&128)!==0}let E;h?E=c+M*16:(M>127&&(M-=256),E=36864+M*16);let W=C?7-f:f,R=w?7-p:p;const k=this.bus.readVRAM(A,E+W*2),B=this.bus.readVRAM(A,E+W*2+1),z=7-R,H=(B>>z&1)<<1|k>>z&1;if(this.scanlineColors[g]=H|(x?128:0),this.bus.isCGB)this.setPixelCGB(g,e,y,H);else{const N=o>>H*2&3;this.setPixel(g,e,N)}}}renderSprites(e,t){const i=(t&4)!==0,s=i?16:8,r=[...this.spritesOnLine];r.sort((a,o)=>this.bus.isCGB?o.index-a.index:a.x!==o.x?o.x-a.x:o.index-a.index);for(const a of r){const o=(a.attr&32)!==0,l=(a.attr&64)!==0,c=(a.attr&128)!==0;let h=e-a.y;l&&(h=s-1-h);let u=a.tileId;i&&(u&=254,h>=8&&(u|=1,h-=8));let d=0,f=0;this.bus.isCGB&&(d=a.attr>>3&1,f=a.attr&7);const g=32768+u*16,_=this.bus.readVRAM(d,g+h*2),m=this.bus.readVRAM(d,g+h*2+1);for(let p=0;p<8;p++){const b=a.x+p;if(b<0||b>=160)continue;const M=o?p:7-p,y=(m>>M&1)<<1|_>>M&1;if(y===0)continue;const A=this.scanlineColors[b],w=A&127,C=(A&128)!==0;if(this.bus.isCGB){if((t&1)!==0&&(C&&w!==0||c&&w!==0))continue}else if((t&1)!==0&&c&&w!==0)continue;if(this.bus.isCGB)this.setPixelCGB_OBJ(b,e,f,y);else{const x=a.attr&16?65353:65352,W=this.bus.readIOQuiet(x)>>y*2&3;this.setPixel(b,e,W)}}}}renderWindowRange(e,t,i,s){const r=this.bus.readIOQuiet(65354),a=this.bus.readIOQuiet(65355)-7,o=this.bus.readIOQuiet(65351);if(e<r||a>=s)return;const l=t&64?39936:38912,c=t&16?32768:34816,h=(t&16)!==0,u=this.windowLineCounter,d=u>>3&31,f=u&7;let g=!1;for(let _=Math.max(i,a);_<s;_++){g=!0;const m=_-a,p=m>>3&31,b=m&7,M=l+d*32+p;let y=this.bus.readVRAM(0,M),A=0,w=0,C=!1,x=!1,E=!1;if(this.bus.isCGB){const O=this.bus.readVRAM(1,M);A=O&7,w=O>>3&1,C=(O&32)!==0,x=(O&64)!==0,E=(t&1)!==0&&(O&128)!==0}let W;h?W=c+y*16:(y>127&&(y-=256),W=36864+y*16);let R=x?7-f:f,k=C?7-b:b;const B=this.bus.readVRAM(w,W+R*2),z=this.bus.readVRAM(w,W+R*2+1),H=7-k,N=(z>>H&1)<<1|B>>H&1;if(this.scanlineColors[_]=N|(E?128:0),this.bus.isCGB)this.setPixelCGB(_,e,A,N);else{const O=o>>N*2&3;this.setPixel(_,e,O)}}g&&(this.windowTriggeredOnLine=!0)}setPixel(e,t,i){const s=(t*160+e)*4,r=this.dmgPalette[i];this.frameBuffer[s+0]=r[0],this.frameBuffer[s+1]=r[1],this.frameBuffer[s+2]=r[2],this.frameBuffer[s+3]=255}setPixelCGB(e,t,i,s){const r=(t*160+e)*4,a=i*8+s*2,o=this.bgPaletteRAM[a],c=this.bgPaletteRAM[a+1]<<8|o,h=c&31,u=c>>5&31,d=c>>10&31,f=h<<3|h>>2,g=u<<3|u>>2,_=d<<3|d>>2,[m,p,b]=this.applyCGBProfile(f,g,_);this.frameBuffer[r+0]=m,this.frameBuffer[r+1]=p,this.frameBuffer[r+2]=b,this.frameBuffer[r+3]=255}setPixelCGB_OBJ(e,t,i,s){const r=(t*160+e)*4,a=i*8+s*2,o=this.objPaletteRAM[a],c=this.objPaletteRAM[a+1]<<8|o,h=c&31,u=c>>5&31,d=c>>10&31,f=h<<3|h>>2,g=u<<3|u>>2,_=d<<3|d>>2,[m,p,b]=this.applyCGBProfile(f,g,_);this.frameBuffer[r+0]=m,this.frameBuffer[r+1]=p,this.frameBuffer[r+2]=b,this.frameBuffer[r+3]=255}}var ou={};class Mx extends Sx{busRef;statIfLatched=!1;statTriggerMode=0;statMode2Trigger=!1;statLycTrigger=!1;sbCycles=0;sbLcdEnableWarmupCycles=0;sbLcdEnableDelayMode3=!0;sbMode3Duration=172;lcdWasOn=!1;sbEarlyHblankStatPulse=!1;sbMode0WriteArmed=!1;prevStatIrqMask=0;sbMode3StartDot=80;sbMode3EndDot=252;sbDrainEndDot=252;sbSpritesOnLineCount=0;sbScanlinePhase="startup";sbAccessMode=0;sbStatModeLocked=!1;sbTraceEnabled;sbAwaitFirstMode2AfterLcdOn=!1;sbAwaitFirstMode3AfterLcdOn=!1;sbAwaitFirstLyIncAfterLcdOn=!1;sbAwaitFirstStatAfterLcdOn=!1;sbStartupMode3StartOverride;sbStartupLineLengthOverride;sbSpritePenaltySingleBaseOverride;sbSpritePenaltyMultiBaseOverride;sbSpriteFetchCostOverride;sbSpriteZeroScxBonusOverride;constructor(e){super(e),this.busRef=e;const t=typeof process<"u"&&ou?ou:void 0;this.sbTraceEnabled=t?.HIP_PPU_TRACE==="1";const i=s=>{const r=t?.[s];if(r==null||r==="")return null;const a=Number.parseInt(r,10);return Number.isFinite(a)?a:null};this.sbStartupMode3StartOverride=i("HIP_PPU_STARTUP_MODE3_START"),this.sbStartupLineLengthOverride=i("HIP_PPU_STARTUP_LINE_LENGTH"),this.sbSpritePenaltySingleBaseOverride=i("HIP_PPU_SPRITE_SINGLE_BASE"),this.sbSpritePenaltyMultiBaseOverride=i("HIP_PPU_SPRITE_MULTI_BASE"),this.sbSpriteFetchCostOverride=i("HIP_PPU_SPRITE_FETCH_COST"),this.sbSpriteZeroScxBonusOverride=i("HIP_PPU_SPRITE_ZERO_SCX_BONUS")}onLcdEnable(){super.onLcdEnable(),this.lcdWasOn=!0,this.sbCycles=0,this.sbLcdEnableWarmupCycles=0,this.sbLcdEnableDelayMode3=!0,this.sbScanlinePhase="startup",this.sbAccessMode=0,this.sbStatModeLocked=!1,this.statIfLatched=!1,this.statTriggerMode=-1,this.statMode2Trigger=!1,this.statLycTrigger=!1,this.sbEarlyHblankStatPulse=!1,this.sbMode0WriteArmed=!1,this.prevStatIrqMask=this.busRef.readIOQuiet(65345)&120,this.sbAwaitFirstMode2AfterLcdOn=!0,this.sbAwaitFirstMode3AfterLcdOn=!0,this.sbAwaitFirstLyIncAfterLcdOn=!0,this.sbAwaitFirstStatAfterLcdOn=!0,this.sbUpdateLYCFlagNow(0),this.updateStatIRQ(),this.sbTrace("lcd_on_edge",this.sbTraceCoreFields("event=lcd_was_off_now_on fetcher_state=startup fifo_size=-1"))}update(e){if(!(this.busRef.readIOQuiet(65344)&128)){if(this.lcdWasOn){this.lcdWasOn=!1,this.sbCycles=0,this.sbLcdEnableWarmupCycles=0,this.sbScanlinePhase="startup",this.sbAccessMode=0,this.sbStatModeLocked=!1,this.statIfLatched=!1,this.statMode2Trigger=!1,this.statLycTrigger=!1,this.sbEarlyHblankStatPulse=!1,this.sbMode0WriteArmed=!1,this.prevStatIrqMask=0,this.busRef.writeDirect(65348,0);const i=this.busRef.readIOQuiet(65345);this.busRef.writeDirect(65345,i&-4)}return}this.lcdWasOn||(this.sbScanlinePhase="startup"),this.lcdWasOn=!0;for(let i=0;i<e;i++){this.statMode2Trigger=!1,this.statLycTrigger=!1;let r=this.busRef.readIOQuiet(65345)&3,a=this.busRef.readIOQuiet(65348);const o=this.sbCycles;if(o===0&&!this.sbAwaitFirstLyIncAfterLcdOn&&this.updateLYCFlag(a),a<144){o===0&&this.sbPlanVisibleScanline(a);const c=this.sbMode3StartDot,h=this.sbMode3EndDot,u=this.sbDrainEndDot,f=!(this.sbLcdEnableDelayMode3&&a===0)&&(this.sbMode3Duration&3)===0;this.sbMode0WriteArmed&&r===3&&this.sbSpritesOnLineCount===0&&f&&o===h-4&&(this.sbEarlyHblankStatPulse=!0),o<c?(this.sbScanlinePhase=this.sbLcdEnableDelayMode3&&a===0?"startup":"oam",this.sbLcdEnableDelayMode3&&a===0?r!==0&&this.sbSetMode(0):r!==2&&this.sbSetMode(2)):o<h?(this.sbScanlinePhase="xfer",r!==3&&this.sbSetMode(3)):o<u?(this.sbScanlinePhase="drain",r!==3&&this.sbSetMode(3)):(this.sbScanlinePhase="hblank",r!==0&&this.sbSetMode(0),this.sbMode0WriteArmed=!1)}else this.sbScanlinePhase="vblank",r!==1&&this.sbSetMode(1),this.sbMode0WriteArmed=!1;this.sbCycles++;const l=this.sbLcdEnableDelayMode3&&a===0?this.sbStartupLineLengthOverride??452:456;if(this.sbCycles>=l){this.sbCycles=0,this.windowTriggeredOnLine&&(this.windowLineCounter=(this.windowLineCounter??0)+1,this.windowTriggeredOnLine=!1),a++,a>153&&(a=0),a===0&&(this.windowLineCounter=0,this.windowTriggeredOnLine=!1),this.busRef.writeDirect(65348,a),this.sbAwaitFirstLyIncAfterLcdOn&&(this.sbAwaitFirstLyIncAfterLcdOn=!1,this.sbTrace("first_ly_inc",this.sbTraceCoreFields("event=first_ly_increment fetcher_state=line_advance fifo_size=-1")));const c=this.busRef.readIOQuiet(65345);this.busRef.writeDirect(65345,c&-5),a<144?(this.sbLcdEnableDelayMode3&&a===0||(this.statTriggerMode=2,this.statMode2Trigger=!0,this.sbAccessMode=2),this.sbStatModeLocked=!0):(this.sbSetMode(1),a===144&&this.sbRequestInterrupt(0)),a!==0&&(this.sbLcdEnableDelayMode3=!1),a===0&&(this.sbMode0WriteArmed=!1)}this.updateStatIRQ(),this.sbEarlyHblankStatPulse=!1}{const i=this.busRef.readIOQuiet(65348),s=this.sbCycles;if(i<144){const r=this.sbLcdEnableDelayMode3&&i===0;s<this.sbMode3StartDot?this.sbAccessMode=r?0:2:s<this.sbDrainEndDot?this.sbAccessMode=3:!r&&s===this.sbDrainEndDot?this.sbAccessMode=3:this.sbAccessMode=0}else this.sbAccessMode=1}}getStatReadMode(){const e=this.busRef.readIOQuiet(65345)&3;if(this.sbStatModeLocked)return e;const t=this.busRef.readIOQuiet(65348);if(this.sbLcdEnableDelayMode3&&t===0){const i=this.sbCycles,s=this.sbStartupMode3StartOverride??80;return i<s?0:i<this.sbDrainEndDot?3:0}return e}updateLYCFlag(e){this.busRef.readIOQuiet(65344)&128&&(this.sbUpdateLYCFlagNow(e),this.updateStatIRQ())}updateStatIRQ(){if(!(this.busRef.readIOQuiet(65344)&128)){this.statIfLatched=!1;return}if(this.sbLcdEnableWarmupCycles>0)return;const t=this.busRef.readIOQuiet(65345),i=(t&4)!==0,s=(t&8)!==0,r=(t&16)!==0,a=(t&32)!==0,o=(t&64)!==0,l=(this.statTriggerMode===0||this.sbEarlyHblankStatPulse)&&s,c=this.statTriggerMode===1&&r,h=this.statMode2Trigger&&a,u=this.statLycTrigger&&o,d=l||c||h||u,f=l||c||this.statTriggerMode===2&&a||i&&o;if(!this.statIfLatched&&d){const g=this.busRef.readIOQuiet(65295);this.busRef.writeDirect(65295,g|2),this.statIfLatched=!0,this.sbTrace("stat_if_set",this.sbTraceCoreFields("event=if_or_0x02 fetcher_state=irq fifo_size=-1")),this.sbAwaitFirstStatAfterLcdOn&&(this.sbAwaitFirstStatAfterLcdOn=!1,this.sbTrace("first_stat",this.sbTraceCoreFields("event=first_stat_interrupt fetcher_state=irq fifo_size=-1")))}else this.statIfLatched&&!f&&(this.statIfLatched=!1)}onStatWrite(){const e=this.busRef.readIOQuiet(65345),t=e&120,i=e&3,s=(this.prevStatIrqMask&8)!==0,r=(t&8)!==0;!s&&r&&i===3&&(this.sbMode0WriteArmed=!0),this.prevStatIrqMask=t,this.updateStatIRQ()}onLYCWrite(){this.updateLYCFlag(this.busRef.readIOQuiet(65348))}midScanlineJIT(){}sbSetMode(e){const t=this.busRef.readIOQuiet(65345),i=t&3;if(i!==3&&e===3){const s=this.busRef.readIOQuiet(65348);this.calculateMode3Duration(s),this.lastRenderedX=0,this.mode3Duration=this.sbMode3Duration}if(i===3&&e===0&&(this.cycles=this.sbCycles,super.midScanlineJIT()),this.busRef.writeDirect(65345,t&-4|e&3),this.sbAccessMode=e,this.sbStatModeLocked=!1,i===3&&e===0){const s=Math.max(0,this.sbCycles-this.sbMode3StartDot),r=this.sbScanlinePhase==="xfer"&&this.sbSpritesOnLineCount>0;this.sbTrace("mode3_to_mode0",this.sbTraceCoreFields(`event=mode3_to_mode0 x=${s} fetcher_state=${this.sbScanlinePhase} fifo_size=-1 sprite_fetch_active=${r?1:0}`))}i!==e&&(this.statTriggerMode=e,e===2&&(this.statMode2Trigger=!0),this.sbAwaitFirstMode2AfterLcdOn&&e===2&&(this.sbAwaitFirstMode2AfterLcdOn=!1,this.sbTrace("first_mode2",this.sbTraceCoreFields("event=first_mode2 fetcher_state=oam fifo_size=-1"))),this.sbAwaitFirstMode3AfterLcdOn&&e===3&&(this.sbAwaitFirstMode3AfterLcdOn=!1,this.sbTrace("first_mode3",this.sbTraceCoreFields("event=first_mode3 fetcher_state=xfer fifo_size=-1")))),e===0&&this.busRef.notifyHBlank(),this.updateStatIRQ()}sbRequestInterrupt(e){const t=this.busRef.readIOQuiet(65295);this.busRef.writeDirect(65295,t|1<<e)}sbCalculateMode3Duration(e){const t=this.busRef.readIOQuiet(65347),i=this.busRef.readIOQuiet(65344),s=this.busRef.readIOQuiet(65354),r=this.busRef.readIOQuiet(65355);let a=172;const o=t&7;if(o>=1&&o<=4?a+=4:o>=5&&(a+=8),(i&32)!==0&&e>=s&&r<=166&&(a+=6),i&2){const h=(i&4)!==0?16:8,u=[];for(let p=0;p<40&&u.length<10;p++){const b=65024+p*4,M=this.busRef.readOAMQuiet(b)-16;if(e<M||e>=M+h)continue;const y=this.busRef.readOAMQuiet(b+1);y>=168||u.push({oamIndex:p,xRaw:y,screenX:y-8})}u.sort((p,b)=>p.screenX!==b.screenX?p.screenX-b.screenX:p.oamIndex-b.oamIndex);const d=this.sbSpritePenaltySingleBaseOverride??5,f=this.sbSpritePenaltyMultiBaseOverride??0,g=this.sbSpriteFetchCostOverride??6,_=this.sbSpriteZeroScxBonusOverride??-1,m=new Set;for(const p of u){const b=p.screenX+o,y=Math.max(0,b)>>3,A=b&7,w=m.has(y)?f:d;m.add(y);const C=Math.max(0,w-A),x=g+C;a+=x,p.screenX===0&&_>=0&&(a+=_)}for(let p=1;p<u.length;p++){const b=u[p-1];if(u[p].xRaw-b.xRaw===8){const y=b.xRaw&7;b.xRaw<8&&y<=3&&(a+=4)}}this.sbSpritesOnLineCount=u.length,this.sbTrace("mode3_length",this.sbTraceCoreFields(`event=mode3_length line=${e} mode3_length=${a} sprites=${this.sbSpritesOnLineCount} fetcher_state=calc fifo_size=-1`))}else this.sbSpritesOnLineCount=0;this.sbMode3Duration=a}sbPlanVisibleScanline(e){this.sbCalculateMode3Duration(e);let t=80;this.sbLcdEnableDelayMode3&&e===0&&(t=this.sbStartupMode3StartOverride??80);const i=t+this.sbMode3Duration,s=0;this.sbMode3StartDot=t,this.sbMode3EndDot=i,this.sbDrainEndDot=i+s}sbUpdateLYCFlagNow(e){const t=this.busRef.readIOQuiet(65349);let i=this.busRef.readIOQuiet(65345);const s=(i&4)!==0,r=e===t;r?i|=4:i&=-5,this.busRef.writeDirect(65345,i),!s&&r&&(this.statLycTrigger=!0)}sbTraceCoreFields(e){const t=this.busRef.readIOQuiet(65348),s=this.busRef.readIOQuiet(65345)&3,r=this.sbCycles;return`global_cycle=${this.busRef.cyclesTicked} LY=${t} dot=${r} mode=${s} ${e}`}sbTrace(e,t){this.sbTraceEnabled&&console.log(`[PPU_TRACE] ${e} ${t}`)}}class yx{bus;internalCounter=0;timaState=0;stateDelay=0;constructor(e){this.bus=e}saveState(){return{internalCounter:this.internalCounter,isReloadPending:this.timaState!==0,reloadDelay:this.stateDelay,reloadState:this.timaState}}loadState(e){this.internalCounter=e.internalCounter;const t=e.reloadState;t===1||t===2?this.timaState=t:this.timaState=e.isReloadPending?1:0,this.stateDelay=e.reloadDelay||0,this.bus.writeDirect(65284,this.internalCounter>>8&255)}readTIMA(){return this.bus.readIORegisterRaw(65285)}update(e){for(let t=0;t<e;t++){const i=this.bus.readIORegisterRaw(65287),s=this.timerInputSignal(this.internalCounter,i);this.internalCounter=this.internalCounter+1&65535,this.bus.writeDirect(65284,this.internalCounter>>8&255);const r=this.timerInputSignal(this.internalCounter,i);this.tickTimaState(),s&&!r&&this.handleFallingEdge()}}timerInputSignal(e,t){if((t&4)===0)return!1;const i=[9,3,5,7][t&3];return(e>>i&1)!==0}timerSelectedBitHigh(e,t){const i=[9,3,5,7][t&3];return(e>>i&1)!==0}handleFallingEdge(){this.incrementTIMA()}incrementTIMA(){const e=this.bus.readIORegisterRaw(65285)+1&255;this.bus.writeDirect(65285,e),e===0&&(this.timaState=1,this.stateDelay=4)}tickTimaState(){if(this.timaState!==0&&(this.stateDelay--,!(this.stateDelay>0))){if(this.timaState===1){const e=this.bus.readIORegisterRaw(65286);this.bus.writeDirect(65285,e);const t=this.bus.readIORegisterRaw(65295);this.bus.writeDirect(65295,t|4),this.timaState=2,this.stateDelay=4;return}this.timaState=0,this.stateDelay=0}}write(e,t){const i=this.bus.readIORegisterRaw(65287),s=this.internalCounter,r=this.timerInputSignal(s,i);switch(e){case 65284:this.internalCounter=0,this.bus.writeDirect(65284,0);break;case 65285:if(this.timaState===2)break;this.timaState===1&&(this.timaState=0,this.stateDelay=0),this.bus.writeDirect(65285,t);break;case 65286:this.bus.writeDirect(65286,t),this.timaState===2&&this.bus.writeDirect(65285,t);break;case 65287:this.bus.writeDirect(65287,t&7);break}if(e===65284||e===65287){const a=this.bus.readIORegisterRaw(65287),o=e===65284?0:s,l=this.timerInputSignal(o,a);if(e===65284&&r&&!l)this.handleFallingEdge();else if(e===65287){const c=(i&4)!==0,h=(a&4)!==0,u=this.timerSelectedBitHigh(s,i),d=this.timerSelectedBitHigh(s,a);let f=!1;c||(h?f=u:f=u&&!d),f&&this.handleFallingEdge()}}}resetDiv(){this.write(65284,0)}normalize(e){}}class Ex{bus;listener=null;frameSequencerStep=0;frameSequencerTimer=0;FRAME_SEQUENCER_RATE=8192;ch1=new Aa(!0);ch2=new Aa(!1);ch3=new Tx;ch4=new Ax;masterEnable=!1;volumeL=0;volumeR=0;vinL=!1;vinR=!1;pan=0;sampleTimer=0;SAMPLES_PER_SECOND=44100;CYCLES_PER_SAMPLE=4194304/44100;audioBuffer=new Float32Array(4096*2);bufferIndex=0;samplesThisFrame=0;accumL=0;accumR=0;accumCount=0;highPassL=0;highPassR=0;prevSampleL=0;prevSampleR=0;constructor(e){this.bus=e}setListener(e){this.listener=e}update(e){this.bus.isDoubleSpeed&&e>>1,this.frameSequencerTimer+=e,this.frameSequencerTimer>=this.FRAME_SEQUENCER_RATE&&(this.frameSequencerTimer-=this.FRAME_SEQUENCER_RATE,this.tickFrameSequencer()),this.ch1.update(e),this.ch2.update(e),this.ch3.update(e),this.ch4.update(e);const t=this.getMixedSamples();this.accumL+=t.l,this.accumR+=t.r,this.accumCount++,this.sampleTimer+=e,this.sampleTimer>=this.CYCLES_PER_SAMPLE&&(this.sampleTimer-=this.CYCLES_PER_SAMPLE,this.pushSample())}tickFrameSequencer(){this.frameSequencerStep%2===0&&(this.ch1.tickLength(),this.ch2.tickLength(),this.ch3.tickLength(),this.ch4.tickLength()),(this.frameSequencerStep===2||this.frameSequencerStep===6)&&this.ch1.tickSweep(),this.frameSequencerStep===7&&(this.ch1.tickEnvelope(),this.ch2.tickEnvelope(),this.ch4.tickEnvelope()),this.frameSequencerStep=(this.frameSequencerStep+1)%8}getMixedSamples(){if(!this.masterEnable)return{l:0,r:0};let e=0,t=0;const i=this.ch1.getOutput(),s=this.ch2.getOutput(),r=this.ch3.getOutput(),a=this.ch4.getOutput();return this.pan&1&&(t+=i),this.pan&16&&(e+=i),this.pan&2&&(t+=s),this.pan&32&&(e+=s),this.pan&4&&(t+=r),this.pan&64&&(e+=r),this.pan&8&&(t+=a),this.pan&128&&(e+=a),e*=(this.volumeL+1)/8,t*=(this.volumeR+1)/8,{l:e,r:t}}pushSample(){let e=this.accumCount>0?this.accumL/this.accumCount:0,t=this.accumCount>0?this.accumR/this.accumCount:0;this.accumL=0,this.accumR=0,this.accumCount=0;const i=.996;this.highPassL=e-this.prevSampleL+i*this.highPassL,this.highPassR=t-this.prevSampleR+i*this.highPassR,this.prevSampleL=e,this.prevSampleR=t;const s=.35;this.audioBuffer[this.bufferIndex++]=this.highPassL*s,this.audioBuffer[this.bufferIndex++]=this.highPassR*s,this.bufferIndex>=this.audioBuffer.length&&(this.bufferIndex=0),this.samplesThisFrame+=2}getRecentSamples(){const e=new Float32Array(this.samplesThisFrame);let t=0,i=(this.bufferIndex-this.samplesThisFrame+this.audioBuffer.length)%this.audioBuffer.length;for(;t<this.samplesThisFrame;)e[t++]=this.audioBuffer[i],i=(i+1)%this.audioBuffer.length;return this.samplesThisFrame=0,e}getAudioBuffer(){return this.audioBuffer}clearBuffer(){this.bufferIndex=0,this.audioBuffer.fill(0)}write(e,t){if(!(!this.masterEnable&&e!==65318)){switch(e){case 65296:this.ch1.nr10=t;break;case 65297:this.ch1.nr11=t;break;case 65298:this.ch1.nr12=t;break;case 65299:this.ch1.nr13=t;break;case 65300:this.ch1.nr14=t;break;case 65302:this.ch2.nr11=t;break;case 65303:this.ch2.nr12=t;break;case 65304:this.ch2.nr13=t;break;case 65305:this.ch2.nr14=t;break;case 65306:this.ch3.nr30=t;break;case 65307:this.ch3.nr31=t;break;case 65308:this.ch3.nr32=t;break;case 65309:this.ch3.nr33=t;break;case 65310:this.ch3.nr34=t;break;case 65312:this.ch4.nr41=t;break;case 65313:this.ch4.nr42=t;break;case 65314:this.ch4.nr43=t;break;case 65315:this.ch4.nr44=t;break;case 65316:this.volumeR=t&7,this.vinR=(t&8)!==0,this.volumeL=(t&112)>>4,this.vinL=(t&128)!==0;break;case 65317:this.pan=t;break;case 65318:const i=(t&128)!==0;this.masterEnable&&!i?(this.audioJIT(),this.reset()):!this.masterEnable&&i&&(this.frameSequencerStep=0,this.ch1.enabled=!1,this.ch2.enabled=!1,this.ch3.enabled=!1,this.ch4.enabled=!1),this.masterEnable=i;break}this.listener?.isEnabled()&&this.dispatchHDEvent(e,t)}}dispatchHDEvent(e,t){let i=null;e>=65296&&e<=65300?i={channel:1,enabled:this.ch1.enabled,frequency:this.ch1.frequency,volume:this.ch1.currentVolume,duty:this.ch1.duty}:e>=65302&&e<=65305?i={channel:2,enabled:this.ch2.enabled,frequency:this.ch2.frequency,volume:this.ch2.currentVolume,duty:this.ch2.duty}:e>=65306&&e<=65310?i={channel:3,enabled:this.ch3.enabled,frequency:this.ch3.frequency,volume:this.ch3.volumeCode}:e>=65312&&e<=65315&&(i={channel:4,enabled:this.ch4.enabled,frequency:this.ch4.getTimerPeriod?this.ch4.getTimerPeriod():0,volume:this.ch4.currentVolume}),i&&this.listener?.onRegisterWrite(e,t,i)}audioJIT(){}read(e){switch(e){case 65296:return this.ch1.nr10|128;case 65297:return this.ch1.nr11|63;case 65298:return this.ch1.nr12;case 65299:return 255;case 65300:return this.ch1.nr14|191;case 65302:return this.ch2.nr11|63;case 65303:return this.ch2.nr12;case 65304:return 255;case 65305:return this.ch2.nr14|191;case 65306:return this.ch3.nr30|127;case 65307:return 255;case 65308:return this.ch3.nr32|159;case 65309:return 255;case 65310:return this.ch3.nr34|191;case 65312:return 255;case 65313:return this.ch4.nr42;case 65314:return this.ch4.nr43;case 65315:return this.ch4.nr44|191;case 65316:return this.volumeR|(this.vinR?8:0)|this.volumeL<<4|(this.vinL?128:0);case 65317:return this.pan;case 65318:let t=this.masterEnable?128:0;return this.ch1.enabled&&(t|=1),this.ch2.enabled&&(t|=2),this.ch3.enabled&&(t|=4),this.ch4.enabled&&(t|=8),t|112;default:return 255}}writeWave(e,t){this.ch3.waveRAM[e-65328]=t,this.listener?.isEnabled()&&this.listener.onWaveWrite(e,t,this.ch3.waveRAM)}reset(){this.masterEnable=!1,this.ch1.nr10=0,this.ch1.nr11=0,this.ch1.nr12=0,this.ch1.nr13=0,this.ch1.nr14=0,this.ch2.nr11=0,this.ch2.nr12=0,this.ch2.nr13=0,this.ch2.nr14=0,this.ch3.nr30=0,this.ch3.nr31=0,this.ch3.nr32=0,this.ch3.nr33=0,this.ch3.nr34=0,this.ch4.nr41=0,this.ch4.nr42=0,this.ch4.nr43=0,this.ch4.nr44=0,this.volumeL=0,this.volumeR=0,this.pan=0,this.ch1.enabled=!1,this.ch2.enabled=!1,this.ch3.enabled=!1,this.ch4.enabled=!1}saveState(){return{frameSequencerStep:this.frameSequencerStep,frameSequencerTimer:this.frameSequencerTimer,masterEnable:this.masterEnable,volumeL:this.volumeL,volumeR:this.volumeR,vinL:this.vinL,vinR:this.vinR,pan:this.pan,sampleTimer:this.sampleTimer,ch1:this.ch1.saveState(),ch2:this.ch2.saveState(),ch3:this.ch3.saveState(),ch4:this.ch4.saveState()}}loadState(e){this.frameSequencerStep=e.frameSequencerStep,this.frameSequencerTimer=e.frameSequencerTimer,this.masterEnable=e.masterEnable,this.volumeL=e.volumeL,this.volumeR=e.volumeR,this.vinL=e.vinL,this.vinR=e.vinR,this.pan=e.pan,this.sampleTimer=e.sampleTimer,this.ch1.loadState(e.ch1),this.ch2.loadState(e.ch2),this.ch3.loadState(e.ch3),this.ch4.loadState(e.ch4)}}class gc{enabled=!1;timer=0;frequency=0;lengthCounter=0;lengthEnabled=!1;saveState(){return{enabled:this.enabled,timer:this.timer,frequency:this.frequency,lengthCounter:this.lengthCounter,lengthEnabled:this.lengthEnabled}}loadState(e){this.enabled=e.enabled,this.timer=e.timer,this.frequency=e.frequency,this.lengthCounter=e.lengthCounter,this.lengthEnabled=e.lengthEnabled}tickLength(){this.lengthEnabled&&this.lengthCounter>0&&(this.lengthCounter--,this.lengthCounter===0&&(this.enabled=!1))}}class Aa extends gc{isCh1;duty=2;dutyStep=0;initialVolume=0;envelopeDirection=0;envelopePeriod=0;envelopeTimer=0;currentVolume=0;sweepPeriod=0;sweepNegate=!1;sweepShift=0;sweepTimer=0;shadowFrequency=0;set nr10(e){this.sweepPeriod=(e&112)>>4,this.sweepNegate=(e&8)!==0,this.sweepShift=e&7}set nr11(e){this.duty=(e&192)>>6,this.lengthCounter=64-(e&63)}set nr12(e){this.initialVolume=(e&240)>>4,this.envelopeDirection=(e&8)>>3,this.envelopePeriod=e&7,(e&248)===0&&(this.enabled=!1)}set nr13(e){this.frequency=this.frequency&1792|e}set nr14(e){this.frequency=this.frequency&255|(e&7)<<8,this.lengthEnabled=(e&64)!==0,e&128&&this.trigger()}constructor(e){super(),this.isCh1=e}trigger(){this.enabled=!0,this.dutyStep=0,this.lengthCounter===0&&(this.lengthCounter=64),this.timer=(2048-this.frequency)*4,this.currentVolume=this.initialVolume,this.envelopeTimer=this.envelopePeriod,this.isCh1&&(this.shadowFrequency=this.frequency,this.sweepTimer=this.sweepPeriod===0?8:this.sweepPeriod,this.sweepShift>0&&this.calculateSweepFrequency())}update(e){this.enabled&&(this.timer-=e,this.timer<=0&&(this.timer+=(2048-this.frequency)*4,this.dutyStep=(this.dutyStep+1)%8))}tickEnvelope(){this.envelopePeriod!==0&&(this.envelopeTimer--,this.envelopeTimer<=0&&(this.envelopeTimer=this.envelopePeriod,this.envelopeDirection===1&&this.currentVolume<15?this.currentVolume++:this.envelopeDirection===0&&this.currentVolume>0&&this.currentVolume--))}tickSweep(){if(!(!this.isCh1||this.sweepPeriod===0)&&(this.sweepTimer--,this.sweepTimer<=0)){this.sweepTimer=this.sweepPeriod===0?8:this.sweepPeriod;const e=this.calculateSweepFrequency();e<2048&&this.sweepShift>0&&(this.frequency=e,this.shadowFrequency=e,this.calculateSweepFrequency())}}calculateSweepFrequency(){let e=this.shadowFrequency>>this.sweepShift;return this.sweepNegate?e=this.shadowFrequency-e:e=this.shadowFrequency+e,e>=2048&&(this.enabled=!1),e}static DUTIES=[[0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,1],[1,0,0,0,0,1,1,1],[0,1,1,1,1,1,1,0]];getOutput(){return this.enabled&&Aa.DUTIES[this.duty][this.dutyStep]?this.currentVolume/15:0}saveState(){const e={...super.saveState(),duty:this.duty,dutyStep:this.dutyStep,initialVolume:this.initialVolume,envelopeDirection:this.envelopeDirection,envelopePeriod:this.envelopePeriod,envelopeTimer:this.envelopeTimer,currentVolume:this.currentVolume};return this.isCh1&&(e.sweepPeriod=this.sweepPeriod,e.sweepNegate=this.sweepNegate,e.sweepShift=this.sweepShift,e.sweepTimer=this.sweepTimer,e.shadowFrequency=this.shadowFrequency),e}loadState(e){super.loadState(e),this.duty=e.duty,this.dutyStep=e.dutyStep,this.initialVolume=e.initialVolume,this.envelopeDirection=e.envelopeDirection,this.envelopePeriod=e.envelopePeriod,this.envelopeTimer=e.envelopeTimer,this.currentVolume=e.currentVolume,this.isCh1&&(this.sweepPeriod=e.sweepPeriod||0,this.sweepNegate=e.sweepNegate||!1,this.sweepShift=e.sweepShift||0,this.sweepTimer=e.sweepTimer||0,this.shadowFrequency=e.shadowFrequency||0)}}class Tx extends gc{waveRAM=new Uint8Array(16);waveEnabled=!1;volumeCode=0;sampleIndex=0;set nr30(e){this.waveEnabled=(e&128)!==0,this.waveEnabled||(this.enabled=!1)}set nr31(e){this.lengthCounter=256-e}set nr32(e){this.volumeCode=(e&96)>>5}set nr33(e){this.frequency=this.frequency&1792|e}set nr34(e){this.frequency=this.frequency&255|(e&7)<<8,this.lengthEnabled=(e&64)!==0,e&128&&this.trigger()}trigger(){this.enabled=!0,this.lengthCounter===0&&(this.lengthCounter=256),this.timer=(2048-this.frequency)*2,this.sampleIndex=0}update(e){this.enabled&&(this.timer-=e,this.timer<=0&&(this.timer+=(2048-this.frequency)*2,this.sampleIndex=(this.sampleIndex+1)%32))}getOutput(){if(!this.enabled||!this.waveEnabled)return 0;const e=this.sampleIndex>>1,t=this.sampleIndex&1?this.waveRAM[e]&15:this.waveRAM[e]>>4;let i=0;switch(this.volumeCode){case 0:i=4;break;case 1:i=0;break;case 2:i=1;break;case 3:i=2;break}return(t>>i)/15}saveState(){return{...super.saveState(),waveRAM:Array.from(this.waveRAM),waveEnabled:this.waveEnabled,volumeCode:this.volumeCode,sampleIndex:this.sampleIndex}}loadState(e){super.loadState(e),this.waveRAM.set(e.waveRAM),this.waveEnabled=e.waveEnabled,this.volumeCode=e.volumeCode,this.sampleIndex=e.sampleIndex}}class Ax extends gc{divisor=0;clockShift=0;widthMode=!1;lfsr=32767;initialVolume=0;envelopeDirection=0;envelopePeriod=0;envelopeTimer=0;currentVolume=0;set nr41(e){this.lengthCounter=64-(e&63)}set nr42(e){this.initialVolume=(e&240)>>4,this.envelopeDirection=(e&8)>>3,this.envelopePeriod=e&7,(e&248)===0&&(this.enabled=!1)}set nr43(e){this.clockShift=(e&240)>>4,this.widthMode=(e&8)!==0,this.divisor=e&7}set nr44(e){this.lengthEnabled=(e&64)!==0,e&128&&this.trigger()}trigger(){this.enabled=!0,this.lengthCounter===0&&(this.lengthCounter=64),this.lfsr=32767,this.currentVolume=this.initialVolume,this.envelopeTimer=this.envelopePeriod,this.timer=this.getTimerPeriod()}getTimerPeriod(){return(this.divisor===0?8:this.divisor*16)<<this.clockShift}update(e){if(this.enabled&&(this.timer-=e,this.timer<=0)){this.timer+=this.getTimerPeriod();const t=(this.lfsr^this.lfsr>>1)&1;this.lfsr=this.lfsr>>1|t<<14,this.widthMode&&(this.lfsr=this.lfsr&-65|t<<6)}}tickEnvelope(){this.envelopePeriod!==0&&(this.envelopeTimer--,this.envelopeTimer<=0&&(this.envelopeTimer=this.envelopePeriod,this.envelopeDirection===1&&this.currentVolume<15?this.currentVolume++:this.envelopeDirection===0&&this.currentVolume>0&&this.currentVolume--))}getOutput(){return this.enabled&&~this.lfsr&1?this.currentVolume/15:0}saveState(){return{...super.saveState(),divisor:this.divisor,clockShift:this.clockShift,widthMode:this.widthMode,lfsr:this.lfsr,initialVolume:this.initialVolume,envelopeDirection:this.envelopeDirection,envelopePeriod:this.envelopePeriod,envelopeTimer:this.envelopeTimer,currentVolume:this.currentVolume}}loadState(e){super.loadState(e),this.divisor=e.divisor,this.clockShift=e.clockShift,this.widthMode=e.widthMode,this.lfsr=e.lfsr,this.initialVolume=e.initialVolume,this.envelopeDirection=e.envelopeDirection,this.envelopePeriod=e.envelopePeriod,this.envelopeTimer=e.envelopeTimer,this.currentVolume=e.currentVolume}}class wx{bus;sb=0;sc=126;transferCycles=0;transferBitCounter=0;constructor(e){this.bus=e}saveState(){return{sb:this.sb,sc:this.sc,transferCycles:this.transferCycles,transferBitCounter:this.transferBitCounter}}loadState(e){this.sb=e.sb,this.sc=e.sc,this.transferCycles=e.transferCycles,this.transferBitCounter=e.transferBitCounter}read(e){return e===65281?this.sb:e===65282?this.sc|126:255}write(e,t){e===65281?this.sb=t:e===65282&&(this.sc=t,(this.sc&129)===129&&(this.bus.serialCallback&&this.bus.serialCallback(String.fromCharCode(this.sb)),this.sc&=127,this.requestInterrupt()))}update(e){this.transferBitCounter>0&&(this.transferCycles-=e,this.transferCycles<=0&&(this.sb=this.sb<<1&255|1,this.transferBitCounter--,this.transferBitCounter>0?this.transferCycles=1:(this.sc&=127,this.bus.serialCallback&&this.bus.serialCallback(String.fromCharCode(this.sb)),this.requestInterrupt())))}requestInterrupt(){const e=this.bus.readIOQuiet(65295);this.bus.writeDirect(65295,e|8)}}class Rx{bus;breakpoints=new Set;lastPC=-1;constructor(e){this.bus=e}addBreakpoint(e){this.breakpoints.add(e&65535)}removeBreakpoint(e){this.breakpoints.delete(e&65535)}clearBreakpoints(){this.breakpoints.clear()}isBreakpoint(e){return this.breakpoints.has(e)}disassemble(e,t){const i=[];let s=e&65535;for(let r=0;r<t;r++){const a=this.bus.readDirect(s);let o;if(a===203){const l=this.bus.readDirect(s+1&65535);o=this.getCBInstruction(l),o.length=2}else o=this.getInstruction(a,s);o.addr=s,o.opcode=a,i.push(o),s=s+o.length&65535}return i}getInstruction(e,t){const i=Dx[e]||{mnemonic:"???",length:1},s=[];if(i.length===2)s.push(`$${this.bus.readDirect(t+1&65535).toString(16).padStart(2,"0").toUpperCase()}`);else if(i.length===3){const r=this.bus.readDirect(t+1&65535),a=this.bus.readDirect(t+2&65535);s.push(`$${(a<<8|r).toString(16).padStart(4,"0").toUpperCase()}`)}return{addr:0,opcode:e,mnemonic:i.mnemonic,length:i.length,operands:s}}getCBInstruction(e){const t=Px[e>>3&31]||"???",i=Cx[e&7];return{addr:0,opcode:e,mnemonic:`${t} ${i}`,length:2,operands:[]}}}const Cx=["B","C","D","E","H","L","(HL)","A"],Px=["RLC","RRC","RL","RR","SLA","SRA","SWAP","SRL","BIT 0,","BIT 1,","BIT 2,","BIT 3,","BIT 4,","BIT 5,","BIT 6,","BIT 7,","RES 0,","RES 1,","RES 2,","RES 3,","RES 4,","RES 5,","RES 6,","RES 7,","SET 0,","SET 1,","SET 2,","SET 3,","SET 4,","SET 5,","SET 6,","SET 7,"],Dx={0:{mnemonic:"NOP",length:1},1:{mnemonic:"LD BC, nn",length:3},2:{mnemonic:"LD (BC), A",length:1},3:{mnemonic:"INC BC",length:1},4:{mnemonic:"INC B",length:1},5:{mnemonic:"DEC B",length:1},6:{mnemonic:"LD B, n",length:2},7:{mnemonic:"RLCA",length:1},8:{mnemonic:"LD (nn), SP",length:3},9:{mnemonic:"ADD HL, BC",length:1},10:{mnemonic:"LD A, (BC)",length:1},11:{mnemonic:"DEC BC",length:1},12:{mnemonic:"INC C",length:1},13:{mnemonic:"DEC C",length:1},14:{mnemonic:"LD C, n",length:2},15:{mnemonic:"RRCA",length:1},16:{mnemonic:"STOP",length:2},17:{mnemonic:"LD DE, nn",length:3},24:{mnemonic:"JR n",length:2},32:{mnemonic:"JR NZ, n",length:2},33:{mnemonic:"LD HL, nn",length:3},40:{mnemonic:"JR Z, n",length:2},49:{mnemonic:"LD SP, nn",length:3},62:{mnemonic:"LD A, n",length:2},175:{mnemonic:"XOR A",length:1},195:{mnemonic:"JP nn",length:3},205:{mnemonic:"CALL nn",length:3},224:{mnemonic:"LDH (n), A",length:2},234:{mnemonic:"LD (nn), A",length:3},240:{mnemonic:"LDH A, (n)",length:2},243:{mnemonic:"DI",length:1},251:{mnemonic:"EI",length:1},254:{mnemonic:"CP n",length:2}},Nl="1.0";class Lx{buffer=[];maxSize;writeIndex=0;count=0;constructor(e=10,t=4){this.maxSize=Math.floor(e*t)}cloneState(e){const t=globalThis.structuredClone;return t?t(e):JSON.parse(JSON.stringify(e))}push(e){this.buffer[this.writeIndex]=this.cloneState(e),this.writeIndex=(this.writeIndex+1)%this.maxSize,this.count<this.maxSize&&this.count++}pop(){if(this.count===0)return null;this.writeIndex=(this.writeIndex-1+this.maxSize)%this.maxSize;const e=this.buffer[this.writeIndex];return this.count--,e?this.cloneState(e):null}clear(){this.buffer=[],this.writeIndex=0,this.count=0}getLength(){return this.count}}class Ix{cpu;bus;ppu;timer;apu;serial;debugger;perfSamples=[];lastPerfTime=0;paused=!1;rewindManager=new Lx(10,12);frameCounter=0;isRewinding=!1;constructor(){this.bus=new vx,this.cpu=new xx(this.bus),this.ppu=new Mx(this.bus),this.timer=new yx(this.bus),this.apu=new Ex(this.bus),this.serial=new wx(this.bus),this.debugger=new Rx(this.bus),this.bus.apu=this.apu,this.bus.ppu=this.ppu,this.bus.timer=this.timer,this.bus.serial=this.serial,this.bus.cpu=this.cpu}loadROM(e){this.bus.loadROM(e),this.bus.bootROMEnabled?this.cpu.reset():this.bus.isCGB?this.cpu.initCGB():this.cpu.resetDMG()}loadBootROM(e){this.bus.loadBootROM(e)}frameCount=0;runFrame(){if(this.isRewinding){if(this.frameCounter++,this.frameCounter>=2){this.frameCounter=0;const r=this.rewindManager.pop();if(r)return this.loadState(r),!0;this.isRewinding=!1}return!0}let e=0;const t=70224,i=performance.now();for(;e<t;){if(this.paused)return!1;if(this.debugger.isBreakpoint(this.cpu.pc))return this.paused=!0,!1;e+=this.step()}const s=performance.now();if(this.perfSamples.push(e/(s-i||1)),this.perfSamples.length>60&&this.perfSamples.shift(),this.frameCount++,this.frameCount>=60){this.frameCount=0;const r=this.bus.getMBC();r&&r.tickRTC&&r.tickRTC()}return this.frameCounter++,this.frameCounter>=5&&(this.frameCounter=0,this.rewindManager.push(this.saveState())),!0}step(){const e=this.cpu.step();return this.bus.isDoubleSpeed?e>>1:e}getPerf(){if(this.perfSamples.length===0)return{ips:0,speedPercent:0};const e=this.perfSamples.reduce((t,i)=>t+i,0)/this.perfSamples.length;return{ips:Math.round(e*1e3),speedPercent:e/(70224/16.66)*100}}setPaused(e){this.paused=e}isPaused(){return this.paused}setRewinding(e){this.isRewinding=e}setDMGPalette(e){this.bus.ppu?.setDMGPalette(e)}setCGBColorProfile(e){this.bus.ppu?.setCGBColorProfile(e)}stepInto(){return this.step()}getRegisters(){return{a:this.cpu.a,b:this.cpu.b,c:this.cpu.c,d:this.cpu.d,e:this.cpu.e,h:this.cpu.h,l:this.cpu.l,f:this.cpu.f,pc:this.cpu.pc,sp:this.cpu.sp,af:this.cpu.af,bc:this.cpu.bc,de:this.cpu.de,hl:this.cpu.hl,f_z:this.cpu.zero,f_n:this.cpu.subtract,f_h:this.cpu.halfCarry,f_c:this.cpu.carry}}addBreakpoint(e){this.debugger.addBreakpoint(e)}disassemble(e,t){return this.debugger.disassemble(e,t)}getFrameBuffer(){return this.ppu.frameBuffer}getSRAM(){return this.bus.getSRAM()}setSRAM(e){this.bus.setSRAM(e)}saveState(){return{version:Nl,timestamp:Date.now(),cpu:this.cpu.saveState(),bus:this.bus.saveState(),ppu:this.ppu.saveState(),apu:this.apu.saveState(),timer:this.timer.saveState(),mbc:this.bus.getMBC()?this.bus.getMBC().saveState():{type:"MBC0"}}}loadState(e){this.cpu.loadState(e.cpu),this.bus.loadState(e.bus),this.ppu.loadState(e.ppu),this.apu.loadState(e.apu),this.timer.loadState(e.timer);const t=this.bus.getMBC();t&&e.mbc&&t.loadState(e.mbc)}}class Ux{context=null;sampleRate=44100;BUFFER_CAPACITY=16384;ringBuffer=new Float32Array(this.BUFFER_CAPACITY);writeIdx=0;readIdx=0;count=0;worklet=null;metricsInterval=null;async init(){if(!this.context)try{this.context=new(window.AudioContext||window.webkitAudioContext)({sampleRate:this.sampleRate}),await this.context.audioWorklet.addModule("./audio-processor.js"),this.worklet=new AudioWorkletNode(this.context,"gameboy-audio-processor",{outputChannelCount:[2]}),this.worklet.connect(this.context.destination),this.worklet.port.onmessage=t=>{if(t.data.type==="metrics"){const i=t.data.count/(this.sampleRate*2)*1e3;Hl(()=>Promise.resolve().then(()=>Bx),void 0,import.meta.url).then(s=>s.metricsManager.updateAudioLatency(i))}},this.metricsInterval=setInterval(()=>{this.worklet?.port.postMessage({type:"get_metrics"})},500)}catch(e){Ut.error("Failed to initialize Web Audio",e)}}pushSamples(e){this.worklet&&this.worklet.port.postMessage({type:"samples",payload:e})}setHD(e){Ut.info(`HD Mode -> ${e?"ON":"OFF"}`),this.worklet?this.worklet.port.postMessage({type:"config",hd:e}):Ut.warn("Cannot toggle HD: Worklet not initialized")}setHDParams(e,t,i){this.worklet&&this.worklet.port.postMessage({type:"params",gain:e,reverb:t,sub:i})}forwardHDEvent(e,t,i){this.worklet&&this.worklet.port.postMessage({type:"hd_event",event:e,channel:t,state:i})}resume(){this.context&&this.context.state==="suspended"&&this.context.resume()}}class Nx{enabled=!1;channelCallback=null;constructor(){}setEnabled(e){this.enabled=e,Ut.info(`Orchestrator ${e?"Enabled":"Disabled"}`)}isEnabled(){return this.enabled}setCallback(e){this.channelCallback=e}onRegisterWrite(e,t,i,s){if(!this.enabled||!this.channelCallback)return;const r=typeof i=="number"?s:i;if(!r)return;const a=typeof i=="number"?i:r.channel;let o="freq_change";(e===65300||e===65305||e===65310||e===65315)&&t&128&&(o="trigger",this.channelCallback("note_on",a,r)),(e===65298||e===65303||e===65308||e===65313)&&(o="vol_change"),this.channelCallback(o,a,r)}onWaveWrite(e,t,i){if(!this.enabled||!this.channelCallback)return;const s=new Float32Array(32);for(let a=0;a<16;a++)s[a*2]=(i[a]>>4)/7.5-1,s[a*2+1]=(i[a]&15)/7.5-1;const r=this.cubicSpline(s,4);this.channelCallback("wave_change",3,{channel:3,enabled:!0,frequency:0,volume:0,waveform:r})}cubicSpline(e,t){const i=new Float32Array(e.length*t);for(let s=0;s<e.length;s++){const r=e[(s-1+e.length)%e.length],a=e[s],o=e[(s+1)%e.length],l=e[(s+2)%e.length];for(let c=0;c<t;c++){const h=c/t,u=h*h,d=u*h;i[s*t+c]=.5*(2*a+(-r+o)*h+(2*r-5*a+4*o-l)*u+(-r+3*a-3*o+l)*d)}}return i}}const us=new Nx;var Ol=(n=>(n.RAW="raw",n.SMOOTH="smooth",n.SHARP="sharp",n))(Ol||{});class Ox{enabled=!1;params={lcdGrid:0,ghosting:0,curvature:0,brightness:1,contrast:1.1,saturation:1.5,scalingMode:"sharp"};callback=null;setEnabled(e){this.enabled=e,this.notify()}isEnabled(){return this.enabled}setParams(e){this.params={...this.params,...e},this.notify()}getParams(){return{...this.params}}setCallback(e){this.callback=e,this.notify()}notify(){this.callback&&this.callback(this.params,this.enabled)}}const Na=new Ox;class Fx{autoSaveInterval=null;lastSavedHash=null;db=null;async getDB(){return this.db?this.db:new Promise((e,t)=>{const i=setTimeout(()=>t(new Error("IndexedDB connection timeout")),2e3),s=indexedDB.open("HIP_GBE_DATA",1);s.onupgradeneeded=()=>{const r=s.result;r.objectStoreNames.contains("saves")||r.createObjectStore("saves"),r.objectStoreNames.contains("states")||r.createObjectStore("states")},s.onsuccess=()=>{clearTimeout(i),this.db=s.result,e(this.db)},s.onerror=()=>{clearTimeout(i),t(s.error)}})}async dbGet(e,t){const i=await this.getDB();return new Promise((s,r)=>{const l=i.transaction(e,"readonly").objectStore(e).get(t);l.onsuccess=()=>s(l.result),l.onerror=()=>r(l.error)})}async dbSet(e,t,i){const s=await this.getDB();return new Promise((r,a)=>{const c=s.transaction(e,"readwrite").objectStore(e).put(i,t);c.onsuccess=()=>r(),c.onerror=()=>a(c.error)})}getGameKey(e){let t="";for(let s=308;s<=323;s++){const r=e.bus.read(s);if(r===0)break;t+=String.fromCharCode(r)}t=t.trim().replace(/[^a-zA-Z0-9]/g,"_");let i=0;for(let s=0;s<32768;s++)i=i+e.bus.read(s)&4294967295;return`${t}_${i.toString(16)}`}async load(e){try{const t=this.getGameKey(e),i=await this.dbGet("saves",t);if(i instanceof Uint8Array)return e.setSRAM(i),Ut.info(`Loaded save for ${t} (${i.length} bytes)`),!0}catch(t){Ut.error("Load failed:",t)}return!1}async save(e){try{const t=e.getSRAM();if(!t||t.length===0)return;const i=this.getGameKey(e);await this.dbSet("saves",i,t),Ut.info(`Saved ${i} to IndexedDB`)}catch(t){Ut.error("Save failed:",t)}}async saveState(e,t=0){try{const i=e.saveState(),s=`${this.getGameKey(e)}_STATE_${t}`;await this.dbSet("states",s,i),Ut.info(`Saved snapshot to ${s}`)}catch(i){Ut.error("Snapshot save failed:",i)}}async loadState(e,t=0){try{const i=`${this.getGameKey(e)}_STATE_${t}`,s=await this.dbGet("states",i);if(s)return this.validateState(s)?(s.version!==Nl&&Ut.warn(`Version mismatch for ${i}. Expected ${Nl}, found ${s.version}.`),e.loadState(s),Ut.info(`Loaded snapshot from ${i}`),!0):(Ut.error(`Invalid or corrupted state for ${i}`),!1)}catch(i){Ut.error("Snapshot load failed:",i)}return!1}validateState(e){return["cpu","ppu","apu","bus","version"].every(i=>i in e)}startAutoSave(e){this.stopAutoSave(),this.autoSaveInterval=window.setInterval(()=>{this.save(e)},1e4)}stopAutoSave(){this.autoSaveInterval!==null&&(clearInterval(this.autoSaveInterval),this.autoSaveInterval=null)}}class ds{static instance;fps=0;frameDrops=0;audioLatency=0;cpuUsage=0;gpuUsage=0;ramUsage=0;frameCount=0;startTime=performance.now();lastReportTime=performance.now();REPORT_INTERVAL=500;constructor(){}static getInstance(){return ds.instance||(ds.instance=new ds),ds.instance}recordFrame(e){this.frameCount++;const t=e/16.67;this.cpuUsage=this.cpuUsage*.9+t*.1;const i=performance.now(),s=i-this.lastReportTime;s>=this.REPORT_INTERVAL&&(this.fps=this.frameCount*1e3/s,this.frameCount=0,this.lastReportTime=i)}recordGpuFrame(e){const t=e/16.67;this.gpuUsage=this.gpuUsage*.9+t*.1}updateRamUsage(){performance.memory&&(this.ramUsage=performance.memory.usedJSHeapSize/(1024*1024))}recordFrameDrop(){this.frameDrops++}updateAudioLatency(e){this.audioLatency=this.audioLatency*.8+e*.2}getMetrics(){return this.updateRamUsage(),{fps:Math.round(this.fps*100)/100,frameDrops:this.frameDrops,audioLatency:Math.round(this.audioLatency),cpuUsage:Math.round(this.cpuUsage*100),gpuUsage:Math.round(this.gpuUsage*100),ramUsage:Math.round(this.ramUsage*100)/100}}reset(){this.fps=0,this.frameDrops=0,this.audioLatency=0,this.cpuUsage=0,this.gpuUsage=0,this.ramUsage=0,this.frameCount=0,this.startTime=performance.now(),this.lastReportTime=performance.now()}}const Ps=ds.getInstance(),Bx=Object.freeze(Object.defineProperty({__proto__:null,metricsManager:Ps},Symbol.toStringTag,{value:"Module"}));let je=null,Jt=null,nr=new Fx,Ys=null,as=null,sa=null,fs="idle";function ld(){return fs}async function kx(n,e){Ys&&cancelAnimationFrame(Ys),nr.stopAutoSave(),fs="booting",je=new Ix,je.loadROM(e),je.apu.setListener(us),Jt=new Ux,await Jt.init(),await nr.load(je),us.setCallback((o,l,c)=>{Jt&&us.isEnabled()&&Jt.forwardHDEvent(o,l,c)}),Jt.setHD(us.isEnabled()),nr.startAutoSave(je),as=n.getContext("2d"),as&&(as.imageSmoothingEnabled=!1,sa=as.createImageData(160,144)),fs="running",Ut.info("Boot ✓ (TypeScript Core with Persistence)");const i=1e3/59.7275;let s=performance.now(),r=0;const a=o=>{if(fs==="running"&&je){const l=o-s;for(s=o,r+=l,r>100&&(r=100);r>=i;){const h=performance.now();try{je.runFrame()}catch(d){fs="error",Ut.error("Fatal error in game loop:",d),Ys&&cancelAnimationFrame(Ys);return}const u=performance.now();Ps.recordFrame(u-h),Jt&&Jt.pushSamples(je.apu.getRecentSamples()),r-=i,r>=i&&Ps.recordFrameDrop()}const c=je.getFrameBuffer();as&&sa&&(sa.data.set(c),as.putImageData(sa,0,0))}else s=o;Ys=requestAnimationFrame(a)};requestAnimationFrame(a)}function In(n,e){fs!=="running"||!je||(je.bus.handleInput(n,e),je.cpu?.wakeUp(),e&&Jt&&Jt.resume())}function Hx(n){us.setEnabled(n),Jt&&Jt.setHD(n)}async function Gx(n=0){je&&await nr.saveState(je,n)}async function zx(n=0){return je?await nr.loadState(je,n):!1}async function Vx(){if(!je)return;const n=je.saveState(),e=new Blob([JSON.stringify(n)],{type:"application/json"}),t=URL.createObjectURL(e),i=document.createElement("a");i.href=t,i.download=`GB_State_${Date.now()}.json`,i.click(),URL.revokeObjectURL(t)}async function Wx(n){if(!je)return!1;try{const e=await n.text(),t=JSON.parse(e);return je.loadState(t),!0}catch(e){return console.error("Load from file failed:",e),!1}}function Xx(n,e,t){Jt&&Jt.setHDParams(n,e,t)}function qx(n){Na.setParams(n)}function lu(){return Ps.getMetrics()}function cu(){return je?je.stepInto():0}function ra(n){je&&je.setPaused(n)}function aa(){return je?.isPaused()??!1}function hu(n){je&&je.setRewinding(n)}function jx(n){je&&je.setDMGPalette(n)}function Yx(n){je&&je.setCGBColorProfile(n)}function Co(){return je?.getRegisters()??null}function uu(n,e){return je?.disassemble(n,e)??[]}class Kx{renderer;scene;camera;material;blitMaterial;mesh;renderTarget;prevRenderTarget;constructor(e){this.renderer=e,this.scene=new Nu,this.camera=new Ns(-1,1,1,-1,0,1),this.renderTarget=new Lt(160,144,{minFilter:ft,magFilter:ft,format:qt}),this.prevRenderTarget=new Lt(160,144,{minFilter:ft,magFilter:ft,format:qt}),this.material=new Et({uniforms:{tDiffuse:{value:null},tPrev:{value:null},uGrid:{value:0},uGhost:{value:0},uCurvature:{value:0},uBrightness:{value:1},uContrast:{value:1},uSaturation:{value:1},uScalingMode:{value:0},uTime:{value:0}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                uniform sampler2D tDiffuse;
                uniform sampler2D tPrev;
                uniform float uGrid;
                uniform float uGhost;
                uniform float uCurvature;
                uniform float uBrightness;
                uniform float uContrast;
                uniform float uSaturation;
                uniform int uScalingMode;
                uniform float uTime;
                varying vec2 vUv;

                vec3 adjustColor(vec3 color, float brightness, float contrast, float saturation) {
                    // Brightness
                    color *= brightness;
                    // Contrast
                    color = (color - 0.5) * contrast + 0.5;
                    // Saturation
                    float gray = dot(color, vec3(0.2126, 0.7152, 0.0722));
                    color = mix(vec3(gray), color, saturation);
                    return clamp(color, 0.0, 1.0);
                }

                vec2 curve(vec2 uv) {
                    uv = (uv - 0.5) * 2.0;
                    uv.x *= 1.0 + pow((abs(uv.y) / 5.0), 2.0) * uCurvature;
                    uv.y *= 1.0 + pow((abs(uv.x) / 4.0), 2.0) * uCurvature;
                    uv  = (uv / 2.0) + 0.5;
                    return uv;
                }

                // Helper for manual point sampling to emulate "Raw"
                vec4 texturePoint(sampler2D tex, vec2 uv) {
                    vec2 res = vec2(160.0, 144.0);
                    vec2 pixel = uv * res;
                    pixel = floor(pixel) + 0.5;
                    return texture2D(tex, pixel / res);
                }

                float random(vec2 co) {
                    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
                }

                void main() {
                    vec2 uv = vUv;
                    if (uCurvature > 0.0) uv = curve(uv);

                    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
                        gl_FragColor = vec4(0.01, 0.01, 0.02, 1.0);
                        return;
                    }

                    vec4 tex;
                    if (uScalingMode == 0) {
                        tex = texturePoint(tDiffuse, uv);
                    } else if (uScalingMode == 2) {
                        // High-Quality Sharpening (Unsharp Mask style)
                        vec2 res = vec2(160.0, 144.0);
                        vec2 step = 0.5 / res; // Half pixel step for finer edges
                        vec4 center = texture2D(tDiffuse, uv);
                        vec4 blur = (
                            texture2D(tDiffuse, uv + vec2(step.x, 0.0)) +
                            texture2D(tDiffuse, uv - vec2(step.x, 0.0)) +
                            texture2D(tDiffuse, uv + vec2(0.0, step.y)) +
                            texture2D(tDiffuse, uv - vec2(0.0, step.y))
                        ) * 0.25;
                        tex = center + (center - blur) * 1.5;
                    } else {
                        tex = texture2D(tDiffuse, uv);
                    }

                    vec4 prev = texture2D(tPrev, uv);
                    vec4 color = mix(tex, prev, uGhost);


                    // --- Advanced LCD Grid (Sub-pixel feel) ---
                    vec2 gridScale = vec2(160.0, 144.0);
                    vec2 gridPos = fract(vUv * gridScale);
                    
                    // Thinner, more subtle lines
                    float vx = smoothstep(0.0, 0.05, gridPos.x) * smoothstep(1.0, 0.95, gridPos.x);
                    float vy = smoothstep(0.0, 0.05, gridPos.y) * smoothstep(1.0, 0.95, gridPos.y);
                    
                    float grid = vx * vy;
                    color.rgb *= mix(1.0, grid, uGrid * 0.5);

                    // --- Filmic Grain (Slightly reduced) ---
                    float grain = (random(vUv + uTime) - 0.5) * 0.02;
                    color.rgb += grain;

                    // --- Professional Vignette ---
                    float dist = distance(vUv, vec2(0.5));
                    float vig = smoothstep(0.8, 0.2, dist);
                    color.rgb *= mix(1.0, vig, 0.1 + uCurvature * 0.1);

                    // --- Subtle CRT/LCD Scanline (High frequency) ---
                    float scanline = sin(vUv.y * 1200.0) * 0.01;
                    color.rgb -= scanline;
                    
                    // --- Final Professional Color Grading ---
                    color.rgb = adjustColor(color.rgb, uBrightness, uContrast, uSaturation);

                    gl_FragColor = vec4(clamp(color.rgb, 0.0, 1.0), 1.0);
                }
            `}),this.blitMaterial=new Ci,this.mesh=new Wt(new Mr(2,2),this.material),this.scene.add(this.mesh)}updateParams(e){this.material.uniforms.uGrid.value=e.lcdGrid,this.material.uniforms.uGhost.value=e.ghosting,this.material.uniforms.uCurvature.value=e.curvature,this.material.uniforms.uBrightness.value=e.brightness??1,this.material.uniforms.uContrast.value=e.contrast??1,this.material.uniforms.uSaturation.value=e.saturation??1;let t=0;e.scalingMode===Ol.SMOOTH?t=1:e.scalingMode===Ol.SHARP&&(t=2),this.material.uniforms.uScalingMode.value=t}process(e){return this.material.uniforms.tDiffuse.value=e,this.material.uniforms.tPrev.value=this.prevRenderTarget.texture,this.material.uniforms.uTime.value=performance.now()/1e3,this.mesh.material=this.material,this.renderer.setRenderTarget(this.renderTarget),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null),this.copyToPrev(),this.renderTarget.texture}copyToPrev(){const e=this.renderer.getRenderTarget();this.renderer.setRenderTarget(this.prevRenderTarget);const t=this.renderTarget.texture,i=t.repeat.clone(),s=t.offset.clone();t.repeat.set(1,1),t.offset.set(0,0),this.blitMaterial.map=t,this.mesh.material=this.blitMaterial,this.renderer.render(this.scene,this.camera),t.repeat.copy(i),t.offset.copy(s),this.mesh.material=this.material,this.renderer.setRenderTarget(e)}}const Zx=3500,Qx=`
#toast-container {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    z-index: 9999;
    pointer-events: none;
}
.toast {
    padding: 0.55rem 1.1rem;
    border-radius: 6px;
    font-family: monospace;
    font-size: 0.82rem;
    letter-spacing: 0.04em;
    color: #fff;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.2s ease, transform 0.2s ease;
    max-width: 340px;
    text-align: center;
    pointer-events: none;
}
.toast.toast--visible  { opacity: 1; transform: translateY(0); }
.toast.toast--info     { background: rgba(40, 40, 80, 0.92); border: 1px solid #556; }
.toast.toast--success  { background: rgba(20, 80, 50, 0.92); border: 1px solid #4a8; }
.toast.toast--error    { background: rgba(90, 20, 20, 0.92); border: 1px solid #a44; }
`;let wn=null;function Jx(){if(wn&&document.body.contains(wn))return wn;const n=document.createElement("style");return n.textContent=Qx,document.head.appendChild(n),wn=document.createElement("div"),wn.id="toast-container",document.body.appendChild(wn),wn}function Po(n,e="info"){const t=Jx(),i=document.createElement("div");i.className=`toast toast--${e}`,i.textContent=n,t.appendChild(i),requestAnimationFrame(()=>{requestAnimationFrame(()=>i.classList.add("toast--visible"))}),setTimeout(()=>{i.classList.remove("toast--visible"),i.addEventListener("transitionend",()=>i.remove(),{once:!0})},Zx)}const ut={info:n=>Po(n,"info"),success:n=>Po(n,"success"),error:n=>Po(n,"error")},wa={es:{loading_model:"Cargando modelo 3D y ROM…",drop_rom:"SUELTA LA ROM AQUÍ",drag_orbit:"🖱 Arrastrar para orbitar",settings_title:"Ajustes",language:"Idioma",brightness:"Brillo",contrast:"Contraste",hdr_mode:"Modo HDR",hd_audio:"Orquestador de Audio HD",hd_gain:"HD Ganancia Maestra",hd_reverb:"HD Reverberación",hd_sub:"HD Pegada Sub-bass",close:"Cerrar",status_loading:"cargando rom…",status_booting:"iniciando…",status_error:"error",status_ready_load_rom:"ready - load rom",hd_video:"Orquestador de Video HD",hd_grid:"Fuerza de Rejilla LCD",hd_blur:"Ghosting (Estela)",hd_curve:"Curvatura de Pantalla",saturation:"Saturación",scaling_mode:"Modo de Escalado",show_metrics:"Mostrar Métricas",scaling_raw:"Pixel Real (Raw)",scaling_smooth:"Suave (HQ)",scaling_sharp:"Nítido (Edge)",factory_reset:"Restablecer Valores",debug_open:"Abrir Depurador",debug_title:"Depurador de CPU",debug_resume:"Reanudar",debug_pause:"Pausar",debug_step:"Paso a Paso",debug_regs:"Registros",debug_disasm:"Desensamblado",debug_break:"Breakpoints",debug_msg_resumed:"Ejecución Reanudada",debug_msg_paused:"Ejecución Pausada",palette_title:"Paleta DMG",palette_original:"Original (Verde)",palette_pocket:"Pocket (Gris)",palette_light:"Light (Azul)",palette_custom:"Personalizada",screenshot_saved:"Captura guardada",gif_recording_start:"Grabando GIF (3s)...",gif_processing:"Procesando GIF...",gif_saved:"GIF guardado",video_recording_start:"Grabando Video (máx 15s)...",video_saved:"Video guardado",rewinding:"REBOBINANDO",category_general:"General",category_video:"Vídeo",category_hd_video:"Vídeo HD",category_hd_audio:"Audio HD",category_lcd_filters:"Filtros LCD Avanzados",hud_dpad:"Cruceta",hud_a:"Botón A",hud_b:"Botón B",hud_start:"Inicio",hud_select:"Select",title_screenshot:"Capturar Pantalla",title_gif:"Grabar GIF (3s)",title_video:"Grabar Vídeo (.webm)",err_rom_load:"Error cargando la ROM predeterminada",err_emu_start:"Error al iniciar el emulador",debug_cpu:"Uso CPU",debug_gpu:"Uso GPU",debug_ram:"Uso RAM",debug_resources:"Recursos",panel_states:"Gestor de Estados",panel_info:"Panel de Información",osd_on:"ACTIVADO",osd_off:"DESACTIVADO",state_title:"Gestor de Estados",state_save:"Guardar",state_load:"Cargar",state_empty:"Vacío",state_occupied:"Guardado",state_import:"Importar",quick_save:"Guardado Rápido",quick_load:"Carga Rápida"},en:{loading_model:"Loading 3D model and ROM…",drop_rom:"DROP ROM HERE",drag_orbit:"🖱 Drag to orbit",settings_title:"Settings",language:"Language",brightness:"Brightness",contrast:"Contrast",hdr_mode:"HDR Mode",hd_audio:"HD Audio Orchestrator",hd_gain:"HD Master Gain",hd_reverb:"HD Reverb Intensity",hd_sub:"HD Sub-bass Punch",close:"Close",status_loading:"loading rom…",status_booting:"booting…",status_error:"error",status_ready_load_rom:"ready - load rom",hd_video:"HD Video Orchestrator",hd_grid:"LCD Grid Strength",hd_blur:"Ghosting (Motion Blur)",hd_curve:"Screen Curvature",saturation:"Saturation",scaling_mode:"Scaling Mode",show_metrics:"Show Metrics",scaling_raw:"Raw Pixel",scaling_smooth:"Smooth (HQ)",scaling_sharp:"Sharp (Edge)",factory_reset:"Reset Defaults",debug_open:"Open Debugger",debug_title:"CPU Debugger",debug_resume:"Resume",debug_pause:"Pause",debug_step:"Step Into",debug_regs:"Registers",debug_disasm:"Disassembly",debug_break:"Breakpoints",debug_msg_resumed:"Execution Resumed",debug_msg_paused:"Execution Paused",palette_title:"DMG Palette",palette_original:"Original (Green)",palette_pocket:"Pocket (Gray)",palette_light:"Light (Blue)",palette_custom:"Custom",screenshot_saved:"Screenshot saved",gif_recording_start:"Recording GIF (3s)...",gif_processing:"Processing GIF...",gif_saved:"GIF saved",video_recording_start:"Recording Video (max 15s)...",video_saved:"Video saved",rewinding:"REWINDING",category_general:"General",category_video:"Video",category_hd_video:"HD Video",category_hd_audio:"HD Audio",category_lcd_filters:"Advanced LCD Filters",hud_dpad:"D-Pad",hud_a:"A Button",hud_b:"B Button",hud_start:"Start",hud_select:"Select",title_screenshot:"Capture Screenshot",title_gif:"Record GIF (3s)",title_video:"Record Video (.webm)",err_rom_load:"Error loading default ROM",err_emu_start:"Failed to start emulator",debug_cpu:"CPU Usage",debug_gpu:"GPU Usage",debug_ram:"RAM Usage",debug_resources:"Resources",state_title:"State Manager",state_save:"Save",state_load:"Load",state_empty:"Empty",state_occupied:"Saved",state_import:"Import",quick_save:"Quick Save",quick_load:"Quick Load",panel_states:"State Manager",panel_info:"Info Panel",osd_on:"ON",osd_off:"OFF"},zh:{loading_model:"载入3D模型和ROM…",drop_rom:"在此拖放ROM",drag_orbit:"🖱 拖拽以旋转",settings_title:"设置",language:"语言",brightness:"亮度",contrast:"对比度",hdr_mode:"HDR模式",hd_audio:"HD音频编排器",hd_gain:"HD主增益",hd_reverb:"HD混响强度",hd_sub:"HD低音增强",close:"关闭",status_loading:"载入ROM…",status_booting:"启动中…",status_error:"错误",status_ready_load_rom:"ready - load rom",hd_video:"HD视频编排器",hd_grid:"LCD网格强度",hd_blur:"残影（动态模糊）",hd_curve:"屏幕曲率",saturation:"饱和度",scaling_mode:"缩放模式",show_metrics:"显示性能指标",scaling_raw:"原始像素",scaling_smooth:"平滑 (HQ)",scaling_sharp:"锐化 (边缘)",factory_reset:"恢复默认设置",debug_open:"打开调试器",debug_title:"CPU 调试器",debug_resume:"恢复",debug_pause:"暂停",debug_step:"单步执行",debug_regs:"寄存器",debug_disasm:"反汇编",debug_break:"断点",debug_msg_resumed:"执行已恢复",debug_msg_paused:"执行已暂停",palette_title:"DMG 调色板",palette_original:"原版 (绿)",palette_pocket:"Pocket (灰)",palette_light:"Light (蓝)",palette_custom:"自定义",screenshot_saved:"截图已保存",gif_recording_start:"正在录制 GIF (3秒)...",gif_processing:"正在处理 GIF...",gif_saved:"GIF 已保存",video_recording_start:"正在录制视频 (最长15秒)...",video_saved:"视频已保存",rewinding:"正在快退",category_general:"常规",category_video:"视频",category_hd_video:"HD 视频",category_hd_audio:"HD 音频",category_lcd_filters:"高级 LCD 过滤器",hud_dpad:"方向键",hud_start:"开始",hud_select:"选择",hud_a:"A 键",hud_b:"B 键",title_screenshot:"截屏",title_gif:"录制 GIF (3秒)",title_video:"录制视频 (.webm)",err_rom_load:"加载默认 ROM 出错",err_emu_start:"启动模拟器失败",debug_cpu:"CPU 使用率",debug_gpu:"GPU 使用率",debug_ram:"内存使用",debug_resources:"资源",panel_states:"状态管理器",panel_info:"信息面板",osd_on:"开启",osd_off:"关闭",state_title:"状态管理器",state_save:"保存",state_load:"加载",state_empty:"空",state_occupied:"已保存",state_import:"导入",quick_save:"快速保存",quick_load:"快速加载"},ja:{loading_model:"3DモデルとROMを読み込み中…",drop_rom:"ここにROMをドロップ",drag_orbit:"🖱 ドラッグして視点移動",settings_title:"設定",language:"言語",brightness:"明るさ",contrast:"コントラスト",hdr_mode:"HDRモード",hd_audio:"HDオーディオ・オーケストレーター",hd_gain:"HDマスターゲイン",hd_reverb:"HDリバーブ強度",hd_sub:"HDサブバスパンチ",close:"閉じる",status_loading:"ROMを読み込み中…",status_booting:"起動中…",status_error:"エラー",status_ready_load_rom:"ready - load rom",hd_video:"HDビデオ・オーケストレーター",hd_grid:"LCDグリッド強度",hd_blur:"ゴースト（モーションブラー）",hd_curve:"画面の湾曲",saturation:"彩度",scaling_mode:"スケーリングモード",show_metrics:"メトリクスを表示",scaling_raw:"生ピクセル",scaling_smooth:"スムーズ (HQ)",scaling_sharp:"シャープ (エッジ)",factory_reset:"デフォルトに戻す",debug_open:"デバッガーを開く",debug_title:"CPU デバッガー",debug_resume:"再開",debug_pause:"一時停止",debug_step:"ステップ実行",debug_regs:"レジスタ",debug_disasm:"逆アセンブル",debug_break:"ブレークポイント",debug_msg_resumed:"実行を再開しました",debug_msg_paused:"実行を一時停止しました",palette_title:"DMG パレット",palette_original:"オリジナル (緑)",palette_pocket:"ポケット (グレー)",palette_light:"ライト (青)",palette_custom:"カスタム",screenshot_saved:"スクリーンショットを保存しました",gif_recording_start:"GIFを録画中 (3秒)...",gif_processing:"GIFを処理中...",gif_saved:"GIFを保存しました",video_recording_start:"ビデオを録画中 (最大15秒)...",video_saved:"ビデオを保存しました",rewinding:"巻き戻し中",category_general:"一般",category_video:"ビデオ",category_hd_video:"HD ビデオ",category_hd_audio:"HD オーディオ",category_lcd_filters:"高度な LCD フィルター",hud_dpad:"方向キー",hud_start:"スタート",hud_select:"セレクト",hud_a:"A ボタン",hud_b:"B ボタン",title_screenshot:"スクリーンショット",title_gif:"GIF 録画 (3秒)",title_video:"ビデオ録画 (.webm)",err_rom_load:"デフォルトROMの読み込みエラー",err_emu_start:"エミュレータの起動に失敗しました",debug_cpu:"CPU 使用率",debug_gpu:"GPU 使用率",debug_ram:"メモリ使用量",debug_resources:"リソース",panel_states:"ステートマネージャー",panel_info:"情報パネル",osd_on:"オン",osd_off:"オフ",state_title:"ステートマネージャー",state_save:"保存",state_load:"ロード",state_empty:"空き",state_occupied:"保存済み",state_import:"インポート",quick_save:"クイックセーブ",quick_load:"クイックロード"},ko:{loading_model:"3D 모델 및 ROM 로드 중…",drop_rom:"여기에 ROM 놓기",drag_orbit:"🖱 드래그하여 회전",settings_title:"설정",language:"언어",brightness:"밝기",contrast:"대비",hdr_mode:"HDR 모드",hd_audio:"HD 오디오 오케스트레이터",hd_gain:"HD 마스터 게인",hd_reverb:"HD 리버브 강도",hd_sub:"HD 서브베이스 펀치",close:"닫기",status_loading:"ROM 로드 중…",status_booting:"부팅 중…",status_error:"오류",status_ready_load_rom:"ready - load rom",hd_video:"HD 비디오 오케스트레이터",hd_grid:"LCD 그리드 강도",hd_blur:"잔상 (모션 블러)",hd_curve:"화면 곡률",saturation:"채도",scaling_mode:"스케일링 모드",show_metrics:"메트릭 표시",scaling_raw:"원본 픽셀",scaling_smooth:"부드럽게 (HQ)",scaling_sharp:"선명하게 (에지)",factory_reset:"초기 설정으로",debug_open:"디버거 열기",debug_title:"CPU 디버거",debug_resume:"재개",debug_pause:"일시 중지",debug_step:"단계별 실행",debug_regs:"레지스터",debug_disasm:"역어셈블리",debug_break:"중단점",debug_msg_resumed:"실행 재개됨",debug_msg_paused:"실행 일시 중지됨",palette_title:"DMG 팔레트",palette_original:"오리지널 (녹색)",palette_pocket:"포켓 (회색)",palette_light:"라이트 (파란색)",palette_custom:"사용자 설정",screenshot_saved:"스크린샷 저장됨",gif_recording_start:"GIF 녹화 중 (3초)...",gif_processing:"GIF 처리 중...",gif_saved:"GIF 저장됨",video_recording_start:"비디오 녹화 중 (최대 15초)...",video_saved:"비디오 저장됨",rewinding:"되감기 중",category_general:"일반",category_video:"비디오",category_hd_video:"HD 비디오",category_hd_audio:"HD 오디오",category_lcd_filters:"고급 LCD 필터",hud_dpad:"방향키",hud_start:"시작",hud_select:"선택",hud_a:"A 버튼",hud_b:"B 버튼",title_screenshot:"스크린샷 캡처",title_gif:"GIF 녹화 (3초)",title_video:"비디오 녹화 (.webm)",err_rom_load:"기본 ROM 로드 오류",err_emu_start:"에뮬레이터 시작 실패",debug_cpu:"CPU 사용률",debug_gpu:"GPU 사용률",debug_ram:"메모리 사용량",debug_resources:"리소스",panel_states:"상태 관리자",panel_info:"정보 패널",osd_on:"켜짐",osd_off:"꺼짐",state_title:"상태 관리자",state_save:"저장",state_load:"로드",state_empty:"비어 있음",state_occupied:"저장됨",state_import:"가져오기",quick_save:"퀵 세이브",quick_load:"퀵 로드"},de:{loading_model:"Lade 3D-Modell und ROM…",drop_rom:"ROM HIER ABLEGEN",drag_orbit:"🖱 Ziehen zum Orbitieren",settings_title:"Einstellungen",language:"Sprache",brightness:"Helligkeit",contrast:"Kontrast",hdr_mode:"HDR-Modus",hd_audio:"HD Audio Orchestrator",hd_gain:"HD Master Gain",hd_reverb:"HD Hall-Intensität",hd_sub:"HD Sub-Bass Punch",close:"Schließen",status_loading:"lade rom…",status_booting:"boote…",status_error:"fehler",status_ready_load_rom:"ready - load rom",hd_video:"HD Video Orchestrator",hd_grid:"LCD-Gitterstärke",hd_blur:"Ghosting (Bewegungsunschärfe)",hd_curve:"Bildschirmkrümmung",saturation:"Sättigung",scaling_mode:"Skalierungsmodus",show_metrics:"Metriken anzeigen",scaling_raw:"Raw Pixel",scaling_smooth:"Glatt (HQ)",scaling_sharp:"Scharf (Kante)",factory_reset:"Werkseinstellungen",debug_open:"Debugger öffnen",debug_title:"CPU Debugger",debug_resume:"Fortsetzen",debug_pause:"Pause",debug_step:"Einzelschritt",debug_regs:"Register",debug_disasm:"Disassemblierung",debug_break:"Breakpoints",debug_msg_resumed:"Ausführung fortgesetzt",debug_msg_paused:"Ausführung pausiert",palette_title:"DMG Palette",palette_original:"Original (Grün)",palette_pocket:"Pocket (Grau)",palette_light:"Light (Blau)",palette_custom:"Benutzerdefiniert",screenshot_saved:"Screenshot gespeichert",gif_recording_start:"GIF-Aufnahme (3s)...",gif_processing:"GIF wird verarbeitet...",gif_saved:"GIF gespeichert",video_recording_start:"Video-Aufnahme (max 15s)...",video_saved:"Video gespeichert",rewinding:"RÜCKSPULEN",category_general:"Allgemein",category_video:"Video",category_hd_video:"HD Video",category_hd_audio:"HD Audio",category_lcd_filters:"Erweiterte LCD-Filter",hud_dpad:"Steuerkreuz",hud_start:"Start",hud_select:"Select",hud_a:"A-Taste",hud_b:"B-Taste",title_screenshot:"Screenshot aufnehmen",title_gif:"GIF aufnehmen (3s)",title_video:"Video aufnehmen (.webm)",err_rom_load:"Fehler beim Laden der Standard-ROM",err_emu_start:"Emulator konnte nicht gestartet werden",debug_cpu:"CPU-Auslastung",debug_gpu:"GPU-Auslastung",debug_ram:"RAM-Auslastung",debug_resources:"Ressourcen",panel_states:"Zustandsmanager",panel_info:"Info-Panel",osd_on:"AN",osd_off:"AUS",state_title:"Zustandsmanager",state_save:"Speichern",state_load:"Laden",state_empty:"Leer",state_occupied:"Gespeichert",state_import:"Importieren",quick_save:"Schnellspeichern",quick_load:"Schnellladen"},fr:{loading_model:"Chargement du modèle 3D et de la ROM…",drop_rom:"DÉPOSEZ LA ROM ICI",drag_orbit:"🖱 Glisser pour orbiter",settings_title:"Paramètres",language:"Langue",brightness:"Luminosité",contrast:"Contraste",hdr_mode:"Mode HDR",hd_audio:"HD Audio Orchestrator",hd_gain:"Le gain maître HD",hd_reverb:"Intensité de la réverbération HD",hd_sub:"Punch de sous-basse HD",close:"Fermer",status_loading:"chargement rom…",status_booting:"démarrage…",status_error:"erreur",status_ready_load_rom:"ready - load rom",hd_video:"HD Video Orchestrator",hd_grid:"Force de la grille LCD",hd_blur:"Ghosting (Flou de mouvement)",hd_curve:"Courbure de l'écran",saturation:"Saturation",scaling_mode:"Mode de mise à l'échelle",show_metrics:"Afficher les métriques",scaling_raw:"Pixels bruts",scaling_smooth:"Lisse (HQ)",scaling_sharp:"Tranchant (Bord)",factory_reset:"Réinitialiser",debug_open:"Ouvrir le débogueur",debug_title:"Débogueur CPU",debug_resume:"Reprendre",debug_pause:"Pause",debug_step:"Pas à pas",debug_regs:"Registres",debug_disasm:"Désassemblage",debug_break:"Points d'arrêt",debug_msg_resumed:"Exécution reprise",debug_msg_paused:"Exécution en pause",palette_title:"Palette DMG",palette_original:"Original (Vert)",palette_pocket:"Pocket (Gris)",palette_light:"Light (Bleu)",palette_custom:"Personnalisée",screenshot_saved:"Capture d’écran enregistrée",gif_recording_start:"Enregistrement GIF (3s)...",gif_processing:"Traitement du GIF...",gif_saved:"GIF enregistré",video_recording_start:"Enregistrement Vidéo (max 15s)...",video_saved:"Vidéo enregistrée",rewinding:"REBOBINAGE",category_general:"Général",category_video:"Vidéo",category_hd_video:"Vidéo HD",category_hd_audio:"Audio HD",category_lcd_filters:"Filtres LCD Avancés",hud_dpad:"Croix directionnelle",hud_start:"Start",hud_select:"Select",hud_a:"Bouton A",hud_b:"Bouton B",title_screenshot:"Capturer l’écran",title_gif:"Enregistrer GIF (3s)",title_video:"Enregistrer Vidéo (.webm)",err_rom_load:"Erreur lors du chargement de la ROM par défaut",err_emu_start:"Échec du démarrage de l’émulateur",debug_cpu:"Utilisation CPU",debug_gpu:"Utilisation GPU",debug_ram:"Utilisation RAM",debug_resources:"Ressources",panel_states:"Gestionnaire d'États",panel_info:"Panneau d'Info",osd_on:"ACTIF",osd_off:"INACTIF",state_title:"Gestionnaire d'États",state_save:"Enregistrer",state_load:"Charger",state_empty:"Vide",state_occupied:"Enregistré",state_import:"Importer",quick_save:"Sauvegarde Rapide",quick_load:"Chargement Rapide"},it:{loading_model:"Caricamento modello 3D e ROM…",drop_rom:"RILASCIA LA ROM QUI",drag_orbit:"🖱 Trascina per orbitare",settings_title:"Impostazioni",language:"Lingua",brightness:"Luminosità",contrast:"Contrasto",hdr_mode:"Modalità HDR",hd_audio:"Orchestratore Audio HD",hd_gain:"Guadagno Master HD",hd_reverb:"Intensità riverbero HD",hd_sub:"Spinta sub-bass HD",close:"Chiudi",status_loading:"caricamento rom…",status_booting:"avvio…",status_error:"errore",status_ready_load_rom:"pronto — carica una rom (📁)",hd_video:"Orchestratore Video HD",hd_grid:"Forza griglia LCD",hd_blur:"Ghosting (sfocatura movimento)",hd_curve:"Curvatura dello schermo",saturation:"Saturazione",scaling_mode:"Modalità di ridimensionamento",show_metrics:"Mostra metriche",scaling_raw:"Pixel grezzi",scaling_smooth:"Liscio (HQ)",scaling_sharp:"Nitido (Bordo)",factory_reset:"Ripristina Predefiniti",debug_open:"Apri Debugger",debug_title:"Debugger CPU",debug_resume:"Riprendi",debug_pause:"Pausa",debug_step:"Passo-passo",debug_regs:"Registri",debug_disasm:"Disassemblaggio",debug_break:"Punti di interruzione",debug_msg_resumed:"Esecuzione ripresa",debug_msg_paused:"Esecuzione in pausa",palette_title:"Tavolozza DMG",palette_original:"Originale (Verde)",palette_pocket:"Pocket (Grigio)",palette_light:"Light (Blu)",palette_custom:"Personalizzata",screenshot_saved:"Screenshot salvato",gif_recording_start:"Registrazione GIF (3s)...",gif_processing:"Elaborazione GIF...",gif_saved:"GIF salvata",video_recording_start:"Registrazione Video (max 15s)...",video_saved:"Video salvato",rewinding:"RIAVVOLGIMENTO",category_general:"Generale",category_video:"Video",category_hd_video:"Video HD",category_hd_audio:"Audio HD",category_lcd_filters:"Filtri LCD Avanzati",hud_dpad:"Croce direzionale",hud_start:"Start",hud_select:"Select",hud_a:"Pulsante A",hud_b:"Pulsante B",title_screenshot:"Cattura schermata",title_gif:"Registra GIF (3s)",title_video:"Registra Video (.webm)",err_rom_load:"Errore durante il caricamento della ROM predefinita",err_emu_start:"Avvio dell’emulatore fallito",debug_cpu:"Utilizzo CPU",debug_gpu:"Utilizzo GPU",debug_ram:"Utilizzo RAM",debug_resources:"Risorse",panel_states:"Gestore Stati",panel_info:"Pannello Info",osd_on:"ATTIVO",osd_off:"DISATTIVO",state_title:"Gestore Stati",state_save:"Salva",state_load:"Carica",state_empty:"Vuoto",state_occupied:"Salvato",state_import:"Importa",quick_save:"Salvataggio Rapido",quick_load:"Caricamento Rapido"},pt:{loading_model:"Carregando modelo 3D e ROM…",drop_rom:"SOLTE A ROM AQUI",drag_orbit:"🖱 Arraste para orbitar",settings_title:"Configurações",language:"Idioma",brightness:"Brilho",contrast:"Contraste",hdr_mode:"Modo HDR",hd_audio:"Orquestrador de Áudio HD",hd_gain:"Ganho mestre HD",hd_reverb:"Intensidade de reverberação HD",hd_sub:"Batida sub-bass HD",close:"Fechar",status_loading:"carregando rom…",status_booting:"iniciando…",status_error:"erro",status_ready_load_rom:"pronto — carregar uma rom (📁)",hd_video:"HD Video Orchestrator",hd_grid:"Força da grade LCD",hd_blur:"Ghosting (desfoque de movimento)",hd_curve:"Curvatura da tela",saturation:"Saturação",scaling_mode:"Modo de dimensionamento",show_metrics:"Mostrar métricas",scaling_raw:"Pixel bruto",scaling_smooth:"Suave (HQ)",scaling_sharp:"Nítido (Borda)",factory_reset:"Restaurar Padrão",debug_open:"Abrir Depurador",debug_title:"Depurador de CPU",debug_resume:"Retomar",debug_pause:"Pausar",debug_step:"Passo a Passo",debug_regs:"Registradores",debug_disasm:"Desmontagem",debug_break:"Pontos de parada",debug_msg_resumed:"Execução retomada",debug_msg_paused:"Execução pausada",palette_title:"Paleta DMG",palette_original:"Original (Verde)",palette_pocket:"Pocket (Cinza)",palette_light:"Light (Azul)",palette_custom:"Personalizada",screenshot_saved:"Captura de tela salva",gif_recording_start:"Gravando GIF (3s)...",gif_processing:"Processando GIF...",gif_saved:"GIF salvo",video_recording_start:"Gravando Vídeo (máx 15s)...",video_saved:"Vídeo salvo",rewinding:"REBOBINANDO",category_general:"Geral",category_video:"Vídeo",category_hd_video:"Vídeo HD",category_hd_audio:"Áudio HD",category_lcd_filters:"Filtros LCD Avançados",hud_dpad:"Direcional",hud_start:"Start",hud_select:"Select",hud_a:"Botão A",hud_b:"Botão B",title_screenshot:"Capturar tela",title_gif:"Gravar GIF (3s)",title_video:"Gravar Vídeo (.webm)",err_rom_load:"Erro ao carregar a ROM padrão",err_emu_start:"Falha ao iniciar o emulador",debug_cpu:"Uso de CPU",debug_gpu:"Uso de GPU",debug_ram:"Uso de RAM",debug_resources:"Recursos",panel_states:"Gerenciador de Estados",panel_info:"Painel de Info",osd_on:"ATIVADO",osd_off:"DESATIVADO",state_title:"Gerenciador de Estados",state_save:"Salvar",state_load:"Carregar",state_empty:"Vazio",state_occupied:"Salvo",state_import:"Importar",quick_save:"Salvamento Rápido",quick_load:"Carregamento Rápido"},ru:{loading_model:"Загрузка 3D-модели и ROM…",drop_rom:"БРОСЬТЕ ROM СЮДА",drag_orbit:"🖱 Перетащите для вращения",settings_title:"Настройки",language:"Язык",brightness:"Яркость",contrast:"Контраст",hdr_mode:"Режим HDR",hd_audio:"HD аудио-оркестратор",hd_gain:"HD мастер-усиление",hd_reverb:"HD интенсивность реверберации",hd_sub:"HD суб-бас панч",close:"Закрыть",status_loading:"загрузка rom…",status_booting:"запуск…",status_error:"ошибка",status_ready_load_rom:"готово — загрузить rom (📁)",hd_video:"HD видео-оркестратор",hd_grid:"Сила ЖК-сетки",hd_blur:"Гостинг (размытие в движении)",hd_curve:"Кривизна экрана",saturation:"Насыщенность",scaling_mode:"Режим масштабирования",show_metrics:"Показать метрики",scaling_raw:"Сырые пиксели",scaling_smooth:"Плавный (HQ)",scaling_sharp:"Резкий (Край)",factory_reset:"Сброс настроек",debug_open:"Открыть отладчик",debug_title:"CPU отладчик",debug_resume:"Продолжить",debug_pause:"Пауза",debug_step:"Шаг",debug_regs:"Регистры",debug_disasm:"Дизассемблирование",debug_break:"Точки останова",debug_msg_resumed:"Выполнение возобновлено",debug_msg_paused:"Выполнение приостановлено",palette_title:"Палитра DMG",palette_original:"Оригинал (Зеленый)",palette_pocket:"Pocket (Серый)",palette_light:"Light (Синий)",palette_custom:"Своя",screenshot_saved:"Скриншот сохранен",gif_recording_start:"Запись GIF (3 сек)...",gif_processing:"Обработка GIF...",gif_saved:"GIF сохранен",video_recording_start:"Запись видео (макс 15 сек)...",video_saved:"Видео сохранено",rewinding:"ПЕРЕМОТКА",category_general:"Общие",category_video:"Видео",category_hd_video:"HD Видео",category_hd_audio:"HD Аудио",category_lcd_filters:"Расширенные ЖК-фильтры",hud_dpad:"Крестовина",hud_start:"Старт",hud_select:"Селект",hud_a:"Кнопка A",hud_b:"Кнопка B",title_screenshot:"Сделать скриншот",title_gif:"Записать GIF (3 сек)",title_video:"Записать видео (.webm)",err_rom_load:"Ошибка загрузки стандартного ROM",err_emu_start:"Не удалось запустить эмулятор",debug_cpu:"Загрузка ЦП",debug_gpu:"Загрузка ГП",debug_ram:"Исп. памяти",debug_resources:"Ресурсы",panel_states:"Менеджер состояний",panel_info:"Панель информации",osd_on:"ВКЛ",osd_off:"ВЫКЛ",state_title:"Менеджер состояний",state_save:"Сохранить",state_load:"Загрузить",state_empty:"Пусто",state_occupied:"Сохранено",state_import:"Импорт",quick_save:"Быстрое сохранение",quick_load:"Быстрая загрузка"},pl:{loading_model:"Ładowanie modelu 3D i ROM-u…",drop_rom:"UPUŚĆ ROM TUTAJ",drag_orbit:"🖱 Przeciągnij, aby obrócić",settings_title:"Ustawienia",language:"Język",brightness:"Jasność",contrast:"Kontrast",hdr_mode:"Tryb HDR",hd_audio:"Orkiestrator dźwięku HD",hd_gain:"Wzmocnienie master HD",hd_reverb:"Intensywność pogłosu HD",hd_sub:"Moc sub-bass HD",close:"Zamknij",status_loading:"ładowanie rom-u…",status_booting:"uruchamianie…",status_error:"błąd",status_ready_load_rom:"gotowe — wczytaj rom (📁)",hd_video:"Orkiestrator wideo HD",hd_grid:"Siła siatki LCD",hd_blur:"Ghosting (Rozmycie ruchu)",hd_curve:"Krzywizna ekranu",saturation:"Nasycenie",scaling_mode:"Tryb skalowania",show_metrics:"Pokaż metryki",scaling_raw:"Surowe piksele",scaling_smooth:"Gładki (HQ)",scaling_sharp:"Ostri (Krawędź)",factory_reset:"Resetuj ustawienia",debug_open:"Otwórz debugger",debug_title:"Debugger CPU",debug_resume:"Wznów",debug_pause:"Wstrzymaj",debug_step:"Krok po kroku",debug_regs:"Rejestry",debug_disasm:"Disasemblacja",debug_break:"Punkty przerwania",debug_msg_resumed:"Wznowiono wykonywanie",debug_msg_paused:"Wstrzymano wykonywanie",palette_title:"Paleta DMG",palette_original:"Oryginalna (Zielona)",palette_pocket:"Pocket (Szara)",palette_light:"Light (Niebieska)",palette_custom:"Własna",screenshot_saved:"Zrzut ekranu zapisany",gif_recording_start:"Nagrywanie GIF (3s)...",gif_processing:"Przetwarzanie GIF...",gif_saved:"GIF zapisany",video_recording_start:"Nagrywanie wideo (maks 15s)...",video_saved:"Wideo zapisane",rewinding:"PRZEWIJANIE",category_general:"Ogólne",category_video:"Wideo",category_hd_video:"Wideo HD",category_hd_audio:"Audio HD",category_lcd_filters:"Zaawansowane filtry LCD",hud_dpad:"Krzyżak",hud_start:"Start",hud_select:"Select",hud_a:"Przycisk A",hud_b:"Przycisk B",title_screenshot:"Zrób zrzut ekranu",title_gif:"Nagraj GIF (3s)",title_video:"Nagraj wideo (.webm)",err_rom_load:"Błąd ładowania domyślnego ROM-u",err_emu_start:"Nie udało się uruchomić emulatora",debug_cpu:"Użycie CPU",debug_gpu:"Użycie GPU",debug_ram:"Użycie RAM",debug_resources:"Zasoby",panel_states:"Menedżer stanów",panel_info:"Panel informacji",osd_on:"WŁ.",osd_off:"WYŁ.",state_title:"Menedżer stanów",state_save:"Zapisz",state_load:"Wczytaj",state_empty:"Puste",state_occupied:"Zapisane",state_import:"Importuj",quick_save:"Szybki zapis",quick_load:"Szybki odczyt"},tr:{loading_model:"3D model ve ROM yükleniyor…",drop_rom:"ROM'U BURAYA BIRAKIN",drag_orbit:"🖱 Döndürmek için sürükleyin",settings_title:"Ayarlar",language:"Dil",brightness:"Parlaklık",contrast:"Kontrast",hdr_mode:"HDR Modu",hd_audio:"HD Ses Orkestratörü",hd_gain:"HD Ana Kazanç",hd_reverb:"HD Yankı Yoğunluğu",hd_sub:"HD Alt Bas Vuruşu",close:"Kapat",status_loading:"rom yükleniyor…",status_booting:"başlatılıyor…",status_error:"hata",status_ready_load_rom:"hazır — rom yükle (📁)",hd_video:"HD Video Orkestratörü",hd_grid:"LCD Izgara Gücü",hd_blur:"Gölgelenme (Hareket Bulanıklığı)",hd_curve:"Ekran Eğriliği",saturation:"Doygunluk",scaling_mode:"Ölçeklendirme Modu",show_metrics:"Metrikleri Göster",scaling_raw:"Ham Piksel",scaling_smooth:"Pürüzsüz (HQ)",scaling_sharp:"Keskin (Kenar)",factory_reset:"Varsayılana Sıfırla",debug_open:"Hata Ayıklayıcıyı Aç",debug_title:"CPU Hata Ayıklayıcı",debug_resume:"Devam Et",debug_pause:"Duraklat",debug_step:"Adım Adım",debug_regs:"Yazmaçlar",debug_disasm:"Tersine Çevirme",debug_break:"Kesme Noktaları",debug_msg_resumed:"Yürütme Devam Ettirildi",debug_msg_paused:"Yürütme Duraklatıldı",palette_title:"DMG Paleti",palette_original:"Orijinal (Yeşil)",palette_pocket:"Pocket (Gri)",palette_light:"Light (Mavi)",palette_custom:"Özel",screenshot_saved:"Ekran görüntüsü kaydedildi",gif_recording_start:"GIF kaydediliyor (3sn)...",gif_processing:"GIF işleniyor...",gif_saved:"GIF kaydedildi",video_recording_start:"Video kaydediliyor (maks 15sn)...",video_saved:"Video kaydedildi",rewinding:"GERİ SARIYOR",category_general:"Genel",category_video:"Video",category_hd_video:"HD Video",category_hd_audio:"HD Ses",category_lcd_filters:"Gelişmiş LCD Filtreleri",hud_dpad:"Yön Tuşları",hud_start:"Başlat",hud_select:"Seç",hud_a:"A Tuşu",hud_b:"B Tuşu",title_screenshot:"Ekran Görüntüsü Al",title_gif:"GIF Kaydet (3sn)",title_video:"Video Kaydet (.webm)",err_rom_load:"Varsayılan ROM yüklenirken hata oluştu",err_emu_start:"Emülatör başlatılamadı",debug_cpu:"CPU Kullanımı",debug_gpu:"GPU Kullanımı",debug_ram:"RAM Kullanımı",debug_resources:"Kaynaklar",panel_states:"Durum Yöneticisi",panel_info:"Bilgi Paneli",osd_on:"AÇIK",osd_off:"KAPALI",state_title:"Durum Yöneticisi",state_save:"Kaydet",state_load:"Yükle",state_empty:"Boş",state_occupied:"Kaydedildi",state_import:"İçe Aktar",quick_save:"Hızlı Kayıt",quick_load:"Hızlı Yükleme"},id:{loading_model:"Memuat model 3D dan ROM…",drop_rom:"LETAKKAN ROM DI SINI",drag_orbit:"🖱 Seret untuk memutar",settings_title:"Pengaturan",language:"Bahasa",brightness:"Kecerahan",contrast:"Kontras",hdr_mode:"Mode HDR",hd_audio:"Orkestrator Audio HD",hd_gain:"Gain Master HD",hd_reverb:"Intensitas Reverb HD",hd_sub:"Pukulan Sub-bas HD",close:"Tutup",status_loading:"memuat rom…",status_booting:"memulai…",status_error:"kesalahan",status_ready_load_rom:"siap — muat rom (📁)",hd_video:"Orkestrator Video HD",hd_grid:"Kekuatan Kotak LCD",hd_blur:"Ghosting (Blur Gerakan)",hd_curve:"Kelengkungan Layar",saturation:"Saturasi",scaling_mode:"Mode Penskalaan",show_metrics:"Tampilkan Metrik",scaling_raw:"Piksel Mentah",scaling_smooth:"Halus (HQ)",scaling_sharp:"Tajam (Tepi)",factory_reset:"Setel Ulang",debug_open:"Buka Debugger",debug_title:"CPU Debugger",debug_resume:"Lanjutkan",debug_pause:"Jeda",debug_step:"Langkah demi Langkah",debug_regs:"Register",debug_disasm:"Disassembler",debug_break:"Breakpoint",debug_msg_resumed:"Eksekusi Dilanjutkan",debug_msg_paused:"Eksekusi Dijeda",palette_title:"Palet DMG",palette_original:"Asli (Hijau)",palette_pocket:"Saku (Abu-abu)",palette_light:"Terang (Biru)",palette_custom:"Kustom",screenshot_saved:"Tangkapan layar disimpan",gif_recording_start:"Merekam GIF (3 detik)...",gif_processing:"Memproses GIF...",gif_saved:"GIF disimpan",video_recording_start:"Merekam Video (maks 15 detik)...",video_saved:"Video disimpan",rewinding:"MEMUTAR ULANG",category_general:"Umum",category_video:"Video",category_hd_video:"Video HD",category_hd_audio:"Audio HD",category_lcd_filters:"Filter LCD Lanjutan",hud_dpad:"D-Pad",hud_start:"Mulai",hud_select:"Pilih",hud_a:"Tombol A",hud_b:"Tombol B",title_screenshot:"Ambil Tangkapan Layar",title_gif:"Rekam GIF (3 dtk)",title_video:"Rekam Video (.webm)",err_rom_load:"Kesalahan memuat ROM bawaan",err_emu_start:"Gagal memulai emulator",debug_cpu:"Penggunaan CPU",debug_gpu:"Penggunaan GPU",debug_ram:"Penggunaan RAM",debug_resources:"Sumber Daya",panel_states:"Manajer State",panel_info:"Panel Info",osd_on:"AKTIF",osd_off:"MATI",state_title:"Manajer State",state_save:"Simpan",state_load:"Muat",state_empty:"Kosong",state_occupied:"Tersimpan",state_import:"Impor",quick_save:"Simpan Cepat",quick_load:"Muat Cepat"},th:{loading_model:"กำลังโหลดโมเดล 3D และ ROM…",drop_rom:"วาง ROM ที่นี่",drag_orbit:"🖱 ลากเพื่อหมุน",settings_title:"การตั้งค่า",language:"ภาษา",brightness:"ความสว่าง",contrast:"คอนทราสต์",hdr_mode:"โหมด HDR",hd_audio:"ตัวจัดการเสียง HD",hd_gain:"HD Master Gain",hd_reverb:"HD Reverb Intensity",hd_sub:"HD Sub-bass Punch",close:"ปิด",status_loading:"กำลังโหลด ROM…",status_booting:"กำลังเปิดเครื่อง…",status_error:"ข้อผิดพลาด",status_ready_load_rom:"พร้อม — โหลด ROM (📁)",hd_video:"ตัวจัดการวิดีโอ HD",hd_grid:"ความชัดเจนของตาราง LCD",hd_blur:"Ghosting (เบลอความเคลื่อนไหว)",hd_curve:"ความโค้งของหน้าจอ",saturation:"ความอิ่มตัวของสี",scaling_mode:"โหมดการปรับขนาด",show_metrics:"แสดงตัวชี้วัด",scaling_raw:"พิกเซลดิบ",scaling_smooth:"นุ่มนวล (HQ)",scaling_sharp:"คมชัด (ขอบ)",factory_reset:"คืนค่าเริ่มต้น",debug_open:"เปิดตัวล้างข้อผิดพลาด",debug_title:"ตัวล้างข้อผิดพลาด CPU",debug_resume:"ย้อนกลับ",debug_pause:"หยุดชั่วคราว",debug_step:"ทีละขั้นตอน",debug_regs:"รีจิสเตอร์",debug_disasm:"การย้อนกลับรหัส",debug_break:"จุดหยุด",debug_msg_resumed:"กลับมาทำงานใหม่",debug_msg_paused:"หยุดชั่วคราว",palette_title:"จานสี DMG",palette_original:"ต้นฉบับ (เขียว)",palette_pocket:"พ็อกเก็ต (เทา)",palette_light:"ไลท์ (ฟ้า)",palette_custom:"กำหนดเอง",screenshot_saved:"บันทึกภาพหน้าจอแล้ว",gif_recording_start:"กำลังบันทึก GIF (3 วินาที)...",gif_processing:"กำลังประมวลผล GIF...",gif_saved:"บันทึก GIF แล้ว",video_recording_start:"กำลังบันทึกวิดีโอ (สูงสุด 15 วินาที)...",video_saved:"บันทึกวิดีโอแล้ว",rewinding:"กำลังย้อนกลับ",category_general:"ทั่วไป",category_video:"วิดีโอ",category_hd_video:"วิดีโอ HD",category_hd_audio:"เสียง HD",category_lcd_filters:"ฟิลเตอร์ LCD ขั้นสูง",hud_dpad:"ปุ่มทิศทาง",hud_start:"เริ่ม",hud_select:"เลือก",hud_a:"ปุ่ม A",hud_b:"ปุ่ม B",title_screenshot:"ถ่ายภาพหน้าจอ",title_gif:"บันทึก GIF (3 วินาที)",title_video:"บันทึกวิดีโอ (.webm)",err_rom_load:"เกิดข้อผิดพลาดในการโหลด ROM เริ่มต้น",err_emu_start:"ไม่สามารถเริ่มต้นโปรแกรมจำลองได้",debug_cpu:"การใช้งาน CPU",debug_gpu:"การใช้งาน GPU",debug_ram:"การใช้งาน RAM",debug_resources:"ทรัพยากร",panel_states:"ตัวจัดการสถานะ",panel_info:"แผงข้อมูล",osd_on:"เปิด",osd_off:"ปิด",state_title:"ตัวจัดการสถานะ",state_save:"บันทึก",state_load:"โหลด",state_empty:"ว่าง",state_occupied:"บันทึกแล้ว",state_import:"นำเข้า",quick_save:"ควิกเซฟ",quick_load:"ควิกโหลด"},vi:{loading_model:"Đang tải mô hình 3D và ROM…",drop_rom:"THẢ ROM VÀO ĐÂY",drag_orbit:"🖱 Kéo để xoay vòng",settings_title:"Cài đặt",language:"Ngôn ngữ",brightness:"Độ sáng",contrast:"Độ tương phản",hdr_mode:"Chế độ HDR",hd_audio:"Bộ điều phối âm thanh HD",hd_gain:"Độ lợi chính HD",hd_reverb:"Cường độ tiếng vang HD",hd_sub:"Độ đấm Sub-bass HD",close:"Đóng",status_loading:"đang tải rom…",status_booting:"đang khởi động…",status_error:"lỗi",status_ready_load_rom:"sẵn sàng — tải rom (📁)",hd_video:"Bộ điều phối video HD",hd_grid:"Độ mạnh lưới LCD",hd_blur:"Bóng ma (Nhòe chuyển động)",hd_curve:"Độ cong màn hình",saturation:"Độ bão hòa",scaling_mode:"Chế độ tỷ lệ",show_metrics:"Hiển thị số liệu",scaling_raw:"Pixel gốc",scaling_smooth:"Mượt (HQ)",scaling_sharp:"Sắc nét (Cạnh)",factory_reset:"Đặt lại mặc định",debug_open:"Mở trình gỡ lỗi",debug_title:"Trình gỡ lỗi CPU",debug_resume:"Tiếp tục",debug_pause:"Tạm dừng",debug_step:"Từng bước",debug_regs:"Thanh ghi",debug_disasm:"Dịch ngược",debug_break:"Điểm dừng",debug_msg_resumed:"Tiếp tục thực thi",debug_msg_paused:"Đã tạm dừng thực thi",palette_title:"Bảng màu DMG",palette_original:"Gốc (Xanh)",palette_pocket:"Bỏ túi (Xám)",palette_light:"Sáng (Xanh lam)",palette_custom:"Tùy chỉnh",screenshot_saved:"Đã lưu ảnh chụp màn hình",gif_recording_start:"Đang ghi GIF (3 giây)...",gif_processing:"Đang xử lý GIF...",gif_saved:"Đã lưu GIF",video_recording_start:"Đang ghi Video (tối đa 15 giây)...",video_saved:"Đã lưu Video",rewinding:"ĐANG TUA LẠI",category_general:"Chung",category_video:"Video",category_hd_video:"Video HD",category_hd_audio:"Âm thanh HD",category_lcd_filters:"Bộ lọc LCD nâng cao",hud_dpad:"Phím điều hướng",hud_start:"Bắt đầu",hud_select:"Chọn",hud_a:"Nút A",hud_b:"Nút B",title_screenshot:"Chụp ảnh màn hình",title_gif:"Ghi GIF (3 giây)",title_video:"Ghi Video (.webm)",err_rom_load:"Lỗi khi tải ROM mặc định",err_emu_start:"Không thể khởi động trình giả lập",debug_cpu:"Sử dụng CPU",debug_gpu:"Sử dụng GPU",debug_ram:"Sử dụng RAM",debug_resources:"Tài nguyên",panel_states:"Trình quản lý trạng thái",panel_info:"Bảng thông tin",osd_on:"BẬT",osd_off:"TẮT",state_title:"Trình quản lý trạng thái",state_save:"Lưu",state_load:"Tải",state_empty:"Trống",state_occupied:"Đã lưu",state_import:"Nhập",quick_save:"Lưu nhanh",quick_load:"Tải nhanh"},hi:{loading_model:"3D मॉडल और ROM लोड हो रहा है…",drop_rom:"यहाँ ROM डालें",drag_orbit:"🖱 घुमाने के लिए खींचें",settings_title:"सेटिंग्स",language:"भाषा",brightness:"चमक",contrast:"कंट्रास्ट",hdr_mode:"HDR मोड",hd_audio:"HD ऑडियो ऑर्केस्ट्रेटर",hd_gain:"HD मास्टर गेन",hd_reverb:"HD रीवरब तीव्रता",hd_sub:"HD सब-बेस पंच",close:"बंद करें",status_loading:"रोम लोड हो रहा है…",status_booting:"बूट हो रहा है…",status_error:"त्रुटि",status_ready_load_rom:"तैयार — ROM लोड करें (📁)",hd_video:"HD वीडियो ऑर्केस्ट्रेटर",hd_grid:"LCD ग्रिड स्ट्रेंथ",hd_blur:"घोस्टिंग (मोशन ब्लर)",hd_curve:"स्क्रीन कर्वचर",saturation:"परिपूर्णता",scaling_mode:"स्केलिंग मोड",show_metrics:"मेट्रिक्स दिखाएं",scaling_raw:"रॉ पिक्सेल",scaling_smooth:"स्मूद (HQ)",scaling_sharp:"शार्प (किनारा)",factory_reset:"डिफ़ॉल्ट रीसेट करें",debug_open:"डीबगर खोलें",debug_title:"CPU डीबगर",debug_resume:"जारी रखें",debug_pause:"विराम",debug_step:"चरण-दर-चरण",debug_regs:"रजिस्टर",debug_disasm:"डिसअसेंबली",debug_break:"ब्रेकपॉइंट्स",debug_msg_resumed:"निष्पादन फिर से शुरू",debug_msg_paused:"निष्पादन रुका हुआ",palette_title:"DMG पैलेट",palette_original:"मूल (हरा)",palette_pocket:"पॉकेट (धूसर)",palette_light:"लाइट (नीला)",palette_custom:"कस्टम",screenshot_saved:"स्क्रीनशॉट सहेजा गया",gif_recording_start:"GIF रिकॉर्ड हो रहा है (3 सेकंड)...",gif_processing:"GIF प्रोसेस हो रहा है...",gif_saved:"GIF सहेजा गया",video_recording_start:"वीडियो रिकॉर्ड हो रहा है (अधिकतम 15 सेकंड)...",video_saved:"वीडियो सहेजा गया",rewinding:"पीछे जा रहा है",category_general:"सामान्य",category_video:"वीडियो",category_hd_video:"HD वीडियो",category_hd_audio:"HD ऑडियो",category_lcd_filters:"उन्नत LCD फ़िल्टर",hud_dpad:"दिशा बटन",hud_start:"शुरू",hud_select:"चुनें",hud_a:"A बटन",hud_b:"B बटन",title_screenshot:"स्क्रीनशॉट लें",title_gif:"GIF रिकॉर्ड करें (3 सेकंड)",title_video:"वीडियो रिकॉर्ड करें (.webm)",err_rom_load:"डिफ़ॉल्ट ROM लोड करने में त्रुटि",err_emu_start:"एमुलेटर शुरू करने में विफल",debug_cpu:"CPU उपयोग",debug_gpu:"GPU उपयोग",debug_ram:"RAM उपयोग",debug_resources:"संसाधन",panel_states:"स्टेट मैनेजर",panel_info:"जानकारी पैनल",osd_on:"चालू",osd_off:"बंद",state_title:"स्टेट मैनेजर",state_save:"सहेजे",state_load:"लोड करें",state_empty:"खाली",state_occupied:"सहेजा गया",state_import:"आयात करें",quick_save:"क्विक सेव",quick_load:"क्विक लोड"},sv:{loading_model:"Laddar 3D-modell och ROM…",drop_rom:"SLÄPP ROM HÄR",drag_orbit:"🖱 Dra för att rotera",settings_title:"Inställningar",language:"Språk",brightness:"Ljusstyrka",contrast:"Kontrast",hdr_mode:"HDR-läge",hd_audio:"HD Ljud-orkestrator",hd_gain:"HD Masterförstärkning",hd_reverb:"HD Reverb-intensitet",hd_sub:"HD Sub-bas-kraft",close:"Stäng",status_loading:"laddar rom…",status_booting:"startar…",status_error:"fel",status_ready_load_rom:"redo — ladda rom (📁)",hd_video:"HD Video-orkestrator",hd_grid:"LCD-rutnätsstyrka",hd_blur:"Eftersläpning (Rörelseoskärpa)",hd_curve:"Skärmkurvatur",saturation:"Mättnad",scaling_mode:"Skalningsläge",show_metrics:"Visa statistik",scaling_raw:"Råa pixlar",scaling_smooth:"Slät (HQ)",scaling_sharp:"Skarp (Kant)",factory_reset:"Återställ Standard",debug_open:"Öppna felsökare",debug_title:"CPU-felsökare",debug_resume:"Fortsätt",debug_pause:"Pausa",debug_step:"Stega",debug_regs:"Register",debug_disasm:"Disassemblering",debug_break:"Brytpunkter",debug_msg_resumed:"Körning återupptagen",debug_msg_paused:"Körning pausad",palette_title:"DMG-palett",palette_original:"Original (Grön)",palette_pocket:"Pocket (Grå)",palette_light:"Light (Blå)",palette_custom:"Anpassad",screenshot_saved:"Skärmdump sparad",gif_recording_start:"Spelar in GIF (3s)...",gif_processing:"Bearbetar GIF...",gif_saved:"GIF sparad",video_recording_start:"Spelar in Video (max 15s)...",video_saved:"Video sparad",rewinding:"SPOLAR TILLBAKA",category_general:"Allmänt",category_video:"Video",category_hd_video:"HD Video",category_hd_audio:"HD Ljud",category_lcd_filters:"Avancerade LCD-filter",hud_dpad:"Styrkors",hud_start:"Start",hud_select:"Select",hud_a:"A-knapp",hud_b:"B-knapp",title_screenshot:"Ta skärmdump",title_gif:"Spela in GIF (3s)",title_video:"Spela in video (.webm)",err_rom_load:"Fel vid laddning av standard-ROM",err_emu_start:"Misslyckades med att starta emulatorn",debug_cpu:"Användning CPU",debug_gpu:"Användning GPU",debug_ram:"Användning RAM",debug_resources:"Resurser",panel_states:"Spara-hanterare",panel_info:"Info-panel",osd_on:"PÅ",osd_off:"AV",state_title:"Spara-hanterare",state_save:"Spara",state_load:"Ladda",state_empty:"Tom",state_occupied:"Sparad",state_import:"Importera",quick_save:"Snabb-spara",quick_load:"Snabb-ladda"},no:{loading_model:"Laster 3D-modell og ROM…",drop_rom:"SLIPP ROM HER",drag_orbit:"🖱 Dra for å rotere",settings_title:"Innstillinger",language:"Språk",brightness:"Lysstyrke",contrast:"Kontrast",hdr_mode:"HDR-modus",hd_audio:"HD Lyd-orkestrator",hd_gain:"HD Master-forsterkning",hd_reverb:"HD Reverb-intensitet",hd_sub:"HD Sub-bass-slag",close:"Lukk",status_loading:"laster rom…",status_booting:"starter…",status_error:"feil",status_ready_load_rom:"klar — last inn rom (📁)",hd_video:"HD Video-orkestrator",hd_grid:"LCD-rutenettstyrke",hd_blur:"Ghosting (Bevegelsesuskarphet)",hd_curve:"Skjermkurvatur",saturation:"Metning",scaling_mode:"Skaleringsmodus",show_metrics:"Vis metrikker",scaling_raw:"Råpiksler",scaling_smooth:"Glatt (HQ)",scaling_sharp:"Skarp (Kant)",factory_reset:"Gjenopprett Standard",debug_open:"Åpne feilsøker",debug_title:"CPU-feilsøker",debug_resume:"Fortsett",debug_pause:"Pause",debug_step:"Steg for steg",debug_regs:"Registre",debug_disasm:"Disassemblering",debug_break:"Brytepunkter",debug_msg_resumed:"Utførelse gjenopptatt",debug_msg_paused:"Utførelse satt på pause",palette_title:"DMG-palett",palette_original:"Original (Grønn)",palette_pocket:"Pocket (Grå)",palette_light:"Light (Blå)",palette_custom:"Tilpasset",screenshot_saved:"Skjermbilde lagret",gif_recording_start:"Spiller inn GIF (3s)...",gif_processing:"Behandler GIF...",gif_saved:"GIF lagret",video_recording_start:"Spiller inn Video (maks 15s)...",video_saved:"Video lagret",rewinding:"SPOLES TILBAKE",category_general:"Generelt",category_video:"Video",category_hd_video:"HD Video",category_hd_audio:"HD Lyd",category_lcd_filters:"Avanserte LCD-filter",hud_dpad:"Styrekors",hud_start:"Start",hud_select:"Select",hud_a:"A-knapp",hud_b:"B-knapp",title_screenshot:"Ta skjermbilde",title_gif:"Spill inn GIF (3s)",title_video:"Spill inn video (.webm)",err_rom_load:"Feil ved lasting av standard-ROM",err_emu_start:"Kunne ikke starte emulatoren",debug_cpu:"CPU-bruk",debug_gpu:"GPU-bruk",debug_ram:"RAM-bruk",debug_resources:"Ressurser",panel_states:"Lagrede Tilstander",panel_info:"Infopanel",osd_on:"PÅ",osd_off:"AV",state_title:"Lagrede Tilstander",state_save:"Lagre",state_load:"Last inn",state_empty:"Tom",state_occupied:"Lagret",state_import:"Importer",quick_save:"Hurtiglagring",quick_load:"Hurtiglasting"},da:{loading_model:"Indlæser 3D-model og ROM…",drop_rom:"SLIP ROM HER",drag_orbit:"🖱 Træk for at rotere",settings_title:"Indstillinger",language:"Sprog",brightness:"Lysstyrke",contrast:"Kontrast",hdr_mode:"HDR-tilstand",hd_audio:"HD Lyd-orkestrator",hd_gain:"HD Master-forstærkning",hd_reverb:"HD Reverb-intensitet",hd_sub:"HD Sub-bass-slag",close:"Luk",status_loading:"indlæser rom…",status_booting:"starter…",status_error:"fejl",status_ready_load_rom:"klar — indlæs rom (📁)",hd_video:"HD Video-orkestrator",hd_grid:"LCD Gitterstyrke",hd_blur:"Ghosting (Bevægelsessløring)",hd_curve:"Skærmkrumning",saturation:"Mætning",scaling_mode:"Skaleringstilstand",show_metrics:"Vis statistikker",scaling_raw:"Rå pixel",scaling_smooth:"Glat (HQ)",scaling_sharp:"Skarp (Kant)",factory_reset:"Gendan Standard",debug_open:"Åbn fejlfinder",debug_title:"CPU-fejlfinder",debug_resume:"Genoptag",debug_pause:"Pause",debug_step:"Trin for trin",debug_regs:"Registre",debug_disasm:"Disassemblering",debug_break:"Stoppunkter",debug_msg_resumed:"Eksekvering genoptaget",debug_msg_paused:"Eksekvering sat på pause",palette_title:"DMG Palette",palette_original:"Original (Grøn)",palette_pocket:"Pocket (Grå)",palette_light:"Light (Blå)",palette_custom:"Tilpasset",screenshot_saved:"Skærmbillede gemt",gif_recording_start:"Optager GIF (3s)...",gif_processing:"Behandler GIF...",gif_saved:"GIF gemt",video_recording_start:"Optager Video (maks 15s)...",video_saved:"Video gemt",rewinding:"SPOLER TILBAGE",category_general:"Generelt",category_video:"Video",category_hd_video:"HD Video",category_hd_audio:"HD Lyd",category_lcd_filters:"Avancerede LCD-filtre",hud_dpad:"Styrekryds",hud_start:"Start",hud_select:"Select",hud_a:"A-knap",hud_b:"B-knap",title_screenshot:"Tag skærmbillede",title_gif:"Optag GIF (3s)",title_video:"Optag video (.webm)",err_rom_load:"Fejl ved indlæsning af standard-ROM",err_emu_start:"Kunne ikke starte emulatoren",debug_cpu:"CPU-forbrug",debug_gpu:"GPU-forbrug",debug_ram:"RAM-forbrug",debug_resources:"Ressourcer",panel_states:"Gemte Tilstande",panel_info:"Infopanel",osd_on:"TIL",osd_off:"FRA",state_title:"Gemte Tilstande",state_save:"Gem",state_load:"Hent",state_empty:"Tom",state_occupied:"Gemt",state_import:"Importer",quick_save:"Hurtig-gem",quick_load:"Hurtig-indlæs"},ar:{loading_model:"جاري تحميل النموذج ثلاثي الأبعاد و ROM…",drop_rom:"أفلت ROM هنا",drag_orbit:"🖱 اسحب للتدوير",settings_title:"الإعدادات",language:"اللغة",brightness:"السطوع",contrast:"التباين",hdr_mode:"وضع HDR",hd_audio:"منسق الصوت عالي الدقة",hd_gain:"كسب الماستر عالي الدقة",hd_reverb:"كثافة الصدى عالي الدقة",hd_sub:"ضربة البيس الفرعي عالية الدقة",close:"إغلاق",status_loading:"جاري تحميل rom…",status_booting:"جاري البدء…",status_error:"خطأ",status_ready_load_rom:"جاهز — حمّل ROM (📁)",hd_video:"منسق الفيديو عالي الدقة",hd_grid:"قوة شبكة LCD",hd_blur:"الظلال (ضبابية الحركة)",hd_curve:"انحناء الشاشة",saturation:"تشبع",scaling_mode:"وضع القياس",show_metrics:"عرض المقاييس",scaling_raw:"بكسل خام",scaling_smooth:"ناعم (HQ)",scaling_sharp:"حاد (حافة)",factory_reset:"إعادة ضبط المصنع",debug_open:"فتح المصحح",debug_title:"مصحح المعالج",debug_resume:"استئناف",debug_pause:"إيقاف مؤقت",debug_step:"خطوة بخطوة",debug_regs:"المسجلات",debug_disasm:"التفكيك",debug_break:"نقاط التوقف",debug_msg_resumed:"تم استئناف التنفيذ",debug_msg_paused:"تم إيقاف التنفيذ مؤقتًا",palette_title:"لوحة ألوان DMG",palette_original:"الأصلي (أخضر)",palette_pocket:"بوكيت (رمادي)",palette_light:"لايت (أزرق)",palette_custom:"مخصص",screenshot_saved:"تم حفظ لقطة الشاشة",gif_recording_start:"جاري تسجيل GIF (3 ثوانٍ)...",gif_processing:"جاري معالجة GIF...",gif_saved:"تم حفظ GIF",video_recording_start:"جاري تسجيل الفيديو (15 ثانية كحد أقصى)...",video_saved:"تم حفظ الفيديو",rewinding:"جاري إعادة اللف",category_general:"عام",category_video:"فيديو",category_hd_video:"فيديو عالي الدقة",category_hd_audio:"صوت عالي الدقة",category_lcd_filters:"مرشحات LCD المتقدمة",hud_dpad:"لوحة الاتجاهات",hud_start:"ابدأ",hud_select:"اختر",hud_a:"زر A",hud_b:"زر B",title_screenshot:"لقطة شاشة",title_gif:"تسجيل GIF (3 ثوانٍ)",title_video:"تسجيل فيديو (.webm)",err_rom_load:"خطأ في تحميل ROM الافتراضي",err_emu_start:"فشل بدء تشغيل المحاكي",debug_cpu:"استخدام المعالج",debug_gpu:"استخدام الجرافيك",debug_ram:"استخدام الذاكرة",debug_resources:"الموارد",panel_states:"مدير الحالات",panel_info:"لوحة المعلومات",osd_on:"مفعل",osd_off:"معطل",state_title:"مدير الحالات",state_save:"حفظ",state_load:"تحميل",state_empty:"فارغ",state_occupied:"محفوظ",state_import:"استيراد",quick_save:"حفظ سريع",quick_load:"تحميل سريع"}};let Oa="es";function cd(n){if(!wa[n]){console.warn(`[i18n] Unknown locale "${n}", falling back to "es"`);return}Oa=n,hd()}function Xe(n){return wa[Oa]?.[n]??wa.es?.[n]??n}function $x(){return Oa}function hd(){const n=wa[Oa];document.querySelectorAll("[data-i18n]").forEach(e=>{const t=e.getAttribute("data-i18n");t&&n[t]&&(e.textContent=n[t])}),document.querySelectorAll("[data-i18n-title]").forEach(e=>{const t=e.getAttribute("data-i18n-title");t&&n[t]&&(e.title=n[t])})}function eS(n={}){const{immediate:e=!1,onNeedRefresh:t,onOfflineReady:i,onRegistered:s,onRegisteredSW:r,onRegisterError:a}=n;let o,l;const c=async(u=!0)=>{await l};async function h(){if("serviceWorker"in navigator){if(o=await Hl(async()=>{const{Workbox:u}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:u}},[],import.meta.url).then(({Workbox:u})=>new u("./sw.js",{scope:"./",type:"classic"})).catch(u=>{a?.(u)}),!o)return;o.addEventListener("activated",u=>{(u.isUpdate||u.isExternal)&&window.location.reload()}),o.addEventListener("installed",u=>{u.isUpdate||i?.()}),o.register({immediate:e}).then(u=>{r?r("./sw.js",u):s?.(u)}).catch(u=>{a?.(u)})}}return l=h(),c}function tS(n,e,t,i){const s=n-t,r=e-i;return Math.abs(s)>Math.abs(r)?s>0?yt.Right:yt.Left:r>0?yt.Down:yt.Up}class iS{panel=null;isOpen=!1;intervalId=null;testHistory=[];constructor(){this.panel=document.getElementById("debugger-panel"),this.attachListeners()}attachListeners(){document.getElementById("btn-close-debug")?.addEventListener("click",()=>this.toggle(!1)),document.getElementById("btn-open-debugger")?.addEventListener("click",()=>{document.getElementById("settings-panel")?.classList.add("hidden"),this.toggle(!0)}),document.getElementById("debug-resume")?.addEventListener("click",()=>{ra(!1),ut.info(Xe("debug_msg_resumed"))}),document.getElementById("debug-pause")?.addEventListener("click",()=>{ra(!0),ut.info(Xe("debug_msg_paused")),this.update()}),document.getElementById("debug-step")?.addEventListener("click",()=>{cu(),this.update()}),document.getElementById("debug-run-tests")?.addEventListener("click",()=>this.runSmokeTests("ALL")),document.getElementById("debug-test-all")?.addEventListener("click",()=>this.runSmokeTests("ALL")),document.getElementById("debug-test-cpu")?.addEventListener("click",()=>this.runSmokeTests("CPU")),document.getElementById("debug-test-ppu")?.addEventListener("click",()=>this.runSmokeTests("PPU")),document.getElementById("debug-test-audio")?.addEventListener("click",()=>this.runSmokeTests("AUDIO"))}toggle(e){this.panel||(this.panel=document.getElementById("debugger-panel")),this.isOpen=e!==void 0?e:!this.isOpen,this.isOpen?(this.panel?.classList.remove("hidden"),this.startAutoUpdate()):(this.panel?.classList.add("hidden"),this.stopAutoUpdate())}startAutoUpdate(){this.intervalId||(this.update(),this.intervalId=window.setInterval(()=>this.update(),100))}stopAutoUpdate(){this.intervalId&&(clearInterval(this.intervalId),this.intervalId=null)}update(){if(!this.isOpen)return;const e=Co();if(!e)return;const t=document.getElementById("debug-regs-list");t&&(t.innerHTML=`
                <div class="reg-item"><span class="reg-label">PC</span><span class="reg-val">$${e.pc.toString(16).toUpperCase().padStart(4,"0")}</span></div>
                <div class="reg-item"><span class="reg-label">SP</span><span class="reg-val">$${e.sp.toString(16).toUpperCase().padStart(4,"0")}</span></div>
                <div class="reg-item"><span class="reg-label">AF</span><span class="reg-val">$${e.af.toString(16).toUpperCase().padStart(4,"0")}</span></div>
                <div class="reg-item"><span class="reg-label">BC</span><span class="reg-val">$${e.bc.toString(16).toUpperCase().padStart(4,"0")}</span></div>
                <div class="reg-item"><span class="reg-label">DE</span><span class="reg-val">$${e.de.toString(16).toUpperCase().padStart(4,"0")}</span></div>
                <div class="reg-item"><span class="reg-label">HL</span><span class="reg-val">$${e.hl.toString(16).toUpperCase().padStart(4,"0")}</span></div>
                <div class="reg-item"><span class="reg-label">F</span><span class="reg-val">${e.f_z?"Z":"-"}${e.f_n?"N":"-"}${e.f_h?"H":"-"}${e.f_c?"C":"-"}</span></div>
            `);const i=document.getElementById("debug-disasm-list");if(i){const l=uu(e.pc,10);i.innerHTML=l.map(c=>`<div class="disasm-line ${c.addr===e.pc?"active":""}" data-addr="${c.addr}">$${c.addr.toString(16).toUpperCase().padStart(4,"0")}: ${c.mnemonic.padEnd(10)} ${c.operands.join(", ")}</div>`).join("")}const s=document.getElementById("debug-resources-list");if(s){const l=lu();s.innerHTML=`
                <div class="reg-item"><span class="reg-label">${Xe("debug_cpu")}</span><span class="reg-val">${l.cpuUsage}%</span></div>
                <div class="reg-item"><span class="reg-label">${Xe("debug_gpu")}</span><span class="reg-val">${l.gpuUsage}%</span></div>
                <div class="reg-item"><span class="reg-label">${Xe("debug_ram")}</span><span class="reg-val">${l.ramUsage} MB</span></div>
            `}const r=aa(),a=document.getElementById("debug-pause"),o=document.getElementById("debug-resume");a&&(a.style.opacity=r?"0.4":"1"),o&&(o.style.opacity=r?"1":"0.4")}runSmokeTests(e="ALL"){if(!document.getElementById("debug-tests-list"))return;const i=[],s=ld(),r=s==="running"||s==="paused";if(i.push({name:"Emulator ready",pass:r,detail:r?s:`status=${s}`}),!r){this.renderTestResults(i,e),ut.warn("Tests: emulator not ready");return}const a=aa();try{const l=Co(),c=lu(),h=e==="ALL"||e==="CPU",u=e==="ALL"||e==="PPU",d=e==="ALL"||e==="AUDIO";if(h){i.push({name:"Registers readable",pass:!!l,detail:l?`pc=$${l.pc.toString(16).toUpperCase().padStart(4,"0")}`:"null"}),ra(!0),i.push({name:"Pause control",pass:aa()===!0,detail:aa()?"paused":"failed"});const f=cu(),g=Co(),_=!!l&&!!g&&f>0;i.push({name:"Step execution",pass:_,detail:_?`cycles=${f}`:"no step"});const m=g?uu(g.pc,5):[];i.push({name:"Disassembly API",pass:m.length>0,detail:`lines=${m.length}`});const p=Number.isFinite(c.cpuUsage)&&Number.isFinite(c.ramUsage);i.push({name:"CPU/RAM metrics",pass:p,detail:p?`${c.cpuUsage}% / ${c.ramUsage}MB`:"invalid"})}if(u){const f=Number.isFinite(c.gpuUsage)&&c.gpuUsage>=0;i.push({name:"GPU metrics",pass:f,detail:f?`${c.gpuUsage}%`:"invalid"});const g=Number.isFinite(c.frameDrops)&&c.frameDrops>=0;i.push({name:"Frame drop counter",pass:g,detail:g?`${c.frameDrops} drops`:"invalid"})}if(d){const f=Number.isFinite(c.audioLatency)&&c.audioLatency>=0;i.push({name:"Audio latency metric",pass:f,detail:f?`${Math.round(c.audioLatency)}ms`:"invalid"})}}finally{ra(a)}this.renderTestResults(i,e);const o=i.filter(l=>l.pass).length;ut.info(`${e} tests ${o}/${i.length}`),this.update()}renderTestResults(e,t){const i=document.getElementById("debug-tests-list");if(!i)return;const s=e.filter(a=>a.pass).length;this.testHistory.unshift({preset:t,passed:s,total:e.length,time:new Date().toLocaleTimeString()}),this.testHistory=this.testHistory.slice(0,8),i.innerHTML=e.map(a=>`
            <div class="reg-item">
                <span class="reg-label">${a.name}</span>
                <span class="reg-val ${a.pass?"pass":"fail"}">${a.pass?"PASS":"FAIL"} · ${a.detail}</span>
            </div>
        `).join("");const r=document.getElementById("debug-tests-history");r&&(r.innerHTML=this.testHistory.map(a=>`
                <div class="reg-item">
                    <span class="reg-label">${a.time} · ${a.preset}</span>
                    <span class="reg-val ${a.passed===a.total?"pass":"fail"}">${a.passed}/${a.total}</span>
                </div>
            `).join(""))}}const nS=new iS,$e={BRIGHTNESS:"gb_brightness",CONTRAST:"gb_contrast",HDR:"gb_hdr",HD_AUDIO:"gb_hd_audio",HD_GAIN:"gb_hd_gain",HD_REVERB:"gb_hd_reverb",HD_SUB:"gb_hd_sub",HD_VIDEO:"gb_hd_video",HD_GRID:"gb_hd_grid",HD_BLUR:"gb_hd_blur",HD_CURVE:"gb_hd_curve",HD_SCALING:"gb_hd_scaling",DMG_PALETTE:"gb_dmg_palette",CGB_PROFILE:"gb_cgb_profile",SCREEN_VIEW:"gb_screen_view",LOCALE:"gb_locale",METRICS:"gb_metrics",HD_SATURATION:"gb_hd_saturation"},du={original:[[202,222,132],[132,160,84],[58,94,58],[14,30,20]],pocket:[[242,242,242],[170,170,170],[84,84,84],[16,16,16]],light:[[230,245,255],[150,186,230],[70,112,172],[12,30,82]],amber:[[255,244,214],[228,176,96],[152,96,40],[70,38,10]],mint:[[225,252,242],[140,214,190],[72,148,132],[18,74,68]],sunset:[[255,228,204],[255,163,129],[196,95,109],[73,35,64]],violet:[[233,227,255],[169,142,234],[98,78,168],[36,26,84]],inverted:[[18,30,20],[58,94,58],[132,160,84],[202,222,132]]};let pn=null,mn=null,ci=null,Un=null,fr=null,pr=null,mr=null,Ki=null,gr=null,_r=null,vr=null,Fn=null,br=null,Bn=null,kn=null,fi=null,gn=null;const sS=window.matchMedia("(dynamic-range: high)").matches;function rS(){pn=document.getElementById("brightness-slider"),mn=document.getElementById("contrast-slider"),ci=document.getElementById("hdr-toggle"),Un=document.getElementById("hd-audio-toggle"),fr=document.getElementById("hd-gain-slider"),pr=document.getElementById("hd-reverb-slider"),mr=document.getElementById("hd-sub-slider"),Ki=document.getElementById("hd-video-toggle"),gr=document.getElementById("hd-grid-slider"),_r=document.getElementById("hd-blur-slider"),vr=document.getElementById("hd-curve-slider"),Fn=document.getElementById("hd-saturation-slider"),br=document.getElementById("scaling-mode-select"),Bn=document.getElementById("palette-select"),kn=document.getElementById("cgb-profile-select"),fi=document.getElementById("screen-view-select"),gn=document.getElementById("metrics-toggle"),!sS&&ci&&(ci.disabled=!0,ci.title="HDR not supported by this display"),pn?.addEventListener("input",Do),mn?.addEventListener("input",Do),ci?.addEventListener("change",Do),Un?.addEventListener("change",()=>{const n=Un.checked;Hx(n),n&&ut.success("HD Audio Active"),fu(),qi()}),Ki?.addEventListener("change",()=>{Na.setEnabled(Ki.checked),Ki.checked&&ut.success("HD Video Active"),sr()}),[pn,mn,ci].forEach(n=>n?.addEventListener("input",sr)),[fr,pr,mr].forEach(n=>n?.addEventListener("input",fu)),[gr,_r,vr,Fn,br].forEach(n=>n?.addEventListener("input",sr)),Bn?.addEventListener("change",()=>{Ra(),qi()}),kn?.addEventListener("change",()=>{Fl(),qi()}),fi?.addEventListener("change",()=>{va(!0),qi()}),gn?.addEventListener("change",()=>{const n=gn.checked;ud(),oS(n),qi()}),document.getElementById("lang-select")?.addEventListener("change",n=>{cd(n.target.value),qi()}),document.getElementById("btn-reset-settings")?.addEventListener("click",cS),document.getElementById("btn-settings")?.addEventListener("click",()=>Bl()),document.getElementById("btn-close-settings")?.addEventListener("click",()=>Bl()),document.getElementById("btn-close-guide")?.addEventListener("click",()=>vc()),document.getElementById("btn-open-debugger")?.addEventListener("click",()=>_c()),lS(),Ra(),Fl(),va(!1),document.addEventListener("fullscreenchange",()=>{document.fullscreenElement||fi?.value==="full"&&(fi.value="1x",va(!1),qi())})}function Do(){}function fu(){const n=parseFloat(fr?.value??"1.2"),e=parseFloat(pr?.value??"0.4"),t=parseFloat(mr?.value??"0.5");Xx(n,e,t)}function sr(){let n=parseFloat(pn?.value??"1.0"),e=parseFloat(mn?.value??"1.0"),t=parseFloat(Fn?.value??"1.25");ci?.checked&&(n*=1.1,e*=1.1,t*=1.2);const i=Ki?.checked??!1;qx({lcdGrid:i?parseFloat(gr?.value??"0.2"):0,ghosting:i?parseFloat(_r?.value??"0.35"):0,curvature:i?parseFloat(vr?.value??"0.15"):0,brightness:n,contrast:e,saturation:t,scalingMode:(i?br?.value:"raw")??"sharp"}),qi()}function Ra(){const n=Bn?.value||"pocket",e=du[n]||du.pocket;jx(e)}function Fl(){const n=kn?.value||"vivid";Yx(n)}function aS(){Ra(),Fl()}async function va(n){const e=fi?.value||"1x",t=document.getElementById("scene-root");if(e==="1x"?(na("1x"),document.fullscreenElement&&await document.exitFullscreen()):e==="2x"?(na("2x"),document.fullscreenElement&&await document.exitFullscreen()):e==="4x"?(na("4x"),document.fullscreenElement&&await document.exitFullscreen()):(na("4x"),!document.fullscreenElement&&t?.requestFullscreen&&await t.requestFullscreen().catch(()=>{})),n){const i=e==="full"?"Display: Full Screen":`Display: ${e.toUpperCase()}`;ut.info(i)}}function oa(n){fi&&(fi.value=n,va(!0),qi())}function ud(){const n=document.getElementById("metrics-container");n&&(n.style.display=gn?.checked?"flex":"none")}function oS(n){const e=Xe("show_metrics"),t=Xe(n?"osd_on":"osd_off");ut.info(`${e}: ${t}`)}function qi(){const n=(e,t)=>localStorage.setItem(e,t);pn&&n($e.BRIGHTNESS,pn.value),mn&&n($e.CONTRAST,mn.value),ci&&n($e.HDR,ci.checked.toString()),Un&&n($e.HD_AUDIO,Un.checked.toString()),fr&&n($e.HD_GAIN,fr.value),pr&&n($e.HD_REVERB,pr.value),mr&&n($e.HD_SUB,mr.value),Ki&&n($e.HD_VIDEO,Ki.checked.toString()),gr&&n($e.HD_GRID,gr.value),_r&&n($e.HD_BLUR,_r.value),vr&&n($e.HD_CURVE,vr.value),Fn&&n($e.HD_SATURATION,Fn.value),br&&n($e.HD_SCALING,br.value),Bn&&n($e.DMG_PALETTE,Bn.value),kn&&n($e.CGB_PROFILE,kn.value),fi&&n($e.SCREEN_VIEW,fi.value),gn&&n($e.METRICS,gn.checked.toString()),n($e.LOCALE,$x())}function lS(){const n=d=>localStorage.getItem(d),e=n($e.BRIGHTNESS);e&&pn&&(pn.value=e);const t=n($e.CONTRAST);t&&mn&&(mn.value=t);const i=n($e.HDR);i&&ci&&(ci.checked=i==="true"),sr(),n($e.HD_AUDIO)==="true"&&Un&&(Un.checked=!0,us.setEnabled(!0)),n($e.HD_VIDEO)==="true"&&Ki&&(Ki.checked=!0,Na.setEnabled(!0));const a=n($e.DMG_PALETTE);a&&Bn&&(Bn.value=a,Ra());const o=n($e.CGB_PROFILE);o&&kn&&(kn.value=o);const l=n($e.SCREEN_VIEW);l&&fi&&(fi.value=l);const c=n($e.HD_SATURATION);c&&Fn&&(Fn.value=c,sr());const h=n($e.METRICS);h!==null&&gn&&(gn.checked=h==="true",ud());const u=n($e.LOCALE);u&&cd(u)}function cS(){confirm(Xe("factory_reset")+"?")&&(localStorage.clear(),location.reload())}function Bl(){console.log("[SettingsUI] Toggle Settings"),document.getElementById("settings-panel")?.classList.toggle("hidden")}function dd(){console.log("[SettingsUI] Toggle States"),document.getElementById("state-panel")?.classList.toggle("hidden")}function _c(){console.log("[SettingsUI] Toggle Debugger"),nS.toggle()}function fd(){console.log("[SettingsUI] Toggle Info"),document.getElementById("hud-panel")?.classList.toggle("hidden")}function vc(){console.log("[SettingsUI] Toggle Guide");const n=document.getElementById("guide-panel");if(!n)return;n.classList.toggle("hidden");const e=!n.classList.contains("hidden");ut.info(`${Xe("panel_info")}: ${Xe(e?"osd_on":"osd_off")}`)}const Lo={KeyX:"A",KeyJ:"A",KeyZ:"B",KeyQ:"B",KeyY:"B",ShiftLeft:"SELECT",ShiftRight:"SELECT",Enter:"START",ArrowUp:"DPAD",ArrowDown:"DPAD",ArrowLeft:"DPAD",ArrowRight:"DPAD"},pu={ArrowRight:yt.Right,ArrowLeft:yt.Left,ArrowUp:yt.Up,ArrowDown:yt.Down,KeyX:yt.A,KeyJ:yt.A,KeyZ:yt.B,KeyQ:yt.B,KeyY:yt.B,ShiftLeft:yt.Select,ShiftRight:yt.Select,Enter:yt.Start},hS={A:yt.A,B:yt.B,SELECT:yt.Select,START:yt.Start};let un=null,ps=null;const Io=new Set;function uS(n){window.addEventListener("keydown",e=>{if(e.repeat)return;console.log(`[Input] KeyDown: ${e.code}`),Io.add(e.code);const t=Lo[e.code];t&&hs(t,!0);const i=pu[e.code];if(i!==void 0&&In(i,!0),e.code==="KeyR"&&(hu(!0),document.getElementById("rewind-overlay")?.classList.add("active")),(e.code==="KeyD"||e.code==="Digit9")&&_c(),(e.code==="KeyS"||e.code==="Digit8")&&dd(),(e.code==="KeyP"||e.code==="Digit7")&&fd(),(e.code==="KeyO"||e.code==="Digit6")&&Bl(),e.code==="KeyH"&&vc(),e.code==="Digit0"){const s=document.getElementById("metrics-toggle");s&&(s.checked=!s.checked,s.dispatchEvent(new Event("change")))}e.code==="Digit1"&&oa("1x"),e.code==="Digit2"&&oa("2x"),e.code==="Digit3"&&oa("4x"),e.code==="Digit4"&&oa("full")}),window.addEventListener("keyup",e=>{Io.delete(e.code);const t=Lo[e.code];t&&([...Io].some(r=>Lo[r]===t)||hs(t,!1));const i=pu[e.code];i!==void 0&&In(i,!1),e.code==="KeyR"&&(hu(!1),document.getElementById("rewind-overlay")?.classList.remove("active"))}),["A","B","START","SELECT"].forEach(e=>{const t=document.getElementById(`touch-${e.toLowerCase()}`);if(!t)return;const i=hS[e];t.addEventListener("touchstart",r=>{r.preventDefault(),hs(e,!0),In(i,!0)},{passive:!1});const s=r=>{r.preventDefault(),hs(e,!1),In(i,!1)};t.addEventListener("touchend",s,{passive:!1}),t.addEventListener("touchcancel",s,{passive:!1})}),n&&(n.addEventListener("touchstart",mu,{passive:!1}),n.addEventListener("touchmove",mu,{passive:!1}),n.addEventListener("touchend",gu,{passive:!1}),n.addEventListener("touchcancel",gu,{passive:!1}))}function mu(n){if(n.preventDefault(),n.type==="touchstart"&&ps===null&&n.changedTouches.length&&(ps=n.changedTouches[0].identifier),ps===null)return;let e=null;for(let o=0;o<n.touches.length;o++)if(n.touches[o].identifier===ps){e=n.touches[o];break}if(!e)return;const i=n.currentTarget.getBoundingClientRect(),s=i.left+i.width/2,r=i.top+i.height/2,a=tS(e.clientX,e.clientY,s,r);un!==a&&(un!==null&&In(un,!1),un=a,hs("DPAD",!0),In(un,!0))}function gu(n){n.preventDefault();let e=!1;for(let t=0;t<n.changedTouches.length;t++)if(n.changedTouches[t].identifier===ps){e=!0;break}e&&(ps=null,hs("DPAD",!1),un!==null&&In(un,!1),un=null)}function dS(){const n=document.getElementById("state-upload");document.querySelectorAll(".state-slot").forEach(e=>{const t=parseInt(e.getAttribute("data-slot")||"0");e.querySelector(".btn-save-slot")?.addEventListener("click",()=>fS(t)),e.querySelector(".btn-load-slot")?.addEventListener("click",()=>pS(t)),e.querySelector(".btn-export-slot")?.addEventListener("click",i=>{i.stopPropagation(),Vx()})}),document.getElementById("btn-close-state")?.addEventListener("click",()=>{document.getElementById("state-panel")?.classList.add("hidden")}),document.getElementById("btn-import-state")?.addEventListener("click",()=>{n?.click()}),n?.addEventListener("change",async e=>{const t=e.target.files?.[0];t&&(await Wx(t)?(ut.success(Xe("state_import")),document.getElementById("state-panel")?.classList.add("hidden")):ut.error("Invalid state file"))}),bc()}function bc(){document.querySelectorAll(".state-slot").forEach(e=>{const t=parseInt(e.getAttribute("data-slot")||"0"),i=localStorage.getItem(`__SLOT_${t}_OCCUPIED`)==="true",s=e.querySelector(".slot-status"),r=e.querySelector(".btn-load-slot"),a=e.querySelector(".btn-export-slot");i?(e.classList.add("occupied"),s&&(s.textContent=Xe("state_occupied")),r?.classList.remove("hidden-emu"),a?.classList.remove("hidden-emu")):(e.classList.remove("occupied"),s&&(s.textContent=Xe("state_empty")),r?.classList.add("hidden-emu"),a?.classList.add("hidden-emu"))})}async function fS(n){await Gx(n),localStorage.setItem(`__SLOT_${n}_OCCUPIED`,"true");const e=n===0?Xe("quick_save"):`${Xe("state_save")} - Slot ${n}`;ut.success(e),bc()}async function pS(n){if(await zx(n)){const e=n===0?Xe("quick_load"):`${Xe("state_load")} - Slot ${n}`;ut.success(e),document.getElementById("state-panel")?.classList.add("hidden")}else ut.error("Error loading state")}function mS(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}function la(n){throw new Error('Could not dynamically require "'+n+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Uo={exports:{}},_u;function gS(){return _u||(_u=1,(function(n,e){(function(t){n.exports=t()})(function(){return(function t(i,s,r){function a(c,h){if(!s[c]){if(!i[c]){var u=typeof la=="function"&&la;if(!h&&u)return u(c,!0);if(o)return o(c,!0);var d=new Error("Cannot find module '"+c+"'");throw d.code="MODULE_NOT_FOUND",d}var f=s[c]={exports:{}};i[c][0].call(f.exports,function(g){var _=i[c][1][g];return a(_||g)},f,f.exports,t,i,s,r)}return s[c].exports}for(var o=typeof la=="function"&&la,l=0;l<r.length;l++)a(r[l]);return a})({1:[function(t,i,s){function r(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}i.exports=r,r.EventEmitter=r,r.prototype._events=void 0,r.prototype._maxListeners=void 0,r.defaultMaxListeners=10,r.prototype.setMaxListeners=function(h){if(!o(h)||h<0||isNaN(h))throw TypeError("n must be a positive number");return this._maxListeners=h,this},r.prototype.emit=function(h){var u,d,f,g,_,m;if(this._events||(this._events={}),h==="error"&&(!this._events.error||l(this._events.error)&&!this._events.error.length)){if(u=arguments[1],u instanceof Error)throw u;var p=new Error('Uncaught, unspecified "error" event. ('+u+")");throw p.context=u,p}if(d=this._events[h],c(d))return!1;if(a(d))switch(arguments.length){case 1:d.call(this);break;case 2:d.call(this,arguments[1]);break;case 3:d.call(this,arguments[1],arguments[2]);break;default:g=Array.prototype.slice.call(arguments,1),d.apply(this,g)}else if(l(d))for(g=Array.prototype.slice.call(arguments,1),m=d.slice(),f=m.length,_=0;_<f;_++)m[_].apply(this,g);return!0},r.prototype.addListener=function(h,u){var d;if(!a(u))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",h,a(u.listener)?u.listener:u),this._events[h]?l(this._events[h])?this._events[h].push(u):this._events[h]=[this._events[h],u]:this._events[h]=u,l(this._events[h])&&!this._events[h].warned&&(c(this._maxListeners)?d=r.defaultMaxListeners:d=this._maxListeners,d&&d>0&&this._events[h].length>d&&(this._events[h].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[h].length),typeof console.trace=="function"&&console.trace())),this},r.prototype.on=r.prototype.addListener,r.prototype.once=function(h,u){if(!a(u))throw TypeError("listener must be a function");var d=!1;function f(){this.removeListener(h,f),d||(d=!0,u.apply(this,arguments))}return f.listener=u,this.on(h,f),this},r.prototype.removeListener=function(h,u){var d,f,g,_;if(!a(u))throw TypeError("listener must be a function");if(!this._events||!this._events[h])return this;if(d=this._events[h],g=d.length,f=-1,d===u||a(d.listener)&&d.listener===u)delete this._events[h],this._events.removeListener&&this.emit("removeListener",h,u);else if(l(d)){for(_=g;_-- >0;)if(d[_]===u||d[_].listener&&d[_].listener===u){f=_;break}if(f<0)return this;d.length===1?(d.length=0,delete this._events[h]):d.splice(f,1),this._events.removeListener&&this.emit("removeListener",h,u)}return this},r.prototype.removeAllListeners=function(h){var u,d;if(!this._events)return this;if(!this._events.removeListener)return arguments.length===0?this._events={}:this._events[h]&&delete this._events[h],this;if(arguments.length===0){for(u in this._events)u!=="removeListener"&&this.removeAllListeners(u);return this.removeAllListeners("removeListener"),this._events={},this}if(d=this._events[h],a(d))this.removeListener(h,d);else if(d)for(;d.length;)this.removeListener(h,d[d.length-1]);return delete this._events[h],this},r.prototype.listeners=function(h){var u;return!this._events||!this._events[h]?u=[]:a(this._events[h])?u=[this._events[h]]:u=this._events[h].slice(),u},r.prototype.listenerCount=function(h){if(this._events){var u=this._events[h];if(a(u))return 1;if(u)return u.length}return 0},r.listenerCount=function(h,u){return h.listenerCount(u)};function a(h){return typeof h=="function"}function o(h){return typeof h=="number"}function l(h){return typeof h=="object"&&h!==null}function c(h){return h===void 0}},{}],2:[function(t,i,s){var r,a,o,l,c;c=navigator.userAgent.toLowerCase(),l=navigator.platform.toLowerCase(),r=c.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/)||[null,"unknown",0],o=r[1]==="ie"&&document.documentMode,a={name:r[1]==="version"?r[3]:r[1],version:o||parseFloat(r[1]==="opera"&&r[4]?r[4]:r[2]),platform:{name:c.match(/ip(?:ad|od|hone)/)?"ios":(c.match(/(?:webos|android)/)||l.match(/mac|win|linux/)||["other"])[0]}},a[a.name]=!0,a[a.name+parseInt(a.version,10)]=!0,a.platform[a.platform.name]=!0,i.exports=a},{}],3:[function(t,i,s){var r,a,o,l=function(d,f){for(var g in f)c.call(f,g)&&(d[g]=f[g]);function _(){this.constructor=d}return _.prototype=f.prototype,d.prototype=new _,d.__super__=f.prototype,d},c={}.hasOwnProperty,h=[].indexOf||function(d){for(var f=0,g=this.length;f<g;f++)if(f in this&&this[f]===d)return f;return-1},u=[].slice;r=t("events").EventEmitter,o=t("./browser.coffee"),a=(function(d){var f,g;l(_,d),f={workerScript:"gif.worker.js",workers:2,repeat:0,background:"#fff",quality:10,width:null,height:null,transparent:null,debug:!1,dither:!1},g={delay:500,copy:!1};function _(m){var p,b,M;this.running=!1,this.options={},this.frames=[],this.freeWorkers=[],this.activeWorkers=[],this.setOptions(m);for(b in f)M=f[b],(p=this.options)[b]==null&&(p[b]=M)}return _.prototype.setOption=function(m,p){if(this.options[m]=p,this._canvas!=null&&(m==="width"||m==="height"))return this._canvas[m]=p},_.prototype.setOptions=function(m){var p,b,M;b=[];for(p in m)c.call(m,p)&&(M=m[p],b.push(this.setOption(p,M)));return b},_.prototype.addFrame=function(m,p){var b,M;p==null&&(p={}),b={},b.transparent=this.options.transparent;for(M in g)b[M]=p[M]||g[M];if(this.options.width==null&&this.setOption("width",m.width),this.options.height==null&&this.setOption("height",m.height),typeof ImageData<"u"&&ImageData!==null&&m instanceof ImageData)b.data=m.data;else if(typeof CanvasRenderingContext2D<"u"&&CanvasRenderingContext2D!==null&&m instanceof CanvasRenderingContext2D||typeof WebGLRenderingContext<"u"&&WebGLRenderingContext!==null&&m instanceof WebGLRenderingContext)p.copy?b.data=this.getContextData(m):b.context=m;else if(m.childNodes!=null)p.copy?b.data=this.getImageData(m):b.image=m;else throw new Error("Invalid image");return this.frames.push(b)},_.prototype.render=function(){var m,p,b;if(this.running)throw new Error("Already running");if(this.options.width==null||this.options.height==null)throw new Error("Width and height must be set prior to rendering");if(this.running=!0,this.nextFrame=0,this.finishedFrames=0,this.imageParts=(function(){var M,y,A;for(A=[],M=0,y=this.frames.length;0<=y?M<y:M>y;0<=y?++M:--M)A.push(null);return A}).call(this),p=this.spawnWorkers(),this.options.globalPalette===!0)this.renderNextFrame();else for(m=0,b=p;0<=b?m<b:m>b;0<=b?++m:--m)this.renderNextFrame();return this.emit("start"),this.emit("progress",0)},_.prototype.abort=function(){for(var m;m=this.activeWorkers.shift(),m!=null;)this.log("killing active worker"),m.terminate();return this.running=!1,this.emit("abort")},_.prototype.spawnWorkers=function(){var m,p,b;return m=Math.min(this.options.workers,this.frames.length),(function(){b=[];for(var M=p=this.freeWorkers.length;p<=m?M<m:M>m;p<=m?M++:M--)b.push(M);return b}).apply(this).forEach((function(M){return function(y){var A;return M.log("spawning worker "+y),A=new Worker(M.options.workerScript),A.onmessage=function(w){return M.activeWorkers.splice(M.activeWorkers.indexOf(A),1),M.freeWorkers.push(A),M.frameFinished(w.data)},M.freeWorkers.push(A)}})(this)),m},_.prototype.frameFinished=function(m){var p,b;if(this.log("frame "+m.index+" finished - "+this.activeWorkers.length+" active"),this.finishedFrames++,this.emit("progress",this.finishedFrames/this.frames.length),this.imageParts[m.index]=m,this.options.globalPalette===!0&&(this.options.globalPalette=m.globalPalette,this.log("global palette analyzed"),this.frames.length>2))for(p=1,b=this.freeWorkers.length;1<=b?p<b:p>b;1<=b?++p:--p)this.renderNextFrame();return h.call(this.imageParts,null)>=0?this.renderNextFrame():this.finishRendering()},_.prototype.finishRendering=function(){var m,p,b,M,y,A,w,C,x,E,W,R,k,B,z,H;for(C=0,B=this.imageParts,y=0,x=B.length;y<x;y++)p=B[y],C+=(p.data.length-1)*p.pageSize+p.cursor;for(C+=p.pageSize-p.cursor,this.log("rendering finished - filesize "+Math.round(C/1e3)+"kb"),m=new Uint8Array(C),R=0,z=this.imageParts,A=0,E=z.length;A<E;A++)for(p=z[A],H=p.data,b=w=0,W=H.length;w<W;b=++w)k=H[b],m.set(k,R),b===p.data.length-1?R+=p.cursor:R+=p.pageSize;return M=new Blob([m],{type:"image/gif"}),this.emit("finished",M,m)},_.prototype.renderNextFrame=function(){var m,p,b;if(this.freeWorkers.length===0)throw new Error("No free workers");if(!(this.nextFrame>=this.frames.length))return m=this.frames[this.nextFrame++],b=this.freeWorkers.shift(),p=this.getTask(m),this.log("starting frame "+(p.index+1)+" of "+this.frames.length),this.activeWorkers.push(b),b.postMessage(p)},_.prototype.getContextData=function(m){return m.getImageData(0,0,this.options.width,this.options.height).data},_.prototype.getImageData=function(m){var p;return this._canvas==null&&(this._canvas=document.createElement("canvas"),this._canvas.width=this.options.width,this._canvas.height=this.options.height),p=this._canvas.getContext("2d"),p.setFill=this.options.background,p.fillRect(0,0,this.options.width,this.options.height),p.drawImage(m,0,0),this.getContextData(p)},_.prototype.getTask=function(m){var p,b;if(p=this.frames.indexOf(m),b={index:p,last:p===this.frames.length-1,delay:m.delay,transparent:m.transparent,width:this.options.width,height:this.options.height,quality:this.options.quality,dither:this.options.dither,globalPalette:this.options.globalPalette,repeat:this.options.repeat,canTransfer:o.name==="chrome"},m.data!=null)b.data=m.data;else if(m.context!=null)b.data=this.getContextData(m.context);else if(m.image!=null)b.data=this.getImageData(m.image);else throw new Error("Invalid frame");return b},_.prototype.log=function(){var m;if(m=1<=arguments.length?u.call(arguments,0):[],!!this.options.debug)return console.log.apply(console,m)},_})(r),i.exports=a},{"./browser.coffee":2,events:1}]},{},[3])(3)})})(Uo)),Uo.exports}var _S=gS();const vS=mS(_S);let No=!1,ca=!1,os=null,Oo=[];async function bS(n){if(No)return;No=!0,ut.info(Xe("gif_recording_start")||"Recording GIF (3s)...");const e=new vS({workers:2,quality:10,width:160,height:144,workerScript:"/gif.worker.js"}),t=[],i=setInterval(()=>{t.length<30&&t.push(n.toDataURL("image/png"))},100);setTimeout(async()=>{clearInterval(i),ut.info(Xe("gif_processing")||"Processing GIF...");for(const s of t){const r=new Image;r.src=s,await new Promise(a=>r.onload=a),e.addFrame(r,{delay:100})}e.on("finished",s=>{const r=document.createElement("a");r.href=URL.createObjectURL(s);const a=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);r.download=`HIP-GBE-Clip-${a}.gif`,r.click(),No=!1,ut.success(Xe("gif_saved")||"GIF Saved")}),e.render()},3100)}function xS(n){if(ca){os?.stop();return}const e=n.captureStream(30);os=new MediaRecorder(e,{mimeType:"video/webm"}),Oo=[],os.ondataavailable=t=>{t.data.size>0&&Oo.push(t.data)},os.onstop=()=>{const t=new Blob(Oo,{type:"video/webm"}),i=document.createElement("a");i.href=URL.createObjectURL(t);const s=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);i.download=`HIP-GBE-Video-${s}.webm`,i.click(),ca=!1,ut.success(Xe("video_saved")||"Video Saved")},os.start(),ca=!0,ut.info(Xe("video_recording_start")||"Recording Video..."),setTimeout(()=>{ca&&os?.stop()},15e3)}function SS(n){const e=n.toDataURL("image/png"),t=document.createElement("a"),i=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);t.download=`HIP-GBE-Capture-${i}.png`,t.href=e,t.click(),ut.success(Xe("screenshot_saved")||"Screenshot Saved")}const MS="H.I.P. GAME BOY EMULATOR",yS=eS({onNeedRefresh(){confirm("Nueva versión disponible. ¿Actualizar ahora?")&&yS(!0)},onOfflineReady(){console.log("[PWA] Lista para trabajar sin conexión.")}}),ls={centerX:.652,centerY:.74,repeatX:2.98,repeatY:2.98,offsetX:.06,offsetY:.088};let Ti=null,yi=null,rr=null,Fa=!1;async function ES(){if(typeof window>"u"||!("caches"in window))return;const n="hip-gbe-v1.0.0-rc04",e="google-fonts-stylesheets-v1.0.0-rc04",t=await caches.keys();await Promise.all(t.map(i=>{const s=i.startsWith("hip-gbe-v")&&i!==n,r=i.startsWith("google-fonts-stylesheets-v")&&i!==e;return s||r?caches.delete(i):Promise.resolve(!1)}))}const _n=document.getElementById("mainCanvas"),TS=document.getElementById("scene-root");async function AS(){console.log("[Main] Initializing H.I.P. GBE...");const n=document.getElementById("app-version");n&&(n.textContent="1.0.0-rc04"),document.title="H.I.P. Game Boy Emulator v1.0.0-rc04",ES().catch(e=>console.warn("[PWA] Cache cleanup failed:",e)),hd(),hb(TS),uS(document.getElementById("touch-dpad")),rS(),dS(),md(),document.getElementById("btn-screenshot")?.addEventListener("click",()=>SS(_n)),document.getElementById("btn-gif")?.addEventListener("click",()=>bS(_n)),document.getElementById("btn-video")?.addEventListener("click",()=>xS(_n)),document.getElementById("btn-guide")?.addEventListener("click",vc),document.getElementById("btn-open-debugger")?.addEventListener("click",_c),document.getElementById("btn-toggle-states-settings")?.addEventListener("click",()=>{dd(),bc()}),document.getElementById("btn-toggle-info-settings")?.addEventListener("click",fd),nx({onScreenReady:e=>{Ti=e,wS()},onError:e=>console.error("[Main] Model error:",e)}),DS()}async function wS(){Nn(Xe("status_loading"));try{const n=lx();Fa=!0,await pd(n,od)}catch{ut.error(Xe("err_rom_load")),Nn(Xe("status_error"))}}async function pd(n,e){Nn(Xe("status_booting"));try{await kx(_n,n),aS(),RS(),CS(e),Nn(Fa?Xe("status_ready_load_rom"):null),ut.success(`▶ ${e.replace(/\.[^/.]+$/,"").toUpperCase()}`)}catch{ut.error(Xe("err_emu_start")),Nn(Xe("status_error"))}}function RS(){let n=0;const e=setInterval(()=>{n++,_n.width>0?(clearInterval(e),vu()):n>=60&&(clearInterval(e),_n.width=160,_n.height=144,vu())},50)}function Nn(n){const e=document.getElementById("hud-status");e&&(e.textContent=n??"",e.classList.toggle("hidden",!n))}function CS(n){const e=document.querySelector(".game-title");if(e){if(Fa&&n===od){e.textContent=MS;return}e.textContent=n.replace(/\.[^/.]+$/,"").toUpperCase()}}function vu(){yi=new sp(_n),PS(yi),Ti&&(Ti.map=yi,Ti.needsUpdate=!0),rr||(rr=new Kx(Qt),Na.setCallback(n=>{rr?.updateParams(n)})),document.getElementById("loading-overlay")?.classList.add("hidden")}function PS(n){n.center.set(ls.centerX,ls.centerY),n.repeat.set(ls.repeatX,ls.repeatY),n.offset.set(ls.offsetX,ls.offsetY)}function md(){if(requestAnimationFrame(md),Mi?.update(),mb(),bb(),yi)if(yi.needsUpdate=!0,rr){const e=rr.process(yi);Ti&&(e.repeat.copy(yi.repeat),e.offset.copy(yi.offset),e.center.copy(yi.center),Ti.map=e,Ti.needsUpdate=!0)}else Ti&&(Ti.map=yi,Ti.needsUpdate=!0);const n=performance.now();ub(),Ps.recordGpuFrame(performance.now()-n)}function DS(){setInterval(()=>{if(ld()!=="running")return;const n=Ps.getMetrics(),e=document.getElementById("metric-fps");e&&(e.textContent=`${Math.round(n.fps)} FPS`);const t=document.getElementById("metric-drops");t&&(t.textContent=`${n.frameDrops} DRPS`);const i=document.getElementById("metric-latency");i&&(i.textContent=`${Math.round(n.audioLatency)} MS`)},500)}const xc=document.getElementById("drag-overlay");let Sc=0;window.addEventListener("dragover",n=>n.preventDefault());window.addEventListener("dragenter",n=>{n.preventDefault(),++Sc===1&&xc?.classList.add("active")});window.addEventListener("dragleave",n=>{n.preventDefault(),--Sc===0&&xc?.classList.remove("active")});window.addEventListener("drop",n=>{n.preventDefault(),Sc=0,xc?.classList.remove("active");const e=n.dataTransfer?.files[0];e&&gd(e)});const kl=document.getElementById("rom-upload");document.getElementById("btn-load-rom")?.addEventListener("click",()=>{kl?.click()});kl?.addEventListener("change",n=>{const e=n.target.files?.[0];e&&(gd(e),kl.value="")});async function gd(n){const{isSupportedFile:e,loadROMFromFile:t}=await Hl(async()=>{const{isSupportedFile:i,loadROMFromFile:s}=await import("./ROMLoader-r_Qv_EW7.js");return{isSupportedFile:i,loadROMFromFile:s}},[],import.meta.url);if(!e(n.name)){ut.error(`Unsupported file: ${n.name}`);return}Nn(Xe("status_loading"));try{const i=await t(n);Fa=!1,await pd(i.bytes,i.filename)}catch{ut.error("ROM Error"),Nn(Xe("status_error"))}}AS().catch(n=>console.error("[Main] Init failed:",n));export{Ut as l};
