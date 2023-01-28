
import { useCallback,useState } from 'react'
import { TextField } from "@mui/material";
import Stack from '@mui/material/Stack';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { debounce } from 'src/utils/debounce'
import styled from 'styled-components'
import { Grid, Paper, Button,Zoom } from '@mui/material';

export const isPending = (pendingData: { [key: string]: boolean }, type: string, defaultText: string) => {
	return pendingData[type] ? "Pending..." : defaultText;
};

export const getAddressAmount = ({ firstDate, lastDate }: { firstDate: number, lastDate: number }) => `https://themis.capital/themis/api/tokenTransfer/getTranTotal?timestampStart=${firstDate}&timestampEnd=${lastDate}&tokenAddr=0xE43329547ef139a874564f7D1006fab95Ea1CfE8`
export const GridFlex = styled(Grid)`
  display: flex;
`;

const Main = styled(GridFlex)`
	padding: 20px;
	width: 100%;
	justify-content: center;
	align-items: center;
	max-width: 1080px;
	@media (max-width: 750px) {
    	padding: 0;
  }
`

const PaperCard = styled(Paper)`
	min-width: 350px;
  width: 100%;
	@media (max-width: 750px) {
    	padding: 0 !important;
  }
`

const Title = styled.div`
	padding: 20px 20px 0;
	line-height: 1.5;
	font-size: 24px;
	width: 100%;
	text-align: center;
	@media (max-width: 750px) {
    font-size: 18px;
  }
`

const Search = styled.div`
	display: flex;
	width: 100%;
	background-color: transparent;
	flex-direction: row ;
	justify-content: space-between;
	padding: 20px;
`

const ScTotal = styled.div`
	padding: 16px;
	font-size: 24px;
	font-weight: 900;
`

const ClaimBtn = styled(Button)({
	marginTop: "8px",
	backgroundColor: "#F8CC82",
	color: "#000",
	borderRadius: "8px",
	cursor: "pointer",
	minWidth: "200px"
})

const Container = styled.div`
	padding: 40px 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
`

const DateContainer = styled(Stack)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	flex-direction: row !important;
	min-width: 300px;
	max-width: 600px;
	box-sizing: border-box;
	width: 100%;
	&>div {
		margin-top: 0 !important;
	}
	@media (max-width: 750px) {
    flex-direction: column !important;
		&>div {
			margin-top: 16px !important;
		}
  }
`

function QueryInvitedUsers() {
	const [date, setDate] = useState<{
		firstDate: Date | null,
		lastDate: Date | null
	}>({
		firstDate: new Date("2022-01-01"),
		lastDate: new Date()
	});
	const [pendingStatus, setPendingStatus] = useState({ search: false });
	const [data, setData] = useState("0.0000")

	const getData = useCallback(
		async () => {
			const { firstDate, lastDate } = date
			if (firstDate && lastDate) {
				setPendingStatus({ search: true })
				try {
					const res = await fetch(getAddressAmount({ firstDate: Math.floor(+firstDate / 1000), lastDate: Math.floor(+lastDate / 1000) }))

					const result = await res.json()
					console.log('result', result)
					setPendingStatus({ search: false })
					setData(result?.data?.amountSum ?? "0.0000")
				} catch (error) {
					setPendingStatus({ search: false })
				}

			}
		}, [date])

	const onSearch = useCallback(
		() => {
			if (pendingStatus.search) return;
			debounce(() => {
				getData()
			}, 500)
		},
		[pendingStatus,date]
	)

	return (
		<Main >
			<Zoom in={true} >
				<PaperCard >
					<Title>Total Amount</Title>

					<Container>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DateContainer spacing={2}>
								<DesktopDatePicker
									label="First Date"
									value={date.firstDate}
									minDate={new Date('2022-01-01')}
									maxDate={date.lastDate}
									disabled={pendingStatus.search}
									onChange={(newValue) => {
										setDate({
											...date,
											firstDate: newValue
										});
									}}
									renderInput={(params) => <TextField {...params} />}
								/>
								<DesktopDatePicker
									label="Last Date"
									value={date.lastDate}
									maxDate={new Date()}
									minDate={date.firstDate}
									disabled={pendingStatus.search}
									onChange={(newValue) => {
										setDate({
											...date,
											lastDate: newValue
										});
									}}
									renderInput={(params) => <TextField {...params} />}
								/>
							</DateContainer>
						</LocalizationProvider>
					</Container>

					<Search >
						<ClaimBtn
							variant="contained"
							color="primary"
							disabled={pendingStatus.search}
							key={pendingStatus.search + ""}
							onClick={onSearch}
						>
							{isPending(pendingStatus, "search", "Search")}
						</ClaimBtn>
					</Search>

					<ScTotal>TOTAL: {data}</ScTotal>

				</PaperCard>
			</Zoom>
		</Main>
	)
}

export default QueryInvitedUsers