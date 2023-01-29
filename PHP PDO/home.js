/*
c#n = número do comentário (utilize para localizar comentários repetidos ou extensos)
*/

/*
c#1
Parâmetros: action = ação à ser executada ('register' ou 'update'), id = id do usuário utilizada na ação 'update'
Esta função executa o 'insert' e o 'update' no banco de dados. Utiliza async por conta da função 'initialLoad()' 
que também é async, porque utiliza um objeto 'fetch' dentro dela.

c#2
Para fazer 'update'

c#5 
A função checkRegularExp(expression,type) retorna true se a string estiver no padrão correto do tipo (type) especificado. 
Ex.: checkRegularExp('(11) 00000-0000','phone') retornará 'true'

c#6
Adicionando elementos nos dados de formulario criado (seletor,valor)

c#7
Definições da requisição fetch (precisa ser um array/json):
method -> Método escolhido da requisição
header -> Tipo de dados (formulário) e charset (esquema de caracteres)
body   -> Dados a serem enviados

c#8
Insere a td na linha

c#9
Se não tiver o traço depois dos 4 ou 5 primeiros números depois do espaço e o caracter digitado for um número

c#10
Remove a palavra input do id do elemento, ficando somente a definição do mesmo. Ex.: antes = inputName, depois = Name
*/

async function commands(action,id) //c#1
{
    let userId = id; //c#2
    let name = document.getElementById("inputName").value; //Input do nome
    let email = document.getElementById("inputEmail").value; //Input do email
    let phone = document.getElementById("inputPhone").value; //Input do telefone

    if(action === "register") //Escopo do 'insert'
    {
        let canRegist = true; //Variável para validar os inputs. Se torna 'false' caso um deles não esteja no padrão

        if(!checkRegularExp(name,"name")) //c#5
        {
            document.getElementById("spanNameError").innerHTML = "*nome inválido"; //Span de erro do nome
            canRegist = false;
        }
        if(!checkRegularExp(email,"email"))//c#5
        {
            document.getElementById("spanEmailError").innerHTML = "*email inválido"; //Span de erro do email
            canRegist = false;
        }
        if(!checkRegularExp(phone,"phone"))//c#5
        {
            document.getElementById("spanPhoneError").innerHTML = "*telefone inválido"; //Span de erro do telefone
            canRegist = false;
        }

        if(canRegist === true)
        {
            register(name,email,phone); //Insere os dados no banco
            await initialLoad(); //Atualiza os dados na tabela
        }
        else
        {
            alert("Verify data");
        }
    }

    if(action === "update") //Atualizar um registro
    {
        let canRegist = true; //Variável para validar os inputs. Se torna 'false' caso um deles não esteja no padrão

        if(!checkRegularExp(name,"name")) //c#5
        {
            document.getElementById("spanNameError").innerHTML = "*nome inválido"; //Span de erro do nome
            canRegist = false;
        }
        if(!checkRegularExp(email,"email")) //c#5
        {
            document.getElementById("spanEmailError").innerHTML = "*email inválido"; //Span de erro do email
            canRegist = false;
        }
        if(!checkRegularExp(phone,"phone"))//c#5
        {
            document.getElementById("spanPhoneError").innerHTML = "*telefone inválido"; //Span de erro do telefone
            canRegist = false;
        }

        if(canRegist === true)
        {        
            let request = await update(userId,name,phone,email); //Função com requisição fetch para atualizar o registro (retorna 'ok' se obtiver sucesso)
            if(request == "ok")
            {
                alert("Updated record");
            }
            else
            {
                alert("Update error");
            }
            await initialLoad(); //Atualizar a tabela de registros
            let button = document.getElementById("btn");
            button.setAttribute("name","register"); //Retorna a ação do botão para registrar
            button.setAttribute("value","Cadastrar"); //Retorna o texto do botão para 'Cadastrar'
        }
        else
        {
            alert("Verify data");
        }
    }
    
        
}



async function initialLoad()//Função executada ao carregar a página
{    
    let rows = document.getElementById("tbRecords").children; //Pega as linhas da tabela
    
    while(rows.length > 1) //Remover os elementos exceto th (caso já tenha dados na tabela)
    {
        rows[rows.length-1].remove(); //Remove o último elemento
    }
    
    let usersList = await selectAll(); // pega os usuarios cadastrados    
    usersList.forEach(fillTable); //executa uma função uma vez para cada elemento do array
    document.getElementById("formRegister").reset(); //Limpa os dados do formulário
}


