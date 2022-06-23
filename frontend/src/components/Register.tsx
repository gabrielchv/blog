import * as React from "react";
import { Link } from "react-router-dom";

function Register() {
    const btnClass = "btn btn-primary btn-block"

    // status das caixas
    const [btnStatus, setBtnStatus] = React.useState<string>("disabled " + btnClass)
    const [passwordStatus, setPasswordStatus] = React.useState<string[]>(["text-danger", "As senhas não correspondem"])
    const [emailStatus, setEmailStatus] = React.useState<string[]>(["text-danger", "O email não é válido"])
    const [registerMsg, setRegisterMsg] = React.useState<string>("")

    const [username, setUsername] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const [passwordConfirm, setPasswordConfirm] = React.useState<string>("")
    const [email, setEmail] = React.useState<string>("")

    function loginInputChange(e:React.ChangeEvent<HTMLInputElement> & React.MouseEvent<HTMLInputElement>){
        if (e.target.name == "username") setUsername(e.target.value)
        if (e.target.name == "password") setPassword(e.target.value)
        if (e.target.name == "passwordConfirm") setPasswordConfirm(e.target.value)
        if (e.target.name == "email") setEmail(e.target.value)
    }

    React.useEffect(() => {
        username && password && /\S+@\S+\.\S+/.test(email) && password == passwordConfirm ? setBtnStatus(btnClass) : setBtnStatus("disabled " + btnClass)
        setPasswordStatus(password && passwordConfirm && password == passwordConfirm ? ["text-success", "As senhas coincidem"] : ["text-danger", "As senhas não correspondem"])
        setEmailStatus(/\S+@\S+\.\S+/.test(email) ? ["text-success", "O email é válido"] : ["text-danger", "O email não é válido"])
    }, [username, password, passwordConfirm, email])

    async function register(){
        const response = await fetch('/api/register', {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
        const data = await response.json()
        console.log(data);
        setRegisterMsg(data.msg)
    }
    return (
        <div className="container">
                <div className="row">
                    <div className="mx-auto col-xl-5 col-lg-6 col-md-8 col-xs-10 col-12">
                        <div className="register login border rounded mt-5 p-lg-5 p-sm-3 py-3 text-center">
                            <div className="container">
                                <h1 className="mt-1 mb-4">BlogZerah</h1>
                                <h4>{registerMsg}</h4>
                                <div className="d-grid gap-2">
                                    <div className="input-group">
                                        <input onClick={loginInputChange} onChange={loginInputChange} name="username" type="text" className="form-control" placeholder="Nome de usuário"/>
                                    </div>
                                    <div className="input-group">
                                        <input onClick={loginInputChange} onChange={loginInputChange} name="password" type="password" className="form-control" placeholder="Senha"/>
                                    </div>
                                    <div className="input-group">
                                        <input onClick={loginInputChange} onChange={loginInputChange} name="passwordConfirm" type="password" className="form-control" placeholder="Digite a sua senha novamente"/>
                                    </div>
                                    <p className={passwordStatus[0]}>{passwordStatus[1]}</p>
                                    <div className="input-group">
                                        <input onClick={loginInputChange} onChange={loginInputChange} name="email" type="text" className="form-control" placeholder="E-mail"/>
                                    </div>
                                    <p className={emailStatus[0]}>{emailStatus[1]}</p>
                                    <button onClick={register} className={btnStatus} type="button">Próximo</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default Register