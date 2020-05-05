import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { UserDetail } from "../User/userDetail";
import { Button } from "react-bootstrap";
import { ComplaintsList } from "./complaints";
import { ComplimentList } from "./compliments";
class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = { list: [], toggle: "registration" };
    this.pendingListSubcriber = null;
  }

  componentDidMount() {
    this.pendingListSubcriber = this.props.firebase
      .getPendingUsers()
      .onSnapshot((users) => {
        this.setState({ list: [] });
        if (!users.empty) {
          users.forEach((user) => {
            this.setState((prev) => ({ list: [...prev.list, user.data()] }));
          });
        }
      });
  }

  componentWillUnmount() {
    this.pendingListSubcriber();
  }

  Registration = () => {
    const { list } = this.state;
    return list.map((user) => (
      <UserDetail
        userData={user}
        pendingUser={true}
        firebase={this.props.firebase}
      />
    ));
  };

  toggleChange = (event) => {
    const value = event.target.value;
    this.setState({ toggle: value });
  };

  ConditionalRender = () => {
    const { toggle } = this.state;
    if (toggle === "registration") return <this.Registration />;
    else if (toggle === "complaints")
      return <ComplaintsList firebase={this.props.firebase} />;
    else if (toggle === "compliments")
      return <ComplimentList firebase={this.props.firebase} />;
  };

  render() {
    return (
      <div>
        <Button onClick={this.toggleChange} variant="info" value="registration">
          registration
        </Button>{" "}
        <Button onClick={this.toggleChange} variant="info" value="complaints">
          complaints
        </Button>{" "}
        <Button onClick={this.toggleChange} variant="info" value="compliments">
          compliments
        </Button>{" "}
        <this.ConditionalRender />
      </div>
    );
  }
}
const AdminPage = () => (
  <div>
    <h1>Admin</h1>
    <p>
      Restricted area! Only users with the admin role are authorized.
    </p>
  </div>
);

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.ADMIN];

export default withAuthorization(condition)(AdminPage);