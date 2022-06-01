import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
	let navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
			navigate("/");
		} catch (error) {
			toast(error.code, { type: "error" });
		}
	};
	return (
		<div
			className="border p-3 bg-light mx-auto"
			style={{ maxWidth: 400, marginTop: 60 }}
		>
			<h1>Авторизація</h1>
			<div className="form-group">
				<label>Пошта</label>
				<input
					type="email"
					className="form-control"
					placeholder="Введіть вашу пошту"
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>
			</div>

			<div className="form-group">
				<label>Пароль</label>
				<input
					type="password"
					className="form-control"
					placeholder="Введіть ваш пароль"
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
			</div>
			<br />
			<button className="btn btn-primary" onClick={handleLogin}>
				Login
			</button>
		</div>
	);
}
