import { CSSProperties, useCallback, useEffect, useState, useRef } from "react";

import { debounce } from "src/utils/debounce";
import styled from "styled-components";
import copy from "copy-to-clipboard";
import {
  Grid,
  Paper,
  Tab,
  Button,
  Skeleton,
  TableCell,
  TableCellProps,
  Zoom,
  Tabs,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from "@mui/material";

export const isPending = (
  pendingData: { [key: string]: boolean },
  type: string,
  defaultText: string
) => {
  return pendingData[type] ? "Pending..." : defaultText;
};

export const allInvitedUrl = "https://themis.capital/themis/api/account/allInvitedByPage";
export const invitedUrl = "https://themis.capital/themis/api/account/invitedByPage";

// export const allInvitedUrl = "http://18.162.195.25:8896/themis/api/account/allInvitedByPage";
// export const invitedUrl = "http://18.162.195.25:8896/themis/api/account/invitedByPage";

export const GridFlex = styled(Grid)`
  display: flex;
`;

const LoginBox = styled.div`
  display:flex;
  justify-content: center;
  width: 100%;
  margin-top:60px;
  '& > * + *':{
    margin-left:auto;
    margin-right: auto;
  }
`;

const Main = styled(GridFlex)`
  padding: 20px;
  width: 100%;
  justify-content: center;
  align-items: center;
  @media (max-width: 750px) {
    padding: 0;
  }
`;

const PaperCard = styled(Paper)`
  min-width: 350px;
  width: 100%;
  @media (max-width: 750px) {
    padding: 0 !important;
  }
`;

const Title = styled.div`
  padding: 20px 20px 0;
  line-height: 1.5;
  font-size: 24px;
  width: 100%;
  text-align: center;
  @media (max-width: 750px) {
    font-size: 18px;
  }
`;

const QueryTypeBox = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0px 20px;
`;

const Search = styled.div`
  display: flex;
  width: 100%;
  background-color: transparent;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 20px 40px 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  margin-right: 20px;
  padding: 8px 0px 8px 20px;
  font-size: 16px;
  resize: none;
  appearance: none;
  color: #000000;
  border: 1px solid #555555;
  border-radius: 8px;
  background: transparent;
  @media (max-width: 750px) {
    font-size: 12px;
    padding-left: 8px;
  }
`;

const TabOption = styled(Tab)`
  & .MuiTab-wrapper {
    @media (max-width: 750px) {
      font-size: 16px;
    }
  }
`;

const TabsHeader = styled.div`
  width: 100%;
  margin: 20px 0px 20px;
`;

const ScTotal = styled.div`
  padding: 8px 16px;
`;

const ClaimBtn = styled(Button)({
  marginTop: "8px",
  backgroundColor: "#F8CC82",
  color: "#000",
  borderRadius: "8px",
  cursor: "pointer",
});

const Loading = styled(Skeleton)`
  width: 100%;
  height: 300px;
`;

const TableCellOption = styled(TableCell)`
  .MuiTableContainer-root & {
    @media (max-width: 750px) {
      font-size: 12px;
    }
  }
`;

interface ColumnsType extends TableCellProps {
  label: string;
  id: "address" | "inviteCode" | "tokenBalance";
}

interface DataType {
  data: DataListType[];
  totalCount: number;
  tokenAmountTotal: number;
  pageNo: number;
  pageSize: number;
  idx: number;
}

interface DataListType {
  id: "address" | "inviteCode" | "tokenBalance";
  address: string;
  inviteCode: string;
  tokenBalance: string;
}

const initalData: DataType = {
  data: [],
  totalCount: 0,
  pageNo: 1,
  pageSize: 10,
  idx: 0,
  tokenAmountTotal: 0,
};

function QueryInvitedUsers() {
  const ref = useRef<HTMLInputElement | null>(null);
  const [queryType, setQueryType] = useState("SC");
  const [urlType, setUrlType] = useState("SC");
  const [searchAddress, setSearchAddress] = useState("");
  const [addr, setAddr] = useState("");
  const [flag, setFlag] = useState(false);
  const [data, setData] = useState<DataType>(initalData);
  const [invitedData, setInvitedData] = useState<{
    invited: DataType;
    allInvited: DataType;
  }>({ invited: initalData, allInvited: { ...initalData, idx: 1 } });
  const [pendingStatus, setPendingStatus] = useState({ search: false });
  const [value, setValue] = useState(0);

  const columns: Array<ColumnsType> = [
    { id: "address", label: "Address" },
    { id: "inviteCode", label: "InviteCode" },
    {
      id: "tokenBalance",
      label: queryType + "Balance",
      // numeric: true,
      align: "right",
    },
  ];

  const handleChangePage = (_event: any, pageNo: number) => {
    setData({
      ...data,
      pageNo: pageNo + 1,
    });
  };

  const handleChangeRowsPerPage = (event: {
    target: { value: string | number };
  }) => {
    const pageSize = Number(event.target.value) || 10;
    setData({
      ...data,
      pageSize,
    });
  };

  const getAllInvited = useCallback(async () => {
    if (searchAddress) {
      const { pageNo, pageSize, idx } = data;

      let url = invitedUrl;
      let keyWords: "allInvited" | "invited" = "invited";
      const params = `?addr=${searchAddress}&pageNo=${pageNo}&pageSize=${pageSize}&coinType=${queryType}`;
      if (value) {
        url = allInvitedUrl;
        keyWords = "allInvited";
      }

	  // console.dir(11111)

    //   const {
    //     idx: currentIdx,
    //     pageNo: currentPageNo,
    //     pageSize: currentPageSize,
    //   } = invitedData[keyWords];

    //   if (
    //     addr === searchAddress &&
    //     addr &&
    //     idx === currentIdx &&
    //     currentPageNo === pageNo &&
    //     pageSize === currentPageSize &&
	// 	urlType === queryType &&
	// 	urlType
    //   ) {
    //     setTimeout(() => {
    //       setPendingStatus({ search: false });
    //       setFlag(false);
    //     }, 1000);
	// 	console.dir(2222)
    //     return;
    //   }

      let result = data;
      try {
		// console.dir(3333)
        const res = await fetch(url + params);

        result = await res.json();
      } catch (error) {}

      if (!result?.data?.length) {
        alert("这个地址无邀请用户");
      }
      //console.log("result", result);
      setData({
        ...data,
        totalCount: result?.totalCount ?? 0,
        data: result?.data ?? [],
        tokenAmountTotal: result?.tokenAmountTotal ?? 0,
      });
      setInvitedData({
        ...invitedData,
        [keyWords]: {
          ...data,
          totalCount: result?.totalCount ?? 0,
          data: result?.data ?? [],
          tokenAmountTotal: result?.tokenAmountTotal ?? 0,
        },
      });
    }
    setTimeout(() => {
      setPendingStatus({ search: false });
      setAddr(searchAddress);
	  setUrlType(queryType);
      setFlag(false);
    }, 1000);
  }, [searchAddress, invitedData, addr, value, data, queryType,urlType]);

  useEffect(() => {
    if (flag) {
      setPendingStatus({ search: true });
      getAllInvited();
    }
  }, [flag, searchAddress,queryType]);

  useEffect(() => {
    setFlag(true);
  }, [data]);


  const rePageOnDev = () => {
    setData({
      ...data,
      pageNo: 1,
    });
  }

  const radioChange = (event?:any) => {
    rePageOnDev()
    setQueryType(event.target.value);
	  setFlag(true);
  };

  const search = useCallback(() => {
    if (pendingStatus.search) return;
    debounce(() => {
      setFlag(true);
    }, 500);
  }, [flag, searchAddress, pendingStatus, ref,queryType]);

  return (
    <Main>
      <Zoom in={true}>
        <PaperCard>
          <Title>Query invited users</Title>
          <QueryTypeBox>
            <RadioGroup
              row
              aria-label="gender"
              name="gender1"
              value={queryType}
              onChange={radioChange}
            >
              <FormControlLabel
                value="SC"
                control={<Radio />}
                label="SC"
              />
              <FormControlLabel value="sTHS" control={<Radio />} label="sTHS" />
            </RadioGroup>
          </QueryTypeBox>

          <Search>
            <SearchInput
              placeholder="Enter a wallet Address"
              className="stake-input"
              value={searchAddress}
              ref={ref}
              onChange={(e) => {
                setSearchAddress(e.target.value.trim());
              }}
              disabled={pendingStatus.search}
            />
            <ClaimBtn
              variant="contained"
              color="primary"
              disabled={pendingStatus.search || !searchAddress}
              key={pendingStatus.search + ""}
              onClick={search}
            >
              {isPending(pendingStatus, "search", "Search")}
            </ClaimBtn>
          </Search>

          <TabsHeader>
            <Tabs
              centered
              value={value}
              textColor="primary"
              indicatorColor="primary"
              className="stake-tab-buttons"
              onChange={(_event, newValue) => {
                // console.log("newValue", newValue);
                rePageOnDev()
                setValue(newValue);
				        setFlag(true);
              }}
              aria-label="stake tabs"
              //hides the tab underline sliding animation in while <Zoom> is loading
            >
              <TabOption label={"Invite users"} />
              <TabOption label={"All subordinate users"} />
            </Tabs>
          </TabsHeader>
          <ScTotal>{queryType} total: {data.tokenAmountTotal.toFixed(4)}</ScTotal>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCellOption key={column.id} align={column?.align}>
                      {column.label}
                    </TableCellOption>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingStatus.search ? (
                  <LoginBox><CircularProgress /></LoginBox>
                ) : (
                  data.data.map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        {columns.map((column) => {
                          const value = row[column.id] ?? "";
                          let newValue = value;
                          let handleClick = undefined;
                          let style: CSSProperties | undefined = undefined;
                          switch (column.id) {
                            case "address":
                              handleClick = () => {
                                copy(value);
                              };
                              style = { cursor: "pointer" };
                              newValue =
                                value.slice(0, 6) +
                                "..." +
                                value.slice(value.length - 6);
                              break;

                            case "tokenBalance":
                              newValue = (Number(value) || 0).toFixed(4);
                              break;
                            default:
                              break;
                          }

                          return (
                            <TableCellOption
                              style={style}
                              onClick={handleClick}
                              key={column.id}
                              align={column?.align}
                            >
                              {newValue}
                            </TableCellOption>
                          );
                        })}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={data.totalCount}
            rowsPerPage={data.pageSize}
            page={data.pageNo - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={"Rows per page:"}
          />
        </PaperCard>
      </Zoom>
    </Main>
  );
}

export default QueryInvitedUsers;
