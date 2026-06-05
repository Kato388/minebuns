(()=>{
// ===================== EVENT BUS =====================
var c={listeners:{},activeKeys:new Set,on:function(r,e){this.listeners[r]||(this.listeners[r]=[]),this.listeners[r].push(e)},remove:function(r,e){this.listeners[r]&&(this.listeners[r]=this.listeners[r].filter(t=>t!==e))},emit:function(r,e){this.listeners[r]&&this.listeners[r].forEach(t=>t(e))},trackKey:function(r,e,t){r==="keydown"&&moduleManager.handleKeyPress(t),r==="keydown"&&!this.activeKeys.has(e)&&(this.activeKeys.add(e),this.emit("keyPress",{key:e,code:t})),r==="keyup"&&this.activeKeys.has(e)&&(this.activeKeys.delete(e),this.emit("keyRelease",{key:e,code:t}))}};

// ===================== BASE MODULE =====================
var a=class{constructor(e,t,i,s){this.name=e,this.category=t,this.options=i,this.keybind=s,this.waitingForBind=false,this.isEnabled=false,this.toggle=this.toggle.bind(this)}onEnable(){}onDisable(){}onRender(){}onSettingUpdate(){}enable(){this.isEnabled=true,c.emit("module.update",this),this.onEnable()}disable(){this.isEnabled=false,c.emit("module.update",this),this.onDisable()}toggle(){this.isEnabled?this.disable():this.enable()}};

// ===================== CSS (黒背景 + 緑テーマ) =====================
var mbCSS=`
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
:root{
  --mb-bg:rgba(0,0,0,0.96);
  --mb-border:rgba(0,255,80,0.28);
  --mb-accent1:#00ff50;
  --mb-accent2:#80ffb0;
  --mb-glow:rgba(0,255,80,0.4);
  --mb-text:#b0ffcc;
  --mb-dim:rgba(100,220,140,0.5);
  --mb-btn:rgba(0,8,4,0.95);
  --mb-hover:rgba(0,30,15,0.97);
  --mb-on:rgba(0,50,22,0.97);
  --mb-w:195px;
  --Minebuns-accent-color:linear-gradient(90deg,#00ff50 0%,#80ffb0 100%);
}
.gui-panel{
  position:fixed;z-index:1000;width:var(--mb-w);
  background:var(--mb-bg);
  border:1px solid var(--mb-border);
  box-shadow:0 0 18px var(--mb-glow),inset 0 0 40px rgba(0,255,80,0.02);
  font-family:'Orbitron','Courier New',monospace;
  color:var(--mb-text);
  clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));
}
.gui-corner{position:absolute;width:7px;height:7px;border-color:var(--mb-accent1);border-style:solid;pointer-events:none;z-index:5;}
.gui-corner-tl{top:-1px;left:-1px;border-width:2px 0 0 2px;}
.gui-corner-tr{top:-1px;right:-1px;border-width:2px 2px 0 0;}
.gui-corner-bl{bottom:-1px;left:-1px;border-width:0 0 2px 2px;}
.gui-corner-br{bottom:-1px;right:-1px;border-width:0 2px 2px 0;}
.gui-header{
  position:relative;height:40px;display:flex;align-items:center;
  justify-content:center;gap:6px;font-size:11px;font-weight:900;
  letter-spacing:4px;cursor:grab;
  background:linear-gradient(180deg,rgba(0,255,80,0.1) 0%,rgba(0,255,80,0.02) 100%);
  border-bottom:1px solid var(--mb-border);overflow:hidden;
  color:var(--mb-accent1);text-shadow:0 0 10px var(--mb-glow);
  user-select:none;
}
.gui-header:active{cursor:grabbing;}
.gui-header-scan{
  position:absolute;left:0;top:0;width:100%;height:2px;
  background:linear-gradient(90deg,transparent,var(--mb-accent1),transparent);
  animation:mbScan 3.5s linear infinite;opacity:0.45;
}
@keyframes mbScan{0%{transform:translateY(0);opacity:.7}49%{transform:translateY(40px);opacity:.15}50%{transform:translateY(0);opacity:0}100%{transform:translateY(0);opacity:.7}}
.gui-button-container{background:var(--mb-bg);display:flex;flex-direction:column;border-bottom:1px solid rgba(0,255,80,0.07);}
.gui-button{
  position:relative;height:32px;display:flex;align-items:center;
  padding:0 10px;gap:8px;box-sizing:border-box;cursor:pointer;
  transition:background .15s,color .15s;
  font-size:10px;font-weight:700;letter-spacing:1.5px;
  outline:none;background:var(--mb-btn);color:var(--mb-dim);overflow:hidden;
}
.gui-button-name{flex:1;text-transform:uppercase;letter-spacing:1.5px;pointer-events:none;}
.gui-button-key{font-size:8px;color:rgba(0,255,80,0.3);font-family:'Share Tech Mono',monospace;letter-spacing:0;pointer-events:none;flex-shrink:0;}
.gui-button-dot{width:5px;height:5px;border-radius:50%;background:rgba(0,255,80,0.1);border:1px solid rgba(0,255,80,0.2);flex-shrink:0;transition:background .15s,box-shadow .15s;pointer-events:none;}
.gui-button-glow{position:absolute;left:0;top:0;width:2px;height:100%;background:transparent;transition:background .15s;pointer-events:none;}
.gui-button:not(.enabled):hover{background:var(--mb-hover);color:var(--mb-text);}
.gui-button:not(.enabled):hover .gui-button-glow{background:rgba(0,255,80,0.2);}
.gui-button.enabled{background:var(--mb-on);color:var(--mb-accent1);box-shadow:inset 0 0 14px rgba(0,255,80,0.08);}
.gui-button.enabled .gui-button-dot{background:var(--mb-accent1);box-shadow:0 0 6px var(--mb-accent1);}
.gui-button.enabled .gui-button-key{color:rgba(0,255,80,0.55);}
.gui-button.enabled .gui-button-glow{background:linear-gradient(180deg,var(--mb-accent1),var(--mb-accent2));box-shadow:0 0 6px var(--mb-glow);}
.gui-setting-container{
  display:flex;align-items:center;justify-content:space-between;
  background:rgba(0,5,2,0.98);padding:4px 10px 4px 14px;
  border-left:2px solid rgba(0,255,80,0.15);
}
.gui-setting-label{font-size:9px;font-family:'Share Tech Mono',monospace;letter-spacing:1px;color:var(--mb-dim);text-transform:uppercase;}
.gui-checkbox{width:14px;height:14px;border-radius:2px;background:rgba(0,255,80,0.05);border:1px solid rgba(0,255,80,0.25);position:relative;margin:5px;cursor:pointer;transition:all .2s;flex-shrink:0;}
.gui-checkbox.enabled{background:var(--mb-accent1);box-shadow:0 0 8px var(--mb-glow);border-color:var(--mb-accent1);}
.gui-checkbox.enabled::after{content:'x';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:9px;color:#000;font-weight:900;line-height:1;}
.gui-color-picker{width:14px;height:14px;border-radius:3px;position:relative;margin:5px;cursor:pointer;border:1px solid rgba(0,255,80,0.35);}
.gui-color-input{width:20px;height:20px;opacity:0;cursor:pointer;}
.gui-text-input{
  background:rgba(0,255,80,0.05);border:1px solid rgba(0,255,80,0.2);
  color:var(--mb-accent1);font-family:'Share Tech Mono',monospace;
  font-size:10px;width:50px;border-radius:2px;outline:none;
  transition:all .2s;text-align:center;margin:4px;margin-right:0;
  padding:2px 4px;letter-spacing:1px;
}
.gui-text-input:hover,.gui-text-input:focus{background:rgba(0,255,80,0.1);border-color:var(--mb-accent1);box-shadow:0 0 6px var(--mb-glow);}
.gui-background{position:fixed;left:0;top:0;z-index:999;height:100%;width:100%;backdrop-filter:blur(10px);background:rgba(0,0,0,0.6);}
.mb-wm-bracket{color:rgba(0,255,80,0.3);}
.mb-wm-text{background:linear-gradient(90deg,#00ff50,#80ffb0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.mb-wm-ver{color:rgba(0,255,80,0.75);font-size:9px;margin-left:6px;}
.mb-wm-time{color:rgba(0,255,80,0.7);font-family:'Share Tech Mono',monospace;font-size:11px;margin-left:10px;letter-spacing:2px;}
.mb-wm-credit{color:rgba(0,255,80,0.28);font-family:'Share Tech Mono',monospace;font-size:7px;margin-left:14px;letter-spacing:2px;font-style:italic;}
.with-animations .gui-panel{animation:mbPanelIn .2s cubic-bezier(.4,0,.2,1);}
@keyframes mbPanelIn{from{opacity:0;transform:translateY(-6px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
.with-animations .gui-setting-container{animation:mbSlideIn .16s ease-out forwards;}
@keyframes mbSlideIn{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:translateX(0)}}
`;
(function(){let s=document.createElement("style");s.textContent=mbCSS;document.head.appendChild(s);})();

// ===================== ARRAYLIST =====================
var v=class extends a{
  constructor(){super("Arraylist","Visual");this.namesMap={};this.arraylistContainer=null;this.initialized=false;}
  update(name,show){
    if(show){
      if(!this.namesMap[name]){
        let el=document.createElement("div");
        el.style.cssText="background:rgba(0,0,0,0.88);color:#b0ffcc;padding:3px 14px 3px 10px;display:flex;align-items:center;box-sizing:border-box;margin:1px 0;font-family:'Orbitron','Courier New',monospace;transition:max-height .18s ease,opacity .18s ease;overflow:hidden;max-height:0;opacity:0;border-left:2px solid #00ff50;clip-path:polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%);";
        let sp=document.createElement("span");
        sp.style.cssText="font-weight:700;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;background:linear-gradient(90deg,#00ff50,#80ffb0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;";
        sp.textContent=name;el.appendChild(sp);
        this.arraylistContainer.appendChild(el);
        setTimeout(()=>{el.style.maxHeight="38px";el.style.opacity="1";},1);
        this.namesMap[name]=el;
      }
    } else if(this.namesMap[name]){
      let el=this.namesMap[name];
      el.style.maxHeight="0";el.style.opacity="0";
      setTimeout(()=>{if(el.parentNode)el.parentNode.removeChild(el);delete this.namesMap[name];},200);
    }
    let sorted=Object.values(this.namesMap).sort((a,b)=>b.getBoundingClientRect().width-a.getBoundingClientRect().width);
    this.arraylistContainer.innerHTML="";
    sorted.forEach(el=>this.arraylistContainer.appendChild(el));
  }
  onEnable(){
    if(this.initialized){this.arraylistContainer.style.opacity="1";return;}
    this.arraylistContainer=document.createElement("div");
    this.arraylistContainer.style.cssText="flex-direction:column;position:fixed;z-index:1000;display:flex;right:8px;top:8px;align-items:flex-end;pointer-events:none;";
    document.body.appendChild(this.arraylistContainer);
    c.on("module.update",e=>{this.update(e.name,e.isEnabled);});
    this.initialized=true;
  }
  onDisable(){if(this.arraylistContainer)this.arraylistContainer.style.opacity="0";}
};

// ===================== WATERMARK + 時刻 =====================
var k=class extends a{
  constructor(){super("Watermark","Visual",{Text:"MinebunsX"});this._clockInterval=null;}
  _getTime(){let d=new Date();return[d.getHours(),d.getMinutes(),d.getSeconds()].map(n=>String(n).padStart(2,"0")).join(":");}
  _updateClock(){let el=document.querySelector(".mb-wm-time");if(el)el.textContent=this._getTime();}
  onSettingUpdate(){let e=document.querySelector(".mb-watermark");if(e)e.querySelector(".mb-wm-text").textContent=this.options.Text;}
  onEnable(){
    let e=document.querySelector(".mb-watermark");
    if(!e){
      e=document.createElement("div");e.className="mb-watermark";
      e.style.cssText="position:fixed;top:0;left:0;padding:5px 18px;user-select:none;z-index:1000;font-family:'Orbitron','Courier New',monospace;font-size:16px;font-weight:900;letter-spacing:4px;background:rgba(0,0,0,0.85);border-bottom:1px solid rgba(0,255,80,0.22);border-right:1px solid rgba(0,255,80,0.1);clip-path:polygon(0 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%);display:flex;align-items:center;gap:0;";
      e.innerHTML=`<span class="mb-wm-bracket">[</span><span class="mb-wm-text">${this.options.Text}</span><span class="mb-wm-bracket">]</span><span class="mb-wm-ver">v1.3</span><span class="mb-wm-time">${this._getTime()}</span><span class="mb-wm-credit">Design. hidemasa</span>`;
      document.body.appendChild(e);
    }
    e.style.display="flex";
    if(this._clockInterval)clearInterval(this._clockInterval);
    this._clockInterval=setInterval(()=>this._updateClock(),1000);
  }
  onDisable(){let e=document.querySelector(".mb-watermark");if(e)e.style.display="none";if(this._clockInterval)clearInterval(this._clockInterval);}
};

// ===================== SETTINGS =====================
var E=class{
  constructor(mod,container){this.module=mod;this.container=container;this.components=[];this.initialized=false;this.isOpen=false;}
  initialize(){
    if(this.initialized||!this.module?.options)return;
    Object.keys(this.module.options).forEach(key=>{
      let val=this.module.options[key],typ=typeof val;
      if(key.toLowerCase().includes("color"))this.addColorPicker(key);
      else if(typ==="boolean"||val==="true"||val==="false")this.addCheckbox(key);
      else if(typ==="string")this.addStringInput(key);
      else this.addNumberInput(key);
    });
    this.components.forEach(el=>el.style.display="none");
    this.initialized=true;
  }
  toggle(){
    this.isOpen=!this.isOpen;
    this.components.forEach(el=>el.style.display=this.isOpen?"flex":"none");
    this.container.style.marginBottom=this.isOpen?"3px":"0";
  }
  _wrap(label){
    let wrap=document.createElement("div");wrap.className="gui-setting-container";
    let lbl=document.createElement("span");lbl.className="gui-setting-label";lbl.textContent=label;
    wrap.appendChild(lbl);this.container.appendChild(wrap);this.components.push(wrap);
    return wrap;
  }
  addNumberInput(key){
    let wrap=this._wrap(key);
    let inp=document.createElement("input");inp.type="text";inp.className="gui-text-input";inp.value=this.module.options[key];
    let prev=inp.value;
    inp.addEventListener("input",()=>{let v=inp.value.trim();if(!isNaN(v)&&v!==""){prev=v;this.module.options[key]=v;c.emit("setting.update",this.module);}});
    inp.addEventListener("blur",()=>{if(isNaN(inp.value)||inp.value.trim()==="")inp.value=prev;});
    inp.addEventListener("keydown",e=>{if(e.key==="Enter")inp.blur();e.stopPropagation();});
    wrap.appendChild(inp);
  }
  addStringInput(key){
    let wrap=this._wrap(key);
    let inp=document.createElement("input");inp.type="text";inp.className="gui-text-input";inp.style.width="70px";inp.value=this.module.options[key];
    inp.addEventListener("input",()=>{this.module.options[key]=inp.value.trim();c.emit("setting.update",this.module);});
    inp.addEventListener("keydown",e=>e.stopPropagation());
    wrap.appendChild(inp);
  }
  addCheckbox(key){
    let wrap=this._wrap(key);
    let cb=document.createElement("div");cb.className="gui-checkbox";
    cb.classList.toggle("enabled",this.module.options[key]===true||this.module.options[key]==="true");
    cb.addEventListener("click",()=>{let on=cb.classList.contains("enabled");cb.classList.toggle("enabled");this.module.options[key]=(!on).toString();c.emit("setting.update",this.module);});
    wrap.appendChild(cb);
  }
  addColorPicker(key){
    let wrap=this._wrap(key);
    let swatch=document.createElement("div");swatch.className="gui-color-picker";swatch.style.background=this.module.options[key];
    let inp=document.createElement("input");inp.type="color";inp.className="gui-color-input";swatch.appendChild(inp);
    inp.addEventListener("input",e=>{swatch.style.background=e.target.value;this.module.options[key]=e.target.value;c.emit("setting.update",this.module);});
    swatch.addEventListener("click",()=>inp.click());
    wrap.appendChild(swatch);
  }
};

// ===================== PANEL =====================
var S=class{
  constructor(title,pos={top:"200px",left:"200px"}){
    this.panel=document.createElement("div");this.panel.className="gui-panel";
    this.panel.style.top=pos.top;this.panel.style.left=pos.left;

    this.header=document.createElement("div");this.header.className="gui-header";
    let ttl=document.createElement("span");ttl.textContent=title.toUpperCase();ttl.dataset.category=title;ttl.style.letterSpacing="4px";
    let scan=document.createElement("div");scan.className="gui-header-scan";
    this.header.appendChild(ttl);this.header.appendChild(scan);
    this.panel.appendChild(this.header);

    ["tl","tr","bl","br"].forEach(p=>{let c2=document.createElement("div");c2.className=`gui-corner gui-corner-${p}`;this.panel.appendChild(c2);});
    document.body.appendChild(this.panel);
    this.buttons=[];
    this._setupDrag();
  }
  _setupDrag(){
    let dragging=false,ox=0,oy=0;
    this.header.addEventListener("mousedown",e=>{dragging=true;ox=e.clientX-this.panel.offsetLeft;oy=e.clientY-this.panel.offsetTop;});
    document.addEventListener("mousemove",e=>{if(dragging){this.panel.style.left=(e.clientX-ox)+"px";this.panel.style.top=(e.clientY-oy)+"px";}});
    document.addEventListener("mouseup",()=>dragging=false);
  }
  // keybind ラベル表示用マップ
  static keyLabels={"KeyG":"G","KeyK":"K","KeyF":"F","KeyC":"C","KeyI":"I","KeyH":"H","KeyJ":"J","KeyL":"L","ShiftRight":"SHIFT"};
  addButton(mod){
    let wrap=document.createElement("div");wrap.className="gui-button-container";
    let btn=document.createElement("div");btn.className="gui-button"+(mod.isEnabled?" enabled":"");

    let dot=document.createElement("span");dot.className="gui-button-dot";
    let nameEl=document.createElement("span");nameEl.className="gui-button-name";nameEl.textContent=mod.name;
    let keyEl=document.createElement("span");keyEl.className="gui-button-key";
    if(mod.keybind&&S.keyLabels[mod.keybind])keyEl.textContent="["+S.keyLabels[mod.keybind]+"]";
    let glow=document.createElement("div");glow.className="gui-button-glow";

    btn.appendChild(dot);btn.appendChild(nameEl);btn.appendChild(keyEl);btn.appendChild(glow);

    let settings=new E(mod,wrap);
    btn.addEventListener("mousedown",e=>{
      if(e.button===0){mod.toggle();btn.classList.toggle("enabled",mod.isEnabled);}
      if(e.button===1){nameEl.textContent="PRESS KEY...";mod.waitingForBind=true;}
    });
    btn.addEventListener("contextmenu",e=>{e.preventDefault();settings.initialize();settings.toggle();});
    btn.setAttribute("tabindex",-1);
    btn.addEventListener("keydown",e=>{
      nameEl.textContent=mod.name;
      if(mod.waitingForBind){
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
        mod.keybind=e.key==="Escape"?null:String(e.code);
        mod.waitingForBind=false;
        keyEl.textContent=mod.keybind&&S.keyLabels[mod.keybind]?"["+S.keyLabels[mod.keybind]+"]":"";
      }
    });
    wrap.appendChild(btn);this.panel.appendChild(wrap);this.buttons.push(btn);
    return btn;
  }
  show(){this.panel.style.display="block";}
  hide(){this.panel.style.display="none";}
};

// ===================== GAME HOOKS =====================
var o={
  get stores(){if(this._stores)return this._stores;let r=app._vnode.component.appContext.provides;let sym=Object.getOwnPropertySymbols(r).find(t=>r[t]._s);return this._stores=r[sym]._s;},
  get gameWorld(){return this.stores.get("gameState").gameWorld;}
};
var x={
  distanceBetween(a,b){let dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;return dx*dx+dy*dy+dz*dz;},
  calculateDistance(a,b){return Math.hypot(b.x-a.x,b.y-a.y,b.z-a.z);},
  calculateDistanceArr(a,b){return Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);}
};
var m={
  getClosestPlayer(){let pos=o.gameWorld.player.position,players=o.gameWorld.server.players,list=[];players.forEach((p,id)=>{let d=x.distanceBetween(pos,{x:p._model.position.x,y:p._model.position.y,z:p._model.position.z});p.id=id;list.push({player:p,distance:d});});list.sort((a,b)=>a.distance-b.distance);return list.map(i=>i.player)[0];},
  hexToRgb(hex){let r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);return r?{r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)}:null;},
  getCssRule(sel){for(let ss of document.styleSheets){try{for(let r of ss.cssRules||[])if(r.selectorText?.includes(sel))return r;}catch(e){}}return null;},
  openOtherItem(id){let pos=Object.values(o.gameWorld.player.position).map(Math.floor);let sys=o.gameWorld.systemsManager.activeSystems.find(s=>s?.openOtherItem);o.stores.get("inventoryState").setBackpackStates(0);setTimeout(()=>{sys.openOtherItem(pos,id);},100);}
};

