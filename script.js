// ====== Config ======
const CORRECT_VALUE = "2ปี1เดือน"; // คำตอบที่ถูกต้อง (ตรงกับ value ของ input)
const QUIZ_CARD_ID = "quiz-card";
const VIDEO_SECTION_ID = "video-section";
const FEEDBACK_ID = "feedback";
const CONFETTI_ID = "confetti";

// ====== Elements ======
const quizForm = document.getElementById("quiz-form");
const feedbackEl = document.getElementById(FEEDBACK_ID);
const quizCard = document.getElementById(QUIZ_CARD_ID);
const videoSection = document.getElementById(VIDEO_SECTION_ID);
const confettiCanvas = document.getElementById(CONFETTI_ID);

// ====== Helpers ======
const show = (el) => el.classList.remove("hidden");
const hide = (el) => el.classList.add("hidden");

// คอนเฟตตี้อย่างง่าย
function confettiBurst(durationMs = 1600, count = 120){
  const ctx = confettiCanvas.getContext("2d");
  const W = confettiCanvas.width = window.innerWidth;
  const H = confettiCanvas.height = window.innerHeight;
  const pieces = [];
  const colors = ["#ff6b9a","#7cc6ff","#39d98a","#ffd166","#f78c6c","#c792ea"];

  for(let i=0;i<count;i++){
    pieces.push({
      x: Math.random()*W,
      y: -10 - Math.random()*H*0.5,
      r: 4 + Math.random()*6,
      s: 2 + Math.random()*3,
      a: Math.random()*Math.PI*2,
      c: colors[(Math.random()*colors.length)|0]
    });
  }

  let start = null;
  show(confettiCanvas);

  function tick(ts){
    if(!start) start = ts;
    const t = ts - start;
    ctx.clearRect(0,0,W,H);

    pieces.forEach(p=>{
      p.y += p.s;
      p.x += Math.sin((p.y+p.a)/20);
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    });

    if(t < durationMs){
      requestAnimationFrame(tick);
    }else{
      hide(confettiCanvas);
      ctx.clearRect(0,0,W,H);
    }
  }
  requestAnimationFrame(tick);
}

function showVideo(){
  hide(quizCard);
  show(videoSection);
  confettiBurst();
  // หมายเหตุ: เบราว์เซอร์ส่วนใหญ่ไม่ยอม autoplay เสียงโดยไม่ได้รับ gesture
  // ผู้ชมอาจต้องกด ▶️ ใน iframe เอง ซึ่งโอเคสำหรับ use case นี้
}

function showError(msg){
  feedbackEl.textContent = msg;
  feedbackEl.classList.remove("ok");
  feedbackEl.classList.add("err");
  // effect เขย่าเล็กน้อย
  quizCard.animate(
    [{transform:"translateX(0)"},{transform:"translateX(-6px)"},{transform:"translateX(6px)"},{transform:"translateX(0)"}],
    {duration:220, iterations:1}
  );
}

function showOk(msg){
  feedbackEl.textContent = msg;
  feedbackEl.classList.remove("err");
  feedbackEl.classList.add("ok");
}

// ====== Logic ======
quizForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const data = new FormData(quizForm);
  const picked = data.get("answer");

  if(!picked){
    showError("เลือกคำตอบก่อนนะคะ 💕");
    return;
  }

  // ตรวจคำตอบจาก value (ตรงกับ CORRECT_VALUE)
  if(picked === CORRECT_VALUE){
    showOk("เก่งมาก! ถูกต้องเลย ✨");
    setTimeout(showVideo, 450);
  }else{
    showError("ยังไม่ถูกจ้า ลองใหม่อีกครั้งนะ 💗");
  }
});
