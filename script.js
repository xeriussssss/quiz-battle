/* ══════════════════════════════════════════
   QUIZ BATTLE — script.js
══════════════════════════════════════════ */

// ══════════════════════════════════════════
//  AUDIO ENGINE — upbeat chiptune style
// ══════════════════════════════════════════
let AC, soundOn = true, bgLoop = null, bgPlaying = false;

function getAC() {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  return AC;
}

function note(freq, start, dur, vol = 0.18, type = 'square', attack = 0.01, release = 0.15) {
  try {
    const c = getAC(), o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
    o.connect(g); g.connect(c.destination);
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t + start);
    g.gain.linearRampToValueAtTime(vol, t + start + attack);
    g.gain.setValueAtTime(vol, t + start + dur - release);
    g.gain.linearRampToValueAtTime(0, t + start + dur);
    o.start(t + start); o.stop(t + start + dur + .05);
  } catch (e) {}
}

// BG MUSIC
const MELODY = [
  [523,0],[659,.22],[784,.44],[659,.66],
  [523,.88],[392,1.10],[523,1.32],[659,1.54],
  [784,1.76],[880,1.98],[784,2.20],[659,2.42],
  [523,2.64],[392,2.86],[330,3.08],[392,3.30],
];
const BASS = [
  [131,0],[165,.44],[196,.88],[165,1.32],
  [131,1.76],[98,2.20],[131,2.64],[98,3.08],
];
const BEAT_DUR = 3.6;

function startBG() {
  if (!soundOn || bgPlaying) return;
  bgPlaying = true;
  function scheduleBeat() {
    if (!bgPlaying || !soundOn) return;
    MELODY.forEach(([f, s]) => note(f, s, .2, .12, 'square'));
    BASS.forEach(([f, s]) => note(f, s, .38, .07, 'sawtooth'));
    [0,.11,.22,.33,.44,.55,.66,.77,.88,.99,1.1,1.21,1.32,1.43,1.54,1.65,
     1.76,1.87,1.98,2.09,2.2,2.31,2.42,2.53,2.64,2.75,2.86,2.97,3.08,3.19,3.30,3.41].forEach(s => {
      try {
        const c = getAC(), b = c.createOscillator(), bg = c.createGain(), t = c.currentTime;
        b.type = 'square'; b.frequency.value = 8000 + Math.random() * 4000;
        b.connect(bg); bg.connect(c.destination);
        bg.gain.setValueAtTime(.025, t + s); bg.gain.exponentialRampToValueAtTime(.001, t + s + .05);
        b.start(t + s); b.stop(t + s + .06);
      } catch(e) {}
    });
    bgLoop = setTimeout(scheduleBeat, (BEAT_DUR - .05) * 1000);
  }
  scheduleBeat();
}
function stopBG() { bgPlaying = false; if (bgLoop) { clearTimeout(bgLoop); bgLoop = null; } }

function playCorrect() {
  if (!soundOn) return;
  [[523,.0],[659,.08],[784,.16],[1047,.26]].forEach(([f,s]) => note(f,s,.18,.22,'sine'));
}
function playWrong()   { if (!soundOn) return; [[200,.0],[160,.14],[120,.28]].forEach(([f,s]) => note(f,s,.12,.2,'sawtooth')); }
function playTimeout() { if (!soundOn) return; [[440,.0],[330,.12],[220,.26]].forEach(([f,s]) => note(f,s,.2,.15,'triangle')); }
function playFlip()    { if (soundOn) note(900, 0, .06, .1, 'sine'); }
function playWin()     {
  if (!soundOn) return;
  [[523,0],[659,.1],[784,.2],[1047,.32],[1319,.44],[1568,.58]].forEach(([f,s]) => note(f,s,.25,.22,'sine'));
}

function toggleSound() {
  soundOn = !soundOn;
  document.getElementById('sndBtn').textContent = soundOn ? '🔊' : '🔇';
  if (soundOn && document.getElementById('game').classList.contains('active')) startBG();
  else if (!soundOn) stopBG();
}

