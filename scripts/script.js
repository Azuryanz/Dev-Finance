// ------------------------------------------INITIAL DATA--------------------------------------------
// Elementos da tabela de transações
var transactions = storage.get();
console.log(transactions);

// Elementos do corpo HTML
var income = document.querySelector(".inCard .cardValue");
var expenses = document.querySelector(".outCard .cardValue");
var balance = document.querySelector(".totalCard");
var modal = document.querySelector(".modal");
let tableBody = document.querySelector('#transaction tbody');

// Variáveis que controlam o balanço
let incomeTotal = 0;
let expensesTotal = 0;
let balanceTotal = 0;
let cashIn = 0;
let cashOut = 0;


// ---------------------------------------------EVENTS-----------------------------------------------
// Chamada de evento para abrir o modal e escurecer a tela
document.querySelector('.add-transaction').addEventListener('click', () => {
  dimOn();
  openModal();
})

// Chamada de evento que fecha o modal
document.querySelector('#cancel-btn').addEventListener('click', closeModal);


// ---------------------------------------------FUNCTIONS---------------------------------------------
// Mostra todas as transações no array de transações na tela
function showTransactions() {
  // limpa o corpo da tabela e inicializa as variáveis de balanço
  tableBody.innerHTML = "";
  incomeTotal = 0;
  expensesTotal = 0;
  balanceTotal = 0;
  cashIn = 0;
  cashOut = 0;

  // para cada elemento do vetor de transações, realiza um update no corpo da tabela
  for(let i = 0; i < transactions.length; i++) {
    updateTable(i);
  }
  updateTransactions();
}

// Cria uma nova transação com os dados do modal
function createTransaction() {
    // variáveis de correção dos valores de index, data e valor
  let index = transactions.length;
  let inputDate = document.querySelector('.modal #inputData').value;
  let inputAmount = document.querySelector('.modal #numberValue').value;
  let dateArray = inputDate.split("-");
  let correctAmount = inputAmount.replace(',', '.');

  // cria o objeto da nova transação com os valores corrigidos
  let newTransaction = 
  {
    id: index + 1,
    description: document.querySelector('.modal #description').value,
    amount: parseFloat(correctAmount),
    date: `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`
  }

  // adiciona a nova transação no array de transações
  transactions.push(newTransaction);

  // realiza um update no corpo da tabela com a nova transação
  updateTable(index);

  // fecha o modal da transação
  closeModal();
}

// Atualiza o id das transações
function updateTransactions() {
  for(let i = 0; i < transactions.length; i++) {
    transactions[i].id = i + 1;
  }
}

// Remoção de um elemento da tabela
function removeTransaction(index) {
  // variável que identifica qual elemento da tabela chamou a função
  let row = document.querySelector(`table tbody tr:nth-child(${index})`);

  // verifica qual o valor da transação e realiza a devida remoção dos valores
  if(transactions[index-1].amount >= 0){
    cashIn = transactions[index-1].amount * -1;
    cashOut = 0;
  } else {
    cashIn = 0;
    cashOut = transactions[index-1].amount;
  }

  // remove o elemento do array de transações
  transactions.splice((index-1), 1);

  // atualiza os valores dos cards do balanço
  updateValues();

  // remove o elemento da tabela
  tableBody.removeChild(row);

  // atualiza a tabela
  transactions.length != 0 ? showTransactions() : storage.set(transactions);

}

// Abre o modal com um efeito de fade in
function openModal() {
  modal.style.zIndex = "2";
  setTimeout(() => {
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
  }, 1);
}

// Fecha o modal com um efeito de fade out e remove o escurecimento da tela
function closeModal() {
  modal.style.visibility = "hidden";
  modal.style.opacity = "0";
  dimOff();
  setTimeout(() => {
    modal.style.zIndex = "0";
  }, 400);
}

