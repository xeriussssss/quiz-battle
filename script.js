/* ============================================================
   QUIZZ BATTLE — script.js
   ============================================================ */

// ===== STARS =====
(function () {
  var container = document.getElementById('starsContainer');
  for (var i = 0; i < 80; i++) {
    var s = document.createElement('div');
    s.className = 'star';
    var d = (2 + Math.random() * 4).toFixed(1) + 's';
    s.style.cssText =
      'left:' + Math.random() * 100 + '%;' +
      'top:' + Math.random() * 100 + '%;' +
      '--d:' + d + ';' +
      'animation-delay:' + Math.random() * 4 + 's;' +
      'opacity:' + (0.1 + Math.random() * 0.5) + ';';
    container.appendChild(s);
  }
})();

// ===== ENTRANCE ANIMATIONS =====
window.addEventListener('DOMContentLoaded', function () {
  // Fade in setup screen
  var setup = document.getElementById('setup');
  requestAnimationFrame(function () {
    setup.classList.add('visible');
  });

  // Pop in title
  setTimeout(function () {
    var title = document.querySelector('.big-title');
    if (title) title.classList.add('visible');
  }, 100);

  // Slide in team cards
  setTimeout(function () {
    document.querySelectorAll('.team-setup').forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('slide-in');
      }, i * 150);
    });
  }, 400);

  // Rules list staggered appearance
  var ruleItems = document.querySelectorAll('.rules-box li');
  ruleItems.forEach(function (li, i) {
    li.style.opacity = '0';
    li.style.transform = 'translateX(-15px)';
    li.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    setTimeout(function () {
      li.style.opacity = '1';
      li.style.transform = 'translateX(0)';
    }, 900 + i * 80);
  });
});

// ===== RIPPLE EFFECT on Play Button =====
document.querySelector('.play-btn').addEventListener('click', function (e) {
  var btn = this;
  var ripple = document.createElement('span');
  ripple.classList.add('ripple');
  var rect = btn.getBoundingClientRect();
  var size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  btn.appendChild(ripple);
  setTimeout(function () { ripple.remove(); }, 600);
});

