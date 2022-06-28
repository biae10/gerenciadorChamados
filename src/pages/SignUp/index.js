import logo from '../../assets/login.png'
import { Link,useNavigate } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react';
import {AuthContext} from '../../contexts/auth';
import { toast } from 'react-toastify';

function SignUp() {
    const [nome, setNome]=useState('');
    const [email, setEmail]=useState('');
    const [senha, setSenha]=useState('');
    const {signUp, user,loading}=useContext(AuthContext);
    const history=useNavigate();
    
    useEffect(() =>{
      let usuarioLogado = localStorage.getItem('usuarioLogado')
      console.log(usuarioLogado)
      if(usuarioLogado != null){
        history("/dashboard")
      }
    },[])
    
    function handleSubmit(e){
      e.preventDefault();
      if(email =='' ||  senha ==''|| nome ==''){
        toast.error("Preencha todos os campos!");
        return
      }
      
      signUp(email, senha,nome).then(res =>{
        if(res){
          toast.success('Usuário cadastrado com sucesso!');
          history("/dashboard")
        }else{
          toast.error("Um erro ocorreu ao criar o usuário");
        }
      })
    }

    return (
      <div className="conteiner-center">
        <div className="login">
          
          <div className="login-area">
            <img src={logo} alt="Logo do Sistema"/>
          </div>
         
          <form onSubmit={handleSubmit}>
            <h1>Nova Conta</h1>
            {user && user.email}
            <input type="text" value={nome} placeholder="Seu nome"  onChange={(e)=>{setNome(e.target.value)}} />
            <input type="text" value={email} placeholder="email@email.com"  onChange={(e)=>{setEmail(e.target.value)}} />
            <input type="password" value={senha} placeholder="*****" onChange={(e)=>{setSenha(e.target.value)}}/>
            <button type="submit">Cadastrar</button>
          </form>
         
          <Link to="/">Já possui uma conta? Entre aqui!</Link>
       
        </div>
      </div>
    );
  }
  

  
  export default SignUp;