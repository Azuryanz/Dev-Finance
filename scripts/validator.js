// Objeto de controle da validação
const validator = {

  // Manipulação da submissão do formulário
  handleSubmit:(event) => {
    // previne que o formulário envie os dados e recarregue a página
    event.preventDefault();

    // variáveis de controle para a validação e campos de dados, respectivamente
    let send = true;
    let inputs = form.querySelectorAll("#new-transaction .field");

    // limpa todos os erros já exibidos em tela
    validator.clearErrors();

    // para cada input encontrado, realiza a verificação das regras
    for(let i = 0; i < inputs.length; i++ ) {
      let input = inputs[i];
      let check = validator.checkInput(input);

      // caso a checagem falhe, não valida a submissão é chama a função de erro
      if(check !== true) {
        send = false;
        validator.showError(input, check);
      }
    }

    // caso a checagem ocorra sem problemas, realiza a submissão
    if(send) {
      createTransaction();
    }
  },

  // Checagem do input
  checkInput:(input) => {
    // variável que contém as regras de um determinado input
    let rules = input.getAttribute("data-rules");

    //  se possuir regras, separa as regras em um array
    if(rules !== null) {
      // o pipe '|' é o elemento de divisão das regras
      rules = rules.split("|");

      // verificação de cada regra
      for(let j in rules) {
        switch(rules[j]){

          // verifica a regra de 'campo necessário'
          case 'required':
            if(input.value == "") {
              return "Este campo é obrigatório!";
            }
          break;

          // verifica se algum valor foi digitado, e caso positivo, verifica a formatação
          case 'amount':
            if(input.value == "") {
              return "Este campo é obrigatório!";
            } else {
              let inputCorrection = input.value.replace('.',',');
              let amountRegex = /^\-?\d+(?:,\d{1,2})?$/;
              if(!amountRegex.test(inputCorrection)) {
                return "Insira um valor válido!"
              }
            }
          break;

          // verifica se alguma data foi inserida, e caso positivo, verifica a formatação
          case 'date':
            if(input.value == '') {
              return "Este campo é obrigatório!";
            } else {
              let dateRegex = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
              if(!dateRegex.test(input.value)) {
                return "Insira uma data válida!";
              }
            }
          break;
        }
      }
    }

    // se passar por todas as regras, o input é validado e retorna true
    return true;
  },

  // Exibição de erro em tela
  showError:(input, error) => {
    // adiciona uma borda vermelha no input
    input.style.borderColor = "var(--secondary-highlight)";

    // adiciona um texto vermelho logo abaixo o input
    let errorElement = document.createElement("div");
    errorElement.classList.add("error");
    errorElement.innerHTML = error;

    input.parentElement.insertBefore(errorElement, input.nextElementSibling);
  },

  // Limpa os erros da tela
  clearErrors:() => {
    let inputs = form.querySelectorAll("input");
    let errorElements = document.querySelectorAll(".error");

    for(let i = 0; i < inputs.length; i++) {
      inputs[i].style = "";
    }

    for(let i = 0; i < errorElements.length; i++) {
      errorElements[i].remove();
    }
  }
}

let form = document.querySelector('#new-transaction');
form.addEventListener('submit', validator.handleSubmit);