// ══════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════
const CARDS = [
  { ico:'📊', q:'Apa fungsi utama Microsoft PowerPoint?', pts:10,
    opts:['Mengolah data angka di spreadsheet','Membuat dan menyajikan presentasi visual','Mengolah kata dan dokumen teks','Mengelola basis data'], ans:1 },
  { ico:'🆕', q:'Langkah membuat SLIDE BARU di PowerPoint adalah?', pts:10,
    opts:['Design → New Theme','Insert → Table','Home → New Slide','View → Slide Master'], ans:2 },
  { ico:'🎨', q:'Menu untuk mengubah TEMA/latar belakang pada slide adalah?', pts:10,
    opts:['Home','Insert','Design','Animations'], ans:2 },
  { ico:'✨', q:'Fitur ANIMASI pada PowerPoint digunakan untuk?', pts:20, bonus:true,
    opts:['Efek perpindahan antar slide','Mengubah ukuran huruf','Memberikan efek gerak pada teks atau gambar dalam slide','Mengatur warna background'], ans:2 },
  { ico:'🔄', q:'TRANSISI digunakan untuk memberikan efek pada saat?', pts:10,
    opts:['Menyisipkan gambar baru','Perpindahan dari satu slide ke slide lain','Mengetik teks di slide','Menyimpan file presentasi'], ans:1 },
  { ico:'🔗', q:'Fitur yang menghubungkan teks/objek ke file atau website lain disebut?', pts:20, bonus:true,
    opts:['Animation','Transition','Hyperlink','Slide Show'], ans:2 },
  { ico:'▶️', q:'Shortcut keyboard untuk menjalankan SLIDE SHOW dari awal adalah?', pts:10,
    opts:['F1','F3','F5','F7'], ans:2 },
  { ico:'💾', q:'Quick Access Toolbar berisi kumpulan tombol apa?', pts:10,
    opts:['Home, Insert, Design','Save, Undo, Redo','Font, Bold, Italic','Slide, Layout, Theme'], ans:1 },
  { ico:'🔉', q:'Pengaturan DURATION pada menu Transition digunakan untuk?', pts:10,
    opts:['Menentukan efek suara saat transisi','Mengatur berapa lama efek transisi berlangsung','Menerapkan transisi ke semua slide','Mengubah jenis animasi'], ans:1 },
  { ico:'🌐', q:'"Place in This Document" pada Hyperlink digunakan untuk menghubungkan ke?', pts:20, bonus:true,
    opts:['File dari internet/browser','Alamat email tujuan','Slide lain dalam dokumen yang sama','Folder di komputer'], ans:2 },
];

const TOTAL = 10, TIME = 15;
let state = { sA:0, sB:0, okA:0, okB:0, bonA:0, bonB:0, turn:'A', answered:0, open:null };
let timerInt = null, timerVal = TIME, activeCard = null;
const CIRC = 2 * Math.PI * 30; // ≈ 188.5

// streak tracking
let streak = { A:0, B:0 };

// ══════════════════════════════════════════
//  SCREENS
// ══════════════════════════════════════════
function show(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
  });
  const el = document.getElementById(id);
  el.classList.add('active');
}

function startGame() {
  playFlip();
  state = { sA:0, sB:0, okA:0, okB:0, bonA:0, bonB:0, turn:'A', answered:0, open:null };
  streak = { A:0, B:0 };
  buildGrid();
  show('game');
  updateUI();
  stopBG();
  setTimeout(startBG, 200);
}

function restartGame() {
  playFlip();
  stopBG();
  clearTimer();
  show('intro');
}

// ══════════════════════════════════════════
//  GRID — with staggered entrance animation
// ══════════════════════════════════════════
function buildGrid() {
  const g = document.getElementById('grid');
  g.innerHTML = '';
  CARDS.forEach((c, i) => {
    const w = document.createElement('div');
    w.className = 'cw';
    w.id = 'cw' + i;
    w.innerHTML = `
      <div class="ci">
        <div class="face front">
          <div class="f-glow"></div>
          <div class="f-ico">${c.ico}</div>
          <div class="f-num">Soal ${i + 1}</div>
          ${c.bonus
            ? '<div class="bonus-badge">⭐ BONUS ×2</div>'
            : `<div class="f-pts-badge">📍 ${c.pts} pts</div>`}
        </div>
        <div class="face back">
          <div class="b-q">${c.q}</div>
          <div class="opts" id="opts${i}">
            ${c.opts.map((o, j) => `<button class="opt" onclick="answer(${i},${j})">${'ABCD'[j]}. ${o}</button>`).join('')}
          </div>
        </div>
      </div>`;
    w.addEventListener('click', () => flipCard(i));
    g.appendChild(w);

    // Staggered card entrance animation
    setTimeout(() => {
      w.classList.add('visible');
    }, i * 60);
  });
}

function flipCard(i) {
  const w = document.getElementById('cw' + i);
  if (w.classList.contains('done')) return;
  if (state.open !== null && state.open !== i) {
    const prev = document.getElementById('cw' + state.open);
    if (!prev.classList.contains('done')) {
      prev.classList.remove('open');
      clearTimer();
    }
  }
  if (!w.classList.contains('open')) {
    playFlip();
    w.classList.add('open');
    state.open = i;
    activeCard = i;
    startTimer(i);

    // Ripple effect on flip
    spawnRipple(w);
  }
}

