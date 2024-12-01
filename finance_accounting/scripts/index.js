if (localStorage.getItem("user") === null) {
  window.location.href = "./login.html";
}
user = JSON.parse(localStorage.getItem("user"));
console.log(user);
document.querySelector(".header_username").textContent = user.name;


const noteTemplate = document.querySelector('#note-template').content;

const popup = document.querySelector('.popup');

const openPopupButton = document.querySelector('.add_note');

const closePopupButton = popup.querySelector('button[name="cancel"]');
const popupSendButton = popup.querySelector('button[name="add"]');

const notesField = document.querySelector('.history_note__fieldset')

const sumInput = popup.querySelector('.form__item-summ');
const dateInput = popup.querySelector('.form__item-date');
const categoryInout = popup.querySelector('.form__item-category');
const commentInput = popup.querySelector('.form__item-note');
const placeInput = popup.querySelector('.form__item-place');
const typyInput = popup.querySelector('form-summ__choose-button');

function resetFormFields() {
  sumInput.value = '';
  dateInput.value = ''
  categoryInout.value = '';
  commentInput.value = '';
  placeInput.value = '';
}

function handleOpenPopup() {
  resetFormFields();
  popup.classList.add('popup_opened');
  popup.classList.remove('popup_closed');
}

function handleClosePopup () {
  popup.classList.add('popup_closed');
  popup.classList.remove('popup_opened');
}

function createNote (source,alt,title,ammount) {
  let note =  noteTemplate.querySelector('.history-note').cloneNode(true);
  const noteIcon = note.querySelector('.category_icon');
  const noteTitle = note.querySelector('.note_title');
  const noteCost = note.querySelector('.note_cost');

  noteIcon.src = source;
  noteIcon.alt = alt;
  noteTitle.textContent = title;
  noteCost.textContent = ammount;

  return note
}
function handleSubmitSendNote(evt) {
  evt.preventDefault();
  handleClosePopup();
}



 // Функция для получения всех транзакций

document.addEventListener('DOMContentLoaded', function () {
  const userId = user.id; // Замените на реальный userId



  // Функция для получения и обновления транзакций
  async function fetchTransactions(userId) {
    try {
        const response = await fetch(`/api/transactions/${userId}/`);
        let data = [];
        if (response.ok) {
            data = await response.json();
        }

        // Обновление интерфейса
        updateTransactionInfo(data);
        updateTransactionHistory(data);
    } catch (error) {
        console.error("Ошибка при загрузке транзакций:", error);
    }
  }


  function updateTransactionInfo(data) {
    console.log(data);
    const income = data.filter(transaction => transaction.type === 'income').reduce((sum, transaction) => sum + transaction.amount, 0);
    const expense = data.filter(transaction => transaction.type === 'expense').reduce((sum, transaction) => sum + transaction.amount, 0);
  
    document.querySelector('.income').innerHTML = `${income} ₽<br>Доходы за месяц`;
    document.querySelector('.expenses').innerHTML = `${expense} ₽<br>Расходы за месяц`;
  }



  function updateTransactionHistory(data) {
    const historyContainer = document.querySelector('.history_note__fieldset');
    historyContainer.innerHTML = ''; // Очищаем старую историю

    data.forEach(transaction => {
        const template = document.getElementById('note-template').content.cloneNode(true);
        template.querySelector('.note_title').textContent = transaction.description;
        template.querySelector('.note_cost').textContent = `${transaction.amount} ₽`;
        historyContainer.appendChild(template);
    });

    // Анимация
    historyContainer.classList.add('updated');
    setTimeout(() => historyContainer.classList.remove('updated'), 300);
}



  fetchTransactions(userId);



    // Обработчик для кнопки добавления новой транзакции
  document.querySelector('.popup_close button[name="add"]').addEventListener('click', function () {
      const typeBtn = document.querySelector('#type-checkbox');
      const type = typeBtn.checked ? 'income' : 'expense';
      const newTransaction = {
          type: type,
          amount: parseFloat(document.querySelector('.form__item-summ').value),
          date: document.querySelector('.form__item-date').value,
          category: document.querySelector('.form__item-category').value,
          description: document.querySelector('.form__item-note').value,
          place: document.querySelector('.form__item-place').value
      };

      addTransaction(userId, newTransaction);
  });


    

    // Функция для отправки новой транзакции на сервер
  async function addTransaction(userId, transaction) {
    try {
        const response = await fetch(`/api/transactions/${userId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        });

        if (!response.ok) {
            throw new Error("Ошибка при добавлении транзакции");
        }

        const data = await response.json();

        // Обновляем данные на странице
        fetchTransactions(userId); // Заново получаем и обновляем данные

        console.log("Транзакция успешно добавлена:", data);
    } catch (error) {
        console.error("Ошибка:", error);
    }
  }
});







openPopupButton.addEventListener('click',handleOpenPopup);

closePopupButton.addEventListener('click',handleClosePopup); // Кнопка отмены
popupSendButton.addEventListener('click',handleSubmitSendNote); // Кнопка добавления