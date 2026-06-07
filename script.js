let state = JSON.parse(localStorage.getItem("muscleGame")) || {
  chest: 0, legs: 0, abs: 0, arms: 0
};

const el = {
  avatar: document.getElementById("avatar"),
  chest: document.getElementById("chest"),
  abs: document.getElementById("abs"),
  armL: document.getElementById("armL"),
  armR: document.getElementById("armR"),
  legL: document.getElementById("legL"),
  legR: document.getElementById("legR")
};

const speech = document.getElementById("speech");
const effect = document.getElementById("evolutionEffect");
const stageText = document.getElementById("stage");

function save() {
  localStorage.setItem("muscleGame", JSON.stringify(state));
}

function getSpeech(type) {
  const lines = {
    chest: ["効いてる！！","大胸筋！！"],
    legs: ["まだいける！","脚きてる！"],
    abs: ["地味にキツい…"],
    arms: ["腕パンパン！"]
  };
  return lines[type][Math.floor(Math.random()*lines[type].length)];
}

function checkBalance() {
  if (state.arms > state.legs * 2) return "⚠ 上半身だけ育ちすぎ！";
  if (state.legs > state.arms * 2) return "⚠ 下半身モンスター";
  return "";
}

function isAwaken(){
  return state.chest + state.legs + state.abs + state.arms > 400;
}

function scale(v){ return 1 + Math.min(v/200,1.5); }

function update(){
  el.chest.setAttribute("transform", `scale(${scale(state.chest)},1)`);
  el.abs.setAttribute("transform", `scale(1,${scale(state.abs)})`);
  el.armL.setAttribute("transform", `scale(${scale(state.arms)},1)`);
  el.armR.setAttribute("transform", `scale(${scale(state.arms)},1)`);
  el.legL.setAttribute("transform", `scale(1,${scale(state.legs)})`);
  el.legR.setAttribute("transform", `scale(1,${scale(state.legs)})`);

  const total = state.chest+state.legs+state.abs+state.arms;

  let stage = 1;
  if(total>500) stage=4;
  else if(total>250) stage=3;
  else if(total>100) stage=2;

  stageText.textContent = ["ヒョロ","成長","筋肉覚醒","完成体"][stage-1];

  if(isAwaken()){
    el.avatar.classList.add("awaken");
  }

  if(checkBalance()){
    el.avatar.classList.add("unbalanced");
  }

  save();
}

function train(type){
  state[type]+=5;

  speech.textContent = getSpeech(type);

  const warn = checkBalance();
  if(warn) speech.textContent += " / "+warn;

  if(isAwaken()) speech.textContent="🔥 覚醒モード 🔥";

  animate(type);
  update();
}

function animate(type){
  el.avatar.className = type;

  setTimeout(()=>{
    el.avatar.className="idle";
  },1000);
}

setInterval(()=>{
  state.chest+=0.2;
  state.legs+=0.2;
  state.abs+=0.2;
  state.arms+=0.2;
  update();
},1000);

update();
