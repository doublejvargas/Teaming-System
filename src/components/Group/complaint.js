import { Button, Modal, Form } from "react-bootstrap";
import React, { useState } from "react";
import { GroupDetail } from "../Group/detail";
import { withAuthUser } from "../Session";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import { tabooWords } from "../../constants/data";
import { TabooSystem } from "../tabooSystem/taboo";
const ComplaintModalBase = ({
  groupData,
  firebase,
  showComplain,
  authUser,
}) => {
  const [showModal, setShowModal] = useState(showComplain);
  const [reason, setReason] = useState("");
  const handleShow = () => setShowModal(!showModal);

  const handleConfirm = () => {
    const groupRef = firebase.group().doc(groupData.id);
    let newReason = reason;
    const tabooSaid = [];
    tabooWords.forEach((word) => {
      let oldReason = newReason;
      newReason = newReason.split(word).join("***");
      if (newReason != oldReason) tabooSaid.push(word);
    });
    if (tabooSaid.length > 0 && authUser) {
      TabooSystem(firebase, authUser, tabooSaid);
    }
    firebase
      .complain()
      .add({
        name: groupData.name,
        groupRef,
        reason: newReason,
        createdAt: new Date(),
        solved: false,
      });
    handleShow();
    alert("success!!");
  };

  return (
    <div>
      <Modal show={showModal} onHide={handleShow} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>File a complain</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              as="textarea"
              placeholder="please enter your reason"
              onChange={(event) => setReason(event.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleShow}>
            Cancle
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export const ComplaintModal = compose(
  withAuthUser,
  withFirebase
)(ComplaintModalBase);