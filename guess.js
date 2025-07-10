// 游戏状态变量
let poems = [];
let answer = '';
let processedAnswer = '';
let remainingAttempts = 20;
let gameOver = false;

// 加载JSON数据
async function loadPoems() {
  try {
    const response = await fetch('poems.json');
    if (!response.ok) throw new Error('数据加载失败');
    poems = await response.json();
    initGame();
  } catch (error) {
    document.getElementById('message').className = 'message error';
    document.getElementById('message').textContent = '错误：无法加载诗句数据';
    console.error(error);
  }
}

// 初始化游戏
function initGame() {
  const randomIndex = Math.floor(Math.random() * poems.length);
  answer = poems[randomIndex];
  processedAnswer = answer.replace('，', '');
  console.log("正确答案（调试用）:", answer);

  remainingAttempts = 20;
  gameOver = false;
  updateUI();
  document.getElementById('guess-input').focus();
}

// 检查答案
function checkGuess() {
  if (gameOver) return;

  const guessInput = document.getElementById('guess-input');
  const guess = guessInput.value.replace(/\s|，|。/g, '');
  const messageDiv = document.getElementById('message');

  // 输入验证
  if (guess.length !== 14) {
    messageDiv.className = 'message error';
    messageDiv.textContent = '必须输入14个汉字！';
    return;
  }

  // 处理尝试
  remainingAttempts--;
  guessInput.value = '';
  updateUI();

  // 创建结果行
  const resultRow = document.createElement('div');
  resultRow.style.marginBottom = '10px';

  // 检查每个字符
  let allCorrect = true;
  for (let i = 0; i < 14; i++) {
    const charBox = document.createElement('div');
    charBox.className = 'char-box';
    charBox.textContent = guess[i];

    if (guess[i] === processedAnswer[i]) {
      charBox.classList.add('green');
    } else if (processedAnswer.includes(guess[i])) {
      charBox.classList.add('yellow');
      allCorrect = false;
    } else {
      charBox.classList.add('gray');
      allCorrect = false;
    }
    resultRow.appendChild(charBox);
  }

  document.getElementById('result').appendChild(resultRow);

  // 检查游戏状态
  if (allCorrect) {
    gameOver = true;
    messageDiv.className = 'message success';
    messageDiv.textContent = '答案正确！';
  } else if (remainingAttempts <= 0) {
    gameOver = true;
    messageDiv.className = 'message error';
    messageDiv.innerHTML = `次数耗尽！正确答案是：${answer}`;
  } else {
    messageDiv.className = 'message';
    messageDiv.textContent = `请继续尝试，还剩 ${remainingAttempts} 次机会`;
  }
}

// 更新UI
function updateUI() {
  document.getElementById('attempts-info').textContent =
    `剩余尝试次数：${remainingAttempts}次`;
}

// 事件监听
document.getElementById('submit-btn').addEventListener('click', checkGuess);
document.getElementById('guess-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') checkGuess();
});

// 启动游戏
loadPoems();