// ===== 20 QUESTIONS =====
var BOXES = [
  { type: 'tf', typeLabel: 'Benar / Salah', color: '#06D6A0', icon: '🧠',
    q: 'Microsoft PowerPoint adalah perangkat lunak Microsoft Office yang digunakan untuk membuat presentasi visual berupa slide.',
    ans: true, exp: 'BENAR! PowerPoint memang digunakan untuk membuat presentasi visual. Berbeda dengan Excel (angka) atau Word (dokumen teks).' },

  { type: 'mc', typeLabel: 'Pilihan Ganda', color: '#3A86FF', icon: '🎯',
    q: 'Apa nama fitur di PowerPoint yang memberikan efek animasi saat PERPINDAHAN dari satu slide ke slide lain?',
    opts: ['Animations', 'Hyperlink', 'Transition', 'Slide Show'], ans: 2,
    exp: 'TRANSITION! Transisi = efek perpindahan antar slide. Jangan tertukar dengan Animations yang untuk objek DI DALAM slide.' },

  { type: 'img', typeLabel: 'Tebak Gambar', color: '#FFD23F', icon: '🖼️',
    q: 'Perhatikan bagian ini! Berisi deretan tab: Home | Insert | Design | Transitions | Animations | Slide Show | View. Apa nama bagian tersebut?',
    imgEmoji: '📌', imgDesc: '[ Home | Insert | Design | Transitions | Animations | Slide Show | View ]',
    opts: ['Status Bar', 'Quick Access Toolbar', 'Ribbon', 'Slide Navigation Panel'], ans: 2,
    exp: 'RIBBON! Ribbon adalah kumpulan tab di bagian ATAS antarmuka PowerPoint yang berisi semua perintah utama.' },

  { type: 'tf', typeLabel: 'Benar / Salah', color: '#06D6A0', icon: '🧠',
    q: 'Tombol F5 pada keyboard digunakan untuk memulai Slide Show dari slide PERTAMA.',
    ans: true, exp: 'BENAR! F5 = presentasi dari slide pertama. Shift+F5 = dari slide yang sedang aktif saat ini.' },

  { type: 'img', typeLabel: 'Tebak Gambar', color: '#FFD23F', icon: '🖼️',
    q: 'Gambar menunjukkan slide yang sudah diberikan tema warna-warni dan background cantik. Fitur PowerPoint apa yang digunakan?',
    imgEmoji: '🎨', imgDesc: '[ Slide dengan tema warna-warni, background gradien, font profesional ]',
    opts: ['Layout', 'Animations', 'Design', 'Hyperlink'], ans: 2,
    exp: 'DESIGN! Tab Design digunakan untuk memilih tema (themes) dan mengatur tampilan latar belakang (background) seluruh slide.' },

  { type: 'mc', typeLabel: 'Pilihan Ganda', color: '#3A86FF', icon: '🎯',
    q: 'Quick Access Toolbar pada PowerPoint berisi kumpulan tombol apa saja?',
    opts: ['Home, Insert, Design', 'Minimize, Maximize, Close', 'Save, Undo, Redo', 'Font, Paragraph, Drawing'], ans: 2,
    exp: 'SAVE, UNDO, REDO! Quick Access Toolbar ada di pojok kiri atas, berisi tombol-tombol yang paling sering dipakai.' },

  { type: 'img', typeLabel: 'Tebak Gambar', color: '#FFD23F', icon: '🖼️',
    q: 'Tampilan di bawah menunjukkan teks bergaris bawah biru yang bisa diklik untuk membuka file atau website. Apa nama fitur ini?',
    imgEmoji: '🔗', imgDesc: '[ Teks "Klik Disini" → garis bawah biru → mengarah ke website/file ]',
    opts: ['Animations', 'Hyperlink', 'Transition', 'New Slide'], ans: 1,
    exp: 'HYPERLINK! Hyperlink menghubungkan ke file, email, slide lain, atau website agar presenter bisa langsung membukanya saat presentasi.' },

  { type: 'mc', typeLabel: 'Pilihan Ganda', color: '#3A86FF', icon: '🎯',
    q: 'Fitur Animations pada PowerPoint digunakan untuk?',
    opts: ['Efek perpindahan antar slide', 'Mengatur tema dan background', 'Efek gerak pada teks/gambar DI DALAM slide', 'Menghubungkan ke website'], ans: 2,
    exp: 'EFEK GERAK OBJEK DI DALAM SLIDE! Animations untuk teks/gambar dalam slide. Beda dengan Transition untuk perpindahan slide.' },

  { type: 'imgfunc', typeLabel: 'Tebak Fungsi', color: '#8338EC', icon: '🔮',
    q: 'Perhatikan menu ini. Terdapat pilihan "From Beginning" dan "From Current Slide". Apa fungsi menu ini?',
    imgEmoji: '▶️', imgDesc: '[ Tab SLIDE SHOW → Start Slide Show → From Beginning | From Current Slide ]',
    opts: ['Mengatur tema awal dan akhir presentasi', 'Menentukan dari slide mana presentasi akan dimulai', 'Menyimpan file dari awal atau slide tertentu', 'Mengatur animasi awal dan akhir pada slide'], ans: 1,
    exp: '"From Beginning" (F5) = mulai dari slide pertama. "From Current Slide" (Shift+F5) = mulai dari slide yang sedang aktif.' },

  { type: 'mc', typeLabel: 'Pilihan Ganda', color: '#3A86FF', icon: '🎯',
    q: '"Apply to All" pada menu Transition berfungsi untuk?',
    opts: ['Menghapus semua efek transisi', 'Menerapkan transisi ke SELURUH slide sekaligus', 'Mengunci animasi agar tidak berubah', 'Membuat slide baru otomatis'], ans: 1,
    exp: '"Apply to All" = menerapkan setting transisi aktif ke semua slide dalam satu klik. Praktis agar semua slide seragam!' },

  { type: 'tf', typeLabel: 'Benar / Salah', color: '#06D6A0', icon: '🧠',
    q: 'Transition digunakan untuk memberi efek gerak pada teks dan gambar yang ada di DALAM slide.',
    ans: false, exp: 'SALAH! Transition = efek perpindahan ANTAR SLIDE. Efek gerak untuk objek di dalam slide menggunakan ANIMATIONS.' },

  { type: 'mc', typeLabel: 'Pilihan Ganda', color: '#3A86FF', icon: '🎯',
    q: 'Apa fungsi menu "Effect Option" pada tab Transitions?',
    opts: ['Mengatur kecepatan animasi objek', 'Mengatur ARAH datangnya efek transisi', 'Mengganti tema slide', 'Menambahkan suara latar'], ans: 1,
    exp: 'Effect Option mengatur ARAH datangnya efek transisi — dari kiri, kanan, atas, atau bawah.' },

  { type: 'img', typeLabel: 'Tebak Gambar', color: '#FFD23F', icon: '🖼️',
    q: 'Gambar menampilkan panel kecil di SISI KIRI layar yang berisi miniatur semua slide. Apa nama panel ini?',
    imgEmoji: '📋', imgDesc: '[ Panel kiri → miniatur slide 1, 2, 3, 4... (Slide 2 disorot aktif) ]',
    opts: ['Ribbon', 'Scroll Bar', 'Slide Navigation Panel', 'Status Bar'], ans: 2,
    exp: 'SLIDE NAVIGATION PANEL! Panel di sisi kiri yang menampilkan miniatur semua slide.' },

  { type: 'tf', typeLabel: 'Benar / Salah', color: '#06D6A0', icon: '🧠',
    q: 'Hyperlink pada PowerPoint hanya bisa digunakan untuk menghubungkan ke website saja.',
    ans: false, exp: 'SALAH! Hyperlink bisa ke: file/folder di komputer, halaman web, slide lain, dan alamat email.' },

  { type: 'mc', typeLabel: 'Pilihan Ganda', color: '#3A86FF', icon: '🎯',
    q: 'Dalam membuat Hyperlink, pilihan "Place in This Document" digunakan untuk?',
    opts: ['Menghubungkan ke website', 'Menghubungkan ke slide LAIN dalam file PPT yang sama', 'Membuat dokumen baru', 'Mengirim email otomatis'], ans: 1,
    exp: '"Place in This Document" = navigasi ke slide lain dalam file PPT yang sama.' },

  { type: 'img', typeLabel: 'Tebak Gambar', color: '#FFD23F', icon: '🖼️',
    q: 'Gambar menunjukkan kotak teks dengan berbagai pilihan tata letak (layout). Apa nama fitur ini?',
    imgEmoji: '📐', imgDesc: '[ Pilihan layout: Title Slide | Title and Content | Two Content | Blank | Picture with Caption ]',
    opts: ['Design Themes', 'Layout', 'Animations', 'Slide Show'], ans: 1,
    exp: 'LAYOUT! Layout mengatur tata letak elemen di slide — judul, isi teks, gambar, dll. Ada di Home → Layout.' },

  { type: 'tf', typeLabel: 'Benar / Salah', color: '#06D6A0', icon: '🧠',
    q: 'Microsoft PowerPoint termasuk dalam paket aplikasi Microsoft Office.',
    ans: true, exp: 'BENAR! PowerPoint adalah bagian dari Microsoft Office bersama Word, Excel, dan Outlook.' },

  { type: 'mc', typeLabel: 'Pilihan Ganda', color: '#3A86FF', icon: '🎯',
    q: 'Apa nama perangkat lunak yang digunakan untuk membuat presentasi dalam modul ini?',
    opts: ['Microsoft Excel', 'Microsoft Word', 'Microsoft PowerPoint', 'Microsoft Access'], ans: 2,
    exp: 'MICROSOFT POWERPOINT! Aplikasi presentasi dari Microsoft Office.' },

  { type: 'imgfunc', typeLabel: 'Tebak Fungsi', color: '#8338EC', icon: '🔮',
    q: 'Perhatikan grup timing berikut: Sound, Duration, Apply to All. Apa fungsi "Duration" pada grup ini?',
    imgEmoji: '⏱️', imgDesc: '[ Grup Timing: Sound ▼ | Duration: 02.00 | ☑ Apply to All ]',
    opts: ['Mengatur efek suara saat transisi', 'Mengatur BERAPA LAMA efek transisi berlangsung', 'Menerapkan transisi ke semua slide', 'Mengatur kecepatan animasi teks'], ans: 1,
    exp: '"Duration" mengatur lama waktu efek transisi berlangsung (dalam detik).' },

  { type: 'mc', typeLabel: 'Pilihan Ganda', color: '#3A86FF', icon: '🎯',
    q: 'Menurut modul, di bidang apa saja Microsoft PowerPoint digunakan?',
    opts: ['Hanya dunia pendidikan saja', 'Hanya perkantoran dan bisnis', 'Perkantoran, pemerintahan, dan pendidikan', 'Hanya untuk presentasi ilmiah'], ans: 2,
    exp: 'PowerPoint digunakan hampir di SEMUA BIDANG: perkantoran, pemerintahan, dan dunia pendidikan!' },
];

