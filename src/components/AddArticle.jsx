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
		country: "",
		city: "",
		region: "",
		street: "",
		houseNumber: "",
		zip: "",
		phone: "",
		description: "",
		image: "",
		typeOfDrill: "",
		typeOfPower: "",
		drillDiameter: "",
		weight: "",
		turns: "",
		power: "",
		createdAt: Timestamp.now().toDate(),
	});

	const {
		title,
		category,
		price,
		pledge,
		country,
		city,
		region,
		street,
		houseNumber,
		zip,
		phone,
		description,
		image,
		typeOfDrill,
		typeOfPower,
		drillDiameter,
		weight,
		turns,
		power,
	} = formData;

	const [progress, setProgress] = useState(0);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleChangeOnlyLetters = (e) => {
		const re = /[а-яієїґ\']+/gi;

		if (e.target.value === "" || re.test(e.target.value)) {
			setFormData({ ...formData, [e.target.name]: e.target.value });
		}
	};

	const handleChangeOnlyNumbers = (e) => {
		const re = /[0-9]/;
		if (e.target.value === "" || re.test(e.target.value)) {
			setFormData({ ...formData, [e.target.name]: e.target.value });
		}
	};

	const handleChangeSelect = (e) => {
		setFormData({ ...formData, category: e.target.value });
	};

	const handleImageChange = (e) => {
		setFormData({ ...formData, image: e.target.files[0] });
	};

	const handlePublish = () => {
		if (
			!title ||
			!country ||
			!region ||
			!city ||
			!street ||
			!houseNumber ||
			zip.length < 5 ||
			!description ||
			!price ||
			!pledge ||
			!category ||
			phone.length < 10 ||
			!image
		) {
			alert("Please fill all the fields");
			return;
		}

		const storageRef = ref(storage, `/images/${Date.now()}${image.name}`);

		const uploadImage = uploadBytesResumable(storageRef, image);

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
					country: "",
					region: "",
					city: "",
					street: "",
					houseNumber: "",
					zip: "",
					phone: "",
					description: "",
					image: "",
					typeOfDrill: "",
					typeOfPower: "",
					drillDiameter: "",
					weight: "",
					turns: "",
					power: "",
				});

				getDownloadURL(uploadImage.snapshot.ref).then((url) => {
					const articleRef = collection(db, "Articles");
					addDoc(articleRef, {
						title,
						category,
						description,
						price,
						pledge,
						country,
						region,
						city,
						street,
						houseNumber,
						zip,
						phone,
						typeOfDrill,
						typeOfPower,
						drillDiameter,
						weight,
						turns,
						power,
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
							value={title}
							onChange={(e) => handleChange(e)}
						/>
					</div>

					{/* category */}
					<div>
						<label htmlFor="">Категорія</label>
						{/* <select onChange={handleChangeSelect}>
							{categoryOption.map((option, index) => (
								<option value={option || ""} key={index}>
									{option}
								</option>
							))}
						</select> */}

						<select
							className="form-select"
							onChange={handleChangeSelect}
							value={category}
						>
							<option disabled value="">
								Оберіть категорію
							</option>
							<option value="Дрелі">Дрелі</option>
							<option value="Відбійні молотки">Відбійні молотки</option>
							<option value="Перфоратори">Перфоратори</option>
						</select>
					</div>

					{category === "Дрелі" && (
						<div className="row">
							<div className="col">
								<div>
									<label htmlFor="">Прилад</label>
									<select
										className="form-select"
										onChange={(e) =>
											setFormData({ ...formData, typeOfDrill: e.target.value })
										}
										value={typeOfDrill}
									>
										<option disabled value=""></option>
										<option value="Магнитна дрель">Магнитна дріль</option>
										<option value="Кутова дрель">Кутова дрель</option>
										<option value="Ударна дрель">Ударна дрель</option>
										<option value="Безударна дрель">Безударна дрель</option>
									</select>
								</div>
								<div>
									<label htmlFor="">Потужність</label>
									<select
										className="form-select"
										onChange={(e) =>
											setFormData({ ...formData, power: e.target.value })
										}
										value={power}
									>
										<option disabled value=""></option>
										<option value="1001-1250 Вт">1001-1250 Вт</option>
										<option value="1251-1500 Вт">1251-1500 Вт</option>
										<option value="1501-2000 Вт">1501-2000 Вт</option>
									</select>
								</div>
							</div>
							<div className="col">
								<div>
									<label htmlFor="">Живлення</label>
									<select
										className="form-select"
										onChange={(e) =>
											setFormData({ ...formData, typeOfPower: e.target.value })
										}
										value={typeOfPower}
									>
										<option disabled value=""></option>
										<option value="Акумуляторні">Акумуляторні</option>
										<option value="Пневмо">Пневмо</option>
										<option value="Мережа">Мережа</option>
									</select>
								</div>

								<div>
									<label htmlFor="">Обороти</label>
									<select
										className="form-select"
										onChange={(e) =>
											setFormData({ ...formData, turns: e.target.value })
										}
										value={turns}
									>
										<option disabled value=""></option>
										<option value="1001-1500 Об/хв">1001-1500 Об/хв</option>
										<option value="1501-2000 Об/хв">15001-2000 Об/хв</option>
										<option value="2001-3000 Об/хв">2001-3000 Об/хв</option>
									</select>
								</div>
							</div>
							<div className="col">
								<div>
									<label htmlFor="">Діаметр свердла</label>
									<select
										className="form-select"
										onChange={(e) =>
											setFormData({
												...formData,
												drillDiameter: e.target.value,
											})
										}
										value={drillDiameter}
									>
										<option disabled value=""></option>
										<option value="10 мм">10 мм</option>
										<option value="20 мм">20 мм</option>
										<option value="30 мм">30 мм</option>
									</select>
								</div>

								<div>
									<label htmlFor="">Вага</label>
									<select
										className="form-select"
										onChange={(e) =>
											setFormData({
												...formData,
												weight: e.target.value,
											})
										}
										value={weight}
									>
										<option disabled value=""></option>
										<option value="0.6-1 кг">0.6-1 кг</option>
										<option value="1.1-1.5 кг">1.1-1.5 кг</option>
										<option value="1.6-2 кг">1.6-2 кг</option>
									</select>
								</div>
							</div>
							<div className="form-text">
								Користувачі часто вибирають параметри для точного пошуку. Чим
								докладніше опис, тим більші шанси, що ваше оголошення помітять.
							</div>
						</div>
					)}

					{/* description */}
					<label htmlFor="">Опис</label>
					<textarea
						name="description"
						className="form-control"
						value={description}
						onChange={(e) => handleChange(e)}
					/>

					<div className="row">
						<div className="col">
							{/* price */}
							<label htmlFor="">Ціна за день</label>
							<input
								type="number"
								name="price"
								min={1}
								className="form-control"
								value={price}
								onChange={(e) => handleChange(e)}
							/>
						</div>
						<div className="col">
							{/* pledge */}
							<label htmlFor="">Застава</label>
							<input
								type="number"
								name="pledge"
								min={0}
								className="form-control"
								value={pledge}
								onChange={(e) => handleChange(e)}
							/>
						</div>
					</div>

					<div className="row">
						<div className="col">
							{/* Country */}
							<label htmlFor="">Країна</label>
							<input
								type="text"
								name="country"
								className="form-control"
								value={country}
								onChange={(e) => handleChangeOnlyLetters(e)}
							/>

							{/* Region */}
							<label htmlFor="">Область</label>
							<input
								type="text"
								name="region"
								className="form-control"
								value={region}
								onChange={(e) => handleChangeOnlyLetters(e)}
							/>

							{/* City */}
							<label htmlFor="">Місто</label>
							<input
								type="text"
								name="city"
								className="form-control"
								value={city}
								onChange={(e) => handleChangeOnlyLetters(e)}
							/>
						</div>
						<div className="col">
							{/* Street */}
							<label htmlFor="">Вулиця</label>
							<input
								type="text"
								name="street"
								className="form-control"
								value={street}
								onChange={(e) => handleChangeOnlyLetters(e)}
							/>

							{/* House number */}
							<label htmlFor="">Номер будинку</label>
							<input
								type="number"
								name="houseNumber"
								className="form-control"
								value={houseNumber}
								onChange={(e) => handleChange(e)}
							/>

							{/* ZIP */}
							<label htmlFor="">ZIP код</label>
							<input
								type="text"
								name="zip"
								className="form-control"
								value={zip}
								maxLength={5}
								onChange={(e) => handleChangeOnlyNumbers(e)}
								required
							/>
						</div>
					</div>

					<div className="form-text">Довжина коду повинна бути 5 символів</div>

					{/* phone */}
					<label htmlFor="">Номер телефону</label>
					<input
						type="tel"
						name="phone"
						className="form-control"
						value={phone}
						maxLength="12"
						onChange={(e) => handleChange(e)}
					/>

					<div className="form-text">Введіть номер у форматі: 380XXXXXXXXX</div>

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
