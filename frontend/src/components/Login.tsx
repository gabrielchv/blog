import * as React from "react";
import { Link } from "react-router-dom";

function Login() {
    const btnClass = "btn btn-primary btn-block"

    const [username, setUsername] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const [btnStatus, setBtnStatus] = React.useState<string>("disabled " + btnClass)
    const [loginMsg, setLoginMsg] = React.useState<string>("")

    function loginInputChange(e:React.ChangeEvent<HTMLInputElement> & React.MouseEvent<HTMLInputElement>){
        e.target.name == "username" ? setUsername(e.target.value) : setPassword(e.target.value)
    }

    React.useEffect(() => {
        username && password ? setBtnStatus(btnClass) : setBtnStatus("disabled " + btnClass)
    }, [username, password])

    async function login(){
        const response = await fetch('/api/login', {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
        const data = await response.json()
        console.log(data);
        setLoginMsg(data.msg)
        if (data.status == true){
            window.location.href = "/"
        }
    }

    return(
        <div>
            <div className="container">
                <div className="row">
                    <div className="mx-auto col-xl-5 col-lg-6 col-md-8 col-xs-10 col-12">
                        <div className="login border rounded mt-5 p-lg-5 p-sm-3 py-3 text-center">
                            <div className="container">
                                <h1 className="mt-1 mb-4">BlogZerah</h1>
                                <div className="d-grid gap-2">
                                    <p>{loginMsg}</p>
                                    <div className="input-group">
                                        <input onClick={loginInputChange} onChange={loginInputChange} name="username" type="text" className="form-control" placeholder="Usuário"/>
                                    </div>
                                    <div className="input-group">
                                        <input onClick={loginInputChange} onChange={loginInputChange} name="password" type="password" className="form-control" placeholder="Senha"/>
                                    </div>
                                    <button onClick={login} className={btnStatus} type="button">Entrar</button>
                                </div>
                            </div>
                        </div>
                        <div className="login border rounded mt-sm-3 mt-0 p-3 text-center">
                            <div className="container">
                                <p>Não tem uma conta? <Link to="/cadastrar" className="link-primary text-decoration-none">Cadastrar</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
)};

export default Login;