// ===================== PACKET SYSTEM =====================
var p={
  toServer:{TIME_STEP_INFO:1,REQUEST_RESPAWN:4,GOT_DAMAGE:27,PARKOUR_REQUEST_RESPAWN:1004,ONE_BLOCK_REQUEST_RESPAWN:1552,BED_WARS_REQUEST_RESPAWN:1600,SANDBOX_REQUEST_RESPAWN:1700},
  toClient:{SET_WALK_MODE:41,SET_INVISIBLE_MODE:42},
  listeners:{},
  packetListener(id,data){Object.values(this.listeners).forEach(fn=>{let r=fn(id,data);if(r!=null)data=r;});o.gameWorld.server.msgsToSend.push(id,data);},
  init(){c.on("render",()=>{if(o?.gameWorld?.server?.sendData)o.gameWorld.server.sendData=this.packetListener.bind(this);});}
};

// ===================== MODULES =====================
var C2=class extends a{constructor(){super("Airjump","Movement",null);}onRender(){if(o?.gameWorld?.player)o.gameWorld.player.collision.isGrounded=true;}};
var W=class extends a{constructor(){super("Instabreak","Misc",null,"KeyI");this.originalHardness=new Map;}onEnable(){Object.values(o.gameWorld.items).forEach(i=>{if(i?.destruction){if(!this.originalHardness.has(i))this.originalHardness.set(i,i.destruction.durability);i.destruction.durability=0;}});}onDisable(){Object.values(o.gameWorld.items).forEach(i=>{if(i?.destruction&&this.originalHardness.has(i))i.destruction.durability=this.originalHardness.get(i);});}};
var w=class extends a{constructor(){super("Nuker","Misc",{Radius:4,Delay:120,"Target Selected Block":false,"Auto Disable":false});this.blockIndex=0;}get selectedBlock(){return o.gameWorld?.systemsManager.activeExecuteSystems.find(e=>e?.currBlockPos!==undefined)||undefined;}onDisable(){this.blockIndex=0;}onEnable(){this.blockIndex=0;let R=this.options.Radius,pos=Object.values(o.gameWorld.player.position).map(Math.floor);pos[1]--;if(this.options["Target Selected Block"]&&this.selectedBlock)pos=[...this.selectedBlock.currBlockPos];let blocks=[];for(let ix=-R;ix<=R;ix++)for(let iy=-R;iy<=R;iy++)for(let iz=-R;iz<=R;iz++){if(Math.sqrt(ix*ix+iy*iy+iz*iz)<=R){let bp=[pos[0]+ix,pos[1]+iy,pos[2]+iz];if(o.gameWorld.chunkManager.getBlock(...bp)!==0)blocks.push(bp);}}let self=this,opts=this.options;function next(){if(!self.isEnabled)return;if(self.blockIndex<blocks.length){let[x,y,z]=blocks[self.blockIndex];setTimeout(()=>{if(self.isEnabled){o.gameWorld.chunkManager.setBlock(x,y,z,0,true);self.blockIndex++;next();}},opts.Delay);}else{self.blockIndex=0;opts["Auto Disable"]?self.disable():self.isEnabled&&self.onEnable();}}next();}};
var B=class extends a{constructor(){super("AdBypass","Misc");}onEnable(){this._reward=this._reward||o.stores.get("adsStore").rewardCommercialVideoWrapper;o.stores.get("adsStore").rewardCommercialVideoWrapper=()=>true;}onDisable(){o.stores.get("adsStore").rewardCommercialVideoWrapper=()=>this._reward;}};