// ===== TIEBREAKER QUESTION =====
var TIEBREAKER = {
  type: 'mc',
  q: 'Apa ekstensi file default yang digunakan oleh Microsoft PowerPoint 2010 ke atas?',
  opts: ['.ppt', '.pptx', '.ppsx', '.pps'],
  ans: 1,
  exp: 'File PowerPoint modern menggunakan ekstensi .pptx (PowerPoint XML format). Format lama .ppt digunakan di PowerPoint 2003 ke bawah.'
};

// ===== STATE =====
var nameA = 'Kelompok A', nameB = 'Kelompok B';
var scoreA = 0, scoreB = 0, boxesA = 0, boxesB = 0;
var boxState = [];
var activeBox = null, awaitingRival = false;
var gameInterval = null, secondsLeft = 15 * 60;
var musicOn = true;

// ===== AUDIO — HTML5 Audio with uploaded music file =====
var bgAudio = null;

function initBGAudio() {
  if (!bgAudio) {
    bgAudio = new Audio('bgmusic.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.5;
  }
}

function startBGMusic() {
  initBGAudio();
  if (musicOn && bgAudio.paused) {
    var playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () {
        // Autoplay blocked — user needs to interact first
      });
    }
  }
  updateMusicBtn();
}

function stopBGMusic() {
  if (bgAudio && !bgAudio.paused) {
    bgAudio.pause();
    bgAudio.currentTime = 0;
  }
}

