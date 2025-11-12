document.addEventListener('DOMContentLoaded', () => {
  const contentDiv = document.getElementById('content');
  const links = document.querySelectorAll('header nav a');

  // ------------------- Навигация -------------------
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      if(page === "games") {
        if(typeof showGamesList === "function") showGamesList();
      } else {
        loadPage(page);
      }
    });
  });

  // ------------------- Загрузка данных -------------------
  async function loadPage(page) {
    let jsonFile = '';
    let title = '';

    switch(page) {
      case 'challenge':
        jsonFile = 'data/challenge.json';
        title = 'Челендж Дня';
        break;
      case 'word':
        jsonFile = 'data/words.json';
        title = 'Слово Дня';
        break;
      case 'fact':
        jsonFile = 'data/facts.json';
        title = 'Факт Дня';
        break;
      default:
        return;
    }

    try {
      const res = await fetch(jsonFile);
      const data = await res.json();
      window[page + 'Data'] = data;
      showRandomItem(page);
    } catch(err) {
      console.error("Ошибка загрузки данных:", err);
      contentDiv.innerHTML = "<p>Не удалось загрузить данные.</p>";
    }
  }

  // ------------------- Случайный элемент -------------------
  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // ------------------- Отображение случайного элемента -------------------
  function showRandomItem(page) {
    const data = window[page + 'Data'];
    if(!data) return;

    const item = getRandomItem(data);
    let html = `<div class="card">`;

    if(page === 'challenge') {
      html += `<h2>${item.title}</h2><p>${item.description}</p>`;
    } 
    else if(page === 'word') {
      html += `<h2>🌿 ${item.word}</h2>
               ${item.transcription ? `<p>Транскрипция: <i>${item.transcription}</i></p>` : ''}
               <p>Значение: <b>${item.meaning}</b></p>
               ${item.example ? `<p>Пример на иврите: ${item.example}</p>` : ''}
               ${item.example_translation ? `<p>Перевод: ${item.example_translation}</p>` : ''}
               ${item.fun_fact ? `<p>Интересный факт: ${item.fun_fact}</p>` : ''}`;
    } 
    else if(page === 'fact') {
      html += `<h2>${item.title}</h2><p>${item.description}</p>`;
    }

    html += `</div>`;
    html += `<button class="more-btn" id="more-btn">Ещё</button>`;

    contentDiv.innerHTML = html;

    // Кнопка "Ещё"
    document.getElementById('more-btn').addEventListener('click', () => {
      showRandomItem(page);
    });
  }

  // ------------------- Загрузка всех массивов при старте -------------------
  ['challenge','word','fact'].forEach(page => loadPage(page));
});