// Fly: Fキー
var I=class extends a{constructor(){super("Fly","Movement",{"Vertical Speed":5},"KeyF");}onRender(){if(!o?.gameWorld?.player)return;o.gameWorld.player.velocity.gravity=0;if(o.gameWorld.player.inputs.jump)o.gameWorld.player.velocity.velVec3.y=this.options["Vertical Speed"];else if(o.gameWorld.player.inputs.crouch)o.gameWorld.player.velocity.velVec3.y=-this.options["Vertical Speed"];else o.gameWorld.player.velocity.velVec3.y=0;}onDisable(){if(o?.gameWorld?.player)o.gameWorld.player.velocity.gravity=23;}};

var P=class extends a{constructor(){super("Speed","Movement",{Speed:15});}onRender(){if(!o?.gameWorld?.player)return;o.gameWorld.player.velocity.moveSpeed=this.options.Speed;o.gameWorld.player.velocity.fastMoveSpeed=this.options.Speed;}onDisable(){if(o?.gameWorld?.player){o.gameWorld.player.velocity.moveSpeed=4.5;o.gameWorld.player.velocity.fastMoveSpeed=6.4;}}};
var A=class extends a{constructor(){super("FreeHeadcoins","Misc");}async onEnable(){let e=await o.network.get("users/freeSpinner");o.stores.get("userState").user.balance.headcoins+=e.data.amount;h.modules.FreeHeadcoins.disable();}};
var Fl=class extends a{constructor(){super("Fill","Misc",{Radius:4,"Block ID":652,"Chunk Interval":500});this.lastExecutionTime=0;}onRender(){if(!o?.gameWorld?.player)return;let R=this.options.Radius,interval=this.options["Chunk Interval"],now=Date.now();if(now-this.lastExecutionTime<interval)return;this.lastExecutionTime=now;let pos=Object.values(o.gameWorld.player.position).splice(0,3).map(Math.floor);for(let ix=-R;ix<=R;ix++)for(let iy=-R;iy<=R;iy++)for(let iz=-R;iz<=R;iz++){let[bx,by,bz]=[pos[0]+ix,pos[1]+iy,pos[2]+iz];if(o.gameWorld.chunkManager.getBlock(bx,by,bz)==0)o.gameWorld.chunkManager.setBlock(bx,by,bz,this.options["Block ID"],true,true);}}};

