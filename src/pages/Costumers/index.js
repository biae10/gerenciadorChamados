import { useState, useEffect } from 'react';
import { FiUser, FiDelete,FiEdit2 } from 'react-icons/fi';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { Link,useNavigate } from 'react-router-dom';
import './costumers.css'
export default function Costumers() {

    const [idClient, setIdClient] = useState(5000000); 
    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');
    const [clientes, setClientes] = useState([]);
    const history=useNavigate();

    useEffect(()=>{
      let usuarioLogado = localStorage.getItem('usuarioLogado')
      if(usuarioLogado != null){
          async function loadClientes() {
            const resultApi = fetch("http://localhost:8080/clientes")
            .then(response => response.json())
            .then(data =>{
              setClientes(data)
            })
          }
          loadClientes();
      }else{
          history("/")
      }
    },[clientes]);

    function handleSubmit(e){
        e.preventDefault();
        
        if(nome == "" || cnpj == "" || endereco == ""){
          toast.error("Preencha todos os campos!");
          return;
        }

        try{
          const responseGetVerifica = fetch("http://localhost:8080/clientes?id="+idClient)
          .then(response => response.json())
          .then(data =>{
            console.log(idClient)
            if(data != null && data != ""){
             console.log("Entrou aqui!")
              try{
                fetch("http://localhost:8080/clientes/"+idClient,{
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin":"*",
                    "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
                   },
                   body: JSON.stringify({nome: nome, cnpj: cnpj, endereco: endereco})
                })
                setIdClient(5000000);
                setNome("");
                setCnpj("");
                setEndereco("");
                toast.success("Edição realizada com sucesso!");
                return;
              }catch(e){
                toast.error("Um erro ocorreu ao editar o item!");
                return;
              }
            }else{
              try{
                const responseApi = fetch("http://localhost:8080/clientes/add",{
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin":"*",
                    "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
                   },
                   body: JSON.stringify({nome: nome, cnpj: cnpj, endereco: endereco})
                })
                toast.success("O novo cliente foi salvo com sucesso!");
              }catch(e){
                toast.error("Um erro ocorreu ao salvar o cliente!");
              }
              setIdClient(5000000);
              setNome("");
              setCnpj("");
              setEndereco("");
            }
          })
  
        }catch(e){
          toast.error("Ocorreu um erro ao editar o item!");
        }
    }
    async function exlcluir(id){
        try{
          const responseApi = fetch("http://localhost:8080/clientes/"+id,{
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin":"*",
              "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
             }
          });
          toast.success("O cliente foi removido com sucesso!");
        }catch(e){
          toast.error("Um erro ocorreu ao excluir o cliente!");
        }
    }

    async function editar(id){

      try{
        const responseApi = fetch("http://localhost:8080/clientes?id="+id)
        .then(response => response.json())
        .then(data =>{
          if(data != null){
            setIdClient(data[0].clienteId);
            setNome(data[0].nome);
            setCnpj(data[0].cnpj);
            setEndereco(data[0].endereco);
          }
        })

      }catch(e){
        toast.error("Ocorreu um erro ao editar o item!");
      }
    }

    return (
        <div>
            <Header />

            <div className="content">
                <Title nome="Clientes">
                    <FiUser size={25} />
                </Title>


                <div className="container">
                    <form onSubmit={(e)=>{handleSubmit(e)}} className="form-profile costumers">
                        <label>Nome</label>
                        <input placeholder="Digite o Nome Fantasia" type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

                        <label>CNPJ</label>
                        <input placeholder="Digite o CNPJ" type="text" value={cnpj} onChange={(e) => { setCnpj(e.target.value) }} />

                        <label>Endereço</label>
                        <input placeholder="Digite o seu Endereço" type="text" value={endereco} onChange={(e) => { setEndereco(e.target.value) }} />

                        <button className="button-costumers" type="submit">Salvar</button>
                    </form>
                </div>
                <table>
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">CNPJ</th>
                  <th scope="col">Endereço</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                  {clientes.map((cliente)=>{
                      return(
                        <tr>
                        <td data-label="Cliente">{cliente.nome}</td>
                        <td data-label="CNPJ">{cliente.cnpj}</td>
                        <td data-label="Endereço">{cliente.endereco}</td>
                        <td data-label="Cadastrado">{cliente.dataRegistro}</td>
                        <td data-label="#">
                          <button onClick={()=>{exlcluir(cliente.clienteId)}} className="action" style={{backgroundColor: '#3583f6' }}>
                            <FiDelete color="#FFF" size={17} />
                          </button>
                          <button onClick={() => {editar(cliente.clienteId)}} className="action" style={{backgroundColor: '#F6a935' }}>
                            <FiEdit2 color="#FFF" size={17} />
                          </button>
                        </td>
                      </tr>
                      );
                  })}
                
              </tbody>
            </table>
            </div>
        </div>
    );
}