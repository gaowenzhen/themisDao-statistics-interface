import styled from "styled-components"
import Header from "src/pages/Header"
import { ReactNode } from "react"

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 80px 12px 0;
	width: 100%;
	height: 100%;
	min-height: 100vh;
	z-index:50;
`

function AppContainer({ children }: { children?: ReactNode }) {
	return (<Container>
		<Header />
		{children}
	</Container>)
}

export default AppContainer