function register(name, email, phone)
{
    let userData = new FormData(); //objeto que contém dados de formulário
    userData.append("name",name); //c#6
    userData.append("email",email); //c#6
    userData.append("phone",phone); //c#6

    let options = { //c#7
        method: "POST", 
        header:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}, 
        body:userData 
    }

    fetch("crud.php?action=register", options).then( //outra maneira de usar o fetch, utilizando o .then
        response => response.text() //Transforma os dados retornados em outra promisse de texto
        ).then(
            text => alert(text) //Alerta o retorno do fetch
            ).catch(
                error => alert ("Error fetch:"  + error)
        );
}

function edit(id,td) //id = id da pessoa no bd, td = td em que o botão está inserido
{
    let row = td.parentNode; //linha em que está o td com os botões
    let allTd = row.children; //todas as tds dentro da linha
    allTd = Array.from(allTd); //transformando em array
    let userData = allTd.map(function(value){ //Cria um novo array só com os valores do array 'allTd'
        
            return value.innerText;
        
    });

    userData.splice(userData.length-1,1); //remove o último elemento do array(td com os botões)
    userData.splice(0,0,id); //adiciona o id na primeira posição

    fillForm(userData[0],userData[1],userData[2],userData[3]); //insere as informações do usuário clicado no formulário
}

async function deleteUser(id) //Deleta um usuário
{
    let formData = new FormData(); //Novos dados de formulário
    formData.append("id",id); //Insere uma informação id = id do usuário
    let options = { //c#7
        method:"POST",
        header:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
        body:formData
    };
    let response = await fetch("crud.php?action=deleteUser",options); //Aguarda o 'fetch' (busca) retornar uma promise (promessa de retorno)
    let result = await response.text(); //Transforma 'response' em texto. 'response' é uma promise. Então precisa aguardar a promise se transformar no tipo escolhido (no caso text)

    alert(result); //Exibe 'Successfully deleted' quando o usuário é excluído com sucesso

    initialLoad(); //Recarrega os dados da tabela
}


function fillTable(arrayData) //Preenche a tabela com todos os registros do banco
{
    let usersDisplayTable = document.getElementById("tbRecords"); //Tabela onde conterá os usuarios cadastrados
    let tr = document.createElement("tr"); //tr linha
    let td1 = document.createElement("td"); //td nome
    let td2 = document.createElement("td"); //td telefone
    let td3 = document.createElement("td"); //td email
    let td4 = document.createElement("td"); //td botões
    
    let btn1 = document.createElement("input"); //Botão editar registro
    btn1.setAttribute("type","button"); //Tipo botão
    btn1.setAttribute("value","Atualizar"); //Texto exibido no botão
    btn1.setAttribute("onClick","edit(" + arrayData.id +",this.parentNode)"); // id do array atual dentro do array com todos os registros retornados (id da pessoa cadastrada)
    
    let btn2 = document.createElement("input"); //Botão excluir
    btn2.setAttribute("type","button"); //Tipo botão
    btn2.setAttribute("value","Excluir"); //Texto exibido no botão
    btn2.setAttribute("onClick","deleteUser(" + arrayData.id +")"); // id do array atual dentro do array com todos os registros retornados (id da pessoa cadastrada)
    
    td1.innerText = arrayData.name; //Nome da pessoa no banco
    td2.innerText = arrayData.phone; //Telefone da pessoa no banco
    td3.innerText = arrayData.email; //Email da pessoa no banco
    td4.appendChild(btn1); //Insere o botão editar na td
    td4.appendChild(btn2); //Insere o botão excluir na td
    
    tr.appendChild(td1); //c#8
    tr.appendChild(td2); //c#8
    tr.appendChild(td3); //c#8
    tr.appendChild(td4); //c#8

    usersDisplayTable.appendChild(tr); //Insere a linha preenchida com as informações na tabela
}

function fillForm(id,name,phone,email) //Preenche o formulário com as informações de algum registro para atualiza-lo
{
    let inputName,inputPhone,inputEmail,button; //informações passadas no parâmetro
    //Pega os inputs
    inputName = document.getElementById("inputName");
    inputPhone = document.getElementById("inputPhone");
    inputEmail = document.getElementById("inputEmail");
    button = document.getElementById("btn");

    //Preenche os inputs com as informações que vieram pelo parâmetro(id,name,phone,email)
    inputName.value = name;
    inputPhone.value = phone;
    inputEmail.value = email;
    button.setAttribute("onClick","commands(this.name," + id + ")"); //coloca o id para que sejapossível identificar o registro à ser editado
    button.setAttribute("name","update"); //Muda a função do botão para executar o escopo 'update' dentro da função 'commands'
    button.setAttribute("value","Atualizar"); //Texto do botão

}

