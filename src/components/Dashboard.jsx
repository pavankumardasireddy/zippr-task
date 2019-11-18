import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import axios from "axios"
import { Link } from "react-router-dom"
import { makeStyles } from "@material-ui/core/styles"
import {
  Table,
  Grid,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button
} from "@material-ui/core"

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy)
}

const headCells = [
  {
    id: "ulbName",
    numeric: false,
    disablePadding: true,
    label: "ULB"
  },
  {
    id: "parcelsCount",
    numeric: true,
    disablePadding: false,
    label: "Parcels"
  },
  { id: "buildings", numeric: true, disablePadding: false, label: "Buildings" },
  { id: "portions", numeric: true, disablePadding: false, label: "Portions" },
  { id: "agents", numeric: true, disablePadding: false, label: "Agents" }
]

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  table: {
    minWidth: 750
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  tableWrapper: {
    overflowX: "auto"
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}))

export default function EnhancedTable() {
  const classes = useStyles()
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("calories")
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [rows, setRows] = useState([])
  const [districts, setDistrics] = useState([])
  const [agencies, setAgencies] = useState([])

  useEffect(() => {
    const fetchReports = async () => {
      const result = await axios("http://localhost:3002/reports")
      setRows(result.data)
    }
    const fetchDistricts = async () => {
      const result = await axios("http://localhost:3002/districts")
      setDistrics(result.data)
    }
    const fetchAgencies = async () => {
      const result = await axios("http://localhost:3002/agencies")
      setAgencies(result.data)
    }
    fetchReports()
    fetchDistricts()
    fetchAgencies()
  }, [])

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === "desc"
    setOrder(isDesc ? "asc" : "desc")
    setOrderBy(property)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = name => selected.indexOf(name) !== -1

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

  return (
    <div className={classes.roots}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            className={classes.paper}
            style={{ backgroundColor: "#d16d36", color: "white" }}
          >
            ULB REPORT
            <Link to="/">
              <Button style={{ float: "right", color: "white" }}>Logout</Button>
            </Link>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} sm md={4}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="district-select">Agencies</InputLabel>
            <Select labelId="district-select" id="district">
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="all">All Agencies</MenuItem>
              {agencies.map(agency => {
                return (
                  <MenuItem value={agency.value} key={agency.id}>
                    {agency.name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm md={4}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="district-select">Districts</InputLabel>
            <Select labelId="district-select" id="district">
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="all">All Districts</MenuItem>
              {districts.map(district => {
                return (
                  <MenuItem value={district.value} key={district.id}>
                    {district.name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm md={4}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">
              Lifetime
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.ulbName)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.ulbName}
                      selected={isItemSelected}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.ulbName}
                      </TableCell>
                      <TableCell align="right">{row.parcelsCount}</TableCell>
                      <TableCell align="right">{row.buildings}</TableCell>
                      <TableCell align="right">{row.portions}</TableCell>
                      <TableCell align="right">{row.agents}</TableCell>
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  )
}
