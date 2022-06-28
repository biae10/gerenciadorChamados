import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './detail.css';
import firebase from '../../services/firebaseConnection';
import { Link,useNavigate } from 'react-router-dom';

export default function Details() {
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
                        history("/dashboard")
                    }
                })
            }catch(e){

            }
        }else{
            history("/")
        }
    }, []);

    return (
        <div>
            <Header />

            <div className="content">
                <Title nome="Visualizar dados do chamado">
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">

                    <form className="form-profile">
                        <label>Cliente</label>
                        {loadingClientes ?
                            <input type="text" value="Carregando..." />
                            : <select value={clienteSelecionado} onChange={(e) => setClienteSelecionado(e.target.value)} disabled>
                                {clientes.map((item, index) => {
                                    return (<option key={item.clienteId} value={item.clienteId}>{item.nome}</option>);
                                })}
                            </select>
                        }


                        <label>Assunto</label>
                        <select value={assunto} onChange={(e) => setAssunto(e.target.value)} disabled>
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
                                checked={status === "ABERTO"} disabled/>
                            <span>Em Aberto</span>

                            <input
                                type="radio"
                                name="radio"
                                value="PROGRESSO"
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === "PROGRESSO"} disabled/>
                            <span>Em Progresso</span>

                            <input
                                type="radio"
                                name="radio"
                                value="ATENDIDO"
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === "ATENDIDO"} disabled/>
                            <span>Atendido</span>
                        </div>
                        <label>Complemento</label>
                        <textarea type="text"
                            placeholder="Descreva seu problema aqui"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)} disabled/>

                    </form>

                </div>

            </div>
        </div>
    );
}