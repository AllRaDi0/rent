import React from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./../firebaseConfig";
import { signOut } from "firebase/auth";
import AddArticle from "./AddArticle";

export default function Navbar() {
	const [user] = useAuthState(auth);
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
			</nav>
		</div>
	);
}
