(()=>{
 const root=document.querySelector('#form-root');
 const api='https://katya-matrix-sokolovamatrix.msk1.amvera.tech/api/form';
 const params=new URLSearchParams(location.search);
 const token=(params.get('token')||'').trim();
 const preview=['127.0.0.1','localhost'].includes(location.hostname);
 const productId=window.MATRIX_PRODUCT_ID||'money';
 const catalogue={
  money:{title:'Путь к деньгам',questions:[
   {title:'Откуда сейчас по большей части приходят деньги?',options:['В основном зарплата или заказы — работаю, чтобы заработать','Есть что-то, что приносит деньги без постоянного моего участия — вложения, аренда и т.п.','Доход держится на мне самой — моём деле, опыте, личном росте']},
   {title:'Что сейчас происходит с деньгами?',options:['Много работаю, а денег всё равно столько же','Деньги приходят и сразу утекают','Сложно назвать свою цену или попросить больше']},
   {title:'Что хотите получить от разбора?',options:['Понять, что держит меня на одном уровне дохода','Увидеть свой денежный ресурс: на чём мне легче зарабатывать','Перестать брать на себя лишнее и обесценивать свою работу']},
  ]},
  prime:{title:'Твой прайм',questions:[
   {title:'Что ближе всего к тому, что вы чувствуете сейчас?',options:['Многое умею, но когда рассказываю о себе, выходит «ну, так, ничего особенного»','Не понимаю, в чём моя сила и чем мне на самом деле заниматься','Делаю много, но чувствую, что живу не своей жизнью и быстро выгораю']},
   {title:'Что хотите получить от разбора?',options:['Увидеть свои сильные стороны и начать на них опираться','Понять, в каких условиях и в каком деле я раскрываюсь лучше всего','Разобраться, что мешает мне видеть свою силу и ценить себя']},
  ]},
  year:{title:'Прогноз на год',questions:[
   {title:'С каким ощущением вы заходите в новый год?',options:['Планы есть, но не понимаю, куда вложить силы в первую очередь','Чувствую, что пора что-то менять, но не знаю, с чего начать','Устала, хочется понять, где можно выдохнуть и поберечь себя']},
   {title:'Какую сферу посмотреть подробнее?',options:['Деньги и работа','Отношения и семья','Я сама: энергия, состояние, самореализация']},
  ]},
  full:{title:'Полный разбор матрицы',questions:[
   {title:'Что сейчас важнее всего?',options:['Понять, в чём моя сила и предназначение','Разобраться, почему повторяются одни и те же ситуации','Найти опору и понять, куда двигаться дальше']},
   {title:'На какой сфере сделать главный акцент?',options:['Деньги, работа и предназначение','Отношения, семья и род','Я сама: характер, энергия, внутренние ресурсы']},
  ]},
 };
 const product=catalogue[productId]||catalogue.money;
 const state={stage:'loading',product:window.MATRIX_PRODUCT_TITLE||product.title,day:'',month:'',year:'',address:'',question:0,answers:product.questions.map(()=>({choice:null,custom:''})),error:'',message:'',detail:'',returnToSummary:false};
 const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
 const totalSteps=2+product.questions.length;
 const questionTitle=index=>{
  const title=product.questions[index].title;
  if(state.address!=='ты')return title;
  return title.replace('Что хотите получить','Что хочешь получить').replace('Что ближе всего к тому, что вы чувствуете сейчас?','Что ближе всего к тому, что ты чувствуешь сейчас?').replace('С каким ощущением вы заходите в новый год?','С каким ощущением ты заходишь в новый год?');
 };
 const frame=(body,label='',showBack=true)=>`<div class="meta">${showBack?'<button class="text-back" data-action="back">← Назад</button>':'<span></span>'}<span>${escape(label)}</span></div><section class="stage">${body}</section>`;
 const error=()=>state.error?`<p class="error" role="alert">${escape(state.error)}</p>`:'';
 const answerText=index=>{const answer=state.answers[index];return answer.choice==='custom'?answer.custom.trim():Number.isInteger(answer.choice)?product.questions[index].options[answer.choice]:''};
 const summaryRow=(label,value,target,index='')=>`<article class="summary-row"><div class="summary-copy"><span>${escape(label)}</span><span class="summary-value">${escape(value)}</span></div><button type="button" class="summary-edit" data-action="edit-field" data-target="${target}"${index===''?'':` data-index="${index}"`}>Изменить</button></article>`;
 function render(){
  document.body.dataset.stage=state.stage;
  root.classList.toggle('gate',state.stage==='gate'||state.stage==='loading'||state.stage==='blocked');
  document.body.classList.toggle('plain-outcome',state.stage==='blocked');
  root.classList.toggle('outcome-card',state.stage==='blocked');
  root.classList.toggle('success-card',state.stage==='final');
  if(state.stage==='loading')root.innerHTML=frame('<h1>Проверяем ссылку</h1><p class="lead">Это займёт несколько секунд</p>','',false);
  if(state.stage==='blocked')root.innerHTML=`<section class="outcome-content"><h1>${escape(state.message||'Ссылка недействительна')}</h1><p class="lead">${escape(state.detail||'Если это ошибка, напишите мне в Telegram — помогу разобраться.')}</p><a class="contact-link" href="https://t.me/Katerina1108" target="_blank" rel="noopener noreferrer">Написать в Telegram <span aria-hidden="true">↗</span></a></section>`;
  if(state.stage==='gate')root.innerHTML=frame(`<h1>Анкета «${escape(state.product)}»</h1><p class="gate-guidance"><strong>Заполнение займёт 10–15 минут</strong> Выберите спокойное, уединённое место, чтобы вдумчиво и подробно ответить на вопросы</p><button class="primary" data-action="enter">Открыть анкету <span>→</span></button>`);
  if(state.stage==='date')root.innerHTML=frame(`<h1>Укажите дату рождения</h1><p class="lead">Дата нужна для расчёта матрицы. Проверьте её перед продолжением</p><div class="date-grid"><label>День<input class="field" id="day" inputmode="numeric" maxlength="2" autocomplete="bday-day" placeholder="ДД" value="${escape(state.day)}"></label><label>Месяц<input class="field" id="month" inputmode="numeric" maxlength="2" autocomplete="bday-month" placeholder="ММ" value="${escape(state.month)}"></label><label>Год<input class="field" id="year" inputmode="numeric" maxlength="4" autocomplete="bday-year" placeholder="ГГГГ" value="${escape(state.year)}"></label></div>${error()}<button class="primary" data-action="date">${state.returnToSummary?'Сохранить':'Продолжить'} <span>→</span></button>`,'Шаг 1 из '+totalSteps);
  if(state.stage==='address')root.innerHTML=frame(`<h1>Как вам комфортнее, чтобы я обращалась?</h1><p class="lead">Так я буду обращаться к вам в разборе</p><div class="options" role="radiogroup" aria-label="Форма обращения">${[['ты','На «ты»'],['вы','На «вы»']].map(([value,label])=>`<button type="button" class="option address-option" role="radio" aria-checked="${state.address===value}" data-action="address-choice" data-value="${value}"><span class="address-label">${escape(label)}</span><b aria-hidden="true"></b></button>`).join('')}</div>${error()}<button class="primary" data-action="address">${state.returnToSummary?'Сохранить':'Продолжить'} <span>→</span></button>`,'Шаг 2 из '+totalSteps);
  if(state.stage==='question'){
   const q=product.questions[state.question],answer=state.answers[state.question];
   root.innerHTML=frame(`<h1>${escape(questionTitle(state.question))}</h1><p class="lead">Выберите подходящий вариант или напишите свой</p><div class="options" role="radiogroup" aria-label="${escape(questionTitle(state.question))}">${q.options.map((option,index)=>`<button type="button" class="option" role="radio" aria-checked="${answer.choice===index}" data-action="choice" data-value="${index}"><span class="option-number">${String(index+1).padStart(2,'0')}</span><span class="option-text">${escape(option)}</span><b aria-hidden="true"></b></button>`).join('')}</div>${state.question===product.questions.length-1?`<div class="custom-answer"><label class="label" for="custom">Если ни один вариант не подходит, напишите своими словами</label><textarea id="custom" rows="1" maxlength="600" placeholder="Ваш вариант ответа">${escape(answer.custom)}</textarea><span class="count">${answer.custom.length} / 600</span></div>`:''}${error()}<button class="primary" data-action="question">${state.returnToSummary?'Сохранить':'Продолжить'} <span>→</span></button>`,`Шаг ${state.question+3} из ${totalSteps}`);
   if(state.question===product.questions.length-1)growTextarea(root.querySelector('#custom'));
  }
  if(state.stage==='summary')root.innerHTML=`<section class="stage summary-stage"><h1>Всё верно?</h1><div class="summary">${summaryRow('Дата рождения',formatDate(),'date')}${summaryRow('Форма обращения',state.address==='ты'?'На «ты»':'На «вы»','address')}${product.questions.map((q,index)=>summaryRow(questionTitle(index),answerText(index),'question',index)).join('')}</div><div class="actions"><button class="primary" data-action="submit">Да, всё верно <span>→</span></button></div></section>`;
  if(state.stage==='sending')root.innerHTML=frame('<div class="status-center"><span class="kicker">ПОЧТИ ГОТОВО</span><h1>Отправляем ваши ответы</h1><p class="lead">Проверяем данные и передаём анкету на подготовку разбора</p><div class="send-progress" role="progressbar" aria-label="Отправка анкеты"><i></i></div><small>Обычно это занимает несколько секунд</small></div>','',false);
  if(state.stage==='submitError')root.innerHTML=frame(`<div class="status-center"><span class="kicker">НЕ УДАЛОСЬ ОТПРАВИТЬ</span><h1>Анкета сохранена</h1><p class="lead">${escape(state.error||'Попробуйте ещё раз позже')}</p><button class="secondary" data-action="back-to-summary">Вернуться к проверке</button></div>`,'',false);
  if(state.stage==='final')root.innerHTML='<section class="outcome-content success-content"><div class="success-mark" aria-hidden="true"><span><svg viewBox="0 0 32 32"><path d="M7 17.2 13.1 23 25.5 9.5"/></svg></span></div><h1>Анкета отправлена</h1><p class="success-message">В течение нескольких дней разбор придёт на почту, которую вы указали при покупке. Если письмо не придёт, напишите мне через контакты на сайте<a href="https://www.sokolovamatrix.ru" target="_blank" rel="noopener noreferrer">www.sokolovamatrix.ru</a></p></section>';
 }
 function growTextarea(textarea){if(!textarea)return;textarea.style.height='auto';const line=parseFloat(getComputedStyle(textarea).lineHeight)||24;const max=line*6+30;const height=Math.min(textarea.scrollHeight,max);textarea.style.height=`${Math.max(height,line+30)}px`;textarea.style.overflowY=textarea.scrollHeight>max?'auto':'hidden'}
 function formatDate(){return `${state.day.padStart(2,'0')}.${state.month.padStart(2,'0')}.${state.year}`}
 function isoDate(){return `${state.year}-${state.month.padStart(2,'0')}-${state.day.padStart(2,'0')}`}
 function submissionAnswers(){
  const address=`Форма обращения\n${state.address==='ты'?'На «ты»':'На «вы»'}`;
  const content=product.questions.map((question,index)=>`${questionTitle(index)}\n${answerText(index)}`);
  return {q1:address,q2:content[0]||'Без дополнительного ответа',q3:content.slice(1).join('\n\n')||'Без дополнительного ответа'};
 }
 function validDate(){const d=Number(state.day),m=Number(state.month),y=Number(state.year),date=new Date(Date.UTC(y,m-1,d)),now=new Date();return d>0&&m>0&&/^\d{4}$/.test(state.year)&&y>=1920&&y<=now.getFullYear()&&date.getUTCDate()===d&&date.getUTCMonth()+1===m&&date.getUTCFullYear()===y&&date<=now}
 async function checkToken(){
  if(preview){state.stage=['gate','date','address','question','summary','final'].includes(params.get('previewStage'))?params.get('previewStage'):'gate';state.question=Math.min(product.questions.length-1,Math.max(0,Number(params.get('previewQuestion'))||0));if(state.stage==='summary'){state.day='11';state.month='11';state.year='1990';state.address='вы';state.answers.forEach(answer=>answer.choice=0)}render();return}
  if(!token){state.stage='blocked';state.message='Ссылка недействительна';render();return}
  try{const response=await fetch(`${api}/status?token=${encodeURIComponent(token)}`);const data=await response.json().catch(()=>({}));if(response.ok&&data.ok){state.product=data.productTitle||state.product;document.title=`Анкета «${state.product}»`;state.stage='gate'}else if(data.reason==='already_submitted'){state.stage='blocked';state.message='Анкета уже отправлена';state.detail='Вы уже заполнили анкету по этой ссылке. Повторять не нужно. Если это ошибка, напишите мне в Telegram — помогу разобраться.'}else if(data.reason==='not_paid'){state.stage='blocked';state.message='Оплата ещё не подтверждена';state.detail='Если вы уже оплатили разбор, напишите мне в Telegram — проверю платёж.'}else{state.stage='blocked';state.message='Ссылка недействительна';state.detail='Проверьте ссылку из бота. Если это ошибка, напишите мне в Telegram.'}}catch{state.stage='blocked';state.message='Не удалось проверить ссылку';state.detail='Попробуйте открыть её ещё раз чуть позже. Если не получится, напишите мне в Telegram.'}render()
 }
 root.addEventListener('input',event=>{const target=event.target;if(target.id==='day')state.day=target.value.replace(/\D/g,'');if(target.id==='month')state.month=target.value.replace(/\D/g,'');if(target.id==='year')state.year=target.value.replace(/\D/g,'');if(target.id==='custom'){const answer=state.answers[state.question];answer.custom=target.value;answer.choice=target.value.trim()?'custom':null;root.querySelectorAll('.option').forEach(option=>option.setAttribute('aria-checked','false'));const count=root.querySelector('.count');if(count)count.textContent=`${target.value.length} / 600`;growTextarea(target)}state.error='';const message=root.querySelector('.error');if(message)message.remove()});
 root.addEventListener('keydown',event=>{if(!['ArrowDown','ArrowRight','ArrowUp','ArrowLeft'].includes(event.key)||event.target.getAttribute('role')!=='radio')return;const radios=[...root.querySelectorAll('[role="radio"]')];const index=radios.indexOf(event.target);const next=radios[(index+(event.key==='ArrowDown'||event.key==='ArrowRight'?1:-1)+radios.length)%radios.length];event.preventDefault();next.focus();next.click()});
 root.addEventListener('click',async event=>{const button=event.target.closest('[data-action]');if(!button)return;const action=button.dataset.action;state.error='';
  if(action==='enter'){state.returnToSummary=false;state.stage='date';render();return}
  if(action==='date'){if(!validDate())state.error='Проверьте дату рождения.';else if(state.returnToSummary){state.returnToSummary=false;state.stage='summary'}else state.stage='address';render();return}
  if(action==='address-choice'){state.address=button.dataset.value;root.querySelectorAll('.option').forEach(option=>option.setAttribute('aria-checked',String(option===button)));return}
  if(action==='address'){if(!state.address)state.error='Выберите форму обращения.';else if(state.returnToSummary){state.returnToSummary=false;state.stage='summary'}else state.stage='question';render();return}
  if(action==='choice'){const answer=state.answers[state.question];answer.choice=Number(button.dataset.value);root.querySelectorAll('.option').forEach(option=>option.setAttribute('aria-checked',String(option===button)));return}
  if(action==='question'){if(!answerText(state.question))state.error='Выберите вариант или напишите ответ своими словами.';else if(state.returnToSummary){state.returnToSummary=false;state.stage='summary'}else if(state.question<product.questions.length-1)state.question++;else state.stage='summary';render();return}
  if(action==='edit-field'){state.returnToSummary=true;const target=button.dataset.target;if(target==='question'){state.question=Number(button.dataset.index)||0;state.stage='question'}else state.stage=target;render();return}
  if(action==='back-to-summary'){state.returnToSummary=false;state.stage='summary';render();return}
  if(action==='submit'){
   state.stage='sending';render();
   if(preview){await new Promise(resolve=>setTimeout(resolve,900));state.stage='final';render();return}
   try{
    const response=await fetch(`${api}/submit`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,dateOfBirth:isoDate(),answers:submissionAnswers()})});
    const data=await response.json().catch(()=>({}));
    if(response.ok&&data.ok)state.stage='final';
    else{state.error=data.message||(data.reason==='not_paid'?'Оплата ещё не подтверждена':data.reason==='date_mismatch'?'Дата рождения не совпадает с данными заказа':'Не удалось отправить анкету');state.stage='submitError'}
   }catch{state.error='Проверьте интернет и попробуйте ещё раз';state.stage='submitError'}
   render();return
  }
  if(action==='back'){if(state.returnToSummary){state.returnToSummary=false;state.stage='summary'}else if(state.stage==='date')state.stage='gate';else if(state.stage==='address')state.stage='date';else if(state.stage==='question'&&state.question===0)state.stage='address';else if(state.stage==='question')state.question--;else if(state.stage==='summary'){state.stage='question';state.question=product.questions.length-1}render()}
 });
 render();checkToken();
})();
