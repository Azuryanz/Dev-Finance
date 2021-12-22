// Manipulação do local storage do navegador
const storage = {
  // pega as strings de informações armazenadas em 'dev.finances:transactions' e converte em um array
  // de objetos, ou retorna vazio
  get() {
   return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
  },

  // transforma os elementos do objetos transactions em uma string
  set(transaction) {
    localStorage.setItem('dev.finances:transactions', JSON.stringify(transaction));
  },
}
