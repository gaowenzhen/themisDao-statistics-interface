import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Main = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	text-align: center;
	min-height: 100vh;
`

const Container = styled.div`
	width: 100%;
`

function NotFound() {
	const [state, setState] = useState(5)
	const navigate = useNavigate()
	useEffect(() => {
		if (state) {
			setTimeout(() => {
				setState(state - 1)
			}, 1000);
		} else {
			navigate("/")
		}
	}, [state])
	return (
		<Main >
			<Container >
				<h2>
					PAGE NOT FOUND
				</h2>
				<h4>
					WILL RETURN TO THE HOME PAGE IN {state} SECONDS
				</h4>
			</Container>
		</Main>
	);
}

export default NotFound