// Chams: Cキー
var D=class extends a{constructor(){super("Chams","Visual",null,"KeyC");}onRender(){if(!o?.gameWorld?.player)return;o.gameWorld.server.players.forEach(p=>{p.playerMaterial.depthTest=false;p.playerMaterial.wireframe=true;});}onDisable(){o.gameWorld.server.players.forEach(p=>{p.playerMaterial.depthTest=true;p.playerMaterial.wireframe=false;});}};

var R2=class extends a{constructor(){super("Scaffold","Movement",null);}onRender(){if(!o?.gameWorld?.player)return;let pos=Object.values(o.gameWorld.player.position).splice(0,3).map(Math.floor);pos[1]--;let itemId=o.gameWorld.player.currentInventoryItemId;let blockId=o.gameWorld.chunkManager.getBlock(...pos);let replaceable=o.gameWorld.items[blockId]?.replaceable||false;if((blockId==0||replaceable)&&itemId)o.gameWorld.chunkManager.setBlock(...pos,itemId,true,true);}};

// Killaura: Kキー
var T=class extends a{constructor(){super("Killaura","Combat",{"Y Offset":1.62,Reach:999999,Delay:0},"KeyK");this.lastExecutionTime=null;}onRender(){let now=Date.now();if(!o?.gameWorld?.player||now-this.lastExecutionTime<this.options.Delay)return;this.lastExecutionTime=now;this.tryKill();}tryKill(){let reach=this.options.Reach,yOff=this.options["Y Offset"];let target=m.getClosestPlayer();if(!target)return;let src={x:o.gameWorld.player.position.x,y:o.gameWorld.player.position.y+yOff,z:o.gameWorld.player.position.z};let tgt=target._model.position;let dir={x:src.x-tgt.x,y:src.y-tgt.y,z:src.z-tgt.z};let len=Math.sqrt(dir.x*dir.x+dir.y*dir.y+dir.z*dir.z);if(len!==0){dir.x/=len;dir.y/=len;dir.z/=len;}dir.x=-dir.x;dir.y=-dir.y;dir.z=-dir.z;let dist=Math.sqrt(Math.pow(src.x-tgt.x,2)+Math.pow(src.y-tgt.y,2)+Math.pow(src.z-tgt.z,2));if(dist<reach)o.gameWorld.server.sendData(13,[o.gameWorld.time.localServerTimeMs,src.x,src.y,src.z,dir.x,dir.y,dir.z,dist,target.id]);}};

// GunModifier: Gキー
var Gm=class extends a{constructor(){super("GunModifier","Combat",{Spread:.5,"Bullets per shot":100,"Firerate (ms)":1,"Bullet distance":1000,"Reload Time":1,Recoil:false},"KeyG");}get gunSystem(){return o.gameWorld.systemsManager.activeSystems.find(s=>s?.bulletsSystem);}onEnable(){let spec=this.gunSystem.playerShooter.currPlayerWeaponSpec;spec.bulletsPerShot=this.options["Bullets per shot"];spec.firerateMs=this.options["Firerate (ms)"];spec.distance=this.options["Bullet distance"];spec.startSpread=this.options.Spread;spec.reloadTimeMs=this.options["Reload Time"];if(!this.options.Recoil){spec.recoilAttackY=0;}}};

var O=class extends a{constructor(){super("Aimbot","Combat",{"On Aim":"true","On Shoot":"true","Y Offset":.5});this.lastExecutionTime=null;}getClosestEnemy(player,players){let best=null,bestDist=Infinity;players.forEach(p=>{if(p?.model?.position&&p.isAlive){let d=x.calculateDistance(player.position,p.model.position);if(d<bestDist){bestDist=d;best=p;}}});return best;}aimAtEnemy(){let player=o.gameWorld.player,players=o.gameWorld.server.players;if(!player||!players)return;let target=this.getClosestEnemy(player,players);if(!target)return;let tp=target.model.position,pp=player.position;let dx=tp.x-pp.x,dz=tp.z-pp.z;let yaw=Math.atan2(dx,dz);let dy=tp.y+parseFloat(this.options["Y Offset"])-pp.y;let hDist=Math.hypot(dx,dz);let pitch=Math.max(Math.min(Math.atan2(dy,hDist),Math.PI/2),-Math.PI/2);player.rotation.y=(yaw+Math.PI)%(2*Math.PI);player.rotation.x=pitch;}onRender(){if(!o?.gameWorld?.server)return;let onAim=this.options["On Aim"]=="true",onShoot=this.options["On Shoot"]=="true";let inp=o.gameWorld.player.inputs;if(onAim&&inp.rightMB)this.aimAtEnemy();else if(onShoot&&inp.leftMB)this.aimAtEnemy();else if(!onAim&&!onShoot)this.aimAtEnemy();}};