function toggleMusic() {
  musicOn = !musicOn;
  if (musicOn) {
    startBGMusic();
  } else {
    if (bgAudio) bgAudio.pause();
  }
  updateMusicBtn();
}

function updateMusicBtn() {
  var btn = document.getElementById('musicBtn');
  if (musicOn) {
    btn.textContent = '🎵';
    btn.classList.add('playing');
  } else {
    btn.textContent = '🔇';
    btn.classList.remove('playing');
  }
}

// ===== SFX via Web Audio API =====
var audioCtx = null;
function getCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  }
  return audioCtx;
}

function playTone(f, d, t, v) {
  var ctx = getCtx(); if (!ctx) return;
  var o = ctx.createOscillator(), g = ctx.createGain();
  o.type = t || 'sine'; o.frequency.value = f;
  g.gain.setValueAtTime(v || 0.12, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d);
  o.connect(g); g.connect(ctx.destination);
  o.start(); o.stop(ctx.currentTime + d);
}

function playClick()   { playTone(900, 0.06, 'square', 0.08); }
function playCorrect() { [523,659,784,1047,1319].forEach(function(f,i){setTimeout(function(){playTone(f,0.15,'sine',0.18);},i*80);}); }
function playWrong()   { [250,180,140].forEach(function(f,i){setTimeout(function(){playTone(f,0.22,'sawtooth',0.14);},i*120);}); }
function playReveal()  { [350,500,700,900].forEach(function(f,i){setTimeout(function(){playTone(f,0.12,'triangle',0.1);},i*60);}); }
function playWin()     { [523,659,784,523,659,784,1047,784,880,1047].forEach(function(f,i){setTimeout(function(){playTone(f,0.22,'sine',0.18);},i*90);}); }
function playHangus()  { [300,220,180,150].forEach(function(f,i){setTimeout(function(){playTone(f,0.3,'sawtooth',0.1);},i*100);}); }
function playTie()     { [392,440,494,523,494,440].forEach(function(f,i){setTimeout(function(){playTone(f,0.2,'sine',0.16);},i*100);}); }

// ===== START GAME =====
function startGame() {
  nameA = document.getElementById('nameA').value || 'Kelompok A';
  nameB = document.getElementById('nameB').value || 'Kelompok B';
  scoreA = 0; scoreB = 0; boxesA = 0; boxesB = 0;
  boxState = BOXES.map(function () { return null; });
  activeBox = null; awaitingRival = false; secondsLeft = 15 * 60;

  document.getElementById('dispNameA').textContent = nameA;
  document.getElementById('dispNameB').textContent = nameB;
  document.getElementById('fnA').textContent = nameA;
  document.getElementById('fnB').textContent = nameB;
  updateScores();

  // Page transition animation
  var setup = document.getElementById('setup');
  setup.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  setup.style.opacity = '0';
  setup.style.transform = 'scale(0.95)';

  setTimeout(function () {
    setup.style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('tiebreaker-screen').style.display = 'none';

    var game = document.getElementById('game');
    game.style.display = 'block';
    game.style.opacity = '0';
    game.style.transform = 'translateY(20px)';
    game.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    requestAnimationFrame(function () {
      game.style.opacity = '1';
      game.style.transform = 'translateY(0)';
    });

    buildGrid();
    startTimer();
    startBGMusic();
    setTurnBar('waiting');
  }, 400);
}

function buildGrid() {
  var grid = document.getElementById('boxGrid');
  grid.innerHTML = '';
  BOXES.forEach(function (b, i) {
    var d = document.createElement('div');
    d.className = 'box available';
    d.id = 'box' + i;
    d.innerHTML =
      '<div class="box-icon">' + b.icon + '</div>' +
      '<div class="box-num">' + (i + 1) + '</div>' +
      '<div class="box-type">' + b.typeLabel + '</div>';
    d.onclick = function () { openBox(i); };

    // Staggered reveal animation
    var delay = i * 50;
    setTimeout(function () {
      d.classList.add('box-revealed');
    }, delay);

    grid.appendChild(d);
  });
}

function startTimer() {
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(function () {
    secondsLeft--;
    var m = Math.floor(secondsLeft / 60), s = secondsLeft % 60;
    var el = document.getElementById('timerDisplay');
    el.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    el.className = 'timer-val' + (secondsLeft <= 30 ? ' urgent' : '');
    if (secondsLeft <= 30 && musicOn) playTone(880, 0.05, 'square', 0.06);
    if (secondsLeft <= 0) { clearInterval(gameInterval); stopBGMusic(); endGame(); }
  }, 1000);
}

