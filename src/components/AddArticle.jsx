import React, { useState } from "react";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "./../firebaseConfig";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

export default function AddArticle() {
	const [user] = useAuthState(auth);
	const [formData, setFormData] = useState({
		title: "",
		category: "",
		price: "",
		pledge: "",
		address: "",
		phone: "",
		description: "",
		image: "",
		createdAt: Timestamp.now().toDate(),
	});

	const [progress, setProgress] = useState(0);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleChangeSelect = (e) => {
		console.log(e.target.value);
		setFormData({ ...formData, [formData.category]: e.value });
	};

	const handleImageChange = (e) => {
		setFormData({ ...formData, image: e.target.files[0] });
	};

	const handlePublish = () => {
		if (
			!formData.title ||
			!formData.category ||
			!formData.description ||
			!formData.price ||
			!formData.pledge ||
			!formData.address ||
			!formData.phone ||
			!formData.image
		) {
			alert("Please fill all the fields");
			return;
		}

		const storageRef = ref(
			storage,
			`/images/${Date.now()}${formData.image.name}`
		);

		const uploadImage = uploadBytesResumable(storageRef, formData.image);

		uploadImage.on(
			"state_changed",
			(snapshot) => {
				const progressPercent = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(progressPercent);
			},
			(err) => {
				console.log(err);
			},
			() => {
				setFormData({
					title: "",
					category: "",
					price: "",
					pledge: "",
					address: "",
					phone: "",
					description: "",
					image: "",
				});

				getDownloadURL(uploadImage.snapshot.ref).then((url) => {
					const articleRef = collection(db, "Articles");
					addDoc(articleRef, {
						title: formData.title,
						category: formData.category,
						description: formData.description,
						price: formData.price,
						pledge: formData.pledge,
						address: formData.address,
						phone: formData.phone,
						imageUrl: url,
						createdAt: Timestamp.now().toDate(),
						createdBy: user.displayName,
						userId: user.uid,
						likes: [],
						comments: [],
					})
						.then(() => {
							toast("Article added successfully", { type: "success" });
							setProgress(0);
						})
						.catch((err) => {
							toast("Error adding article", { type: "error" });
						});
				});
			}
		);
	};

	return (
		<div>
			{!user ? (
				<>
					<h2>
						<Link to="/signin">Увійдіть, щоб створити оголошення</Link>
					</h2>
					У вас ще немає аккаунту? <Link to="/register">Зареєструватись</Link>
				</>
			) : (
				<>
					<h2>Публікація оголошення</h2>
					<div className="form-group">
						<label htmlFor="">Назва</label>
						<input
							type="text"
							name="title"
							className="form-control"
							value={formData.title}
							onChange={(e) => handleChange(e)}
						/>
					</div>

					{/* category */}
					<label htmlFor="">Категорія</label>

					<input
						className="form-control"
						type="text"
						list="category"
						name="category"
						autoSave="off"
						onChange={(e) => handleChange(e)}
					/>

					<datalist id="category">
						<option value="Дрелі" />
						<option value="Відбійні молотки" />
						<option value="Перфоратори" />
					</datalist>

					{/* description */}
					<label htmlFor="">Опис</label>
					<textarea
						name="description"
						className="form-control"
						value={formData.description}
						onChange={(e) => handleChange(e)}
					/>

					{/* price */}
					<label htmlFor="">Ціна за день</label>
					<input
						type="number"
						name="price"
						min={1}
						className="form-control"
						value={formData.price}
						onChange={(e) => handleChange(e)}
					/>

					{/* pledge */}
					<label htmlFor="">Застава</label>
					<input
						type="number"
						name="pledge"
						min={1}
						className="form-control"
						value={formData.pledge}
						onChange={(e) => handleChange(e)}
					/>

					{/* address */}
					<label htmlFor="">Адреса</label>
					<input
						type="text"
						name="address"
						className="form-control"
						value={formData.address}
						onChange={(e) => handleChange(e)}
					/>

					{/* phone */}
					<label htmlFor="">Номер телефону</label>
					<input
						type="tel"
						name="phone"
						className="form-control"
						value={formData.phone}
						maxLength="10"
						onChange={(e) => handleChange(e)}
					/>

					{/* image */}
					<label htmlFor="">Фотографія</label>
					<input
						type="file"
						name="image"
						accept="image/*"
						className="form-control"
						onChange={(e) => handleImageChange(e)}
					/>

					{progress === 0 ? null : (
						<div className="progress">
							<div
								className="progress-bar progress-bar-striped mt-2"
								style={{ width: `${progress}%` }}
							>
								{`uploading image ${progress}%`}
							</div>
						</div>
					)}
					<button
						className="form-control btn-primary mt-2"
						onClick={handlePublish}
					>
						Створити оголошення
					</button>
				</>
			)}
		</div>
	);
}
