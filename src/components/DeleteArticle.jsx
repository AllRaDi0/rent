import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { db, storage } from "../firebaseConfig";
import { toast } from "react-toastify";
import { deleteObject, ref } from "firebase/storage";

export default function DeleteArticle({ id, imageUrl }) {
	const handleDelete = async () => {
		if (window.confirm("Ви впевнені, що хочете видалити оголошення")) {
			try {
				await deleteDoc(doc(db, "Articles", id));
				toast("Оголошення видалено успішно", { type: "success" });
				const storageRef = ref(storage, imageUrl);
				await deleteObject(storageRef);
			} catch (error) {
				toast("Помилка видалення", { type: "error" });
				console.log(error);
			}
		}
	};
	return (
		<div>
			<i
				className="fa fa-times"
				onClick={handleDelete}
				style={{ cursor: "pointer" }}
			/>
		</div>
	);
}