// ══════════════════════════════════════════
//  TIMER
// ══════════════════════════════════════════
function startTimer(cardIdx) {
  clearTimer();
  timerVal = TIME;
  renderTimer(TIME);
  timerInt = setInterval(() => {
    timerVal--;
    renderTimer(timerVal);
    if (timerVal <= 0) { clearTimer(); timeOut(cardIdx); }
  }, 1000);
}
function clearTimer() { clearInterval(timerInt); timerInt = null; }

function renderTimer(v) {
  const arc = document.getElementById('timerArc');
  const num = document.getElementById('timerNum');
  const pct = v / TIME;
  arc.style.strokeDashoffset = CIRC * (1 - pct);
  const col = v > 8 ? 'var(--green)' : v > 4 ? 'var(--gold)' : 'var(--red)';
  arc.style.stroke = col;
  num.style.color = col;
  num.textContent = v;
  // Urgent pulse when ≤ 5 seconds
  if (v <= 5) {
    num.classList.add('urgent');
  } else {
    num.classList.remove('urgent');
  }
  if (v <= 5 && soundOn) note(v <= 2 ? 880 : 660, 0, .05, .08, 'sine');
}

function timeOut(cardIdx) {
  const w = document.getElementById('cw' + cardIdx);
  if (w.classList.contains('done')) return;
  w.classList.add('done', 'done-time');
  state.open = null; activeCard = null;
  document.querySelectorAll(`#opts${cardIdx} .opt`).forEach((b, j) => {
    b.classList.add('locked');
    if (j === CARDS[cardIdx].ans) b.classList.add('correct');
  });
  playTimeout();
  showPop('timeout', '⏰', 'WAKTU HABIS!', '0 PTS');
  streak[state.turn] = 0; // reset streak
  state.answered++;
  state.turn = state.turn === 'A' ? 'B' : 'A';
  setTimeout(() => {
    updateUI();
    if (state.answered === TOTAL) setTimeout(showResult, 800);
  }, 1300);
}

// ══════════════════════════════════════════
//  ANSWER
// ══════════════════════════════════════════
function answer(ci, ai) {
  const w = document.getElementById('cw' + ci);
  if (w.classList.contains('done')) return;
  clearTimer();
  w.classList.add('done');
  state.open = null; activeCard = null;
  const c = CARDS[ci];
  document.querySelectorAll(`#opts${ci} .opt`).forEach((b, j) => {
    b.classList.add('locked');
    if (j === c.ans) b.classList.add('correct');
    else if (j === ai && ai !== c.ans) b.classList.add('wrong');
  });
  const ok = ai === c.ans;
  if (ok) {
    state['s' + state.turn] += c.pts;
    state['ok' + state.turn]++;
    if (c.bonus) state['bon' + state.turn]++;
    streak[state.turn]++;
    w.classList.add('done-ok');
    playCorrect();
    spawnParticles(w);
    showPop('ok', '🎉', `TIM ${state.turn} BENAR!`, `+${c.pts} PTS`);
    animateScore(state.turn);
    // Show streak badge if ≥ 2 correct in a row
    if (streak[state.turn] >= 2) {
      showStreak(state.turn, streak[state.turn]);
    }
  } else {
    streak[state.turn] = 0; // reset streak
    w.classList.add('done-no');
    // shake animation
    w.classList.add('shake');
    setTimeout(() => w.classList.remove('shake'), 450);
    playWrong();
    showPop('no', '❌', `TIM ${state.turn} SALAH!`, '0 PTS');
    state.turn = state.turn === 'A' ? 'B' : 'A';
  }
  state.answered++;
  setTimeout(() => {
    updateUI();
    if (state.answered === TOTAL) setTimeout(showResult, 800);
  }, ok ? 100 : 1200);
}

// ══════════════════════════════════════════
//  UI
// ══════════════════════════════════════════
function updateUI() {
  document.getElementById('sA').textContent = state.sA;
  document.getElementById('sB').textContent = state.sB;
  document.getElementById('okA').textContent = state.okA + ' benar';
  document.getElementById('okB').textContent = state.okB + ' benar';
  document.getElementById('rem').textContent = TOTAL - state.answered;
  document.getElementById('progDone').textContent = state.answered + ' dijawab';
  document.getElementById('progFill').style.width = (state.answered / TOTAL * 100) + '%';
  const isA = state.turn === 'A';
  const pill = document.getElementById('turnPill');
  pill.className = 'turn-pill ' + (isA ? 'a' : 'b');
  document.getElementById('turnTxt').textContent = 'Giliran Tim ' + (isA ? 'A' : 'B');
  if (!timerInt) renderTimer(TIME);
}

// Animate score number with pop effect
function animateScore(team) {
  const el = document.getElementById('s' + team);
  el.classList.remove('pop');
  void el.offsetWidth; // reflow
  el.classList.add('pop');
  setTimeout(() => el.classList.remove('pop'), 450);
}