function setTurnBar(state, msg) {
  var el = document.getElementById('turnBar');
  var ca = document.getElementById('cardA'), cb = document.getElementById('cardB');
  ca.classList.remove('active-team-a', 'active-team-b');
  cb.classList.remove('active-team-a', 'active-team-b');

  if (state === 'A') {
    el.className = 'turn-bar ta-turn';
    el.textContent = '🔵 ' + nameA + (msg ? ' — ' + msg : ' giliran memilih!');
    ca.classList.add('active-team-a');
  } else if (state === 'B') {
    el.className = 'turn-bar tb-turn';
    el.textContent = '🔴 ' + nameB + (msg ? ' — ' + msg : ' giliran memilih!');
    cb.classList.add('active-team-b');
  } else {
    el.className = 'turn-bar waiting';
    el.textContent = msg || '⚡ Pilih kotak...';
  }
}

function updateScores() {
  var elSA = document.getElementById('scoreA');
  var elSB = document.getElementById('scoreB');
  elSA.textContent = scoreA;
  elSB.textContent = scoreB;
  document.getElementById('boxesA').textContent = boxesA + ' kotak';
  document.getElementById('boxesB').textContent = boxesB + ' kotak';
}

function openBox(i) {
  if (boxState[i] !== null) return;
  playReveal();
  activeBox = i; awaitingRival = false;
  document.getElementById('box' + i).classList.add('active-q');
  showModal(BOXES[i], i, false);
}

function hexToRgb(hex) {
  var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return r + ',' + g + ',' + b;
}

function showModal(b, i, isRival) {
  var badge = document.getElementById('mTypeBadge');
  badge.textContent = b.typeLabel;
  badge.style.background = 'rgba(' + hexToRgb(b.color) + ',0.18)';
  badge.style.border = '1.5px solid ' + b.color;
  badge.style.color = b.color;
  document.getElementById('mBoxNum').textContent = 'Kotak ' + (i + 1);

  var body = document.getElementById('mQBody');
  body.innerHTML = '';
  document.getElementById('mFeedback').style.display = 'none';
  document.getElementById('mAnswerReveal').style.display = 'none';
  document.getElementById('mActions').innerHTML = '';

  var qDiv = document.createElement('div');
  qDiv.className = 'modal-q';
  qDiv.textContent = b.q;
  body.appendChild(qDiv);

  if (b.type === 'img' || b.type === 'imgfunc') {
    var imgBox = document.createElement('div');
    imgBox.className = 'img-container';
    imgBox.innerHTML = '<div class="img-fallback">' + b.imgEmoji + '</div><div class="img-label">' + b.imgDesc + '</div>';
    body.appendChild(imgBox);
  }

  if (b.type === 'tf') {
    var row = document.createElement('div'); row.className = 'tf-row';
    var bt = document.createElement('button'); bt.className = 'tf-btn true-btn'; bt.textContent = '✅ BENAR';
    var bf = document.createElement('button'); bf.className = 'tf-btn false-btn'; bf.textContent = '❌ SALAH';
    bt.onclick = function () { processTF(true, bt, bf, b, i, isRival); };
    bf.onclick = function () { processTF(false, bf, bt, b, i, isRival); };
    row.appendChild(bt); row.appendChild(bf); body.appendChild(row);
  } else {
    var grid = document.createElement('div'); grid.className = 'opts-grid';
    b.opts.forEach(function (opt, oi) {
      var btn = document.createElement('button'); btn.className = 'opt-b';
      btn.innerHTML = '<b style="opacity:0.4;margin-right:6px;">' + ['A','B','C','D'][oi] + '.</b>' + opt;
      btn.onclick = function () { processMC(oi, btn, b, i, isRival); };
      grid.appendChild(btn);
    });
    body.appendChild(grid);
  }

  var actions = document.getElementById('mActions');
  if (isRival) {
    var notice = document.createElement('div');
    notice.className = 'rival-notice';
    var rname = awaitingRival === 'A' ? nameA : nameB;
    notice.textContent = '⚡ Kesempatan untuk ' + rname + ' — jawab sekarang!';
    actions.appendChild(notice);
  }
  var closeBtn = document.createElement('button');
  closeBtn.className = 'mab mab-grey';
  closeBtn.textContent = '✕ Tutup';
  closeBtn.style.flex = '0.4';
  closeBtn.onclick = function () { closeModal(false); };
  actions.appendChild(closeBtn);

  document.getElementById('modalBg').className = 'modal-bg show';
}

function processTF(val, btnClicked, btnOther, b, i, isRival) {
  if (btnClicked.disabled) return;
  disableAllOpts();
  var ok = val === b.ans;
  btnClicked.classList.add(ok ? 'correct' : 'wrong');
  handleResult(ok, b, i, isRival);
}

function processMC(oi, btn, b, i, isRival) {
  if (btn.disabled) return;
  disableAllOpts();
  var ok = oi === b.ans;
  btn.classList.add(ok ? 'correct' : 'wrong');
  handleResult(ok, b, i, isRival);
}

function disableAllOpts() {
  document.querySelectorAll('.opt-b,.tf-btn').forEach(function (el) { el.disabled = true; });
}

