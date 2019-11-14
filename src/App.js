import React from "react"
import { Route, BrowserRouter as Router, Switch } from "react-router-dom"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import NotFound from "./components/NotFound"

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </>
  )
}

export default App
