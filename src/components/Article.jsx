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
						<div>
							{article.country}, {article.region} область, {article.city},{" "}
							{article.street}, {article.houseNumber}, {article.zip}
						</div>
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

						<div style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
							<h4>Опис</h4>
							<p className="h5">{article.description}</p>
						</div>

						{article.typeOfDrill ||
							article.typeOfPower ||
							article.drillDiameter ||
							article.weight ||
							article.turns ||
							(article.power && (
								<div>
									<hr />
									<h4>Характеристики</h4>
									<table className="table">
										<thead>
											<tr>
												{article.typeOfDrill && <th scope="col">Прилад</th>}
												{article.typeOfPower && <th scope="col">Живлення</th>}
												{article.drillDiameter && (
													<th scope="col">Діаметр свердла</th>
												)}
												{article.weight && <th scope="col">Вага</th>}
												{article.turns && <th scope="col">Обороти</th>}
												{article.power && <th scope="col">Потужність</th>}
											</tr>
										</thead>
										<tbody>
											<tr>
												{article.typeOfDrill && (
													<th scope="col">{article.typeOfDrill}</th>
												)}
												{article.typeOfPower && (
													<th scope="col">{article.typeOfPower}</th>
												)}
												{article.drillDiameter && (
													<th scope="col">{article.drillDiameter}</th>
												)}
												{article.weight && (
													<th scope="col">{article.weight}</th>
												)}
												{article.turns && <th scope="col">{article.turns}</th>}
												{article.power && <th scope="col">{article.power}</th>}
											</tr>
										</tbody>
									</table>
								</div>
							))}

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
								<i className="fa fa-phone" /> +{article.phone}
							</h6>
							<a href="#" className="btn btn-primary mt-5">
								Написати орендодавцю
							</a>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