function handleResult(ok, b, i, isRival) {
  var fb = document.getElementById('mFeedback');
  var actions = document.getElementById('mActions');
  actions.innerHTML = '';

  if (ok) {
    playCorrect();
    fb.className = 'feedback correct';
    fb.style.display = 'block';
    var winner = isRival ? awaitingRival : null;
    if (winner) {
      var wname = winner === 'A' ? nameA : nameB;
      fb.textContent = '🎉 BENAR! Kotak berhasil direbut ' + wname + '! +10 poin — ' + b.exp;
      awardBox(winner, i);
      triggerBuzz('🎉 ' + wname + ' +10!', winner === 'A' ? '#3A86FF' : '#FF006E');
      triggerConfetti();
      var cont = document.createElement('button');
      cont.className = 'mab mab-grey'; cont.textContent = '✓ Lanjutkan'; cont.style.flex = '1';
      cont.onclick = function () { closeModal(true); };
      actions.appendChild(cont);
    } else {
      fb.textContent = '🎉 BENAR! Pilih tim yang menjawab untuk memberi poin!';
      var ba = document.createElement('button'); ba.className = 'mab mab-a';
      ba.textContent = '🔵 ' + nameA + ' Benar! +10';
      ba.onclick = function () { awardBox('A', i); triggerBuzz('🔵 ' + nameA + ' +10!', '#3A86FF'); triggerConfetti(); closeModal(true); };
      var bb = document.createElement('button'); bb.className = 'mab mab-b';
      bb.textContent = '🔴 ' + nameB + ' Benar! +10';
      bb.onclick = function () { awardBox('B', i); triggerBuzz('🔴 ' + nameB + ' +10!', '#FF006E'); triggerConfetti(); closeModal(true); };
      actions.appendChild(ba); actions.appendChild(bb);
    }
  } else {
    playWrong();
    fb.className = 'feedback wrong'; fb.style.display = 'block';
    if (!isRival) {
      fb.textContent = '❌ Salah! Tim lawan boleh mencoba menjawab soal ini!';
      var bra = document.createElement('button'); bra.className = 'mab mab-a';
      bra.textContent = '🔵 ' + nameA + ' Coba Jawab';
      bra.onclick = function () { awaitingRival = 'A'; showModal(b, i, true); };
      var brb = document.createElement('button'); brb.className = 'mab mab-b';
      brb.textContent = '🔴 ' + nameB + ' Coba Jawab';
      brb.onclick = function () { awaitingRival = 'B'; showModal(b, i, true); };
      var bno = document.createElement('button'); bno.className = 'mab mab-grey';
      bno.textContent = '🚫 Tidak Ada yang Jawab';
      bno.onclick = function () { markHangus(b, i); };
      actions.appendChild(bra); actions.appendChild(brb); actions.appendChild(bno);
    } else {
      fb.textContent = '❌ Kedua tim salah! Kotak ini HANGUS 🚫!';
      document.getElementById('mAnswerVal').textContent = b.type === 'tf' ? (b.ans ? 'BENAR' : 'SALAH') : b.opts[b.ans];
      document.getElementById('mAnswerReveal').style.display = 'block';
      var bc = document.createElement('button'); bc.className = 'mab mab-grey';
      bc.textContent = '✓ Tutup'; bc.style.flex = '1';
      bc.onclick = function () { markHangus(b, i); };
      actions.appendChild(bc);
    }
  }
}

function awardBox(team, i) {
  var el = document.getElementById('box' + i);
  if (team === 'A') {
    scoreA += 10; boxesA++; boxState[i] = 'A';
    el.className = 'box taken-a box-revealed';
    el.innerHTML = '<div class="box-owner">A</div><div class="box-num">' + (i+1) + '</div>';
    // Flash animation
    setTimeout(function() { el.classList.add('flash-a'); }, 50);
    setTimeout(function() { el.classList.remove('flash-a'); }, 600);
    setTurnBar('A', 'pilih kotak berikutnya!');
    // Score bump
    var sEl = document.getElementById('scoreA');
    sEl.classList.remove('bump');
    void sEl.offsetWidth;
    sEl.classList.add('bump');
  } else {
    scoreB += 10; boxesB++; boxState[i] = 'B';
    el.className = 'box taken-b box-revealed';
    el.innerHTML = '<div class="box-owner">B</div><div class="box-num">' + (i+1) + '</div>';
    setTimeout(function() { el.classList.add('flash-b'); }, 50);
    setTimeout(function() { el.classList.remove('flash-b'); }, 600);
    setTurnBar('B', 'pilih kotak berikutnya!');
    var sElB = document.getElementById('scoreB');
    sElB.classList.remove('bump');
    void sElB.offsetWidth;
    sElB.classList.add('bump');
  }
  updateScores();
}

