<?php

class Peopple
{
    private $pdo;

    //Função que impede que uma propriedade que não existe seja criada
    public function __set($property,$value)
    {
        if(!property_exists($this,$property))
        {
            throw new Exception(`The property $property don't exists`);
        }
    }

    //Construtor
    public function __construct($dbSpecs,$user,$password) //Os parâmetros do construtor são os mesmos do PDO
    {
        try
        {
            $this->setPdo(new PDO($dbSpecs,$user,$password,array(PDO::MYSQL_ATTR_FOUND_ROWS => true))); //Cria o objeto pdo. 'MYSQL_ATTR_FOUND_ROWS => true' faz com que o mysql retorne 1 mesmo quando algo não foi atualizado (usaso em operações de select)
        }
        catch(PDOException $eP) //Erro do pdo
        {
            echo "Database error: " . $eP->getMessage(); //Exibe a mensagem de erro
            exit;
        }
        catch(Exception $e)//Erro da execussão do código no escopo 'try'
        {
            echo "Error: " . $e->getMessage(); //Outro erro referente a execussão do código
            exit;
        }
    }

    
    public function selectDataAll() //Função para pegar todos os registros na tabela
    {
        $conection = $this->getPdo(); //'$conection' = objeto PDO da classe (propriedade)
        $cmd = $conection->prepare("SELECT * FROM tb_records ORDER BY id DESC"); //Comando para pegar todos os registros, na ordem em que foram adicionados
        try
        {
            $cmd->execute(); //Executa o comando sql
            $cmdData = $cmd->fetchAll(PDO::FETCH_ASSOC); //Pega todos os registros em forma de array com o nome da coluna como índice
            return $cmdData; //Retorna o array
        }
        catch(Exception $e)//Erro da execussão do código no escopo 'try'
        {
            $message = "Unexpected error " . $e->getMessage(); //variável $e recebe o erro
            return $message; //Retorna a mensagem de erro
        }
        catch(PDOException $pe) //Erro do PDO
        {
            $message = "Unexpected PDO error " . $pe->getMessage(); //Erro na execussão do PDO
            return $message; //Retorna a mensagem de erro PDO
        }
        

    }


    public function register($name,$email,$phone) //Inserir novo registro
    {
        $conection = $this->getPdo(); //'$conection' = objeto PDO da classe (propriedade)
        $command = $conection->prepare("INSERT INTO tb_records (name,email,phone) VALUES (:n,:e,:t)"); //Comando de inserir o registro com outros caracteres no lugar dos valores
        $command->bindParam(":n",$name); //Troca o caracter do comando pelo valor a ser inserido
        $command->bindParam(":e",$email);//Troca o caracter do comando pelo valor a ser inserido
        $command->bindParam(":t",$phone);//Troca o caracter do comando pelo valor a ser inserido

        try
        {
            
            $resultQuery = $command->execute(); //'$resultQuery' = retorno da execussão do comando

            if($resultQuery > 0) //Se inseriu o registro com sucesso, o mysql retorna 1 para a variável '$resultQuery' 
            {
                return "ok";
            }
            else
            {
                return "Query error";
            }
        }
        catch (Exception $e) //Erro da execussão do código no escopo 'try'
        {
            return "Unexpected error: " . $e->getMessage(); //Retorna a mensagem de erro
        }
        catch(PDOException $pe) //Erro do PDO
        {
            return "Unexpected PDO error: " . $pe->getMessage(); //Retorna a mensagem de erro PDO
        }
        
    }


    public function update($id,$name,$phone,$email) //Atualizar registro
    {
        $conection = $this->getPdo(); //'$conection' = objeto PDO da classe (propriedade)
        try
        {
            $command = $conection->prepare("UPDATE tb_records SET name = ?, email = ?, phone = ? WHERE id = ?"); //Comando para atualizar um registro
            $command->execute([$name,$email,$phone,$id]); //Executa o comando substituindo '?' pelo novo valor

            return $command->rowCount(); //Retorna quantas linhas foram afetadas (será 1 se não houver erro)
        }
        catch(Exception $e) //Erro da execussão do código no escopo 'try'
        {
            return "Generic error: " . $e->getMessage(); //Retorna a mensagem de erro
        }
        catch(PDOException $pe) //Erro do PDO
        {
            return "PDO error: " . $pe->getMessage(); //Retorna a mensagem de erro PDO
        }
    }

    public function deleteUser($id) //Apagar registro
    {
        try 
        {            
            $conection = $this->getPdo(); //'$conection' = objeto PDO da classe (propriedade)
            $command = $conection->prepare("DELETE FROM tb_records WHERE id = ?"); //Comando para deletar pelo id
            $command->execute([$id]); //Substitui o '?' pelo valor do id (precisa ser um array para funcionar, mesmo que seja um unico dado)
            
            return $command->rowCount(); //Retorna quantas linhas foram afetadas (será 1 se não houver erro)
            
        } catch (Exception $e) { //Erro da execussão do código no escopo 'try'
            return "Generic error: " . $e->getMessage();
        }
        catch(PDOException $pe) //Erro do PDO
        {
            return "PDO error: " . $pe->getMessage();
        }
    }

    //GETTERS E SETTERS
    public function getPdo()
    {
        return $this->pdo;
    }
    public function setPdo($nPdo)
    {
        $this->pdo = $nPdo;
    }
}

?>