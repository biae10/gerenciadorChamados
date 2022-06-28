import './header.css'
import avatar from '../../assets/avatar.png'
import { Link } from 'react-router-dom'
import {useEffect, useContext, useState } from 'react';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth';

function Header() {
    const { user} = useContext(AuthContext);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);

    useEffect(() =>{
        let usuarioLogado = localStorage.getItem('usuarioLogado')
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
           fetch("http://localhost:8080/imagens?id="+data[0].id)
           .then(response => response.json())
           .then(imagem => {
             if(imagem != null){
                setAvatarUrl(imagem[0].caminho)
             }
           })
         });
    
    })
    
    return (
        <div className="sidebar">
            <div>
                <img alt="Foto Avatar" src={"http://192.168.56.1:8081/"+avatarUrl} />
            </div>
            <Link to="/dashboard">
                <FiHome color="#FFF" size={24} />
            Chamados
        </Link>
            <Link to="/costumers">
                <FiUser color="#FFF" size={24} />
            Clientes
        </Link>
            <Link to="/profile">
                <FiSettings color="#FFF" size={24} />
            Configurações
        </Link>

        </div>
    );
}
export default Header;