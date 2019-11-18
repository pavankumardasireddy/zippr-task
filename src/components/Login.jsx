import React from "react"
import {
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container
} from "@material-ui/core"
import withStyles from "@material-ui/core/styles/withStyles"
import { Link } from "react-router-dom"

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
})

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      credentials: {
        email: "",
        password: ""
      }
    }
  }

  onChangeHandler = name => event => {
    var value = event.target.value ? event.target.value : ""
    this.setState(
      state => {
        state.credentials[name] = value
      },
      () => {
        console.log("state values: ", this.state.credentials)
      }
    )
  }

  render() {
    const { classes } = this.props
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={this.onChangeHandler("email")}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={this.onChangeHandler("password")}
            />
            <Link to="/dashboard">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Log In
              </Button>
            </Link>
          </form>
        </div>
      </Container>
    )
  }
}

export default withStyles(styles)(Login)
