
import './dashboard.css';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link,useNavigate } from 'react-router-dom';

export default function Dashboard(){
  const [chamados, setChamados] = useState([]);
  const history=useNavigate();
  
  useEffect(() =>{
    let usuarioLogado = localStorage.getItem('usuarioLogado')
    if(usuarioLogado != null){
      
      const resultApi = fetch("http://localhost:8080/chamados")
            .then(response => response.json())
            .then(data =>{
              setChamados(data)
            })
    }else{
      history("/")
    }
  },[])
  
  function editar(id){
    localStorage.setItem("idChamadoEdicao",id);
    history("/new")
  }

  function visualizar(id){
    localStorage.setItem("idChamadoEdicao",id);
    history("/details")
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title nome="Atendimentos">
          <FiMessageSquare size={25} />
        </Title>

        {chamados.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhum chamado registrado...</span>

            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo chamado
            </Link>
          </div>
        )  : (
          <>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo chamado
            </Link>

            <table>
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">Assunto</th>
                  <th scope="col">Status</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {chamados.map((chamado) =>{
                  return(<tr>
                    <td data-label="Cliente">{chamado.cliente.nome}</td>
                    <td data-label="Assunto">{chamado.assunto}</td>
                    <td data-label="Status">
                      <span className="badge" style={{backgroundColor: '#5cb85c'}}>{chamado.status}</span>
                    </td>
                    <td data-label="Cadastrado">{chamado.dataRegistro}</td>
                    <td data-label="#">
                      <button onClick={() => {visualizar(chamado.chamadoId)}} className="action" style={{backgroundColor: '#3583f6' }}>
                        <FiSearch color="#FFF" size={17} />
                      </button>
                      <button onClick={() => {editar(chamado.chamadoId)}} className="action" style={{backgroundColor: '#F6a935' }}>
                        <FiEdit2 color="#FFF" size={17} />
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

      </div>

    </div>
  )
}