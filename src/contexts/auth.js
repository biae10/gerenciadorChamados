import { useState, createContext, useEffect } from 'react'
import firebase from '../services/firebaseConnection'
import { toast } from 'react-toastify';
import {default as auth} from "../services/firebaseConnection"
import {createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut } from "firebase/auth"

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        function loadUser() {
            const storagedUser = localStorage.getItem("usuarioLogado");
            if (storagedUser) {
                setUser(JSON.parse(storagedUser));
                //setLoading(true);
            }
            //setLoading(false);
        }
        loadUser();
    }, []);

    async function signUp(email, password, nome) {
        try{
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const responseApi = fetch("http://localhost:8080/usuarios/add",{
                   method: "POST",
                   headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin":"*",
                    "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
                   },
                   body: JSON.stringify({nome: nome, email: email}) 
                })
            setLoading(true);
            console.log(response._tokenResponse.refreshToken);
            setLocalUser(response);
            localStorage.setItem("EmailLogado",email);
            return true;
        }catch(e){
            console.log("Erro criar");
            return false;
        }
        //Criar usario no Firebase baseado no email e senha e Salvador em um banco mysql
    }

    async function signIn(email, password) {
        try{
            setLoading(true);
            //Fazer Login no firebase
            const response = await signInWithEmailAndPassword(auth,email, password ); 
            setLocalUser(response);
            localStorage.setItem("EmailLogado",email);
           // console.log(response._tokenResponse.email);
            return true;
        }catch(e){
            return false;
        }
    }


    async function signOut() {
        //Fazer logout no firebase
        try{
            signOut(auth);
            localStorage.removeItem("usuarioLogado")
            localStorage.removeItem("EmailLogado")
            return true;
        }catch(e){
            return false;
        }
    }

    function setLocalUser(data){
        localStorage.setItem('usuarioLogado', JSON.stringify(data));
    }

    return (
        <AuthContext.Provider value={{
            signed: !!user,
            user,
            signUp,
            signOut,
            signIn,
            loading,
            setUser,
            setLocalUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}
export default AuthProvider;