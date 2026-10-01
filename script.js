
(function(){
  const canvas=document.getElementById('bg-canvas'),ctx=canvas.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let particles=[],fireworks=[],next=1500;
  function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);particles=Array.from({length:70},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.4+.3,p:Math.random()*Math.PI*2,s:Math.random()*.4+.15}))}
  function spawn(){const x=innerWidth*(.15+Math.random()*.7),y=innerHeight*(.1+Math.random()*.35),colors=['143,211,238','201,161,90','230,205,147','248,243,230'],color=colors[Math.floor(Math.random()*colors.length)];fireworks.push({color,sparks:Array.from({length:30},()=>{const a=Math.random()*Math.PI*2,v=.7+Math.random()*1.3;return{x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1}})})}
  function draw(t){ctx.clearRect(0,0,innerWidth,innerHeight);particles.forEach(p=>{const tw=reduce?.6:.4+.6*Math.abs(Math.sin(p.p+t*.0006*p.s));ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(143,211,238,${tw*.38})`;ctx.fill()});if(!reduce){if(t>next){spawn();next=t+3800+Math.random()*3200}fireworks.forEach(f=>f.sparks.forEach(s=>{s.vy+=.012;s.vx*=.985;s.x+=s.vx;s.y+=s.vy;s.life-=.011;if(s.life>0){ctx.beginPath();ctx.arc(s.x,s.y,1.6,0,Math.PI*2);ctx.fillStyle=`rgba(${f.color},${Math.max(s.life,0)*.8})`;ctx.fill()}}));fireworks=fireworks.filter(f=>f.sparks.some(s=>s.life>0));requestAnimationFrame(draw)}}window.addEventListener('resize',resize);resize();requestAnimationFrame(draw);
})();
const confettiBurst=(function(){const c=document.getElementById('fx-canvas'),x=c.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;let pieces=[],running=false;function resize(){c.width=innerWidth*devicePixelRatio;c.height=innerHeight*devicePixelRatio;x.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}window.addEventListener('resize',resize);resize();function loop(){x.clearRect(0,0,innerWidth,innerHeight);pieces.forEach(p=>{p.vy+=.09;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;p.life-=.008;x.save();x.translate(p.x,p.y);x.rotate(p.rot);x.globalAlpha=Math.max(p.life,0);x.fillStyle=p.color;x.fillRect(-p.size/2,-p.size/3,p.size,p.size*.66);x.restore()});pieces=pieces.filter(p=>p.life>0&&p.y<innerHeight+40);if(pieces.length)requestAnimationFrame(loop);else{running=false;x.clearRect(0,0,innerWidth,innerHeight)}}return function(cx,cy,n=90){if(reduce)return;cx??=innerWidth/2;cy??=innerHeight*.35;const colors=['#c9a15a','#e6cd93','#8fd3ee','#f8f3e6','#4a5d78'];for(let i=0;i<n;i++){const a=-Math.PI/2+(Math.random()-.5)*Math.PI*.9,v=4+Math.random()*7;pieces.push({x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,size:6+Math.random()*6,rot:Math.random()*Math.PI,vr:(Math.random()-.5)*.3,life:1,color:colors[Math.floor(Math.random()*colors.length)]})}if(!running){running=true;requestAnimationFrame(loop)}}})();
const envelope=document.getElementById('envelope'),wrap=document.getElementById('envelopeWrap'),hint=document.getElementById('hint'),letter=document.getElementById('letter'),bgm=document.getElementById('bgm'),music=document.getElementById('musicToggle'),photos=document.getElementById('scatterPhotos');let opened=false;
envelope.addEventListener('click',()=>{if(opened)return;opened=true;envelope.classList.add('open');hint.style.opacity='0';photos.classList.add('show');const r=envelope.getBoundingClientRect();confettiBurst(r.left+r.width/2,r.top+r.height/2,110);bgm.play().then(()=>music.setAttribute('aria-pressed','true')).catch(()=>{});setTimeout(()=>{wrap.classList.add('hidden');letter.classList.add('visible')},700)});
music.addEventListener('click',()=>{if(bgm.paused)bgm.play().then(()=>music.setAttribute('aria-pressed','true')).catch(()=>{});else{bgm.pause();music.setAttribute('aria-pressed','false')}});
const choices=document.getElementById('proposalChoices'),reply=document.getElementById('proposalReply'),echo=document.getElementById('proposalEcho'),note=document.getElementById('proposalNote'),send=document.getElementById('sendReply'),sendHint=document.getElementById('sendHint');let answer='';
choices.querySelectorAll('.choice-btn').forEach(btn=>btn.addEventListener('click',()=>{answer=btn.dataset.answer;echo.textContent=answer;reply.hidden=false;reply.scrollIntoView({behavior:'smooth',block:'center'});if(btn.classList.contains('yes')){const r=btn.getBoundingClientRect();confettiBurst(r.left+r.width/2,r.top+r.height/2,90)}}));
const form=document.getElementById('gformProxy'),formAnswer=document.getElementById('gformAnswer'),formNote=document.getElementById('gformNote');
send.addEventListener('click', () => {
  formAnswer.value = answer || '(chưa chọn câu trả lời)';
  formNote.value = note.value.trim();

  form.submit();

  send.disabled = true;
  send.textContent = 'Đã gửi ✓';
  sendHint.textContent =
    'Đã gửi cho anh rồi nè 💌! Nếu anh đã bật thông báo email, anh sẽ nhận được lời nhắn của em.';
});
const s1=document.getElementById('screen-envelope'),s2=document.getElementById('screen-invite');
document.getElementById('toInvite').addEventListener('click',()=>{s1.classList.remove('active');s2.classList.add('active');confettiBurst(innerWidth/2,innerHeight*.3,70)});
document.getElementById('toLetter').addEventListener('click',()=>{s2.classList.remove('active');s1.classList.add('active')});
