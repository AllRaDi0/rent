import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useState, useEffect, useMemo } from "react";
import { auth, db } from "../firebaseConfig";
import DeleteArticle from "./DeleteArticle";
import { useAuthState } from "react-firebase-hooks/auth";
import LikeArticle from "./LikeArticle";
import { Link } from "react-router-dom";

export default function Articles() {
	const [articles, setArticles] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [user] = useAuthState(auth);

	useEffect(() => {
		const articleRef = collection(db, "Articles");
		const q = query(articleRef, orderBy("createdAt", "desc"));
		onSnapshot(q, (snapshot) => {
			const articles = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setArticles(articles);
		});
	}, []);

	const handleSortByLikes = () => {
		const sortList = [...articles].sort((a, b) => (a.likes < b.likes ? 1 : -1));
		setArticles(sortList);
	};

	const handleSortByPriceToHigh = () => {
		const sortList = [...articles].sort((a, b) =>
			+a.price > +b.price ? 1 : -1
		);
		setArticles(sortList);
	};

	const handleSortByPriceToLow = () => {
		const sortList = [...articles].sort((a, b) =>
			+a.price < +b.price ? 1 : -1
		);
		setArticles(sortList);
	};

	return (
		<div>
			<input
				className="form-control mb-3"
				value={searchValue}
				placeholder="Пошук за назвою, категоріями, орендодавцем, містом"
				onChange={(e) => {
					setSearchValue(e.target.value);
				}}
			></input>

			<button className="btn btn-outline-primary" onClick={handleSortByLikes}>
				За популярнісю
			</button>
			<button
				className="btn btn-outline-primary"
				style={{ marginLeft: 5, marginRight: 5 }}
				onClick={handleSortByPriceToHigh}
			>
				Від дешевих до дорогих
			</button>
			<button
				className="btn btn-outline-primary"
				onClick={handleSortByPriceToLow}
			>
				Від дорогих до дешевих
			</button>

			{articles.length === 0 ? (
				<p>Жодного оголошення не було знайдено</p>
			) : (
				articles
					.filter((post) => {
						if (searchValue === "") {
							return post;
						} else if (
							post.title.toLowerCase().includes(searchValue.toLowerCase()) ||
							post.createdBy
								.toLowerCase()
								.includes(searchValue.toLowerCase()) ||
							post.city.toLowerCase().includes(searchValue.toLowerCase()) ||
							post.category.toLowerCase().includes(searchValue.toLowerCase())
						) {
							return post;
						}
					})
					.map(
						({
							id,
							title,
							description,
							imageUrl,
							createdAt,
							createdBy,
							userId,
							likes,
							comments,
							country,
							region,
							city,
							street,
							houseNumber,
							zip,
							price,
							category,
						}) => (
							<div className="border mt-3 p-3 bg-light" key={id}>
								<div className="row">
									<div className="col-3">
										<Link to={`/article/${id}`}>
											<img
												src={imageUrl}
												alt="title"
												style={{ height: 180, width: 180 }}
											/>
										</Link>
									</div>
									<div className="col-9 ps-3">
										<div className="row">
											<div className="col-6">
												{createdBy && (
													<h5>
														<span className="badge bg-primary">
															{createdBy}
														</span>
														<span
															className="badge bg-primary"
															style={{ marginLeft: 10 }}
														>
															{category}
														</span>
													</h5>
												)}

												<h3>{title}</h3>
												<p>{createdAt.toDate().toDateString()}</p>
												<h6>
													{country}, {region} область, {city}, {street},{" "}
													{houseNumber}, {zip}
												</h6>
											</div>
											<div className="col-6 d-flex flex-row-reverse">
												{user && user.uid === userId && (
													<DeleteArticle id={id} imageUrl={imageUrl} />
												)}
												<h5 style={{ paddingTop: 60 }}>{price} грн/в день</h5>
											</div>
										</div>

										<div className="d-flex flex-row-reverse">
											{user && <LikeArticle id={id} likes={likes} />}
											<div className="pe-2">
												<p>{likes?.length} likes</p>
											</div>
											{comments && comments.length > 0 && (
												<div className="pe-2">
													<p>{comments?.length} comments</p>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						)
					)
			)}
		</div>
	);
}