function markHangus(b, i) {
  playHangus();
  boxState[i] = 'X';
  var el = document.getElementById('box' + i);
  el.className = 'box hangus box-revealed';
  el.onclick = null;
  el.innerHTML = '<div class="hangus-overlay"><span>🚫</span><div class="hangus-text">Hangus</div></div>';
  document.getElementById('mAnswerVal').textContent = b.type === 'tf' ? (b.ans ? 'BENAR' : 'SALAH') : b.opts[b.ans];
  document.getElementById('mAnswerReveal').style.display = 'block';
  setTimeout(function () { closeModal(false); }, 2200);
}

function closeModal(wasCorrect) {
  document.getElementById('modalBg').className = 'modal-bg';
  if (activeBox !== null) {
    var el = document.getElementById('box' + activeBox);
    if (el) el.classList.remove('active-q');
  }
  activeBox = null; awaitingRival = false;
  var allDone = boxState.every(function (s) { return s !== null; });
  if (allDone) { clearInterval(gameInterval); stopBGMusic(); endGame(); }
}

function endGame() {
  clearInterval(gameInterval); stopBGMusic();
  document.getElementById('modalBg').className = 'modal-bg';

  var game = document.getElementById('game');
  game.style.transition = 'opacity 0.4s ease';
  game.style.opacity = '0';

  setTimeout(function () {
    game.style.display = 'none';
    if (boxesA === boxesB) {
      showTiebreaker();
      return;
    }
    showResult();
  }, 400);
}

// ===== TIEBREAKER =====
function showTiebreaker() {
  playTie();
  var ts = document.getElementById('tiebreaker-screen');
  ts.style.display = 'flex'; ts.style.flexDirection = 'column';
  document.getElementById('tie-sub-text').textContent =
    nameA + ' dan ' + nameB + ' sama-sama ' + boxesA + ' kotak! Satu soal penentu pemenang!';

  var tb = TIEBREAKER;
  document.getElementById('tie-q-text').textContent = tb.q;
  document.getElementById('tie-q-body').innerHTML = '';
  document.getElementById('tie-feedback').style.display = 'none';
  document.getElementById('tie-answer-reveal').style.display = 'none';
  document.getElementById('tie-actions').innerHTML = '';

  var body = document.getElementById('tie-q-body');
  if (tb.type === 'tf') {
    var row = document.createElement('div'); row.className = 'tie-tf-row';
    var bt = document.createElement('button'); bt.className = 'tie-tf-btn true-btn'; bt.textContent = '✅ BENAR';
    var bf = document.createElement('button'); bf.className = 'tie-tf-btn false-btn'; bf.textContent = '❌ SALAH';
    bt.onclick = function () { processTieTF(true, bt, bf, tb); };
    bf.onclick = function () { processTieTF(false, bf, bt, tb); };
    row.appendChild(bt); row.appendChild(bf); body.appendChild(row);
  } else {
    var grid = document.createElement('div'); grid.className = 'tie-opts-grid';
    tb.opts.forEach(function (opt, oi) {
      var btn = document.createElement('button'); btn.className = 'tie-opt';
      btn.innerHTML = '<b style="opacity:0.4;margin-right:6px;">' + ['A','B','C','D'][oi] + '.</b>' + opt;
      btn.onclick = function () { processTieMC(oi, btn, tb); };
      grid.appendChild(btn);
    });
    body.appendChild(grid);
  }
  triggerConfetti();
}

function processTieTF(val, btnClicked, btnOther, tb) {
  if (btnClicked.disabled) return;
  document.querySelectorAll('.tie-tf-btn,.tie-opt').forEach(function (el) { el.disabled = true; });
  var ok = val === tb.ans;
  btnClicked.classList.add(ok ? 'correct' : 'wrong');
  handleTieResult(ok, tb);
}

function processTieMC(oi, btn, tb) {
  if (btn.disabled) return;
  document.querySelectorAll('.tie-opt,.tie-tf-btn').forEach(function (el) { el.disabled = true; });
  var ok = oi === tb.ans;
  btn.classList.add(ok ? 'correct' : 'wrong');
  handleTieResult(ok, tb);
}