// NoClip: Jキー
var N=class extends a{constructor(){super("NoClip","Movement",null,"KeyJ");}get pps(){return o.gameWorld.systemsManager.activeSystems.find(s=>s?.playerPhysicsSystem).playerPhysicsSystem;}onRender(){if(!o?.gameWorld?.player)return;this._og=this._og||this.pps.resolveBlockCollision;if(this.pps.resolveBlockCollision==this._og)this.pps.resolveBlockCollision=()=>{};}onDisable(){if(this._og)this.pps.resolveBlockCollision=this._og;}};

var L=class extends a{constructor(){super("Timer","Movement",{Multiplier:1.2});this.interval=null;}onEnable(){if(this.interval)clearInterval(this.interval);this.interval=setInterval(()=>{let t=o.gameWorld.time;t.elapsedTimeMs+=20*this.options.Multiplier;},20);}onDisable(){if(this.interval)clearInterval(this.interval);}};
var U=class extends a{constructor(){super("HighJump","Movement",{"Jump Height":25});}onRender(){if(o?.gameWorld?.player)o.gameWorld.player.velocity.jumpSpeed=parseFloat(this.options["Jump Height"]);}onDisable(){if(o?.gameWorld?.player)o.gameWorld.player.velocity.jumpSpeed=8.285714285714286;}};
var H=class extends a{constructor(){super("NoHunger","Misc",null);}onEnable(){p.listeners.NoHunger=function(id,data){if(id==p.toServer.TIME_STEP_INFO){if(data.m)delete data.m;if(data.s)delete data.s;if(data.j)delete data.j;}};}onDisable(){delete p.listeners.NoHunger;}};
var V=class extends a{constructor(){super("NoDrown","Misc",null);}get damageListener(){return o.gameWorld.eventEmitter._events.get(48).values().next().value;}onRender(){if(o?.gameWorld?.eventEmitter?._events&&this.damageListener.callback.toString().includes("damageToApply"))this.damageListener.callback=()=>{};}onDisable(){if(o?.gameWorld?.eventEmitter?._events)this.damageListener.callback=e=>{this.damageToApply+=e;};}};
var K=class extends a{constructor(){super("GroundSpeed","Movement",{Speed:15});}get pps(){return o.gameWorld.systemsManager.activeSystems.find(s=>s?.playerPhysicsSystem).playerPhysicsSystem;}resetSpeed(){if(o?.gameWorld?.player){o.gameWorld.player.velocity.moveSpeed=4.5;o.gameWorld.player.velocity.fastMoveSpeed=6.4;}}onRender(){if(!o?.gameWorld?.player)return;if(o.gameWorld.player.collision.isGrounded){o.gameWorld.player.velocity.moveSpeed=this.options.Speed;o.gameWorld.player.velocity.fastMoveSpeed=this.options.Speed;}else this.resetSpeed();}onEnable(){let e=0,t=0;this.pps.BB.min.__defineGetter__("y",()=>e-.1);this.pps.BB.max.__defineGetter__("y",()=>t-.1);this.pps.BB.min.__defineSetter__("y",v=>{e=v;});this.pps.BB.max.__defineSetter__("y",v=>{t=v;});}onDisable(){this.resetSpeed();delete this.pps.BB.min.y;delete this.pps.BB.max.y;}};
var F2=class extends a{constructor(){super("InstantRespawn","Misc");}get gamemode(){return location.pathname.replace("/match/","");}onRender(){if(o.gameWorld?.player.isAlive)return;let sent=false;switch(this.gamemode){case"one-block":o.gameWorld.server.sendData(p.toServer.ONE_BLOCK_REQUEST_RESPAWN,true);sent=true;break;case"parkour":o.gameWorld.server.sendData(p.toServer.PARKOUR_REQUEST_RESPAWN,true);sent=true;break;case"bedwars":o.gameWorld.server.sendData(p.toServer.BED_WARS_REQUEST_RESPAWN,true);sent=true;break;case"survival":o.gameWorld.server.sendData(p.toServer.SANDBOX_REQUEST_RESPAWN,true);sent=true;break;}if(sent)o.stores.get("gameState").setLayoutState(0);}};
var j=class extends a{constructor(){super("ShopAnywhere","Misc");}get npcSystem(){return o?.gameWorld?.systemsManager?.activeSystems.find(s=>s?.isPlayerInShoppingZone);}onRender(){if(this?.npcSystem?.isPlayerInShoppingZone){this._og=this._og||this.npcSystem.isPlayerInShoppingZone;if(this.npcSystem.isPlayerInShoppingZone==this._og)this.npcSystem.isPlayerInShoppingZone=()=>true;}}onDisable(){if(this._og)this.npcSystem.isPlayerInShoppingZone=this._og;}};
var G2=class extends a{constructor(){super("SelfHarm","Misc",{Amount:1});}onEnable(){o.gameWorld.server.msgsToSend.push(p.toServer.GOT_DAMAGE,parseFloat(this.options.Amount));this.disable();}};
var Y=class extends a{constructor(){super("BlockFinder","Misc",{"Search Radius":16,"Block ID":581});this.CHUNK_SIZE=16;this.CHUNK_CHECK_MS=200;this.foundBlocks=[];this.lastChunkKey="";this.chunkInterval=null;this.raf=null;this.ui=null;this.listEl=null;}getPlayerChunk(){let pos=o.gameWorld.player.position;return[Math.floor(pos.x/this.CHUNK_SIZE),Math.floor(pos.y/this.CHUNK_SIZE),Math.floor(pos.z/this.CHUNK_SIZE)];}createUI(){if(this.ui)return;let el=document.createElement("div");el.style.cssText="position:fixed;top:80px;left:80px;width:260px;background:#000;color:#b0ffcc;font:11px 'Share Tech Mono',monospace;border:1px solid rgba(0,255,80,0.3);clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));box-shadow:0 0 12px rgba(0,255,80,0.2);z-index:99999;user-select:none;";el.innerHTML='<div class="bf-head" style="padding:7px 10px;cursor:move;border-bottom:1px solid rgba(0,255,80,0.18);font-family:Orbitron,monospace;font-size:10px;letter-spacing:3px;color:#00ff50;">BLOCK FINDER</div><div class="bf-list" style="max-height:220px;overflow:auto;padding:6px 10px;font-family:Share Tech Mono,monospace;white-space:pre;font-size:11px;color:#80ffb0;line-height:1.6;"></div>';document.body.appendChild(el);this.ui=el;this.listEl=el.querySelector(".bf-list");let dragging=false,ox=0,oy=0,head=el.querySelector(".bf-head");head.onmousedown=e=>{dragging=true;ox=e.clientX-el.offsetLeft;oy=e.clientY-el.offsetTop;};document.addEventListener("mousemove",this._dragMove=e=>{if(dragging){el.style.left=(e.clientX-ox)+"px";el.style.top=(e.clientY-oy)+"px";}});document.addEventListener("mouseup",this._dragUp=()=>dragging=false);}destroyUI(){if(this.ui){this.ui.remove();this.ui=null;this.listEl=null;document.removeEventListener("mousemove",this._dragMove);document.removeEventListener("mouseup",this._dragUp);}}scanChunks(){let R=this.options["Search Radius"]|0,bid=this.options["Block ID"]|0,cm=o.gameWorld.chunkManager,cp=this.getPlayerChunk();this.foundBlocks.length=0;for(let cx=-R;cx<=R;cx++)for(let cy=-R;cy<=R;cy++)for(let cz=-R;cz<=R;cz++){let ax=cp[0]+cx,ay=cp[1]+cy,az=cp[2]+cz,arr=cm.getChunkArray(ax,ay,az);if(arr)for(let i=0;i<arr.length;i++){if(arr[i]!==bid)continue;let wx=(ax<<4)+(i&15),wy=(ay<<4)+((i>>4)&15),wz=(az<<4)+(i>>8);if(cm.getBlock(wx,wy,wz)===bid)this.foundBlocks.push([wx,wy,wz]);}}}renderDistances=()=>{if(!this.listEl)return;let pp=[o.gameWorld.player.position.x,o.gameWorld.player.position.y,o.gameWorld.player.position.z];this.listEl.textContent=this.foundBlocks.length===0?"-- none nearby --":this.foundBlocks.map(b=>({b,d:x.calculateDistanceArr(pp,b)})).sort((a,b)=>a.d-b.d).map(e=>`${e.b[0]}, ${e.b[1]}, ${e.b[2]}  ${e.d.toFixed(1)}m`).join("\n");this.raf=requestAnimationFrame(this.renderDistances);};onEnable(){this.createUI();this.scanChunks();this.renderDistances();this.chunkInterval=setInterval(()=>{let k=this.getPlayerChunk().join(",");if(k!==this.lastChunkKey){this.lastChunkKey=k;this.scanChunks();}},this.CHUNK_CHECK_MS);}onDisable(){clearInterval(this.chunkInterval);cancelAnimationFrame(this.raf);this.chunkInterval=null;this.raf=null;this.foundBlocks.length=0;this.lastChunkKey="";this.destroyUI();}};

