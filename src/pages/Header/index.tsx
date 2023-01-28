import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const headerList = [
	{
		text: "Query Invited Users",
		path: "/invitedUsers"
	},
	{
		text: "Total Amount",
		path: "/total"
	},
	{
		text: "Dao",
		path: "/dao"
	}
]

const Container = styled.div`
	display: flex;
	justify-content: start;
	align-items: center;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 80px;
	padding: 16px;
	background-color: #CCC;
	z-index:100;
`

const Item = styled.h6`
	padding: 8px 16px;
	font-size: 20px;
	border: 1px solid #000;
	border-radius: 8px;
	margin: 0 8px;
	cursor: pointer;
	@media (max-width: 750px) {
		font-size: 14px;
	}
`

function Header() {
	const navigate = useNavigate()

	return (
		<Container >
			{
				headerList.map((item,i) =>
					<Item key={i} onClick={() => {
						navigate(item.path)
					}}>
						{item.text}
					</Item>)
			}

		</Container>
	);
}

export default Header
