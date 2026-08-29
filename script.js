const qs=(s,c=document)=>c.querySelector(s), qsa=(s,c=document)=>[...c.querySelectorAll(s)];

// Current year
qs('#year').textContent=new Date().getFullYear();

// Reveal on scroll
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el=entry.target;
      if(el.dataset.delay) el.style.setProperty('--delay',`${el.dataset.delay}ms`);
      el.classList.add('visible');
      revealObserver.unobserve(el);
    }
  });
},{threshold:.13,rootMargin:'0px 0px -40px'});
qsa('.reveal').forEach(el=>revealObserver.observe(el));

// Header state, scroll progress, active nav, timeline progress
const header=qs('.site-header'), progress=qs('.scroll-progress span'), timeline=qs('.timeline'), timelineFill=qs('.timeline-line span');
const sections=qsa('main section[id]');
const navLinks=qsa('.nav-links a');
function onScroll(){
  const y=window.scrollY;
  header.classList.toggle('scrolled',y>24);
  const max=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=`${max?Math.min(100,(y/max)*100):0}%`;

  let current='home';
  sections.forEach(section=>{ if(y>=section.offsetTop-180) current=section.id; });
  navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${current}`));

  if(timeline && timelineFill){
    const rect=timeline.getBoundingClientRect();
    const start=innerHeight*.62;
    const amount=Math.max(0,Math.min(1,(start-rect.top)/(rect.height+start-innerHeight*.3)));
    timelineFill.style.height=`${amount*100}%`;
  }
}
addEventListener('scroll',onScroll,{passive:true});onScroll();

// Mobile nav
const menu=qs('.menu-toggle'), nav=qs('.nav-links');
menu.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
});
navLinks.forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));

// Soft cursor glow
const glow=qs('.cursor-glow');
addEventListener('pointermove',e=>{
  if(matchMedia('(pointer:fine)').matches){glow.style.left=`${e.clientX}px`;glow.style.top=`${e.clientY}px`;}
},{passive:true});

// Tilt cards
if(matchMedia('(pointer:fine)').matches){
  qsa('.tilt-card,.project-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(800px) rotateX(${y*-2.4}deg) rotateY(${x*3.4}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
}

// Skill filters
qsa('.skill-tabs button').forEach(btn=>btn.addEventListener('click',()=>{
  qsa('.skill-tabs button').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  const f=btn.dataset.filter;
  qsa('.skill-bar').forEach(bar=>bar.classList.toggle('filtered-out',f!=='all'&&bar.dataset.category!==f));
}));

// Expertise pills interactive state
qsa('.skill-pills button').forEach(btn=>btn.addEventListener('click',()=>{
  qsa('.skill-pills button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
}));

// Contact form: create mailto without a backend
qs('#contactForm').addEventListener('submit',e=>{
  e.preventDefault();
  const fd=new FormData(e.currentTarget);
  const subject=encodeURIComponent(`Portfolio contact from ${fd.get('name')}`);
  const body=encodeURIComponent(`Name: ${fd.get('name')}\nEmail: ${fd.get('email')}\n\n${fd.get('message')}`);
  location.href=`mailto:mohammadaliismael2002@gmail.com?subject=${subject}&body=${body}`;
});

// Project details modal
const projectData={
  sugar:{title:'Sugar Bloom',text:'A full-stack bakery ordering system designed around the customer ordering flow and an administrative order-management workflow.',items:['User authentication','Product browsing and shopping cart','Pickup or delivery checkout','Admin order dashboard and status updates','MySQL-backed data storage']},
  hospital:{title:'Hospital Management',text:'A multi-department web system that coordinates patient-facing and internal hospital workflows across several roles.',items:['Patient registration and portal','Appointment booking and status tracking','Medical inquiries and complaints','Reception, doctor, laboratory, pharmacy and administration workflows','Medical records, reports, lab results and prescriptions']},
  notes:{title:'Smart Notes Ultimate',text:'A privacy-focused browser notes application with organization, offline capabilities, and security-oriented features.',items:['Rich-text editing, folders and tags','Reminders and checklists','AES-GCM note encryption','Voice tools and automated backups','Import/export and cross-tab synchronization']},
  movie:{title:'MovieHub',text:'A responsive multi-page browsing experience for movies, series, and cartoons, with persistent personalized favorites.',items:['Title search and category filtering','Responsive CSS Grid and Flexbox layouts','Persistent favorites using Local Storage','Dynamic content rendering and notifications','Cross-tab synchronization']}
};
const modal=qs('#projectModal'), modalTitle=qs('#modalTitle'), modalContent=qs('#modalContent');
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
qsa('.details-btn').forEach(btn=>btn.addEventListener('click',()=>{
  const d=projectData[btn.dataset.project];
  modalTitle.textContent=d.title;
  modalContent.innerHTML=`<p>${d.text}</p><ul>${d.items.map(x=>`<li>${x}</li>`).join('')}</ul>`;
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
}));
qsa('[data-close-modal]').forEach(el=>el.addEventListener('click',closeModal));
addEventListener('keydown',e=>{if(e.key==='Escape') closeModal()});

// Expand / collapse full course history
const coursesToggle=qs('.courses-toggle'), courseList=qs('.course-list');
if(coursesToggle&&courseList){coursesToggle.addEventListener('click',()=>{
  const expanded=courseList.classList.toggle('expanded');
  coursesToggle.setAttribute('aria-expanded',String(expanded));
  coursesToggle.textContent=expanded?'SHOW FEWER COURSES -':'SHOW ALL 11 COURSES +';
});}
