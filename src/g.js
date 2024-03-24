(()=>{var t,e,i=()=>{};function n(t,e){let i=e.parentNode;if(t.setAttribute("data-kontra",""),i){let n=i.querySelector("[data-kontra]:last-of-type")||e;i.insertBefore(t,n.nextSibling)}else document.body.appendChild(t)}function s(t,e){let i=t.indexOf(e);if(-1!=i)return t.splice(i,1),!0}var o={};function h(t,e){o[t]=o[t]||[],o[t].push(e)}function a(t,...e){(o[t]||[]).map((t=>t(...e)))}var r={get:(t,e)=>"_proxy"==e||i};function c(){return t}function l(){return e}var d=/(jpeg|jpg|gif|png|webp)$/,u=/(wav|mp3|ogg|aac)$/,y=/^\//,x=/\/$/,p=new WeakMap,f="",g="",_="";function w(t,e){return new URL(t,e).href}function m(t,e){return[t.replace(x,""),t?e.replace(y,""):e].filter((t=>t)).join("/")}function v(t){return t.split(".").pop()}function b(t){let e=t.replace("."+v(t),"");return 2==e.split("/").length?e.replace(y,""):e}var j={},M={},k={};function A(){window.__k||(window.__k={dm:p,u:w,d:k,i:j})}function E(t,e){return Math.atan2(e.y-t.y,e.x-t.x)}function O(t,e,i){return Math.min(Math.max(t,i),e)}function Y(t,e){return[t,e]=[t,e].map((t=>L(t))),t.x<e.x+e.width&&t.x+t.width>e.x&&t.y<e.y+e.height&&t.y+t.height>e.y}function L(t){let{x:e=0,y:i=0,width:n,height:s}=t.world||t;return t.mapwidth&&(n=t.mapwidth,s=t.mapheight),t.anchor&&(e-=n*t.anchor.x,i-=s*t.anchor.y),n<0&&(e+=n,n*=-1),s<0&&(i+=s,s*=-1),{x:e,y:i,width:n,height:s}}var X=class{constructor(t=0,e=0,i={}){null!=t.x?(this.x=t.x,this.y=t.y):(this.x=t,this.y=e),i._c&&(this.clamp(i._a,i._b,i._d,i._e),this.x=t,this.y=e)}set(t){this.x=t.x,this.y=t.y}add(t){return new X(this.x+t.x,this.y+t.y,this)}subtract(t){return new X(this.x-t.x,this.y-t.y,this)}scale(t){return new X(this.x*t,this.y*t)}normalize(t=this.length()||1){return new X(this.x/t,this.y/t)}dot(t){return this.x*t.x+this.y*t.y}length(){return Math.hypot(this.x,this.y)}distance(t){return Math.hypot(this.x-t.x,this.y-t.y)}angle(t){return Math.acos(this.dot(t)/(this.length()*t.length()))}direction(){return Math.atan2(this.y,this.x)}clamp(t,e,i,n){this._c=!0,this._a=t,this._b=e,this._d=i,this._e=n}get x(){return this._x}get y(){return this._y}set x(t){this._x=this._c?O(this._a,this._d,t):t}set y(t){this._y=this._c?O(this._b,this._e,t):t}};function P(){return new X(...arguments)}var C=class{constructor(t){return this.init(t)}init(t={}){this.position=P(),this.velocity=P(),this.acceleration=P(),this.ttl=1/0,Object.assign(this,t)}update(t){this.advance(t)}advance(t){let e=this.acceleration;t&&(e=e.scale(t)),this.velocity=this.velocity.add(e);let i=this.velocity;t&&(i=i.scale(t)),this.position=this.position.add(i),this._pc(),this.ttl--}get dx(){return this.velocity.x}get dy(){return this.velocity.y}set dx(t){this.velocity.x=t}set dy(t){this.velocity.y=t}get ddx(){return this.acceleration.x}get ddy(){return this.acceleration.y}set ddx(t){this.acceleration.x=t}set ddy(t){this.acceleration.y=t}isAlive(){return this.ttl>0}_pc(){}},S=class extends C{init({width:t=0,height:e=0,context:i=l(),render:n=this.draw,update:s=this.advance,children:o=[],anchor:a={x:0,y:0},opacity:r=1,rotation:c=0,scaleX:d=1,scaleY:u=1,...y}={}){this._c=[],super.init({width:t,height:e,context:i,anchor:a,opacity:r,rotation:c,scaleX:d,scaleY:u,...y}),this._di=!0,this._uw(),this.addChild(o),this._rf=n,this._uf=s,h("init",(()=>{this.context??=l()}))}update(t){this._uf(t),this.children.map((e=>e.update&&e.update(t)))}render(){let t=this.context;t.save(),(this.x||this.y)&&t.translate(this.x,this.y),this.rotation&&t.rotate(this.rotation),1==this.scaleX&&1==this.scaleY||t.scale(this.scaleX,this.scaleY);let e=-this.width*this.anchor.x,i=-this.height*this.anchor.y;(e||i)&&t.translate(e,i),this.context.globalAlpha=this.opacity,this._rf(),(e||i)&&t.translate(-e,-i),this.children.map((t=>t.render&&t.render())),t.restore()}draw(){}_pc(){this._uw(),this.children.map((t=>t._pc()))}get x(){return this.position.x}get y(){return this.position.y}set x(t){this.position.x=t,this._pc()}set y(t){this.position.y=t,this._pc()}get width(){return this._w}set width(t){this._w=t,this._pc()}get height(){return this._h}set height(t){this._h=t,this._pc()}_uw(){if(!this._di)return;let{_wx:t=0,_wy:e=0,_wo:i=1,_wr:n=0,_wsx:s=1,_wsy:o=1}=this.parent||{};this._wx=this.x,this._wy=this.y,this._ww=this.width,this._wh=this.height,this._wo=i*this.opacity,this._wsx=s*this.scaleX,this._wsy=o*this.scaleY,this._wx=this._wx*s,this._wy=this._wy*o,this._ww=this.width*this._wsx,this._wh=this.height*this._wsy,this._wr=n+this.rotation;let{x:h,y:a}=function(t,e){let i=Math.sin(e),n=Math.cos(e);return{x:t.x*n-t.y*i,y:t.x*i+t.y*n}}({x:this._wx,y:this._wy},n);this._wx=h,this._wy=a,this._wx+=t,this._wy+=e}get world(){return{x:this._wx,y:this._wy,width:this._ww,height:this._wh,opacity:this._wo,rotation:this._wr,scaleX:this._wsx,scaleY:this._wsy}}set children(t){this.removeChild(this._c),this.addChild(t)}get children(){return this._c}addChild(...t){t.flat().map((t=>{this.children.push(t),t.parent=this,t._pc=t._pc||i,t._pc()}))}removeChild(...t){t.flat().map((t=>{s(this.children,t)&&(t.parent=null,t._pc())}))}get opacity(){return this._opa}set opacity(t){this._opa=O(0,1,t),this._pc()}get rotation(){return this._rot}set rotation(t){this._rot=t,this._pc()}setScale(t,e=t){this.scaleX=t,this.scaleY=e}get scaleX(){return this._scx}set scaleX(t){this._scx=t,this._pc()}get scaleY(){return this._scy}set scaleY(t){this._scy=t,this._pc()}},F=class extends S{init({image:t,width:e=(t?t.width:void 0),height:i=(t?t.height:void 0),...n}={}){super.init({image:t,width:e,height:i,...n})}get animations(){return this._a}set animations(t){let e,i;for(e in this._a={},t)this._a[e]=t[e].clone(),i=i||this._a[e];this.currentAnimation=i,this.width=this.width||i.width,this.height=this.height||i.height}playAnimation(t){this.currentAnimation?.stop(),this.currentAnimation=this.animations[t],this.currentAnimation.start()}advance(t){super.advance(t),this.currentAnimation?.update(t)}draw(){this.image&&this.context.drawImage(this.image,0,0,this.image.width,this.image.height),this.currentAnimation&&this.currentAnimation.render({x:0,y:0,width:this.width,height:this.height,context:this.context}),this.color&&(this.context.fillStyle=this.color,this.context.fillRect(0,0,this.width,this.height))}};function I(){return new F(...arguments)}var U=new WeakMap,q={},D={},R={0:"left",1:"middle",2:"right"};function T(t,e){let{x:i,y:n,width:s,height:o}=L(t);do{i-=t.sx||0,n-=t.sy||0}while(t=t.parent);let h=e.x-Math.max(i,Math.min(e.x,i+s)),a=e.y-Math.max(n,Math.min(e.y,n+o));return h*h+a*a<e.radius*e.radius}function W(t,e){return parseFloat(t.getPropertyValue(e))||0}function B(t){let e=null!=t.button?R[t.button]:"left";D[e]=!0,K(t,"onDown")}function $(t){let e=null!=t.button?R[t.button]:"left";D[e]=!1,K(t,"onUp")}function H(t){K(t,"onOver")}function N(t){U.get(t.target)._oo=null,D={}}function z(t,e,i){let n=function(t){let e=t._lf.length?t._lf:t._cf;for(let i=e.length-1;i>=0;i--){let n=e[i];if(n.collidesWithPointer?n.collidesWithPointer(t):T(n,t))return n}}(t);n&&n[e]&&n[e](i),q[e]&&q[e](i,n),"onOver"==e&&(n!=t._oo&&t._oo&&t._oo.onOut&&t._oo.onOut(i),t._oo=n)}function K(t,e){t.preventDefault();let i=t.target,n=U.get(i),{scaleX:s,scaleY:o,offsetX:h,offsetY:r}=function(t){let{canvas:e,_s:i}=t,n=e.getBoundingClientRect(),s="none"!=i.transform?i.transform.replace("matrix(","").split(","):[1,1,1,1],o=parseFloat(s[0]),h=parseFloat(s[3]),a=(W(i,"border-left-width")+W(i,"border-right-width"))*o,r=(W(i,"border-top-width")+W(i,"border-bottom-width"))*h,c=(W(i,"padding-left")+W(i,"padding-right"))*o,l=(W(i,"padding-top")+W(i,"padding-bottom"))*h;return{scaleX:(n.width-a-c)/e.width,scaleY:(n.height-r-l)/e.height,offsetX:n.left+(W(i,"border-left-width")+W(i,"padding-left"))*o,offsetY:n.top+(W(i,"border-top-width")+W(i,"padding-top"))*h}}(n);t.type.includes("touch")?(Array.from(t.touches).map((({clientX:t,clientY:e,identifier:i})=>{let a=n.touches[i];a||(a=n.touches[i]={start:{x:(t-h)/s,y:(e-r)/o}},n.touches.length++),a.changed=!1})),Array.from(t.changedTouches).map((({clientX:i,clientY:c,identifier:l})=>{let d=n.touches[l];d.changed=!0,d.x=n.x=(i-h)/s,d.y=n.y=(c-r)/o,z(n,e,t),a("touchChanged",t,n.touches),"onUp"==e&&(delete n.touches[l],n.touches.length--,n.touches.length||a("touchEnd"))}))):(n.x=(t.clientX-h)/s,n.y=(t.clientY-r)/o,z(n,e,t))}function V(t){let e=t.canvas;t.clearRect(0,0,e.width,e.height)}function G({fps:t=60,clearCanvas:e=!0,update:n=i,render:s,context:o=l(),blur:r=!1}={}){if(!s)throw Error("You must provide a render() function");let c,d,u,y,x,p=0,f=1e3/t,g=1/t,_=e?V:i,w=!0;function m(){if(d=requestAnimationFrame(m),w&&(u=performance.now(),y=u-c,c=u,!(y>1e3))){for(a("tick"),p+=y;p>=f;)x.update(g),p-=f;_(x.context),x.render()}}return r||(window.addEventListener("focus",(()=>{w=!0})),window.addEventListener("blur",(()=>{w=!1}))),h("init",(()=>{x.context??=l()})),x={update:n,render:s,isStopped:!0,context:o,start(){c=performance.now(),this.isStopped=!1,requestAnimationFrame(m)},stop(){this.isStopped=!0,cancelAnimationFrame(d)},_frame:m,set _last(t){c=t}},x}var J={},Q={},Z={},tt={Enter:"enter",Escape:"esc",Space:"space",ArrowLeft:"arrowleft",ArrowUp:"arrowup",ArrowRight:"arrowright",ArrowDown:"arrowdown"};function et(t=i,e){t._pd&&e.preventDefault(),t(e)}function it(t){let e=tt[t.code],i=J[e];Z[e]=!0,et(i,t)}function nt(t){let e=tt[t.code],i=Q[e];Z[e]=!1,et(i,t)}function st(){Z={}}function ot(t){return!![].concat(t).some((t=>Z[t]))}function ht(t){let e=[];return t._dn?e.push(t._dn):t.children&&t.children.map((t=>{e=e.concat(ht(t))})),e}var at=class{constructor({id:t,name:e=t,objects:i=[],context:s=l(),cullObjects:o=!0,cullFunction:a=Y,sortFunction:r,...c}){this._o=[],Object.assign(this,{id:t,name:e,context:s,cullObjects:o,cullFunction:a,sortFunction:r,...c});let d=this._dn=document.createElement("section");d.tabIndex=-1,d.style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);",d.id=t,d.setAttribute("aria-label",e);let u=this;this.camera=new class extends S{set x(t){u.sx=t-this.centerX,super.x=t}get x(){return super.x}set y(t){u.sy=t-this.centerY,super.y=t}get y(){return super.y}}({context:s,anchor:{x:.5,y:.5},render:this._rf.bind(this)}),this.add(i),this._i=()=>{this.context??=l();let t=this.context.canvas,{width:e,height:i}=t,s=e/2,o=i/2;Object.assign(this.camera,{centerX:s,centerY:o,x:s,y:o,width:e,height:i}),this._dn.isConnected||n(this._dn,t)},this.context&&this._i(),h("init",this._i)}set objects(t){this.remove(this._o),this.add(t)}get objects(){return this._o}add(...t){t.flat().map((t=>{this._o.push(t),t.parent=this,ht(t).map((t=>{this._dn.appendChild(t)}))}))}remove(...t){t.flat().map((t=>{s(this._o,t),t.parent=null,ht(t).map((t=>{n(t,this.context)}))}))}show(){this.hidden=this._dn.hidden=!1;let t=this._o.find((t=>t.focus));t?t.focus():this._dn.focus(),this.onShow()}hide(){this.hidden=this._dn.hidden=!0,this.onHide()}destroy(){var t,e;t="init",e=this._i,o[t]=(o[t]||[]).filter((t=>t!=e)),this._dn.remove(),this._o.map((t=>t.destroy&&t.destroy()))}lookAt(t){let{x:e,y:i}=t.world||t;this.camera.x=e,this.camera.y=i}update(t){this.hidden||this._o.map((e=>e.update&&e.update(t)))}_rf(){let{_o:t,context:e,_sx:i,_sy:n,camera:s,sortFunction:o,cullObjects:h,cullFunction:a}=this;e.translate(i,n);let r=t;h&&(r=r.filter((t=>a(s,t)))),o&&r.sort(o),r.map((t=>t.render&&t.render()))}render(){if(!this.hidden){let{context:t,camera:e}=this,{x:i,y:n,centerX:s,centerY:o}=e;t.save(),this._sx=s-i,this._sy=o-n,t.translate(this._sx,this._sy),e.render(),t.restore()}}onShow(){}onHide(){}};function rt(){return new at(...arguments)}var{canvas:ct,context:lt}=function(i,{contextless:n=!1}={}){if(t=document.getElementById(i)||i||document.querySelector("canvas"),n&&(t=t||new Proxy({},r)),!t)throw Error("You must provide a canvas element for the game");return(e=t.getContext("2d")||new Proxy({},r)).imageSmoothingEnabled=!1,a("init"),{canvas:t,context:e}}();!function(){let t;for(t=0;t<26;t++)tt["Key"+String.fromCharCode(t+65)]=String.fromCharCode(t+97);for(t=0;t<10;t++)tt["Digit"+t]=tt["Numpad"+t]=""+t;window.addEventListener("keydown",it),window.addEventListener("keyup",nt),window.addEventListener("blur",st)}(),function({radius:t=5,canvas:e=c()}={}){let i=U.get(e);if(!i){let n=window.getComputedStyle(e);i={x:0,y:0,radius:t,touches:{length:0},canvas:e,_cf:[],_lf:[],_o:[],_oo:null,_s:n},U.set(e,i)}e.addEventListener("mousedown",B),e.addEventListener("touchstart",B),e.addEventListener("mouseup",$),e.addEventListener("touchend",$),e.addEventListener("touchcancel",$),e.addEventListener("blur",N),e.addEventListener("mousemove",H),e.addEventListener("touchmove",H),i._t||(i._t=!0,h("tick",(()=>{i._lf.length=0,i._cf.map((t=>{i._lf.push(t)})),i._cf.length=0})))}();var dt,ut,yt,xt,pt,ft=576,gt=576,_t=ct.width/2,wt=ct.height/2,mt=2.5,vt=1.45,bt=.8,jt=4.5,Mt=null;function kt(t){let e=[];for(let i=0;i<t.length;i++)if(t[i][0]<=ft&&t[i][1]<=gt&&t[i][0]>=0&&t[i][1]>=0){let n=I({x:t[i][0],y:t[i][1],width:32,height:32,color:"white"});e.push(n)}else"w"==t[i][0]&&(Mt=I({x:t[i][1][0],y:t[i][1][1],width:32,height:32,color:"yellow"}));return e}(function(...t){return A(),Promise.all(t.map((t=>{let e=v([].concat(t)[0]);return e.match(d)?function(t){return A(),new Promise(((e,i)=>{let n,s,o;if(n=m(f,t),j[n])return e(j[n]);s=new Image,s.onload=function(){o=w(n,window.location.href),j[b(t)]=j[n]=j[o]=this,a("assetLoaded",this,t),e(this)},s.onerror=function(){i("Unable to load image "+n)},s.src=n}))}(t):e.match(u)?function(t){return new Promise(((e,i)=>{let n,s,o,h,r=t;return n=new Audio,s=function(t){return{wav:t.canPlayType('audio/wav; codecs="1"'),mp3:t.canPlayType("audio/mpeg;"),ogg:t.canPlayType('audio/ogg; codecs="vorbis"'),aac:t.canPlayType("audio/aac;")}}(n),(t=[].concat(t).reduce(((t,e)=>t||(s[v(e)]?e:null)),0))?(o=m(g,t),M[o]?e(M[o]):(n.addEventListener("canplay",(function(){h=w(o,window.location.href),M[b(t)]=M[o]=M[h]=this,a("assetLoaded",this,t),e(this)})),n.onerror=function(){i("Unable to load audio "+o)},n.src=o,void n.load())):i("cannot play any of the audio formats provided "+r)}))}(t):function(t){let e,i;return A(),e=m(_,t),k[e]?Promise.resolve(k[e]):fetch(e).then((t=>{if(!t.ok)throw t;return t.clone().json().catch((()=>t.text()))})).then((n=>(i=w(e,window.location.href),"object"==typeof n&&p.set(n,i),k[b(t)]=k[e]=k[i]=n,a("assetLoaded",n,t),n)))}(t)})))})("assets/images/player.png","assets/images/map1.png","assets/images/enemy.png","assets/images/player2.png").then((function(t){let e=function(t){let e=[[]];for(let i=0;i<17;i++)for(let n=0;n<=17;n++)1==t[i][n]&&e.push([32*n,32*i]),2==t[i][n]&&e.push(["w",[32*n,32*i]]);return e}([[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1],[1,1,1,1,1,1,1,0,0,0,1,1,0,1,1,0,1],[1,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,1],[1,0,1,0,1,1,1,1,1,0,1,0,0,0,1,1,1],[1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,1],[1,0,0,0,1,0,1,1,1,1,1,0,1,0,1,0,1],[1,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1],[1,0,1,0,0,1,1,1,0,1,1,1,1,0,1,1,1],[1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,0,1,1,1,0,1,0,1,1,1,1,1,0,0,0,1],[1,0,1,0,0,0,1,0,0,0,0,0,1,0,1,0,1],[1,0,1,0,0,0,1,1,1,1,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,1,1,1,0,0,1,0,1,0,1],[1,0,1,0,1,0,1,0,0,0,1,1,1,0,1,0,1],[1,0,0,0,1,0,0,0,1,0,0,1,0,0,1,2,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]);console.log("coords ",e);let i=[];i=kt(e);let n=I({lives:4,x:52,y:52,image:t[0],attack_delay:.5,anchor:{x:.5,y:.5},time_alive:0,alive:function(){return this.lives>0},shoot:function(t,e){if(this.attack_delay<=0){let i=E(this,{x:t,y:e}),n=jt*Math.cos(i),s=jt*Math.sin(i),o=15*Math.cos(i),a=15*Math.sin(i);dt=I({x:this.x+o,y:this.y+a,dx:n,dy:s,width:5,height:10,anchor:{x:.5,y:.5},rotation:i+Math.PI/2,color:"red"}),h.add(dt),this.attack_delay=.5}}}),s=I({lives:4,direction:2,dx:1,dy:0,x:52,y:52,image:t[3],attack_delay:.7,ray_delay:.15,anchor:{x:.5,y:.5},time_alive:0,alive:function(){return this.lives>0},shoot_rays:function(){let t=this.direction*Math.PI/2,e=t-Math.PI/2.5,i=t+Math.PI/2.5;yt=I({x:this.x,y:this.y,dx:-3.5*Math.cos(e)*.9,dy:-3.5*Math.sin(e)*.9,color:"red",width:5,height:5,time_alive:0,collided:!1,changed:!1}),xt=I({x:this.x,y:this.y,dx:-3.5*Math.cos(t)*1,dy:-3.5*Math.sin(t)*1,color:"blue",width:5,height:5,time_alive:0,collided:!1,changed:!1}),pt=I({x:this.x,y:this.y,dx:-3.5*Math.cos(i)*.9,dy:-3.5*Math.sin(i)*.9,color:"yellow",width:5,height:5,time_alive:0,collided:!1,changed:!1}),h.add(yt),h.add(xt),h.add(pt)},shoot:function(){if(this.attack_delay<=0){let t=E(this,{x:n.x,y:n.y}),e=jt*Math.cos(t),i=jt*Math.sin(t),s=15*Math.cos(t),o=15*Math.sin(t);ut=I({x:this.x+s,y:this.y+o,dx:e,dy:i,width:5,height:10,anchor:{x:.5,y:.5},rotation:t+Math.PI/2,color:"blue"}),h.add(ut),this.attack_delay=.7}}}),o=I({x:0,y:0,image:t[1]}),h=rt({id:"game",objects:[o,Mt,n,s,...i]}),a=0,r=0,l=0,d=0,u=[],y=[];for(let t=0;t<17;t++)for(let e=0;e<17;e++){let i=I({x:32*e,y:32*t,width:32,height:32,toggle:!1});y.push(i)}let x=I({x:0,y:0,anchor:{x:.5,y:.5},color:"red",width:8,height:8}),p=rt({id:"map",objects:[o,...y,x]});p.hide();const f=G({update:function(t){console.log("update 2"),p.lookAt(x),ot("w")&&(x.y-=mt),ot("s")&&(x.y+=mt),ot("a")&&(x.x-=mt),ot("d")&&(x.x+=mt),x.x>ft-x.width&&(x.x=ft-x.width),x.x<0&&(x.x=0),x.y>gt-x.height&&(x.y=gt-x.height),x.y<0&&(x.y=0),ot("space")&&(f.stop(),y.forEach((function(t){t.toggle?(u.push([t.x,t.y]),console.log("sprite x",t.x),console.log("sprite y",t.y)):"w"==t.toggle&&u.push(["w",[t.x,t.y]])})),alert("Level created!"),p.hide(),h.show(),i=null,console.log("new map coords",u),i=kt(u),g.start());for(let t=0;t<y.length;t++)Y(x,y[t])&&(ot("j")&&(y[t].toggle=!0),ot("k")&&(y[t].toggle=!1),ot("l")&&(y[t].toggle="w")),y[t].toggle?y[t].color="white":"w"==y[t].toggle?y[t].color="yellow":y[t].color=null;p.update()},render:function(){p.render()}}),g=G({update:function(t){if(console.log("update 1"),n.attack_delay-=t,s.attack_delay-=t,s.ray_delay-=t,n.time_alive+=t,s.time_alive+=t,yt&&(yt.time_alive+=t),xt&&(xt.time_alive+=t),pt&&(pt.time_alive+=t),h.lookAt(n),ot("w")&&(n.y-=vt),ot("s")&&(n.y+=vt),ot("a")&&(n.x-=vt),ot("d")&&(n.x+=vt),n.x>o.width-n.width&&(n.x=o.width-n.width),n.x<0&&(n.x=0),n.y>o.height-n.height&&(n.y=o.height-n.height),n.y<0&&(n.y=0),n.alive()||(g.stop(),alert("You lost"),window.location.reload()),(Y(n,Mt)||ot("u"))&&(g.stop(),n.x=0,n.y=0,alert("You won"),i.forEach((function(t){let e=h.objects.indexOf(t);e>-1&&h.objects.splice(e,1)})),h.hide(),p.show(),f.start()),i.forEach((function(t){if(Y(n,t)&&(n.time_alive<1&&(console.log("1 collided"),n.x=Math.floor(Math.random()*ft),n.y=Math.floor(Math.random()*gt),n.time_alive=0),n.x=a,n.y=r),Y(s,t)&&(s.time_alive<1&&(console.log("2 collided"),s.x=Math.floor(Math.random()*ft),s.y=Math.floor(Math.random()*gt),s.time_alive=0),s.x=l,s.y=d),dt&&Y(dt,t)){let t=h.objects.indexOf(dt);t>-1&&h.objects.splice(t,1),dt=null}if(ut&&Y(ut,t)){let t=h.objects.indexOf(ut);t>-1&&h.objects.splice(t,1),ut=null}yt&&Y(yt,t)&&(yt.collided=!0),xt&&Y(xt,t)&&(xt.collided=!0),pt&&Y(pt,t)&&(pt.collided=!0)})),a=n.x,r=n.y,l=s.x,d=s.y,s.ray_delay<=0&&s.alive()&&(s.shoot_rays(),s.ray_delay=.15),yt&&yt.time_alive>=.1){let t=h.objects.indexOf(yt);t>-1&&h.objects.splice(t,1)}if(xt&&xt.time_alive>=.1){let t=h.objects.indexOf(xt);t>-1&&h.objects.splice(t,1)}if(pt&&pt.time_alive>=.1){let t=h.objects.indexOf(pt);t>-1&&h.objects.splice(t,1)}if(s.alive()){switch(yt&&yt.collided&&!yt.changed?(yt.changed=!0,xt.collided&&!xt.changed&&(xt.changed=!0,pt.collided?(s.direction+=1,yt.changed=!1,xt.changed=!1):pt.collided||(s.direction-=1,yt.changed=!1,xt.changed=!1))):!yt||yt.collided||yt.changed||xt.collided&&!xt.changed&&(xt.changed=!0,pt.collided&&!pt.changed?(pt.changed=!0,s.direction-=1,yt.changed=!1,xt.changed=!1):pt.collided||(s.direction+=1,yt.changed=!1,xt.changed=!1)),s.direction>4&&(s.direction=1),s.direction<1&&(s.direction=4),s.direction){case 1:s.dx=0,s.dy=-.8;break;case 2:s.dx=bt,s.dy=0;break;case 3:s.dx=0,s.dy=bt;break;case 4:s.dx=-.8,s.dy=0}s.attack_delay<=0&&(e=n.x,u=n.y,y=s.x,x=s.y,Math.sqrt((y-e)**2+(x-u)**2)<90)&&s.shoot()}var e,u,y,x,_,w,m,v;if(D["left"]&&n.attack_delay<=0){const{x:t,y:e}=function(t=c()){return U.get(t)}(),{relative_x:i,relative_y:s}=(_=n.x,w=n.y,m=t,v=e,{relative_x:_+(m-=_t),relative_y:w+(v-=wt)});n.shoot(i,s)}if(dt&&Y(dt,s))if(s.alive()){s.lives-=1;let t=h.objects.indexOf(dt);if(t>-1&&h.objects.splice(t,1),dt=null,!s.alive()){let t=h.objects.indexOf(s);t>-1&&h.objects.splice(t,1)}}else{let t=h.objects.indexOf(s);t>-1&&h.objects.splice(t,1)}if(ut&&Y(ut,n)){n.lives-=1;let t=h.objects.indexOf(ut);if(t>-1&&h.objects.splice(t,1),ut=null,!n.alive()){let t=h.objects.indexOf(n);t>-1&&h.objects.splice(t,1)}}if(dt&&(dt.y<0||dt.y>gt||dt.x<0||dt.x>ft)){let t=h.objects.indexOf(dt);t>-1&&h.objects.splice(t,1),dt=null}if(ut&&(ut.y<0||ut.y>gt||ut.x<0||ut.x>ft)){let t=h.objects.indexOf(ut);t>-1&&h.objects.splice(t,1),ut=null}h.update()},render:function(){h.render()}});g.start()}))})();
/**
 * @preserve
 * Kontra.js v9.0.0
 */