async function selectAll() //Função para buscar todos os registros no banco de dados. Fetch com async/await -> a function precisa ser async
{
    let responseObject = await fetch("crud.php?action=selectAll"); //await -> depois que retornar o objeto de resposta. responseObject -> objeto tipo 'promise' retornado
    let responseDataValue = await responseObject.json(); // await -> depois que converter o objeto de resposta tipo 'promise' para json
    return responseDataValue; //Retorna um json com os dados do banco
}

async function update(id,name,phone,email) //Atualizar um registro
{
    let formData = new FormData(); //Novos dados de formulário
    formData.append("id",id); //c#6
    formData.append("name",name); //c#6
    formData.append("phone",phone); //c#6
    formData.append("email",email); //c#6
    
    let options = {//c#7
        method:"POST",
        header:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
        body:formData
    };
    let request = await fetch("crud.php?action=update",options); //request se torna um objeto 'promise'
    let result = await request.text(); //result aguarda a promise 'request' virar um texto

    return result; //retorna 'ok' se fou atualizado com sucesso, ou 'error' se não

}

function check(element,event) //Verifica se algum texto está dentro do padrão permitido
{
    let span = document.getElementById(element.getAttribute("data-errorSpan")); //span de erro do input que está sendo checado

    let key = event.key;//tecla que foi pressionada

    if(key != "Backspace" && key != "Delete") //não executa a função ao pressionar 'Backspace' ou 'Delete'
    {
    
        if(element.id == "inputPhone")//se for o input do telefone
        {
            
                if(!checkRegularExp(element.value,"phone")) //Se a função 'checkRegularExp' retornar negativo, significa que o texto está fora do padrão permitido
                {
                    
                    span.innerHTML = "*telefone inválido"; //Texto para indicar o usuário que o texto digitado está fora do padrão
                }
                else
                {
                    span.innerHTML = "";//Apaga o texto de erro caso o texto esteja no padrão
                }

                

                let l = element.value.length; //Tamanho do texto digitado
                let val = element.value; //O texto digitado

                
                let regPart1 = new RegExp("[(][\\d]{3}[)]");//manter sempre o padrão *( + 2 números + )*
                if(regPart1.test(val) && l < 15) //se a expressão 'regPart1' existir e o tamanho do texto for menor que 15
                {
                    let n = val[3]; //Último caracter digitado
                    let temp = val.slice(0,3);//Separa o texto em 2 antes do último caracter e guarda a primeira parte
                    element.value = temp + ") " + n;//Adiciona um ')' antes do último caracter para manter o padrão de telefone. Ex.: (11)....
                }

                
                let regDash = new RegExp("[0-9]{6}[-]");//manter "-" sempre após 4 ou 5 números depois de "(xx) "
                if(regDash.test(val)) //Se a expressão for igual
                {
                    
                    let dashPosition = val.indexOf("-"); //Pega a posição no texto do traço
                    let valPart1 = val.slice(0,dashPosition - 1);//Pega uma parte do texto, nesse caso desde o começo até a posição antes do traço
                    let valPart2 = val.slice(10);//Pega todo o texto depois do traço
                    valPart2 = valPart2.replace("-","");//Remove o traço para poder inseri-lo em outra posição
                    element.value = valPart1 + "-" + valPart2;//Insere o traço antes do ultimo número que estava trás dele. Ex.: antes= "(00) 000000-" depois= "(00) 00000-0"
                }

                let regNumber = new RegExp("[0-9]"); //Expressão para testar se o caractere é número

                switch(l) //Tamanho do texto
                {
                    case 1:
                        if(val[0] != "(") //Ao digitar o primeiro número
                        {
                            element.value = "(" + val; //Insere o '(' antes do número digitado
                        }
                    break;

                    case 3:
                        element.value = val + ")"; //Insere o ')' depois de 2 números digitados
                    break;
                    
                    case 4:
                        if(val[3] != ")") //Se não tem o ')'
                        {
                            let part1 = val.slice(0,3); //Pega o texto até antes do último número
                            let part2 = val.slice(3); //Pega o último número
                            
                            element.value = part1 + ")" + part2; //Adiciona ')' antes do último número

                        }
                    break;

                    case 5:
                        if(val[4] != " " && !regPart1.test(val)) //Se ainda não tem um espaço depois de '(00)', e não tem 3 números entre parênteses
                        {                        
                            let part1 = val.slice(0,4); //Pega o texto até antes do último número
                            let part2 = val.slice(4); //Pega o último número

                            element.value = part1 + " " + part2; //Adiciona um espaço antes do último número para que fique: "(00) 0"
                        }

                    break;

                    case 9:
                        if(regNumber.test(key)) //verifica se foi um número que foi digitado (para não adicionar outro traço caso um traço seja digitado)
                        {
                            element.value = val + "-"; //Adiciona o traço
                        }
                    break;

                    case 10:
                    case 11:

                        if(val[l-2] != "-" && val[l-1] != "-" && regNumber.test(key)) //c#9
                        {
                            let temp = val.slice(0,l-1); //Pega o texto até 1 antes do último número
                            let temp2 = val[l-1]; //Pega o último número
                            
                            
                            element.value = temp + "-" + temp2; //Adiciona o traço antes do último número que foi digitado
                        }
                    break;

                    case 15:

                        if(val[9] == "-") //Se o traço estiver na posição 9 (com 5 números depois dele)
                        {
                            let temp = val.replace("-",""); //Remove o traço
                                            
                            let part1 = temp.slice(0,10); //Pega o texto até 1 número depois de onde estava o traço
                            let part2 = temp.slice(10); //Pega o texto a partir de 2 números depois de onde estava o traço

                            
                            element.value = part1 + "-" + part2; //Ex.: antes -> (00) 0000-00000 depois -> (00) 00000-0000
                        }
                    break;
                }
            
            


        }

        if(element.id == "inputName") //Se o campo a ser validado for o do nome 
        {
            if(!checkRegularExp(element.value,"name")) //Função pra checar a expressão na rotina nome(name)
            {
                
                span.innerHTML = "*nome inválido";
            }
            else
            {
                span.innerHTML = "";
            }
        }
        if(element.id == "inputEmail") //Se o campo a ser validado for o do email
        {
            //if(k.key == "backSpace")
            if(!checkRegularExp(element.value,"email")) //Função pra checar a expressão na rotina email(mail)
            {
                
                span.innerHTML = "*email inválido";
            }
            else
            {
                span.innerHTML = "";
            }
        }
    }
    else
    {
        span.innerHTML = ""; //Se não cair em nenhuma rotina de erro, o span não exibe nada
    }
}
//Checar se os textos do input nome, email e telefone estão no padrão correto
function checkRegularExp(expression,type) //expression = texto à ser checado; type = padrão para comparar o texto (nome ou telefone ou email)
{
    let regP = new RegExp("^[(][0-9]{2}[)]\\s[0-9]{4,5}[-][0-9]{4}$"); //Padrão/expressão regular (RegExp) do telefone (phone)
    let regN = new RegExp("^([A-Z][a-z]{1,}[\\s]{0,1}){1,}$"); //Padrão/expressão regular (RegExp) do nome (name)
    let regE = new RegExp("^.{1,}[@][a-z]{1,}[.]"); //Padrão/expressão regular (RegExp) do email

    switch(type) //Dependendo do tipo, muda a RegExp a ser comparada com o texto e retorna o resultado - negativo se estiver fora do padrão ou positivo se estiver dentro
    {
        case "phone":
            return regP.test(expression);
        break;
        
        case "name":
            return regN.test(expression);
        break;

        case "email":
            return regE.test(expression);
        break;

    }
}
/*Função executada ao clicar fora de algum input
serve para apagar alguma mensagem de erro que fique no spam mesmo depois de deixar no padrão correto, ou verificar se ainda tem algum erro
*/
function checkFullInput(element)
{
    let type = element.id.replace("input",""); //c#10
    type = type.toLowerCase(); //Todas as letras ficam minúsculas

    let span = document.getElementById(element.getAttribute("data-errorSpan")); //Pega o span de erro do input que está sendo verificado
    
    if(checkRegularExp(element.value,type)) //Executa a função checkRegularExp passando o texto do input a ser analizado e o tipo no formato exigido pela função (letras minúsculas), sendo name, phone ou email
    {
        
        span.innerHTML = "";
    }
    else
    {
        switch(type)
        {
            case "phone":
                span.innerHTML = "*telefone inválido"
            break;
            case "email":
                span.innerHTML = "*email inválido"
            break;
            case "name":
                span.innerHTML = "*nome inválido"
            break;
        }
    }

    if(element.value == "")
    {
        span.innerHTML = "";
    }
}
//Função para verificar o input depois de colar dentro do mesmo
async function checkFilledInput(element)
{
    let val = await navigator.clipboard.readText(); //Pega o texto que foi copiado para a área de transferência
        
    let l = val.length; //Tamanho do texto na área de transferência
    let event = new Event("keyup"); //Evento de pressionar a tecla (nesse caso o evento a ser disparado é o keyup, ou seja, quando a tecla levanta depois de ser pressionada)
    event.key = "ArrowRight"; //Coloca a seta para a direita como a tecla que foi pressionada (apenas para disparar a função check)
    element.value = ""; //Limpa o que já tiver escrito no input

    for(let i = 0; i < l; i++)
    {
        
        element.value += val[i]; //Adiciona caracter por caracter no input
        check(element,event); // Verifica se o input está no padrão
        
    }
}