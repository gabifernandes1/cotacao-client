import React from 'react';
// import Welcome from "./Pages/Welcome";
// import Dashboard from "./Pages/Dashboard";
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
// import GlobalStateProvider from './hooks/globalState';
import Home from './Pages/Home/index';
import User from './Pages/User/index';

export default function RoutesJS() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route exact path="/user" element={<User />} />
					<Route exact path="/user" element={<></>} />
					<Route exact path="/home" element={<Home />} />
					<Route path="*" element={true ? <Navigate to="/home" /> : ''} />
				</Routes>
			</BrowserRouter>
		</>
	);
}