// ══════════════════════════════════════════
//  POPUP
// ══════════════════════════════════════════
let popT = null;
function showPop(type, icon, label, pts) {
  const p = document.getElementById('popup');
  p.className = 'popup ' + type;
  document.getElementById('popIcon').textContent = icon;
  document.getElementById('popLabel').textContent = label;
  document.getElementById('popPts').textContent = pts;
  p.classList.add('show');
  if (popT) clearTimeout(popT);
  popT = setTimeout(() => p.classList.remove('show'), 1400);
}

// ══════════════════════════════════════════
//  STREAK BADGE
// ══════════════════════════════════════════
let streakTimeout = null;
function showStreak(team, count) {
  let badge = document.getElementById('streakBadge');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'streakBadge';
    badge.className = 'streak-badge';
    document.body.appendChild(badge);
  }
  const emojis = ['', '', '🔥', '🔥🔥', '🔥🔥🔥', '⚡🔥⚡'];
  const e = emojis[Math.min(count, 5)];
  badge.textContent = `${e} Tim ${team}: ${count}x berturut-turut!`;
  badge.style.animation = 'none';
  void badge.offsetWidth;
  badge.style.animation = 'streakIn .5s cubic-bezier(.34,1.56,.64,1) both';
  badge.style.display = 'block';
  if (streakTimeout) clearTimeout(streakTimeout);
  streakTimeout = setTimeout(() => {
    badge.style.display = 'none';
  }, 2000);
}

// ══════════════════════════════════════════
//  PARTICLES
// ══════════════════════════════════════════
const COLORS = ['#FFD000','#06D6A0','#00C2FF','#FF4D6D','#9B5DE5','#FF9500'];
function spawnParticles(el) {
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const sz = 4 + Math.random() * 7;
    const dx = (Math.random() - .5) * 140, dy = -35 - Math.random() * 90;
    p.style.cssText = `width:${sz}px;height:${sz}px;left:${cx}px;top:${cy}px;background:${COLORS[i % COLORS.length]};transform:translate(${dx}px,${dy}px)`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1000);
  }
}

// Ripple on flip
function spawnRipple(el) {
  const r = el.getBoundingClientRect();
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position:fixed;border-radius:50%;pointer-events:none;z-index:100;
    width:${r.width}px;height:${r.height}px;
    left:${r.left}px;top:${r.top}px;
    background:rgba(155,93,229,.25);
    transform:scale(0);opacity:1;
    animation:rippleOut .5s ease-out forwards;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
}

// Inject ripple keyframe once
(function injectRippleStyle() {
  const s = document.createElement('style');
  s.textContent = `@keyframes rippleOut{to{transform:scale(1.6);opacity:0}}`;
  document.head.appendChild(s);
})();

// ══════════════════════════════════════════
//  RESULT
// ══════════════════════════════════════════
function showResult() {
  stopBG(); clearTimer(); playWin();
  document.getElementById('fA').textContent = state.sA;
  document.getElementById('fB').textContent = state.sB;
  document.getElementById('fdA').textContent = `${state.okA} benar · ${state.bonA} bonus`;
  document.getElementById('fdB').textContent = `${state.okB} benar · ${state.bonB} bonus`;
  const wt = document.getElementById('winTitle'), te = document.getElementById('trophyEmoji');
  if (state.sA > state.sB) {
    wt.textContent = 'TIM A MENANG! 🔴'; wt.className = 'win-title win-a'; te.textContent = '🔴🏆🎉';
    document.getElementById('resMsg').textContent = `Tim A unggul dengan selisih ${state.sA - state.sB} poin. Luar biasa Tim A!`;
  } else if (state.sB > state.sA) {
    wt.textContent = 'TIM B MENANG! 🔵'; wt.className = 'win-title win-b'; te.textContent = '🔵🏆🎉';
    document.getElementById('resMsg').textContent = `Tim B unggul dengan selisih ${state.sB - state.sA} poin. Keren sekali Tim B!`;
  } else {
    wt.textContent = 'SERI! DRAW! 🤝'; wt.className = 'win-title win-draw'; te.textContent = '🤝🏆🤝';
    document.getElementById('resMsg').textContent = 'Skor imbang sempurna! Kedua tim sama hebatnya. Main lagi untuk menentukan pemenang!';
  }
  show('result');
  // Multi-burst confetti
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const fake = { getBoundingClientRect: () => ({
        left: window.innerWidth * (.2 + Math.random() * .6),
        top: window.innerHeight * (.2 + Math.random() * .4),
        width: 0, height: 0,
      })};
      spawnParticles(fake);
    }, i * 300);
  }
}
