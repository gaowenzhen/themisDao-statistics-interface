import { useState, useEffect } from "react";
import {
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";

import "./index.css";


function QueryDaoUsers() {
  

	const createData = (name:any, calories:any, fat:any) => {
	  return { name, calories, fat};
	};

// 数据对象说名
//   let resultData = {
//     teamBalanceOnDateStart: teamBalanceOnDateStartRsp.sum,//"起始时间"团队的STHS总余额
//     teamBalanceOnDateEnd: teamBalanceOnDateEndRsp.sum,//"结束时间"团队的STHS总余额
//     upAmountOfTeam: sthsUpAmountOfTeam,//团队的STHS增长量
//     upRateOfTeam: sthsUpRateOfTeam,//团队的STHS增长率
//     totalSupplyOnDateStart: totalSupplyOnDateStartRsp.totalSupply,//"起始时间"系统的STHS总发行量
//     totalSupplyOnDateEnd: totalSupplyOnDateEndRsp.totalSupply,//"结束时间"系统的STHS总发行量
//     daoContractRewardSum: daoContractRewardSumRsp.sum,//本阶段的dao合约的收益
//     upAmountOfSystem: sthsUpAmountOfSystem,   //系统的STHS增长量
//     upRateOfSystem: sthsUpRateOfSystem,   //系统的STHS增长率
//     teamDaoReward: temReward,//团队的dao收益

// }
	const rows = [
	  createData("Starting sths total", 159, 6.0),
	  createData("End sths total", 237, 9.0),
	  createData("Increase AmountOf", 262, 16.0),
	  createData("Increase RateOf", 305, 3.7),
	  createData("Dao Reward", 356, 16.0),
	];

	const [startTimeItems, setStartTimeItems] = useState<any>([])
	const [endTimeItems, setEndTimeItems] = useState<any>([])

	const [rewardRate, setRewardRate] = useState("0");
	const rewardCchange = (e:any) => {
		let rsval = e.target.value
		setRewardRate(rsval)
	}

	const [rowsItems, setRowsItems] = useState<any>([])
	const calculateDaoReward = async () =>{

		if (rewardRate !== '0' && /^0\.?\d{1,3}$/.test(rewardRate)) {
		let url = `https://themis.capital/themis/api/dao/calculateDaoReward?taskType=${checktype}&userAddr=0xabc&dateStart=${startval}&dateEnd=${endval}&rewardRate=${rewardRate}`
		const res = await fetch(url);
		let result = await res.json();
		console.dir(result)
		setRowsItems(rows)
	  }

	}

  // http://{{Host}}:{{Port}}/{{ServerName}}/api/balanceHistory/getTotalHistoryDateByPagepageNo=1&pageSize=15&taskType=1
// http://{{Host}}:{{Port}}/{{ServerName}}/api/dao/calculateDaoReward?taskType=1&userAddr=0xabc&dateStart=221109&dateEnd=221116&rewardRate=0.02
 
	// 2个时间列表，选择数据
	const getTotalHistoryDateByPagepageNo = async () => {

		try {
			const url = "https://themis.capital/themis/api/balanceHistory/getTotalHistoryDateByPagepageNo=1&pageSize=15&taskType=1"
			const res = await fetch(url);
			let result = await res.json();
			console.dir(result)
      console.log('--xxx---')
		  } catch (error) {
            console.dir(error)
		  }

		  let starttimes = [
			{value: "2022-11-03", name: "2022-11-03"},
			{value: "2022-11-13", name: "2022-11-13"},
			{value: "2022-11-23", name: "2022-11-23"}
		  ]

		  let endtimes = [
			{value: "2022-12-08", name: "2022-12-08"},
			{value: "2022-12-18", name: "2022-12-18"},
			{value: "2022-12-28", name: "2022-12-28"}
		  ]
		  setStartTimeItems(starttimes)

		  setEndTimeItems(endtimes)
		
	}
	
	useEffect(() => {
		getTotalHistoryDateByPagepageNo();
		setRowsItems(rows);
	}, [])


  const [checktype, setChecktype] = useState("1");
  const radioChange = (e: any) => {
    setChecktype(e.target.value);
  };

  const [startval, setStartval] = useState("2022-11-03");
  const startSelChange = (e:any) => {
	setStartval(e.target.value);
  }

  const [endval, setEndval] = useState("2022-12-08");
  const endSelChange = (e:any) => {
	setEndval(e.target.value);
  }

  const [userAddr, setUserAddr] = useState("");
  const userAddrChangge = (e:any) => {
	if(e.target.value && e.target.value.length === 32){
		setUserAddr(e.target.value)
	}
  }

  // 发起查询,返回表格数据
  const QuryTableData = () => {
	if(endval && startval && rewardRate){
		calculateDaoReward()
	}
  }

  return (
    <div className="pagebody">
      <div className="topqueybody">
        <div className="labelbox">Dao Query Type:</div>
        <div>
          <RadioGroup
            name="gender1"
            row
            value={checktype}
            onChange={radioChange}
          >
            <FormControlLabel value="1" control={<Radio />} label="3,13,23" />
            <FormControlLabel value="2" control={<Radio />} label="8,18,28 , of the month" />
          </RadioGroup>
        </div>
      </div>
      <div className="selbody">
       <div className="timebox">
	     <div>
		<span className="labelbox">Time:</span>
		 <Select
          labelId="demo-simple-select-label"
          id="start-select"
		  className="refonstsize"
          value={startval}
		  size="small"
          onChange={startSelChange}
        >
		{(startTimeItems.length > 0) ?  startTimeItems.map((item:any,i:number)=>{
          return <MenuItem key={i} value={item.value}>{item.name}</MenuItem>
		}): <MenuItem>No Item</MenuItem>}
        </Select>
		 </div>
         <div className="tobox">To</div>
		 <div>
		 <Select
          labelId="demo-simple-select-label"
          id="end-select"
          value={endval}
		  className="refonstsize"
		  size="small"
          onChange={endSelChange}
        >
      	{(endTimeItems.length > 0) ?  endTimeItems.map((item:any,i:number)=>{
          return <MenuItem key={i} value={item.value}>{item.name}</MenuItem>
		}): <MenuItem>No Item</MenuItem>}
        </Select>
		 </div>
	   </div>
	   <div className="timebox">
	   <span className="labelbox">percentage:</span>
		  <TextField
          id="outlined-number"
          label="Number"
		  className="refonstsize"
		  size="small"
		  value={rewardRate}
		  onChange={rewardCchange}
          variant="outlined"
        />
		%
	   </div>
	   <div className="timebox">
	   <span className="labelbox">wallet address:</span>
	   <div><TextField size="small" onChange={userAddrChangge} value={userAddr} id="outlined-basic" label="address" variant="outlined" /></div>
	   <div className="ml10px"><Button onClick={QuryTableData} variant="contained" color="primary">Inquire</Button></div>
	   </div>
	  </div>
      <div className="tablebox">
		<div>Comparison list</div>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Data Classification</TableCell>
                <TableCell align="right">Team</TableCell>
                <TableCell align="right">System</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsItems.length > 0? rowsItems.map((row:any) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                </TableRow>
              )): <TableRow><TableCell colSpan={3} align="center">No Data</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default QueryDaoUsers;
