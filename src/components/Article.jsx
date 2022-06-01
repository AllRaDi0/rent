import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import LikeArticle from "./LikeArticle";
import Comment from "./Comment";

export default function Article() {
	const { id } = useParams();
	const [article, setArticle] = useState(null);
	const [user] = useAuthState(auth);

	useEffect(() => {
		const docRef = doc(db, "Articles", id);
		onSnapshot(docRef, (snapshot) => {
			setArticle({ ...snapshot.data(), id: snapshot.id });
		});
	}, []);
	return (
		<div className="container border bg-light" style={{ marginTop: 70 }}>
			{article && (
				<div className="row">
					<div className="col-8 mt-3">
						<h2>{article.title}</h2>
						<div>{article.address}</div>
						<img
							src={article.imageUrl}
							alt={article.title}
							style={{ width: "800px", height: "500px", padding: 10 }}
						/>
						<div>
							{" "}
							Дата створення: {article.createdAt.toDate().toDateString()}
						</div>
						<hr />
						<h4>{article.description}</h4>
						<div className="d-flex flex-row-reverse">
							{user && <LikeArticle id={id} likes={article.likes} />}
							<div className="pe-2">
								<p>{article.likes.length}</p>
							</div>
						</div>
						{/* comment  */}
						<Comment id={article.id} />
					</div>
					<div className="col-4 mt-3">
						<div className="row">
							<div className="col" style={{ paddingRight: 0 }}>
								<div className="card text-center">
									<div className="card-body">
										<h5 className="card-title">Ціна за день</h5>
										<p className="card-text">{article.price} грн/день</p>
									</div>
								</div>
							</div>
							<div className="col" style={{ paddingLeft: 0 }}>
								<div className="card text-center">
									<div className="card-body">
										<h5 className="card-title">Застава</h5>
										<p className="card-text">{article.pledge} грн</p>
									</div>
								</div>
							</div>
						</div>
						<div className="text-center">
							<h5 className="mt-5 mb-3">
								Орендодавець
								<br />
								{article.createdBy}
							</h5>
							<h6 className="text-center">
								{" "}
								<i className="fa fa-phone" /> +38{article.phone}
							</h6>
							<a href="#" class="btn btn-primary mt-5">
								Написати орендодавцю
							</a>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
