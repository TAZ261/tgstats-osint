// ==UserScript==
// @name tgstats-osint
// @namespace OrangeMonkey Scripts
// @match https://uk.tgstat.com/*
// @author Русореz
// @grant none
// ==/UserScript==



let MAX_POSTS = 7; // Максимальна кількість завантажуваних повідомлень
let LOAD_MORE_DELAY = 2000; // Затримка між натисканнями на кнопку (в мілісекундах)
let loadMoreCounter = 0; // Лічильник натискань на кнопку

// Функція для створення меню
function createMenu() {
  const menuContainer = document.createElement('div');
  menuContainer.style.position = 'fixed';
  menuContainer.style.top = '20px';
  menuContainer.style.right = '20px';
  menuContainer.style.zIndex = '9999';

  const menu = document.createElement('div');
  menu.style.backgroundColor = '#ffffff';
  menu.style.border = '1px solid #cccccc';
  menu.style.padding = '10px';
  menu.style.display = 'flex';
  menu.style.gap = '10px';
  menu.style.alignItems = 'center';

  const maxPostsLabel = document.createElement('label');
  maxPostsLabel.textContent = 'Кількість сторінок';
  const maxPostsInput = document.createElement('input');
  maxPostsInput.type = 'number';
  maxPostsInput.value = MAX_POSTS.toString();
  maxPostsInput.min = '1';
  maxPostsInput.step = '1';

  const loadMoreDelayLabel = document.createElement('label');
  loadMoreDelayLabel.textContent = 'Затримка (ms):';
  const loadMoreDelayInput = document.createElement('input');
  loadMoreDelayInput.type = 'number';
  loadMoreDelayInput.value = LOAD_MORE_DELAY.toString();
  loadMoreDelayInput.min = '0';
  loadMoreDelayInput.step = '100';

  const loadMoreButton = document.createElement('button');
  loadMoreButton.textContent = 'Далі';

  const loadMoreCounterDiv = document.createElement('div');
  loadMoreCounterDiv.textContent = `Лічильник натискань на кнопку: ${loadMoreCounter}`;

  menu.appendChild(maxPostsLabel);
  menu.appendChild(maxPostsInput);
  menu.appendChild(loadMoreDelayLabel);
  menu.appendChild(loadMoreDelayInput);
  menu.appendChild(loadMoreButton);
  menu.appendChild(loadMoreCounterDiv);

  menuContainer.appendChild(menu);

  // Обробник події для кнопки "Далі"
  loadMoreButton.addEventListener('click', async () => {
    MAX_POSTS = parseInt(maxPostsInput.value);
    LOAD_MORE_DELAY = parseInt(loadMoreDelayInput.value);

    loadMoreCounter = 0;

    await loadMorePosts();

    const messages = document.querySelectorAll('.post-container');
    let counter = 0;

    messages.forEach((message) => {
      hideNonDeletedMessages(message);
      counter++;
      if (counter >= MAX_POSTS) {
        return;
      }
    });

    loadMoreCounterDiv.textContent = `Лічильник натискань на кнопку: ${loadMoreCounter}`;
    console.log('Показано тільки видалені повідомлення!');
  });

  return menuContainer;
}

async function loadMorePosts() {
  let loadMoreButton = document.querySelector('.lm-button');

  while (loadMoreButton && loadMoreCounter < MAX_POSTS) {
    loadMoreButton.click();
    await new Promise((resolve) => setTimeout(resolve, LOAD_MORE_DELAY));
    loadMoreButton = document.querySelector('.lm-button');
    loadMoreCounter++;
  }
}

function isDeletedMessage(message) {
  return message.classList.contains('deleted');
}

function hideNonDeletedMessages(message) {
  if (!isDeletedMessage(message)) {
    message.style.display = 'none';
  }
}

// Вимикання кнопки "Скрывать удаленные" при завантаженні сторінки
function disableHideDeletedButton() {
  const hideDeletedCheckbox = document.getElementById('hidedeleted');
  hideDeletedCheckbox.checked = false;
}

disableHideDeletedButton();

const menu = createMenu();
document.body.appendChild(menu);