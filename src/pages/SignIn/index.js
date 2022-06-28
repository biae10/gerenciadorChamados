import './signin.css'
import logo from '../../assets/login.png'
import { Link, useNavigate } from 'react-router-dom'
import { useState,useContext, useEffect } from 'react';
import {AuthContext} from '../../contexts/auth';
import { toast } from 'react-toastify';

function SignIn() {
    const [email, setEmail]=useState('');
    const [senha, setSenha]=useState('');
    const {signIn, user,loading}=useContext(AuthContext);
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

      console.log(email);
      if(email == '' ||  senha ==''){
        toast.error("Preencha todos os campos!");
        return
      }
     
      signIn(email, senha).then(res =>{
        if(res){
          history("/dashboard")
          toast.success('Bem-vindo de volta!');
        }else{
          toast.error("Usuário ou senha incorretos!");
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
            <h1>Entrar</h1>
            <input type="text" value={email} placeholder="email@email.com"  onChange={(e)=>{setEmail(e.target.value)}} />

            <input type="password" value={senha} placeholder="*****" onChange={(e)=>{setSenha(e.target.value)}}/>
            <button type="submit">Acessar</button>
          </form>
         
          <Link to="/register">Criar uma conta</Link>
       
        </div>
      </div>
    );
  }
  
  export default SignIn;