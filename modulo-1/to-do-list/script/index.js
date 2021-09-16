//! VARIÁVEIS GLOBAIS
const formToDo = document.querySelector("#formToDo"); // FORMULÁRIO
const alertMsg = document.querySelector(".alertMsg"); // CAMPO DE MSG
const toDoList = listaLocalStorage() || []; // ARRAY BANCO DE DADOS
const divStatus = document.querySelector(".status")
//! SUBMIT EVENT
formToDo.addEventListener("submit", (event) => {
    event.preventDefault(); // EVENTO DE PARADA
    const input = document.querySelector("#formInput").value;
    // VALIDADOR DE PREENCHIMENTO
    if (input == "") {
        // CASO VAZIO
        //MENSAGEM DE FALHA
        alertMsg.innerHTML = "<small>O campo não pode estar vazio</small>";
        alertMsg.style.display = "flex";
        alertMsg.style.color = "yellow";
        //FUNÇÃO TIMEOUT -> LIMPAR MSG
        timer(3000);
    } else {
        // CASO PREENCHIDO
        //ADICIONANDO AO LOCAL STORAGE
        toDoList.push({entrada:input,checked:false})
        localStorage.setItem("toDoList", JSON.stringify(toDoList));
        //MENSAGEM DE SUCESSO
        alertMsg.innerHTML = "<small>Item adicionado com sucesso</small>";
        alertMsg.style.display = "flex";
        alertMsg.style.color = "blue";
        //FUNÇÃO TIMEOUT -> LIMPAR MSG
        timer(2500);
        // LIMPANDO O INPUT
        document.querySelector("#formInput").value = "";
        console.log(toDoList)
        
    }
    //CONSTRUTOR DE LISTA
    listar();
});
//! CRIANDO LISTAGEM
function listar() {
    const divLista = document.querySelector(".lista");
    // LIMPAR LISTA
    divLista.innerHTML = "";
    let pos = 0; //CONTADOR DE ITENS
    if (JSON.parse(localStorage.getItem("toDoList")).length > 0) {
        divLista.style.display = 'block' //EXIBE A DIV CASO STORAGE TENHA VALORES
        divStatus.style.display = 'block'
        divStatus.innerHTML = `
            <div class="totItem">
                <div class="statusTittle">Status:</div>
                <div class="statusCount">
                    Total de itens: ${toDoList.length}
                </div>
                <div class="statusChecked">
                Itens marcados: ${contarChecados()} (${porcentagemChecados(
            toDoList.length,
            contarChecados()
        )}%)
                </div>
            </div>`;
        if (contarChecados() > 0) {
            const divStatusChecked = document.querySelector(".statusChecked");
            divStatusChecked.style.display = "block";
        } else {
            const divStatusChecked = document.querySelector(".statusChecked");
            divStatusChecked.style.display = "none";
        }
        // CONSTRUTOR
        for (let pos = 0; pos < toDoList.length ; pos++) {
            // CONDIÇÃO PARA ARMAZENAR ITENS MARCADOS
            if (toDoList[pos].checked == true){
                divLista.innerHTML += `
                    <div class="item">
                        <div>
                            <input type="checkbox" onclick="checking(this)" id="item${pos}" value="${pos}" title="marcar como feito" checked>
                            <label class="lineThrough" for="item${pos}">${toDoList[pos].entrada}
                            </label>
                        </div>
                    <button class="delete" onclick="del(this)" value="${pos}" title="deletar item da lista">X</button>
                    </div>`;
            }else{
                divLista.innerHTML += `
                    <div class="item">
                        <div>
                            <input type="checkbox" onclick="checking(this)" id="item${pos}" value="${pos}" title="marcar como feito">
                            <label class="lineThrough" for="item${pos}">${toDoList[pos].entrada}
                            </label>
                        </div>
                    <button class="delete" onclick="del(this)" value="${pos}" title="deletar item da lista">X</button>
                    </div>`;
            }
        };
    } else {
        divLista.style.display = 'none' // OCULTA A DIV CASO STORAGE VAZIO
        divStatus.style.display = 'none' // OCULTA A DIV CASO STORAGE VAZIO
    }

}
//! FUNÇÃO PARA DEIXAR O CHECKBOX MARCADO NO REFRESH
function checking(chk){
    // ALTERA VALOR DO OBJETO
    if ((toDoList[chk.value].checked == true)) {
        toDoList[chk.value].checked = false;
    } else if ((toDoList[chk.value].checked == false)) {
        toDoList[chk.value].checked = true;
    }
    // GRAVA NO LOCAL STORAGE
    localStorage.setItem('toDoList',JSON.stringify(toDoList))
    listar()
}
//! FUNÇÃO DELETAR
function del(btn) {
    const apagar= confirm('Deseja realmente apagar o item?')
    if (apagar == true){
        //POSIÇÃO DO BOTÃO
        let pos = btn.value;
        // REMOÇÃO DE ITEM E REATRIBUIÇÃO DE VALORES DO ARRAY
        toDoList.splice(pos, 1);
        localStorage.setItem("toDoList", JSON.stringify(toDoList));
        // MENSAGEM DE ITEM DELETADO
        alertMsg.innerHTML = "<strong><small>Item deletado</small></strong>";
        alertMsg.style.display = "flex";
        alertMsg.style.color = "#7D1B1B";
        //FUNÇÃO TIMEOUT -> LIMPAR MSG
        timer(1500);
        // CONSTRUTOR DE LISTA
        listar();
    } else {
        alert('item mantido na lista')
    }
}
//! FUNÇÃO PARA OCULTAR A DIV alertMSG
function timer(x) {
    setTimeout(() => {
        // OCULTANDO
        alertMsg.style.display = "none";
    }, x);
}
//! CARREGA A LISTA CASO JÁ EXISTA NO LOCAL STORAGE
window.onload = ()=>{
    if ( localStorage.length > 0){
        listar();
    }
}
//! FUNÇÃO CONTADOR DE ITENS CHECADOS
function contarChecados(){
    let totalChecked = 0
    for (let i = 0; i < listaLocalStorage().length; i++) {
        if (listaLocalStorage()[i].checked == true) {
            totalChecked += 1;
        }
    }
    return totalChecked
}
//! FUNÇÃO PORCENTAGEM DE ITENS CHECADOS
function porcentagemChecados(n1,n2){
    n1 = Number.parseInt(n1)
    n2 = Number.parseInt(n2)
    let res = (n2 * 100) / n1
    return Number.parseInt(res)
}
//! FUNÇÃO RECUPERAR DO LOCAL STORAGE
function listaLocalStorage(){
    let lista = localStorage.getItem("toDoList");
    lista = JSON.parse(lista);
    return lista
}