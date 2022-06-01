import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	let navigate = useNavigate();

	const handleSignup = async () => {
		try {
			await createUserWithEmailAndPassword(auth, email, password);
			updateProfile(auth.currentUser, { displayName: name });
			navigate("/");
		} catch (error) {
			toast(error.code, { type: "error" });
		}
	};
	return (
		<div className="border p-3 bg-light " style={{ marginTop: 70 }}>
			<h1>Реєстрація</h1>
			<div className="form-group">
				<label>Ім'я</label>
				<input
					type="text"
					className="form-control"
					placeholder="Введіть ваше ім'я"
					onChange={(e) => {
						setName(e.target.value);
					}}
				/>
			</div>
			<div className="form-group">
				<label>Пошта</label>
				<input
					type="email"
					className="form-control"
					placeholder="Введі вашу пошту"
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
			<button className="btn btn-primary" onClick={handleSignup}>
				Зареєструватись
			</button>
		</div>
	);
}
