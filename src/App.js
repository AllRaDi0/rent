import Articles from "./components/Articles";
import AddArticle from "./components/AddArticle";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Article from "./components/Article";
function App() {
	return (
		<div className="container">
			<Router>
				<Navbar />
				<Routes>
					<Route path="/register" element={<Register />} />
					<Route path="/signin" element={<Login />} />
					<Route path="/addarticle" element={<AddArticle />} />
					<Route path="/article/:id" element={<Article />} />
					<Route
						path="/"
						element={
							<div className="row mt-5" style={{ paddingTop: 15 }}>
								<div className="col-md-12">
									<Articles />
								</div>
							</div>
						}
					/>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
