import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom"
import AppContainer from "./components/AppContainer"
// import Header from "./pages/Header"
import NotFound from "./pages/NotFound"
import Query2 from "./pages/TotalAmount"
import QueryInvitedUsers from "./pages/QueryInvitedUsers"

import ClassSths from "./pages/ClassSths"

import QueryDaoUsers from "./pages/querydao"

function App() {
	return (
		<Router >
			<Routes>
				<Route key="main" path="/" element={<Navigate to="/invitedUsers" />} />
				<Route key="invitedUsers" path="/invitedUsers" element={<AppContainer >< QueryInvitedUsers /></AppContainer>} />
				<Route key="total" path="/total" element={<AppContainer ><Query2 /></AppContainer>} />
				<Route key="total" path="/sths" element={<AppContainer ><ClassSths /></AppContainer>} />
				<Route key="total" path="/dao" element={<AppContainer ><QueryDaoUsers /></AppContainer>} />
				<Route key="notFound" path="*" element={<AppContainer ><NotFound /></AppContainer>} />
			</Routes>
		</Router>)
}

export default App