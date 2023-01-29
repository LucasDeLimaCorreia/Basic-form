<?php

include_once "peoppleClass.php";

$pdoSettings = array("dbSpec" => "mysql:dbname=records_db;host=localhost","dbUser" => "root", "dbPassword" => ""); //dados da conexão mysql
$p = new Peopple($pdoSettings["dbSpec"],$pdoSettings["dbUser"],$pdoSettings["dbPassword"]); //classe pessoa recebe os parâmetros da conexão com o banco

if(!isset($_GET["action"])) //Se está faltando o parâmetro 'action'
{
    echo "<script> alert('Error: incorrect data') </script>";
    exit; //Termina o código
}
else
{
    $action = $_GET["action"];
}

//---------------------------------------------SELECT ALL-------------------------------------------
if($action === "selectAll")//Pega todos os dados na tabela
{
    
    
    $data = $p->selectDataAll();//Chama o método da classe pessoa que pega todos os dados da tabela
    echo json_encode($data); //Retorna os dados da tabela em forma de Json
    
}
//---------------------------------------------INSERT-----------------------------------------------

if($action === "register") //Inserir um novo registro na tabela
{
    if(!isset($_POST["name"]) or !isset($_POST["email"]) or !isset($_POST["phone"])) //Se faltar algum dos parâmetros
    {
        $returnMessage = "Error, check the data"; //Mensagem de retorno
        echo $returnMessage; //Exibe a mensagem
    }
    else if($_POST["name"] == "" or $_POST["email"] == "" or $_POST["phone"] == "") //Se algum dos parâmetros estiver em branco
    {
        $returnMessage = "Error, check empty data"; //Mensagem de retorno
        echo $returnMessage; //Exibe a mensagem
    }
    else
    {   //Atribui os valores dos parâmetroa às variaveis
        $name = $_POST["name"];
        $email = $_POST["email"];
        $phone = $_POST["phone"];
        
        try //Tenta executar. Se houver algum erro, executa o escopo 'catch'
        {
            
            $result = $p->register($name,$email,$phone); //'$result' recebe o retorno do método register da classe pessoa
            
            switch($result)
            {
                case "ok":
                    echo "Successfully registered";
                break;

                case "Query error":
                    echo "Error registering";
                break;

                default:
                echo $result; //Irá retornar a mensagem de erro padrão do trecho 'try/catch' do método

            }
        }
        catch(Exception $e)
        {
            echo "Unexpected error: " . $e->getMessage(); //Exibe o erro do escopo 'try'
        }

       
    }
    
    
}

if($action === "update") //Atualizar um registro
{
    if(!isset($_POST["id"]) or !isset($_POST["name"]) or !isset($_POST["email"]) or !isset($_POST["phone"])) //Se falta algum dos parâmetros
    {
        echo "Error, check the data";
        
    }
    else if($_POST["id"] == "" or $_POST["name"] == "" or $_POST["email"] == "" or $_POST["phone"] == "") //Se algum dos parâmetros está vazio
    {
        echo "Error, check empty data";
        
    }

    else
    {
        $id = $_POST["id"];
        $name = $_POST["name"];    
        $email = $_POST["email"];    
        $phone = $_POST["phone"];

        $response = $p->update($id,$name,$phone,$email); //Chama o método 'update' da classe pessoa para atualizar os dados do registro

        if($response > 0) //$response recebe o resultado de 'rowCount' (mais que zero = 1 ou mais linhas atualizadas. Nesse caso será apenas 1)
        {
            echo "ok";
        }
        else
        {
            echo "error";
        }
        
    }

}

if($action === "deleteUser") //Apagar registro
{
    if(!isset($_POST["id"])) //Verifica se veio o parâmetro de id
    {
        echo "Error, check the data";
    }
    else
    {
        $id = $_POST["id"];

        $response = $p->deleteUser($id); //Chama o método 'deleteUser' da classe pessoa que apaga um registro

        if($response > 0) //$response recebe o resultado de 'rowCount' (mais que zero = 1 ou mais linhas atualizadas. Nesse caso será apenas 1)
        {
            echo "Successfully deleted";
        }
        else
        {
            echo $response;
        }
    }
}






/*$bindCmd = $pdo->prepare("INSERT INTO tb_cadastro (nome,telefone,email) VALUES (:n,:t,:e)");
//bindParam substitui o primeiro argumento pelo segundo. Ex.: $var->bindParam(:nome,"Mauricio"). Útil para fins de segurança
$bindCmd->bindParam(":n",$userData["nome"]); 
$bindCmd->bindParam(":t",$userData["telefone"]);
$bindCmd->bindParam(":e",$userData["email"]);

/*Também pode ser utilizado um segundo método, o $var->query().
Nesse caso não necessita do execute, a propria função já executa a query no banco*/

//$pdo->query("INSERT INTO tb_cadastro (nome,telefone,email) VALUES ('" . $userdata["nome"]) . "','" . $userData["telefone"] . "','" . $userData["email"] . "')";
/*
try
{
    $bindCmd->execute();
}
catch(Exception $e)
{
    echo "Query insert error: " . $e->getMessage();
}
*/
//---------------------------------------------UPDATE-----------------------------------------------

/*
$userId = $_POST["id"];

$bindCmd = $pdo->prepare("UPDATE tb_cadastro SET nome = ':nome', email = ':email' , telefone = ':telefone' WHERE id = :id ");
$bindCmd->bindParam(":nome",$userData["nome"]);
$bindCmd->bindParam(":email",$userData["email"]);
$bindCmd->bindParam(":telefone",$userData["telefone"]);
$bindCmd->bindParam(":id",$userId);

try
{
    $bindCmd->execute();
}
catch(Exception $e)
{
    echo "Query update error: " . $e->getMessage();
}
*/

//---------------------------------------------DELETE-----------------------------------------------

/*
$userId = $_POST["id"];
$bindCmd = $pdo->prepare("DELETE FROM tb_cadastro WHERE id = :id");
$bindCmd->bindParam(":id",$userId);
$bindCmd->execute();
*/
//---------------------------------------------SELECT-----------------------------------------------

/*
$bindCmd = $pdo->prepare("SELECT * FROM tb_cadastro WHERE id = :id");
$bindCmd->bindParam(":id",$userData["id"]);
$bindCmd->execute();
$selectResult = $bindCmd->fetch(PDO::FETCH_ASSOC);
*/




?>