function handleTieResult(ok, tb) {
  var fb = document.getElementById('tie-feedback');
  var actions = document.getElementById('tie-actions');
  actions.innerHTML = '';
  if (ok) {
    playCorrect();
    fb.className = 'tie-feedback correct'; fb.style.display = 'block';
    fb.textContent = '🎉 BENAR! Pilih tim yang menjawab lebih cepat!';
    var ba = document.createElement('button'); ba.className = 'tie-award-a'; ba.textContent = '🔵 ' + nameA + ' Menang!';
    ba.onclick = function () { declareTieWinner('A'); };
    var bb = document.createElement('button'); bb.className = 'tie-award-b'; bb.textContent = '🔴 ' + nameB + ' Menang!';
    bb.onclick = function () { declareTieWinner('B'); };
    actions.appendChild(ba); actions.appendChild(bb);
    triggerConfetti();
  } else {
    playWrong();
    fb.className = 'tie-feedback wrong'; fb.style.display = 'block';
    fb.textContent = '❌ Salah! ' + tb.exp;
    document.getElementById('tie-answer-val').textContent = tb.opts ? tb.opts[tb.ans] : (tb.ans ? 'BENAR' : 'SALAH');
    document.getElementById('tie-answer-reveal').style.display = 'block';
    var bra = document.createElement('button'); bra.className = 'tie-award-a'; bra.textContent = '🔵 ' + nameA + ' Jawab Lebih Cepat';
    bra.onclick = function () { declareTieWinner('A'); };
    var brb = document.createElement('button'); brb.className = 'tie-award-b'; brb.textContent = '🔴 ' + nameB + ' Jawab Lebih Cepat';
    brb.onclick = function () { declareTieWinner('B'); };
    var bsame = document.createElement('button');
    bsame.style.cssText = 'background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);color:#666;border-radius:12px;padding:12px 20px;font-size:14px;font-weight:800;cursor:pointer;font-family:Nunito,sans-serif;';
    bsame.textContent = '🤝 Tetap Seri';
    bsame.onclick = function () { declareTieWinner(null); };
    actions.appendChild(bra); actions.appendChild(brb); actions.appendChild(bsame);
  }
}

function declareTieWinner(winner) {
  document.getElementById('tiebreaker-screen').style.display = 'none';
  if (winner === 'A') { boxesA += 1; scoreA += 10; }
  else if (winner === 'B') { boxesB += 1; scoreB += 10; }
  showResult();
}

function showResult() {
  var rs = document.getElementById('result-screen');
  rs.style.display = 'flex'; rs.style.flexDirection = 'column';
  rs.style.opacity = '0'; rs.style.transform = 'scale(0.9)';
  rs.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  requestAnimationFrame(function () {
    rs.style.opacity = '1'; rs.style.transform = 'scale(1)';
  });

  document.getElementById('fsA').textContent = scoreA;
  document.getElementById('fsB').textContent = scoreB;
  document.getElementById('fbA').textContent = boxesA + ' kotak';
  document.getElementById('fbB').textContent = boxesB + ' kotak';

  var trophy, title, msg;
  var fcA = document.getElementById('fcA'), fcB = document.getElementById('fcB');
  fcA.classList.remove('winner-glow-a', 'winner-glow-b');
  fcB.classList.remove('winner-glow-a', 'winner-glow-b');

  if (boxesA > boxesB) {
    trophy = '🏆'; title = nameA + ' MENANG!'; msg = 'Selamat ' + nameA + '! Berhasil merebut kotak terbanyak! 🎉';
    fcA.classList.add('winner-glow-a');
  } else if (boxesB > boxesA) {
    trophy = '🏆'; title = nameB + ' MENANG!'; msg = 'Selamat ' + nameB + '! Kalian luar biasa! 🎉';
    fcB.classList.add('winner-glow-b');
  } else {
    trophy = '🤝'; title = 'SERI SEMPURNA!'; msg = 'Kedua tim hebat! Sama-sama ' + boxesA + ' kotak!';
  }

  document.getElementById('winTrophy').textContent = trophy;
  document.getElementById('winTitle').textContent = title;
  document.getElementById('winMsg').textContent = msg;
  playWin(); triggerConfetti();
  setTimeout(triggerConfetti, 400);
  setTimeout(triggerConfetti, 800);
}

function resetGame() {
  stopBGMusic();
  document.getElementById('result-screen').style.display = 'none';
  document.getElementById('tiebreaker-screen').style.display = 'none';

  var setup = document.getElementById('setup');
  setup.style.display = 'flex';
  setup.style.opacity = '0';
  setup.style.transform = 'scale(0.95)';
  setup.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  requestAnimationFrame(function () {
    setup.style.opacity = '1';
    setup.style.transform = 'scale(1)';
  });
}

function triggerBuzz(text, color) {
  var el = document.getElementById('buzzMsg');
  el.textContent = text; el.style.color = color; el.style.borderColor = color;
  el.className = 'buzz-msg'; void el.offsetWidth; el.className = 'buzz-msg show';
}

function triggerConfetti() {
  var colors = ['#FF6B35','#FFD23F','#3A86FF','#8338EC','#06D6A0','#FF006E','#fff'];
  for (var i = 0; i < 30; i++) {
    var p = document.createElement('div');
    p.className = 'cf';
    var c = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText =
      'left:' + Math.random() * 100 + 'vw;' +
      'top:-10px;' +
      'background:' + c + ';' +
      'border-radius:' + (Math.random() > 0.5 ? '50%' : '3px') + ';' +
      '--d:' + (1.5 + Math.random()) + 's;' +
      '--dl:' + Math.random() * 0.5 + 's;' +
      'width:' + (7 + Math.random() * 6) + 'px;' +
      'height:' + (7 + Math.random() * 6) + 'px;';
    document.body.appendChild(p);
    setTimeout(function (pp) { return function () { pp.remove(); }; }(p), 2500);
  }
}
