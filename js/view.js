var viewController = (function() {
  var DOMstrings = {
      inputType: "#input__type",
      inputDescription: "#input__description",
      inputValue: "#input__value",
      form: "#budget-form",
      incomeContainer: "#income__list",
      expenseContainer: "#expenses__list",
      budgetLabel: "#budget-value",
      incomeLabel: "#income-label",
      expensesLabel: "#expense-label",
      expensesPercentLabel: "#expense-percent-label",
      budgetTable: "#budget-table",
      monthLabel: "#month",
      yearLabel: "#year"
  };

  function getInput() {
      return {
          type: document.querySelector(DOMstrings.inputType).value,
          description: document.querySelector(DOMstrings.inputDescription)
              .value,
          value: document.querySelector(DOMstrings.inputValue).value
      };
  }

  function formatNumber(num, type){
      var numSplit, int, dec, newInt, resultNumber;

      /*
      - или - перед числом в зависимости от типа
      два знакао после точки, десятые и сотые
      50 => 50.00
      87.5649874132 => 87.56
      */
      // Убираем знак минус у отрицательных чисел
      num = Math.abs(num); // Math.abs(-10) = 10
      // Приводим к 2-м цифрам после точки
      num = num.toFixed(2); // (2.45678).toFixed(2) = 2.46      (2).toFixed(2) = 2.00

      /*
      123000 => 123,000.00
      123,456,789 => 123,456,789.00
      12,345
      */

      numSplit = num.split("."); // 45.78 => [45, 78]
      // Целая часть
      int = numSplit[0]; // 45
      // Десятые, от исходной строки
      dec = numSplit[1]; // 78

      // Расставляем запятые
      // Исходя из длинны числа делим его на части по 3 цифры
      // Начиная с правой стороны проставляем запятые после каждого третьего числа
      // 123456789 => 123,456,789
      // Если длинна номера больше чем 3 цифры значит надо ставить запятые
      if ( int.length > 3) {
          newInt = "";

          //123456789
          console.log("formatNumber -> int.length", int.length)

          for( var i = 0; i < int.length / 3; i++  ){
              console.log("formatNumber -> i", i);

              // Формирую новую строку с номером
              newInt =
              // Добавляю запятую каждые 3 числа
              "," +
              // Вырезанный кусок из исходной строки
              int.substring(int.length - 3 * (i + 1), int.length - 3 * i) +
              // Конец строки, правая часть
              newInt;

              console.log("formatNumber -> newInt", newInt)
          }
          console.log("formatNumber -> newInt", newInt)

          // Убираем запятую в начале, если она есть
          if (newInt[0] === ",") {
              newInt = newInt.substring(1);
          }



      // Если исходное число равно нулю, то в новую строку записываем ноль.
      } else if ( int === "0") {
          newInt = "0";
      // Если исходное целое число имеет 3 и менее символов
      } else {
          newInt = int;
      }

      resultNumber = newInt + "." + dec;
      if (resultNumber != 0){
         if (type === "exp") {
          resultNumber = "- " + resultNumber;
         } else if (type === "inc" ) {
          resultNumber = "+ " + resultNumber;
         }
    }

      return resultNumber;
  }

  function renderListItem(obj, type) {
      var containerElement, html;

      if (type === "inc") {
          containerElement = DOMstrings.incomeContainer;
          html = `<li id="inc-%id%" class="budget-list__item item item--income">
                      <div class="item__title">%description%</div>
                      <div class="item__right">
                          <div class="item__amount">%value%</div>
                          <button class="item__remove">
                              <img
                                  src="./img/circle-green.svg"
                                  alt="delete"
                              />
                          </button>
                      </div>
                  </li>`;
      } else {
          containerElement = DOMstrings.expenseContainer;
          html = `<li id="exp-%id%" class="budget-list__item item item--expense">
                      <div class="item__title">%description%</div>
                      <div class="item__right">
                          <div class="item__amount">
                              %value%
                              <div class="item__badge">
                                  <div class="item__percent badge badge--dark">
                                      15%
                                  </div>
                              </div>
                          </div>
                          <button class="item__remove">
                              <img src="./img/circle-red.svg" alt="delete" />
                          </button>
                      </div>
                  </li>`;
      }

      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      document
          .querySelector(containerElement)
          .insertAdjacentHTML("beforeend", newHtml);
  }

  function clearFields() {
      var inputDesc, inputVal;

      inputDesc = document.querySelector(DOMstrings.inputDescription);
      inputVal = document.querySelector(DOMstrings.inputValue);

      inputDesc.value = "";
      inputDesc.focus();

      inputVal.value = "";
  }

  function updateBudget (obj){
      var type;
      /*
      {
          budget: data.budget,
          totalInc: data.totals.inc,
          totalExp: data.totals.exp,
          percentage: data.percentage
      }
      budgetLabel: "#budget-value",
      incomeLabel: "#income-label",
      expensesLabel: "#expense-label",
      expensesPercentLabel: "#expense-percent-label"
      */

      if (obj.budget > 0 ) {
          type = "inc"
      } else {
          type = "exp";
      }

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, "inc");
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, "exp");

      if (obj.percentage > 0) {
          document.querySelector(DOMstrings.expensesPercentLabel).textContent = obj.percentage;
      } else {
          document.querySelector(DOMstrings.expensesPercentLabel).textContent = "--";
      }


  }

  function deleteListItem(itemID){
      document.getElementById(itemID).remove();
  }

  function updateItemsPercentages(items){

      items.forEach(function(item){

          // Выводим каждую запись массива во время прохода
          console.log("updateItemsPercentages -> item", item);  // [5, 26]

          // Находим блок с процентами внутри текущей записи
          var el = document.getElementById(`exp-${item[0]}`).querySelector(".item__percent");
          console.log("updateItemsPercentages -> el", el);

          // el.textContent = item[1] + "%";

          // Делаю проверку если значение % = "-1" когда нет доходов
          if ( item[1] >= 0) {
              // Если есть - то показываем блок с %
              el.parentElement.style.display = "block";
              // Меняем контент внутри бейджа с процентами
              el.textContent = item[1] + "%";
          } else {
              // Если нет - то скрываем бейдж с процентами
              el.parentElement.style.display = "none";
          }


      })
  }

  function displayMonth(){
      var now, year, month, monthArr;

      now = new Date();
      year = now.getFullYear(); // 2020
      month = now.getMonth(); // Апрель => 3

      monthArr = [
          'Январь', 'Февраль', 'Март',
          'Апрель', 'Май', 'Июнь',
          'Июль', 'Август', 'Сентябрь',
          'Октябрь', 'Ноябрь', 'Декабрь'
      ];

      month = monthArr[month];

      document.querySelector(DOMstrings.monthLabel).innerText = month;
      document.querySelector(DOMstrings.yearLabel).innerText = year;


  }


  return {
      getInput: getInput,
      renderListItem: renderListItem,
      clearFields: clearFields,
      updateBudget: updateBudget,
      deleteListItem: deleteListItem,
      updateItemsPercentages: updateItemsPercentages,
      displayMonth: displayMonth,
      getDomStrings: function() {
          return DOMstrings;
      }
  };
})();