// Spider: Hキー
var q=class extends a{
  constructor(){super("Spider","Movement",{Speed:5},"KeyH");}
  get pps(){return o.gameWorld.systemsManager.activeSystems.find(s=>s?.playerPhysicsSystem).playerPhysicsSystem;}
  get upAgainstWall(){return this.pps.playerVelVec3.x==0||this.pps.playerVelVec3.z==0;}
  onRender(){
    if(!this.isEnabled)return;
    if(o?.gameWorld?.player&&o?.gameWorld?.player?.inputs.jump&&this.upAgainstWall)
      o.gameWorld.player.velocity.velVec3.y=this.options.Speed;
  }
};

var X=class extends a{constructor(){super("Freecam","Visual",{"3rd person":"true"});this._copy=null;this.realPos=null;}get playerModel(){return o.gameWorld.systemsManager.activeSystems.find(s=>s?.model).model;}onEnable(){let gw=o.gameWorld,delay=0;if(gw.player.cameraMode==1&&this.options["3rd person"]=="true"){o.gameWorld.switchCameraView();delay=100;}o.gameWorld.server.msgsListeners[p.toClient.SET_INVISIBLE_MODE]();setTimeout(()=>{this._copy=this._copy||this.playerModel.position.copy;this.playerModel.position.copy=()=>{};this.realPos=this.playerModel.position;},delay);}onDisable(){o.gameWorld.server.msgsListeners[p.toClient.SET_WALK_MODE]();this.playerModel.position.copy=this._copy.bind(this.playerModel.position);this.playerModel.position=this.realPos;}};
var Z=class extends a{constructor(){super("AirPlace","Misc");}get bps(){return o.gameWorld.systemsManager.activeSystems.find(s=>s?._handlePlaceInAir);}onEnable(){this.bps.canPlaceBlocksInAir=true;}onDisable(){this.bps.canPlaceBlocksInAir=o.gameWorld.player.gameMode==2;}};
var Q=class extends a{constructor(){super("Crafting","Menus");}onEnable(){m.openOtherItem(2);this.disable();h.modules.ClickGUI.onDisable(false);}};
var Dy=class extends a{constructor(){super("DyeingTable","Menus");}onEnable(){m.openOtherItem(9);this.disable();h.modules.ClickGUI.onDisable(false);}};
var Ct=class extends a{constructor(){super("CuttingTable","Menus");}onEnable(){m.openOtherItem(10);this.disable();h.modules.ClickGUI.onDisable(false);}};
var ee=class extends a{constructor(){super("Xray","Visual",null);}getItemByName(n){return Object.values(o.gameWorld.items).find(i=>i.name==n);}blocksToXray=["Dirt","Cobblestone","Stone"];onEnable(){$assetsUrls["game/textures/blocksTextures/Transparent.png"]="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";this.blocksToXray.forEach(n=>{let i=this.getItemByName(n);if(i){i.transparent=true;i.textures={other:"Transparent"};i.lightRadius=15;i.lightRGB=[1,1,1];}});this.reloadLighting();alert("Rejoin game to apply");}onDisable(){this.blocksToXray.forEach(n=>{let i=this.getItemByName(n);if(i){i.transparent=false;i.textures={other:n};i.lightRadius=0;i.lightRGB=[0,0,0];}});this.reloadLighting();}reloadLighting(){if(o.gameWorld.chunkManager){o.gameWorld.chunkManager.lightConfig.byBlockId=[];o.gameWorld.chunkManager.lightConfig.reloadBlocks();}}};

// Interface: CSS ルール null チェック付き
var te=class extends a{constructor(){super("Interface","Visual",{"Hide Right Elements":true,"Bottom Chat":true});}getCssRule(sel){for(let ss of document.styleSheets){try{for(let r of ss.cssRules||[])if(r.selectorText?.includes(sel))return r;}catch(e){}}return null;}applyTweaks(){let chatRule=this.getCssRule("chat-wrapper");let keyRule=this.getCssRule("key-prompt-wrapper");if(keyRule)keyRule.style.display=(this.isEnabled&&this.options["Hide Right Elements"])?"none":"flex";if(chatRule){if(this.isEnabled&&this.options["Bottom Chat"]){chatRule.style.bottom="10%";chatRule.style.top="";chatRule.style.position="fixed";}else{chatRule.style.bottom="";chatRule.style.top="0";chatRule.style.position="absolute";}}}onEnable(){this.applyTweaks();}onDisable(){this.applyTweaks();}};

var oe=class extends a{constructor(){super("BlockOutline","Visual",{"Outline Color":"#00ff50"});}get selectedBlock(){return o.gameWorld?.systemsManager.activeSystems.find(s=>s?.currBlockPos!==undefined)||undefined;}onRender(){if(this?.selectedBlock?.mesh){let c2=m.hexToRgb(this.options["Outline Color"]);if(this.selectedBlock.mesh.material.color.r!==c2.r)this.onEnable();}}onEnable(){if(!this?.selectedBlock?.mesh)return;let c2=m.hexToRgb(this.options["Outline Color"]);Object.keys(c2).forEach(k=>this.selectedBlock.mesh.material.color[k]=c2[k]);}onDisable(){if(this?.selectedBlock?.mesh){this.selectedBlock.mesh.material.color.r=0;this.selectedBlock.mesh.material.color.g=0;this.selectedBlock.mesh.material.color.b=0;}}};