// Insere um elemento do array de transações com base no parâmetro no corpo da tabela
function updateTable(index) {
  // variável que indica qual a posição na tabela
  let child = index + 1;

  // variável para os valores absolutos, parte inteira e parte decimal do valor
  let absAmount;
  let integerAmount;
  let decimalAmount;

  // cria os cada elemento HTML que faz parte da tabela
  let tRow = document.createElement('tr');
  let tDescription = document.createElement('td');
  let tAmount = document.createElement('td');
  let tDate = document.createElement('td');
  let tDelete = document.createElement('td');
  let tImg = document.createElement('img');

  // verificação do valor para positivo ou negativo e formatação dos dados do valor
  if(transactions[index].amount >= 0) {
    absAmount = Math.abs(transactions[index].amount);
    integerAmount = Math.floor(absAmount);
    decimalAmount = (absAmount % 1).toFixed(2).substring(2);
    tAmount.innerHTML = `R$ ${integerAmount},${decimalAmount}`;
    tAmount.classList.add("income");
    cashIn = absAmount;
    cashOut = 0;
  } else if (transactions[index].amount < 0) { 
    absAmount = Math.abs(transactions[index].amount);
    integerAmount = Math.floor(absAmount);
    decimalAmount = (absAmount % 1).toFixed(2).substring(2);
    tAmount.innerHTML = `- R$ ${integerAmount},${decimalAmount}`;
    tAmount.classList.add("expense");
    cashIn = 0;
    cashOut = absAmount;
  } 

  // adiciona o restante das informações da transação em seus respectivos elementos da tabela
  tDescription.innerHTML = transactions[index].description;
  tDate.innerHTML = transactions[index].date;
  tImg.classList.add('remove-row');
  tImg.src = './assets/minus.svg';
  tImg.alt = 'Imagem de remover transação';

  // insere as variáveis criadas no corpo da tabela
  tRow.appendChild(tDescription);
  tRow.appendChild(tAmount);
  tRow.appendChild(tDate);
  tDelete.appendChild(tImg);
  tRow.appendChild(tDelete);
  tableBody.appendChild(tRow);

  // cria um evento para a remoção da transação criada
  document.querySelector(`table tbody tr:nth-child(${child}) .remove-row`).addEventListener('click', () => {
    removeTransaction(child);
  });

  storage.set(transactions);
  
  // chamada da função que atualiza os valores dos cards principais
  updateValues();
}

// Atualiza os valores dos cards principais
function updateValues(){
  // variável que controla o sinal do valor total
  let sign;

  // variáveis que controlam a parte inteira dos valores
  let plusValue = 0;
  let minusValue = 0;
  let totalValue = 0;

  // variáveis que controlam a parte decimal do valores
  let plusValueDecimal = 0;
  let minusValueDecimal = 0;
  let totalValueDecimal = 0;

  // atualiza as variáveis de valores dos cards com os valores da transação que chamou a função
  incomeTotal = incomeTotal + cashIn;
  expensesTotal = expensesTotal + cashOut;
  balanceTotal = (incomeTotal - expensesTotal).toFixed(2);
  
  // tratamento da sinalização do balanço total e atualização da cor do card
  if(balanceTotal > 0) {
    balance.classList.remove('negative');
    balance.classList.add('positive');
    sign = "";
  } else if(balanceTotal < 0) {
    balance.classList.remove('positive');
    balance.classList.add('negative');
    sign = "-";
  } else {
    balance.classList.remove('negative');
    balance.classList.remove('positive');
    sign = "";
  }

  // converte os valores das variáveis dos cards em seus valores absolutos
  plusValue = Math.abs(incomeTotal);
  minusValue = Math.abs(expensesTotal);
  totalValue = Math.abs(balanceTotal);
  
  // separa a parte decimal dos valores com aproximação de duas casas decimais e remove a pontuação
  plusValueDecimal = (plusValue % 1).toFixed(2).substring(2);
  minusValueDecimal = (minusValue % 1).toFixed(2).substring(2);
  totalValueDecimal = (totalValue % 1).toFixed(2).substring(2);
  
  // separa a parte inteira do valor absoluto
  plusValue = Math.trunc(plusValue);
  minusValue = Math.trunc(minusValue);
  totalValue = Math.trunc(totalValue);

  // atualiza as informações dos cards de acordo com os valores calculados e separados
  income.innerHTML = `R$ ${plusValue},${plusValueDecimal}`;
  expenses.innerHTML = `R$ ${minusValue},${minusValueDecimal}`;
  balance.querySelector(".cardValue").innerHTML = `${sign}R$ ${totalValue},${totalValueDecimal}`;
}

// Inicializa a tabela ao carregar a página
showTransactions();