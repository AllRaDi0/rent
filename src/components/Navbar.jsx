import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./../firebaseConfig";
import { signOut } from "firebase/auth";
import AddArticle from "./AddArticle";

export default function Navbar() {
	const [user] = useAuthState(auth);
	const navigate = useNavigate();
	return (
		<div className="border" style={{ backgroundColor: "whitesmoke" }}>
			<nav className="navbar">
				<div>
					<img
						src="logo192.png"
						width={30}
						height={30}
						alt="logo"
						className="ms-5"
					/>
				</div>
				<Link className="nav-link" to="/">
					Головна сторінка{" "}
				</Link>
				<Link className="nav-link" to="/addarticle">
					Створити оголошення{" "}
				</Link>
				{user && (
					<Link className="nav-link" to="/myArticles">
						Мої оголошення{" "}
					</Link>
				)}
				<div>
					{user && (
						<>
							<span className="pe-4">
								Ви увійшли як {user.displayName || user.email}
							</span>
							<button
								className="btn btn-primary btn-sm me-3"
								onClick={() => {
									signOut(auth);
								}}
							>
								Вийти
							</button>
						</>
					)}
				</div>

				<div>
					{!user && (
						<>
							<button
								className="btn btn-primary btn-sm me-3"
								onClick={() => {
									navigate("/signin");
								}}
							>
								Увійти
							</button>
							<button
								className="btn btn-primary btn-sm me-3"
								onClick={() => {
									navigate("/register");
								}}
							>
								Зареєструватись
							</button>
						</>
					)}
				</div>
			</nav>
		</div>
	);
}