// ===================== CLICK GUI =====================
var M=class extends a{
  constructor(){super("ClickGUI","Visual",{"Enable Animations":true},"ShiftRight");this.GUILoaded=false;this.panels=[];this.blurredBackground=null;}
  updateAnimations(){this.options["Enable Animations"]?document.body.classList.add("with-animations"):document.body.classList.remove("with-animations");}
  onEnable(){
    if(document.pointerLockElement)document.exitPointerLock();
    if(this.GUILoaded){this.showGUI();this.updateAnimations();}
    else{this.setupBackground();this.createPanels();this.setupEventListeners();this.GUILoaded=true;this.updateAnimations();}
    let pauseRule=m.getCssRule(".pause-cont");if(pauseRule)pauseRule.style.display="none";
    this.fixCanvas();
  }
  fixCanvas(){if(document.querySelector("#game"))game.dispatchEvent(new Event("resize",{bubbles:true}));}
  setupBackground(){this.blurredBackground=document.createElement("div");this.blurredBackground.className="gui-background";document.body.appendChild(this.blurredBackground);}
  createPanels(){
    let cats=[{title:"Combat",position:{top:"80px",left:"80px"}},{title:"Movement",position:{top:"80px",left:"295px"}},{title:"Visual",position:{top:"80px",left:"510px"}},{title:"Misc",position:{top:"80px",left:"725px"}},{title:"Menus",position:{top:"80px",left:"940px"}}];
    this.panels.forEach(p=>{if(p.panel?.parentNode)p.panel.parentNode.removeChild(p.panel);});
    this.panels=[];
    cats.forEach(c2=>{this.panels.push(new S(c2.title,c2.position));});
    let byCategory={};
    Object.values(h.modules).forEach(mod=>{byCategory[mod.category]=byCategory[mod.category]||[];byCategory[mod.category].push(mod);});
    Object.entries(byCategory).forEach(([cat,mods])=>{
      let panel=this.panels.find(p=>{let ttl=p.header.querySelector("[data-category]");return ttl&&ttl.dataset.category===cat;});
      if(!panel)return;
      mods.sort((a,b)=>b.name.length-a.name.length);
      mods.forEach(mod=>panel.addButton(mod));
    });
  }
  setupEventListeners(){
    c.on("module.update",mod=>{
      let panel=this.panels.find(p=>{let ttl=p.header.querySelector("[data-category]");return ttl&&ttl.dataset.category===mod.category;});
      if(!panel)return;
      let btn=panel.buttons.find(b=>{let n=b.querySelector(".gui-button-name");return n&&n.textContent===mod.name;});
      if(btn)btn.classList.toggle("enabled",mod.isEnabled);
    });
  }
  showGUI(){this.panels.forEach(p=>p.show());if(this.blurredBackground)this.blurredBackground.style.display="block";}
  onDisable(doClick=true){
    this.panels.forEach(p=>p.hide());
    if(this.blurredBackground)this.blurredBackground.style.display="none";
    let pauseRule=m.getCssRule(".pause-cont");if(pauseRule)pauseRule.style.display="";
    let pauseEl=document.getElementsByClassName("pause-cont")[0];if(pauseEl)pauseEl.style.display="none";
    this.fixCanvas();
    if(doClick){let game=document.querySelector("#game");if(game)game.click();}
  }
  onSettingUpdate(){this.updateAnimations();}
};

// ===================== KEYBINDS HUD =====================
var Kb=class extends a{
  constructor(){super("KeybindsHUD","Visual",null);this.ui=null;}
  _buildUI(){
    if(this.ui)return;
    let el=document.createElement("div");
    el.id="mb-keybinds-hud";
    el.style.cssText="position:fixed;bottom:60px;left:12px;z-index:1001;background:rgba(0,0,0,0.88);border:1px solid rgba(0,255,80,0.25);box-shadow:0 0 12px rgba(0,255,80,0.18);font-family:'Orbitron','Courier New',monospace;color:#b0ffcc;min-width:200px;user-select:none;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));";
    const binds=[
      ["I","Instabreak"],["K","Killaura"],["F","Fly"],["G","GunModifier"],
      ["J","NoClip"],["C","Chams"],["H","Spider"],["L","NightVision"],["SHIFT","ClickGUI"]
    ];
    let header=document.createElement("div");
    header.style.cssText="padding:6px 12px;cursor:move;font-size:9px;font-weight:900;letter-spacing:3px;color:#00ff50;text-shadow:0 0 8px rgba(0,255,80,0.6);border-bottom:1px solid rgba(0,255,80,0.18);background:linear-gradient(180deg,rgba(0,255,80,0.08) 0%,transparent 100%);";
    header.textContent="KEYBINDS";
    el.appendChild(header);
    let list=document.createElement("div");
    list.style.cssText="padding:6px 0 8px 0;";
    binds.forEach(([key,name])=>{
      let row=document.createElement("div");
      row.style.cssText="display:flex;align-items:center;gap:8px;padding:2px 12px;font-size:9px;";
      let kb=document.createElement("span");
      kb.style.cssText="min-width:38px;text-align:center;background:rgba(0,255,80,0.1);border:1px solid rgba(0,255,80,0.3);border-radius:2px;padding:1px 5px;font-family:'Share Tech Mono',monospace;font-size:9px;color:#00ff50;letter-spacing:1px;flex-shrink:0;";
      kb.textContent=key;
      let nm=document.createElement("span");
      nm.style.cssText="color:rgba(176,255,204,0.7);letter-spacing:1px;font-size:8px;";
      nm.textContent=name.toUpperCase();
      row.appendChild(kb);row.appendChild(nm);list.appendChild(row);
    });
    el.appendChild(list);
    document.body.appendChild(el);
    this.ui=el;
    // ドラッグ
    let dragging=false,ox=0,oy=0;
    header.addEventListener("mousedown",e=>{dragging=true;ox=e.clientX-el.offsetLeft;oy=e.clientY-el.offsetTop;e.preventDefault();});
    document.addEventListener("mousemove",e=>{if(dragging){el.style.left=(e.clientX-ox)+"px";el.style.top=(e.clientY-oy)+"px";el.style.bottom="auto";}});
    document.addEventListener("mouseup",()=>dragging=false);
  }
  onEnable(){this._buildUI();if(this.ui)this.ui.style.display="block";}
  onDisable(){if(this.ui)this.ui.style.display="none";}
};

// ===================== NIGHT VISION =====================
// ===================== NIGHT VISION =====================
var Nv=class extends a{
  constructor(){
    super("NightVision","Visual",{
      "Brightness":5,
      "Contrast":1.4,
      "Saturation":0.6,
      "Green Tint":"true"
    },"KeyL");
    this._styleEl=null;
  }
  _getCanvas(){return document.querySelector("#game canvas")||document.querySelector("canvas");}
  _applyCSS(){
    let br=parseFloat(this.options["Brightness"])||5;
    let ct=parseFloat(this.options["Contrast"])||1.4;
    let sat=parseFloat(this.options["Saturation"])||0.6;
    let tint=this.options["Green Tint"]==="true"||this.options["Green Tint"]===true;
    // brightness は 0-5 を CSS brightness(0~5) に写像（1=通常）
    let cssBr=Math.max(0.1,br);
    let filter=`brightness(${cssBr}) contrast(${ct}) saturate(${sat})`;
    if(tint)filter+=` sepia(0.4) hue-rotate(90deg)`;
    if(!this._styleEl){
      this._styleEl=document.createElement("style");
      this._styleEl.id="mb-nightvision-css";
      document.head.appendChild(this._styleEl);
    }
    this._styleEl.textContent=`
      #game canvas, canvas#game {
        filter: ${filter} !important;
        transition: filter 0.3s ease;
      }
    `;
  }
  _clearCSS(){
    if(this._styleEl){
      this._styleEl.textContent=`#game canvas, canvas#game { filter: none !important; transition: filter 0.3s ease; }`;
    }
  }
  onEnable(){
    this._applyCSS();
    // ゲーム内アンビエントライトも上げる
    try{
      let cm=o?.gameWorld?.chunkManager;
      if(cm){
        this._origAmbient=this._origAmbient??cm.ambientLight;
        this._origSkyBr=this._origSkyBr??cm.skyBrightness;
        let br=parseFloat(this.options["Brightness"])||5;
        cm.ambientLight=br;
        if(cm.skyBrightness!==undefined)cm.skyBrightness=br;
      }
    }catch(e){}
    try{
      let scene=o?.gameWorld?.scene;
      if(scene?.fog){this._origFog=this._origFog??scene.fog;scene.fog=null;}
    }catch(e){}
  }
  onDisable(){
    this._clearCSS();
    try{
      let cm=o?.gameWorld?.chunkManager;
      if(cm){
        if(this._origAmbient!==undefined){cm.ambientLight=this._origAmbient;this._origAmbient=undefined;}
        if(this._origSkyBr!==undefined&&cm.skyBrightness!==undefined){cm.skyBrightness=this._origSkyBr;this._origSkyBr=undefined;}
      }
    }catch(e){}
    try{
      let scene=o?.gameWorld?.scene;
      if(scene&&this._origFog!==undefined){scene.fog=this._origFog;this._origFog=undefined;}
    }catch(e){}
  }
  onSettingUpdate(){if(this.isEnabled){this._applyCSS();this.onEnable();}}
};

