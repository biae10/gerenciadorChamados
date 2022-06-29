import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './new.css';
import firebase from '../../services/firebaseConnection';
import { Link,useNavigate } from 'react-router-dom';

export default function New() {
    const [loadingClientes, setLoadingClientes] = useState(true);
    const [clienteSelecionado, setClienteSelecionado] = useState(1);
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('ABERTO');
    const [complemento, setComplemento] = useState('');
    const [clientes, setClientes] = useState([]);
    const [edicao, setEdicao] = useState(localStorage.getItem("idChamadoEdicao"))
    const history=useNavigate();

    useEffect(() => {
        let usuarioLogado = localStorage.getItem('usuarioLogado')
        if(usuarioLogado != null){
            
            try{
                fetch("http://localhost:8080/chamados?id="+edicao)
                .then(response => response.json())
                .then(data =>{
                  
                    if(data[0] != null){
                        setClienteSelecionado(data[0].cliente.clienteId)
                        setAssunto(data[0].assunto)
                        setStatus(data[0].status)
                        setComplemento(data[0].complemento)
                        async function loadClientes() {
                            const resultApi = fetch("http://localhost:8080/clientes")
                            .then(response => response.json())
                            .then(data =>{
                              setClientes(data);
                              setLoadingClientes(false);
                            })
                          }
                          loadClientes();
                          localStorage.removeItem("idChamadoEdicao")
                    }else{
                        async function loadClientes() {
                            const resultApi = fetch("http://localhost:8080/clientes")
                            .then(response => response.json())
                            .then(data =>{
                              setClientes(data);
                              setLoadingClientes(false);
                            })
                          }
                          loadClientes();
                    }
                })
            }catch(e){

            }
        }else{
            history("/")
        }
    }, []);

    async function handleChamado(e) {
        e.preventDefault();
        if(complemento == ""){
            toast.error("Preencha o campo complemento!")
            return;
        }

        let emailLogado = localStorage.getItem("EmailLogado")
        const responseApi = fetch("http://localhost:8080/usuarios?email=" + emailLogado,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":"*",
                "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
            },
        }).then(response => response.json())
          .then(data => {
            
            fetch("http://localhost:8080/chamados?id="+edicao)
            .then(response => response.json())
            .then(chamadoEdit =>{

                if(chamadoEdit[0] != null){
                    try{
                        fetch("http://localhost:8080/chamados/"+edicao,{
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin":"*",
                                "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
                            },
                            body: JSON.stringify({assunto: assunto,status: status,complemento: complemento,  cliente: clienteSelecionado, usuario: data[0].id}) 
                        })
                        toast.success("Chamado editado com sucesso!");
                    }catch(e){
                        toast.error("Um erro ocorreu ao editar o chamado!");  
                    }
                }else {
                    try{
                        const responseApi = fetch("http://localhost:8080/chamados/add",{
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin":"*",
                                "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
                               },
                            body: JSON.stringify({assunto: assunto,status: status,complemento: complemento,  cliente: clienteSelecionado, usuario: data[0].id})
                        })
                        toast.success("Chamado adicionado com sucesso!");
                        setAssunto("Suporte");
                        setStatus("ABERTO");
                        setComplemento("");
        
                    }catch(e){
                        toast.error("Um erro ocorreu ao salvar o chamado!");
                    }
                }
            })
        });
    }

    return (
        <div>
            <Header />

            <div className="content">
                <Title nome="Novo chamado">
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">

                    <form onSubmit={(e) => { handleChamado(e) }} className="form-profile">
                        <label>Cliente</label>
                        {loadingClientes ?
                            <input type="text" value="Carregando..." />
                            : <select value={clienteSelecionado} onChange={(e) => setClienteSelecionado(e.target.value)}>
                                {clientes.map((item, index) => {
                                    return (<option key={item.clienteId} value={item.clienteId}>{item.nome}</option>);
                                })}
                            </select>
                        }


                        <label>Assunto</label>
                        <select value={assunto} onChange={(e) => setAssunto(e.target.value)}>
                            <option value="Suporte">Suporte</option>
                            <option value="Financeiro">Financeiro</option>
                            <option value="Visita">Visita</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input
                                type="radio"
                                name="radio"
                                value="ABERTO"
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === "ABERTO"} />
                            <span>Em Aberto</span>

                            <input
                                type="radio"
                                name="radio"
                                value="PROGRESSO"
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === "PROGRESSO"} />
                            <span>Em Progresso</span>

                            <input
                                type="radio"
                                name="radio"
                                value="ATENDIDO"
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === "ATENDIDO"} />
                            <span>Atendido</span>
                        </div>
                        <label>Complemento</label>
                        <textarea type="text"
                            placeholder="Descreva seu problema aqui"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)} />

                        <button type="submit">Registrar</button>
                    </form>

                </div>

            </div>
        </div>
    );
}