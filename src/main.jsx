import React, {Suspense} from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./i18n";
import Spinner from "react-bootstrap/Spinner";

ReactDOM.createRoot(document.getElementById("root")).render(
		<Suspense
			fallback={
				<div className='m-auto d-flex vh-100'>
					<Spinner
						style={{color: "#FF9900"}}
						className='m-auto'
						animation='border'
						role='status'></Spinner>
				</div>
			}>
			<App />
		</Suspense>
);