// ===================== BATTERY HUD =====================
var BatteryHUD=class extends a{
  constructor(){super("BatteryHUD","Visual",null);this.ui=null;this._raf=null;this._prevPct=null;}
  _injectCSS(){
    if(document.getElementById("mb-battery-css"))return;
    let s=document.createElement("style");s.id="mb-battery-css";
    s.textContent=`
@keyframes mb-bat-pulse{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes mb-bat-scanline{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
@keyframes mb-bat-glow{0%,100%{box-shadow:0 0 8px var(--mb-bat-color,#00ff50),0 0 16px var(--mb-bat-color,#00ff50)}50%{box-shadow:0 0 16px var(--mb-bat-color,#00ff50),0 0 32px var(--mb-bat-color,#00ff50)}}
@keyframes mb-bat-fill{from{width:0%}to{width:var(--mb-bat-fill,0%)}}
@keyframes mb-bat-in{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@keyframes mb-bat-digit{0%{opacity:0;transform:translateY(-6px)}30%{opacity:1;transform:translateY(0)}100%{opacity:1;transform:translateY(0)}}
#mb-battery-hud{animation:mb-bat-in .5s cubic-bezier(.4,0,.2,1) both;}
#mb-battery-hud .mb-bat-body{
  position:relative;width:56px;height:24px;
  border:2px solid var(--mb-bat-color,#00ff50);
  border-radius:3px;overflow:hidden;
  box-shadow:0 0 8px var(--mb-bat-color,#00ff50);
  animation:mb-bat-glow 2.5s ease-in-out infinite;
}
#mb-battery-hud .mb-bat-fill{
  position:absolute;left:0;top:0;height:100%;
  background:var(--mb-bat-color,#00ff50);
  width:var(--mb-bat-fill,0%);
  animation:mb-bat-fill .8s cubic-bezier(.4,0,.2,1) both;
  opacity:.35;
}
#mb-battery-hud .mb-bat-scanline{
  position:absolute;left:0;top:0;width:100%;height:30%;
  background:linear-gradient(180deg,rgba(255,255,255,.18) 0%,transparent 100%);
  animation:mb-bat-scanline 2s linear infinite;pointer-events:none;
}
#mb-battery-hud .mb-bat-tip{
  width:5px;height:10px;background:var(--mb-bat-color,#00ff50);
  border-radius:0 2px 2px 0;margin-left:-1px;
  box-shadow:0 0 5px var(--mb-bat-color,#00ff50);
}
#mb-battery-hud .mb-bat-pct{
  font-family:'Orbitron','Courier New',monospace;font-weight:900;
  font-size:14px;letter-spacing:1px;
  color:var(--mb-bat-color,#00ff50);
  text-shadow:0 0 10px var(--mb-bat-color,#00ff50);
  animation:mb-bat-digit .4s ease both;min-width:44px;text-align:right;
}
#mb-battery-hud .mb-bat-label{
  font-family:'Share Tech Mono',monospace;font-size:7px;
  letter-spacing:3px;color:rgba(0,255,80,.45);text-transform:uppercase;margin-top:2px;
}
#mb-battery-hud .mb-bat-charging{
  position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  font-size:12px;z-index:2;animation:mb-bat-pulse 1s ease infinite;
  color:var(--mb-bat-color,#00ff50);text-shadow:0 0 8px var(--mb-bat-color,#00ff50);
}
    `;
    document.head.appendChild(s);
  }
  _color(pct){
    if(pct>50)return"#00ff50";
    if(pct>20)return"#ffcc00";
    return"#ff3030";
  }
  _buildUI(){
    if(this.ui){document.body.appendChild(this.ui);return;}
    this._injectCSS();
    let el=document.createElement("div");
    el.id="mb-battery-hud";
    el.style.cssText="position:fixed;bottom:18px;right:18px;z-index:1002;display:flex;flex-direction:column;align-items:flex-end;gap:4px;user-select:none;pointer-events:none;";
    el.innerHTML=`
      <div style="display:flex;align-items:center;gap:6px;">
        <div class="mb-bat-pct">---%</div>
        <div style="display:flex;align-items:center;">
          <div class="mb-bat-body">
            <div class="mb-bat-fill"></div>
            <div class="mb-bat-scanline"></div>
            <div class="mb-bat-charging" style="display:none;">⚡</div>
          </div>
          <div class="mb-bat-tip"></div>
        </div>
      </div>
      <div class="mb-bat-label">BATTERY</div>
    `;
    document.body.appendChild(el);
    this.ui=el;
  }
  async _update(){
    if(!this.ui||!this.isEnabled)return;
    try{
      let bat=await navigator.getBattery?.();
      if(!bat)return;
      let pct=Math.round(bat.level*100);
      let color=this._color(pct);
      let charging=bat.charging;
      // カラー更新
      this.ui.style.setProperty("--mb-bat-color",color);
      this.ui.querySelectorAll(".mb-bat-body,.mb-bat-tip").forEach(el=>el.style.setProperty("--mb-bat-color",color));
      // %テキスト（変化したときだけアニメ再トリガー）
      let pctEl=this.ui.querySelector(".mb-bat-pct");
      if(this._prevPct!==pct){
        this._prevPct=pct;
        pctEl.style.animation="none";
        pctEl.offsetHeight;// reflow
        pctEl.style.animation="mb-bat-digit .4s ease both";
        pctEl.textContent=pct+"%";
      }
      // フィル
      let fillEl=this.ui.querySelector(".mb-bat-fill");
      fillEl.style.setProperty("--mb-bat-fill",pct+"%");
      fillEl.style.opacity=charging?"0.55":"0.35";
      // 充電マーク
      let chEl=this.ui.querySelector(".mb-bat-charging");
      chEl.style.display=charging?"block":"none";
      // 充電中は体ボーダーをより明るく
      let bodyEl=this.ui.querySelector(".mb-bat-body");
      bodyEl.style.borderColor=charging?"#fff":color;
    }catch(e){}
  }
  _loop(){
    if(!this.isEnabled)return;
    this._update();
    setTimeout(()=>this._loop(),3000);
  }
  onEnable(){this._buildUI();this._loop();}
  onDisable(){if(this.ui)this.ui.style.display="none";}
};

// ===================== MODULE MANAGER =====================
var h={
  modules:{},
  addModules(...classes){for(let cls of classes){let m2=new cls();this.modules[m2.name]=m2;}},
  handleKeyPress(code){
    for(let name in this.modules){
      let mod=this.modules[name];
      if(mod.waitingForBind){mod.keybind=code;mod.waitingForBind=false;}
      else if(mod.keybind==code)mod.toggle();
    }
  },
  init(){
    this.addModules(v,k,M,C2,W,w,B,I,P,K,A,Fl,D,R2,T,Gm,O,N,L,U,H,V,F2,j,G2,Y,q,X,Z,ee,te,oe,Q,Dy,Ct,Kb,Nv,BatteryHUD);
    c.on("render",()=>{for(let n in this.modules){let m2=this.modules[n];if(m2.isEnabled)m2.onRender();}});
    c.on("keydown",this.handleKeyPress.bind(this));
    c.on("setting.update",()=>{for(let n in this.modules){let m2=this.modules[n];if(m2.isEnabled)m2.onSettingUpdate();}});
    this.modules.Arraylist.enable();
    this.modules.Watermark.enable();
    try{this.modules.AdBypass.enable();}catch(e){}
    try{this.modules.KeybindsHUD.enable();}catch(e){}
    try{this.modules.BatteryHUD.enable();}catch(e){}
    try{this.modules.Interface.enable();}catch(e){}
  }
};

// ===================== BOOT =====================
var se=class{
  constructor(){this.version="1.3.0";this.init();}
  init(){
    setInterval(()=>c.emit("render"),1000/60);
    document.addEventListener("keydown",e=>{c.activeKeys.add(e.code);c.emit("keydown",e.code);});
    document.addEventListener("keyup",e=>{c.activeKeys.delete(e.code);});
    h.init();p.init();
    this.packets=p;this.moduleManager=h;this.hooks=o;
  }
  disable(){}
};
function le(){window.minebuns=new se;}
document.readyState==="complete"||document.readyState==="interactive"?le():document.addEventListener("DOMContentLoaded",()=>setTimeout(le,1000));
})();
