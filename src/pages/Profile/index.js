
import { useState, useContext, useEffect } from 'react';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import avatar from '../../assets/avatar.png';
import { AuthContext } from '../../contexts/auth';
import { FiSettings, FiUpload } from 'react-icons/fi';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { Link,useNavigate } from 'react-router-dom';
//import img from '../../../public/img'

export default function Profile(){

  const { user, signOut, setUser, setLocalUser} = useContext(AuthContext);
  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar]=useState(null);
  const history=useNavigate();

  useEffect(() =>{
    let usuarioLogado = localStorage.getItem('usuarioLogado')
    let emailLogado = localStorage.getItem("EmailLogado")
    if(usuarioLogado != null){
      const responseApi = fetch("http://localhost:8080/usuarios?email=" + emailLogado,{
                   method: "GET",
                   headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin":"*",
                    "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
                   },
                }).then(response => response.json())
                .then(data => {
                  setNome(data[0].nome)
                  setEmail(data[0].email)
                  fetch("http://localhost:8080/imagens?id="+data[0].id)
                  .then(response => response.json())
                  .then(imagem => {
                    if(imagem != null){
                      setAvatarUrl(imagem[0].caminho)
                      console.log(imagem[0].caminho)
                    }
                  })
                });
    }else{
      history("/")
    }
  },[])

function handleFile(e){
  
  handleUpload(e[0])
  
}

 async function handleSave(e){
    e.preventDefault();
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
            try{
              const responsePut = fetch("http://localhost:8080/usuarios/"+ data[0].id,{
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin":"*",
                  "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
                },
                body: JSON.stringify({nome: nome, email: email})
              })
              toast.success("Edicação realizada com sucesso!");
            }catch(e){
              toast.error("Um erro ocorreu ao realizar a edição!");
            }
        });
  }

  async function handleLogout(e){
    signOut().then(res =>{
      if(res){
        toast.success('Logout efetuado com sucesso!');
        history("/")
      }else{
        toast.error("Um erro ocorreu ao efetuar o logout! Tente Novamente!");
      }
    })
  }

  async function handleUpload(dado){
   console.log("Entrou aqui!!")
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
            const responseGetImagem = fetch("http://localhost:8080/imagens?id="+data[0].id)
            .then(response => response.json())
            .then(resultadoImagem =>{
              console.log(resultadoImagem)
              if(resultadoImagem.length == 0){
                try{
                  console.log("entrou aqui na imagem nova!!")
                  var arquivo = new FormData()
                  arquivo.append('data', dado)
                  console.log("Conteudo imagem avatar"+dado)
                  console.log("Conteudo do arquivo aqui "+arquivo.data)
                  arquivo.append('idUsuario',data[0].id)
                  const responsePut = fetch("http://localhost:8080/imagens/add",{
                    method: "POST",
                    headers: {
                      "Access-Control-Allow-Origin":"*",
                      "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
                    },
                    body: arquivo            
                  }).then(response => response.text())
                  document.location.reload()
                  toast.success("Imagem adicionada com sucesso!");
                }catch(e){
                  toast.error("Ocorreu um erro ao adicionar a imagem!");
                }
              }else{
                var arquivo = new FormData()
                arquivo.append('data', dado)
                arquivo.append('idUsuario',data[0].id)
                console.log(resultadoImagem[0])
                try{
                  fetch("http://localhost:8080/imagens/"+resultadoImagem[0].id,{
                  method: "PUT",
                  headers: {
                    "Access-Control-Allow-Origin":"*",
                    "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
                  },
                  body: arquivo
                  })
                  document.location.reload()
                }catch(e){
                  toast.error("Ocorreu um erro ao atualizar a imagem!");
                }
              }
            })
        });


  }
  return(
    <div>
      <Header/>

      <div className="content">
        <Title nome="Meu perfil">
          <FiSettings size={25} />
        </Title>


        <div className="container">
          <form onSubmit={(e)=>handleSave(e)} className="form-profile" encType="multipart/form-data">
            <label className="label-avatar">
              <span>
                <FiUpload color="#000" size={25} />
              </span>

              <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files)}/><br/>
              { avatarUrl === null ? 
                <img src={"http://192.168.1.116:8081/"+avatarUrl} width="250" height="250" alt="Foto de perfil do usuario" />
                :
                <img src={"http://192.168.1.116:8081/"+avatarUrl} width="250" height="250" alt="Foto de perfil do usuario" />
              }
            </label>

            <label>Nome</label>
            <input type="text" value={nome} onChange={ (e) => setNome(e.target.value) } />

            <label>Email</label>
            <input type="text" value={email} disabled={true} />     

            <button type="submit">Salvar</button>       

          </form>
        </div>

        <div className="container">
            <button className="logout-btn" onClick={(e) => handleLogout(e)} >
               Sair
            </button>
        </div>

      </div>
    </div>
  )
}